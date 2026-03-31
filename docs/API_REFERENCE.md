# TriCore Events — API Reference

Last updated: 28 March 2026

Base URL: `/api`

---

## Authentication

All admin endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued via `POST /api/auth/login` and expire after 24 hours.

---

## Auth Endpoints

### POST /api/auth/register

Create a public user account (for event participants).

**Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91 98765 43210",
  "password": "securepassword123"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "661a...",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91 98765 43210",
    "role": "user"
  }
}
```

**Response 400:**
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Email is already registered" }
  ]
}
```

---

### POST /api/auth/login

Login and receive a JWT token. Works for both admin and public users.

**Body:**
```json
{
  "email": "rajesh@example.com",
  "password": "securepassword123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "661a...",
    "email": "rajesh@example.com",
    "name": "Rajesh Kumar",
    "role": "user"
  }
}
```

**Response 401:**
```json
{ "error": "Invalid email or password" }
```

---

### POST /api/auth/google

Authenticate via Google OAuth. Creates a new account if the user does not exist, or logs in if they do.

**Body:**
```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "661a...",
    "email": "rajesh@gmail.com",
    "name": "Rajesh Kumar",
    "avatar": "https://lh3.googleusercontent.com/...",
    "role": "user"
  },
  "isNewUser": false
}
```

---

### GET /api/auth/me

Get the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response 200 (public user):**
```json
{
  "id": "661a...",
  "email": "rajesh@example.com",
  "name": "Rajesh Kumar",
  "phone": "+91 98765 43210",
  "avatar": null,
  "city": "Bangalore",
  "company": null,
  "sportsInterests": ["cricket", "badminton"],
  "role": "user"
}
```

**Response 200 (admin):**
```json
{
  "id": "660a...",
  "email": "admin@tricore.com",
  "name": "Admin",
  "role": "admin"
}
```

---

## Public Content Endpoints

No authentication required. These power the public-facing website.

---

### GET /api/content/settings

Fetch global site settings (branding, theme, navigation, footer, contact info).

**Response 200:**
```json
{
  "branding": {
    "siteName": "TriCore Events",
    "tagline": "Where every event becomes an experience",
    "logo": { "url": "/uploads/logo.webp", "altText": "TriCore Events" },
    "favicon": "/uploads/favicon.ico"
  },
  "theme": {
    "colors": {
      "primary": "#C8A961",
      "accent": "#D4AF37",
      "background": "#0A0A0A",
      "surface": "#141414",
      "surfaceAlt": "#1A1A1A",
      "text": "#F5F5F5",
      "textMuted": "#9CA3AF",
      "border": "#262626"
    },
    "fonts": {
      "heading": "Space Grotesk",
      "body": "Space Grotesk"
    }
  },
  "navigation": {
    "links": [
      { "label": "HOME", "href": "/", "order": 0, "isExternal": false },
      { "label": "EVENTS", "href": "/events", "order": 1, "isExternal": false },
      { "label": "CORPORATE", "href": "/corporate-events", "order": 2, "isExternal": false },
      { "label": "ABOUT", "href": "/about", "order": 3, "isExternal": false },
      { "label": "CONTACT", "href": "/contact", "order": 4, "isExternal": false }
    ],
    "ctaButton": { "label": "REGISTER NOW", "href": "/events", "enabled": true }
  },
  "footer": {
    "columns": [
      {
        "title": "COMPANY",
        "links": [
          { "label": "About Us", "href": "/about" },
          { "label": "Our Partners", "href": "/about#partners" },
          { "label": "Contact", "href": "/contact" }
        ]
      }
    ],
    "socialLinks": [
      { "platform": "instagram", "url": "https://instagram.com/tricoreevents" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/tricore" }
    ],
    "bottomText": "© 2026 TriCore Events. All rights reserved."
  },
  "contact": {
    "email": "hello@tricoreevents.com",
    "phone": "+91 98765 43210",
    "whatsapp": "+91 98765 43210",
    "address": "Bangalore, India"
  }
}
```

---

### GET /api/content/pages/:pageSlug

Fetch all enabled sections for a specific page, sorted by order.

**Params:** `pageSlug` — one of: `home`, `about`, `corporate-events`, `events`, `contact`

