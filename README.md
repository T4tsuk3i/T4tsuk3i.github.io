# Tattva — Kensho — Journey

My personal blog: notes on learning, mathematics, systems, reverse engineering, and whatever else I am curious about.

**Live site:** https://t4tsuk3i.github.io/

## Stack

- [Quartz v4](https://quartz.jzhao.xyz/) — static site generator for Markdown notes
- TypeScript, Preact, and a small amount of Svelte-free client code
- GitHub Actions builds the site on every push to `main` and deploys it to GitHub Pages

## Writing a post

Posts live in `content/` as Markdown. A post starts with frontmatter:

```yaml
---
title: Your title
date: 2026-03-17
tags: [mathematics, art, patterns]
---
```

Then write the post, add it to `content/all-posts.md` so it appears in the index, and push to `main`.

## Local development

Requires Node.js 22 or newer.

```sh
npm install
npx quartz build --serve
```

The local site is served at `http://localhost:8080`.

To build without the dev server:

```sh
npx quartz build
```

The output goes to `public/`.

## Deployment

- Repository: `T4tsuk3i/T4tsuk3i.github.io`
- Branch: `main`
- Workflow: `.github/workflows/deploy.yml`
- Pages source: **GitHub Actions**
- URL: https://t4tsuk3i.github.io/

Any push to `main` triggers a build and deploy. The workflow can also be run manually from the **Actions** tab.

## Structure

```text
content/            # Markdown posts and pages
quartz/             # Quartz source and components
quartz.config.ts    # Site title, URL, theme, plugins
quartz.layout.ts    # Layout configuration
.github/workflows/  # Deployment workflow
public/             # Build output (ignored by git)
```

## License

Quartz itself is MIT licensed. The writing in `content/` is © T4tsuk3i unless stated otherwise.
