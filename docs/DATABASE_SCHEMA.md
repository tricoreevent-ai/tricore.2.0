# TriCore Events — Database Schema

Last updated: 28 March 2026

Database: MongoDB via Mongoose

---

## Collections Overview

| Collection | Purpose | Cardinality |
|-----------|---------|-------------|
| `sitesettings` | Global site config (branding, theme, nav, footer) | Singleton (1 doc) |
| `pagecontents` | CMS content per page (sections array) | 1 per managed page |
| `events` | Event listings | Many |
| `testimonials` | Customer testimonials | Many |
| `users` | Admin/editor accounts | Few |
| `mediaassets` | Uploaded image metadata | Many |
| `sportitems` | Competition/activity units within events | Many per event |
| `registrations` | Participant sign-ups for sport items | Many |
| `publicusers` | Participant accounts (separate from admin users) | Many |

---

## 1. SiteSettings

Single document holding all global site configuration. Fetched once on app load.

```js
{
  branding: {
    siteName:  String    // default: "TriCore Events"
    tagline:   String    // default: ""
    logo: {
      url:     String    // URL to logo image
      altText: String    // default: "TriCore Events"
    }
    favicon:   String    // URL to favicon
  },

  theme: {
    colors: {
      primary:    String  // default: "#C8A961" (gold)
      accent:     String  // default: "#D4AF37"
      background: String  // default: "#0A0A0A"
      surface:    String  // default: "#141414"
      surfaceAlt: String  // default: "#1A1A1A"
      text:       String  // default: "#F5F5F5"
      textMuted:  String  // default: "#9CA3AF"
      border:     String  // default: "#262626"
    },
    fonts: {
      heading: String     // default: "Space Grotesk"
      body:    String     // default: "Space Grotesk"
    }
  },

  navigation: {
    links: [{
      label:      String  // required
      href:       String  // required
      order:      Number  // default: 0
      isExternal: Boolean // default: false
    }],
    ctaButton: {
      label:   String     // default: "Contact Us"
      href:    String     // default: "/contact"
      enabled: Boolean    // default: true
    }
  },

  footer: {
    columns: [{
      title: String,
      links: [{
        label: String,
        href:  String
      }]
    }],
    socialLinks: [{
      platform: String,   // "instagram", "linkedin", "twitter", "whatsapp"
      url:      String
    }],
    bottomText: String    // default: "© 2026 TriCore Events. All rights reserved."
  },

  contact: {
    email:    String,
    phone:    String,
    whatsapp: String,
    address:  String
  },

  timestamps: true        // createdAt, updatedAt
}
```

---

## 2. PageContent

One document per managed page. The `sections` array is the core CMS data structure.

```js
{
  pageSlug: String,       // unique, enum: "home" | "about" | "corporate-events" | "events" | "contact"
  title:    String,       // required — display name for admin
  metaTitle: String,      // SEO <title>
  metaDescription: String,// SEO <meta description>

  sections: [{
    sectionId: String,    // required — stable ID for reordering (e.g., "hero-1")
    type: String,         // required — enum of section types (see below)
    enabled: Boolean,     // default: true
    order: Number,        // required — sort order
    data: Mixed           // required — shape depends on type (see Section Data Shapes)
  }],

  timestamps: true
}
```

### Section Types Enum

```
hero, service-pillars, trust-partners, featured-events, testimonials,
final-cta, content-block, team, contact-form, faq, stats-grid
```

### Section Data Shapes

Each section type has a specific `data` shape. These are validated by Zod at the API layer, not by Mongoose.

#### `hero`
```js
{
  badge:           String,    // e.g., "SPORTS · CORPORATE · COMMUNITY"
  headline:        String,    // Main heading
  subheadline:     String,    // Supporting text
  backgroundImage: String,    // URL
  ctaButtons: [{
    label:   String,
    href:    String,
    variant: "primary" | "outline"
  }],
  stats: [{
    value: String,            // e.g., "150+"
    label: String             // e.g., "EVENTS DELIVERED"
  }]
}
```

#### `service-pillars`
```js
{
  heading:    String,
  subheading: String,
  pillars: [{
    number:      String,      // "01", "02", "03"
    title:       String,
    description: String,
    image:       String,      // URL
    href:        String       // Link destination
  }]
}
```

#### `trust-partners`
```js
{
  heading:    String,
  subheading: String,
  description: String,       // Body text on the left side
  partners: [{
    name:        String,
    description: String,
    icon:        String,      // Lucide icon name
    logo:        String,      // URL (optional)
    url:         String       // External link (optional)
  }]
}
```

#### `featured-events`
```js
{
  heading:      String,
  subheading:   String,
  displayCount: Number,       // How many events to show (default: 3)
  showViewAll:  Boolean       // Show "View All Events" link
}
```
Note: Actual event data is populated at read time from the `events` collection (filtered by `featured: true`, `status: upcoming|active`).