**Response 200:**
```json
{
  "pageSlug": "home",
  "title": "Homepage",
  "metaTitle": "TriCore Events — Where Every Event Becomes an Experience",
  "metaDescription": "Sports tournaments, corporate events, and community competitions.",
  "sections": [
    {
      "sectionId": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "data": {
        "badge": "SPORTS · CORPORATE · COMMUNITY",
        "headline": "WHERE EVERY\nEVENT BECOMES\nAN EXPERIENCE",
        "subheadline": "From high-stakes sports tournaments to premium corporate experiences...",
        "backgroundImage": "/uploads/hero-bg.webp",
        "ctaButtons": [
          { "label": "EXPLORE EVENTS", "href": "/events", "variant": "primary" },
          { "label": "CORPORATE INQUIRY", "href": "/corporate-events", "variant": "outline" }
        ],
        "stats": [
          { "value": "150+", "label": "EVENTS DELIVERED" },
          { "value": "50K+", "label": "PARTICIPANTS ENGAGED" }
        ]
      }
    },
    {
      "sectionId": "events-1",
      "type": "featured-events",
      "enabled": true,
      "order": 3,
      "data": {
        "heading": "FEATURED EVENTS",
        "subheading": "UPCOMING",
        "displayCount": 3,
        "showViewAll": true
      },
      "events": [
        {
          "title": "Premier Cricket League Season 4",
          "slug": "premier-cricket-league-s4",
          "category": "sports",
          "date": "2026-04-15",
          "location": "SPARK 7 ARENA",
          "image": "/uploads/pcl-cover.webp"
        }
      ]
    }
  ]
}
```

Note: `featured-events` and `testimonials` sections include populated data from their respective collections.

---

### GET /api/content/events

List public events.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by: `sports`, `corporate`, `community` |
| `status` | string | Filter by: `upcoming`, `active`, `completed`. Default: `upcoming` |
| `featured` | boolean | Filter featured events only |
| `limit` | number | Max results. Default: 12 |
| `page` | number | Pagination. Default: 1 |

**Response 200:**
```json
{
  "events": [
    {
      "id": "660a...",
      "title": "Premier Cricket League Season 4",
      "slug": "premier-cricket-league-s4",
      "shortDescription": "The biggest cricket tournament of the year...",
      "category": "sports",
      "date": "2026-04-15T00:00:00Z",
      "endDate": "2026-04-20T00:00:00Z",
      "location": "Bangalore",
      "venue": "Spark 7 Sports Arena",
      "image": "/uploads/pcl-cover.webp",
      "status": "upcoming",
      "featured": true,
      "registrationEnabled": true,
      "price": 500
    }
  ],
  "total": 15,
  "page": 1,
  "totalPages": 2
}
```

---

### GET /api/content/events/:slug

Get a single event by slug. Includes sport items, schedule, rules, prizes, contacts, and sponsors.

