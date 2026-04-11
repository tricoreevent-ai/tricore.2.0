import mongoose from 'mongoose';

const newsletterCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

newsletterCategorySchema.index({ slug: 1 }, { unique: true });

export const NewsletterCategory = mongoose.model('NewsletterCategory', newsletterCategorySchema);
