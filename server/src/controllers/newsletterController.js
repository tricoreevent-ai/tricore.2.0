import mongoose from 'mongoose';

import { Newsletter } from '../models/Newsletter.js';
import { NewsletterCategory } from '../models/NewsletterCategory.js';
import { recordActivity } from '../services/activityLogService.js';
import {
  buildPublishedNewsletterMatch,
  buildUniqueNewsletterSlug,
  escapeRegex,
  prepareNewsletterPayload,
  slugifyNewsletterValue,
  splitCategoryQuery
} from '../services/newsletterService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const normalizeText = (value) => String(value || '').trim();
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

const populateNewsletterCategories = (query) =>
  query.populate('categoryIds', 'name slug description createdAt updatedAt');

const sortByName = (left, right) =>
  String(left?.name || '').localeCompare(String(right?.name || ''), 'en', {
    numeric: true,
    sensitivity: 'base'
  });

const serializeCategory = (category, usageCount = null) => ({
  _id: String(category?._id || ''),
  name: category?.name || '',
  slug: category?.slug || '',
  description: category?.description || '',
  ...(usageCount === null ? {} : { usageCount })
});

const serializeNewsletter = (newsletter) => {
  const categories = Array.isArray(newsletter?.categoryIds)
    ? newsletter.categoryIds.map((category) => serializeCategory(category))
    : [];

  return {
    _id: String(newsletter?._id || ''),
    title: newsletter?.title || '',
    slug: newsletter?.slug || '',
    summary: newsletter?.summary || '',
    content: newsletter?.content || '',
    contentText: newsletter?.contentText || '',
    featuredImage: newsletter?.featuredImage || '',
    categoryIds: categories.map((category) => category._id),
    categories,
    primaryCategory: categories[0] || null,
    status: newsletter?.status || 'draft',
    publicationDate: newsletter?.publicationDate || null,
    createdAt: newsletter?.createdAt || null,
    updatedAt: newsletter?.updatedAt || null
  };
};

const getCategoryUsageMap = async ({ publishedOnly = false } = {}) => {
  const matchStage = publishedOnly ? buildPublishedNewsletterMatch() : {};
  const counts = await Newsletter.aggregate([
    { $match: matchStage },
    { $unwind: '$categoryIds' },
    {
      $group: {
        _id: '$categoryIds',
        usageCount: { $sum: 1 }
      }
    }
  ]);

  return new Map(counts.map((entry) => [String(entry._id), entry.usageCount]));
};

const getAdminCategories = async () => {
  const [categories, usageMap] = await Promise.all([
    NewsletterCategory.find({}).sort({ name: 1 }).lean(),
    getCategoryUsageMap()
  ]);

  return categories
    .map((category) => serializeCategory(category, usageMap.get(String(category._id)) || 0))
    .sort(sortByName);
};

const getPublicCategories = async () => {
  const usageMap = await getCategoryUsageMap({ publishedOnly: true });
  const usedCategoryIds = [...usageMap.keys()].map((id) => new mongoose.Types.ObjectId(id));

  if (!usedCategoryIds.length) {
    return [];
  }

  const categories = await NewsletterCategory.find({ _id: { $in: usedCategoryIds } })
    .sort({ name: 1 })
    .lean();

  return categories
    .map((category) => serializeCategory(category, usageMap.get(String(category._id)) || 0))
    .sort(sortByName);
};

const ensureCategoryIdsExist = async (categoryIds = []) => {
  const normalizedIds = [...new Set((Array.isArray(categoryIds) ? categoryIds : []).map(String))].filter(Boolean);

  if (!normalizedIds.length) {
    throw new ApiError(400, 'Select at least one newsletter category.');
  }

  const count = await NewsletterCategory.countDocuments({
    _id: {
      $in: normalizedIds.map((id) => new mongoose.Types.ObjectId(id))
    }
  });

  if (count !== normalizedIds.length) {
    throw new ApiError(400, 'One or more newsletter categories do not exist anymore.');
  }
};

const buildCategorySlug = (name) => slugifyNewsletterValue(name).replace(/-/g, '-') || 'newsletter-category';

const ensureUniqueCategorySlug = async (name, excludeId = null) => {
  const slug = buildCategorySlug(name);
  const existing = await NewsletterCategory.findOne({
    slug,
    ...(excludeId ? { _id: { $ne: new mongoose.Types.ObjectId(excludeId) } } : {})
  })
    .select('_id')
    .lean();

  if (existing) {
    throw new ApiError(409, 'A newsletter category with this name already exists.');
  }

  return slug;
};

