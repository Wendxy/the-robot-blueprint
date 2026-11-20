import { defineConfig } from "astro/config";

// GitHub Pages supplies the deployment URL and repository prefix during the build.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || "/",
  trailingSlash: "always",
  output: "static",
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: "github-light" } },
});
