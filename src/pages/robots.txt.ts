import type { APIRoute } from "astro";
import { href } from "../lib/posts";
export const GET: APIRoute = ({ site }) => {
  const sitemap = site
    ? `Sitemap: ${new URL(href("sitemap.xml"), site).href}\n`
    : "";
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
