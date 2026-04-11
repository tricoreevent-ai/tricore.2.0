# TriCore Events User Manual

This manual is the source summary for the in-app help page at `client/public/help/tricore-user-manual.html`.

## Overview

TriCore Events is used to:

- Publish and manage public events.
- Collect registrations and payment proof.
- Track participants, fixtures, accounting, reports, and alerts.
- Manage newsletters, contact requests, and operational settings.

## System Areas

| Area | Main users | Main goal |
| --- | --- | --- |
| Public Website | Visitors, players, team captains, sponsors | Discover events, read content, contact TriCore, and start registration |
| User Area | Signed-in participants | Review registrations, payment status, upcoming matches, and payout details |
| Admin Portal | Coordinators, finance staff, operations, content team, super admins | Run events, review registrations, manage payments, reports, users, and settings |

## Screen Guide

### Public Website

#### Home

- Route: `/`
- Purpose: Introduce TriCore and guide visitors to the most important public actions.
- Description: The home page shows rotating banners, featured events, public content sections, and links to events, corporate services, and contact options.
- Example: A visitor lands on the site, sees the featured tournament cards, and clicks **Explore Events** to view open registrations.

#### About

- Route: `/about`
- Purpose: Explain who TriCore is and build trust with visitors, partners, and sponsors.
- Description: This page presents the brand story, mission, community commitment, partner highlights, and supporting visual content.
- Example: A sponsor reviews the About page before discussing a possible partnership with TriCore.

#### Corporate Events

- Route: `/corporate-events`
- Purpose: Present TriCore’s corporate event offering and encourage enquiries.
- Description: The page explains service areas, event planning value, delivery approach, and contact actions for HR teams or company representatives.
- Example: An HR manager reads the corporate service overview and then opens the Contact page to request a quote.

#### Events

- Route: `/events`
- Purpose: Help visitors discover current and past events.
- Description: This page shows sport filters, upcoming event cards, completed event cards, and a compact calendar view on mobile. It helps visitors understand which events are open, coming soon, or already completed.
- Example: A player filters events by **Cricket**, checks which tournament is open for registration, and opens the event detail page.

#### Event Detail

- Route: `/events/:eventId`
- Purpose: Show full event information and allow registration from one place.
- Description: The page includes event summary information, schedule details, registration timing, participation guidance, and either the registration form or the notify-later panel. Google sign-in is required before the full detail and registration flow can be used.
- Example: A team captain signs in, reviews the event venue, fee, registration deadline, and match schedule, then submits the registration form.

#### Event Payment

- Route: `/events/:eventId/payment`
- Purpose: Collect payment proof for manual payment events.
- Description: This protected page appears after the registration draft is saved. It shows the event fee, available payment methods, payment instructions, and the upload form for payment screenshot and transaction reference.
- Example: After filling the event registration form, a captain pays by UPI, uploads the screenshot, adds the UTR reference, and submits the proof for review.

#### Newsletters

- Route: `/newsletters`
- Purpose: Let visitors read published updates, stories, and event recaps.
- Description: The page includes a newsletter list, search, category filters, recent posts, and summary cards for each published item.
- Example: A visitor searches for `cricket`, filters by category, and opens the latest tournament recap.

#### Newsletter Detail

- Route: `/newsletters/:slug`
- Purpose: Display a full newsletter article.
- Description: This page shows the selected newsletter content, publication details, categories, and links to other recent updates.
- Example: A user opens one announcement from the newsletter list and then uses the recent links to read another update.

#### Contact

- Route: `/contact`
- Purpose: Help visitors start a conversation with the TriCore team.
- Description: The page includes quick contact actions for WhatsApp, phone, and email, plus a form for enquiries about tournaments, support, sponsorship, or corporate event planning.
- Example: A company shares preferred dates, city, and expected audience size through the enquiry form.

#### Legal

- Route: `/legal`
- Purpose: Explain policies, terms, privacy, and refund basics.
- Description: This page groups the public legal content into clear sections such as participation rules, privacy policy, refund highlights, and official communication guidance.
- Example: A participant checks the refund rules before completing a paid registration.

#### Partner Access

- Route: `/partner-access`
- Purpose: Provide a sponsor or partnership landing page.
- Description: This page is designed for sponsor outreach and partnership conversations. Admins can share it directly instead of exposing it in the public menu.
- Example: A manager copies the partner-access link and sends it to a sponsor prospect.

### User Area

#### User Dashboard

- Route: `/dashboard`
- Purpose: Give signed-in users one place to review their participation history and account details.
- Description: The dashboard shows registered events, registration status, payment status, upcoming matches, and refund or payout details such as UPI and bank information.
- Example: A player checks whether payment moved from **Under Review** to **Confirmed**, then updates payout details in case a refund is needed later.

### Admin Portal

Admin portal visibility depends on the logged-in staff member’s permissions.

#### Admin Login

- Route: `/admin-portal/login`
- Purpose: Securely sign staff into the operations workspace.
- Description: This screen is the entry point for admins and coordinators before they can access event, payment, content, reporting, or settings tools.
- Example: A registration coordinator signs in at the start of the day before opening the admin overview.

#### Admin Overview