#### `testimonials`
```js
{
  heading:      String,
  subheading:   String,
  displayCount: Number        // How many to show (default: 2)
}
```
Note: Actual testimonial data is populated at read time from the `testimonials` collection (filtered by `enabled: true`, `featured: true`).

#### `final-cta`
```js
{
  heading:         String,
  subheading:      String,
  backgroundImage: String,    // URL
  ctaButtons: [{
    label:   String,
    href:    String,
    variant: "primary" | "outline"
  }]
}
```

#### `content-block`
```js
{
  heading:       String,
  body:          String,      // Rich text (HTML or markdown)
  image:         String,      // URL
  imagePosition: "left" | "right" | "top" | "background",
  ctaButton: {
    label: String,
    href:  String
  } | null
}
```

#### `team`
```js
{
  heading: String,
  members: [{
    name:  String,
    role:  String,
    image: String,            // URL
    bio:   String
  }]
}
```

#### `contact-form`
```js
{
  heading:    String,
  subheading: String,
  fields: [String]            // e.g., ["name", "email", "phone", "company", "message", "eventType"]
}
```

#### `faq`
```js
{
  heading: String,
  items: [{
    question: String,
    answer:   String
  }]
}
```

#### `stats-grid`
```js
{
  heading: String,
  stats: [{
    value: String,            // e.g., "150+"
    label: String,            // e.g., "Events Delivered"
    icon:  String             // Lucide icon name (optional)
  }]
}
```

---

## 3. Event

```js
{
  title:               String,   // required
  slug:                String,   // required, unique (URL-friendly)
  description:         String,   // Full description (rich text / markdown)
  shortDescription:    String,   // Card/listing preview
  category:            String,   // enum: "sports" | "corporate" | "community"
  date:                Date,     // Event start date
  endDate:             Date,     // Event end date
  location:            String,   // City / area
  venue:               String,   // Specific venue name
  image:               String,   // Cover image URL
  gallery:             [String], // Additional image URLs
  status:              String,   // enum: "draft" | "upcoming" | "active" | "completed" | "cancelled"
                                 // default: "draft"
  featured:            Boolean,  // default: false — shown on homepage
  tags:                [String],

  // --- Registration config ---
  registrationConfig: {
    enabled:           Boolean,  // default: false
    opensAt:           Date,     // When registration opens
    closesAt:          Date,     // Registration deadline
    requiresApproval:  Boolean,  // Admin must approve registrations
    allowWaitlist:     Boolean,  // Allow signups after max reached
  },

  sportItems:          [ObjectId],  // ref: SportItem — competition/activity units within this event

  // --- Event detail page fields ---
  schedule: [{
    time:              String,   // e.g., "09:00 AM"
    title:             String,   // e.g., "Opening Ceremony"
    description:       String
  }],

  rules:               String,   // Rich text — event rules & regulations
  prizes:              String,   // Rich text — prize info

  contacts: [{
    name:              String,
    role:              String,   // e.g., "Event Coordinator"
    phone:             String,
    email:             String
  }],

  sponsors: [{
    name:              String,
    logo:              String,   // URL
    url:               String
  }],

  timestamps: true
}
```

### Indexes
- `slug`: unique
- `status` + `featured`: compound (for homepage query)
- `category`: single (for filtered listing)
- `date`: single (for sorting)

---

## 4. Testimonial

```js
{
  name:     String,    // required
  role:     String,    // e.g., "Team Captain"
  company:  String,    // e.g., "TechVista Inc."
  content:  String,    // required — the quote text
  avatar:   String,    // URL
  rating:   Number,    // 1-5 (optional)
  eventRef: String,    // Optional — event name reference
  featured: Boolean,   // default: false — shown on homepage
  enabled:  Boolean,   // default: true — soft delete

  timestamps: true
}
```

### Indexes
- `featured` + `enabled`: compound (for homepage query)

---

## 5. User

```js
{
  email:    String,    // required, unique
  password: String,    // required — bcrypt hashed (never returned in API responses)
  name:     String,    // required
  role:     String,    // enum: "admin" | "editor" — default: "editor"
  active:   Boolean,   // default: true

  timestamps: true
}
```

### Indexes
- `email`: unique

### Roles
- **admin**: Full access to all admin endpoints
- **editor**: Content editing only (pages, events, testimonials). Cannot modify users or site settings.

---

## 6. MediaAsset

```js
{
  filename:     String,  // required — stored filename (e.g., "1711612345-hero.webp")
  originalName: String,  // Original upload filename
  url:          String,  // required — public URL to access the file
  mimeType:     String,  // e.g., "image/webp"
  size:         Number,  // File size in bytes
  alt:          String,  // Alt text — default: ""
  uploadedBy:   ObjectId,// ref: "User"

  timestamps: true
}
```

---

## 7. SportItem

A sport item is a specific competition/activity within an event. This is the unit people register for.