const buildPublicNewsletterMatch = async (query = {}) => {
  const match = buildPublishedNewsletterMatch();
  const categorySlugs = splitCategoryQuery(query.categories);

  if (categorySlugs.length) {
    const categories = await NewsletterCategory.find({ slug: { $in: categorySlugs } })
      .select('_id slug')
      .lean();

    if (!categories.length) {
      match._id = { $in: [] };
      return match;
    }

    match.categoryIds = {
      $in: categories.map((category) => category._id)
    };
  }

  const keyword = normalizeText(query.q);

  if (keyword) {
    const pattern = new RegExp(escapeRegex(keyword), 'i');
    match.$or = [{ title: pattern }, { summary: pattern }, { contentText: pattern }];
  }

  return match;
};

export const getPublicNewsletterList = asyncHandler(async (req, res) => {
  const match = await buildPublicNewsletterMatch(req.query);

  const [items, recentItems, categories] = await Promise.all([
    populateNewsletterCategories(
      Newsletter.find(match).sort({ publicationDate: -1, createdAt: -1 }).lean()
    ),
    populateNewsletterCategories(
      Newsletter.find(buildPublishedNewsletterMatch()).sort({ publicationDate: -1, createdAt: -1 }).limit(4).lean()
    ),
    getPublicCategories()
  ]);

  res.json({
    success: true,
    data: {
      items: items.map((item) => serializeNewsletter(item)),
      recentItems: recentItems.map((item) => serializeNewsletter(item)),
      categories,
      totalCount: items.length
    }
  });
});

export const getPublicNewsletterBySlug = asyncHandler(async (req, res) => {
  const identifier = normalizeText(req.params.slug);
  const publicMatch = buildPublishedNewsletterMatch();
  const match = /^[0-9a-fA-F]{24}$/.test(identifier)
    ? {
        ...publicMatch,
        $or: [{ slug: identifier }, { _id: new mongoose.Types.ObjectId(identifier) }]
      }
    : {
        ...publicMatch,
        slug: identifier
      };

  const newsletter = await populateNewsletterCategories(Newsletter.findOne(match).lean());

  if (!newsletter) {
    throw new ApiError(404, 'Newsletter not found.');
  }

  const recentItems = await populateNewsletterCategories(
    Newsletter.find({
      ...buildPublishedNewsletterMatch(),
      _id: { $ne: newsletter._id }
    })
      .sort({ publicationDate: -1, createdAt: -1 })
      .limit(4)
      .lean()
  );

  res.json({
    success: true,
    data: {
      item: serializeNewsletter(newsletter),
      recentItems: recentItems.map((item) => serializeNewsletter(item))
    }
  });
});

export const getAdminNewsletterCatalog = asyncHandler(async (_req, res) => {
  const [items, categories] = await Promise.all([
    populateNewsletterCategories(
      Newsletter.find({})
        .select('title slug summary featuredImage categoryIds status publicationDate createdAt updatedAt contentText')
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean()
    ),
    getAdminCategories()
  ]);

  res.json({
    success: true,
    data: {
      items: items.map((item) => serializeNewsletter(item)),
      categories
    }
  });
});

export const getAdminNewsletterById = asyncHandler(async (req, res) => {
  const newsletter = await populateNewsletterCategories(Newsletter.findById(req.params.id).lean());

  if (!newsletter) {
    throw new ApiError(404, 'Newsletter not found.');
  }

  res.json({
    success: true,
    data: serializeNewsletter(newsletter)
  });
});

export const createNewsletter = asyncHandler(async (req, res) => {
  await ensureCategoryIdsExist(req.body.categoryIds);
  const payload = await prepareNewsletterPayload(req.body);
  const newsletter = await Newsletter.create({
    ...payload,
    createdBy: req.user?._id || null,
    updatedBy: req.user?._id || null
  });

  await recordActivity({
    action: 'create',
    category: 'newsletter',
    details: `Created newsletter "${newsletter.title}" with status ${newsletter.status}.`,
    performedBy: req.user?._id || null,
    subjectId: newsletter._id.toString(),
    subjectType: 'newsletter',
    summary: `Created newsletter "${newsletter.title}".`
  });

  const created = await populateNewsletterCategories(Newsletter.findById(newsletter._id).lean());

  res.status(201).json({
    success: true,
    data: serializeNewsletter(created)
  });
});

