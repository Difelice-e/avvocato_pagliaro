# Design System — Studio Legale Pagliaro

Source of truth: `src/pages/index.astro` (homepage overrides all other pages on conflicts).

---

## Brand Identity

**Name:** Studio Legale Pagliaro  
**Tagline:** *Il tuo diritto è la mia professione.*  
**Specialization:** Diritto del lavoro, previdenza sociale, pubblico impiego  
**Tone:** Authoritative, human, precise. Formal but approachable.  
**Accent motif:** Amber/gold (`#f7bd48`) against deep navy (`#041627`)

---

## Color Palette

All colors are defined as custom Tailwind tokens in `tailwind.config.cjs`.

### Primary scale
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#041627` | Dark navy. Main text, buttons, filled sections |
| `on-primary` | `#ffffff` | Text on primary backgrounds |
| `primary-container` | `#1a2b3c` | Dark card backgrounds (e.g. floating info box) |
| `on-primary-container` | `#8192a7` | Muted text on dark backgrounds |
| `primary-fixed` | `#d2e4fb` | Light primary tint |
| `primary-fixed-dim` | `#b7c8de` | Dimmer light primary tint |

### Accent (tertiary — amber/gold)
| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary-fixed-dim` | `#f7bd48` | **Primary accent.** Icons, dividers, underlines, CTA borders |
| `tertiary-fixed` | `#ffdea6` | Lighter amber (selection highlight) |
| `tertiary` | `#1e1300` | Very dark amber/brown (left border accent on quote blocks) |
| `tertiary-container` | `#382600` | Dark amber container |
| `on-tertiary-container` | `#ba880e` | Text on amber container (label overlines) |

### Surface scale
| Token | Hex | Usage |
|-------|-----|-------|
| `background` / `surface` / `surface-bright` | `#fbf9fa` | Page backgrounds (identical) |
| `surface-container-low` | `#f5f3f4` | Alternate section bg (slightly darker) |
| `surface-container` | `#efedef` | Card backgrounds |
| `surface-container-high` | `#e9e7e9` | Image placeholder bg |
| `surface-container-highest` | `#e4e2e3` | Darkest card / quote block bg |
| `surface-container-lowest` | `#ffffff` | Pure white cards |
| `surface-dim` | `#dbd9db` | Dimmed surface |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `on-background` / `on-surface` | `#1b1c1d` | Body text |
| `on-surface-variant` | `#44474c` | Secondary/muted text |
| `outline` | `#74777d` | Borders, captions |
| `outline-variant` | `#c4c6cd` | Subtle dividers |

### Footer
The footer uses standard Tailwind slate: `bg-slate-900`, text `slate-400 / slate-100`, accent `amber-400`.

---

## Typography

| Role | Font | Tailwind class |
|------|------|----------------|
| Display / Headings | Newsreader (serif, italic for display) | `font-serif` / `font-headline` |
| Body | Inter | `font-body` / `font-sans` |
| Labels / UI | Inter | `font-label` |

**Heading sizes (homepage reference):**
- H1 hero: `text-6xl lg:text-8xl` — Newsreader, `leading-[1.1] tracking-tight`
- H2 section: `text-5xl` — Newsreader
- H3 card: `text-3xl` — Newsreader
- Label overline: `text-xs uppercase tracking-[0.3em]` — Inter

**Body:** `text-xl` for lead paragraphs, `text-lg` for standard body, `text-sm` for captions.

**Material Symbols:** Used for icons throughout. Font variation: `'FILL' 0, 'wght' 300`.

---

## Layout

**Max width:** `max-w-7xl mx-auto px-8`  
**Section padding:** `py-32`  
**Container padding (narrower):** `max-w-5xl` (CTA), `max-w-3xl` (legal pages)

**Grid system:**
- Hero: `grid-cols-1 lg:grid-cols-12` — content on 7 cols, image on 5 cols
- Bento: `grid-cols-1 md:grid-cols-3` — with `md:col-span-2` for wide cards
- Team: `grid-cols-1 md:grid-cols-2`
- Footer: `grid-cols-1 md:grid-cols-4`

---

## Component Patterns

### Navigation
- Fixed, `h-24`, glass: `bg-white/80 backdrop-blur-lg`
- Logo: `text-2xl font-serif font-bold tracking-tighter text-slate-900`
- Nav links: `font-serif text-lg tracking-tight`
- Active link: `text-slate-900 border-b border-amber-400 pb-1 font-medium`
- Inactive link: `text-slate-500 hover:text-slate-900 transition-colors duration-200`
- CTA button: `bg-primary text-on-primary px-6 py-3 rounded-sm font-label text-sm uppercase tracking-widest`

