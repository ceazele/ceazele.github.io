# ceazele.github.io — Claude Instructions

## About the Site
Personal academic site for Lyle Goodyear (Stanford CS, 2022–2026).
- Theme: al-folio (Jekyll), deployed via GitHub Pages
- URL: https://ceazele.github.io
- Contact: lyleg@stanford.edu

## Tech Stack
- Jekyll 4.x with Liquid templating
- SCSS via `assets/css/main.scss` and `_sass/`
- MathJax for math rendering, D3.js used in projects
- Ruby 3.3.0 managed via rbenv (`.ruby-version` set in repo root)

## Key Directories
- `_pages/` — main site pages (about, cv, projects, arxiv, news)
- `_projects/` — project cards (boxinggym.md, llmlearning.md, rationingexperiences.md)
- `_news/` — announcement items (4 so far)
- `_bibliography/papers.bib` — BibTeX entries, rendered on the arXiv page
- `_data/cv.yml` — structured CV data (education, experience, skills)
- `_data/coauthors.yml`, `venues.yml`, `socials.yml`, `repositories.yml`
- `assets/img/` — images including profile pics and project thumbnails
- `assets/pdf/LyleGoodyearCV.pdf` — CV PDF

## Commands
```bash
bundle exec jekyll serve --livereload   # local preview at localhost:4000
bundle exec jekyll build                # one-off build to _site/
npm run build:sim                       # bundle simulation → assets/js/degroot-simulation.js
```

## Local Dev Workflow
After making any change, restart the local Jekyll server so the user can verify it in the browser:
1. Kill any running `jekyll serve` process: `pkill -f "jekyll serve"`
2. Start a fresh server in the background: `bundle exec jekyll serve --livereload > /tmp/jekyll.log 2>&1 &`
3. Wait a few seconds for the build, then confirm it's running: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4000`
4. Tell the user the site is live at http://localhost:4000 and which page to check.

If the simulation JS bundle also changed, run `npm run build:sim` before starting Jekyll.

## Content Conventions
- New announcements go in `_news/` as `announcement_N.md`
- New projects go in `_projects/` with front matter matching existing files
- Bibliography entries go in `_bibliography/papers.bib`; the arXiv page renders them automatically via jekyll-scholar
- CV data is in `_data/cv.yml`, not hardcoded in the page

## Rational DeGroot Learning Simulation
Companion simulation to an economics paper on strategic attention allocation in social networks, co-authored with Markus Mobius (MSR).

**Source**: `degroot-simulation.jsx` (root) — React component, no external imports
**Entry**: `src/degroot-main.jsx` — mounts to `<div id="degroot-root">`
**Build**: `npm run build:sim` → outputs `assets/js/degroot-simulation.js` (IIFE, ~600KB)
**Page**: `_pages/degroot.md` — Jekyll page at `/degroot-simulation/`, loads the bundle
**Vite config**: `vite.config.js`

Tech:
- React 19 (bundled via Vite)
- Tailwind CSS (pre-compiled via Vite → `assets/js/degroot-simulation.css`, injected into `<head>` via `extra_css` front matter)
- In-browser convex optimization (projected gradient descent, Breen-Kirkland formulation)

Key math:
- Agents minimize MSE by choosing attention weights on neighbors
- Convex reformulation: variables (π, B), minimize ||π||²
- Constraints: B1=π, 1'B=π', B_ij ≥ ε·π_i on edges, B_ij=0 off edges
- Recovery: A_ij = B_ij / π_i
