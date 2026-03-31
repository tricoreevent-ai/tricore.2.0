# TriCore Events — Architecture Document

Last updated: 28 March 2026

---

## 1. Overview

TriCore Events is a CMS-driven event management platform with two faces:

1. **Public website** — Marketing, event discovery, registration. All content managed by admins.
2. **Admin portal** — Section-based CMS for editing pages, managing events, testimonials, and site-wide settings.

Every piece of public-facing content — headlines, images, sections, navigation, footer, colors, fonts — is controlled from the admin portal. No code changes needed to update content.

---

## 2. Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (bcrypt for passwords) |
| Validation | Zod |
| Image Processing | Sharp, Multer |
| Payments | Razorpay |
| Icons | Lucide React |

---

## 3. CMS Model

**Section-based CMS** — not a page builder.

Each page has an ordered array of sections. Each section has:
- A **type** (hero, service-pillars, testimonials, etc.)
- A **data** object (shape depends on type)
- An **enabled** toggle
- An **order** number

Admins can:
- Edit section content through type-specific forms
- Reorder sections via drag-and-drop
- Toggle sections on/off
- Add new sections from available types

The public site renders sections dynamically using a `SectionRenderer` that maps `section.type` to the correct React component.

---

## 4. Project Structure

```
tricore/
├── client/                        # React frontend (Vite)
│   └── src/
│       ├── api/                   # Axios wrappers
│       │   ├── axiosClient.js     # Base instance with interceptors
│       │   ├── contentApi.js      # Public content endpoints
│       │   ├── eventsApi.js       # Public events endpoints
│       │   ├── authApi.js         # Auth endpoints
│       │   ├── adminContentApi.js # Admin CMS CRUD
│       │   ├── uploadApi.js       # Image upload
│       │   ├── registrationApi.js # Registration endpoints
│       │   └── paymentApi.js      # Payment endpoints
│       │
│       ├── hooks/
│       │   ├── usePageContent.js  # Fetch + cache page sections
│       │   ├── useSiteSettings.js # Fetch site settings (nav, footer, theme)
│       │   ├── useEvents.js       # Events with filters
│       │   ├── useAuth.js         # Auth state + token
│       │   ├── useRegistration.js # Registration state + actions
│       │   └── usePayment.js      # Payment flow + Razorpay
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── SiteSettingsContext.jsx
│       │   └── ThemeProvider.jsx   # DB theme → CSS custom properties
│       │
│       ├── components/
│       │   ├── ui/                # Design system primitives
│       │   │   ├── Button.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Textarea.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Skeleton.jsx
│       │   │   ├── ImageUpload.jsx
│       │   │   └── SectionWrapper.jsx
│       │   │
│       │   ├── layout/
│       │   │   ├── PublicLayout.jsx  # Nav + footer wrapper
│       │   │   ├── AdminLayout.jsx  # Sidebar + header
│       │   │   ├── Navbar.jsx       # CMS-driven
│       │   │   ├── Footer.jsx       # CMS-driven
│       │   │   └── MobileMenu.jsx
│       │   │
│       │   ├── sections/            # Public page section renderers
│       │   │   ├── SectionRenderer.jsx
│       │   │   ├── HeroSection.jsx
│       │   │   ├── ServicePillarsSection.jsx
│       │   │   ├── TrustPartnersSection.jsx
│       │   │   ├── FeaturedEventsSection.jsx
│       │   │   ├── TestimonialsSection.jsx
│       │   │   ├── FinalCtaSection.jsx
│       │   │   ├── ContentBlockSection.jsx
│       │   │   ├── TeamSection.jsx
│       │   │   ├── ContactFormSection.jsx
│       │   │   ├── FaqSection.jsx
│       │   │   ├── StatsGridSection.jsx
│       │   │   ├── SportItemCard.jsx
│       │   │   ├── RegistrationForm.jsx
│       │   │   └── PaymentCheckout.jsx
│       │   │
│       │   └── admin/
│       │       ├── PageSectionManager.jsx
│       │       ├── SectionEditor.jsx
│       │       ├── editors/
│       │       │   ├── HeroEditor.jsx
│       │       │   ├── ServicePillarsEditor.jsx
│       │       │   ├── TrustPartnersEditor.jsx
│       │       │   ├── FeaturedEventsEditor.jsx
│       │       │   ├── TestimonialsEditor.jsx
│       │       │   ├── FinalCtaEditor.jsx
│       │       │   ├── ContentBlockEditor.jsx
│       │       │   ├── TeamEditor.jsx
│       │       │   ├── ContactFormEditor.jsx
│       │       │   ├── FaqEditor.jsx
│       │       │   └── StatsGridEditor.jsx
│       │       ├── SiteSettingsForm.jsx
│       │       ├── NavEditor.jsx
│       │       ├── FooterEditor.jsx
│       │       └── ThemeEditor.jsx
│       │
│       ├── pages/
│       │   ├── public/
│       │   │   ├── HomePage.jsx
│       │   │   ├── AboutPage.jsx
│       │   │   ├── CorporateEventsPage.jsx
│       │   │   ├── EventsPage.jsx
│       │   │   ├── EventDetailPage.jsx
│       │   │   ├── RegisterPage.jsx
│       │   │   ├── DashboardPage.jsx
│       │   │   ├── AuthPage.jsx
│       │   │   ├── ContactPage.jsx
│       │   │   └── NotFoundPage.jsx
│       │   └── admin/
│       │       ├── AdminLoginPage.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── PageEditorPage.jsx
│       │       ├── EventsManagerPage.jsx
│       │       ├── EventEditorPage.jsx     # Enhanced with 6 tabs
│       │       ├── SportItemsManagerPage.jsx
│       │       ├── RegistrationsManagerPage.jsx
│       │       ├── RegistrationDetailPage.jsx
│       │       ├── TestimonialsManagerPage.jsx
│       │       ├── SiteSettingsPage.jsx
│       │       └── MediaLibraryPage.jsx
│       │
│       ├── utils/
│       │   ├── fallbackContent.js
│       │   ├── sectionTypes.js
│       │   └── formatters.js
│       │
│       └── constants/
│           └── sectionDefaults.js
│
├── server/
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── db.js
│       │   ├── env.js
│       │   └── cors.js
│       ├── models/
│       │   ├── SiteSettings.js
│       │   ├── PageContent.js
│       │   ├── Event.js
│       │   ├── SportItem.js
│       │   ├── Registration.js
│       │   ├── PublicUser.js
│       │   ├── Testimonial.js
│       │   ├── User.js
│       │   └── MediaAsset.js
│       ├── routes/
│       │   ├── index.js
│       │   ├── publicRoutes.js
│       │   ├── adminRoutes.js
│       │   ├── authRoutes.js
│       │   ├── uploadRoutes.js
│       │   └── registrationRoutes.js
│       ├── controllers/
│       │   ├── publicController.js
│       │   ├── adminContentController.js
│       │   ├── eventsController.js
│       │   ├── registrationController.js
│       │   ├── sportItemController.js
│       │   ├── paymentController.js
│       │   ├── testimonialsController.js
│       │   ├── siteSettingsController.js
│       │   ├── authController.js
│       │   └── uploadController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── roleGuard.js
│       │   ├── validate.js
│       │   └── errorHandler.js
│       ├── validators/
│       │   ├── contentSchemas.js
│       │   ├── eventSchemas.js
│       │   ├── settingsSchemas.js
│       │   └── authSchemas.js
│       ├── services/
│       │   ├── contentService.js
│       │   ├── settingsService.js
│       │   ├── eventsService.js
│       │   ├── uploadService.js
│       │   ├── registrationService.js
│       │   ├── paymentService.js
│       │   └── emailService.js
│       └── utils/
│           └── seedDefaults.js
│
├── docs/
│   ├── ARCHITECTURE.md            # This file
│   ├── DATABASE_SCHEMA.md
│   └── API_REFERENCE.md
│
├── package.json
├── .gitignore
└── CLAUDE.md
```

