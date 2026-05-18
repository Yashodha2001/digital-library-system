require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Book = require('../models/Book');

const connectDB = require('../config/db');

const sampleBooks = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    genre: 'Fiction',
    description: 'A classic novel exploring racial injustice in the American South.',
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1960,
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    genre: 'Dystopian',
    description: 'A dystopian social science fiction novel and cautionary tale.',
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 1949,
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    genre: 'Fiction',
    description: 'A portrait of the Jazz Age in all of its decadence and excess.',
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1925,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    genre: 'Technology',
    description: 'A handbook of agile software craftsmanship.',
    totalCopies: 2,
    availableCopies: 2,
    publishedYear: 2008,
  },
];

const seed = async () => {
  await connectDB();

  const existingAdmin = await Admin.findOne({ username: 'admin' });
  if (!existingAdmin) {
    await Admin.create({ username: 'admin', password: 'admin@123' });
    console.log('Admin created — username: admin, password: admin@123');
  } else {
    console.log('Admin already exists, skipping.');
  }

  for (const book of sampleBooks) {
    const exists = await Book.findOne({ isbn: book.isbn });
    if (!exists) {
      await Book.create(book);
      console.log(`Book added: ${book.title}`);
    }
  }

  console.log('Seed completed.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