```js
{
  eventId:             ObjectId,   // ref: Event — which event this belongs to

  name:                String,     // e.g., "Cricket - Men's", "Badminton Singles", "Relay Race"
  description:         String,
  icon:                String,     // Lucide icon name
  image:               String,     // URL

  // --- Registration type for THIS sport item ---
  registrationType:    String,     // "individual" | "team" | "group"

  // --- Capacity ---
  maxParticipants:     Number,     // For individual registrations
  maxTeams:            Number,     // For team registrations
  teamSize: {
    min:               Number,     // Minimum players per team
    max:               Number      // Maximum players per team
  },

  // --- Pricing (per registration unit) ---
  price:               Number,     // Per individual, per team, or per group
  currency:            String,     // default: "INR"

  // --- Rules specific to this sport item ---
  rules:               String,     // Rich text
  ageLimit: {
    min:               Number,
    max:               Number
  },
  gender:              String,     // "any" | "male" | "female" | "mixed"

  // --- Status ---
  status:              String,     // "open" | "closed" | "full" | "cancelled"

  // --- Computed ---
  registrationCount:   Number,     // Current number of registrations

  order:               Number,     // Display order within event

  timestamps: true
}
```

### Indexes
- `eventId`: single (for listing items per event)
- `eventId` + `status`: compound
- `status`: single

---

## 8. Registration

A registration is a participant's sign-up for a specific sport item.

```js
{
  // --- Who ---
  userId:              ObjectId,   // ref: PublicUser — the person who registered

  // --- What ---
  eventId:             ObjectId,   // ref: Event
  sportItemId:         ObjectId,   // ref: SportItem

  // --- Registration type ---
  type:                String,     // "individual" | "team" | "group"

  // --- For individual registration ---
  participant: {
    name:              String,
    email:             String,
    phone:             String,
    age:               Number,
    gender:            String
  },

  // --- For team registration ---
  team: {
    name:              String,     // e.g., "Thunder Strikers"
    captainName:       String,
    captainPhone:      String,
    captainEmail:      String,
    players: [{
      name:            String,
      email:           String,
      phone:           String,
      age:             Number,
      gender:          String,
      role:            String      // e.g., "Batsman", "Bowler", "All-rounder"
    }]
  },

  // --- For group registration (corporate) ---
  group: {
    companyName:       String,
    contactPerson:     String,
    contactEmail:      String,
    contactPhone:      String,
    headCount:         Number,
    participants: [{
      name:            String,
      email:           String
    }]
  },

  // --- Payment ---
  payment: {
    amount:            Number,
    currency:          String,     // default: "INR"
    status:            String,     // "pending" | "paid" | "failed" | "refunded"
    method:            String,     // "razorpay" | "bank_transfer" | "cash"
    transactionId:     String,     // Payment gateway reference
    paidAt:            Date
  },

  // --- Status ---
  status:              String,     // "pending" | "confirmed" | "waitlisted" | "cancelled" | "rejected"

  // --- Admin ---
  notes:               String,     // Internal admin notes
  approvedBy:          ObjectId,   // ref: User (admin who approved)
  approvedAt:          Date,

  timestamps: true
}
```

### Indexes
- `userId`: single (for "my registrations")
- `eventId`: single (for admin viewing event registrations)
- `sportItemId`: single
- `eventId` + `sportItemId`: compound (for capacity checks)
- `status`: single
- `payment.status`: single
- `createdAt`: single (for sorting)

---

## 9. PublicUser

Participant accounts. Separate from admin users — these are people who register for events.

```js
{
  name:                String,     // required
  email:               String,     // required, unique
  phone:               String,
  password:            String,     // bcrypt hashed (for email/password auth)

  // --- OAuth ---
  googleId:            String,     // For Google OAuth
  avatar:              String,     // Profile picture URL

  // --- Profile ---
  city:                String,
  company:             String,     // For corporate participants

  // --- Preferences ---
  sportsInterests:     [String],   // e.g., ["cricket", "football", "badminton"]

  // --- Status ---
  emailVerified:       Boolean,    // default: false
  active:              Boolean,    // default: true

  timestamps: true
}
```

### Indexes
- `email`: unique
- `googleId`: sparse unique (only set for Google OAuth users)

---

## 10. Seed Data

On first server startup (or when `pagecontents` collection is empty), `seedDefaults.js` creates:

1. **SiteSettings** — default branding, theme colors, nav links, footer columns
2. **PageContent** for each page:
   - `home` — hero, service-pillars, trust-partners, featured-events, testimonials, final-cta
   - `about` — hero, content-block, team, testimonials
   - `corporate-events` — hero, content-block, stats-grid, final-cta
   - `events` — (sections minimal, events listing is dynamic)
   - `contact` — hero, contact-form, faq
3. **Sample Events** — 3 sample events (one per category), each with schedule, rules, contacts, and sponsors
4. **Sample Sport Items** — 2-3 sport items per sample event (e.g., Cricket - Men's, Badminton Singles) with pricing and capacity
5. **Sample Registrations** — a few sample registrations across different types (individual, team, group) to demonstrate the registration flow
6. **Sample Testimonials** — 2 sample testimonials
7. **Admin User** — default admin account (email + hashed password from env vars)

This ensures the site is never blank and admins can immediately start editing.
