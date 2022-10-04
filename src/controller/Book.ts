import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Book from "../models/Book";

const createBook = (req: Request, res: Response, next: NextFunction) => {
  const { title, author } = req.body;

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title,
    author,
  });

  return book
    .save()
    .then((book) => res.status(200).json({ book }))
    .catch((error) => res.status(500).json({ error }));
};

const getBook = (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  return Book.findById(bookId)
    .populate("author")
    .then((book) =>
      book
        ? res.status(200).json({ book })
        : res.status(404).json({ message: "Not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const getAllBook = (req: Request, res: Response, next: NextFunction) => {
  return Book.find()
    .populate("author")
    .then((books) =>
      books
        ? res.status(200).json({ books })
        : res.status(404).json({ message: "Not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const updatedBook = (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  return Book.findById(bookId)
    .then((book) => {
      if (book) {
        book.set(req.body);

        return book
          .save()
          .then((book) => res.status(201).json({ book }))
          .catch((err) => res.status(500).json({ err }));
      } else {
        res.status(404).json({ message: "Not Found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteBook = (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  return Book.findByIdAndDelete(bookId)
    .then((book) =>
      book
        ? res.status(201).json({ message: "Book Deleted" })
        : res.status(404).json({ message: "Book not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default { createBook, getBook, getAllBook, updatedBook, deleteBook };
