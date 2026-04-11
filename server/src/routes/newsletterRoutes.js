import { Router } from 'express';

import { adminPermissions } from '../constants/adminAccess.js';
import {
  createNewsletter,
  createNewsletterCategory,
  deleteNewsletter,
  deleteNewsletterCategory,
  getAdminNewsletterById,
  getAdminNewsletterCatalog,
  getAdminNewsletterCategories,
  getPublicNewsletterBySlug,
  getPublicNewsletterList,
  updateNewsletter,
  updateNewsletterCategory
} from '../controllers/newsletterController.js';
import { authenticate, authorizePermissions, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createNewsletterCategorySchema,
  createNewsletterSchema,
  newsletterIdSchema,
  newsletterSlugSchema,
  publicNewsletterQuerySchema,
  updateNewsletterCategorySchema,
  updateNewsletterSchema
} from '../validators/newsletterValidation.js';

const router = Router();

router.get('/admin', authenticate, authorizePermissions(adminPermissions.events), getAdminNewsletterCatalog);
router.get(
  '/admin/categories',
  authenticate,
  authorizePermissions(adminPermissions.events),
  getAdminNewsletterCategories
);
router.post(
  '/admin/categories',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(createNewsletterCategorySchema),
  createNewsletterCategory
);
router.put(
  '/admin/categories/:id',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(updateNewsletterCategorySchema),
  updateNewsletterCategory
);
router.delete(
  '/admin/categories/:id',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(newsletterIdSchema),
  deleteNewsletterCategory
);
router.get(
  '/admin/:id',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(newsletterIdSchema),
  getAdminNewsletterById
);

router.get('/', optionalAuthenticate, validate(publicNewsletterQuerySchema), getPublicNewsletterList);
router.get('/:slug', optionalAuthenticate, validate(newsletterSlugSchema), getPublicNewsletterBySlug);

router.post(
  '/',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(createNewsletterSchema),
  createNewsletter
);
router.put(
  '/:id',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(updateNewsletterSchema),
  updateNewsletter
);
router.delete(
  '/:id',
  authenticate,
  authorizePermissions(adminPermissions.events),
  validate(newsletterIdSchema),
  deleteNewsletter
);

export default router;
