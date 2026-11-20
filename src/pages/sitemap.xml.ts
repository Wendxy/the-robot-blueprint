import type { APIRoute } from "astro";
import { getNotes, href, noteHref } from "../lib/posts";
import { escapeXml } from "../lib/xml";

export const GET: APIRoute = async ({ site, url }) => {
  const paths = [
    href(),
    href("writing/"),
    href("research/"),
    href("about/"),
    ...(await getNotes()).map(noteHref),
  ];
  const entries = paths.map(
    (path) =>
      `<url><loc>${escapeXml(new URL(path, site ?? url).href)}</loc></url>`,
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("\n")}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
