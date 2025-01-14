const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbnCode = req.params.isbn;
  if(books[isbnCode]){
    return res.status(200).json(books[isbnCode]);
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let authorBooks = [];
  for(let book in books){
    if(books[book].author === author){
      authorBooks.push(books[book]);
    }
  }
  if(authorBooks.length > 0){
    return res.status(200).json(authorBooks);
  }
  else{
    return res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let bookTitle = req.params.title;
  let titleBooks = [];
  for(let book in books){
    if(books[book].title === bookTitle){
      titleBooks.push(books[book]);
    }
  }
  if(titleBooks.length > 0){
    return res.status(200).json(titleBooks);
  }
  else{
    return res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbnCode = req.params.isbn;
  if(books[isbnCode]){
    return res.status(200).json(books[isbnCode].reviews);
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
