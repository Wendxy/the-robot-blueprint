import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.md" }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      category: z.string().min(1),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      example: z.boolean().default(false),
      legacy: z.boolean().default(false),
      coverImage: z.string().optional(),
      coverAlt: z.string().min(1).optional(),
      caption: z.string().optional(),
      readingTime: z.number().int().positive().optional(),
    })
    .refine((data) => !data.coverImage || data.coverAlt, {
      message: "Supply coverAlt when a cover image is present.",
      path: ["coverAlt"],
    }),
});

export const collections = { writing };
