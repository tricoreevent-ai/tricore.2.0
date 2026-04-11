import { useEffect, useState } from 'react';

import {
  createNewsletter,
  createNewsletterCategory,
  deleteNewsletter,
  deleteNewsletterCategory,
  getAdminNewsletterById,
  getAdminNewsletterCatalog,
  updateNewsletter,
  updateNewsletterCategory
} from '../../api/newsletterApi.js';
import DataTable from '../../components/common/DataTable.jsx';
import FormAlert from '../../components/common/FormAlert.jsx';
import AdminPageShell from '../../components/layout/AdminPageShell.jsx';
import NewsletterCategoryManager from '../../components/newsletters/NewsletterCategoryManager.jsx';
import NewsletterForm from '../../components/newsletters/NewsletterForm.jsx';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { formatDate, formatDateTime } from '../../utils/formatters.js';

const getNewsletterStatusMeta = (newsletter) => {
  if (newsletter.status === 'draft') {
    return {
      label: 'Draft',
      className: 'border-white/10 bg-[rgba(255,255,255,0.06)] text-[#d9d9d9]'
    };
  }

  if (newsletter.publicationDate && new Date(newsletter.publicationDate) > new Date()) {
    return {
      label: 'Scheduled',
      className: 'border-sky-500/20 bg-sky-500/10 text-sky-200'
    };
  }

  return {
    label: 'Published',
    className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
  };
};

export default function AdminNewslettersPage() {
  const [catalog, setCatalog] = useState({ items: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [editFocusToken, setEditFocusToken] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [listError, setListError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [actionNewsletterId, setActionNewsletterId] = useState('');

  const refreshCatalog = async () => {
    setLoading(true);

    try {
      const response = await getAdminNewsletterCatalog();
      setCatalog({
        items: response.items || [],
        categories: response.categories || []
      });
      setListError('');
    } catch (error) {
      setListError(getApiErrorMessage(error, 'Unable to load newsletters right now.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshCatalog();
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      if (editingNewsletter?._id) {
        await updateNewsletter(editingNewsletter._id, payload);
        setFormSuccess('Newsletter updated successfully.');
      } else {
        await createNewsletter(payload);
        setFormSuccess('Newsletter created successfully.');
      }

      setEditingNewsletter(null);
      setEditFocusToken((current) => current + 1);
      await refreshCatalog();
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Unable to save the newsletter.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (newsletter) => {
    setActionNewsletterId(newsletter._id);
    setFormError('');
    setFormSuccess('');

    try {
      const response = await getAdminNewsletterById(newsletter._id);
      setEditingNewsletter(response);
      setEditFocusToken((current) => current + 1);
    } catch (error) {
      setListError(getApiErrorMessage(error, 'Unable to open this newsletter.'));
    } finally {
      setActionNewsletterId('');
    }
  };

  const handleDelete = async (newsletter) => {
    if (!window.confirm(`Delete "${newsletter.title}"? This action cannot be undone.`)) {
      return;
    }

    setActionNewsletterId(newsletter._id);
    setListError('');
    setFormSuccess('');

    try {
      await deleteNewsletter(newsletter._id);
      setFormSuccess('Newsletter deleted successfully.');

      if (editingNewsletter?._id === newsletter._id) {
        setEditingNewsletter(null);
      }

      await refreshCatalog();
    } catch (error) {
      setListError(getApiErrorMessage(error, 'Unable to delete the newsletter.'));
    } finally {
      setActionNewsletterId('');
    }
  };

  const handleCreateCategory = async (payload) => {
    setCategorySubmitting(true);
    setCategoryError('');
    setCategorySuccess('');

    try {
      await createNewsletterCategory(payload);
      setCategorySuccess('Category created successfully.');
      await refreshCatalog();
    } catch (error) {
      setCategoryError(getApiErrorMessage(error, 'Unable to create the category.'));
      throw error;
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleUpdateCategory = async (categoryId, payload) => {
    setCategorySubmitting(true);
    setCategoryError('');
    setCategorySuccess('');

    try {
      await updateNewsletterCategory(categoryId, payload);
      setCategorySuccess('Category updated successfully.');
      await refreshCatalog();
    } catch (error) {
      setCategoryError(getApiErrorMessage(error, 'Unable to update the category.'));
      throw error;
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setCategorySubmitting(true);
    setCategoryError('');
    setCategorySuccess('');

    try {
      await deleteNewsletterCategory(categoryId);
      setCategorySuccess('Category deleted successfully.');
      await refreshCatalog();
    } catch (error) {
      setCategoryError(getApiErrorMessage(error, 'Unable to delete the category.'));
    } finally {
      setCategorySubmitting(false);
    }
  };

  const catalogColumns = [
    {
      key: 'newsletter',
      header: 'Newsletter',
      accessor: (item) => `${item.title || ''} ${item.summary || ''}`,
      cell: (item) => (
        <div className="max-w-[320px]">
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {item.summary || 'No summary added yet.'}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => `${item.status || ''} ${item.publicationDate || ''}`,
      cell: (item) => {
        const meta = getNewsletterStatusMeta(item);

        return (
          <div>
            <span
              className={`inline-flex items-center border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${meta.className}`}
            >
              {meta.label}
            </span>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              {item.publicationDate ? formatDate(item.publicationDate) : 'No date set'}
            </p>
          </div>
        );
      }
    },
    {
      key: 'categories',
      header: 'Categories',
      accessor: (item) => item.categories?.map((category) => category.name).join(' '),
      cell: (item) => (
        <div className="flex max-w-[260px] flex-wrap gap-2">
          {(item.categories || []).map((category) => (
            <span
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600"
              key={category._id}
            >
              {category.name}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      accessor: (item) => item.updatedAt || '',
      cell: (item) => (
        <div className="text-sm text-slate-600">
          <p>{formatDateTime(item.updatedAt)}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
            Created {formatDate(item.createdAt)}
          </p>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      exportable: false,
      cell: (item) => (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="btn-secondary min-h-0 px-4 py-2"
            disabled={actionNewsletterId === item._id}
            onClick={() => void handleEdit(item)}
            type="button"
          >
            {actionNewsletterId === item._id ? 'Opening...' : 'Edit'}
          </button>
          <button
            className="btn-secondary min-h-0 px-4 py-2 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            disabled={actionNewsletterId === item._id}
            onClick={() => void handleDelete(item)}
            type="button"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminPageShell
      description="Create, publish, and organize newsletters for the public website, including rich text content and category management."
      title="Newsletters"
    >
      <div className="space-y-6">
        <FormAlert message={listError} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <NewsletterForm
            autoFocusToken={editFocusToken}
            categories={catalog.categories}
            errorMessage={formError}
            initialValues={editingNewsletter}
            onCancel={() => {
              setEditingNewsletter(null);
              setFormError('');
              setFormSuccess('');
            }}
            onSubmit={handleSubmit}
            submitting={submitting}
            successMessage={formSuccess}
          />

          <NewsletterCategoryManager
            categories={catalog.categories}
            errorMessage={categoryError}
            onCreate={handleCreateCategory}
            onDelete={handleDeleteCategory}
            onUpdate={handleUpdateCategory}
            submitting={categorySubmitting}
            successMessage={categorySuccess}
          />
        </div>

        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Newsletter List
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">All newsletters</h2>
          </div>

          <DataTable
            columns={catalogColumns}
            emptyMessage="No newsletters have been created yet."
            exportFileName="newsletter-catalog.csv"
            loading={loading}
            loadingLabel="Loading newsletters..."
            rowKey="_id"
            rows={catalog.items}
          />
        </section>
      </div>
    </AdminPageShell>
  );
}
