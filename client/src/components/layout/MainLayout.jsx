import { Outlet, useLocation } from 'react-router-dom';

import SeoMetadata from '../common/SeoMetadata.jsx';
import WhatsAppFloatingButton from '../common/WhatsAppFloatingButton.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import { contactContent } from '../../data/siteContent.js';
import {
  ABOUT_PAGE_SEO_KEYWORDS,
  CONTACT_PAGE_SEO_KEYWORDS,
  CORPORATE_EVENTS_SEO_KEYWORDS,
  EVENT_DETAIL_PAGE_SEO_KEYWORDS,
  EVENT_PAYMENT_PAGE_SEO_KEYWORDS,
  EVENTS_PAGE_SEO_KEYWORDS,
  FALLBACK_PAGE_SEO_KEYWORDS,
  HOME_PAGE_SEO_KEYWORDS,
  LEGAL_PAGE_SEO_KEYWORDS,
  NEWSLETTER_DETAIL_PAGE_SEO_KEYWORDS,
  NEWSLETTERS_PAGE_SEO_KEYWORDS,
  SPONSORSHIP_PAGE_SEO_KEYWORDS
} from '../../seo/publicSeo.js';

const normalizeBaseUrl = (value) =>
  String(value || '')
    .trim()
    .replace(/\/+$/, '');

const HOME_SEO = {
  title: 'TriCore Events Bangalore - Corporate Events, Sports Tournaments, and Cricket Experiences',
  description:
    'TriCore Events is a Bangalore-based event management team backed by partners with 20+ years of collective experience across corporate events, sports tournaments, registrations, scheduling, and on-ground execution.',
  keywords: HOME_PAGE_SEO_KEYWORDS
};

export default function MainLayout() {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const isUtilityPage = pathname === '/dashboard' || pathname.endsWith('/payment');
  const baseUrl = normalizeBaseUrl(
    contactContent.website ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://www.tricoreevents.online')
  );
  const canonicalUrl = pathname === '/' ? `${baseUrl}/` : `${baseUrl}${pathname}`;
  const pageSeo = (() => {
    if (pathname === '/') {
      return HOME_SEO;
    }

    if (pathname === '/about') {
      return {
        title: 'About TriCore Events Bangalore | Corporate Sports Event Partner',
        description:
          'Learn how TriCore Events pairs a new Bangalore-based brand with partner-led experience across sports tournaments, corporate gatherings, and people-first event operations.',
        keywords: ABOUT_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname === '/corporate-events') {
      return {
        title: 'Corporate Events in Bangalore | TriCore Events',
        description:
          'Explore TriCore Bangalore corporate event services backed by partner experience in conferences, team building programs, strategic offsites, AGMs, employee engagement events, and launches.',
        keywords: CORPORATE_EVENTS_SEO_KEYWORDS
      };
    }

    if (pathname === '/events') {
      return {
        title: 'Upcoming Sports and Cricket Events in Bangalore | TriCore Events',
        description:
          'Browse upcoming Bangalore TriCore sports tournaments, cricket events, registration windows, venues, entry fees, and schedules across corporate and community competitions.',
        keywords: EVENTS_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname === '/newsletters') {
      return {
        title: 'TriCore Newsletters and Updates | Bangalore Events',
        description:
          'Read TriCore newsletter updates featuring event highlights, announcements, recaps, and category-based stories from Bangalore corporate and sports event experiences.',
        keywords: NEWSLETTERS_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname.startsWith('/events/') && pathname.endsWith('/payment')) {
      return {
        title: 'Event Payment | TriCore Events Bangalore',
        description: 'Secure payment and proof upload for TriCore Bangalore event registrations.',
        keywords: EVENT_PAYMENT_PAGE_SEO_KEYWORDS,
        robots: 'noindex,nofollow'
      };
    }

    if (pathname.startsWith('/events/')) {
      return {
        title: 'Event Details in Bangalore | TriCore Events',
        description:
          'View TriCore Bangalore event details, registration deadlines, venue information, payment instructions, and participation guidance for the selected tournament.',
        keywords: EVENT_DETAIL_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname.startsWith('/newsletters/')) {
      return {
        title: 'TriCore Newsletter Detail | Bangalore Event Updates',
        description:
          'Read a published TriCore newsletter covering Bangalore event stories, announcements, community highlights, and operational updates.',
        keywords: NEWSLETTER_DETAIL_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname === '/contact') {
      return {
        title: 'Contact TriCore Events Bangalore | Corporate Sports Tournament Planning',
        description:
          'Contact TriCore Events in Bangalore for partner-led corporate event planning, sports tournaments, sponsorship enquiries, and quick WhatsApp support.',
        keywords: CONTACT_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname === '/legal') {
      return {
        title: 'Terms & Conditions and Privacy Policy | TriCore Events',
        description:
          'Read the TriCore Events Terms & Conditions and Privacy Policy covering registrations, refunds, event rules, liability, data use, and grievance contact details.',
        keywords: LEGAL_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname === '/partner-access') {
      return {
        title: 'Sports Event Sponsorships in Bangalore | TriCore Events',
        description:
          'Explore sponsorship opportunities with TriCore Events in Bangalore and connect your brand with corporate sports tournaments, cricket audiences, and community participation.',
        keywords: SPONSORSHIP_PAGE_SEO_KEYWORDS
      };
    }

    if (pathname === '/dashboard') {
      return {
        title: 'User Dashboard | TriCore Events',
        description: 'Registered user dashboard for TriCore Events.',
        keywords: FALLBACK_PAGE_SEO_KEYWORDS,
        robots: 'noindex,nofollow'
      };
    }

    return {
      title: 'TriCore Events',
      description: 'Bangalore corporate sports tournament management, registrations, schedules, and event operations.',
      keywords: FALLBACK_PAGE_SEO_KEYWORDS
    };
  })();

  return (
    <div
      className={
        isUtilityPage
          ? 'min-h-screen overflow-x-clip bg-slate-50'
          : 'public-theme public-marketing-shell min-h-screen overflow-x-clip'
      }
    >
      <SeoMetadata
        canonicalUrl={canonicalUrl}
        description={pageSeo.description}
        keywords={pageSeo.keywords}
        robots={pageSeo.robots}
        title={pageSeo.title}
        url={canonicalUrl}
      />
      <Navbar marketing={!isUtilityPage} />
      <main className={isUtilityPage ? 'min-w-0' : 'public-page min-w-0'}>
        <Outlet />
      </main>
      <Footer marketing={!isUtilityPage} />
      <WhatsAppFloatingButton />
    </div>
  );
}
