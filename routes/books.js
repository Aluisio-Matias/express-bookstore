const express = require("express");
const Book = require("../models/book");
const ExpressError = require("../expressError");
const {
  validate
} = require("jsonschema");
const newBookSchema = require("../schemas/newBookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async (req, res, next) => {
  try {
    const books = await Book.findAll(req.query);
    return res.json({
      books
    });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({
      book
    });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async (req, res, next) => {
  try {
    const validator = validate(req.body, newBookSchema);

    if (!validator.valid) {
      let listOfErrors = validator.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({
      book
    });

  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async (req, res, next) => {
  try {
    if ("isbn" in req.body) {
      return next({
        status: 400,
        message: "Not allowed to change the isbn number"
      });
    }

    const validator = validate(reb.body, updateBookSchema);

    if (!validator.valid) {
      let listOfErrors = validator.errors.map(err => err.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error)
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({
      book
    });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async (req, res, next) => {
  try {
    await Book.remove(req.params.isbn);
    return res.json({
      message: "Book deleted"
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;