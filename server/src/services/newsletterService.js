import mongoose from 'mongoose';

import { Newsletter } from '../models/Newsletter.js';
import { persistImageReference } from './imageStorageService.js';

const normalizeText = (value) => String(value || '').trim();
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

const featuredImageOptions = {
  folder: 'newsletter-featured',
  filenamePrefix: 'newsletter-featured',
  maxWidth: 1600,
  quality: 82
};

const contentImageOptions = {
  folder: 'newsletter-content',
  filenamePrefix: 'newsletter-content',
  maxWidth: 1600,
  quality: 82
};

const decodeHtmlEntities = (value) =>
  String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

export const slugifyNewsletterValue = (value) =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const isValidImageReference = (value) => {
  const normalized = normalizeText(value);

  if (!normalized) {
    return true;
  }

  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(normalized)) {
    return true;
  }

  if (/^\/uploads\//.test(normalized)) {
    return true;
  }

  try {
    const url = new URL(normalized);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const splitCategoryQuery = (value) =>
  normalizeText(value)
    .split(',')
    .map((entry) => normalizeText(entry))
    .filter(Boolean);

export const escapeRegex = (value) =>
  String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const stripHtmlToText = (value) =>
  decodeHtmlEntities(
    String(value || '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|blockquote)>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

export const buildNewsletterSummary = (summary, contentText, maxLength = 220) => {
  const explicitSummary = normalizeText(summary).replace(/\s+/g, ' ');

  if (explicitSummary) {
    return explicitSummary.slice(0, maxLength).trim();
  }

  const text = normalizeText(contentText).replace(/\s+/g, ' ');

  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  const clipped = text.slice(0, maxLength);
  const lastSpaceIndex = clipped.lastIndexOf(' ');
  return `${(lastSpaceIndex > 100 ? clipped.slice(0, lastSpaceIndex) : clipped).trim()}...`;
};

export const buildPublishedNewsletterMatch = (referenceDate = new Date()) => ({
  status: 'published',
  publicationDate: {
    $ne: null,
    $lte: referenceDate
  }
});

const contentImagePattern = /(<img\b[^>]*?\bsrc\s*=\s*)(["'])(data:image\/[a-zA-Z0-9.+-]+;base64,[^"']+)\2/gi;

export const persistNewsletterContentImages = async (content) => {
  let nextContent = String(content || '');
  const matches = [...nextContent.matchAll(contentImagePattern)];
  const uniqueDataUrls = [...new Set(matches.map((match) => match[3]).filter(Boolean))];

  for (const [index, dataUrl] of uniqueDataUrls.entries()) {
    const persistedUrl = await persistImageReference(dataUrl, {
      ...contentImageOptions,
      filenamePrefix: `newsletter-content-${index + 1}`
    });
    nextContent = nextContent.split(dataUrl).join(persistedUrl);
  }

  return nextContent;
};

export const persistNewsletterFeaturedImage = async (value) =>
  persistImageReference(value, featuredImageOptions);

export const buildUniqueNewsletterSlug = async (title, excludeId = null) => {
  const baseSlug = slugifyNewsletterValue(title) || 'newsletter';
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await Newsletter.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: new mongoose.Types.ObjectId(excludeId) } } : {})
    })
      .select('_id')
      .lean();

    if (!existing) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
};

const resolvePublicationDate = (payload = {}, existingNewsletter = null) => {
  const nextStatus = payload.status || existingNewsletter?.status || 'draft';
  const publicationProvided = hasOwn(payload, 'publicationDate');
  const rawPublicationDate = publicationProvided
    ? normalizeText(payload.publicationDate)
    : null;

  if (publicationProvided) {
    if (rawPublicationDate) {
      return new Date(rawPublicationDate);
    }

    return nextStatus === 'published' ? new Date() : null;
  }

  if (nextStatus === 'published') {
    return existingNewsletter?.publicationDate || new Date();
  }

  return existingNewsletter?.publicationDate || null;
};

export const prepareNewsletterPayload = async (payload = {}, existingNewsletter = null) => {
  const title = hasOwn(payload, 'title') ? normalizeText(payload.title) : existingNewsletter?.title || '';
  const rawContent = hasOwn(payload, 'content') ? payload.content : existingNewsletter?.content || '';
  const content = await persistNewsletterContentImages(rawContent);
  const contentText = stripHtmlToText(content);
  const summarySource = hasOwn(payload, 'summary')
    ? payload.summary
    : hasOwn(payload, 'content')
      ? ''
      : existingNewsletter?.summary || '';
  const featuredImage = hasOwn(payload, 'featuredImage')
    ? await persistNewsletterFeaturedImage(payload.featuredImage)
    : existingNewsletter?.featuredImage || '';
  const categoryIds = hasOwn(payload, 'categoryIds')
    ? payload.categoryIds
    : existingNewsletter?.categoryIds || [];

  return {
    title,
    slug:
      title && (!existingNewsletter || title !== existingNewsletter.title)
        ? await buildUniqueNewsletterSlug(title, existingNewsletter?._id)
        : existingNewsletter?.slug || (await buildUniqueNewsletterSlug(title || 'newsletter')),
    summary: buildNewsletterSummary(summarySource, contentText),
    content,
    contentText,
    featuredImage,
    categoryIds,
    status: payload.status || existingNewsletter?.status || 'draft',
    publicationDate: resolvePublicationDate(payload, existingNewsletter)
  };
};
