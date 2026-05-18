const Student = require('../models/Student');

const BORROW_DAYS = 14;

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn')
      .sort({ createdAt: -1 });

    const enriched = students.map((student) => {
      const active = student.borrowedBooks.filter(
        (b) => b.status === 'borrowed' || b.status === 'overdue'
      );
      const returned = student.borrowedBooks.filter((b) => b.status === 'returned');

      return {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        createdAt: student.createdAt,
        activeBorrowings: active,
        returnedHistory: returned,
        borrowingSummary: {
          activeCount: active.length,
          totalBorrowed: student.borrowedBooks.length,
          overdueCount: active.filter((b) => b.status === 'overdue').length,
        },
      };
    });

    return res.json({ students: enriched });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn genre');

    if (!student) return res.status(404).json({ message: 'Student not found.' });

    return res.json({ student });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const Book = require('../models/Book');
    const { bookId } = req.params;

    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    if (book.availableCopies < 1) {
      return res.status(400).json({ message: 'No copies available for this book.' });
    }

    const alreadyBorrowed = student.borrowedBooks.some(
      (b) => b.book.toString() === bookId && (b.status === 'borrowed' || b.status === 'overdue')
    );

    if (alreadyBorrowed) {
      return res.status(400).json({ message: 'You have already borrowed this book.' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

    student.borrowedBooks.push({
      book: book._id,
      borrowedAt: new Date(),
      dueDate,
      status: 'borrowed',
    });

    book.availableCopies -= 1;
    await book.save();
    await student.save();

    const updated = await Student.findById(student._id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn');

    return res.json({
      message: 'Book borrowed successfully.',
      dueDate,
      student: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const Book = require('../models/Book');
    const { bookId } = req.params;

    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const borrowing = student.borrowedBooks.find(
      (b) =>
        b.book.toString() === bookId && (b.status === 'borrowed' || b.status === 'overdue')
    );

    if (!borrowing) {
      return res.status(400).json({ message: 'You do not have an active loan for this book.' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    borrowing.status = 'returned';
    borrowing.returnedAt = new Date();
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);

    await book.save();
    await student.save();

    const updated = await Student.findById(student._id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn');

    return res.json({
      message: 'Book returned successfully.',
      student: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyBorrowings = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn genre availableCopies');

    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const now = new Date();
    student.borrowedBooks.forEach((b) => {
      if (b.status === 'borrowed' && b.dueDate < now) {
        b.status = 'overdue';
      }
    });
    await student.save();

    return res.json({
      borrowedBooks: student.borrowedBooks,
      active: student.getActiveBorrowings(),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  borrowBook,
  returnBook,
  getMyBorrowings,
};