**Response 200:**
```json
{
  "id": "660a...",
  "title": "Premier Cricket League Season 4",
  "slug": "premier-cricket-league-s4",
  "description": "Full description with details...",
  "shortDescription": "The biggest cricket tournament...",
  "category": "sports",
  "date": "2026-04-15T00:00:00Z",
  "endDate": "2026-04-20T00:00:00Z",
  "location": "Bangalore",
  "venue": "Spark 7 Sports Arena",
  "image": "/uploads/pcl-cover.webp",
  "gallery": ["/uploads/pcl-1.webp", "/uploads/pcl-2.webp"],
  "status": "upcoming",
  "featured": true,
  "tags": ["cricket", "tournament", "season-4"],
  "registrationConfig": {
    "enabled": true,
    "opensAt": "2026-03-01T00:00:00Z",
    "closesAt": "2026-04-10T00:00:00Z",
    "requiresApproval": false,
    "allowWaitlist": true
  },
  "sportItems": [
    {
      "id": "661b...",
      "name": "Cricket - Men's",
      "description": "Men's cricket tournament...",
      "icon": "bat",
      "registrationType": "team",
      "maxTeams": 16,
      "teamSize": { "min": 6, "max": 11 },
      "price": 500,
      "currency": "INR",
      "gender": "male",
      "status": "open",
      "registrationCount": 12,
      "order": 0
    },
    {
      "id": "661c...",
      "name": "Badminton Singles",
      "description": "Individual badminton competition...",
      "icon": "racquet",
      "registrationType": "individual",
      "maxParticipants": 32,
      "price": 200,
      "currency": "INR",
      "gender": "any",
      "status": "open",
      "registrationCount": 18,
      "order": 1
    }
  ],
  "schedule": [
    { "time": "09:00 AM", "title": "Opening Ceremony", "description": "Welcome and introductions" },
    { "time": "09:30 AM", "title": "Cricket Pool Matches Begin", "description": "Group stage matches" },
    { "time": "12:00 PM", "title": "Lunch Break", "description": "" },
    { "time": "01:00 PM", "title": "Badminton Rounds", "description": "Round of 32 and 16" },
    { "time": "04:00 PM", "title": "Semi Finals", "description": "All sports" },
    { "time": "06:00 PM", "title": "Finals & Prize Ceremony", "description": "Championship matches and awards" }
  ],
  "rules": "### General Rules\n1. All participants must carry valid ID...\n2. Teams must report 30 minutes before...",
  "prizes": "### Prize Pool\n- Winner: ₹50,000\n- Runner-up: ₹25,000\n- Best Player: ₹5,000",
  "contacts": [
    {
      "name": "Vikram Sharma",
      "role": "Event Coordinator",
      "phone": "+91 98765 43210",
      "email": "vikram@tricoreevents.com"
    }
  ],
  "sponsors": [
    {
      "name": "Spark 7 Arena",
      "logo": "/uploads/spark7-logo.webp",
      "url": "https://spark7arena.com"
    }
  ]
}
```

**Response 404:**
```json
{ "error": "Event not found" }
```

---

### GET /api/content/events/:slug/sport-items

List all sport items for an event with current registration counts. No authentication required.

**Response 200:**
```json
{
  "sportItems": [
    {
      "id": "661b...",
      "eventId": "660a...",
      "name": "Cricket - Men's",
      "description": "Men's cricket tournament...",
      "icon": "bat",
      "image": "/uploads/cricket-mens.webp",
      "registrationType": "team",
      "maxTeams": 16,
      "teamSize": { "min": 6, "max": 11 },
      "price": 500,
      "currency": "INR",
      "rules": "Standard ICC rules apply...",
      "ageLimit": { "min": 16, "max": null },
      "gender": "male",
      "status": "open",
      "registrationCount": 12,
      "order": 0
    },
    {
      "id": "661c...",
      "eventId": "660a...",
      "name": "Badminton Singles",
      "description": "Individual badminton competition...",
      "icon": "racquet",
      "image": "/uploads/badminton.webp",
      "registrationType": "individual",
      "maxParticipants": 32,
      "price": 200,
      "currency": "INR",
      "rules": "BWF rules apply...",
      "ageLimit": { "min": 14, "max": null },
      "gender": "any",
      "status": "open",
      "registrationCount": 18,
      "order": 1
    }
  ]
}
```

---

### GET /api/content/testimonials

List public testimonials.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `featured` | boolean | Filter featured only |
| `limit` | number | Max results. Default: 6 |

**Response 200:**
```json
{
  "testimonials": [
    {
      "id": "660b...",
      "name": "Rajesh Kumar",
      "role": "Team Captain",
      "company": "PCL Season 3",
      "content": "The tournament was flawlessly organized...",
      "avatar": "/uploads/rajesh.webp",
      "rating": 5
    }
  ]
}
```

---

## Admin Content Endpoints

All require `Authorization: Bearer <token>` with admin role.

---

### PUT /api/admin/settings

Update site settings (branding, theme, nav, footer, contact). Partial updates supported — only send the fields you want to change.

**Body:** (partial example — updating theme colors)
```json
{
  "theme": {
    "colors": {
      "primary": "#E8C547",
      "accent": "#F0D060"
    }
  }
}
```

**Response 200:** Updated full settings object.

---

### GET /api/admin/pages

List all managed pages.

