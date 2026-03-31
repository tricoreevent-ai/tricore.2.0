# TriCore Events Feature Change Log

This document tracks functional changes in one place.
Theme-only and visual restyling changes are intentionally excluded.

## Local Run and Environment

### Local startup hardening
- `run-app.bat` now starts reliably from the repo root.
- Missing local dependency setup and startup checks were improved so the app can boot on a fresh local machine more reliably.
- Local startup now handles missing local env/bootstrap cases more gracefully.

### Local auth setup
- Local env files were updated so Google sign-in can run during localhost testing.
- The local client now reads the configured Google client ID without requiring manual browser-side entry.

## Data and Reliability

### Database connection fixes
- Local data loading was switched back to the real Atlas-backed flow instead of silently falling back to an empty in-memory database during normal local use.
- Dashboard data loading paths were hardened so brief reconnect issues do not surface raw backend failures as easily.

## Public and Admin Feature Scope

### Public website redesign work
- Public website sections were redesigned using the design reference while preserving the existing content model.
- Content, routes, and data sources were kept intact while the presentation layer was updated.

### Admin portal redesign work
- Admin portal layouts and shared admin screens were redesigned using the admin design reference.
- Shared admin navigation, dashboard surfaces, and page shells were updated without changing the underlying business data structure.

## Calendar and Planning

### Admin calendar readability
- Admin calendar contrast issues were corrected so holiday and schedule labels stay readable.

### Fixture planner usability
- Fixture Planner views were aligned with the dark admin system.
- Planner graph data now keeps group colors and team colors consistent across related nodes.
- Planner graph readability was improved for labels and force-layout rendering.

### Calendar sync and settings
- A new `Calendar & Sync` settings tab was added in Admin Settings.
- Admins can now save sync preferences for the upcoming calendar window.
- The sync window now defaults to at least 90 days.
- Holiday visibility can be controlled for:
  - Indian public holidays
  - regional celebrations
  - religious festivals of India
  - sports observances
  - civic/political observances
  - strike/advisory alerts
- Bundled sports feeds can be toggled on or off from settings.
- Manual `Sync Now` actions are available in both:
  - Admin Settings → `Calendar & Sync`
  - Admin Events → `Planning Calendar`
- Sync history and latest sync status are now stored in settings.

### Bundled sports calendar data
- The local calendar sync now seeds structured sports fixtures for the next planning window.
- IPL entries include teams, venue, and match timing details for the bundled 2026 phase-one window.
- FIFA World Cup 2026 entries include published schedule slots for the bundled upcoming window.
- Synced sports entries now store richer metadata such as:
  - competition name
  - stage label
  - teams/slots
  - source type
  - source link
  - sync identifiers

## Notes
- This file is a human-readable summary, not a replacement for the README or API documentation.
- Theme-only color, layout, and typography changes are intentionally not tracked here unless they shipped with a functional behavior change.