export const updateNewsletter = asyncHandler(async (req, res) => {
  const existingNewsletter = await Newsletter.findById(req.params.id);

  if (!existingNewsletter) {
    throw new ApiError(404, 'Newsletter not found.');
  }

  if (hasOwn(req.body, 'categoryIds')) {
    await ensureCategoryIdsExist(req.body.categoryIds);
  }

  const preparedPayload = await prepareNewsletterPayload(req.body, existingNewsletter);
  const updatePayload = {
    ...preparedPayload,
    updatedBy: req.user?._id || null
  };

  if (!updatePayload.slug && updatePayload.title) {
    updatePayload.slug = await buildUniqueNewsletterSlug(updatePayload.title, existingNewsletter._id);
  }

  await Newsletter.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true
  });

  await recordActivity({
    action: 'update',
    category: 'newsletter',
    details: `Updated newsletter "${existingNewsletter.title}".`,
    performedBy: req.user?._id || null,
    subjectId: existingNewsletter._id.toString(),
    subjectType: 'newsletter',
    summary: `Updated newsletter "${existingNewsletter.title}".`
  });

  const updated = await populateNewsletterCategories(Newsletter.findById(req.params.id).lean());

  res.json({
    success: true,
    data: serializeNewsletter(updated)
  });
});

export const deleteNewsletter = asyncHandler(async (req, res) => {
  const newsletter = await Newsletter.findById(req.params.id);

  if (!newsletter) {
    throw new ApiError(404, 'Newsletter not found.');
  }

  await Newsletter.findByIdAndDelete(req.params.id);

  await recordActivity({
    action: 'delete',
    category: 'newsletter',
    details: `Deleted newsletter "${newsletter.title}".`,
    performedBy: req.user?._id || null,
    subjectId: newsletter._id.toString(),
    subjectType: 'newsletter',
    summary: `Deleted newsletter "${newsletter.title}".`
  });

  res.json({
    success: true,
    message: 'Newsletter deleted successfully.'
  });
});

export const getAdminNewsletterCategories = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: await getAdminCategories()
  });
});

export const createNewsletterCategory = asyncHandler(async (req, res) => {
  const name = normalizeText(req.body.name);
  const category = await NewsletterCategory.create({
    name,
    slug: await ensureUniqueCategorySlug(name),
    description: normalizeText(req.body.description)
  });

  await recordActivity({
    action: 'create',
    category: 'newsletter',
    details: `Created newsletter category "${category.name}".`,
    performedBy: req.user?._id || null,
    subjectId: category._id.toString(),
    subjectType: 'newsletter_category',
    summary: `Created newsletter category "${category.name}".`
  });

  res.status(201).json({
    success: true,
    data: serializeCategory(category.toObject(), 0)
  });
});

export const updateNewsletterCategory = asyncHandler(async (req, res) => {
  const category = await NewsletterCategory.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Newsletter category not found.');
  }

  const nextName = normalizeText(req.body.name);
  category.name = nextName;
  category.slug = await ensureUniqueCategorySlug(nextName, category._id);
  category.description = normalizeText(req.body.description);
  await category.save();

  await recordActivity({
    action: 'update',
    category: 'newsletter',
    details: `Updated newsletter category "${category.name}".`,
    performedBy: req.user?._id || null,
    subjectId: category._id.toString(),
    subjectType: 'newsletter_category',
    summary: `Updated newsletter category "${category.name}".`
  });

  const usageCount = await Newsletter.countDocuments({ categoryIds: category._id });

  res.json({
    success: true,
    data: serializeCategory(category.toObject(), usageCount)
  });
});

export const deleteNewsletterCategory = asyncHandler(async (req, res) => {
  const category = await NewsletterCategory.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Newsletter category not found.');
  }

  const usageCount = await Newsletter.countDocuments({ categoryIds: category._id });

  if (usageCount > 0) {
    throw new ApiError(
      409,
      'This category is assigned to one or more newsletters. Remove it from those newsletters before deleting it.'
    );
  }

  await NewsletterCategory.findByIdAndDelete(req.params.id);

  await recordActivity({
    action: 'delete',
    category: 'newsletter',
    details: `Deleted newsletter category "${category.name}".`,
    performedBy: req.user?._id || null,
    subjectId: category._id.toString(),
    subjectType: 'newsletter_category',
    summary: `Deleted newsletter category "${category.name}".`
  });

  res.json({
    success: true,
    message: 'Newsletter category deleted successfully.'
  });
});
