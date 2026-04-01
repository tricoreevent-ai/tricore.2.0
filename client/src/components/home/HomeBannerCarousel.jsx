import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AppIcon from '../common/AppIcon.jsx';

const AUTO_ADVANCE_MS = 6000;

const isExternalHref = (href) => /^https?:\/\//i.test(String(href || '').trim());
const isActionProtocolHref = (href) =>
  /^(?:https?:\/\/|mailto:|tel:|\/\/)/i.test(String(href || '').trim());
const looksLikeDomainWithoutProtocol = (href) =>
  /^(?:www\.)[^\s/]+\.[^\s]+/i.test(String(href || '').trim());

const normalizeInternalPathname = (pathname) => {
  const normalizedPathname = `/${String(pathname || '').replace(/^\.?\/*/, '')}`.replace(/\/{2,}/g, '/');
  return normalizedPathname.replace(/^\/event(?=\/|$)/i, '/events');
};

const normalizeActionHref = (href) => {
  const value = String(href || '').trim();

  if (!value) {
    return '';
  }

  if (looksLikeDomainWithoutProtocol(value)) {
    return `https://${value}`;
  }

  if (typeof window !== 'undefined') {
    try {
      const resolvedUrl = new URL(value, window.location.origin);

      if (resolvedUrl.origin === window.location.origin) {
        return `${normalizeInternalPathname(resolvedUrl.pathname)}${resolvedUrl.search}${resolvedUrl.hash}`;
      }

      if (isActionProtocolHref(value)) {
        return resolvedUrl.toString();
      }
    } catch {
      // Fall back to local path normalization below.
    }
  }

  if (isActionProtocolHref(value) || value.startsWith('#')) {
    return value;
  }

  if (value.startsWith('/')) {
    return normalizeInternalPathname(value);
  }

  return normalizeInternalPathname(value);
};

const ActionLink = ({ className, href, label }) => {
  const normalizedHref = normalizeActionHref(href);

  if (!normalizedHref || !label) {
    return null;
  }

  if (isExternalHref(normalizedHref) || /^(?:mailto:|tel:|\/\/)/i.test(normalizedHref)) {
    return (
      <a
        className={className}
        href={normalizedHref}
        rel={/^https?:\/\//i.test(normalizedHref) ? 'noreferrer' : undefined}
        target={/^https?:\/\//i.test(normalizedHref) ? '_blank' : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <Link className={className} to={normalizedHref}>
      {label}
    </Link>
  );
};

export default function HomeBannerCarousel({ banners, expertiseItems, trustIndicators = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentBanner = banners[currentIndex] || banners[0] || null;
  const hasMultipleBanners = banners.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [banners]);

  useEffect(() => {
    if (!hasMultipleBanners) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % banners.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [banners.length, hasMultipleBanners]);

  useEffect(() => {
    if (!banners.length) {
      return;
    }

    const nextBanner = banners[(currentIndex + 1) % banners.length];

    if (!nextBanner?.imageUrl) {
      return;
    }

    const preloadImage = new Image();
    preloadImage.src = nextBanner.imageUrl;
  }, [banners, currentIndex]);

  if (!currentBanner) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-b border-[rgba(212,175,55,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0a0a0a_0%,#0a0a0acc_35%,#0a0a0a_100%)]" />
      {currentBanner.imageUrl ? (
        <img
          alt={currentBanner.imageAlt || currentBanner.title || 'TriCore banner'}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
          decoding="async"
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          src={currentBanner.imageUrl}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.4)_40%,rgba(10,10,10,0.92)_100%)]" />
      <div className="pointer-events-none absolute -right-24 top-12 h-64 w-64 border border-[rgba(212,175,55,0.15)] opacity-40" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-16 w-16 rounded-full border border-[rgba(212,175,55,0.15)] opacity-50" />

      <div className="container-shell pointer-events-auto relative z-10 grid gap-12 py-20 lg:min-h-[46rem] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {currentBanner.badge ? <span className="public-chip-neutral">{currentBanner.badge}</span> : null}
            {hasMultipleBanners ? (
              <span className="public-chip">
                Slide {currentIndex + 1} / {banners.length}
              </span>
            ) : null}
          </div>

          <h1 className="public-title-hero mt-8 max-w-4xl">{currentBanner.title}</h1>
          <div className="public-accent-line mt-8" />

          {currentBanner.description ? (
            <p className="public-copy mt-8 max-w-3xl text-lg">{currentBanner.description}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <ActionLink
              className="public-btn-primary"
              href={currentBanner.primaryActionHref}
              label={currentBanner.primaryActionLabel}
            />
            <ActionLink
              className="public-btn-secondary"
              href={currentBanner.secondaryActionHref}
              label={currentBanner.secondaryActionLabel}
            />
          </div>

          {trustIndicators.length ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:max-w-3xl">
              {trustIndicators.map((item) => (
                <div className="public-panel-ghost p-5" key={item.title}>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="public-copy-small mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {hasMultipleBanners ? (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                aria-label="Show previous banner"
                className="flex h-12 w-12 items-center justify-center border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] text-white transition hover:border-[rgba(212,175,55,0.35)] hover:text-[#d4af37]"
                onClick={() => setCurrentIndex((current) => (current - 1 + banners.length) % banners.length)}
                type="button"
              >
                <AppIcon className="h-4 w-4" name="chevronLeft" />
              </button>
              <button
                aria-label="Show next banner"
                className="flex h-12 w-12 items-center justify-center border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] text-white transition hover:border-[rgba(212,175,55,0.35)] hover:text-[#d4af37]"
                onClick={() => setCurrentIndex((current) => (current + 1) % banners.length)}
                type="button"
              >
                <AppIcon className="h-4 w-4" name="chevronRight" />
              </button>
              <div className="flex items-center gap-2">
                {banners.map((banner, index) => (
                  <button
                    aria-label={`Show banner ${index + 1}: ${banner.title}`}
                    className={`h-2 transition ${
                      index === currentIndex ? 'w-10 bg-[#d4af37]' : 'w-4 bg-white/30 hover:bg-white/60'
                    }`}
                    key={banner.id || banner.title}
                    onClick={() => setCurrentIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="public-panel overflow-hidden">
          {currentBanner.badge || currentBanner.description ? (
            <div className="border-b border-[rgba(212,175,55,0.16)] px-6 py-5 sm:px-8">
              {currentBanner.badge ? <p className="public-label">{currentBanner.badge}</p> : null}
              {currentBanner.description ? (
                <p className="public-copy-small mt-4">{currentBanner.description}</p>
              ) : null}
            </div>
          ) : null}
          <div className="grid gap-px bg-[rgba(212,175,55,0.12)]">
            {expertiseItems.map((benefit, index) => (
              <div className="bg-[#141414] px-6 py-6 sm:px-8" key={benefit.title}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-xl font-extrabold text-white">{benefit.title}</h3>
                <p className="public-copy-small mt-3">{benefit.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