---

## 5. Data Flow

### Public Site Load

```
Browser → GET /api/content/settings → SiteSettingsContext (theme, nav, footer)
                                        ↓
                                   ThemeProvider sets CSS vars on :root
                                        ↓
       → GET /api/content/pages/home → usePageContent('home')
                                        ↓
                                   SectionRenderer iterates sections
                                        ↓
                                   Each section.type → matching React component
                                        ↓
                                   Page renders with CMS content
```

### Admin Edit Flow

```
Admin → PageEditorPage → GET /api/admin/pages/home
                              ↓
                         PageSectionManager shows all sections
                              ↓
                         Admin clicks Edit on Hero section
                              ↓
                         HeroEditor opens with current data
                              ↓
                         Admin changes headline, uploads image
                              ↓
                         POST /api/upload → returns image URL
                              ↓
                         PUT /api/admin/pages/home/sections/hero-1
                              ↓
                         MongoDB updated
                              ↓
                         Public visitor loads page → sees new headline
```

### Theme Flow

```
Admin changes colors in ThemeEditor
  → PUT /api/admin/settings (theme.colors updated)
  → Public site fetches settings on load
  → ThemeProvider sets CSS custom properties on :root
  → Tailwind classes (bg-primary, text-base, etc.) resolve via var()
  → Entire site reflects new colors without code changes
```

