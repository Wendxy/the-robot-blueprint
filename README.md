# The Robot Blueprint

An independent robotics research journal built with Astro, TypeScript, Markdown and plain CSS. Fonts and the handoff's original arm sketch ship with the site. Readers can navigate the entire journal with JavaScript disabled.

## Run locally

Use Node 22.19 or later. With nvm installed, run:

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Astro. To check the production output, run `npm run build`, `npm run check:links`, and `npm run preview`.

## Write a note

Create a Markdown file in `src/content/writing/`. Its filename becomes its permanent address, e.g. `a-gripper-observation.md` becomes `/writing/a-gripper-observation/`. Begin with frontmatter like this draft, using the actual publication date when ready.

```yaml
---
title: "Watching the first moment of contact"
description: "A note on what a camera can reveal as a gripper begins to close."
date: 2026-11-21
category: "Field note"
tags: ["Robot learning", "imitation learning"]
draft: true
featured: false
---
```

- Write the introduction directly under the frontmatter. Use level-two headings for sections. Markdown supports lists, tables, quotations, links, images, and fenced code with a language name for highlighting.
- Set `draft: false` to build the note. Drafts have no article route and appear in no index, feed, or sitemap. Source files are visible to anyone with repository access.
- Set `featured: true` to feature the note. The newest marked entry wins. If none is marked, the homepage features the newest visible entry. The next four entries form the homepage index. The archive lists all visible entries by date, then slug for ties.
- Set `example: true` for a demonstration. Its date is labelled as its preparation date in the archive and article. Examples have working routes but are omitted from RSS.
- The optional `readingTime` is a positive integer in minutes. For a cover, set `coverImage` to a file path under `public/` (e.g. `/images/articulated-arm.svg`) or an HTTPS image URL, add descriptive `coverAlt`, and optionally add `caption`.
- Research threads and their matching tags live in `src/lib/research.ts`. A matching tag includes the article on that thread's reading list.

For a figure inside a note, place an image beside the Markdown file and use a relative Markdown image link. For captioned media or a robotics demo, use HTML `figure` and `figcaption` with an `img` or a `video controls playsinline preload="metadata"`. Give images descriptive alt text. Include captions for speech and a written description of relevant motion. For raw HTML video URLs, use a hosted media URL or a path relative to the finished article URL so it also works under a GitHub project prefix.

## Project structure

- `src/pages/index.astro` composes the V2 homepage.
- `src/pages/writing/` contains the archive and reusable article template. `research.astro` and `about.astro` provide the supporting pages.
- `src/content.config.ts` validates frontmatter. `src/lib/posts.ts` handles filtering, ordering, and links.
- `src/layouts/Base.astro` provides navigation, metadata, and the footer. `src/components/` contains the shared index, figure, and journal statement. `src/styles/global.css` defines typography and responsive layouts.
- `/rss.xml`, `/sitemap.xml`, and `/robots.txt` are generated at build time.

## GitHub Pages

Choose **GitHub Actions** in the repository's Pages settings. The existing deployment workflow builds and checks pushes to `main`, then deploys `dist/`. It supplies the public site URL and base path. Canonical tags are emitted when a site URL is configured.

To test a project prefix locally:

```sh
export SITE_URL=https://wendxy.github.io/the-robot-blueprint/
export BASE_PATH=/the-robot-blueprint/
npm run build
npm run check:links
```