**Response 200:**
```json
{
  "pages": [
    { "pageSlug": "home", "title": "Homepage", "sectionCount": 6 },
    { "pageSlug": "about", "title": "About Us", "sectionCount": 4 },
    { "pageSlug": "corporate-events", "title": "Corporate Events", "sectionCount": 4 },
    { "pageSlug": "events", "title": "Events", "sectionCount": 1 },
    { "pageSlug": "contact", "title": "Contact", "sectionCount": 3 }
  ]
}
```

---

### GET /api/admin/pages/:pageSlug

Get a page with ALL sections (including disabled ones).

**Response 200:** Same shape as public endpoint but includes `enabled: false` sections.

---

### PUT /api/admin/pages/:pageSlug

Update entire page (all sections at once). Used when saving major changes.

**Body:**
```json
{
  "title": "Homepage",
  "metaTitle": "TriCore Events — Home",
  "metaDescription": "...",
  "sections": [ ... ]
}
```

**Response 200:** Updated page object.

---

### PUT /api/admin/pages/:pageSlug/sections/:sectionId

Update a single section's data. Most common admin operation.

**Body:**
```json
{
  "enabled": true,
  "data": {
    "headline": "NEW HEADLINE HERE",
    "subheadline": "Updated subheadline..."
  }
}
```

**Response 200:** Updated section object.

---

### PATCH /api/admin/pages/:pageSlug/reorder

Reorder sections on a page.

**Body:**
```json
{
  "sections": [
    { "sectionId": "hero-1", "order": 0 },
    { "sectionId": "pillars-1", "order": 1 },
    { "sectionId": "trust-1", "order": 2 },
    { "sectionId": "events-1", "order": 3 },
    { "sectionId": "testimonials-1", "order": 4 },
    { "sectionId": "cta-1", "order": 5 }
  ]
}
```

**Response 200:**
```json
{ "message": "Sections reordered successfully" }
```

---

### Admin Events CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/events` | List all events (including drafts) |
| POST | `/api/admin/events` | Create event |
| PUT | `/api/admin/events/:id` | Update event |
| DELETE | `/api/admin/events/:id` | Delete event |

**POST/PUT Body:**
```json
{
  "title": "Premier Cricket League Season 4",
  "slug": "premier-cricket-league-s4",
  "description": "Full description...",
  "shortDescription": "Short card description",
  "category": "sports",
  "date": "2026-04-15",
  "endDate": "2026-04-20",
  "location": "Bangalore",
  "venue": "Spark 7 Sports Arena",
  "image": "/uploads/pcl-cover.webp",
  "status": "upcoming",
  "featured": true,
  "registrationEnabled": true,
  "maxParticipants": 200,
  "price": 500,
  "tags": ["cricket", "tournament"]
}
```

---

### Admin Testimonials CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/testimonials` | List all testimonials |
| POST | `/api/admin/testimonials` | Create testimonial |
| PUT | `/api/admin/testimonials/:id` | Update testimonial |
| DELETE | `/api/admin/testimonials/:id` | Delete testimonial |

**POST/PUT Body:**
```json
{
  "name": "Rajesh Kumar",
  "role": "Team Captain",
  "company": "PCL Season 3",
  "content": "The tournament was flawlessly organized...",
  "avatar": "/uploads/rajesh.webp",
  "rating": 5,
  "featured": true,
  "enabled": true
}
```

---

## Registration Endpoints

Require `Authorization: Bearer <token>` (authenticated public user).

---

### POST /api/registrations

Create a new registration for a sport item. Request body varies by registration type.

**Body (individual):**
```json
{
  "eventId": "660a...",
  "sportItemId": "661c...",
  "type": "individual",
  "participant": {
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91 98765 43210",
    "age": 28,
    "gender": "male"
  }
}
```

