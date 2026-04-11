import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPublicNewsletterBySlug } from '../../api/newsletterApi.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import SeoMetadata from '../../components/common/SeoMetadata.jsx';
import { contactContent } from '../../data/siteContent.js';
import { buildNewsletterSeoKeywords } from '../../seo/publicSeo.js';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { formatDate } from '../../utils/formatters.js';

const normalizeBaseUrl = (value) =>
  String(value || '')
    .trim()
    .replace(/\/+$/, '');

export default function NewsletterDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadNewsletter = async () => {
      setLoading(true);

      try {
        const response = await getPublicNewsletterBySlug(slug);

        if (!ignore) {
          setItem(response.item || null);
          setRecentItems(response.recentItems || []);
          setError('');
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getApiErrorMessage(requestError, 'Unable to load this newsletter right now.'));
          setItem(null);
          setRecentItems([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadNewsletter();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const baseUrl = normalizeBaseUrl(
    contactContent.website ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://www.tricoreevents.online')
  );
  const canonicalUrl = `${baseUrl}/newsletters/${slug}`;
  const seoTitle = item?.title
    ? `${item.title} | TriCore Newsletter`
    : 'TriCore Newsletter | News and Updates';
  const seoDescription = item?.summary
    ? item.summary
    : 'Read TriCore newsletter updates, event stories, announcements, and published highlights.';
  const seoKeywords = useMemo(() => buildNewsletterSeoKeywords(item), [item]);

  if (loading) {
    return (
      <>
        <SeoMetadata
          canonicalUrl={canonicalUrl}
          description={seoDescription}
          keywords={seoKeywords}
          title={seoTitle}
          url={canonicalUrl}
        />
        <LoadingSpinner label="Loading newsletter..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SeoMetadata
          canonicalUrl={canonicalUrl}
          description={seoDescription}
          keywords={seoKeywords}
          title={seoTitle}
          url={canonicalUrl}
        />
        <div className="container-shell py-10">
          <div className="public-panel p-8">
            <h1 className="text-2xl font-bold text-white">Unable to load newsletter</h1>
            <p className="mt-3 text-sm text-red-300">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <div className="container-shell py-10">
        <div className="public-panel p-8">
          <h1 className="text-2xl font-bold text-white">Newsletter not found</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoMetadata
        canonicalUrl={canonicalUrl}
        description={seoDescription}
        image={item.featuredImage}
        keywords={seoKeywords}
        title={seoTitle}
        type="article"
        url={canonicalUrl}
      />

      <div className="container-shell py-6 sm:py-10">
        <div className="mb-5">
          <Link className="public-btn-secondary min-h-0 px-5 py-3" to="/newsletters">
            Back to Newsletters
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="public-panel overflow-hidden">
            {item.featuredImage ? (
              <img alt={item.title} className="max-h-[420px] w-full object-cover" src={item.featuredImage} />
            ) : null}

            <div className="border-b border-[rgba(212,175,55,0.14)] bg-[rgba(212,175,55,0.06)] px-6 py-6 sm:px-8">
              <div className="flex flex-wrap gap-2">
                {(item.categories || []).map((category) => (
                  <span className="public-chip" key={category._id}>
                    {category.name}
                  </span>
                ))}
              </div>
              <p className="public-meta mt-4">{formatDate(item.publicationDate)}</p>
              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{item.title}</h1>
              {item.summary ? (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d9d9d9] sm:text-base">
                  {item.summary}
                </p>
              ) : null}
            </div>

            <div
              className="newsletter-content px-6 py-6 sm:px-8 sm:py-8"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </article>

          <aside className="space-y-5">
            <div className="public-panel-soft p-5">
              <p className="public-label">Published</p>
              <p className="mt-3 text-lg font-bold text-white">{formatDate(item.publicationDate)}</p>
              <div className="mt-5 space-y-2">
                {(item.categories || []).map((category) => (
                  <div
                    className="rounded-[1.2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
                    key={category._id}
                  >
                    <p className="text-sm font-semibold text-white">{category.name}</p>
                    {category.description ? (
                      <p className="mt-1 text-xs leading-5 text-[#8a8a8a]">{category.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="public-panel-soft p-5">
              <p className="public-label">Recent Newsletters</p>
              <div className="mt-4 space-y-4">
                {recentItems.length ? (
                  recentItems.map((newsletter) => (
                    <Link
                      className="block rounded-[1.3rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4 transition hover:border-[rgba(212,175,55,0.22)] hover:bg-[rgba(255,255,255,0.05)]"
                      key={newsletter._id}
                      to={`/newsletters/${newsletter.slug}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
                        {formatDate(newsletter.publicationDate)}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-white">
                        {newsletter.title}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[#8a8a8a]">More newsletters will appear here soon.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
