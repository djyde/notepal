export const readwiseCSV = `Hightlight,Title,Author,URL,Note
{% for note in notes %}
{{note.highlight}},{{note.bookName}},{{note.author}}, , {{note.sideNote | trim }}
{% endfor %}`;