import { useEffect, useState } from 'react';

import FloatingLabelField from '../common/FloatingLabelField.jsx';
import FormAlert from '../common/FormAlert.jsx';

const defaultState = {
  name: '',
  description: ''
};

export default function NewsletterCategoryManager({
  categories,
  errorMessage,
  onCreate,
  onDelete,
  onUpdate,
  submitting,
  successMessage
}) {
  const [form, setForm] = useState(defaultState);
  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [categories.length]);

  const resetForm = () => {
    setForm(defaultState);
    setEditingCategoryId('');
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Category name must be at least 2 characters.';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (editingCategoryId) {
      await onUpdate(editingCategoryId, {
        name: form.name.trim(),
        description: form.description.trim()
      });
    } else {
      await onCreate({
        name: form.name.trim(),
        description: form.description.trim()
      });
    }

    resetForm();
  };

  return (
    <aside className="admin-panel-soft space-y-5 p-6">
      <div>
        <p className="admin-label">Categories</p>
        <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-white">
          Newsletter categories
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">
          Create and rename categories used in the newsletter sidebar and admin form.
        </p>
      </div>

      <FormAlert message={errorMessage} />
      <FormAlert message={successMessage} type="success" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FloatingLabelField
          error={errors.name}
          id="newsletterCategoryName"
          label="Category Name"
          name="name"
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          value={form.name}
        />
        <FloatingLabelField
          id="newsletterCategoryDescription"
          label="Description"
          name="description"
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          textarea
          value={form.description}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="admin-btn-primary" disabled={submitting} type="submit">
            {submitting
              ? editingCategoryId
                ? 'Saving Category...'
                : 'Creating Category...'
              : editingCategoryId
                ? 'Update Category'
                : 'Create Category'}
          </button>
          <button className="admin-btn-secondary" onClick={resetForm} type="button">
            {editingCategoryId ? 'Cancel Edit' : 'Clear'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {categories.length ? (
          categories.map((category) => (
            <div
              className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4"
              key={category._id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{category.name}</p>
                  {category.description ? (
                    <p className="mt-2 text-xs leading-6 text-[#a0a0a0]">{category.description}</p>
                  ) : (
                    <p className="mt-2 text-xs leading-6 text-[#666666]">No description added yet.</p>
                  )}
                </div>
                <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                  {category.usageCount || 0} used
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  className="admin-btn-secondary"
                  onClick={() => {
                    setEditingCategoryId(category._id);
                    setForm({
                      name: category.name || '',
                      description: category.description || ''
                    });
                  }}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="admin-btn-secondary text-red-300 hover:text-red-200"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete "${category.name}"? This only works when no newsletters are still using it.`
                      )
                    ) {
                      void onDelete(category._id);
                    }
                  }}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 px-4 py-5 text-sm text-[#a0a0a0]">
            No categories created yet.
          </div>
        )}
      </div>
    </aside>
  );
}
