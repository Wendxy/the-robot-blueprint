import type { APIRoute } from "astro";
import { getNotes, href, noteHref } from "../lib/posts";
import { escapeXml } from "../lib/xml";

export const GET: APIRoute = async ({ site, url }) => {
  const absolute = (path: string) => escapeXml(new URL(path, site ?? url).href);
  const notes = (await getNotes()).filter((note) => !note.data.example);
  const items = notes.map((note) => {
    const link = absolute(noteHref(note));
    return `<item>
      <title>${escapeXml(note.data.title)}</title>
      <description>${escapeXml(note.data.description)}</description>
      <category>${escapeXml(note.data.category)}</category>
      <pubDate>${note.data.date.toUTCString()}</pubDate>
      <link>${link}</link><guid isPermaLink="true">${link}</guid>
    </item>`;
  });
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"><channel><title>Motion / Notes</title>
    <link>${absolute(href())}</link><description>An independent robotics journal.</description>
    <language>en-au</language>${items.join("\n")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