**Body (team):**
```json
{
  "eventId": "660a...",
  "sportItemId": "661b...",
  "type": "team",
  "team": {
    "name": "Thunder Strikers",
    "captainName": "Rajesh Kumar",
    "captainPhone": "+91 98765 43210",
    "captainEmail": "rajesh@example.com",
    "players": [
      { "name": "Amit Singh", "email": "amit@example.com", "phone": "+91 91234 56789", "age": 25, "gender": "male", "role": "Batsman" },
      { "name": "Vikas Patel", "email": "vikas@example.com", "phone": "+91 92345 67890", "age": 27, "gender": "male", "role": "Bowler" },
      { "name": "Suresh Nair", "email": "suresh@example.com", "phone": "+91 93456 78901", "age": 24, "gender": "male", "role": "All-rounder" },
      { "name": "Deepak Rao", "email": "deepak@example.com", "phone": "+91 94567 89012", "age": 26, "gender": "male", "role": "Wicket-keeper" },
      { "name": "Kiran Joshi", "email": "kiran@example.com", "phone": "+91 95678 90123", "age": 23, "gender": "male", "role": "Bowler" },
      { "name": "Manoj Verma", "email": "manoj@example.com", "phone": "+91 96789 01234", "age": 29, "gender": "male", "role": "Batsman" }
    ]
  }
}
```

**Body (group):**
```json
{
  "eventId": "660a...",
  "sportItemId": "661d...",
  "type": "group",
  "group": {
    "companyName": "TechVista Solutions",
    "contactPerson": "Priya Sharma",
    "contactEmail": "priya@techvista.com",
    "contactPhone": "+91 97890 12345",
    "headCount": 25,
    "participants": [
      { "name": "Employee One", "email": "emp1@techvista.com" },
      { "name": "Employee Two", "email": "emp2@techvista.com" }
    ]
  }
}
```

**Response 201:**
```json
{
  "id": "662a...",
  "eventId": "660a...",
  "sportItemId": "661b...",
  "type": "team",
  "team": {
    "name": "Thunder Strikers",
    "captainName": "Rajesh Kumar",
    "captainPhone": "+91 98765 43210",
    "captainEmail": "rajesh@example.com",
    "players": [ ... ]
  },
  "payment": {
    "amount": 500,
    "currency": "INR",
    "status": "pending",
    "method": null,
    "transactionId": null,
    "paidAt": null
  },
  "status": "pending",
  "createdAt": "2026-03-28T10:00:00Z"
}
```

**Response 400:**
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "team.players", "message": "Minimum 6 players required" }
  ]
}
```

---

### GET /api/registrations/my

List all registrations for the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "registrations": [
    {
      "id": "662a...",
      "event": {
        "id": "660a...",
        "title": "Premier Cricket League Season 4",
        "slug": "premier-cricket-league-s4",
        "date": "2026-04-15T00:00:00Z",
        "endDate": "2026-04-20T00:00:00Z",
        "venue": "Spark 7 Sports Arena",
        "image": "/uploads/pcl-cover.webp"
      },
      "sportItem": {
        "id": "661b...",
        "name": "Cricket - Men's",
        "icon": "bat"
      },
      "type": "team",
      "team": { "name": "Thunder Strikers" },
      "payment": { "amount": 500, "currency": "INR", "status": "paid" },
      "status": "confirmed",
      "createdAt": "2026-03-28T10:00:00Z"
    },
    {
      "id": "662b...",
      "event": {
        "id": "660a...",
        "title": "Premier Cricket League Season 4",
        "slug": "premier-cricket-league-s4",
        "date": "2026-04-15T00:00:00Z",
        "endDate": "2026-04-20T00:00:00Z",
        "venue": "Spark 7 Sports Arena",
        "image": "/uploads/pcl-cover.webp"
      },
      "sportItem": {
        "id": "661c...",
        "name": "Badminton Singles",
        "icon": "racquet"
      },
      "type": "individual",
      "participant": { "name": "Rajesh Kumar" },
      "payment": { "amount": 200, "currency": "INR", "status": "paid" },
      "status": "confirmed",
      "createdAt": "2026-03-28T10:05:00Z"
    }
  ]
}
```

---

### GET /api/registrations/:id

