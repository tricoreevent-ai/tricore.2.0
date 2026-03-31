# TriCore Events — Admin Portal Expansion Plan

Last updated: 28 March 2026

---

## Key Decisions from Stakeholder Review

1. **Admin and Business Owner are the SAME person** — no separate CEO role needed. The Admin IS the business owner.
2. **Waitlist auto-promotion + player transfers** — overkill for now, removed from scope.
3. **Check-in (QR codes)** — optional feature, configurable per event in event setup. Not mandatory.
4. **Post-event lifecycle** — good to have, only works if the organizer feeds in data. Not automated.
5. **Multi-channel comms (SMS/WhatsApp)** — must be configurable from admin Settings, not hardcoded.
6. **Calendar view** — must incorporate Indian public holidays AND major sports schedules (IPL, ISL, PKL, etc.).

---

## 1. Role-Based Access Control

### Current: 2 roles (admin, editor)
### Needed: 6 roles (Admin = Business Owner)

| Role | Sees | Can Do | Cannot Access |
|------|------|--------|---------------|
| **Admin (Business Owner)** | Everything — all events, revenue, analytics, CMS, settings, users | Full system control, assign events to managers, financial reports, analytics dashboard | Nothing restricted |
| **Event Manager** | Only their assigned events, registrations, sport items, revenue summary | Edit event details, manage sport items, approve registrations, send communications | Other managers' events, CMS, site settings, user management, global financial reports |
| **Sports Coordinator** | Assigned sport items within events | Update match results/scores, manage fixtures, venue allocation | Event-level config, pricing, financial data, CMS |
| **Registration Manager** | Registrations for assigned events, check-in tools | Approve/reject, manage waitlist, bulk import, check-in | Event config, CMS, financial authorization |
| **Finance / Accounting** | Payment reports, invoices, expenses, tax summaries | Generate reports, authorize refunds, create invoices, reconcile payments | CMS, event operations, match results |
| **Content Editor** | CMS pages, media library, testimonials, event marketing copy | Edit page sections, upload images | Registration data, financial data, pricing, user management |

### Implementation
- Extend `User.role` enum to 6 values
- Add `User.assignedEvents: [ObjectId]` for scoped access
- Replace `roleGuard.js` with permission-based middleware
- Admin sidebar dynamically shows/hides items per role
- `AuditLog` collection for tracking who did what

---

## 2. Admin Dashboard (Business Owner View)

