const Admin = require('../models/Admin');
const Student = require('../models/Student');
const { signToken } = require('../utils/token');

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken({ id: admin._id, role: 'admin', username: admin.username });

    return res.json({
      message: 'Admin login successful.',
      token,
      user: { id: admin._id, username: admin.username, role: 'admin' },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const studentRegister = async (req, res) => {
  try {
    const { name, email, studentId, password } = req.body;

    if (!name || !email || !studentId || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await Student.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { studentId: studentId.toUpperCase().trim() }],
    });

    if (existing) {
      return res.status(409).json({ message: 'Email or student ID already registered.' });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      studentId: studentId.toUpperCase().trim(),
      password,
    });

    const token = signToken({
      id: student._id,
      role: 'student',
      email: student.email,
      studentId: student.studentId,
    });

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        role: 'student',
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or student ID already registered.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken({
      id: student._id,
      role: 'student',
      email: student.email,
      studentId: student.studentId,
    });

    return res.json({
      message: 'Student login successful.',
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        role: 'student',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) return res.status(404).json({ message: 'Admin not found.' });
      return res.json({ user: { id: admin._id, username: admin.username, role: 'admin' } });
    }

    const student = await Student.findById(req.user.id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author isbn');

    if (!student) return res.status(404).json({ message: 'Student not found.' });

    return res.json({
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        role: 'student',
        borrowedBooks: student.borrowedBooks,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { adminLogin, studentRegister, studentLogin, getProfile };