Get full details of a specific registration. Only accessible by the registration owner.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": "662a...",
  "userId": "661a...",
  "event": {
    "id": "660a...",
    "title": "Premier Cricket League Season 4",
    "slug": "premier-cricket-league-s4",
    "date": "2026-04-15T00:00:00Z",
    "endDate": "2026-04-20T00:00:00Z",
    "location": "Bangalore",
    "venue": "Spark 7 Sports Arena"
  },
  "sportItem": {
    "id": "661b...",
    "name": "Cricket - Men's",
    "icon": "bat",
    "registrationType": "team"
  },
  "type": "team",
  "team": {
    "name": "Thunder Strikers",
    "captainName": "Rajesh Kumar",
    "captainPhone": "+91 98765 43210",
    "captainEmail": "rajesh@example.com",
    "players": [
      { "name": "Amit Singh", "email": "amit@example.com", "phone": "+91 91234 56789", "age": 25, "gender": "male", "role": "Batsman" },
      { "name": "Vikas Patel", "email": "vikas@example.com", "phone": "+91 92345 67890", "age": 27, "gender": "male", "role": "Bowler" }
    ]
  },
  "payment": {
    "amount": 500,
    "currency": "INR",
    "status": "paid",
    "method": "razorpay",
    "transactionId": "pay_Oq2mK8Xg3z...",
    "paidAt": "2026-03-28T10:02:00Z"
  },
  "status": "confirmed",
  "createdAt": "2026-03-28T10:00:00Z",
  "updatedAt": "2026-03-28T10:02:00Z"
}
```

**Response 404:**
```json
{ "error": "Registration not found" }
```

---

### PUT /api/registrations/:id/cancel

Cancel a registration. Only accessible by the registration owner. Cannot cancel already-cancelled or rejected registrations.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": "662a...",
  "status": "cancelled",
  "payment": {
    "amount": 500,
    "currency": "INR",
    "status": "refunded"
  },
  "message": "Registration cancelled successfully"
}
```

**Response 400:**
```json
{ "error": "Registration is already cancelled" }
```

---

## Payment Endpoints

Require `Authorization: Bearer <token>` (authenticated public user).

---

### POST /api/payments/create-order

Create a Razorpay order for a registration. Called before opening the Razorpay checkout modal.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "registrationId": "662a...",
  "amount": 500
}
```

**Response 200:**
```json
{
  "orderId": "order_Oq2abc123...",
  "amount": 500,
  "currency": "INR",
  "registrationId": "662a...",
  "razorpayKey": "rzp_live_xxxxxxxx"
}
```

**Response 400:**
```json
{ "error": "Registration already paid" }
```

---

### POST /api/payments/verify

Verify a payment after Razorpay checkout completes. Updates registration payment status and confirms the registration.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "paymentId": "pay_Oq2mK8Xg3z...",
  "orderId": "order_Oq2abc123...",
  "signature": "d4e5f6a7b8c9..."
}
```

**Response 200:**
```json
{
  "success": true,
  "registration": {
    "id": "662a...",
    "status": "confirmed",
    "payment": {
      "amount": 500,
      "currency": "INR",
      "status": "paid",
      "method": "razorpay",
      "transactionId": "pay_Oq2mK8Xg3z...",
      "paidAt": "2026-03-28T10:02:00Z"
    }
  }
}
```

**Response 400:**
```json
{ "error": "Payment verification failed" }
```

---

## Admin Sport Items

All require `Authorization: Bearer <token>` with admin role.

---

### GET /api/admin/events/:id/sport-items

List all sport items for an event (admin view).

**Response 200:**
```json
{
  "sportItems": [
    {
      "id": "661b...",
      "eventId": "660a...",
      "name": "Cricket - Men's",
      "description": "Men's cricket tournament...",
      "icon": "bat",
      "image": "/uploads/cricket-mens.webp",
      "registrationType": "team",
      "maxTeams": 16,
      "teamSize": { "min": 6, "max": 11 },
      "price": 500,
      "currency": "INR",
      "rules": "Standard ICC rules apply...",
      "ageLimit": { "min": 16, "max": null },
      "gender": "male",
      "status": "open",
      "registrationCount": 12,
      "order": 0,
      "createdAt": "2026-03-20T08:00:00Z",
      "updatedAt": "2026-03-28T10:00:00Z"
    }
  ]
}
```

---

### POST /api/admin/events/:id/sport-items

Add a new sport item to an event.

