const express = require('express');
const app = express();

app.use(express.json());

let books = [];

app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.post('/books', (req, res) => {
  const { title, author, publisher, publishedDate, ISBN } = req.body;

  if (!title || !author || !publisher || !publishedDate || !ISBN) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const bookExists = books.some((book) => book.ISBN === ISBN);
  if (bookExists) {
    return res.status(400).json({ message: 'Book with this ISBN already exists' });
  }

  const newBook = { title, author, publisher, publishedDate, ISBN };
  books.push(newBook);
  res.status(201).json({ message: 'Book added successfully', book: newBook });
});

app.put('/books/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { title, author, publisher, publishedDate } = req.body;

  const bookIndex = books.findIndex((book) => book.ISBN === isbn);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...(title && { title }),
    ...(author && { author }),
    ...(publisher && { publisher }),
    ...(publishedDate && { publishedDate }),
  };

  res.status(200).json({ message: 'Book updated successfully', book: books[bookIndex] });
});

app.delete('/books/:isbn', (req, res) => {
  const { isbn } = req.params;

  const bookIndex = books.findIndex((book) => book.ISBN === isbn);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.status(200).json({ message: 'Book deleted successfully' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
