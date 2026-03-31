# TriCore Events — Event Details & Registration System

Last updated: 28 March 2026

---

## 1. Problem Statement

The current platform has:
- Event listings (cards with title, date, category, status)
- An Events Manager in admin (CRUD for events)

What's **missing**:
- **Event Detail Page** — what a visitor sees when they click on an event
- **Registration System** — how participants sign up (individual, group, or team)
- **Multi-Sport Events** — a single event can contain multiple sport items (e.g., a Corporate Sports Day has cricket, football, badminton as separate items)
- **Payment Flow** — collecting registration fees
- **User Accounts** — participants need to sign in, register, and track their registrations
- **User Dashboard** — post-login area where participants see their registrations, upcoming events, payment status

---

## 2. Event Structure — The Key Concept

An **Event** is not always a single game. TriCore runs three types of events, each with different registration models:

### 2.1 Sports Tournaments
- Example: "Premier Cricket League Season 4"
- Contains **multiple sport items** (e.g., Cricket - Men's, Cricket - Women's, Cricket - Under-16)
- Registration is **team-based** — a captain registers a team with multiple players
- Each sport item has its own rules, schedule, player limits
- Teams compete in brackets/fixtures

### 2.2 Corporate Events
- Example: "TechVista Annual Sports Day"
- Contains **multiple activities** (e.g., Cricket, Football, Relay Race, Tug of War)
- Registration can be **group-based** (a company registers a group) or **individual** (employees sign up for specific activities)
- Often tied to a single company/client

### 2.3 Community Competitions
- Example: "Neighborhood Badminton Open"
- May have **single or multiple sport items** (e.g., Singles, Doubles, Mixed Doubles)
- Registration is **individual** or **pair-based** (for doubles)
- Open to residents of specific areas

### 2.4 Universal Truth
**Every event can have multiple sport items. Registration type varies per sport item, not per event.**

---

## 3. Data Model — Extended Schema

### 3.1 Event (enhanced from existing)

```js
{
  // --- Existing fields ---
  title:               String,
  slug:                String,     // unique, URL-friendly
  description:         String,     // Rich text / markdown
  shortDescription:    String,     // Card preview
  category:            String,     // "sports" | "corporate" | "community"
  date:                Date,
  endDate:             Date,
  location:            String,
  venue:               String,
  image:               String,     // Cover image URL
  gallery:             [String],
  status:              String,     // "draft" | "upcoming" | "active" | "completed" | "cancelled"
  featured:            Boolean,
  tags:                [String],

  // --- NEW fields ---
  registrationConfig: {
    enabled:           Boolean,    // default: false
    opensAt:           Date,       // When registration opens
    closesAt:          Date,       // Registration deadline
    requiresApproval:  Boolean,    // Admin must approve registrations
    allowWaitlist:     Boolean,    // Allow signups after max reached
  },

  sportItems:          [SportItemId],  // References to SportItem documents

  // --- Event-level details for the detail page ---
  schedule: [{
    time:    String,               // e.g., "09:00 AM"
    title:   String,               // e.g., "Opening Ceremony"
    description: String
  }],

  rules:               String,     // Rich text — event rules & regulations
  prizes:              String,     // Rich text — prize info

  contacts: [{
    name:    String,
    role:    String,               // e.g., "Event Coordinator"
    phone:   String,
    email:   String
  }],

  sponsors: [{
    name:    String,
    logo:    String,               // URL
    url:     String
  }],

  timestamps: true
}
```

### 3.2 SportItem (NEW collection)

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

### 3.3 Registration (NEW collection)

A registration is a participant's sign-up for a specific sport item.

