const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
      default: 'General',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    publishedYear: {
      type: Number,
    },
  },
  { timestamps: true }
);

bookSchema.pre('save', function syncAvailable(next) {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
  return next();
});

module.exports = mongoose.model('Book', bookSchema);
