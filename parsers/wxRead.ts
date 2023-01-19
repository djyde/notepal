import { Note } from "./model";

export function parseWXRead(input: string) {
  const lines = input.trim().split("\n");
  let lineNumber = 0;
  const note = {
    children: [] as Note["children"],
  } as Note;

  let currentChapter = "";
  let inSideNote = false;
  let sideNote = "";
  let shouldIgnore = false;
  while (lineNumber < lines.length) {
    const line = lines[lineNumber];
    if (lineNumber === 0) {
      note.bookName = line.replace("《", "").replace("》", "");
      lineNumber++;
      continue;
    }
    if (lineNumber === 1) {
      note.author = line;
      lineNumber++;
      continue;
    }
    if (lineNumber === 2) {
      // igore the count line
      lineNumber++;
      continue;
    }
    if (!line) {
      lineNumber++;
      continue;
    }

    if (line.startsWith("◆")) {
      const chapterName = line.replace("◆  ", "");
      currentChapter = chapterName;
      lineNumber++;
      continue;
    }

    if (line.startsWith(">>")) {
      if (inSideNote) {
        inSideNote = false;
        note.children.push({
          bookName: note.bookName,
          author: note.author,
          chapterName: currentChapter,
          highlight: line.replace(/^>> /, ""),
          sideNote: sideNote,
        });
        sideNote = "";
        shouldIgnore = true;
        lineNumber++;
        continue;
      }
      if (!shouldIgnore) {
        note.children.push({
          bookName: note.bookName,
          author: note.author,
          chapterName: currentChapter,
          highlight: line.replace(/^>> /, ""),
          sideNote: "",
        });
      } else {
        shouldIgnore = false;
      }
      lineNumber++;
      continue;
    }

    if (inSideNote) {
      sideNote += "\n" + line;
      lineNumber++;
      continue;
    }

    if (`${line}`.match(/^\d{4}\/\d\d?\/\d\d?/)) {
      inSideNote = true;
      lineNumber++;
      continue;
    }

    lineNumber++;
  }

  return note;
}