The Admin IS the business owner. When they log in, they see everything:

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR (grouped)  │ TOP: Dashboard     [Cmd+K] [🔔 3] [👤] │
│                    ├────────────────────────────────────────┤
│ OVERVIEW           │                                        │
│ ● Dashboard        │ ALERT BANNER (conditional)             │
│                    │ "3 registrations pending"    [Review]   │
│ CONTENT            │                                        │
│ ● Pages       ▸   │ ROW 1: STAT CARDS (5)                  │
│ ● Testimonials     │ ┌───────┐┌───────┐┌───────┐┌───────┐┌───────┐
│ ● Media Library    │ │REG    ││REVENUE││ACTIVE ││PENDING││CAPAC- │
│                    │ │TODAY  ││THIS MO││EVENTS ││APPROV ││ITY    │
│ EVENTS             │ │ 12    ││₹45.2K ││ 6     ││ 3     ││ 72%   │
│ ● Events      ▸   │ │+4 ↑  ││+18% ↑ ││2 live ││       ││avg    │
│ ● Calendar    ★    │ └───────┘└───────┘└───────┘└───────┘└───────┘
│ ● Registrations ▸  │                                        │
│                    │ ROW 2: CHARTS (2-column)               │
│ FINANCE            │ ┌────────────────┐┌────────────────┐  │
│ ● Payments         │ │REG TREND (7d)  ││REVENUE (6 mo)  │  │
│ ● Invoices         │ │sparkline chart  ││bar chart       │  │
│ ● Expenses         │ └────────────────┘└────────────────┘  │
│                    │                                        │
│ REPORTS            │ ROW 3: THREE-COLUMN                    │
│ ● Analytics        │ ┌────────┐┌─────────┐┌────────────┐  │
│ ● Reports          │ │CALENDAR││PENDING  ││ACTIVITY    │  │
│                    │ │PREVIEW ││ACTIONS  ││FEED        │  │
│ SETTINGS           │ │(mini   ││         ││            │  │
│ ● Site Settings    │ │month   ││3 regs   ││Admin User  │  │
│ ● Users & Roles    │ │view    ││awaiting ││approved    │  │
│ ● Notifications ★  │ │with    ││         ││#TRI-0849   │  │
│                    │ │dots)   ││1 event  ││2 min ago   │  │
│                    │ │        ││at 90%   ││            │  │
└────────────────────┴────────────────────────────────────────┘
```

★ = New items

---

## 3. Calendar View — The Smart Calendar

This is a KEY feature. Not just a list of TriCore events — it's a **contextual calendar** that shows:

### What Appears on the Calendar

| Source | Color | Purpose |
|--------|-------|---------|
| **TriCore Events** | Gold (#D4AF37) | Your events — clickable, shows details |
| **Indian Public Holidays** | Red | Gazetted holidays — Diwali, Holi, Independence Day, Republic Day, etc. (API or hardcoded list) |
| **IPL Schedule** | Purple | When IPL matches happen, which city — avoid scheduling conflicts |
| **ISL / PKL / Other** | Blue | Indian Super League, Pro Kabaddi, etc. — major sports clashes |
| **Registration Deadlines** | Orange dot | When your event registrations open/close |
| **State Holidays** | Pink | State-specific holidays (configurable by selecting state: Karnataka, Maharashtra, etc.) |

### Calendar Data Sources & Sync

```js
// Admin Settings → Calendar & Sync (new settings tab)
calendarConfig: {
  // --- Holidays ---
  showPublicHolidays: Boolean,      // default: true
  state: String,                     // "Karnataka", "Maharashtra", etc.

  // --- Sports Feeds ---
  sportsFeeds: [{
    name: String,                    // "IPL 2026", "ISL 2025-26", "Premier League"
    sport: String,                   // "cricket" | "football" | "kabaddi" | "other"
    enabled: Boolean,
    color: String,                   // Display color on calendar
    sourceType: String,              // "api" | "manual" | "ical"
    sourceUrl: String,               // API endpoint or iCal URL (for api/ical)
    manualData: [{                   // For manual entry
      date: Date,
      title: String,                 // "CSK vs MI"
      venue: String,
      time: String
    }]
  }],

  // --- Sync Settings ---
  sync: {
    autoSync: Boolean,               // default: false
    syncInterval: String,            // "daily" | "weekly" | "monthly"
    syncTime: String,                // "02:00" (2 AM — off-peak)
    lastSyncAt: Date,
    lastSyncStatus: String           // "success" | "failed" | "partial"
  },

  // --- Custom Calendars ---
  customCalendars: [{
    name: String,                    // "Company Holidays", "School Calendar"
    url: String,                     // iCal URL
    color: String,
    enabled: Boolean
  }]
}
```

### Sports Feeds — Supported Sources

| Sport | Source | Type | Coverage |
|-------|--------|------|----------|
| **Cricket (IPL)** | CricketAPI / ESPN Cricinfo | API or Manual JSON | IPL matches with teams, venues, times |
| **Cricket (International)** | CricketAPI | API | ICC matches, India tours |
| **Football (ISL)** | Football-Data.org / Manual | API or Manual | Indian Super League |
| **Football (Premier League)** | Football-Data.org | API | English Premier League |
| **Football (La Liga, etc.)** | Football-Data.org | API | Major European leagues |
| **Kabaddi (PKL)** | Manual JSON | Manual | Pro Kabaddi League |
| **Custom** | iCal URL | iCal feed | Any calendar feed |

### Sync Configuration (Admin UI)

```
CALENDAR SYNC SETTINGS
┌─────────────────────────────────────────────────────────┐
│  AUTO-SYNC                                              │
│  ● Enable automatic sync    [ON]                        │
│  ┌─────────────────┬─────────────────┐                 │
│  │ Sync Interval   │ Sync Time       │                 │
│  │ [Weekly ▾]      │ [02:00 AM ▾]    │                 │
│  └─────────────────┴─────────────────┘                 │
│                                                         │
│  Last synced: Mar 27, 2026 at 02:00 AM  ✅ Success     │
│                                                         │
│  [🔄 Sync Now]  ← Manual trigger button                │
│                                                         │
│  SYNC LOG                                               │
│  ┌──────────────────────────────────────────┐           │
│  │ Mar 27, 02:00 AM │ ✅ All feeds synced  │           │
│  │ Mar 20, 02:00 AM │ ✅ All feeds synced  │           │
│  │ Mar 13, 02:00 AM │ ⚠️ IPL feed partial  │           │
│  └──────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘

