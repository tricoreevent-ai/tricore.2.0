import { useEffect, useMemo, useRef, useState } from 'react';

import FloatingLabelField from '../common/FloatingLabelField.jsx';
import FormAlert from '../common/FormAlert.jsx';
import RichTextEditor from './RichTextEditor.jsx';
import { readFileAsDataUrl } from '../../utils/readFileAsDataUrl.js';

const defaultState = {
  title: '',
  summary: '',
  featuredImage: '',
  categoryIds: [],
  status: 'draft',
  publicationDate: '',
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
  publicationDate: initialValues?.publicationDate?.slice(0, 10) || ''
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

    if (!form.categoryIds.length) {
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
          Create at least one newsletter category before publishing newsletters.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="xl:col-span-2">
          <FloatingLabelField
            error={errors.title}
            id="newsletterTitle"
            inputRef={titleInputRef}
            label="Title"
            name="title"
            onChange={handleFieldChange}
            required
            value={form.title}
          />
        </div>
        <div className="xl:col-span-2">
          <FloatingLabelField
            error={errors.summary}
            helper="Optional. Leave blank to auto-generate a summary from the newsletter content."
            id="newsletterSummary"
            label="Summary / Excerpt"
            name="summary"
            onChange={handleFieldChange}
            textarea
            value={form.summary}
          />
        </div>
        <div>
          <label className="label" htmlFor="newsletterStatus">
            Status
          </label>
          <select
            className="input"
            id="newsletterStatus"
            name="status"
            onChange={handleFieldChange}
            value={form.status}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="mt-2 text-xs text-[#8a8a8a]">
            Published newsletters without a date use the current date automatically.
          </p>
        </div>
        <div>
          <FloatingLabelField
            helper="Optional. If blank and the status is Published, the current date is used."
            id="newsletterPublicationDate"
            label="Publication Date"
            name="publicationDate"
            onChange={handleFieldChange}
            type="date"
            value={form.publicationDate}
          />
        </div>
        <div className="xl:col-span-2">
          <FloatingLabelField
            error={errors.featuredImage}
            helper="Paste an external image URL or upload a file. Uploaded files are stored on this server."
            id="newsletterFeaturedImage"
            label="Featured Image URL"
            name="featuredImage"
            onChange={handleFieldChange}
            value={form.featuredImage}
          />
        </div>
        <div className="xl:col-span-2">
          <label className="label" htmlFor="newsletterFeaturedImageUpload">
            Upload Featured Image
          </label>
          <input
            accept="image/*"
            className="input"
            id="newsletterFeaturedImageUpload"
            onChange={(event) => {
              void handleFeaturedImageUpload(event.target.files?.[0]);
              event.target.value = '';
            }}
            type="file"
          />
          {form.featuredImage ? (
            <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-3">
              <img
                alt={form.title || 'Newsletter featured preview'}
                className="max-h-64 w-full rounded-[1.25rem] object-cover"
                src={form.featuredImage}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="label mb-1">Categories</p>
            <p className="text-xs text-[#8a8a8a]">
              {selectedCategoryCount
                ? `${selectedCategoryCount} categories selected`
                : 'Choose one or more categories.'}
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="admin-btn-primary"
          disabled={submitting || !categories.length}
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
