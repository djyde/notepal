import { Note } from "../parsers/model";
import nunjucks from "nunjucks";
import { flatMap, groupBy } from "lodash";
import { readwiseCSV } from "./readwiseCSV";

const templates = {
  readwiseCSV,
} as Record<string, string>;

export function transform(notes: Note[], template: string) {
  const flatNotes = flatMap(notes, (note) => note.children);
  return nunjucks.renderString(templates[template], {
    notes: flatNotes
  });
}