SPORTS FEEDS
┌─────────────────────────────────────────────────────────┐
│ FEED                │ SPORT    │ SOURCE  │ STATUS │     │
│ IPL 2026            │ Cricket  │ API     │ ✅ ON  │ [⚙]│
│ ISL 2025-26         │ Football │ Manual  │ ✅ ON  │ [⚙]│
│ Premier League      │ Football │ API     │ ⬚ OFF │ [⚙]│
│ PKL Season 11       │ Kabaddi  │ Manual  │ ⬚ OFF │ [⚙]│
│                                                         │
│ [+ Add Sports Feed]                                     │
└─────────────────────────────────────────────────────────┘
```

### Manual Feed Entry
When source type is "Manual", admin can add matches/events directly:

```
ADD MATCHES — IPL 2026
┌─────────────────────────────────────────────────────────┐
│ [Upload CSV]  or  add individually:                     │
│                                                         │
│ ┌──────────┬──────────────┬────────────┬──────────┐    │
│ │ Date     │ Match        │ Venue      │ Time     │    │
│ ├──────────┼──────────────┼────────────┼──────────┤    │
│ │ Mar 28   │ CSK vs MI    │ Chennai    │ 7:30 PM  │ 🗑 │
│ │ Mar 29   │ RCB vs DC    │ Bangalore  │ 7:30 PM  │ 🗑 │
│ │ Mar 30   │ KKR vs SRH   │ Kolkata    │ 3:30 PM  │ 🗑 │
│ │ Mar 30   │ GT vs PBKS   │ Ahmedabad  │ 7:30 PM  │ 🗑 │
│ └──────────┴──────────────┴────────────┴──────────┘    │
│ [+ Add Match]                                           │
│                                                         │
│ CSV format: date, title, venue, time                    │
│ [Download CSV Template]                                 │
└─────────────────────────────────────────────────────────┘
```

### Calendar UI

```
┌─────────────────────────────────────────────────────────┐
│  MARCH 2026                    [◀ Month ▶] [Week] [Day] │
├───┬───┬───┬───┬───┬───┬───────────────────────────────┤
│Mon│Tue│Wed│Thu│Fri│Sat│Sun                              │
├───┼───┼───┼───┼───┼───┼───┤
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
│   │   │   │   │   │   │   │
│   │   │   │   │   │WFL│WFL│  ← Weekend Football League
│   │   │   │   │   │🟡 │🟡 │    (gold bar spanning days)
├───┼───┼───┼───┼───┼───┼───┤
│ 8 │ 9 │10 │11 │12 │13 │14 │
│   │   │   │   │   │   │🔴 │  ← Holi (red = public holiday)
│   │   │   │   │   │   │   │
│🟣 │🟣 │   │   │   │🟣 │🟣 │  ← IPL matches (purple dots)
│CSK│MI │   │   │   │RCB│KKR│    with team abbreviations
├───┼───┼───┼───┼───┼───┼───┤
│15 │16 │17 │18 │19 │20 │21 │
│🟡━━━━━━━━━━━━━━━━━━━━━🟡│  ← PCL S4 (gold bar, 6 days)
│PCL│   │   │   │   │PCL│   │
│🟠 │   │   │   │   │   │   │  ← Reg deadline (orange dot)
├───┼───┼───┼───┼───┼───┼───┤
│22 │23 │24 │25 │26 │27 │28 │
│   │   │   │   │   │   │   │
│   │🟣 │   │🟣 │   │🟣 │   │  ← IPL continues
│   │DC │   │SRH│   │GT │   │
└───┴───┴───┴───┴───┴───┴───┘

