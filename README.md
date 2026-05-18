# Readora

## Problem Description

When we work in traditional library system we have to face severel dificulties
as students and admin panal.Such as:
	1.When admin want to know about available books,students who borrowed books
	2.Student want details about available books, student's borrowed books
we have to reffer maulal records.They can be have many errors.
So the system prvide wrong details.

## Proposed Solution

There is need of centaralized system to provide accurate information
about the library.

---


## Features
 1. Available book information
 2. User login system
 3. Student's brrowed books information
 4. Role-based access (Admin & Student)
 5. Easy and fast access to Library Information
 6. Add,delete,edit books
	
	---
	
## Tech Stack

 + Frontend : NextJS with React
 + Backend : NodeJS with Express
 + Database : MongoDB
 + Veersion control : Git & GitHUB
 
 ---
 
## File Structure
```text

library-management-backend/
├── server.js
├── package.json
├── package-lock.json
├── config/
│   └── db.js
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── studentRoutes.js
├── controllers/        # (if you separate logic from routes)
│   ├── authController.js
│   ├── bookController.js
│   └── studentController.js
├── models/             # (for Mongoose schemas)
│   ├── User.js
│   ├── Book.js
│   └── Student.js
├── middleware/         # (auth, error handling, etc.)
│   └── authMiddleware.js
├── scripts/
│   └── seed.js
└── .env                # environment variables
 
```

## Getting Started

clone the repo
cd libary-management/backend
npm run dev

cd libary-management/frontend
npm run dev

## API Endpoints

## Base URL
> localhost:3000/api

---

### Book APIs

> /api/books


**Get All Books**
> GET /api/books


**Get Book By ID**
> GET /api/books/:id


**Create Book**
> POST /api/books

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Programming",
  "price": 2500,
  "stock": 15
}
```

---

**Update Book**
> PUT /api/books/:id

```json
{
  "title": "Clean Code Updated",
  "price": 3000,
  "stock": 10
}
```

**Delete Book**
> DELETE /api/books/:id


### Auth APIs

> /api/auth

**Admin login**
>POST /api/auth/admin/login

```json
{
  "email": "admin@mail.com",
  "password": "123456"
}
```

**Student Register**
>POST /api/auth/student/register

```json
{
  "name": "thami",
  "email": "thami@mail.com",
  "password": "123456",
  "role": "student"
}
```

**Student Login**
>POST /api/auth/student/login

```json
{
  "email": "thami@mail.com",
  "password": "123456"
}

```

##Student APIs
> /api/students

**Get My Borrowings (Student Only)**
> GET /api/students/borrowings/me

**Borrow a Book (Student Only)**
> POST /api/students/borrow/:bookId

**Return a Book (Student Only)**
> POST /api/students/return/:bookId

**Get Student By ID (Admin Only)**
> GET /api/students/:id