```js
{
  // --- Who ---
  userId:              ObjectId,   // ref: User — the person who registered

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

### 3.4 PublicUser (NEW collection — separate from admin User)

Participants who register for events. Separate from admin users.

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

---

## 4. Event Detail Page — What the Visitor Sees

Route: `/events/:slug`

### 4.1 Page Sections (top to bottom)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (same as all public pages)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  EVENT HERO                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Cover Image — full width, 400px]              │   │
│  │                                                  │   │
│  │  Category Badge: SPORTS                          │   │
│  │  Title: PREMIER CRICKET LEAGUE SEASON 4          │   │
│  │  Date: Apr 15–20, 2026 · Spark 7 Arena          │   │
│  │  Status Badge: UPCOMING                          │   │
│  │                                                  │   │
│  │  [REGISTER NOW]  [SHARE]                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  QUICK INFO BAR (horizontal strip)                      │
│  ┌────────┬────────┬────────┬────────┬────────┐        │
│  │📅 Date │📍Venue │💰 From │👥 Spots│⏰ Reg  │        │
│  │Apr 15  │Spark 7 │₹500    │120 left│Closes  │        │
│  │to 20   │Arena   │/team   │        │Apr 10  │        │
│  └────────┴────────┴────────┴────────┴────────┘        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TABS: About | Sport Items | Schedule | Rules | Contact │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [ABOUT TAB - default]                          │   │
│  │                                                  │   │
│  │  Event description (rich text)                   │   │
│  │  Gallery (image carousel/grid)                   │   │
│  │  Prize info                                      │   │
│  │  Sponsors row (logos)                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [SPORT ITEMS TAB]                              │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │ 🏏 Cricket - Men's          TEAM        │   │   │
│  │  │ ₹500/team · 6-11 players · 16 teams max │   │   │
│  │  │ 12/16 teams registered                   │   │   │
│  │  │ [REGISTER TEAM →]                        │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │ 🏏 Cricket - Women's        TEAM        │   │   │
│  │  │ ₹500/team · 6-11 players · 8 teams max  │   │   │
│  │  │ 5/8 teams registered                     │   │   │
│  │  │ [REGISTER TEAM →]                        │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │ 🏸 Badminton Singles       INDIVIDUAL    │   │   │
│  │  │ ₹200/person · 32 spots max              │   │   │
│  │  │ 18/32 registered                        │   │   │
│  │  │ [REGISTER →]                             │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [SCHEDULE TAB]                                 │   │
│  │                                                  │   │
│  │  Timeline / agenda list                         │   │
│  │  09:00 — Opening Ceremony                       │   │
│  │  09:30 — Cricket Pool Matches Begin              │   │
│  │  12:00 — Lunch Break                            │   │
│  │  13:00 — Badminton Rounds                       │   │
│  │  16:00 — Semi Finals                            │   │
│  │  18:00 — Finals & Prize Ceremony                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [RULES TAB]                                    │   │
│  │  Event rules & regulations (rich text)          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [CONTACT TAB]                                  │   │
│  │  Event coordinator contact cards                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  RELATED EVENTS (3 cards of same category)              │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Registration Flow

### 5.1 Flow Overview

```
Visitor clicks "Register" on a sport item
         │
         ▼
    ┌──────────┐     ┌──────────────┐
    │ Logged   │─NO─▶│ Sign In /    │
    │ in?      │     │ Create Acct  │
    └────┬─────┘     └──────┬───────┘
         │YES               │
         ▼                  ▼
    ┌──────────────────────────┐
    │  Registration Form       │
    │  (varies by type)        │
    │                          │
    │  Individual: your info   │
    │  Team: team name +       │
    │        captain + players │
    │  Group: company +        │
    │         contact + list   │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  Review & Confirm        │
    │  Summary of registration │
    │  Total price             │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  Payment                 │
    │  Razorpay checkout       │
    │  (if price > 0)          │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  Confirmation            │
    │  Registration ID         │
    │  Email confirmation      │
    │  "View in Dashboard"     │
    └──────────────────────────┘
