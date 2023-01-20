import { Note } from "./model";

export const wxReadPlaceholder = `《恋情的终结》
格雷厄姆·格林
3个笔记


◆  第一部

>> 我满怀嫉恨地想：一个人要是稳稳当当地拥有一件东西，那就从来不需要去用它。

>> 我想自己之所以会注意到萨拉，是因为她很快乐：那几年里，在即将到来的风暴的威压下，快乐的感觉已经奄奄一息很久了。人们会在喝醉酒的人身上、在孩子们身上发觉快乐，但很少会再在别的什么地方看到它。

>> 因为一盘洋葱而爱上一个人，这可能吗？似乎不太可能，然而我可以发誓，我就是在那一刻坠入情网的。当然，那并不简单地是因为洋葱——而是因为突然产生的那种感觉：觉得她是一个作为个体而存在的女人，觉得她很坦率，这种坦率后来曾如此频繁地让我感到快乐和难过。

`;
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