### Registration Flow

```
User clicks "Register" on a sport item
  → Auth check (logged in as PublicUser?)
    → NO  → Auth modal (sign in / create account / Google OAuth)
    → YES → Registration form (varies by type: individual, team, group)
              → Review & confirm (summary + total price)
                → Payment (Razorpay checkout, if price > 0)
                  → Confirmation (registration ID + email confirmation)
                    → Dashboard (view in "My Registrations")
```

---

## 6. Key Design Decisions

### Section-based CMS over page builder
A page builder (drag arbitrary blocks) introduces massive UI complexity and fragile rendering. Section-based means each page has a fixed set of section types available, but admins control content, order, and visibility. Simpler to build, harder to break.

### Mixed type for section data
Each section type has a different shape. Discriminated schemas (one model per type) would create unnecessary complexity. Section data shapes are validated at the API layer using Zod schemas keyed by type. Mongoose `Mixed` type stores them flexibly. Database stays simple, validation stays strict.

### Single SiteSettings document
One document fetched in one call, updated atomically. Maps cleanly to a single admin settings page with tabs. Avoids scattered key-value lookups.

### Dynamic population for events/testimonials
The `featured-events` and `testimonials` sections don't store specific IDs. The public API populates them at read time from their respective collections (filtering by `featured: true`, `status: upcoming`, etc.). Homepage always shows current data without manual re-linking.

### Fallback content
`fallbackContent.js` provides complete defaults for every page. The site is never blank — if CMS data is missing or API fails, defaults render. `seedDefaults.js` on the server seeds initial content on first run so admins can start editing immediately.

---

## 7. Section Types Registry

| Type | Used On | Description |
|------|---------|-------------|
| `hero` | Home | Full-width hero with headline, subheadline, CTAs, background image, stats |
| `service-pillars` | Home | Three service cards (Sports, Corporate, Community) with images |
| `trust-partners` | Home | Why TriCore section with partner cards |
| `featured-events` | Home | Auto-populated from Events collection |
| `testimonials` | Home, About | Auto-populated from Testimonials collection |
| `final-cta` | Home, Corporate | Full-width CTA with background image |
| `content-block` | About, Corporate | Generic heading + body + image block |
| `team` | About | Team members grid |
| `contact-form` | Contact | Configurable contact form |
| `faq` | Any | Expandable Q&A section |
| `stats-grid` | Any | Grid of stat numbers with labels |

New section types can be added by:
1. Adding the type to the enum in `PageContent` model
2. Creating a `XxxSection.jsx` renderer component
3. Creating a `XxxEditor.jsx` admin form
4. Registering in `SectionRenderer.jsx` mapping
5. Adding Zod validation in `contentSchemas.js`

---

## 8. Authentication & Authorization

### Admin Auth
- **JWT tokens** issued on login, sent via `Authorization: Bearer` header
- **Two roles**: `admin` (full access), `editor` (content editing only)
- **Middleware chain**: `auth.js` verifies JWT → `roleGuard.js` checks role
- **Public routes** have no auth middleware
- **Admin routes** require auth + admin role
- **Upload routes** require auth (any role)

### Public User Auth (participants)
- **Separate collection**: `PublicUser` — not the same as admin `User`
- **JWT tokens**: issued on login, scoped to public user; separate from admin tokens
- **Google OAuth**: one-click sign in via Google, stores `googleId` on PublicUser
- **Email verification**: `emailVerified` flag, verification email sent on signup
- **Auth methods**: email + password, Google OAuth
- **Protected public routes**: registration endpoints, dashboard, and payment routes require public user auth

