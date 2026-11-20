import { getCollection, type CollectionEntry } from "astro:content";

export type Note = CollectionEntry<"writing">;
export const href = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
export const noteHref = (note: Note) => href(`writing/${note.id}/`);

export async function getNotes() {
  const notes = await getCollection("writing", ({ data }) => !data.draft);
  return notes.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Sydney",
  });
