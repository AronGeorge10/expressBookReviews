const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (pretty printed)
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN (pretty printed)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from URL params
    const book = books[isbn];      // Access the book details from the books object

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author (case-insensitive)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();  
    const booksByAuthor = [];

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
            booksByAuthor.push(books[isbn]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.status(404).json({ message: "No books found for the author" });
    }
});

// Get all books based on title (case-insensitive)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();  
    const booksByTitle = [];

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
        res.status(404).json({ message: "No books found with the given title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from URL params
    const book = books[isbn];      // Access book details by ISBN

    if (book) {
        res.send(JSON.stringify(book.reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
