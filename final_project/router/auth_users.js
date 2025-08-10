const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = 'fingerprint_customer'

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Validate password
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT payload
    const payload = { username: user.username };

    // Sign JWT token with expiration (e.g., 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Save token in session or send it in response
    // req.session.authorization = { token };
    req.session.authorization = {
        username: user.username,
        accessToken: token  // match what middleware checks
    };

    return res.status(200).json({ message: "User logged in successfully", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;  // get username from session

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if not present
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the review for the username
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Review by user not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
