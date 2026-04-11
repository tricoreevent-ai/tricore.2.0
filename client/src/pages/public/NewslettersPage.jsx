import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getPublicNewsletters } from '../../api/newsletterApi.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { formatDate } from '../../utils/formatters.js';

const buildCategoryParam = (categorySlugs) => categorySlugs.join(',');

const parseCategoryParam = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

export default function NewslettersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [data, setData] = useState({
    items: [],
    recentItems: [],
    categories: [],
    totalCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const selectedCategorySlugs = useMemo(
    () => parseCategoryParam(searchParams.get('categories')),
    [searchParams]
  );

  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      const trimmedSearch = searchInput.trim();

      if (trimmedSearch) {
        nextParams.set('q', trimmedSearch);
      } else {
        nextParams.delete('q');
      }

      if (nextParams.toString() !== searchParams.toString()) {
        setSearchParams(nextParams, { replace: true });
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, searchParams, setSearchParams]);

  useEffect(() => {
    let ignore = false;

    const loadNewsletters = async () => {
      setLoading(true);

      try {
        const response = await getPublicNewsletters({
          q: searchParams.get('q') || '',
          categories: searchParams.get('categories') || ''
        });

        if (!ignore) {
          setData({
            items: response.items || [],
            recentItems: response.recentItems || [],
            categories: response.categories || [],
            totalCount: response.totalCount || 0
          });
          setError('');
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getApiErrorMessage(requestError, 'Unable to load newsletters right now.'));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadNewsletters();

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  const toggleCategory = (categorySlug) => {
    const nextCategories = selectedCategorySlugs.includes(categorySlug)
      ? selectedCategorySlugs.filter((slug) => slug !== categorySlug)
      : [...selectedCategorySlugs, categorySlug];
    const nextParams = new URLSearchParams(searchParams);

    if (nextCategories.length) {
      nextParams.set('categories', buildCategoryParam(nextCategories));
    } else {
      nextParams.delete('categories');
    }

    setSearchParams(nextParams, { replace: true });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="pb-20">
      <section className="border-b border-[rgba(212,175,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
        <div className="container-shell py-14 sm:py-18 lg:py-20">
          <div className="max-w-4xl">
            <p className="public-label">Newsletter</p>
            <h1 className="public-title-page mt-5">Stories, recaps, and updates from TriCore</h1>
            <div className="public-accent-line mt-6" />
            <p className="public-copy mt-6 max-w-3xl">
              Browse published newsletters, search across updates, and explore content by category
              from the right-hand sidebar on desktop or the stacked filter panel on mobile.
            </p>
          </div>
        </div>
      </section>

      <div className="container-shell py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[rgba(212,175,55,0.14)] bg-[rgba(212,175,55,0.06)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {loading ? 'Loading newsletters...' : `${data.totalCount} published newsletters`}
                </p>
                <p className="mt-1 text-sm text-[#a0a0a0]">
                  {selectedCategorySlugs.length || searchParams.get('q')
                    ? 'Filters are active in the sidebar.'
                    : 'Use search or categories to narrow the list.'}
                </p>
              </div>

              {selectedCategorySlugs.length || searchParams.get('q') ? (
                <button className="public-btn-secondary min-h-0 px-5 py-3" onClick={clearFilters} type="button">
                  Clear Filters
                </button>
              ) : null}
            </div>

            {loading ? (
              <LoadingSpinner label="Loading newsletters..." />
            ) : error ? (
              <div className="public-panel p-6">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            ) : data.items.length ? (
              <div className="grid gap-6 xl:grid-cols-2">
                {data.items.map((item) => (
                  <article className="public-panel overflow-hidden" key={item._id}>
                    {item.featuredImage ? (
                      <img
                        alt={item.title}
                        className="h-56 w-full object-cover"
                        src={item.featuredImage}
                      />
                    ) : (
                      <div className="flex h-56 items-end bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.22),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6">
                        <span className="public-chip-neutral">TriCore Newsletter</span>
                      </div>
                    )}

                    <div className="space-y-4 p-6">
                      <div className="flex flex-wrap gap-2">
                        {(item.categories || []).map((category) => (
                          <span className="public-chip" key={category._id}>
                            {category.name}
                          </span>
                        ))}
                      </div>
                      <p className="public-meta">{formatDate(item.publicationDate)}</p>
                      <h2 className="text-2xl font-extrabold text-white">{item.title}</h2>
                      <p className="text-sm leading-7 text-[#a0a0a0]">{item.summary}</p>
                      <Link className="public-btn-primary w-full sm:w-auto" to={`/newsletters/${item.slug}`}>
                        Read Newsletter
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="public-panel p-8">
                <h2 className="text-2xl font-bold text-white">No newsletters found</h2>
                <p className="mt-3 text-sm leading-7 text-[#a0a0a0]">
                  Try a different search keyword or remove one of the selected category filters.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <div className="public-panel-soft p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.08)] text-[#d4af37]">
                  <AppIcon className="h-4 w-4" name="search" />
                </span>
                <div>
                  <p className="public-label">Search</p>
                  <p className="mt-2 text-sm text-[#a0a0a0]">
                    Search across newsletter titles and content.
                  </p>
                </div>
              </div>
              <input
                className="public-input mt-4"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search newsletters"
                value={searchInput}
              />
            </div>

            <div className="public-panel-soft p-5">
              <p className="public-label">Categories</p>
              <div className="mt-4 space-y-3">
                {data.categories.length ? (
                  data.categories.map((category) => (
                    <label
                      className="flex cursor-pointer items-start justify-between gap-3 rounded-[1.2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
                      key={category._id}
                    >
                      <span className="flex items-start gap-3">
                        <input
                          checked={selectedCategorySlugs.includes(category.slug)}
                          className="mt-1"
                          onChange={() => toggleCategory(category.slug)}
                          type="checkbox"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-white">{category.name}</span>
                          {category.description ? (
                            <span className="mt-1 block text-xs leading-5 text-[#8a8a8a]">
                              {category.description}
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="rounded-full border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                        {category.usageCount || 0}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-[#8a8a8a]">No published categories yet.</p>
                )}
              </div>
            </div>

            <div className="public-panel-soft p-5">
              <p className="public-label">Recent</p>
              <div className="mt-4 space-y-4">
                {data.recentItems.length ? (
                  data.recentItems.map((item) => (
                    <Link
                      className="block rounded-[1.3rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4 transition hover:border-[rgba(212,175,55,0.22)] hover:bg-[rgba(255,255,255,0.05)]"
                      key={item._id}
                      to={`/newsletters/${item.slug}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
                        {formatDate(item.publicationDate)}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-white">{item.title}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[#8a8a8a]">Recent newsletters will appear here.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
