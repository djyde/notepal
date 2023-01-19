export type Note = {
  bookName: string;
  author: string;
  children: {
    bookName: string,
    author: string,
    chapterName: string;
    highlight: string;
    sideNote: string;
  }[];
};
