import { Link } from 'react-router-dom';

import SeoMetadata from '../../components/common/SeoMetadata.jsx';
import { contactContent } from '../../data/siteContent.js';
import { FALLBACK_PAGE_SEO_KEYWORDS } from '../../seo/publicSeo.js';
import { getWhatsAppHref } from '../../utils/contactLinks.js';

const normalizeBaseUrl = (value) =>
  String(value || '')
    .trim()
    .replace(/\/+$/, '');

export default function NotFoundPage() {
  const baseUrl = normalizeBaseUrl(
    contactContent.website ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://www.tricoreevents.online')
  );
  const whatsAppHref = getWhatsAppHref(contactContent.whatsAppPhone, contactContent.whatsAppMessage);

  return (
    <div className="public-theme min-h-screen bg-[#0a0a0a] px-3 py-16 sm:px-6">
      <SeoMetadata
        canonicalUrl={`${baseUrl}/404`}
        description="The requested TriCore Bangalore events page could not be found. Explore events, corporate services, or contact the team for help."
        keywords={FALLBACK_PAGE_SEO_KEYWORDS}
        robots="noindex,nofollow"
        title="Page Not Found | TriCore Events"
      />
      <div className="container-shell">
        <div className="public-panel mx-auto max-w-5xl p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="public-label">
                404
              </p>
              <h1 className="public-title-page mt-5">
                This page isn&apos;t available, but the next step is easy.
              </h1>
              <div className="public-accent-line mt-6" />
              <p className="public-copy mt-6 max-w-2xl">
                The link may be outdated or the page may have moved. You can head back to the
                homepage, browse current events, review corporate services, or contact TriCore for
                help finding the right page.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link className="public-btn-primary" to="/">
                  Return Home
                </Link>
                <Link className="public-btn-secondary" to="/events">
                  View Events
                </Link>
                {whatsAppHref ? (
                  <a className="public-btn-whatsapp" href={whatsAppHref} rel="noreferrer" target="_blank">
                    Chat on WhatsApp
                  </a>
                ) : null}
              </div>
            </div>

            <div className="public-panel-soft p-6 sm:p-8">
              <p className="public-label">
                Helpful links
              </p>
              <div className="mt-5 grid gap-3">
                <Link
                  className="public-panel-ghost px-4 py-4 text-base font-semibold text-white transition hover:text-[#d4af37]"
                  to="/corporate-events"
                >
                  Corporate Events
                </Link>
                <Link
                  className="public-panel-ghost px-4 py-4 text-base font-semibold text-white transition hover:text-[#d4af37]"
                  to="/about"
                >
                  About TriCore
                </Link>
                <Link
                  className="public-panel-ghost px-4 py-4 text-base font-semibold text-white transition hover:text-[#d4af37]"
                  to="/contact"
                >
                  Contact the Team
                </Link>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#a0a0a0]">
                Need help quickly? Email{' '}
                <a className="font-semibold text-[#d4af37]" href={`mailto:${contactContent.email}`}>
                  {contactContent.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