**Body:**
```json
{
  "name": "Cricket - Women's",
  "description": "Women's cricket tournament...",
  "icon": "bat",
  "image": "/uploads/cricket-womens.webp",
  "registrationType": "team",
  "maxTeams": 8,
  "teamSize": { "min": 6, "max": 11 },
  "price": 500,
  "currency": "INR",
  "rules": "Standard ICC rules apply...",
  "ageLimit": { "min": 16, "max": null },
  "gender": "female",
  "status": "open",
  "order": 1
}
```

**Response 201:**
```json
{
  "id": "661d...",
  "eventId": "660a...",
  "name": "Cricket - Women's",
  "description": "Women's cricket tournament...",
  "icon": "bat",
  "image": "/uploads/cricket-womens.webp",
  "registrationType": "team",
  "maxTeams": 8,
  "teamSize": { "min": 6, "max": 11 },
  "price": 500,
  "currency": "INR",
  "rules": "Standard ICC rules apply...",
  "ageLimit": { "min": 16, "max": null },
  "gender": "female",
  "status": "open",
  "registrationCount": 0,
  "order": 1,
  "createdAt": "2026-03-28T10:00:00Z",
  "updatedAt": "2026-03-28T10:00:00Z"
}
```

---

### PUT /api/admin/sport-items/:id

Update an existing sport item.

**Body:** (partial update supported)
```json
{
  "price": 600,
  "maxTeams": 12,
  "status": "closed"
}
```

**Response 200:** Updated sport item object.

---

### DELETE /api/admin/sport-items/:id

Delete a sport item. Fails if there are existing registrations for this item.

**Response 200:**
```json
{ "message": "Sport item deleted successfully" }
```

**Response 400:**
```json
{ "error": "Cannot delete sport item with existing registrations" }
```

---

## Admin Registrations

All require `Authorization: Bearer <token>` with admin role.

---

### GET /api/admin/events/:id/registrations

List all registrations for a specific event.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `sportItemId` | string | Filter by sport item |
| `status` | string | Filter by: `pending`, `confirmed`, `waitlisted`, `cancelled`, `rejected` |
| `paymentStatus` | string | Filter by: `pending`, `paid`, `failed`, `refunded` |
| `type` | string | Filter by: `individual`, `team`, `group` |
| `search` | string | Search by participant/team name |
| `limit` | number | Default: 25 |
| `page` | number | Default: 1 |

**Response 200:**
```json
{
  "registrations": [
    {
      "id": "662a...",
      "user": { "id": "661a...", "name": "Rajesh Kumar", "email": "rajesh@example.com" },
      "sportItem": { "id": "661b...", "name": "Cricket - Men's" },
      "type": "team",
      "team": { "name": "Thunder Strikers", "captainName": "Rajesh Kumar" },
      "payment": { "amount": 500, "status": "paid" },
      "status": "confirmed",
      "createdAt": "2026-03-28T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 2
}
```

---

### GET /api/admin/registrations

List all registrations across all events (global view).

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `eventId` | string | Filter by event |
| `sportItemId` | string | Filter by sport item |
| `status` | string | Filter by registration status |
| `paymentStatus` | string | Filter by payment status |
| `type` | string | Filter by registration type |
| `search` | string | Search by participant/team/company name |
| `limit` | number | Default: 25 |
| `page` | number | Default: 1 |

**Response 200:**
```json
{
  "registrations": [
    {
      "id": "662a...",
      "user": { "id": "661a...", "name": "Rajesh Kumar", "email": "rajesh@example.com" },
      "event": { "id": "660a...", "title": "Premier Cricket League Season 4" },
      "sportItem": { "id": "661b...", "name": "Cricket - Men's" },
      "type": "team",
      "team": { "name": "Thunder Strikers", "captainName": "Rajesh Kumar" },
      "payment": { "amount": 500, "status": "paid" },
      "status": "confirmed",
      "createdAt": "2026-03-28T10:00:00Z"
    }
  ],
  "total": 120,
  "page": 1,
  "totalPages": 5
}
```

---

### GET /api/admin/registrations/:id

Get full registration detail (admin view).

