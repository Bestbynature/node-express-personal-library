'use strict';

const BookModel = require('../model').Book;

const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      let books = await BookModel.find();

      return res.json(books);
    })
    .post(async function (req, res){
      let { title } = req.body;

      if (!title) return res.send('missing required field title')

      let book = new BookModel({title});

      try {
        book = await book.save();
        return res.json(book);
      } catch (err) {
        return res.status(500).send('error saving book');
      }
    })
    .delete(async function(req, res){
      await BookModel.deleteMany();
      return res.send('complete delete successful');

    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      const book = await BookModel.findById(bookid).exec();

      if (!book) {
        return res.send('no book exists');
      }
      console.log(book);

      return res.json(book);
    })
    
    .post(async function(req, res) {
      try {
        const { id } = req.params;
        const { comment } = req.body;
    
        if (!comment) {
          return res.send('missing required field comment');
        }
        let book = await BookModel.findById(id).exec();
    
        if (!book) {
          return res.send('no book exists');
        }
    
        book.comments.push(comment);
        book.commentcount = book.comments.length;
    
        book = await book.save();
    
        if (!book) {
          return res.send('error saving book');
        }
    
        return res.json(book);
      } catch (error) {
        console.error(error);
        return res.status(500).send('internal server error');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        const book = await BookModel.findByIdAndDelete(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        return res.send('delete successful');
      } catch (error) {
        console.error(error);
        return res.status(500).send('internal server error');
      }
    });
  
};
