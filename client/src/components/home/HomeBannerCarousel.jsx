import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AppIcon from '../common/AppIcon.jsx';

const AUTO_ADVANCE_MS = 6000;
const videoExtensionPattern = /\.(?:mp4|mpeg|mpg|m4v|mov|ogv|ogg|webm)(?:[?#].*)?$/i;

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

const isVideoMedia = (value) => {
  const normalized = String(value || '').trim();
  return /^data:video\//i.test(normalized) || videoExtensionPattern.test(normalized);
};

const isImageMedia = (value) => {
  const normalized = String(value || '').trim();
  return Boolean(normalized) && !isVideoMedia(normalized);
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

export default function HomeBannerCarousel({ banners, trustIndicators = [] }) {
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

    if (!nextBanner?.imageUrl || isVideoMedia(nextBanner.imageUrl)) {
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
      {isVideoMedia(currentBanner.imageUrl) ? (
        <video
          aria-hidden="true"
          autoPlay
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
          loop
          muted
          playsInline
          preload="metadata"
          src={currentBanner.imageUrl}
        />
      ) : isImageMedia(currentBanner.imageUrl) ? (
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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.86)_0%,rgba(10,10,10,0.52)_46%,rgba(10,10,10,0.9)_100%)]" />

      <div className="container-shell pointer-events-auto relative z-10 py-12 sm:py-14 lg:min-h-[30rem] lg:py-16">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            {currentBanner.badge ? <span className="public-chip-neutral">{currentBanner.badge}</span> : null}
            {hasMultipleBanners ? (
              <span className="public-chip">
                Slide {currentIndex + 1} / {banners.length}
              </span>
            ) : null}
          </div>

          <h1 className="public-title-hero mt-6 max-w-4xl">{currentBanner.title}</h1>
          <div className="public-accent-line mt-6" />

          {currentBanner.description ? (
            <p className="public-copy mt-6 max-w-3xl text-lg">{currentBanner.description}</p>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-4">
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
            <div className="mt-8 grid gap-px bg-[rgba(212,175,55,0.16)] sm:grid-cols-3 xl:max-w-4xl">
              {trustIndicators.map((item) => (
                <div className="bg-[rgba(20,20,20,0.82)] p-4" key={item.title}>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="public-copy-small mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {hasMultipleBanners ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
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
      </div>
    </section>
  );
}
