# ತತ್ವ – 見性 – 여정 — Field Ledger

A personal notebook built with [Quartz 4](https://quartz.jzhao.xyz). Cream-and-lavender
paper theme, tag-driven chronicle, and a single-entry homepage dashboard.

Live: **https://t4tsuk3i.github.io/blog/**

## Structure

| Path | Purpose |
|---|---|
| `content/` | All pages and posts (Markdown). This is the only folder you normally edit. |
| `quartz/` | Quartz source: components, plugins, styles, scripts. |
| `quartz/styles/custom.scss` | The whole visual theme (tokens, layout, typography, components). |
| `quartz.config.ts` | Site title, base URL, palette, fonts, plugins. |
| `quartz.layout.ts` | Header, sidebars, homepage components. |
| `.github/workflows/deploy.yml` | Builds and publishes to GitHub Pages on every push to `main`. |
| `CREDITS.md` | Licences for the free/open-source resources used. |

## Local development

```bash
npm ci
npx quartz build --serve     # http://localhost:8080
```

Requires Node 22 (see `.node-version`).

## Writing

- Add a post to `content/` with frontmatter: `title`, `date`, `tags`, optional `category`,
  `description`, `cover`.
- Tags become topic pages automatically (`/tags/<tag>`).
- The homepage counts, the chronicle list and the "Now" panel are generated from the
  content — no numbers are hardcoded.

## Deploying

Push to `main`. GitHub Actions builds the site and publishes it to GitHub Pages.
No other workflow is needed.

## Licence

- Site content © T4tsuk3i.
- Quartz is MIT — see `LICENSE.txt`.
- Fonts, icons and other resources are listed in `CREDITS.md`.
