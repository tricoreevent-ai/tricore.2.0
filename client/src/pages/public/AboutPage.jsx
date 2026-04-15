import { useEffect, useState } from 'react';

import ImageGallerySection from '../../components/common/ImageGallerySection.jsx';
import PageVectorArt from '../../components/common/PageVectorArt.jsx';
import PartnerHighlights from '../../components/common/PartnerHighlights.jsx';
import { getPublicHomePageContent } from '../../api/publicSettingsApi.js';
import {
  aboutHighlights,
  partnerHighlights
} from '../../data/siteContent.js';

export default function AboutPage() {
  const [galleryConfig, setGalleryConfig] = useState(null);

  useEffect(() => {
    const loadGalleryConfig = async () => {
      try {
        const response = await getPublicHomePageContent();
        setGalleryConfig(response || null);
      } catch {
        setGalleryConfig(null);
      }
    };

    loadGalleryConfig();
  }, []);

  return (
    <div className="pb-28">
      <section className="border-b border-[rgba(212,175,55,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
        <div className="container-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div className="max-w-4xl">
              <p className="public-label">About TriCore</p>
              <h1 className="public-title-page mt-5">A new brand backed by experienced event partners</h1>
              <div className="public-accent-line mt-6" />
              <p className="public-copy mt-6 max-w-3xl">{aboutHighlights.intro}</p>
            </div>
            <PageVectorArt className="lg:justify-self-end" variant="community" />
          </div>
        </div>
      </section>

      <div className="container-shell py-16">
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="public-panel p-8">
            <p className="public-label">Vision</p>
            <p className="public-copy mt-5">{aboutHighlights.vision}</p>
          </section>

          <section className="public-panel-soft p-8">
            <p className="public-label">Why Sports Matter</p>
            <p className="public-copy mt-5">{aboutHighlights.sportsBelief}</p>
          </section>
        </div>

        <div className="public-divider" />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="public-panel p-8">
            <p className="public-label">Our Mission</p>
            <h2 className="public-title-card mt-5">Our Mission</h2>
            <div className="mt-6 space-y-4">
              {aboutHighlights.mission.map((item) => (
                <div className="public-panel-ghost p-5" key={item}>
                  <p className="public-copy-small">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="public-panel-soft p-8">
            <p className="public-label">Community</p>
            <h2 className="public-title-card mt-5">Our Commitment to Community</h2>
            <div className="mt-6 space-y-4">
              {aboutHighlights.csr.map((item) => (
                <div className="public-panel-ghost p-5" key={item}>
                  <p className="public-copy-small">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="public-panel-soft mt-10 p-8">
          <p className="public-label">
            {aboutHighlights.organizersTitle}
          </p>
          <p className="public-copy mt-5 max-w-4xl">
            {aboutHighlights.organizersDescription}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {aboutHighlights.organizers.map((organizer) => (
              <div className="public-panel-ghost p-6" key={organizer.name}>
                <h3 className="text-xl font-extrabold text-white">{organizer.name}</h3>
                <p className="public-copy-small mt-2">{organizer.role}</p>
              </div>
            ))}
          </div>
          <p className="public-copy mt-6">
            {aboutHighlights.organizersClosing}
          </p>
        </section>
      </div>

      {galleryConfig?.galleryEnabledAbout ? (
        <ImageGallerySection
          description={galleryConfig.aboutGalleryDescription}
          images={galleryConfig.aboutGalleryImages}
          title={galleryConfig.aboutGalleryTitle}
        />
      ) : null}

      <PartnerHighlights
        partners={partnerHighlights}
        title="Partner Highlights"
      />
    </div>
  );
}
