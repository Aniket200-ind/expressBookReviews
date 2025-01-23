const axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let newUser = req.body;
  if (!newUser.username || !newUser.password) {
    return res
      .status(400)
      .json({ message: "Please enter your username and password" });
  } else if (!isValid(newUser.username)) {
    users.push(newUser);
    return res
      .status(200)
      .json({ message: "Customer registered successfully. Now you can login" });
  } else {
    return res.status(400).json({ message: "Customer already exists" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ books });
});

// Get the book list using async-await
const getBooksList = async () => {
  try {
    let response = await axios.get("http://localhost:5000/");
    return response.data;
  } catch (error) {
    console.log("Error fetching books");
    throw error;
  }
};

public_users.get("/async", async (req, res) => {
  try {
    let books = await getBooksList();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbnCode = req.params.isbn;
  if (books[isbnCode]) {
    return res.status(200).json(books[isbnCode]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//Get book details based on ISBN using async-await
const getBookDetails = async (isbn) => {
  try {
    let response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching book details");
    throw error;
  }
};

public_users.get("/async/:isbn", async (req, res) => {
  let isbn = req.params.isbn;
  try {
    let book = await getBookDetails(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  let authorBooks = [];
  for (let book in books) {
    if (books[book].author === author) {
      authorBooks.push(books[book]);
    }
  }
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get book details based on author using async-await
const getBooksByAuthor = async (author) => {
  try {
    let response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching books by author");
    throw error;
  }
};

public_users.get("/async/author/:author", async (req, res) => {
  let author = req.params.author;
  try {
    let books = await getBooksByAuthor(author);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let bookTitle = req.params.title;
  let titleBooks = [];
  for (let book in books) {
    if (books[book].title === bookTitle) {
      titleBooks.push(books[book]);
    }
  }
  if (titleBooks.length > 0) {
    return res.status(200).json(titleBooks);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

// Get all books based on title using async-await
const getBooksByTitle = async (title) => {
  try {
    let response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching books by title");
    throw error;
  }
};

public_users.get("/async/title/:title", async (req, res) => {
  let title = req.params.title;
  try {
    let books = await getBooksByTitle(title);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbnCode = req.params.isbn;
  if (books[isbnCode]) {
    return res.status(200).json(books[isbnCode].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
