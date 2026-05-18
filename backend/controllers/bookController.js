const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({ books });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    return res.json({ book });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, description, totalCopies, publishedYear } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author, and ISBN are required.' });
    }

    const copies = Math.max(1, Number(totalCopies) || 1);

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      genre: genre?.trim() || 'General',
      description: description?.trim() || '',
      totalCopies: copies,
      availableCopies: copies,
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
    });

    return res.status(201).json({ message: 'Book added successfully.', book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A book with this ISBN already exists.' });
    }
    return res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    const { title, author, isbn, genre, description, totalCopies, publishedYear } = req.body;

    const borrowedCount = book.totalCopies - book.availableCopies;

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (isbn) book.isbn = isbn.trim();
    if (genre !== undefined) book.genre = genre.trim();
    if (description !== undefined) book.description = description.trim();
    if (publishedYear !== undefined) book.publishedYear = Number(publishedYear);

    if (totalCopies !== undefined) {
      const newTotal = Math.max(1, Number(totalCopies));
      if (newTotal < borrowedCount) {
        return res.status(400).json({
          message: `Cannot reduce copies below ${borrowedCount} (currently borrowed).`,
        });
      }
      book.totalCopies = newTotal;
      book.availableCopies = newTotal - borrowedCount;
    }

    await book.save();
    return res.json({ message: 'Book updated successfully.', book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A book with this ISBN already exists.' });
    }
    return res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    const borrowedCount = book.totalCopies - book.availableCopies;
    if (borrowedCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete a book that is currently borrowed.',
      });
    }

    await book.deleteOne();
    return res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