LEGEND:
🟡 TriCore Events    🔴 Public Holiday    🟣 IPL Match
🟠 Reg Deadline      🔵 ISL/PKL           🩷 State Holiday
```

### Features
- Click a TriCore event → opens event detail/editor
- Click a holiday → shows holiday name + info
- Click an IPL match → shows teams, venue, time
- Hover on a day → tooltip with all items
- Create event → opens event creation wizard with date pre-filled
- **Conflict warning**: if you try to create an event on a day with IPL/holiday, show warning "IPL match in Bangalore on this date — potential audience conflict"
- Toggle visibility of each calendar source via checkboxes in sidebar
- Month/Week/Day views

---

## 4. Notification Settings (Admin Configurable)

New Settings tab: **Notifications & Communications**

Each channel supports **multiple providers** — admin picks one as active.

### 4.1 Email Providers

| Provider | Config Fields | Notes |
|----------|--------------|-------|
| **Nodemailer (SMTP)** | Host, Port, Username, Password, From, Reply-To | Default, works with Gmail/custom SMTP |
| **SendGrid** | API Key, From Email, From Name | Recommended for scale |
| **Twilio SendGrid** | API Key, From Email | Same as SendGrid (Twilio-owned) |
| **AWS SES** | Access Key, Secret, Region, From Email | For AWS-hosted deployments |

### 4.2 SMS Providers

| Provider | Config Fields | Notes |
|----------|--------------|-------|
| **Twilio** | Account SID, Auth Token, From Number | Global, reliable |
| **MSG91** | Auth Key, Sender ID, Route, Template ID | India-focused, DLT compliant |
| **Kaleyra** | API Key, Sender ID | India + international |
| **AWS SNS** | Access Key, Secret, Region | For AWS deployments |

### 4.3 WhatsApp

| Provider | Config Fields | Notes |
|----------|--------------|-------|
| **Meta WhatsApp Business API** (default) | Phone Number ID, Access Token, Business Account ID, Webhook Verify Token | Official Meta API — recommended |
| **Gupshup** | API Key, App Name, Source Number | India-popular alternative |
| **Wati** | API Key, Base URL | Simpler setup |

### Admin UI — Notification Settings

```
┌─────────────────────────────────────────────────────────┐
│  Site Settings                                          │
│  [Branding] [Theme] [Nav] [Footer] [Contact]            │
│  [Notifications] ★  [Calendar] ★  [Backup] ★            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  EMAIL                                          [ON]    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Provider: [SendGrid ▾]                          │   │
│  │                                                  │   │
│  │ ┌─────────────────┬─────────────────┐           │   │
│  │ │ API Key         │ From Email      │           │   │
│  │ │ SG.••••••••     │ noreply@tricore │           │   │
│  │ ├─────────────────┼─────────────────┤           │   │
│  │ │ From Name       │ Reply-To        │           │   │
│  │ │ TriCore Events  │ hello@tricore   │           │   │
│  │ └─────────────────┴─────────────────┘           │   │
│  │ [Test Email →]  Send test to admin email        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  SMS                                            [OFF]   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Provider: [Twilio ▾]                            │   │
│  │                                                  │   │
│  │ ┌─────────────────┬─────────────────┐           │   │
│  │ │ Account SID     │ Auth Token      │           │   │
│  │ │ AC••••••••      │ ••••••••••      │           │   │
│  │ ├─────────────────┼─────────────────┤           │   │
│  │ │ From Number     │                 │           │   │
│  │ │ +1234567890     │                 │           │   │
│  │ └─────────────────┴─────────────────┘           │   │
│  │                                                  │   │
│  │ OR switch to: [MSG91 ▾]                          │   │
│  │ ┌─────────────────┬─────────────────┐           │   │
│  │ │ Auth Key        │ Sender ID       │           │   │
│  │ │ ••••••••••      │ TRICOR          │           │   │
│  │ ├─────────────────┼─────────────────┤           │   │
│  │ │ Route           │ DLT Template ID │           │   │
│  │ │ [Transactional] │ 12345           │           │   │
│  │ └─────────────────┴─────────────────┘           │   │
│  │ [Test SMS →]  Send test to admin phone          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  WHATSAPP                                       [OFF]   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Provider: [Meta WhatsApp Business API ▾]        │   │
│  │                                                  │   │
│  │ ┌─────────────────┬─────────────────┐           │   │
│  │ │ Phone Number ID │ Access Token    │           │   │
│  │ │ 123456789       │ EAA••••••••     │           │   │
│  │ ├─────────────────┼─────────────────┤           │   │
│  │ │ Business Acct ID│ Webhook Token   │           │   │
│  │ │ 987654321       │ tricore_verify  │           │   │
│  │ └─────────────────┴─────────────────┘           │   │
│  │ [Test WhatsApp →]  Send test to admin number    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  NOTIFICATION TRIGGERS                                  │
│  Configure which channels fire per trigger:             │
│  ┌────────────────────────────┬───┬───┬────┐           │
│  │ Trigger                    │📧│📱│💬  │           │
│  ├────────────────────────────┼───┼───┼────┤           │
│  │ Registration confirmed     │ ✓ │ ✓ │ ✓  │           │
│  │ Payment received           │ ✓ │ ✓ │ ○  │           │
│  │ Registration approved      │ ✓ │ ○ │ ○  │           │
│  │ Event reminder (1 day)     │ ✓ │ ✓ │ ✓  │           │
│  │ Event reminder (1 week)    │ ✓ │ ○ │ ○  │           │
│  │ Schedule/venue change      │ ✓ │ ✓ │ ✓  │           │
│  │ Event completed (feedback) │ ✓ │ ○ │ ○  │           │
│  │ Registration cancelled     │ ✓ │ ○ │ ○  │           │
│  └────────────────────────────┴───┴───┴────┘           │
│  ✓ = enabled  ○ = disabled                             │
│  (disabled channels greyed out if provider not set up) │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Model — NotificationConfig (on SiteSettings)

