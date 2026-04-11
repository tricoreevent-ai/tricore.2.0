import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String,
      required: true,
      default: ''
    },
    contentText: {
      type: String,
      default: ''
    },
    featuredImage: {
      type: String,
      default: ''
    },
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsletterCategory',
        required: true
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    publicationDate: {
      type: Date,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

newsletterSchema.index({ slug: 1 }, { unique: true });
newsletterSchema.index({ status: 1, publicationDate: -1 });
newsletterSchema.index({ categoryIds: 1, status: 1, publicationDate: -1 });

export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
