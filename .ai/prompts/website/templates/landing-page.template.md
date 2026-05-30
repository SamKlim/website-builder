# Landing Page — Build Prompt Template

Copy this template, replace bracketed placeholders, and paste into chat to generate a new landing page.

---

Build a React + Vite + Tailwind CSS landing page for "[Site Name]" - [what the site is].
Use the shaders package (npm: shaders) for the hero background, lucide-react for icons.
The page has [N] sections. Match every detail exactly:

---

## SECTION 1: HERO (Full viewport height)

**Background:** [base color] with a full-screen animated shader overlay 
(positioned absolute, inset-0, z-10, pointer-events-none). Shader stack:
- Swirl - colorA: [color], colorB: [color], detail: [value]
- ChromaFlow - baseColor: [color], downColor/leftColor/rightColor/upColor: [accent color], 
  momentum: [value], radius: [value]
- FlutedGlass - aberration: [value], angle: [value], frequency: [value], highlight: [value], 
  highlightSoftness: [value], lightAngle: [value], refraction: [value], shape: "[value]", 
  softness: [value], speed: [value]
- FilmGrain - strength: [value]

**Navigation (z-20, relative):** Pill-shaped [color] navbar (rounded-full) with [N]px padding, 
inside a max-w-[1440px] container with p-2 sm:p-3.
- LEFT: [logo shape + size] with [text] ([font size], font-bold, tracking-tight). 
  Nav links (hidden mobile, md+): "[link]", "[link]", "[link]", "[link]" — 14px, 
  [text color], hover:[color], transition-colors duration-300, gap-6.
- RIGHT (hidden mobile, md+):
  - "[availability text]" (13px, [color], hidden below lg)
  - Clock icon (lucide, size 14) + live [city] time "{HH:MM} in [City]" (13px, [color])
  - CTA button: [bg], [text color], 13px font-medium, rounded-full, pl-5 pr-2 py-2.
    Text "[label]" with HOVER TEXT ROLL: duplicated text in flex-col, overflow-hidden, 
    h-[20px], group-hover translates -50% vertically (duration-500, ease cubic-bezier(0.25,0.1,0.25,1)).
    [Icon] in [color] circle (w-6 h-6) that rotates -45deg to 0deg on hover (same easing).
- MOBILE: "[Open]"/"[Close]" toggle (md:hidden), [bg], rounded-full, Menu/X icons from lucide-react.

**Mobile Menu Overlay:** Fixed inset-0, z-50. Black/60 backdrop. [Color] bottom sheet 
(rounded-2xl, mx-3 mb-3) slides up (translate-y-full → translate-y-0, duration-500, 
ease cubic-bezier(0.32,0.72,0,1)). Contains: [time badge], nav links ([size] font-medium), 
"[CTA]" button with arrow.

**Hero Content (z-20):** Bottom of viewport via flexbox (flex-1 spacer above). 
Max-w-[1440px], px-5 sm:px-8 lg:px-12, pb-14 sm:pb-16 lg:pb-20.
- Label: "[Site Name]" (13px/14px, [color], tracking-wide, mb-5 sm:mb-8)
- Headline h1: "[line 1] / [line 2] / [line 3]"
  clamp(1.75rem,7vw,4.2rem) mobile, clamp(2.5rem,5vw,4.2rem) sm+.
  font-medium, leading-[1.08], tracking-[-0.03em], [color].
  Line breaks: <br className="hidden sm:block" /> with <span className="sm:hidden"> </span> fallback.
- CTA row (mt-8 sm:mt-12, flex-col sm:flex-row, gap-4 sm:gap-5):
  - Primary button: [bg], hover:[bg], [text color], 13px, rounded-full, pl-5 sm:pl-6 pr-2 py-2.
    Text roll hover animation. [Icon] rotates -45deg on hover.
  - Secondary badge: [bg] pill, shadow (0_2px_8px_rgba(0,0,0,0.08)), 
    hover shadow (0_4px_16px_rgba(0,0,0,0.12)), rounded-[4px].
    Contains: [SVG icon], "[label]" text, dark sub-badge "[tag]".

---

## SECTION 2: [NAME] ([bg color])

[bg], pt-16 sm:pt-20 lg:pt-32, pb-12 sm:pb-16 lg:pb-24, overflow-hidden. Max-w-[1440px].

**Badge row:** px-5 sm:px-8 lg:px-12, flex items-center gap-3, mb-6 sm:mb-8.
- Numbered circle: w-6 h-6 sm:w-7 sm:h-7, rounded-full, bg-gray-900, text-white, 
  11px font-semibold. Shows "1".
- Pill label: "[label]" — 12px, font-medium, border border-[color], rounded-full, px-3 sm:px-4 py-1.

**Heading h2:** "[headline]" — clamp(1.5rem,4vw,3.2rem), font-medium, leading-[1.12], 
tracking-[-0.02em], [color], mb-12 sm:mb-16 lg:mb-28.

**Content (responsive):**
- MOBILE (lg:hidden): [element], [element], images stacked flex-col sm:flex-row gap-4.
  Images: [aspect ratios], rounded-xl sm:rounded-2xl, object-cover.
- DESKTOP (hidden lg:grid): grid-cols-[X%_1fr_X%] items-end gap-6 xl:gap-8.
  - Left (self-end): [image], aspect-[W/H], rounded-2xl.
  - Center (self-start): [text] + [button with text roll + -45deg arrow].
  - Right (self-end): [image], aspect-[W/H], rounded-2xl.

**Assets:**
- [Name]: `[url]`
- [Name]: `[url]`

---

## SECTION [N]: [NAME] ([bg color])

[bg], pt-16 sm:pt-20 lg:pt-28, pb-16 sm:pb-20 lg:pb-28. Max-w-[1440px].

**Badge row:** Same pattern, number "[N]", label "[label]".

**Heading h2:** "[headline]" — same clamp sizing as hero, font-medium, leading-[1.08], 
tracking-[-0.03em], mb-10 sm:mb-14 lg:mb-16.

**Cards Grid:** grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7, px-5 sm:px-8 lg:px-12.

**Card [N] ([Name]):**
- Media container: aspect-[W/H], rounded-2xl, overflow-hidden, bg-[color], group, cursor-pointer.
- Video: src="[url]", autoPlay muted loop playsInline, w-full h-full object-cover.
- Hover pill (absolute bottom-4 left-4): [bg] circle (h-9 w-9) expands to w-[Npx] on group-hover 
  (transition-all duration-300 ease-in-out). Contains "[label]" text (opacity 0→1, delay-100) 
  + [icon] (-rotate-45 → rotate-0 on hover).
- Description: "[text]" — 13px, [color], mt-4, leading-relaxed.
- Title: "[name]" — 14px, font-semibold, [color], mt-1.

---

## GLOBAL STYLES (index.css)

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg, 
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, 
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, 
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.55;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' 
    width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' 
    baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='matrix' 
    values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter>
    <rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 240px 240px;
}
```

---

## TECHNICAL DETAILS

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 3.4 (default config, no custom theme extensions)
- **Packages:** [list with roles]
- **Font:** [font name] (system fallback)
- **All animations:** duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] unless noted
- **Max content width:** 1440px, centered with mx-auto
- **Responsive breakpoints:** Default Tailwind (sm:640px md:768px lg:1024px xl:1280px)
- **[Special feature e.g. live clock]:** [description]
