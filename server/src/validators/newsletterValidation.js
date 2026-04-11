import { z } from 'zod';

import { objectIdSchema, optionalTextSchema } from './common.js';
import {
  isValidImageReference,
  slugifyNewsletterValue
} from '../services/newsletterService.js';

const newsletterStatuses = ['draft', 'published'];
const optionalDateSchema = z.string().trim().optional().or(z.literal(''));

const newsletterBodyFields = {
  title: z.string().trim().min(3, 'Newsletter title is required.'),
  summary: z.string().trim().max(300, 'Summary must be 300 characters or fewer.').optional().or(z.literal('')),
  content: z.string().trim().min(1, 'Newsletter content is required.'),
  featuredImage: z
    .string()
    .trim()
    .max(8_000_000)
    .refine(isValidImageReference, 'Featured image must be a valid URL or uploaded image.')
    .optional()
    .or(z.literal('')),
  categoryIds: z.array(objectIdSchema).default([]),
  status: z.enum(newsletterStatuses).optional().default('draft'),
  publicationDate: optionalDateSchema
};

const requireCategoryWhenPublishing = (value, context) => {
  if (value.status === 'published' && !value.categoryIds.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['categoryIds'],
      message: 'Select at least one category before publishing.'
    });
  }
};

const newsletterBodySchema = z.object(newsletterBodyFields);
const createNewsletterBodySchema = newsletterBodySchema.superRefine(requireCategoryWhenPublishing);

const partialNewsletterBodySchema = z.object(newsletterBodyFields).partial();

export const publicNewsletterQuerySchema = z.object({
  query: z.object({
    q: optionalTextSchema,
    categories: optionalTextSchema
  })
});

export const newsletterSlugSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, 'Newsletter identifier is required.')
      .refine((value) => Boolean(slugifyNewsletterValue(value) || /^[0-9a-fA-F]{24}$/.test(value)), {
        message: 'Invalid newsletter identifier.'
      })
  })
});

export const newsletterIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const createNewsletterSchema = z.object({
  body: createNewsletterBodySchema
});

export const updateNewsletterSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: partialNewsletterBodySchema
});

const categoryBodySchema = z.object({
  name: z.string().trim().min(2, 'Category name is required.'),
  description: optionalTextSchema
});

export const createNewsletterCategorySchema = z.object({
  body: categoryBodySchema
});

export const updateNewsletterCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: categoryBodySchema
});