---

## 9. Image Handling

- **Upload**: Multer receives file → Sharp resizes (max 1920px width) + converts to WebP → stored in `server/uploads/` (dev) or cloud storage (prod)
- **MediaAsset** model tracks all uploads (filename, URL, size, uploader)
- **Usage**: All image fields in section data store URL strings
- **Media Library**: Admin can browse, search, and delete uploaded images
- **Production**: Swap `uploadService.js` internals to S3/Cloudinary — rest of system unchanged

---

## 10. Implementation Phases

### Phase 1: Project Scaffold + DB + Basic API
Root workspace, Vite + Tailwind client, Express server, all Mongoose models, auth middleware, public routes returning seed data, `seedDefaults.js`.

### Phase 2: Public Homepage with CMS Data
SiteSettingsContext, ThemeProvider, PublicLayout (CMS-driven Navbar + Footer), all 6 homepage section components matching the design, SectionRenderer, responsive (390px / 768px / 1440px).

### Phase 3: Admin Portal + Section Editors
Admin auth, AdminLayout with sidebar, PageEditorPage + PageSectionManager, all 11 section editor forms, SiteSettingsPage, EventsManagerPage, TestimonialsManagerPage, MediaLibraryPage.

### Phase 4: Remaining Public Pages
About, Corporate Events, Events listing, Event detail, Contact pages. Additional section components. Extended seed defaults.

### Phase 5: Theme/Branding Polish
ThemeEditor with color pickers + live preview, dynamic Google Fonts loading, full mobile responsiveness audit.

### Phase 6: Optimization + Deployment
Loading skeletons, error boundaries, SEO meta from CMS, lazy-loaded sections, image optimization, API caching, production build config.

### Phase 7: Event Detail Page + Sport Items
Enhanced Event model (schedule, rules, prizes, contacts, sponsors). SportItem model and CRUD. Event Detail page (public) with tabbed layout (About, Sport Items, Schedule, Rules, Contact). Admin Sport Items manager within event editor.

### Phase 8: Registration System
PublicUser model + auth (email/password + Google OAuth). Registration model and CRUD. Registration forms for individual, team, and group types. Auth modal for unauthenticated users. Admin Registrations manager with filters, approve/reject, CSV export.

### Phase 9: Payment Integration (Razorpay)
Razorpay integration (create order → checkout modal → verify signature). Payment status tracking on registrations. Cart-based multi-sport checkout. Free event bypass. Payment receipts via email.

### Phase 10: User Dashboard + Notifications
User dashboard with registration list, upcoming events, and stats. Registration detail view and cancel flow. Email notifications (confirmation, approval, rejection, reminders). Event reminder emails (1 day before).

---

## 11. Admin Event Management Screens

### Event Editor Enhanced
The existing event editor gains 6 tabs:
- **Basic Info** — existing fields (title, description, dates, venue, status, images)
- **Sport Items** — add/edit/reorder sport items with type, capacity, pricing, rules
- **Schedule** — add/edit/reorder schedule entries (time + title + description)
- **Rules & Prizes** — rich text editors for event-level rules and prize information
- **Contacts** — event coordinator cards (name, role, phone, email)
- **Sponsors** — sponsor entries (name, logo URL, website URL)

### Sport Items Manager
Accessible from the Event Editor "Sport Items" tab. Allows admins to:
- Add sport items (name, registration type, capacity, pricing, age/gender rules)
- Reorder sport items via drag-and-drop
- Toggle item status (open / closed / cancelled)
- View current registration count per item

### Registrations Manager
New admin sidebar item. Data table with filters:
- Filter by event, sport item, status (pending / confirmed / waitlisted / cancelled / rejected), payment status
- Columns: participant/team name, sport item, registration type, status, payment status, date
- Bulk actions: approve, reject
- Export registrations as CSV

### Registration Detail
Drill-down from Registrations Manager. Shows:
- Full participant/team/group details
- Payment history and transaction ID
- Registration timeline (created, approved, paid)
- Admin actions: approve, reject (with reason), add internal notes