**Response 200:**
```json
{
  "id": "662a...",
  "user": {
    "id": "661a...",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91 98765 43210"
  },
  "event": {
    "id": "660a...",
    "title": "Premier Cricket League Season 4",
    "slug": "premier-cricket-league-s4"
  },
  "sportItem": {
    "id": "661b...",
    "name": "Cricket - Men's",
    "registrationType": "team"
  },
  "type": "team",
  "team": {
    "name": "Thunder Strikers",
    "captainName": "Rajesh Kumar",
    "captainPhone": "+91 98765 43210",
    "captainEmail": "rajesh@example.com",
    "players": [
      { "name": "Amit Singh", "email": "amit@example.com", "phone": "+91 91234 56789", "age": 25, "gender": "male", "role": "Batsman" },
      { "name": "Vikas Patel", "email": "vikas@example.com", "phone": "+91 92345 67890", "age": 27, "gender": "male", "role": "Bowler" }
    ]
  },
  "payment": {
    "amount": 500,
    "currency": "INR",
    "status": "paid",
    "method": "razorpay",
    "transactionId": "pay_Oq2mK8Xg3z...",
    "paidAt": "2026-03-28T10:02:00Z"
  },
  "status": "confirmed",
  "notes": "Approved after captain verification",
  "approvedBy": { "id": "660a...", "name": "Admin" },
  "approvedAt": "2026-03-28T10:05:00Z",
  "createdAt": "2026-03-28T10:00:00Z",
  "updatedAt": "2026-03-28T10:05:00Z"
}
```

---

### PUT /api/admin/registrations/:id/approve

Approve a pending registration.

**Body:** (optional)
```json
{
  "notes": "Verified team roster"
}
```

**Response 200:**
```json
{
  "id": "662a...",
  "status": "confirmed",
  "approvedBy": "660a...",
  "approvedAt": "2026-03-28T10:05:00Z",
  "message": "Registration approved successfully"
}
```

**Response 400:**
```json
{ "error": "Registration is not in pending status" }
```

---

### PUT /api/admin/registrations/:id/reject

Reject a pending registration.

**Body:**
```json
{
  "notes": "Incomplete team roster — only 4 players listed"
}
```

**Response 200:**
```json
{
  "id": "662a...",
  "status": "rejected",
  "message": "Registration rejected successfully"
}
```

**Response 400:**
```json
{ "error": "Registration is not in pending status" }
```

---

### GET /api/admin/registrations/export/:eventId

Export all registrations for an event as a CSV file.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `sportItemId` | string | Filter by sport item |
| `status` | string | Filter by registration status |

**Response 200:** CSV file download.

```
Content-Type: text/csv
Content-Disposition: attachment; filename="registrations-premier-cricket-league-s4.csv"
```

CSV columns: `Registration ID, Type, Participant/Team Name, Sport Item, Status, Payment Status, Amount, Date`

---

## Upload Endpoints

Require `Authorization: Bearer <token>` (any role).

---

### POST /api/upload

Upload an image. Accepts `multipart/form-data`.

**Body:** Form data with field `image` (file).

Processing: Sharp resizes to max 1920px width, converts to WebP.

**Response 200:**
```json
{
  "id": "660c...",
  "url": "/uploads/1711612345-hero.webp",
  "filename": "1711612345-hero.webp",
  "originalName": "hero-background.jpg",
  "mimeType": "image/webp",
  "size": 245760
}
```

---

### GET /api/upload/media

List all uploaded media assets.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `limit` | number | Default: 50 |
| `page` | number | Default: 1 |

**Response 200:**
```json
{
  "assets": [
    {
      "id": "660c...",
      "url": "/uploads/1711612345-hero.webp",
      "filename": "1711612345-hero.webp",
      "originalName": "hero-background.jpg",
      "mimeType": "image/webp",
      "size": 245760,
      "alt": "Stadium aerial view",
      "createdAt": "2026-03-28T10:00:00Z"
    }
  ],
  "total": 24,
  "page": 1,
  "totalPages": 1
}
```

---

### DELETE /api/upload/media/:id

Delete a media asset (removes file and database record).

**Response 200:**
```json
{ "message": "Asset deleted successfully" }
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Not authorized (wrong role) |
| 404 | Resource not found |
| 500 | Server error |

Validation errors include field-level details:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "title", "message": "Title is required" },
    { "field": "category", "message": "Must be one of: sports, corporate, community" }
  ]
}
```