```js
notifications: {
  email: {
    enabled: Boolean,
    provider: String,        // "nodemailer" | "sendgrid" | "aws_ses"
    config: Mixed            // Provider-specific fields
  },
  sms: {
    enabled: Boolean,
    provider: String,        // "twilio" | "msg91" | "kaleyra" | "aws_sns"
    config: Mixed
  },
  whatsapp: {
    enabled: Boolean,
    provider: String,        // "meta" | "gupshup" | "wati"
    config: Mixed
  },
  triggers: {
    registrationConfirmed:   { email: Boolean, sms: Boolean, whatsapp: Boolean },
    paymentReceived:         { email: Boolean, sms: Boolean, whatsapp: Boolean },
    registrationApproved:    { email: Boolean, sms: Boolean, whatsapp: Boolean },
    eventReminder1Day:       { email: Boolean, sms: Boolean, whatsapp: Boolean },
    eventReminder1Week:      { email: Boolean, sms: Boolean, whatsapp: Boolean },
    scheduleChange:          { email: Boolean, sms: Boolean, whatsapp: Boolean },
    eventCompleted:          { email: Boolean, sms: Boolean, whatsapp: Boolean },
    registrationCancelled:   { email: Boolean, sms: Boolean, whatsapp: Boolean }
  }
}
```

---

## 5. Database Backup System

New Settings tab: **Backup & Maintenance**

Admin can trigger a full database backup, zip it, and email it to configured recipients.

### Admin UI

