import { useState } from 'react';

import { submitContactInquiry } from '../../api/contactApi.js';
import AppIcon from '../../components/common/AppIcon.jsx';
import FormAlert from '../../components/common/FormAlert.jsx';
import PartnerHighlights from '../../components/common/PartnerHighlights.jsx';
import { contactContent, partnerHighlights } from '../../data/siteContent.js';
import { getWhatsAppHref, getTelephoneHref } from '../../utils/contactLinks.js';
import { getApiErrorMessage } from '../../utils/apiErrors.js';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const primaryPhone =
    contactContent.whatsAppPhone ||
    contactContent.partners.flatMap((partner) => partner.phones || [])[0] ||
    '';
  const quickCallHref = primaryPhone ? getTelephoneHref(primaryPhone) : '';
  const whatsAppHref = getWhatsAppHref(primaryPhone, contactContent.whatsAppMessage);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await submitContactInquiry(form);
      setSuccessMessage('Thanks. Your message was sent to the TriCore team.');
      setForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to send your message right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-28 pt-12 sm:pt-16">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div>
              <p className="public-label">
                Reach out
              </p>
              <h1 className="public-title-page mt-5">
                Start with a quick inquiry and we&apos;ll help shape the right event plan
              </h1>
              <div className="public-accent-line mt-6" />
              <p className="public-copy mt-6">
                Have a tournament in mind, a corporate event to plan, or a community format to
                launch? TriCore is backed by partners with real delivery experience, and we&apos;re ready
                to turn your brief into a disciplined, high-energy event experience.
              </p>
            </div>

            <div className="public-panel-soft space-y-5 p-6 sm:p-8">
              <div>
                <p className="public-label">
                  Quick contact
                </p>
                <p className="public-copy mt-4">
                  Share your preferred dates, city, event type, and approximate audience size to
                  speed up the first conversation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {whatsAppHref ? (
                  <a className="public-btn-whatsapp" href={whatsAppHref} rel="noreferrer" target="_blank">
                    <AppIcon className="h-4 w-4" name="whatsapp" />
                    Chat on WhatsApp
                  </a>
                ) : null}
                {quickCallHref ? (
                  <a className="public-btn-secondary" href={quickCallHref}>
                    Call TriCore
                  </a>
                ) : null}
                <a className="public-btn-secondary" href={`mailto:${contactContent.email}`}>
                  Email Us
                </a>
              </div>

              <div className="space-y-4 border-t border-white/8 pt-5 text-sm text-[#a0a0a0]">
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a
                    className="mt-2 block text-base font-extrabold text-white hover:text-[#d4af37]"
                    href={`mailto:${contactContent.email}`}
                  >
                    {contactContent.email}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-white">Website</p>
                  <a
                    className="mt-2 block break-all text-base font-extrabold text-white hover:text-[#d4af37]"
                    href={contactContent.website}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {contactContent.website}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-white">Leadership Contacts</p>
                  <div className="mt-3 space-y-4">
                    {contactContent.partners.map((partner) => (
                      <div key={partner.name}>
                        <p className="font-extrabold text-white">{partner.name}</p>
                        {partner.phones.map((phone) => (
                          <a
                            className="mt-1 block text-base text-[#a0a0a0] transition hover:text-[#d4af37]"
                            href={getTelephoneHref(phone)}
                            key={phone}
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <form className="public-panel space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
            <div>
              <label className="public-form-label" htmlFor="contact-name">
                Name
              </label>
              <input
                className="public-input"
                id="contact-name"
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                value={form.name}
              />
            </div>
            <div>
              <label className="public-form-label" htmlFor="contact-email">
                Email
              </label>
              <input
                className="public-input"
                id="contact-email"
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
                type="email"
                value={form.email}
              />
            </div>
            <div>
              <label className="public-form-label" htmlFor="contact-phone">
                Phone Number <span className="text-[#666666]">(optional)</span>
              </label>
              <input
                className="public-input"
                id="contact-phone"
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="+91 90000 00000"
                type="tel"
                value={form.phone}
              />
            </div>
            <div>
              <label className="public-form-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                className="public-input min-h-40"
                id="contact-message"
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Tell us about the event type, expected dates, city, audience size, and any must-haves."
                required
                value={form.message}
              />
            </div>
            <FormAlert message={errorMessage} />
            <FormAlert message={successMessage} type="success" />
            <button className="public-btn-primary" disabled={submitting} type="submit">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            <p className="public-copy-small">
              We use this form for tournament registrations support, corporate event inquiries,
              sponsorship conversations, and general planning requests.
            </p>
          </form>
        </div>
      </div>
      <PartnerHighlights
        description="Spark 7 Sports Arena and Sarva Horizon continue to shape the venue quality, presentation, and partner experience behind TriCore events."
        partners={partnerHighlights}
        title="Trusted Event Partners"
      />
    </div>
  );
}
