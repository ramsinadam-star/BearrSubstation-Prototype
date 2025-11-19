
# BearrSubstation Calculator Template (Voltage Drop–style)

Use `pages/template/calculator-template.html` as the starting point for all new calculators/tools.

## Includes
- Canonical header & footer (from `index.html`)
- Mobile search placement (header search hidden on small screens; `.mobile-search` in body)
- Back link above `<h1>`
- `<main class="content" id="content">` wrapper
- `.grid two` form scaffold
- Standard action bar: **Calculate** + **Clear** (Clear reloads the page)
- `#result` output container
- Hook to `assets/js/calc-template.js`

## Steps to create a new calculator
1. Copy `pages/template/calculator-template.html` to your destination (e.g., `pages/electrical/my-tool.html`).
2. Change `<title>`, `<h1>`, and the subtitle line.
3. Replace the example inputs with your real fields (keep `.grid two` for layout).
4. Implement logic in a new JS (e.g., `assets/js/my-tool.js`) or reuse `calc-template.js` as a starting point.
5. Add a card/link on `pages/electrical.html` (and any other landing page) to point to your new HTML.

## Notes
- Clear uses a global instant reload (same as manual refresh).
- Keep the back link above `<h1>` for consistency.