```
┌─────────────────────────────────────────────────────────┐
│  Site Settings                                          │
│  [Branding] [Theme] [Nav] [Footer] [Contact]            │
│  [Notifications] [Calendar] [Backup & Maintenance] ★    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DATABASE BACKUP                                        │
│                                                         │
│  MANUAL BACKUP                                          │
│  [🔄 Backup Now]  ← Triggers immediate backup           │
│                                                         │
│  Status: Last backup Mar 27, 2026 at 02:00 AM           │
│  Size: 14.2 MB (compressed)                             │
│  Collections: 18 (all included)                         │
│                                                         │
│  AUTOMATIC BACKUP                                       │
│  ● Enable scheduled backups  [ON]                       │
│  ┌─────────────────┬─────────────────┐                 │
│  │ Frequency       │ Time            │                 │
│  │ [Daily ▾]       │ [02:00 AM ▾]    │                 │
│  └─────────────────┴─────────────────┘                 │
│  Retention: Keep last [7 ▾] backups                     │
│                                                         │
│  EMAIL RECIPIENTS                                       │
│  Send backup zip to these email addresses:              │
│  ┌─────────────────────────────────────────┐           │
│  │ admin@tricoreevents.com              [✕]│           │
│  │ vikram@tricoreevents.com             [✕]│           │
│  │ backup@company-storage.com           [✕]│           │
│  └─────────────────────────────────────────┘           │
│  [+ Add Email]                                          │
│                                                         │
│  BACKUP OPTIONS                                         │
│  ● Include uploaded media files  [OFF]                  │
│    (Warning: media can be large — 500MB+)               │
│  ● Encrypt backup with password  [OFF]                  │
│    Password: [________________]                         │
│                                                         │
│  BACKUP HISTORY                                         │
│  ┌────────────────────────┬──────┬────────┬──────┐     │
│  │ Date                   │ Size │ Status │      │     │
│  ├────────────────────────┼──────┼────────┼──────┤     │
│  │ Mar 27, 02:00 AM       │14.2MB│ ✅ Sent│ [📥] │     │
│  │ Mar 26, 02:00 AM       │14.1MB│ ✅ Sent│ [📥] │     │
│  │ Mar 25, 02:00 AM       │13.9MB│ ✅ Sent│ [📥] │     │
│  │ Mar 24, 02:00 AM       │13.8MB│ ⚠️ Email│ [📥] │     │
│  │                        │      │  failed│      │     │
│  │ Mar 23, 02:00 AM       │13.6MB│ ✅ Sent│ [📥] │     │
│  └────────────────────────┴──────┴────────┴──────┘     │
│  [📥] = Download backup directly from server            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Model — BackupConfig (on SiteSettings)

```js
backup: {
  autoBackup: Boolean,              // default: false
  frequency: String,                // "daily" | "weekly" | "monthly"
  time: String,                     // "02:00" (24h format)
  retention: Number,                // Keep last N backups (default: 7)
  emailRecipients: [String],        // Email addresses to send zip to
  includeMedia: Boolean,            // Include uploads/ folder (default: false)
  encryptBackup: Boolean,           // Encrypt zip with password
  encryptionPassword: String,       // Only if encrypt is true
  lastBackupAt: Date,
  lastBackupStatus: String,         // "success" | "failed"
  lastBackupSize: Number            // Bytes
}
```

### Implementation

1. **Backup Service** (`backupService.js`):
   - Uses `mongodump` to export all collections
   - Compresses to `.zip` using `archiver`
   - Optionally includes `server/uploads/` directory
   - Optionally encrypts with password (using `node-7z` or similar)
   - Sends zip via email using configured email provider
   - Stores backup metadata in a `BackupHistory` array on SiteSettings

2. **API Endpoints**:
   - `POST /api/admin/backup/trigger` — Trigger immediate backup
   - `GET /api/admin/backup/history` — List backup history
   - `GET /api/admin/backup/download/:id` — Download a specific backup file

3. **Cron Job** (`node-cron`):
   - Reads `backup.frequency` and `backup.time` from SiteSettings
   - Runs `backupService.runBackup()` at configured schedule
   - Sends email with zip attachment
   - Updates `lastBackupAt` and `lastBackupStatus`

---

## 6. Check-In System (Optional per Event)

### Configurable in Event Setup

In the Event Editor → Basic Info tab, add:

```
OPTIONAL FEATURES
● Enable check-in system    [OFF]
  └ When enabled:
    ● Generate QR codes for registrations  [ON]
    ● Allow manual check-in               [ON]
    ● Send QR code via email              [ON]
    ● Send QR code via SMS                [OFF]
