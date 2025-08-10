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

// Get book details based on author
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

// Get all books based on title
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

const axios = require('axios');
// Function to get the list of books using Promises
function getBooksPromise() {
    axios.get('https://arongeorgeja-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
        .then(response => {
            console.log("Books (Promise):", response.data);
        })
        .catch(error => {
            console.error("Error fetching books (Promise):", error.message);
        });
}
getBooksPromise();

const BASE_URL = 'https://arongeorgeja-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'; // or your lab-provided proxy URL
// Function to get book details by ISBN using Promises
function getBookByISBNPromise(isbn) {
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => {
            console.log(`Book details for ISBN ${isbn} (Promise):`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book details for ISBN ${isbn} (Promise):`, error.message);
        });
}

getBookByISBNPromise('1');

function getBookByAuthorPromise(author) {
    axios.get(`${BASE_URL}/author/${author}`)
        .then(response => {
            console.log(`Book details for author ${author} (Promise):`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book details for author ${author} (Promise):`, error.message);
        });
}
getBookByAuthorPromise('Jane Austen');

function getBookByTitlePromise(title) {
    axios.get(`${BASE_URL}/title/${title}`)
        .then(response => {
            console.log(`Book details for title ${title} (Promise):`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book details for title ${title} (Promise):`, error.message);
        });
}
getBookByTitlePromise('Fairy tales');

module.exports.getBooksPromise = getBooksPromise;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBookByAuthorPromise = getBookByAuthorPromise;
module.exports.getBookByTitlePromise = getBookByTitlePromise;
module.exports.general = public_users;