```

### 5.2 Registration Form — By Type

#### Individual Registration
```
┌─────────────────────────────────────┐
│ REGISTER FOR: Badminton Singles     │
│                                     │
│ YOUR DETAILS                        │
│ ┌─────────────┬─────────────┐      │
│ │ Full Name   │ Email       │      │
│ ├─────────────┼─────────────┤      │
│ │ Phone       │ Age         │      │
│ ├─────────────┴─────────────┤      │
│ │ Gender  [Male ▾]          │      │
│ └───────────────────────────┘      │
│                                     │
│ Price: ₹200                         │
│                                     │
│ [PROCEED TO PAYMENT →]              │
└─────────────────────────────────────┘
```

#### Team Registration
```
┌─────────────────────────────────────┐
│ REGISTER TEAM: Cricket - Men's      │
│                                     │
│ TEAM INFO                           │
│ ┌───────────────────────────┐      │
│ │ Team Name                 │      │
│ └───────────────────────────┘      │
│                                     │
│ CAPTAIN (You)                       │
│ ┌─────────────┬─────────────┐      │
│ │ Name        │ Email       │      │
│ ├─────────────┼─────────────┤      │
│ │ Phone       │ Role        │      │
│ └─────────────┴─────────────┘      │
│                                     │
│ PLAYERS (min 6, max 11)             │
│ ┌───────────────────────────────┐  │
│ │ 1. ┌Name──┬Email──┬Phone─┬Role┐│ │
│ │ 2. ├──────┼──────┼──────┼────┤│ │
│ │ 3. ├──────┼──────┼──────┼────┤│ │
│ │ 4. ├──────┼──────┼──────┼────┤│ │
│ │ 5. ├──────┼──────┼──────┼────┤│ │
│ │ 6. └──────┴──────┴──────┴────┘│ │
│ │ [+ ADD PLAYER]                 │ │
│ └───────────────────────────────┘  │
│                                     │
│ 6/11 players added (min 6 required) │
│ Price: ₹500/team                    │
│                                     │
│ [PROCEED TO PAYMENT →]              │
└─────────────────────────────────────┘
```

#### Group Registration (Corporate)
```
┌─────────────────────────────────────┐
│ REGISTER GROUP: Corporate Sports Day│
│                                     │
│ COMPANY DETAILS                     │
│ ┌─────────────┬─────────────┐      │
│ │ Company Name│ Head Count  │      │
│ ├─────────────┼─────────────┤      │
│ │ Contact Name│ Contact Email│     │
│ ├─────────────┴─────────────┤      │
│ │ Contact Phone              │     │
│ └────────────────────────────┘     │
│                                     │
│ PARTICIPANTS                        │
│ ┌───────────────────────────────┐  │
│ │ 1. ┌Name──────┬Email─────────┐│ │
│ │ 2. ├──────────┼──────────────┤│ │
│ │ 3. ├──────────┼──────────────┤│ │
│ │ [+ ADD PARTICIPANT]           │  │
│ └───────────────────────────────┘  │
│                                     │
│ OR: [UPLOAD CSV] to bulk-add        │
│                                     │
│ Price: ₹10,000/group                │
│                                     │
│ [PROCEED TO PAYMENT →]              │
└─────────────────────────────────────┘
```

### 5.3 Multi-Sport Registration

A user can register for **multiple sport items** within the same event. The flow:

1. User views Sport Items tab on Event Detail page
2. Clicks "Register" on Cricket - Men's → completes team registration
3. Returns to Sport Items tab → clicks "Register" on Badminton Singles → completes individual registration
4. Each registration is a separate `Registration` document
5. Payment can be:
   - **Per registration** — pay immediately after each
   - **Cart-based** — add multiple to cart, pay once (better UX)

**Recommended: Cart-based approach** — user adds sport items to a registration cart, reviews all, pays once.

---

## 6. User Dashboard — Post-Login

Route: `/dashboard`

### 6.1 Dashboard Sections

```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome back, Rajesh Kumar                             │
│                                                         │
│  ┌───────────┬───────────┬───────────┐                 │
│  │ Upcoming  │ Active    │ Completed │                 │
│  │ Events: 2 │ Events: 1 │ Events: 5 │                 │
│  └───────────┴───────────┴───────────┘                 │
│                                                         │
│  MY REGISTRATIONS                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Premier Cricket League S4                       │   │
│  │ 🏏 Cricket - Men's · Team: Thunder Strikers     │   │
│  │ Apr 15–20 · Spark 7 Arena                       │   │
│  │ Status: CONFIRMED   Payment: PAID ₹500          │   │
│  │ [VIEW DETAILS] [VIEW TEAM]                       │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Premier Cricket League S4                       │   │
│  │ 🏸 Badminton Singles · Individual               │   │
│  │ Apr 15–20 · Spark 7 Arena                       │   │
│  │ Status: CONFIRMED   Payment: PAID ₹200          │   │
│  │ [VIEW DETAILS]                                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Weekend Football League                         │   │
│  │ ⚽ Football 5-a-side · Team: City FC            │   │
│  │ Mar 1–30 · Spark 7 Arena                        │   │
│  │ Status: WAITLISTED   Payment: PENDING           │   │
│  │ [VIEW DETAILS] [CANCEL]                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  BROWSE MORE EVENTS                                     │
│  [3 event cards of upcoming events]                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 7. API Endpoints — Registration System

