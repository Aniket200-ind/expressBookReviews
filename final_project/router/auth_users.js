const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const { message } = require("prompt");
const regd_users = express.Router();
const { v4: uuidv4 } = require('uuid');

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  for (let user in users) {
    if (users[user].username === username) {
      return true;
    }
  }
  return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  for (let user in users) {
    if (
      users[user].username === username &&
      users[user].password === password
    ) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let newUser = req.body;

  if (!newUser.username || !newUser.password) {
    return res
      .status(400)
      .json({ message: "Please enter your username and password" });
  } else if (isValid(newUser.username)) {
    if (authenticatedUser(newUser.username, newUser.password)) {
      let token = jwt.sign(
        { username: newUser.username },
        "fingerprint_customer"
      );
      return res
        .status(200)
        .json({ message: "Customer succesfully logged in!", token: token });
    } else {
      return res.status(400).json({ message: "Invalid username or password" });
    }
  } else {
    return res.status(400).json({ message: "Customer not registered" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbnCode = req.params.isbn;
  let reviewContent = req.body.review;
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  } else {
    jwt.verify(token, "fingerprint_customer", function (err, decoded) {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ message: "Invalid token" });
      } else {
        if (books[isbnCode]) {
          try {
            const review = { id: uuidv4(), content: reviewContent };
            books[isbnCode].reviews.push(review);
            return res.status(200).json({
              message: `Review for the book with ISBN ${isbnCode} has been added / updated. Here is your review: ${review.id}`,
            });
          } catch (error) {
            console.error("Error adding review:", error);
            return res.status(500).json({ message: "Internal server error" });
          }
        } else {
          return res.status(404).json({ message: "Book not found" });
        }
      }
    });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
