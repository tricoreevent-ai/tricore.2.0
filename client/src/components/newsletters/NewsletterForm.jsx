import { useEffect, useMemo, useRef, useState } from 'react';

import FloatingLabelField from '../common/FloatingLabelField.jsx';
import FormAlert from '../common/FormAlert.jsx';
import RichTextEditor from './RichTextEditor.jsx';
import { readFileAsDataUrl } from '../../utils/readFileAsDataUrl.js';

const getTodayDateInputValue = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

const defaultState = {
  title: '',
  summary: '',
  featuredImage: '',
  categoryIds: [],
  status: 'draft',
  publicationDate: getTodayDateInputValue(),
  content: '<p></p>'
};

const isValidImageReference = (value) => {
  const normalized = String(value || '').trim();

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

const stripHtml = (value) =>
  String(value || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeInitialValues = (initialValues) => ({
  ...defaultState,
  ...(initialValues || {}),
  categoryIds: Array.isArray(initialValues?.categoryIds)
    ? initialValues.categoryIds
    : [],
  publicationDate: initialValues?.publicationDate?.slice(0, 10) || getTodayDateInputValue()
});

export default function NewsletterForm({
  autoFocusToken,
  categories,
  errorMessage,
  initialValues,
  onCancel,
  onSubmit,
  submitting,
  successMessage
}) {
  const [form, setForm] = useState(normalizeInitialValues(initialValues));
  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    setForm(normalizeInitialValues(initialValues));
    setErrors({});
  }, [initialValues]);

  useEffect(() => {
    if (!initialValues?._id) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      window.requestAnimationFrame(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select?.();
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [autoFocusToken, initialValues?._id]);

  const selectedCategoryCount = useMemo(() => form.categoryIds.length, [form.categoryIds.length]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((entry) => entry !== categoryId)
        : [...current.categoryIds, categoryId]
    }));
    setErrors((current) => {
      if (!current.categoryIds) {
        return current;
      }

      const next = { ...current };
      delete next.categoryIds;
      return next;
    });
  };

  const handleFeaturedImageUpload = async (file) => {
    if (!file) {
      return;
    }

    try {
      const imageUrl = await readFileAsDataUrl(file);
      setForm((current) => ({
        ...current,
        featuredImage: imageUrl
      }));
    } catch (error) {
      setErrors((current) => ({
        ...current,
        featuredImage: error.message || 'Unable to upload the featured image.'
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim() || form.title.trim().length < 3) {
      nextErrors.title = 'Newsletter title must be at least 3 characters.';
    }

    if (!stripHtml(form.content)) {
      nextErrors.content = 'Newsletter content is required.';
    }

    if (form.status === 'published' && !form.categoryIds.length) {
      nextErrors.categoryIds = 'Select at least one category.';
    }

    if (!isValidImageReference(form.featuredImage)) {
      nextErrors.featuredImage = 'Featured image must be a valid URL or uploaded image.';
    }

    if (form.summary && form.summary.trim().length > 300) {
      nextErrors.summary = 'Summary must be 300 characters or fewer.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      featuredImage: form.featuredImage.trim(),
      publicationDate: form.publicationDate || ''
    });
  };

  return (
    <form className="admin-panel space-y-6 p-6" onSubmit={handleSubmit} ref={formRef}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="admin-label">{form._id ? 'Edit Newsletter' : 'Create Newsletter'}</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-white">
            Newsletter publisher
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a0a0a0]">
            Build newsletter content with rich text, a featured image, multiple categories,
            and either a draft or published status.
          </p>
        </div>

        <button className="admin-btn-secondary" onClick={onCancel} type="button">
          Clear Form
        </button>
      </div>

      <FormAlert message={errorMessage} />
      <FormAlert message={successMessage} type="success" />

      {!categories.length ? (
        <div className="rounded-[1.5rem] border border-dashed border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-5 py-4 text-sm text-[#d9d9d9]">
          Drafts can be saved without categories. Create at least one newsletter category before
          publishing a newsletter.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
          <div>
            <p className="label mb-2">Article Details</p>
            <p className="text-sm leading-7 text-[#b8b8b8]">
              Use a clear headline and an optional SEO summary. The summary supports search
              previews and listing snippets, but it is not repeated above the full article body.
            </p>
          </div>
          <FloatingLabelField
            dark
            error={errors.title}
            id="newsletterTitle"
            inputRef={titleInputRef}
            label="Title"
            name="title"
            onChange={handleFieldChange}
            required
            value={form.title}
          />
          <FloatingLabelField
            dark
            error={errors.summary}
            helper="Optional. Used for SEO snippets and newsletter cards. Leave blank to auto-generate one from the article."
            id="newsletterSummary"
            label="Summary / Excerpt"
            name="summary"
            onChange={handleFieldChange}
            textarea
            value={form.summary}
          />
        </section>

        <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
          <div>
            <p className="label mb-2">Publication Settings</p>
            <p className="text-sm leading-7 text-[#b8b8b8]">
              The date starts at today by default, and you can move it to any past or future date
              before publishing.
            </p>
          </div>
          <div>
            <label className="label" htmlFor="newsletterStatus">
              Status
            </label>
            <select
              className="input newsletter-admin-select"
              id="newsletterStatus"
              name="status"
              onChange={handleFieldChange}
              value={form.status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <p className="mt-2 text-xs text-[#b8b8b8]">
              Drafts stay hidden. Published newsletters appear on the website and in search
              discovery links.
            </p>
          </div>
          <FloatingLabelField
            dark
            helper="Starts with today by default. Change it any time."
            id="newsletterPublicationDate"
            label="Publication Date"
            name="publicationDate"
            onChange={handleFieldChange}
            type="date"
            value={form.publicationDate}
          />
        </section>
      </div>

      <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
        <div>
          <p className="label mb-2">Featured Media</p>
          <p className="text-sm leading-7 text-[#b8b8b8]">
            A strong cover image improves readability on the public page and makes search and
            social previews more compelling.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <FloatingLabelField
            dark
            error={errors.featuredImage}
            helper="Paste an external image URL or upload a file. Uploaded files are stored on this server."
            id="newsletterFeaturedImage"
            label="Featured Image URL"
            name="featuredImage"
            onChange={handleFieldChange}
            value={form.featuredImage}
          />
          <div>
            <label className="label" htmlFor="newsletterFeaturedImageUpload">
              Upload Featured Image
            </label>
            <input
              accept="image/*"
              className="input newsletter-admin-file-input"
              id="newsletterFeaturedImageUpload"
              onChange={(event) => {
                void handleFeaturedImageUpload(event.target.files?.[0]);
                event.target.value = '';
              }}
              type="file"
            />
          </div>
        </div>
        {form.featuredImage ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-3">
            <img
              alt={form.title || 'Newsletter featured preview'}
              className="max-h-72 w-full rounded-[1.25rem] object-cover"
              src={form.featuredImage}
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="label mb-1">Categories</p>
            <p className="text-sm leading-7 text-[#b8b8b8]">
              {selectedCategoryCount
                ? `${selectedCategoryCount} categories selected`
                : 'Choose one or more categories to group the article for readers and search engines.'}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-[1.4rem] border px-4 py-3 transition ${
                form.categoryIds.includes(category._id)
                  ? 'border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)]'
                  : 'border-white/10 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              key={category._id}
            >
              <input
                checked={form.categoryIds.includes(category._id)}
                className="mt-1"
                onChange={() => handleCategoryToggle(category._id)}
                type="checkbox"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{category.name}</span>
                {category.description ? (
                  <span className="mt-1 block text-xs leading-5 text-[#a0a0a0]">
                    {category.description}
                  </span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
        {errors.categoryIds ? <FormAlert message={errors.categoryIds} /> : null}
      </section>

      <section className="space-y-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-5">
        <div>
          <p className="label mb-2">Article Body</p>
          <p className="text-sm leading-7 text-[#b8b8b8]">
            Keep the body readable with strong headings, short paragraphs, and one clear story per
            newsletter so the page stays useful for readers and search engines.
          </p>
        </div>
        <RichTextEditor
          error={errors.content}
          helper="Supports bold, italic, underline, strikethrough, alignment, font controls, colors, lists, links, undo/redo, and inline images."
          id="newsletterContent"
          label="Content"
          onChange={(nextValue) =>
            setForm((current) => ({
              ...current,
              content: nextValue
            }))
          }
          value={form.content}
        />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="admin-btn-primary"
          disabled={submitting}
          type="submit"
        >
          {submitting
            ? form._id
              ? 'Saving Newsletter...'
              : 'Creating Newsletter...'
            : form._id
              ? 'Save Newsletter'
              : 'Create Newsletter'}
        </button>
        <button className="admin-btn-secondary" onClick={onCancel} type="button">
          Reset
        </button>
      </div>
    </form>
  );
}
