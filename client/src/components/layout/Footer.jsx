import { Link } from 'react-router-dom';

import AppIcon from '../common/AppIcon.jsx';
import TriCoreLogo from '../common/TriCoreLogo.jsx';
import { contactContent } from '../../data/siteContent.js';
import { getTelephoneHref, getWhatsAppHref } from '../../utils/contactLinks.js';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/corporate-events', label: 'Corporate Events' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
  { to: '/legal', label: 'Legal' }
];

export default function Footer({ marketing = false }) {
  const primaryPhone =
    contactContent.whatsAppPhone ||
    contactContent.partners.flatMap((partner) => partner.phones || [])[0] ||
    '';
  const whatsAppHref = getWhatsAppHref(primaryPhone, contactContent.whatsAppMessage);

  return (
    <footer
      className={
        marketing
          ? 'border-t border-[rgba(212,175,55,0.12)] bg-[#111111]'
          : 'border-t border-slate-200 bg-white'
      }
    >
      <div
        className={`container-shell grid gap-8 ${marketing ? 'py-16 md:grid-cols-[1.15fr_0.8fr_1.05fr]' : 'py-8 md:grid-cols-[1.1fr_0.9fr_1fr]'}`}
      >
        <div>
          <TriCoreLogo
            className="items-center"
            markClassName="h-12 w-12"
            titleClassName={
              marketing
                ? 'font-display text-xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-2xl'
                : undefined
            }
            subtitleClassName={
              marketing
                ? 'text-[10px] uppercase tracking-[0.28em] text-[#d4af37] sm:text-[11px]'
                : undefined
            }
            subtitle="Event Management & Experiences"
          />
          <p className={`mt-4 max-w-md text-sm leading-7 ${marketing ? 'text-[#a0a0a0]' : 'text-slate-600'}`}>
            TriCore Events delivers corporate experiences, sports tournaments, registrations, and
            event operations with partner-led execution and a people-first mindset.
          </p>
          <p className={`mt-3 max-w-md text-sm leading-7 ${marketing ? 'text-[#666666]' : 'text-slate-500'}`}>
            Backed by partners with 20+ years of collective experience in sports and corporate
            event delivery.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className={marketing ? 'public-btn-primary' : 'btn-secondary'} to="/contact">
              Request a Quote
            </Link>
            {whatsAppHref ? (
              <a
                className={marketing ? 'public-btn-whatsapp' : 'btn-whatsapp'}
                href={whatsAppHref}
                rel="noreferrer"
                target="_blank"
              >
                <AppIcon className="h-4 w-4" name="whatsapp" />
                Chat on WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p
            className={
              marketing
                ? 'text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]'
                : 'text-sm font-semibold uppercase tracking-[0.16em] text-brand-orange'
            }
          >
            Explore
          </p>
          <div className="mt-4 grid gap-3">
            {quickLinks.map((link) => (
              <Link
                className={
                  marketing
                    ? 'text-[13px] font-medium text-[#a0a0a0] transition hover:text-white'
                    : 'text-sm font-medium text-slate-600 transition hover:text-brand-blue'
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p
            className={
              marketing
                ? 'text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]'
                : 'text-sm font-semibold uppercase tracking-[0.16em] text-brand-orange'
            }
          >
            Contact
          </p>
          <div className={`mt-4 space-y-4 text-sm ${marketing ? 'text-[#a0a0a0]' : 'text-slate-600'}`}>
            <div>
              <p className={`font-semibold ${marketing ? 'text-white' : 'text-slate-900'}`}>Email</p>
              <a
                className={`mt-1 block ${marketing ? 'hover:text-white' : 'hover:text-brand-blue'}`}
                href={`mailto:${contactContent.email}`}
              >
                {contactContent.email}
              </a>
            </div>
            <div>
              <p className={`font-semibold ${marketing ? 'text-white' : 'text-slate-900'}`}>Website</p>
              <a
                className={`mt-1 block break-all ${marketing ? 'hover:text-white' : 'hover:text-brand-blue'}`}
                href={contactContent.website}
                rel="noreferrer"
                target="_blank"
              >
                {contactContent.website}
              </a>
            </div>
            <div>
              <p className={`font-semibold ${marketing ? 'text-white' : 'text-slate-900'}`}>
                Leadership Contacts
              </p>
              <div className="mt-2 space-y-3">
                {contactContent.partners.map((partner) => (
                  <div key={partner.name}>
                    <p className={`font-semibold ${marketing ? 'text-white' : 'text-slate-900'}`}>
                      {partner.name}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {partner.phones.map((phone) => (
                        <a
                          className={
                            marketing
                              ? 'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm transition hover:text-white'
                              : 'rounded-full bg-slate-50 px-3 py-1.5 text-sm transition hover:bg-brand-mist hover:text-brand-blue'
                          }
                          href={getTelephoneHref(phone)}
                          key={`${partner.name}-${phone}`}
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {whatsAppHref ? (
              <a
                className={
                  marketing
                    ? 'inline-flex items-center gap-2 text-sm font-semibold text-[#9cf1bc] transition hover:text-[#b7f5ce]'
                    : 'inline-flex items-center gap-2 text-sm font-semibold text-[#1f9d52] transition hover:text-[#16803f]'
                }
                href={whatsAppHref}
                rel="noreferrer"
                target="_blank"
              >
                <AppIcon className="h-4 w-4" name="whatsapp" />
                WhatsApp us for quick event inquiries
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
