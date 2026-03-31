# TriCore Events -- Design System

Last updated: 28 March 2026

---

## 1. Overview

### Design Philosophy

**Brutalist luxury, dark-first, gold accents.**

TriCore's visual identity fuses brutalist geometry -- sharp edges, raw grids, no border-radius by default -- with luxury-tier refinement through a restrained gold palette, generous whitespace, and typographic precision. Every surface is dark; every accent is gold. The result reads as confident, premium, and unmistakably intentional.

### Brand Personality

| Trait | Expression |
|-------|-----------|
| Professional | Clean grids, consistent spacing, label-driven typography |
| Bold | 72px headlines, 800-weight type, high-contrast color |
| Premium | Gold accents, editorial spacing, no visual clutter |
| Trustworthy | Consistent patterns, accessible contrast, reliable layouts |

### Target Platforms

- **Primary**: Web (React 18 + Vite + Tailwind CSS)
- **Responsive**: 390px (mobile), 768px (tablet), 1440px (desktop)
- **Browsers**: Chrome, Safari, Firefox, Edge (latest 2 versions)
- **Icons**: Lucide React

---

## 2. Design Tokens

### 2.1 Colors

#### CSS Custom Properties

```css
:root {
  /* Primary */
  --color-primary:       #D4AF37;
  --color-primary-hover:  #E0BF45;
  --color-primary-dim:    rgba(212, 175, 55, 0.08);
  --color-primary-20:     rgba(212, 175, 55, 0.12);
  --color-primary-30:     rgba(212, 175, 55, 0.18);
  --color-primary-border: rgba(212, 175, 55, 0.20);

  /* Backgrounds */
  --color-bg:           #0A0A0A;
  --color-bg-alt:       #111111;
  --color-surface:      #141414;
  --color-surface-card: #1A1A1A;

  /* Text */
  --color-text:         #FFFFFF;
  --color-text-muted:   #A0A0A0;
  --color-text-dim:     #666666;

  /* Borders */
  --color-border:       #2A2A2A;
  --color-border-light: rgba(42, 42, 42, 0.5);

  /* Status */
  --color-green:  #4CAF50;
  --color-blue:   #2196F3;
  --color-red:    #F44336;

  /* Gradients */
  --gradient-logo: linear-gradient(180deg, #D4AF37, #B8962E);
  --gradient-hero-overlay: linear-gradient(to bottom, #0A0A0AFF 0%, #0A0A0A00 50%, #0A0A0ACC 100%);
  --gradient-cta-overlay: radial-gradient(circle, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.93) 100%);
  --gradient-card-overlay: linear-gradient(to bottom, transparent 0%, #111111 70%);
}
```

#### Tailwind Mapping

```js
// tailwind.config.js → theme.extend.colors
colors: {
  primary:   'var(--color-primary)',
  'primary-hover': 'var(--color-primary-hover)',
  'primary-dim': 'var(--color-primary-dim)',
  'primary-20': 'var(--color-primary-20)',
  'primary-30': 'var(--color-primary-30)',
  'primary-border': 'var(--color-primary-border)',
  bg:        'var(--color-bg)',
  'bg-alt':  'var(--color-bg-alt)',
  surface:   'var(--color-surface)',
  card:      'var(--color-surface-card)',
  'text-primary': 'var(--color-text)',
  'text-muted':   'var(--color-text-muted)',
  'text-dim':     'var(--color-text-dim)',
  border:    'var(--color-border)',
  'border-light': 'var(--color-border-light)',
  green:     'var(--color-green)',
  blue:      'var(--color-blue)',
  red:       'var(--color-red)',
}
```

#### Opacity Variants Reference

| Token | Value | Usage |
|-------|-------|-------|
| `primary-dim` | 8% opacity | Backgrounds for gold badges, active nav items, avatars |
| `primary-20` | 12% opacity | Tag backgrounds, pillar badges, event tags |
| `primary-30` | 18% opacity | Decorative numbers, secondary gold elements |
| `primary-border` | 20% opacity | Borders on active/highlighted elements |
| `white-3` | `rgba(255,255,255,0.03)` | Hover backgrounds on dark surfaces |
| `white-5` | `rgba(255,255,255,0.05)` | Category badge backgrounds |
| `white-8` | `rgba(255,255,255,0.08)` | Color swatch borders |
| `white-20` | `rgba(255,255,255,0.2)` | Outline button borders (default) |

---

### 2.2 Typography

