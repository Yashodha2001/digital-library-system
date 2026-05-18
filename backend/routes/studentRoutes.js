const express = require('express');
const {
  getAllStudents,
  getStudentById,
  borrowBook,
  returnBook,
  getMyBorrowings,
} = require('../controllers/studentController');
const { authenticate, authorizeAdmin, authorizeStudent } = require('../middleware/auth');

const router = express.Router();

router.get('/borrowings/me', authenticate, authorizeStudent, getMyBorrowings);
router.post('/borrow/:bookId', authenticate, authorizeStudent, borrowBook);
router.post('/return/:bookId', authenticate, authorizeStudent, returnBook);

router.get('/', authenticate, authorizeAdmin, getAllStudents);
router.get('/:id', authenticate, authorizeAdmin, getStudentById);

module.exports = router;
