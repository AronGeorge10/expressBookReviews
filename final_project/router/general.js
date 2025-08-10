const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from URL params
    const book = books[isbn];      // Access the book details from the books object

    if (book) {
        res.json(book);            // Send book details as JSON if found
    } else {
        res.status(404).json({message: "Book not found"});  // Send 404 if not found
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;  // Get author from URL params
    const booksByAuthor = [];

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);  // Send list of books by the author
    } else {
        res.status(404).json({message: "No books found for the author"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;  // Get title from URL params
    const booksByTitle = [];

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);  // Send list of books matching the title
    } else {
        res.status(404).json({message: "No books found with the given title"});
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from URL params
    const book = books[isbn];      // Access book details by ISBN

    if (book && book.reviews) {
        res.json(book.reviews);    // Send the reviews as JSON
    } else {
        res.status(404).json({message: "Reviews not found for this ISBN"});
    }
});

module.exports.general = public_users;
