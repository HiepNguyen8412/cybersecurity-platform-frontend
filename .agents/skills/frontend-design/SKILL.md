---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated AI defaults.
---

# Frontend Design (Bespoke & Distinctive UI/UX)

Approach this as the design lead at a top design studio known for giving every product a distinct visual identity that is never mistaken for templated AI generation. Reject proposals that feel cliché or templated: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take calculated aesthetic risks.

Ground your designs in the subject matter. For this project (**Cybersecurity Intelligence & Platform**), the vernacular comes from high-precision defense telemetry, cloud security, observability, and tactical engineering (Linear, Cloudflare, Datadog, Stripe) — not flashy sci-fi toys or generic purple-gradient SaaS templates.

---

## 🚫 1. Anti-AI Checklist (What to Eliminate)

1. **No generic rainbow/purple gradients:** Stop using `from-purple-500 via-pink-500 to-cyan-500` and neon laser borders.
2. **No uniform 3-card grids:** Break free from predictable alternating rows and identical rule-of-three cards with identical padding and icons.
3. **No magic sparkle icons (`Sparkles`, `Wand`):** Use crisp, purpose-driven icons (`Shield`, `Terminal`, `Activity`, `Cpu`, `Lock`, `Server`, `AlertCircle`) with consistent 1.2px - 1.5px stroke weight.
4. **No marketing fluff / bloated copywriting:** Strip away *"Supercharge your security with next-gen AI-powered matrices"*. Write human, concise, direct copy: *"24 active endpoints"*, *"Firewall synced 2m ago"*, *"Block rule applied"*.
5. **No excessive glassmorphism:** Don't drown every surface in `backdrop-blur-xl`. Use deliberate physical elevation with deep dark canvas and hairline borders (`border-white/[0.06]`).

---

## 🎨 2. Design Principles & Guidelines

### A. Color Discipline (Restrained & Purposeful)
- **Palette Size:** 3 to 5 intentional colors maximum.
- **Deep Base Canvas:** `#090c12` (Main background), `#0f131d` (Elevated card/surface), `#161b28` (Interactive hover).
- **Single Accent Focus:** One controlled tech accent (e.g. Cobalt/Electric Blue `#2563eb` or Sky `#0284c7`).
- **Semantic Status Signals:**
  - Red (`#ef4444` / `text-red-400`): Critical threat or blocker only.
  - Amber (`#f59e0b` / `text-amber-400`): Warning or caution.
  - Emerald (`#10b981` / `text-emerald-400`): Operational health & success.
  - Slate (`text-slate-400` / `text-slate-500`): Metadata and secondary labels.

### B. Typography & Visual Hierarchy
- **Pairing:** Clean modern sans-serif (Inter, Geist, System-UI) paired with high-legibility monospace for telemetry, hashes, ports, and code.
- **Tracking:** Tight tracking (`tracking-tight`) on prominent headings, normal tracking on body and monospace.
- **Contrast Hierarchy:**
  - Primary: `text-white` (100% opacity) for titles and active values.
  - Secondary: `text-slate-400` for descriptions and field labels.
  - Tertiary / Muted: `text-slate-500` for timestamps, metadata, and hints.

### C. Layout & Information Density
- **Content-Driven Layouts:** Mix density appropriately. Dense, scannable data tables with keyboard shortcuts (`<kbd>`) for operational pages; generous whitespace and focused focus points for configuration or overview heroes.
- **Spacing Scale:** Strict multiples of 4px/8px (`gap-2`, `gap-3`, `gap-4`, `gap-6`, `p-4 sm:p-6`).
- **Resilient States:** Every component must gracefully handle:
  - Empty states (with clear next action, not just a sad illustration).
  - Calm loading skeletons (`bg-white/[0.04]` gentle pulse, matching exact layout dimensions 1:1).
  - Error states (explanatory, actionable, calm).
  - Truncation & wrapping on long strings / hashes (`truncate`, tooltip).

### D. Restraint & Self-Critique
- **"Spend boldness in one place":** Let one focal element stand out (a key telemetry metric, a real-time stream, an intuitive threat map), while keeping all supporting elements disciplined and quiet.
- **Micro-interactions:** Snappy transitions (`150ms - 200ms ease-out`), subtle scale effects (`active:scale-[0.98]`), quiet border highlights on focus.