**Font Family**: Space Grotesk (Google Fonts)
**Weights loaded**: 400, 500, 600, 700, 800

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**CSS base**:
```css
body {
  font-family: 'Space Grotesk', sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

#### Type Scale

| Name | Size | Weight | Tracking | Line Height | Color | Usage | Tailwind |
|------|------|--------|----------|-------------|-------|-------|----------|
| Display | 72px | 800 | -2px | 0.95 | white | Hero headline | `text-[72px] font-extrabold tracking-[-2px] leading-[0.95]` |
| Decorative Number | 64px | 800 | -2px | 1 | primary-30 | Pillar numbers | `text-[64px] font-extrabold tracking-[-2px] text-primary-30` |
| Quote | 48px | 800 | 0 | 0.5 | primary | Testimonial quote mark | `text-5xl font-extrabold text-primary` |
| Heading 1 | 48px | 800 | -1px | 1.05 | white | Section titles (trust) | `text-5xl font-extrabold tracking-[-1px] leading-[1.05]` |
| Heading 2 | 42px | 800 | -1px | 1.1 | white | Section titles, login h1 | `text-[42px] font-extrabold tracking-[-1px]` |
| Heading 3 | 36px | 800 | -1px | 1 | white | Stat card values | `text-4xl font-extrabold tracking-[-1px]` |
| Stat Value (hero) | 32px | 800 | -1px | 1 | primary | Hero stats bar | `text-[32px] font-extrabold tracking-[-1px] text-primary` |
| Heading 4 | 28px | 800 | 1px | 1.1 | white | Pillar titles, login h2 | `text-[28px] font-extrabold tracking-[1px]` |
| Logo | 22px | 800 | 4px | 1 | white | Logo text | `text-[22px] font-extrabold tracking-[4px]` |
| Top Bar Title | 20px | 700 | 0 | 1.3 | white | Admin top bar, event titles | `text-xl font-bold` |
| Body Large | 18px | 400 | 0 | 1.6 | text-muted | Hero subtitle | `text-lg font-normal leading-relaxed text-text-muted` |
| Sidebar Logo | 16px | 800 | 3px | 1 | white | Admin sidebar logo | `text-base font-extrabold tracking-[3px]` |
| Body | 16px | 400 | 0 | 1.7 | text-muted | Section descriptions, trust | `text-base font-normal leading-relaxed text-text-muted` |
| Partner Title | 16px | 700 | 1px | 1.3 | white | Partner card headings | `text-base font-bold tracking-[1px]` |
| Testimonial | 15px | 400 | 0 | 1.7 | text-muted | Testimonial body text | `text-[15px] font-normal leading-relaxed text-text-muted` |
| Settings Title | 14px | 700 | 1px | 1.4 | white | Settings section headings | `text-sm font-bold tracking-[1px]` |
| Body Small | 14px | 400 | 0 | 1.6 | text-muted | Descriptions, pillar desc | `text-sm font-normal leading-relaxed text-text-muted` |
| Breadcrumb | 14px | 600 | 0 | 1 | white/dim | Breadcrumb active/inactive | `text-sm font-semibold` |
| Button Large | 14px | 700 | 2px | 1 | bg (on gold) | Primary CTA, gold large | `text-sm font-bold tracking-[2px] uppercase` |
| Table Data | 13px | 400-500 | 0 | 1.5 | white/muted | Table cells, nav items, form inputs | `text-[13px]` |
| Nav Link (public) | 12px | 500 | 2px | 1 | text-muted | Header navigation | `text-xs font-medium tracking-[2px] uppercase text-text-muted` |
| Button | 12px | 700 | 2px | 1 | bg (on gold) | Standard buttons | `text-xs font-bold tracking-[2px] uppercase` |
| Button Ghost | 12px | 500 | 0 | 1 | text-muted | Ghost buttons | `text-xs font-medium text-text-muted` |
| Panel Title | 12px | 700 | 2px | 1 | white | Panel headers | `text-xs font-bold tracking-[2px] uppercase` |
| Footer Link | 13px | 400 | 0 | 1 | text-muted | Footer nav links | `text-[13px] font-normal text-text-muted` |
| Footer Copy | 12px | 400 | 0 | 1 | text-dim | Copyright text | `text-xs font-normal text-text-dim` |
| Label | 11px | 600-700 | 2-3px | 1 | text-muted/primary | Section labels, badge text | `text-[11px] font-semibold tracking-[2px] uppercase` |
| Filter Chip | 11px | 500 | 1px | 1 | text-muted | Filter chips | `text-[11px] font-medium tracking-[1px]` |
| Meta | 11px | 500 | 1px | 1.4 | text-muted | Event metadata, sidebar role | `text-[11px] font-medium tracking-[1px] text-text-muted` |
| Table Header | 10px | 600 | 2px | 1 | text-dim | Data table headers | `text-[10px] font-semibold tracking-[2px] uppercase text-text-dim` |
| Form Label | 10px | 600 | 2px | 1 | text-muted | Form field labels | `text-[10px] font-semibold tracking-[2px] uppercase text-text-muted` |
| Badge | 10px | 600 | 1-2px | 1 | varies | Status badges, event tags | `text-[10px] font-semibold tracking-[1px] uppercase` |
| Logo Tag | 10px | 500 | 3px | 1 | primary | Logo "EVENTS" tag (public) | `text-[10px] font-medium tracking-[3px] text-primary` |
| Admin Logo Tag | 9px | 600 | 2px | 1 | primary | Logo "ADMIN" tag (admin) | `text-[9px] font-semibold tracking-[2px] text-primary` |
| Color Hex | 11px | 400 | 0 | 1 | text-muted | Color hex display | `text-[11px] font-normal font-mono text-text-muted` |
| Upload Sub | 10px | 400 | 0 | 1 | text-dim | Upload zone helper text | `text-[10px] text-text-dim` |
| Stat Label (hero) | 10px | 500 | 1.5px | 1.4 | text-muted | Hero stats bar labels | `text-[10px] font-medium tracking-[1.5px] text-text-muted` |

---

### 2.3 Spacing Scale

All values are in pixels. Use Tailwind arbitrary values or extend the spacing config.

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Micro gaps, toggle padding |
| `1.5` | 6px | Label margin-bottom, small gaps |
| `2` | 8px | Badge padding, icon gaps, small padding, chip padding, nav-editor gap |
| `2.5` | 10px | Logo gap, textarea padding, sidebar avatar gap, color swatch padding |
| `3` | 12px | Nav item gap, form input padding, sidebar nav padding, breadcrumb gap, action gap |
| `3.5` | 14px | Event card content gap, pillar card content gap |
| `4` | 16px | Section gap, grid gap, CTA gap, hero badge padding, footer link margin |
| `5` | 20px | Form group margin, stats grid gap, pillar card padding, partner card gap, table header padding |
| `6` | 24px | Grid gap, sidebar logo padding, card content padding, admin content padding, footer col gap, section header margin |
| `7` | 28px | Hero content gap, CTA content gap, editor header margin |
| `8` | 32px | Admin content area padding, pillar card padding, testimonial card padding, admin top bar padding |
| `10` | 40px | Pillar card bottom padding, footer bottom padding |
| `12` | 48px | Events header bottom margin, footer top bottom margin |
| `15` | 60px | Pillars header bottom margin, testimonials header bottom margin, footer top padding, mobile section padding |
| `20` | 80px | Hero stats bar padding, trust grid gap, login left padding, footer column gap |
| `25` | 100px | Section vertical padding (pillars, trust, events, testimonials) |
| `30` | 120px | Section horizontal padding (desktop), hero content left padding, login right padding |

---

### 2.4 Corner Radius

| Token | Value | Usage | Tailwind |
|-------|-------|-------|----------|
| `none` | 0px | Default for all elements -- buttons, cards, inputs, badges, tables | `rounded-none` (default) |
| `sm` | 2px | Status badge radius | `rounded-sm` |
| `DEFAULT` | 4px | Nav items, section items, screen nav toggle, screen nav panel | `rounded` |
| `lg` | 9px | Toggle switch, toggle knob | `rounded-[9px]` |
| `xl` | 16px | Reserved for future use | `rounded-2xl` |
| `full` | 50% / 9999px | Avatar circles, dots, toggle knob circles | `rounded-full` |

**Important**: The design uses 0px radius by default. Buttons, cards, inputs, badges, and tables are all sharp-edged. Only toggle switches and avatars use rounded corners.

---

### 2.5 Shadows & Effects

This design system uses **no box-shadows** on standard components. Depth is conveyed through border color, background color differences, and opacity shifts.

#### Hover Shadows (exceptions)

```css
/* Pillar card hover -- subtle gold glow */
box-shadow: 0 16px 48px rgba(212, 175, 55, 0.1);

/* Primary button hover -- gold glow */
box-shadow: 0 0 24px rgba(212, 175, 55, 0.3);

/* Testimonial card hover -- subtle gold glow */
box-shadow: 0 0 24px rgba(212, 175, 55, 0.05);

/* Screen nav panel (admin prototype only) */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
```

#### Backdrop Blur

```css
/* Scrolled header */
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
background: rgba(10, 10, 10, 0.85);