- Route: `/admin-portal`
- Purpose: Give staff a single operational snapshot of the platform.
- Description: The overview page includes stat cards, revenue trend, participation mix, quick navigation tiles, payment status distribution, a 30-day planning calendar, recent payments, recent alerts, a sponsorship share link, and an upcoming event window.
- Example: A manager opens the overview, checks the open alerts count, and then jumps directly into **Registration Review**.

#### Event Management

- Route: `/admin-portal/events`
- Purpose: Create, edit, filter, hide, and control public events.
- Description: This page combines the event form, a filtered event catalog, a list or calendar view toggle, and actions such as edit, delete, show or hide, enable or disable registration, and manage interested users who clicked notify later.
- Example: An admin edits a cricket event, changes the registration dates, hides it temporarily from the public website, and later re-enables it.

#### Newsletters

- Route: `/admin-portal/newsletters`
- Purpose: Manage public newsletters and categories.
- Description: This screen includes the newsletter form, category manager, and newsletter catalog. Staff can create drafts, publish or schedule articles, edit content, and remove old posts.
- Example: A content lead creates a draft recap, assigns two categories, and schedules publication for the next morning.

#### Registrations

- Route: `/admin-portal/registrations`
- Purpose: Review registrations and confirm payments.
- Description: The page includes a filter panel, paginated registration cards, inline participant editing, player lists, payment proof preview, payment mode selection, reference entry, export tools, and payment confirmation actions.
- Example: A finance user filters one event, opens a registration, checks the uploaded receipt, enters the UPI reference, and clicks **Confirm Payment**.

#### Schedule Management

- Route: `/admin-portal/matches`
- Purpose: Run match and fixture operations for an event.
- Description: This workspace starts with event selection and then opens a tabbed match operations area for format configuration, auto fixture generation, manual adjustment, points setup, team and player management, result entry, knockout setup, notifications, and the match calendar.
- Example: An operations lead selects an event, generates knockout fixtures, adjusts one venue manually, and publishes the match schedule.

#### Accounting

- Route: `/admin-portal/accounting`
- Purpose: Record financial transactions and review the ledger.
- Description: The accounting screen has three main views: record transaction, transaction ledger, and manage categories. It is focused on transaction entry and ledger review, while higher-level financial reporting is handled in Reports.
- Example: An accounts user records a venue expense, then opens the ledger view to review filtered income and expense movement for the month.

#### Reports Hub

- Route: `/admin-portal/reports`
- Purpose: Review business performance, history, and alerts.
- Description: This page is organized into tabs such as Overview, Finance, Activity, and Alerts. It supports exports, date filtering, event filtering, payment status analysis, profit and loss review, operational history, and security or system alert tracking.
- Example: Leadership opens the Finance tab to compare income and expenses for a selected date range, then checks Alerts for unresolved payment or API issues.

#### Users

- Route: `/admin-portal/users`
- Purpose: Manage both platform users and admin access control.
- Description: This workspace includes audience users, campaigns, admin accounts, role templates, page-level access assignment, admin creation and editing, and password management.
- Example: A super admin creates a limited-access account for a registrations-only staff member and reviews the access preview before saving.

#### Settings

- Route: `/admin-portal/settings`
- Purpose: Configure system-wide business and platform settings.
- Description: This is a tabbed workspace that covers contact routing, email setup, invoice defaults, appearance, home banners, gallery and testimonials, website settings, calendar sync, backups, security controls, and payment settings.
- Example: A super admin updates the payment proof inbox email, uploads a new QR code, sends a test email, and verifies the new settings.

#### User Manual

- Route: `/admin-portal/user-manual`
- Purpose: Provide built-in training and onboarding help.
- Description: This page embeds the TriCore help guide inside the admin portal and also offers a full-screen help version for training sessions and printing.
- Example: A new staff member keeps the user manual open while learning how to review registrations and confirm payments.

## Common Workflows

### Participant Registration Flow

1. Open the `Events` page.
2. Choose an event card.
3. Sign in with Google on the event detail page.
4. Review dates, venue, fee, and registration rules.
5. Fill the registration form.
6. If the event is paid, continue to the payment page and upload payment proof.
7. Check the `User Dashboard` for payment and registration updates.

### Admin Payment Confirmation Flow

1. Open `Registrations`.
2. Select the date range and apply filters.
3. Open the registration card that needs review.
4. Verify the payment screenshot and reference.
5. Choose the accounting mode if needed.
6. Click `Confirm Payment`.
7. Re-check dashboards or reports if the payment must be reflected in summaries.

### Admin Event Publishing Flow

1. Open `Event Management`.
2. Create a new event or edit an existing one.
3. Save the event details.
4. Apply filters to load the catalog.
5. Enable registration when the event is ready.
6. Keep the event visible if it should appear on the public website.

### Admin Content Update Flow

1. Open `Newsletters` or `Settings`.
2. Update the required content.
3. Save the changes.
4. Verify the matching public page.

## Important Notes

- Full event detail access and registration require Google sign-in.
- The payment page is only useful after a registration draft has been saved.
- Manual payment submissions enter the system as **Under Review** until an admin confirms them.
- Many admin screens use default date ranges, but data does not load until `Apply Filters` or the equivalent action is used.
- Hidden events do not appear on the public website.
- Accounting is used for transaction entry and ledger review, while Reports is used for summarized analysis.