### Public (authenticated user)

```
POST   /api/auth/register              # Create public user account
POST   /api/auth/login                  # Login (email/password)
POST   /api/auth/google                 # Google OAuth
GET    /api/auth/me                     # Get current user

GET    /api/content/events/:slug        # Event detail with sport items
GET    /api/content/events/:slug/sport-items  # List sport items for event

POST   /api/registrations              # Create registration
GET    /api/registrations/my            # My registrations (authenticated)
GET    /api/registrations/:id           # Registration detail
PUT    /api/registrations/:id/cancel    # Cancel registration

POST   /api/payments/create-order      # Create Razorpay order
POST   /api/payments/verify            # Verify payment after completion
```

### Admin

```
GET    /api/admin/events/:id/sport-items        # List sport items
POST   /api/admin/events/:id/sport-items        # Add sport item
PUT    /api/admin/sport-items/:id               # Update sport item
DELETE /api/admin/sport-items/:id               # Delete sport item

GET    /api/admin/events/:id/registrations      # All registrations for event
GET    /api/admin/registrations/:id             # Registration detail
PUT    /api/admin/registrations/:id/approve      # Approve registration
PUT    /api/admin/registrations/:id/reject       # Reject registration
GET    /api/admin/registrations/export/:eventId  # Export as CSV
```

---

## 8. Admin — New Screens Needed

### 8.1 Sport Items Manager (within Event Editor)

When admin edits an event, they should see a "Sport Items" tab where they can:
- Add sport items (name, type, capacity, pricing, rules)
- Reorder sport items
- Toggle open/closed
- View registration count per item

### 8.2 Registrations Manager

New admin sidebar item: "Registrations"

- Filter by event, sport item, status, payment status
- Data table showing: participant/team name, sport item, registration type, status, payment status, date
- Click to view full registration detail
- Approve/reject buttons for pending registrations
- Export registrations as CSV

### 8.3 Event Detail Editor — Enhanced

Add tabs to the existing event editor:
- **Basic Info** (existing fields)
- **Sport Items** (new — manage sport items)
- **Schedule** (new — add/edit/reorder schedule entries)
- **Rules & Prizes** (new — rich text editors)
- **Contacts** (new — event coordinator cards)
- **Sponsors** (new — logo + name + URL)
- **Registrations** (new — view registrations for this event)

---

## 9. Payment Integration

### 9.1 Flow

```
Frontend                    Backend                   Razorpay
   │                          │                          │
   │ POST /payments/          │                          │
   │ create-order             │                          │
   │ {amount, registrationId} │                          │
   │─────────────────────────▶│                          │
   │                          │ Create Order             │
   │                          │─────────────────────────▶│
   │                          │                          │
   │                          │◀─── order_id ───────────│
   │◀─── order_id ───────────│                          │
   │                          │                          │
   │ Open Razorpay            │                          │
   │ Checkout Modal           │                          │
   │─────────────────────────────────────────────────────▶│
   │                          │                          │
   │◀──── payment_id, signature ─────────────────────────│
   │                          │                          │
   │ POST /payments/verify    │                          │
   │ {payment_id, signature}  │                          │
   │─────────────────────────▶│                          │
   │                          │ Verify Signature         │
   │                          │ Update Registration      │
   │                          │ Send Confirmation Email  │
   │◀─── confirmation ───────│                          │
```