```

When enabled:
- Registration confirmation includes a QR code
- Admin gets a "Check-In" button on the event page
- Mobile check-in page at `/admin/events/:id/check-in`
- Check-in dashboard shows arrived vs expected count

When disabled:
- No QR codes generated
- No check-in dashboard
- Registration flow works exactly as before

---

## 7. Post-Event Features (Organizer-Fed Data)

These features only work when the organizer manually inputs data. No auto-generation.

### What the organizer can do (after event is marked "completed"):

1. **Upload Results** — Enter final standings, winners for each sport item. Only shows on public page if organizer fills it in.

2. **Upload Photos** — Bulk upload event gallery. Optional.

3. **Generate Certificates** — Only if organizer uploads a certificate template and clicks "Generate." Not automatic.

4. **Request Feedback** — Organizer clicks "Send Feedback Request" → emails go out with survey link. Optional action, not automatic.

5. **Write Post-Event Report** — Rich text editor for the organizer to write a summary. Published to the event detail page if they choose.

### Key Principle
Nothing is automated or mandatory. The organizer decides what to do after an event. The system just provides the tools if they want to use them.

---

## 8. Financial Management

### New Screens for Admin (Business Owner)

| Screen | What it Shows |
|--------|-------------|
| **Payments** | All payments with status (Paid/Pending/Failed/Refunded), filter by event/date/status |
| **Outstanding** | Who hasn't paid — grouped by event, with "Send Reminder" button |
| **Invoices** | Generate + track invoices for corporate clients (PDF with GST) |
| **Expenses** | Per-event expense tracking (venue, equipment, catering, etc.) |
| **P/L Report** | Per event: Revenue - Expenses = Profit |
| **GST Report** | Monthly tax summary for accountant (exportable) |

---

## 9. Registration Enhancements (Kept in Scope)

| Feature | Status | Notes |
|---------|--------|-------|
| Waitlist auto-promotion | ❌ Removed | Overkill — manual waitlist management is enough |
| Player transfers | ❌ Removed | Overkill — handled manually by admin |
| Early bird pricing | ✅ Keep | Time-based pricing tiers per sport item |
| Promo codes | ✅ Keep | Essential for marketing and sponsors |
| Bulk CSV import | ✅ Keep | Critical for corporate registrations |
| Registration amendments | ✅ Keep | Admin can edit registration details post-payment |

---

## 10. Updated Navigation (Grouped Sidebar)

```
OVERVIEW
  ● Dashboard

CONTENT
  ● Pages        ▸    (expandable: Home, About, Corporate, Events, Contact)
  ● Testimonials
  ● Media Library

EVENTS
  ● Events       ▸    (expandable: shows recent events by name)
  ● Calendar     ★    (Smart Calendar with holidays + sports)
  ● Registrations ▸   (expandable: All, Pending badge)

FINANCE
  ● Payments
  ● Invoices
  ● Expenses

REPORTS
  ● Analytics
  ● Reports

SETTINGS
  ● Site Settings      (now with Notifications tab)
  ● Users & Roles  ★
```

---

## 11. Implementation Priority (Revised)

| Phase | Weeks | What | Why |
|-------|-------|------|-----|
| **A** | 1-3 | Admin Dashboard (revenue, charts, pipeline, activity feed) | Business visibility |
| **B** | 4-5 | Calendar View (TriCore events + holidays + IPL/football/cricket sync) | Scheduling intelligence |
| **C** | 6-7 | Role-based access (6 roles, event assignment, permission middleware) | Team delegation |
| **D** | 8-9 | Multi-provider notifications (email: SendGrid/SMTP, SMS: Twilio/MSG91, WhatsApp: Meta) | Communication |
| **E** | 10-11 | Financial screens (payments, invoices, expenses, P/L) | Business controls |
| **F** | 12-13 | DB backup system (manual trigger + scheduled + email delivery) | Data safety |
| **G** | 14-15 | Optional check-in + post-event tools | Operations |
| **H** | 16-17 | Analytics + reports + promo codes | Growth |
| **I** | 18 | Mobile responsive admin | On-ground ops |