### Buttons
Two variants:
1. **Filled primary:** `bg-primary text-on-primary px-8 py-5 rounded-sm font-label text-sm uppercase tracking-widest hover:bg-primary/85 active:scale-[0.97] transition-all duration-200`
2. **Outline primary:** `border border-primary text-primary px-8 py-4 rounded-sm font-label text-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary active:scale-[0.97] transition-all duration-200`

Both use `rounded-sm` (2px radius). CTA buttons include an arrow icon with `.cta-arrow` class for hover animation.

### Section Divider
`<div class="h-1 w-24 bg-tertiary-fixed-dim"></div>` — always below section headings.

### Quote Blocks
```
bg-surface-container-highest p-12 relative
  border-l-4 border-tertiary (dark amber)
  font-headline text-3xl text-primary italic
  cite: font-label text-xs uppercase tracking-widest text-outline
```

### CTA Banner
```
bg-surface-container-highest p-16 md:p-24 text-center
  border-l-4 border-tertiary-fixed-dim
  h2: font-serif text-5xl text-primary
  decorative icon: absolute top-0 right-0 p-12 opacity-5
```

### Dark CTA Section
```
bg-primary py-32 relative overflow-hidden
  background image at opacity-[0.05] mix-blend-luminosity
  h2: font-serif text-4xl text-on-primary
  divider: h-px w-16 bg-tertiary-fixed-dim mx-auto
```

### Bento Cards
- Base: `relative overflow-hidden p-12 h-96 flex flex-col`
- `.bento-card` class: hover lifts `translateY(-3px)` with shadow
- Wide card (col-span-2): accent left border `border-l-4 border-tertiary-fixed-dim`
- Dark card: `bg-primary` with icon in `text-tertiary-fixed-dim`

### Images
- All portrait photos: `grayscale` by default, `hover:grayscale-0 transition-all duration-700`
- Hero portrait: `grayscale shadow-2xl`
- Background images: `grayscale opacity-[0.05] mix-blend-luminosity`

### Footer
`bg-slate-900`, 4-column grid, `py-16 px-8`, `border-t border-slate-800`.
Logo in italic `text-amber-400`. Legal links at `text-[10px] uppercase tracking-[0.2em]`.

---

## Animation System

### Hero entrance (CSS, `src/layouts/Layout.astro`)
- `hero-anim-1` through `hero-anim-4`: staggered `fadeUp` (0.05s → 0.50s delay)
- `hero-img-anim`: 0.15s delay, 0.90s duration
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)

### Scroll reveal
- Class: `.reveal` — opacity 0 + translateY(28px) → visible state
- Triggered by IntersectionObserver (threshold 0.10, rootMargin -40px bottom)
- Delay variants: `.reveal-delay-1` through `.reveal-delay-5` (0.08s increments)

### Micro-interactions
- `.cta-arrow`: arrow icon slides right 5px on parent `.group:hover`
- `.bento-card`: lifts 3px + shadow on hover
- `.link-card`: lifts 2px + amber border on hover (risorse page)
- Nav: `.scrolled` class adds box-shadow when `scrollY > 12`

### Stat counter (homepage only)
IntersectionObserver triggers ease-out cubic counter from 0 to target over 1200ms.

---

## Spacing Reference

| Purpose | Value |
|---------|-------|
| Section vertical padding | `py-32` (8rem) |
| Hero top padding (nav clearance) | `pt-24` (hero) / `pt-32` (inner pages) |
| Card padding | `p-12` (large), `p-10` / `p-8` (medium) |
| Container horizontal | `px-8` |
| Section gap (grid) | `gap-12` standard, `gap-24` for two-column layouts |

---

## Page Structure

All pages use `src/layouts/Layout.astro` which injects:
- Head with meta, OG, JSON-LD, Google Fonts
- `<Header currentPage="...">` (highlights active nav link)
- `<slot />` (page content)
- `<Footer />`
- Shared JS: navbar scroll shadow + scroll-reveal observer

**URL structure (clean, no `.html`):**
- `/` → Home
- `/competenze` → Competenze
- `/lo-studio` → Lo Studio (team + biography)
- `/contatti` → Contatti (form + maps)
- `/profilo` → Profilo (Emanuele's personal profile)
- `/risorse` → Link utili istituzionali
- `/privacy-policy`, `/cookie-policy`, `/note-legali` → Legal pages (noindex)