/* Hero stats bar */
backdrop-filter: blur(10px);
background: rgba(17, 17, 17, 0.8);
```

#### Overlays

| Context | Implementation |
|---------|---------------|
| Hero | `linear-gradient(to bottom, #0A0A0AFF 0%, #0A0A0A00 50%, #0A0A0ACC 100%)` over 0.4 opacity bg image |
| Card (pillar) | `linear-gradient(to bottom, transparent 0%, #111111 70%)` |
| CTA | `radial-gradient(circle, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.93) 100%)` over 0.25 opacity bg |
| Login split | `linear-gradient(90deg, #0A0A0AFF 0%, #0A0A0A88 50%, #0A0A0AFF 100%)` over 0.3 opacity bg |

---

### 2.6 Z-Index Scale

| Token | Value | Usage | Tailwind |
|-------|-------|-------|----------|
| `base` | 0 | Default stacking context | `z-0` |
| `content` | 1 | Hero content, card content over overlays | `z-[1]` |
| `overlay` | 2 | Hero stats bar | `z-[2]` |
| `dropdown` | 50 | Dropdown menus, select panels | `z-50` |
| `header` | 100 | Fixed header / navbar | `z-[100]` |
| `modal` | 200 | Modal dialogs | `z-[200]` |
| `modal-overlay` | 199 | Modal backdrop | `z-[199]` |
| `toast` | 300 | Toast notifications | `z-[300]` |
| `tooltip` | 400 | Tooltips | `z-[400]` |

---

## 3. Components

### 3.1 Button

#### Variants

| Variant | Background | Text Color | Border | Font | Padding | Height |
|---------|-----------|------------|--------|------|---------|--------|
| Primary | `--color-primary` | `--color-bg` (#0A0A0A) | none | 14px/700/2px tracking | 16px 36px | auto |
| Outline | transparent | `--color-text` | 1px solid `rgba(255,255,255,0.2)` | 14px/600/2px tracking | 16px 36px | auto |
| Gold (admin) | `--color-primary` | `--color-bg` | none | 12px/700/0 tracking | 8px 20px | auto |
| Gold Large | `--color-primary` | `--color-bg` | none | 14px/700/2px tracking | 0 | 52px (full width) |
| Ghost | transparent | `--color-text-muted` | 1px solid `--color-border` | 12px/500/0 | 8px 16px | auto |
| Destructive | transparent | `--color-red` | 1px solid `--color-border` | 12px/500/0 | 8px 16px | auto |
| Icon Button (table) | transparent | `--color-text-dim` | 1px solid `--color-border` | -- | 0 | 28x28px |
| Add Item | transparent | `--color-primary` | 1px dashed `--color-border` | 12px/500/0 | 8px 12px | auto |

#### States

| State | Primary | Outline | Ghost | Icon Button |
|-------|---------|---------|-------|-------------|
| Default | as above | as above | as above | as above |
| Hover | opacity 0.9, scale 1.02, gold glow shadow | border white 100%, color white | -- | border gold, color gold, bg primary-dim |
| Active | scale 0.98 | scale 0.98 | -- | -- |
| Focus | 2px solid gold outline, 2px offset | 2px solid gold outline, 2px offset | 2px solid gold outline, 2px offset | 2px solid gold outline |
| Disabled | opacity 0.4, cursor not-allowed | opacity 0.4 | opacity 0.4 | opacity 0.4 |

#### Accessibility

- All buttons use `<button>` or `<a>` with `role="button"`
- `aria-label` required for icon-only buttons
- `aria-disabled="true"` for disabled state (not just `disabled` attribute)
- Focus ring: `outline: 2px solid var(--color-primary); outline-offset: 2px;`
- Keyboard: `Enter` and `Space` activate

#### Code Examples

```jsx
{/* Primary */}
<button className="inline-flex items-center gap-2.5 px-9 py-4 bg-primary text-bg text-sm font-bold tracking-[2px] uppercase transition-all hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] active:scale-[0.98] focus:outline-2 focus:outline-primary focus:outline-offset-2">
  EXPLORE EVENTS
  <ArrowRight className="w-[18px] h-[18px]" />
</button>

{/* Outline */}
<button className="inline-flex items-center px-9 py-4 bg-transparent border border-white/20 text-white text-sm font-semibold tracking-[2px] uppercase transition-all hover:border-white hover:text-white active:scale-[0.98] focus:outline-2 focus:outline-primary focus:outline-offset-2">
  CORPORATE INQUIRY
</button>

{/* Gold (admin) */}
<button className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-bg text-xs font-bold border-none cursor-pointer hover:opacity-90 focus:outline-2 focus:outline-primary focus:outline-offset-2">
  <Plus className="w-3.5 h-3.5" />
  CREATE EVENT
</button>

{/* Gold Large (full width) */}
<button className="w-full h-[52px] bg-primary text-bg text-sm font-bold tracking-[2px] uppercase border-none flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 focus:outline-2 focus:outline-primary focus:outline-offset-2">
  SAVE CHANGES
</button>

{/* Ghost */}
<button className="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-transparent text-text-muted text-xs font-medium cursor-pointer focus:outline-2 focus:outline-primary focus:outline-offset-2">
  <Download className="w-3.5 h-3.5" />
  Export
</button>

{/* Icon Button (table actions) */}
<button className="w-7 h-7 flex items-center justify-center border border-border bg-transparent text-text-dim cursor-pointer transition-all hover:border-primary hover:text-primary hover:bg-primary-dim focus:outline-2 focus:outline-primary" aria-label="Edit event">
  <Pencil className="w-3.5 h-3.5" />
</button>

{/* Add Item */}
<button className="inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-border bg-transparent text-primary text-xs font-medium cursor-pointer hover:border-primary focus:outline-2 focus:outline-primary focus:outline-offset-2">
  <Plus className="w-3 h-3" />
  Add Link
</button>
```

---

### 3.2 Input

#### Variants

| Variant | Height | Font Size | Padding | Background | Border |
|---------|--------|-----------|---------|-----------|--------|
| Default | 40px | 13px | 0 12px | `--card` (#1A1A1A) | 1px solid `--border` |
| Small | 36px | 12px | 0 12px | `--card` | 1px solid `--border` |
| Textarea | min 80px | 13px | 10px 12px | `--card` | 1px solid `--border` |
| Search | 40px | 13px | 0 12px 0 36px | `--card` | 1px solid `--border` |
| Password | 40px | 13px | 0 44px 0 12px | `--card` | 1px solid `--border` |

#### States

| State | Border | Background | Text |
|-------|--------|-----------|------|
| Default | `--border` (#2A2A2A) | `--card` (#1A1A1A) | `--text` (#FFFFFF) |
| Placeholder | `--border` | `--card` | `--text-dim` (#666666) |
| Focus | `--primary` (#D4AF37) | `--card` | `--text` |
| Error | `--red` (#F44336) | `--card` | `--text` |
| Disabled | `--border` | `--card` at 50% opacity | `--text-dim` |

#### Form Label

Always paired above the input:
```jsx
<label className="block text-[10px] font-semibold tracking-[2px] uppercase text-text-muted mb-1.5">
  EVENT TITLE
</label>
```

#### Code Examples

```jsx
{/* Standard Input */}
<div className="mb-5">
  <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-text-muted mb-1.5">
    EVENT TITLE
  </label>
  <input
    type="text"
    className="w-full h-10 px-3 bg-card border border-border text-white text-[13px] placeholder:text-text-dim focus:border-primary focus:outline-none"
    placeholder="Enter event title"
  />
</div>

{/* Small Input */}
<input className="w-full h-9 px-3 bg-card border border-border text-white text-xs placeholder:text-text-dim focus:border-primary focus:outline-none" />

{/* Textarea */}
<textarea className="w-full min-h-[80px] px-3 py-2.5 bg-card border border-border text-white text-[13px] leading-relaxed resize-y placeholder:text-text-dim focus:border-primary focus:outline-none" />

{/* Password with toggle */}
<div className="relative">
  <input
    type="password"
    className="w-full h-10 pl-3 pr-11 bg-card border border-border text-white text-[13px] focus:border-primary focus:outline-none"
  />
  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim cursor-pointer" aria-label="Toggle password visibility">
    <Eye className="w-4 h-4" />
  </button>
</div>

{/* Search with icon */}
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
  <input
    type="text"
    className="w-full h-10 pl-9 pr-3 bg-card border border-border text-white text-[13px] placeholder:text-text-dim focus:border-primary focus:outline-none"
    placeholder="Search..."
  />
</div>

{/* Select / Dropdown */}
<select className="w-full h-10 px-3 bg-card border border-border text-white text-[13px] appearance-none cursor-pointer focus:border-primary focus:outline-none">
  <option>Select category</option>
  <option>Sports</option>
  <option>Corporate</option>
  <option>Community</option>
</select>

{/* Upload Zone */}
<div className="w-full border border-dashed border-border bg-card flex flex-col items-center justify-center gap-1.5 py-8 cursor-pointer hover:border-primary transition-colors">
  <Upload className="w-6 h-6 text-text-dim" />
  <span className="text-xs text-text-dim">Click or drag to upload</span>
  <span className="text-[10px] text-text-dim">PNG, JPG, WebP up to 5MB</span>
</div>

{/* Two-column form row */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-text-muted mb-1.5">START DATE</label>
    <input type="date" className="w-full h-10 px-3 bg-card border border-border text-white text-[13px] focus:border-primary focus:outline-none" />
  </div>
  <div>
    <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-text-muted mb-1.5">END DATE</label>
    <input type="date" className="w-full h-10 px-3 bg-card border border-border text-white text-[13px] focus:border-primary focus:outline-none" />
  </div>
</div>
```

#### Accessibility

- Always associate `<label>` with `<input>` via `htmlFor`/`id`
- Use `aria-invalid="true"` and `aria-describedby` pointing to error message for error state
- Password toggle button needs `aria-label="Toggle password visibility"`
- Textareas support keyboard resize via native behavior

---

### 3.3 Toggle Switch

#### Variants

| Variant | Width | Height | Knob Size | Border Radius |
|---------|-------|--------|-----------|--------------|
| Default | 32px | 18px | 14px | 9px |
| Small | 24px | 14px | 10px | 7px |

#### States

| State | Track Color | Knob Position |
|-------|------------|---------------|
| On | `--color-primary` (#D4AF37) | Right (2px from right edge) |
| Off | `--color-text-dim` (#666666) | Left (2px from left edge, via translateX) |

#### Code Example

```jsx
<button
  role="switch"
  aria-checked={isOn}
  onClick={() => setIsOn(!isOn)}
  className={`relative w-8 h-[18px] rounded-[9px] cursor-pointer flex-shrink-0 transition-colors ${
    isOn ? 'bg-primary' : 'bg-text-dim'
  }`}
>
  <span className={`absolute w-3.5 h-3.5 rounded-full bg-bg top-[2px] right-[2px] transition-transform ${
    !isOn ? '-translate-x-[14px]' : ''
  }`} />
</button>

{/* Small variant */}
<button
  role="switch"
  aria-checked={isOn}
  className={`relative w-6 h-3.5 rounded-[7px] cursor-pointer flex-shrink-0 transition-colors ${
    isOn ? 'bg-primary' : 'bg-text-dim'
  }`}
>
  <span className={`absolute w-2.5 h-2.5 rounded-full bg-bg top-[2px] right-[2px] transition-transform ${
    !isOn ? '-translate-x-2.5' : ''
  }`} />
</button>
```

#### Accessibility

- Use `role="switch"` and `aria-checked`
- Keyboard: `Space` toggles state
- Label association via `aria-labelledby` or adjacent text

---

### 3.4 Badge

#### Status Badges

| Status | Background | Text Color | Usage |
|--------|-----------|------------|-------|
| Upcoming | `rgba(212,175,55,0.1)` | `--gold` (#D4AF37) | Future events |
| Active | `rgba(76,175,80,0.1)` | `--green` (#4CAF50) | Live events |
| Draft | `rgba(255,255,255,0.05)` | `--dim` (#666666) | Unpublished events |
| Completed | `rgba(33,150,243,0.1)` | `--blue` (#2196F3) | Past events |
| Cancelled | `rgba(244,67,54,0.1)` | `--red` (#F44336) | Cancelled events |

All status badges: `padding: 4px 10px`, `font-size: 10px`, `font-weight: 600`, `letter-spacing: 1px`, `border-radius: 2px`, `uppercase`.

#### Category Badges

Background: `rgba(255,255,255,0.05)`, color: `--text-muted`, same size specs as status.

```css
padding: 3px 8px; font-size: 10px; font-weight: 500; letter-spacing: 1px;
```

#### Type Badges (Registration)

Similar to category badges with contextual color coding.

| Type | Style |
|------|-------|
| Team | gold background `primary-20`, gold text |
| Individual | white-5 background, muted text |

#### Code Example

```jsx
{/* Status Badge */}
<span className="inline-flex px-2.5 py-1 text-[10px] font-semibold tracking-[1px] uppercase rounded-sm bg-[rgba(212,175,55,0.1)] text-primary">
  UPCOMING
</span>

<span className="inline-flex px-2.5 py-1 text-[10px] font-semibold tracking-[1px] uppercase rounded-sm bg-[rgba(76,175,80,0.1)] text-green">
  ACTIVE
</span>

<span className="inline-flex px-2.5 py-1 text-[10px] font-semibold tracking-[1px] uppercase rounded-sm bg-[rgba(255,255,255,0.05)] text-text-dim">
  DRAFT
</span>

{/* Category Badge */}
<span className="inline-flex px-2 py-[3px] text-[10px] font-medium tracking-[1px] uppercase bg-white/5 text-text-muted">
  SPORTS
</span>

{/* Pillar Badge (admin editor) */}
<span className="px-2.5 py-1 bg-primary-20 text-[9px] font-bold tracking-[2px] uppercase text-primary">
  PILLAR 1
</span>
```

---

### 3.5 Field Chip

On/off toggle styled as a chip. Used in form editors to enable/disable optional fields.

| State | Background | Border | Text | Dot |
|-------|-----------|--------|------|-----|
| On | `primary-dim` | 1px solid `primary-border` | primary | gold filled |
| Off | `rgba(255,255,255,0.03)` | 1px solid `--border` | text-dim | dim filled |

```jsx
<button
  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all border ${
    isOn
      ? 'bg-primary-dim border-primary-border text-primary'
      : 'bg-white/[0.03] border-border text-text-dim'
  } hover:border-primary-border cursor-pointer`}
>
  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOn ? 'bg-primary' : 'bg-text-dim'}`} />
  Phone Number
</button>
```

---

### 3.6 Card

#### Stat Card (Admin Dashboard)

```
Background: --surface (#141414)
Border: 1px solid --border
Padding: 24px
```

```jsx
<div className="bg-surface border border-border p-6">
  <div className="text-[10px] font-semibold tracking-[2px] uppercase text-text-muted mb-3">
    TOTAL EVENTS
  </div>
  <div className="flex justify-between items-end">
    <span className="text-4xl font-extrabold tracking-[-1px]">24</span>
    <Calendar className="w-6 h-6 text-primary/25" />
  </div>
</div>
```

#### Event Card (Public)

```
Background: --surface-card (#1A1A1A)
Border: 1px solid transparent → hover: rgba(212,175,55,0.25)
Image area: 220px height, overflow hidden
Content padding: 24px
Gap between elements: 14px
```

```jsx
<div className="bg-card border border-transparent hover:border-primary-border transition-colors overflow-hidden group">
  <div className="overflow-hidden h-[220px]">
    <img src={src} alt={alt} className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-[1.08]" />
  </div>
  <div className="p-6 flex flex-col gap-3.5">
    <span className="inline-flex w-fit px-2.5 py-1 bg-primary-20 text-[10px] font-semibold tracking-[2px] uppercase text-primary transition-colors group-hover:bg-[rgba(212,175,55,0.2)]">
      SPORTS
    </span>
    <h3 className="text-xl font-bold leading-[1.3]">Annual Cricket Championship 2026</h3>
    <div className="flex gap-4 items-center text-[11px] font-medium tracking-[1px] text-text-muted">
      <span>APR 15, 2026</span>
      <span className="w-1 h-1 rounded-full bg-text-dim" />
      <span>BANGALORE</span>
    </div>
  </div>
</div>
```

#### Partner Card (Public)

```
Background: --surface (#161616)
Border: 1px solid --border, border-left: 3px solid transparent
Padding: 28px 32px
Gap: 20px
Hover: border-left-color gold, translateX(4px)
```

```jsx
<div className="flex items-center gap-5 px-8 py-7 bg-surface border border-border border-l-[3px] border-l-transparent hover:border-l-primary hover:translate-x-1 transition-all">
  <div className="w-14 h-14 min-w-[56px] bg-primary-dim flex items-center justify-center">
    <Shield className="w-6 h-6 text-primary" />
  </div>
  <div>
    <h4 className="text-base font-bold tracking-[1px] mb-1.5">Scalable Infrastructure</h4>
    <p className="text-[13px] font-normal leading-relaxed text-text-muted">Built to handle events of any scale.</p>
  </div>
</div>
```

#### Pillar Card (Public)

```
Height: 480px (desktop), 320px (mobile)
Overflow: hidden
Background image: 0.35 opacity, covers full card
Overlay gradient: transparent to #111111 at 70%
Content positioned at bottom with flex-end
Hover: translateY(-8px), gold glow shadow, bg image scales 1.05
```

```jsx
<div className="relative h-[480px] overflow-hidden group transition-all duration-[400ms] hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(212,175,55,0.1)]">
  <div
    className="absolute inset-0 bg-cover bg-center opacity-[0.35] transition-transform duration-[400ms] group-hover:scale-[1.05]"
    style={{ backgroundImage: `url(${image})` }}
  />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111_70%]" />
  <div className="relative z-[1] h-full flex flex-col justify-end px-8 pb-10 gap-4">
    <span className="text-[64px] font-extrabold tracking-[-2px] text-primary-30 transition-colors duration-[400ms] group-hover:text-[rgba(212,175,55,0.5)]">01</span>
    <h3 className="text-[28px] font-extrabold tracking-[1px] leading-[1.1]">SPORTS EVENTS</h3>
    <p className="text-sm font-normal leading-relaxed text-text-muted max-w-[320px]">Professional tournaments that set the standard.</p>
    <div className="w-10 h-[3px] bg-primary transition-all duration-[400ms] group-hover:w-20" />
  </div>
</div>
```

#### Testimonial Card (Public)

```
Background: --surface (#161616)
Border: 1px solid --border
Padding: 36px 32px
Hover: border-color gold-border, subtle gold shadow
```

```jsx
<div className="p-8 bg-surface border border-border flex flex-col gap-6 hover:border-primary-border hover:shadow-[0_0_24px_rgba(212,175,55,0.05)] transition-all group">
  <span className="text-5xl font-extrabold text-primary leading-[0.5] transition-transform group-hover:scale-[1.15]">"</span>
  <p className="text-[15px] font-normal leading-relaxed text-text-muted">Testimonial text here.</p>
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center">
      <User className="w-5 h-5 text-primary" />
    </div>
    <div>
      <div className="text-xs font-bold tracking-[1px]">JOHN DOE</div>
      <div className="text-[11px] font-normal text-text-dim">Event Organizer</div>
    </div>
  </div>
</div>
```

#### Panel Card (Admin)

```
Background: --surface (#141414)
Border: 1px solid --border
Padding: 24px
```

```jsx
<div className="bg-surface border border-border p-6">
  <div className="flex justify-between items-center mb-5">
    <h3 className="text-xs font-bold tracking-[2px] uppercase">RECENT EVENTS</h3>
    <span className="text-xs font-medium text-primary cursor-pointer">View All</span>
  </div>
  {/* Panel content */}
</div>
```

#### Page Row Card (Admin)

```jsx
<div className="flex items-center justify-between px-4 h-11 bg-card border border-border-light mb-2">
  <div className="flex items-center gap-3">
    <FileText className="w-4 h-4 text-primary" />
    <span className="text-[13px] font-medium">Home Page</span>
  </div>
  <span className="text-[11px] text-text-dim">6 sections</span>
</div>
```

#### Section Item Card (Admin Page Editor)

```jsx
<div className={`flex items-center gap-3 px-3 h-12 bg-card border rounded ${
  isActive ? 'bg-primary-dim border-primary-border' : 'border-border hover:border-text-dim'
} mb-2 cursor-pointer`}>
  <GripVertical className="w-4 h-4 text-text-dim flex-shrink-0" />
  <Layout className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
  <span className={`flex-1 text-[13px] font-medium ${isActive ? 'text-primary font-semibold' : 'text-text-muted'}`}>
    Hero Section
  </span>
  <Toggle isOn={section.enabled} size="sm" />
</div>
```

---

### 3.7 Progress Bar

Used for registration capacity, upload progress, etc.

```jsx
<div className="w-full h-2 bg-border rounded-none overflow-hidden">
  <div
    className="h-full bg-primary transition-all duration-500 ease-out"
    style={{ width: `${percentage}%` }}
  />
</div>

{/* With label */}
<div>
  <div className="flex justify-between mb-1.5">
    <span className="text-[11px] font-medium text-text-muted">CAPACITY</span>
    <span className="text-[11px] font-semibold text-primary">75/100</span>
  </div>
  <div className="w-full h-2 bg-border overflow-hidden">
    <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: '75%' }} />
  </div>
</div>
```

---

### 3.8 Navigation

#### Sidebar Nav Item (Admin)

```
Height: 40px
Padding: 0 12px
Border radius: 4px
Font: 13px, weight varies
Icon size: 18px
```

| State | Background | Text | Icon |
|-------|-----------|------|------|
| Default | transparent | text-muted | text-dim |
| Hover | white/3 | text-muted | text-dim |
| Active | primary-dim | primary | primary |

```jsx
<button className={`flex items-center gap-3 px-3 h-10 rounded w-full mb-0.5 cursor-pointer transition-colors text-[13px] ${
  isActive
    ? 'bg-primary-dim text-primary font-semibold'
    : 'text-text-muted hover:bg-white/[0.03]'
}`}>
  <LayoutDashboard className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : 'text-text-dim'}`} />
  Dashboard
</button>
```

#### Tab (Admin)

```
Padding: 12px 24px
Font: 13px, 500 weight (600 when active)
Border-bottom: 2px solid transparent (gold when active)
```

```jsx
<div className="flex border-b border-border mb-8">
  {tabs.map(tab => (
    <button
      key={tab.id}
      className={`px-6 py-3 text-[13px] font-medium cursor-pointer border-b-2 transition-colors ${
        activeTab === tab.id
          ? 'text-primary border-primary font-semibold'
          : 'text-text-dim border-transparent hover:text-text-muted'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

#### Breadcrumb

```jsx
<nav className="flex items-center gap-2" aria-label="Breadcrumb">
  <span className="text-sm text-text-dim">Dashboard</span>
  <ChevronRight className="w-3.5 h-3.5 text-text-dim" />
  <span className="text-sm font-semibold text-white">Events</span>
</nav>
```

---

### 3.9 Modal

```
Overlay: rgba(0, 0, 0, 0.7), z-index 199
Panel: bg-surface, border border-border, max-width 560px, padding 32px
Close button: top-right icon button
```

```jsx
{/* Overlay */}
<div className="fixed inset-0 bg-black/70 z-[199]" onClick={onClose} />

{/* Panel */}
<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] w-full max-w-[560px] bg-surface border border-border p-8" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div className="flex justify-between items-center mb-6">
    <h2 id="modal-title" className="text-xl font-bold">Confirm Action</h2>
    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-white transition-colors" aria-label="Close dialog">
      <X className="w-5 h-5" />
    </button>
  </div>
  <div className="mb-6">
    <p className="text-sm text-text-muted leading-relaxed">Modal body content.</p>
  </div>
  <div className="flex justify-end gap-3">
    <button className="px-4 py-2 border border-border text-text-muted text-xs font-medium">Cancel</button>
    <button className="px-5 py-2 bg-primary text-bg text-xs font-bold">Confirm</button>
  </div>
</div>
```

#### Accessibility

- `role="dialog"` and `aria-modal="true"` on panel
- `aria-labelledby` pointing to title
- Focus trap: first focusable element on open, Tab cycles within modal
- `Escape` key closes
- Return focus to trigger element on close

---

### 3.10 Table

#### Data Table

```
Background: --surface (#141414)
Border: 1px solid --border
Border-collapse: collapse
```

| Element | Style |
|---------|-------|
| Header cell | padding 12px 20px, 10px font, 600 weight, 2px tracking, text-dim, border-bottom |
| Data cell | padding 16px 20px, 13px font, border-bottom border-light |
| Row hover | bg white/2 |

```jsx
<table className="w-full border-collapse bg-surface border border-border">
  <thead>
    <tr>
      <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[2px] uppercase text-text-dim border-b border-border">EVENT NAME</th>
      <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[2px] uppercase text-text-dim border-b border-border">DATE</th>
      <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[2px] uppercase text-text-dim border-b border-border">STATUS</th>
      <th className="text-left px-5 py-3 text-[10px] font-semibold tracking-[2px] uppercase text-text-dim border-b border-border">ACTIONS</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-white/[0.02]">
      <td className="px-5 py-4 text-[13px] border-b border-border-light align-middle">Annual Cricket Championship</td>
      <td className="px-5 py-4 text-[13px] border-b border-border-light align-middle text-text-muted">Apr 15, 2026</td>
      <td className="px-5 py-4 text-[13px] border-b border-border-light align-middle">
        <span className="inline-flex px-2.5 py-1 text-[10px] font-semibold tracking-[1px] uppercase rounded-sm bg-[rgba(212,175,55,0.1)] text-primary">UPCOMING</span>
      </td>
      <td className="px-5 py-4 border-b border-border-light align-middle">
        <div className="flex gap-2">
          <button className="w-7 h-7 flex items-center justify-center border border-border text-text-dim hover:border-primary hover:text-primary hover:bg-primary-dim transition-all" aria-label="Edit">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-border text-text-dim hover:border-primary hover:text-primary hover:bg-primary-dim transition-all" aria-label="View">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

#### Data Table Patterns (Sorting, Filtering, Pagination)

**Sorting**: Click column header to sort. Active sort column shows gold arrow icon. Toggle between ascending/descending.

**Filtering**: Use filter chips above the table (see Filter Chip component).

**Pagination**: Below table, flex row with page numbers and prev/next ghost buttons.

```jsx
{/* Pagination */}
<div className="flex items-center justify-between mt-4">
  <span className="text-[11px] text-text-dim">Showing 1-10 of 24</span>
  <div className="flex gap-1">
    <button className="w-8 h-8 flex items-center justify-center border border-border text-text-dim text-xs hover:border-primary hover:text-primary" aria-label="Previous page">
      <ChevronLeft className="w-3.5 h-3.5" />
    </button>
    <button className="w-8 h-8 flex items-center justify-center bg-primary-dim border border-primary-border text-primary text-xs font-semibold">1</button>
    <button className="w-8 h-8 flex items-center justify-center border border-border text-text-dim text-xs hover:border-primary hover:text-primary">2</button>
    <button className="w-8 h-8 flex items-center justify-center border border-border text-text-dim text-xs hover:border-primary hover:text-primary">3</button>
    <button className="w-8 h-8 flex items-center justify-center border border-border text-text-dim text-xs hover:border-primary hover:text-primary" aria-label="Next page">
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>
</div>
```

---

### 3.11 Alert / Info Note

Gold-bordered info box for contextual guidance.

```jsx
<div className="flex gap-3 p-4 bg-primary-dim border border-primary-border">
  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
  <p className="text-xs text-text-muted leading-relaxed">
    This information is used across the website -- footer, contact page, and meta tags.
  </p>
</div>
```

---

### 3.12 Avatar

| Size | Dimensions | Usage |
|------|-----------|-------|
| Small | 32px | Sidebar footer avatar |
| Medium | 36px | Inline avatars |
| Large | 40px | Testimonial avatars |

```jsx
{/* 32px - sidebar */}
<div className="w-8 h-8 rounded-full bg-primary-dim flex items-center justify-center">
  <User className="w-4 h-4 text-primary" />
</div>

{/* 40px - testimonial */}
<div className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center">
  <User className="w-5 h-5 text-primary" />
</div>

{/* With image */}
<img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
```

---

### 3.13 Divider

#### Horizontal Line

```jsx
{/* Standard */}
<div className="h-px bg-border" />

{/* Footer divider */}
<div className="h-px bg-border mb-6" />

{/* Settings section title border */}
<h3 className="text-sm font-bold tracking-[1px] mb-5 pb-3 border-b border-border">SECTION TITLE</h3>
```

#### Gold Accent Line

```jsx
{/* Hero accent */}
<div className="w-20 h-1 bg-primary" />

{/* Trust accent */}
<div className="w-[60px] h-1 bg-primary" />

{/* Pillar card accent -- grows on hover */}
<div className="w-10 h-[3px] bg-primary transition-all duration-[400ms] group-hover:w-20" />
```

#### SVG Section Divider

Gold diamond + lines between page sections (public site):

```jsx
<div className="flex items-center justify-center overflow-hidden">
  <svg className="block" width="600" height="2">
    <line x1="0" y1="1" x2="600" y2="1" className="stroke-primary stroke-1 opacity-20" />
  </svg>
  <svg className="block mx-2" width="12" height="12">
    <rect x="2" y="2" width="8" height="8" className="fill-primary opacity-15 rotate-45 origin-center" />
  </svg>
  <svg className="block" width="600" height="2">
    <line x1="0" y1="1" x2="600" y2="1" className="stroke-primary stroke-1 opacity-20" />
  </svg>
</div>
```

---

### 3.14 Step Indicator

Horizontal step indicator for multi-step registration forms.

```jsx
<div className="flex items-center gap-0">
  {steps.map((step, i) => (
    <React.Fragment key={i}>
      {/* Step dot + label */}
      <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          i < currentStep
            ? 'bg-primary text-bg'
            : i === currentStep
            ? 'bg-primary text-bg'
            : 'bg-border text-text-dim'
        }`}>
          {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        <span className={`text-[10px] font-semibold tracking-[1px] uppercase ${
          i <= currentStep ? 'text-primary' : 'text-text-dim'
        }`}>
          {step.label}
        </span>
      </div>
      {/* Connector line */}
      {i < steps.length - 1 && (
        <div className={`flex-1 h-px mx-2 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
      )}
    </React.Fragment>
  ))}
</div>
```

---

### 3.15 Filter Chip

```
Padding: 6px 14px
Font: 11px, 500 weight, 1px tracking
Border: 1px solid --border (default) or --primary-border (active)
Background: transparent (default) or primary-dim (active)
```

```jsx
<div className="flex gap-2 mb-5">
  {filters.map(filter => (
    <button
      key={filter.id}
      className={`px-3.5 py-1.5 text-[11px] font-medium tracking-[1px] uppercase border cursor-pointer transition-all ${
        activeFilter === filter.id
          ? 'bg-primary-dim border-primary-border text-primary font-semibold'
          : 'border-border bg-transparent text-text-muted hover:border-primary-border hover:text-primary'
      }`}
    >
      {filter.label}
    </button>
  ))}
</div>
```

---

### 3.16 Tooltip

Minimal tooltip for icon buttons and truncated text.

```jsx
<div className="relative group">
  <button aria-label="Edit event">
    <Pencil className="w-3.5 h-3.5" />
  </button>
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-bg-alt border border-border text-[11px] text-text-muted whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[400]" role="tooltip">
    Edit event
  </div>
</div>
```

---

## 4. Layout Patterns

### 4.1 Public Site

#### Header

```
Position: fixed, top 0, full width
Height: ~72px (20px vertical padding + content)
Z-index: 100
Default: transparent background, no border
Scrolled: rgba(10,10,10,0.85), blur(12px), border-bottom --border
Padding: 20px 64px (desktop), 16px 20px (mobile)
Content: logo left, nav center-right, CTA right
```

```jsx
<header className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-16 py-5 transition-all duration-300 ${
  scrolled
    ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-[12px] border-b border-border'
    : 'border-b border-transparent'
}`}>
  {/* Logo */}
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 bg-gradient-to-b from-[#D4AF37] to-[#B8962E] flex items-center justify-center">
      <Triangle className="w-5 h-[18px] text-bg" />
    </div>
    <span className="text-[22px] font-extrabold tracking-[4px]">TRICORE</span>
    <span className="text-[10px] font-medium tracking-[3px] text-primary">EVENTS</span>
  </div>
  {/* Nav */}
  <nav className="flex gap-9 items-center">
    <a className="text-xs font-medium tracking-[2px] uppercase text-primary">HOME</a>
    <a className="text-xs font-medium tracking-[2px] uppercase text-text-muted hover:text-primary transition-colors">EVENTS</a>
    {/* ... */}
  </nav>
  {/* CTA */}
  <a className="inline-flex px-7 py-3 bg-primary text-bg text-xs font-bold tracking-[2px] hover:opacity-90 transition-opacity">
    REGISTER NOW
  </a>
</header>
```

#### Hero

```
Height: 720px (desktop), 620px (mobile)
Position: relative, overflow hidden
Background image: absolute, 0.4 opacity
Gradient overlay on top
Content: padding 160px 120px 80px (desktop), 100px 24px 24px (mobile)
Stats bar: absolute bottom, 80px height, blur backdrop
```

#### Content Section

```
Max-width: none (full bleed backgrounds)
Horizontal padding: 120px (desktop), 24px (mobile)
Vertical padding: 100px (desktop), 60px (mobile)
Alternating backgrounds: --bg and --bg-alt
```

#### Card Grid

```
Desktop: grid-template-columns: repeat(3, 1fr), gap 24px
Mobile: grid-template-columns: 1fr
Events grid, pillars grid follow this pattern
Testimonials: repeat(2, 1fr) desktop, 1fr mobile
```

#### Footer

```
Background: --bg-alt
Border-top: 1px solid --border
Padding: 60px 120px 40px (desktop), 40px 24px 24px (mobile)
Grid: 320px + repeat(3, 1fr) with 80px gap (desktop), 1fr stacked (mobile)
Column titles: 11px, 700, 2px tracking, gold
Links: 13px, 400, text-muted
Bottom: divider line + flex (copyright left, legal links right)
```

---

### 4.2 Admin Portal

#### Sidebar

```
Width: 260px, fixed height (100vh)
Background: --bg-alt (#111111)
Border-right: 1px solid --border
Padding: 24px 0 (top/bottom), nav items 16px 12px
Layout: flex column -- logo top, nav flex-1 scrollable, user footer bottom
Nav groups separated by 1px --border dividers
```

#### Top Bar

```
Height: 64px
Border-bottom: 1px solid --border
Padding: 0 32px
Layout: flex, breadcrumb left, action buttons right
```

#### Content Area

```
Flex: 1 (fills remaining width)
Overflow-y: auto
Padding: 32px
```

#### Two-Column Layout

```
Display: grid
Grid: 1fr 360px (main + sidebar)
Gap: 24px
Used on: Dashboard, Event Editor
```

```jsx
<div className="grid grid-cols-[1fr_360px] gap-6">
  <div>{/* Main content */}</div>
  <div>{/* Sidebar panels */}</div>
</div>
```

#### Tab Layout

```
Tabs: flex row, border-bottom --border, margin-bottom 32px
Panel: display none / block based on active state
```

#### Page Editor Split Layout

```
Display: flex
Left panel: 380px width, bg-alt, border-right, scrollable section list
Right panel: flex-1, padding 24px 32px, scrollable editor
```

---

### 4.3 Registration Flow

#### Split Layout

```
Display: flex
Left: 400px fixed, summary panel, bg-surface, border-right
Right: flex-1, form content, scrollable
```

#### Step Indicator

Horizontal, connected by lines between circular step markers. Placed at top of form area. See Step Indicator component (3.14).

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Min/Max | Container |
|-----------|-------|---------|-----------|
| Desktop | 1440px | min-width: 1024px | Full |
| Tablet | 768px | min-width: 768px, max-width: 1023px | Full |
| Mobile | 390px | max-width: 767px | Full |

### Breakpoint-Specific Rules

#### Desktop (min-width: 1024px)

- Section padding: 100px vertical, 120px horizontal
- Hero: 720px height, 72px headline
- Card grids: 3 columns
- Testimonials: 2 columns
- Trust section: 2-column grid, 80px gap
- Footer: 4-column grid (320px + 3x 1fr)
- Header nav: visible, 36px gap between links
- Admin sidebar: 260px visible

#### Tablet (768px -- 1023px)

- Section padding: 80px vertical, 60px horizontal
- Card grids: 2 columns
- Trust section: 2-column grid, 40px gap
- Footer: 2-column grid
- Header nav: hidden, hamburger menu
- Admin: sidebar collapses to icons-only or overlay

#### Mobile (max-width: 767px)

- Section padding: 60px vertical, 24px horizontal
- Hero: 620px height, 38px headline
- Card grids: 1 column
- Pillar cards: 320px height (from 480px)
- Trust: single column, 36px gap
- Footer: single column, 32px gap
- Header: padding 16px 20px, nav hidden, logo 16px/28px mark
- Buttons: full width, stacked vertically in hero
- Stats bar: wrap, smaller values (22px)
- Decorative elements: hidden (geo shapes, cursor glow, particles)
- Events grid: 1 column, 200px image height
- Testimonials: 1 column, reduced padding (28px 24px)
- CTA: 360px height, 28px heading, column buttons max 320px
- Admin: not optimized for mobile (desktop-first admin)

---

## 6. Animation Specifications

### 6.1 Timing Functions

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--hover-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### 6.2 Hero Entrance Sequence

All animations run once on page load with staggered delays:

| Element | Animation | Duration | Delay | Easing |
|---------|-----------|----------|-------|--------|
| Header | slideDown (translateY -30px to 0) | 0.7s | 0.6s | ease-out-expo |
| Hero headline line 1 | clip-path reveal (inset right to full) | 0.8s | 0.4s | ease-out-expo |
| Hero headline line 2 | clip-path reveal | 0.8s | 0.7s | ease-out-expo |
| Hero headline line 3 | clip-path reveal | 0.8s | 1.0s | ease-out-expo |
| Hero badge | fadeIn + translateX(-20px to 0) | 0.6s | 0.8s | ease-out-expo |
| Hero accent line | width 0 to 80px | 0.6s | 1.2s | ease-out-expo |
| Hero subtitle | fadeUp (translateY 16px to 0) | 0.6s | 1.4s | ease-out-expo |
| Primary CTA | fadeUp (translateY 20px to 0) | 0.6s | 1.6s | ease-out-expo |
| Outline CTA | fadeUp (translateY 20px to 0) | 0.6s | 1.8s | ease-out-expo |
| Stats bar | fadeUp (translateY 30px to 0) | 0.7s | 2.0s | ease-out-expo |
| Shimmer sweep | background-position 200% to -200% | 1.2s | 2.0s | ease-in-out |

### Post-entrance continuous:

| Element | Animation | Duration | Timing |
|---------|-----------|----------|--------|
| Badge float | translateY 0 to -6px | 3s | ease-in-out, infinite, starts at 2.5s |
| Geo triangle rotate | 360deg | 20s | linear, infinite |
| Geo circle pulse | scale 1 to 1.2 | 4s | ease-in-out, infinite |
| CTA particles float | multi-step translateY/X | 3.5-7s | ease-in-out, infinite, staggered |

### 6.3 Scroll Reveal

Uses IntersectionObserver to add `.visible` class.

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);
```

| Element | Initial State | Revealed State | Duration | Easing |
|---------|--------------|----------------|----------|--------|
| Section (`.reveal-section`) | opacity 0, translateY(40px) | opacity 1, translateY(0) | 0.6s | ease-out-expo |
| Child (`.reveal-child`) | opacity 0, translateY(24px) | opacity 1, translateY(0) | 0.5s | ease-out-expo |
| SVG divider line | stroke-dashoffset 600 | stroke-dashoffset 0 | 1.2s | ease-out-expo |
| SVG diamond | scale(0) rotate(45deg) | scale(1) rotate(45deg) | 0.6s | ease-out-expo |

Children are staggered by applying `transition-delay` via inline style: `style="transition-delay: ${index * 0.1}s"`.

### 6.4 Tab Transitions

```css
/* No animation -- instant swap */
.tab-panel { display: none; }
.tab-panel.active { display: block; }
```

Tab indicator (bottom border) transitions via CSS:

```css
.tab { transition: color 0.15s, border-color 0.15s; }
```

### 6.5 Card Hover Animations

| Card Type | Property | From | To | Duration | Easing |
|-----------|----------|------|-----|----------|--------|
| Pillar | transform | none | translateY(-8px) | 0.4s | hover-ease |
| Pillar | box-shadow | none | gold glow | 0.4s | hover-ease |
| Pillar bg image | transform | none | scale(1.05) | 0.4s | hover-ease |
| Pillar accent line | width | 40px | 80px | 0.4s | hover-ease |
| Pillar number | color | primary-30 | primary/50 | 0.4s | hover-ease |
| Event card | border-color | transparent | gold/25 | 0.3s | hover-ease |
| Event card image | transform | none | scale(1.08) | 0.3s | hover-ease |
| Event tag | background | primary-20 | primary/20 darker | 0.3s | default |
| Partner card | border-left-color | transparent | primary | 0.3s | hover-ease |
| Partner card | transform | none | translateX(4px) | 0.3s | hover-ease |
| Partner icon | background | primary-dim | primary/15 | 0.3s | default |
| Testimonial card | border-color | border | primary-border | 0.3s | default |
| Testimonial card | box-shadow | none | subtle gold | 0.3s | default |
| Testimonial quote | transform | none | scale(1.15) | 0.3s | hover-ease |

### 6.6 Button State Transitions

```css
transition: opacity 0.2s, transform 0.15s, box-shadow 0.3s, background 0.3s;
```

### 6.7 Header Scroll Effect

Triggered by scroll event listener:

```js
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});
```

Transition: `background 0.3s, backdrop-filter 0.3s, border-color 0.3s`.

### 6.8 Progress Bar Fill

```css
transition: width 0.5s ease-out;
/* Or animate on mount with requestAnimationFrame */
```

### 6.9 Stats Counter

Animated number counting up from 0 to target value on scroll into view.

```js
function animateCounter(element, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    element.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
```

Duration: 2 seconds, ease-out cubic.

### 6.10 Parallax

Hero and CTA background images shift on scroll:

```js
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
  ctaBg.style.transform = `translateY(${(scrollY - ctaOffset) * 0.2}px)`;
});
```

Rate: 0.3x scroll speed (hero), 0.2x (CTA).

### 6.11 Modal Open/Close

```css
/* Overlay */
opacity: 0 → 1 over 0.2s ease-out
/* Panel */
opacity: 0, scale(0.95), translateY(10px) → opacity 1, scale(1), translateY(0) over 0.25s ease-out-expo
/* Close: reverse */
```

### 6.12 Cursor Glow (Hero)

Desktop only. A radial gradient circle follows the mouse within the hero section:

```js
hero.addEventListener('mousemove', (e) => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  glow.style.display = 'block';
});
hero.addEventListener('mouseleave', () => {
  glow.style.display = 'none';
});
```

Glow: 400px radial gradient, `rgba(212,175,55,0.05)` center, transparent edge.

### 6.13 `prefers-reduced-motion` Rules

When reduced motion is preferred:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Force visible states immediately */
  .header,
  .hero-badge,
  .hero-sub,
  .hero-ctas .btn-primary,
  .hero-ctas .btn-outline,
  .stats-bar,
  .reveal-section,
  .reveal-child {
    opacity: 1;
    transform: none;
  }

  .hero-line-inner {
    opacity: 1;
    clip-path: none;
  }

  .hero-accent {
    width: 80px;
  }

  /* Hide decorative motion elements */
  .hero-geo,
  .hero-cursor-glow,
  .cta-particle {
    display: none !important;
  }
}
```

**React implementation**: Use `useReducedMotion()` hook to skip JS-driven animations (counter, parallax, cursor glow).

---

## 7. Iconography

### Icon Set

**Lucide React** (`lucide-react` npm package)

### Size Guide

| Context | Size | Tailwind |
|---------|------|----------|
| Feature/section icons | 24px | `w-6 h-6` |
| Nav item icons (admin sidebar) | 18px | `w-[18px] h-[18px]` |
| Button inline icons | 14px (admin), 18px (hero CTA) | `w-3.5 h-3.5` or `w-[18px] h-[18px]` |
| Small UI icons (remove, add) | 12px | `w-3 h-3` |
| Stat card decorative | 24px | `w-6 h-6` at 25% primary opacity |
| Logo mark icon | 20x18px (custom SVG triangle) | Custom |

### Color

- **Default**: inherits parent color (usually `text-text-dim` or `text-text-muted`)
- **Active/accent**: `text-primary` (#D4AF37)
- **On gold background**: `text-bg` (#0A0A0A)
- **Decorative**: primary at reduced opacity (25%)

### Icons Used

| Icon | Context |
|------|---------|
| `LayoutDashboard` | Admin sidebar: Dashboard |
| `FileText` | Admin sidebar: Pages |
| `Calendar` | Admin sidebar: Events, stat cards |
| `Users` | Admin sidebar: Registrations, team |
| `MessageSquare` | Admin sidebar: Testimonials |
| `Image` | Admin sidebar: Media Library |
| `Settings` | Admin sidebar: Site Settings |
| `Trophy` | Sport items, events |
| `Shield` | Trust/partner section |
| `Target` | Trust/partner section |
| `Heart` | Trust/partner section |
| `Zap` | Trust/partner section, features |
| `ArrowRight` | CTA buttons, links |
| `ChevronRight` | Breadcrumbs, navigation |
| `ChevronLeft` | Pagination, back navigation |
| `Plus` | Add buttons |
| `X` | Close/remove buttons, modal close |
| `Pencil` | Edit actions |
| `Eye` / `EyeOff` | View action, password toggle |
| `Trash2` | Delete actions |
| `Upload` | Upload zones |
| `Download` | Export/download |
| `Search` | Search inputs |
| `GripVertical` | Drag handles |
| `MapPin` | Location metadata |
| `Clock` | Time metadata |
| `User` | Avatar placeholder |
| `Star` | Ratings, testimonials |
| `Check` | Completed steps, success |
| `AlertCircle` | Warnings |
| `Info` | Info notes |
| `LogOut` | Sign out |
| `ExternalLink` | External links |
| `Mail` | Email, contact |
| `Phone` | Phone contact |

---

## 8. Accessibility

### 8.1 Color Contrast

All text/background combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text):

| Foreground | Background | Ratio | Pass |
|-----------|------------|-------|------|
| #FFFFFF on #0A0A0A | White on bg | 19.3:1 | AAA |
| #FFFFFF on #111111 | White on bg-alt | 17.4:1 | AAA |
| #FFFFFF on #141414 | White on surface | 16.0:1 | AAA |
| #FFFFFF on #1A1A1A | White on card | 14.3:1 | AAA |
| #A0A0A0 on #0A0A0A | Muted on bg | 8.4:1 | AAA |
| #A0A0A0 on #1A1A1A | Muted on card | 6.2:1 | AA |
| #666666 on #0A0A0A | Dim on bg | 4.2:1 | AA (large) |
| #D4AF37 on #0A0A0A | Gold on bg | 8.6:1 | AAA |
| #0A0A0A on #D4AF37 | Bg on gold | 8.6:1 | AAA |
| #666666 on #1A1A1A | Dim on card | 3.1:1 | AA (large) |

**Note**: `text-dim` (#666666) on `card` (#1A1A1A) at 3.1:1 is only acceptable for decorative text, labels paired with higher-contrast content, or large text (18px+ or 14px bold+). Never use for critical information alone.

### 8.2 Focus Ring

```css
/* Global focus style */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

All interactive elements must show this focus ring when navigated via keyboard. Do not use `outline: none` without providing an alternative visible focus indicator.

### 8.3 Keyboard Navigation

| Component | Keys |
|-----------|------|
| Button | `Enter`, `Space` to activate |
| Toggle | `Space` to toggle |
| Tab navigation | `Tab` / `Shift+Tab` to move between tabs, `Enter` to activate |
| Modal | `Escape` to close, `Tab` trapped within modal |
| Dropdown/Select | `Arrow Up/Down` to navigate, `Enter` to select, `Escape` to close |
| Table | Standard tab order through cells |
| Sidebar nav | `Tab` through items, `Enter` to navigate |
| Filter chips | `Tab` to focus, `Enter`/`Space` to toggle |

### 8.4 ARIA Labels

| Element | ARIA |
|---------|------|
| Icon-only buttons | `aria-label="Action description"` |
| Toggle switch | `role="switch"`, `aria-checked="true/false"` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="title-id"` |
| Navigation | `role="navigation"`, `aria-label="Main navigation"` |
| Breadcrumb | `aria-label="Breadcrumb"` on nav |
| Status badge | Use text content (already visible) |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` |
| Tab list | `role="tablist"`, tabs use `role="tab"`, panels use `role="tabpanel"` |
| Alert/Info | `role="alert"` for important messages, or `role="status"` for non-urgent |

### 8.5 Screen Reader Considerations

- Decorative icons should have `aria-hidden="true"`
- Images must have descriptive `alt` text; decorative images use `alt=""`
- Form errors announced via `aria-live="polite"` region
- Loading states use `aria-busy="true"` on container
- Skip-to-content link as first focusable element: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>`
- Stats counter: use `aria-live="polite"` so final value is announced

### 8.6 Reduced Motion Support

See section 6.13. All motion is disabled. Content renders in final state immediately.

---

## 9. Tailwind Configuration

```js
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary:        'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-dim':   'var(--color-primary-dim)',
        'primary-20':    'var(--color-primary-20)',
        'primary-30':    'var(--color-primary-30)',
        'primary-border':'var(--color-primary-border)',
        bg:              'var(--color-bg)',
        'bg-alt':        'var(--color-bg-alt)',
        surface:         'var(--color-surface)',
        card:            'var(--color-surface-card)',
        'text-primary':  'var(--color-text)',
        'text-muted':    'var(--color-text-muted)',
        'text-dim':      'var(--color-text-dim)',
        border:          'var(--color-border)',
        'border-light':  'var(--color-border-light)',
        green:           'var(--color-green)',
        blue:            'var(--color-blue)',
        red:             'var(--color-red)',
      },
      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
        '25':  '100px',
        '30':  '120px',
      },
      borderRadius: {
        none: '0px',
        sm:   '2px',
        DEFAULT: '4px',
        lg:   '9px',
        xl:   '16px',
      },
      zIndex: {
        'header':   '100',
        'modal-bg': '199',
        'modal':    '200',
        'toast':    '300',
        'tooltip':  '400',
      },
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'hover':     'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        lineReveal: {
          '0%':   { opacity: '0', clipPath: 'inset(0 100% 0 0)' },
          '100%': { opacity: '1', clipPath: 'inset(0 0% 0 0)' },
        },
        accentGrow: {
          '0%':   { width: '0' },
          '100%': { width: '80px' },
        },
        shimmerSweep: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%':      { transform: 'translateY(-12px) translateX(6px)' },
          '50%':      { transform: 'translateY(-6px) translateX(-4px)' },
          '75%':      { transform: 'translateY(-18px) translateX(2px)' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer':    'shimmerSweep 1.2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
```

### CSS Custom Property Setup

Place in `src/index.css` or `src/styles/tokens.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: #D4AF37;
    --color-primary-hover: #E0BF45;
    --color-primary-dim: rgba(212, 175, 55, 0.08);
    --color-primary-20: rgba(212, 175, 55, 0.12);
    --color-primary-30: rgba(212, 175, 55, 0.18);
    --color-primary-border: rgba(212, 175, 55, 0.20);
    --color-bg: #0A0A0A;
    --color-bg-alt: #111111;
    --color-surface: #141414;
    --color-surface-card: #1A1A1A;
    --color-text: #FFFFFF;
    --color-text-muted: #A0A0A0;
    --color-text-dim: #666666;
    --color-border: #2A2A2A;
    --color-border-light: rgba(42, 42, 42, 0.5);
    --color-green: #4CAF50;
    --color-blue: #2196F3;
    --color-red: #F44336;
  }

  body {
    @apply bg-bg text-text-primary font-sans antialiased;
  }

  /* Global focus ring */
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}
```

### ThemeProvider Dynamic Overrides

The CMS theme editor updates CSS custom properties at runtime via `ThemeProvider.jsx`:

```jsx
useEffect(() => {
  if (theme?.colors) {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }
}, [theme]);
```

This means the Tailwind classes resolve dynamically -- changing `--color-primary` in the database changes every `bg-primary`, `text-primary`, `border-primary` usage site-wide without code changes.

---

## 10. Dark/Light Mode

### Current Implementation

**Dark mode only.** There is no light mode toggle. The entire system is built on a dark-first palette.

### Light Mode Token Mapping (Future)

If light mode is added, the following token overrides would apply:

```css
:root[data-theme="light"] {
  --color-primary:       #B8962E;       /* Slightly darker gold for contrast */
  --color-primary-hover:  #A68528;
  --color-primary-dim:    rgba(184, 150, 46, 0.08);
  --color-primary-20:     rgba(184, 150, 46, 0.10);
  --color-primary-30:     rgba(184, 150, 46, 0.15);
  --color-primary-border: rgba(184, 150, 46, 0.20);

  --color-bg:           #FFFFFF;
  --color-bg-alt:       #F8F8F8;
  --color-surface:      #F2F2F2;
  --color-surface-card: #EDEDED;

  --color-text:         #111111;
  --color-text-muted:   #555555;
  --color-text-dim:     #999999;

  --color-border:       #E0E0E0;
  --color-border-light: rgba(224, 224, 224, 0.5);

  --color-green:  #388E3C;
  --color-blue:   #1976D2;
  --color-red:    #D32F2F;
}
```

### Theme Toggle Implementation (Future)

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') || 'dark'
  );

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <button onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
```

Because all colors reference CSS custom properties, the switch is instantaneous with no re-render required for color changes.

---

## Appendix: Quick Reference

### File Structure

```
client/src/
  components/ui/       # Button, Badge, Card, Input, Textarea, Modal, Skeleton, ImageUpload
  components/layout/   # PublicLayout, AdminLayout, Navbar, Footer, MobileMenu
  components/sections/ # SectionRenderer + all section components
  context/             # AuthContext, SiteSettingsContext, ThemeProvider
  styles/tokens.css    # CSS custom properties
  tailwind.config.js   # Tailwind token mapping
```

### Design Checklist for New Components

1. Uses CSS custom properties (not hardcoded hex) for all colors
2. Follows the type scale (no arbitrary font sizes outside the scale)
3. Uses spacing from the defined scale
4. Default border-radius is 0px unless explicitly specified
5. Includes hover, focus, and disabled states
6. Focus ring: 2px solid gold, 2px offset
7. Keyboard accessible
8. ARIA attributes for interactive elements
9. Respects `prefers-reduced-motion`
10. Responsive at 390px, 768px, 1440px
11. Uses Lucide icons at correct sizes
12. Tested against dark background surfaces

---

*This document is the single source of truth for TriCore's visual system. Every component, token, and pattern defined here must be implemented consistently across public and admin interfaces.*