### 9.2 Pricing Rules

- Price is set **per sport item**, not per event
- Team registration: one payment covers the whole team
- Group registration: one payment covers the group
- Free events: skip payment, go straight to confirmation
- Cart checkout: sum all sport item prices, single Razorpay order

---

## 10. Email Notifications

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Registration created | Participant | Confirmation + details |
| Payment received | Participant | Payment receipt + registration ID |
| Registration approved | Participant | Approval notice |
| Registration rejected | Participant | Rejection with reason |
| Registration cancelled | Participant + Admin | Cancellation notice |
| Event reminder (1 day before) | All registered participants | Reminder with venue/time |
| Event completed | All participants | Thank you + feedback link |

---

## 11. Public User Authentication

### 11.1 Auth Methods
- **Email + Password** — standard signup/login
- **Google OAuth** — one-click sign in
- **Phone OTP** (future) — via SMS

### 11.2 Auth Flow for Registration

```
User clicks "Register" on a sport item
  │
  ├─ Already logged in? → Show registration form
  │
  └─ Not logged in? → Show auth modal:
       ┌─────────────────────────────┐
       │  Sign in to register        │
       │                             │
       │  [Continue with Google]     │
       │                             │
       │  ─── or ───                 │
       │                             │
       │  Email: [_______________]   │
       │  Password: [____________]   │
       │                             │
       │  [SIGN IN]                  │
       │                             │
       │  Don't have an account?     │
       │  [CREATE ACCOUNT]           │
       └─────────────────────────────┘
```

---

## 12. Database Indexes

```
// SportItem
sportItemId + eventId: compound
eventId: single (for listing items per event)
status: single

// Registration
userId: single (for "my registrations")
eventId: single (for admin viewing event registrations)
sportItemId: single
eventId + sportItemId: compound (for capacity checks)
status: single
payment.status: single
createdAt: single (for sorting)
```

---

## 13. New Collections Summary

| Collection | Purpose | Cardinality |
|-----------|---------|-------------|
| `sportitems` | Competition/activity units within events | Many per event |
| `registrations` | Participant sign-ups for sport items | Many |
| `publicusers` | Participant accounts (separate from admin users) | Many |

Added to existing 6 collections = **9 total collections**.

---

## 14. Pages & Routes Summary

### New Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/events/:slug` | Event Detail | Full event page with tabs |
| `/events/:slug/register/:sportItemId` | Registration Form | Dynamic form based on sport item type |
| `/events/:slug/payment` | Payment | Razorpay checkout |
| `/dashboard` | User Dashboard | My registrations, upcoming events |
| `/auth/login` | Login | Email/password + Google OAuth |
| `/auth/register` | Sign Up | Create account |

### New Admin Routes (within admin portal)
| Route | Page | Description |
|-------|------|-------------|
| `/admin/events/:id/sport-items` | Sport Items Manager | Add/edit/reorder sport items |
| `/admin/events/:id/registrations` | Event Registrations | View/approve/export registrations |
| `/admin/registrations` | All Registrations | Global registrations table with filters |

---

## 15. Implementation Priority

### Phase 1: Event Detail Page
- Enhanced Event model with schedule, rules, prizes, contacts, sponsors
- SportItem model and CRUD
- Event Detail page (public) with all tabs
- Admin: Sport Items manager within event editor

### Phase 2: Registration System
- PublicUser model + auth (email/password + Google)
- Registration model and CRUD
- Registration forms (individual, team, group)
- Admin: Registrations manager

### Phase 3: Payment
- Razorpay integration
- Payment flow (create order → checkout → verify)
- Payment status tracking
- Cart-based multi-sport checkout

### Phase 4: User Dashboard
- User dashboard page
- My registrations list
- Registration detail view
- Cancel registration flow

### Phase 5: Notifications
- Email templates (Nodemailer)
- Registration confirmation
- Payment receipt
- Event reminders
- Admin notifications for new registrations
