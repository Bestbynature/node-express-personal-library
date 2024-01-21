'use strict';

const BookModel = require('../model').Book;

const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
     try {
      let books = await BookModel.find();

      return res.status(200).json(books);
     } catch (error) {
        console.error(error);
        return res.status(500).send('internal server error');
     }
    })
    .post(async function (req, res){
      let { title } = req.body;

      if (!title) return res.send('missing required field title')

      let book = new BookModel({title, comments: [], commentcount: 0});

      try {
        book = await book.save();
        return res.status(200).json(book);
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

      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send('no book exists');
      }

      const book = await BookModel.findById(bookid).exec();

      if (!book) {
        return res.send('no book exists');
      }
      console.log(book);

      return res.json(book);
    })
    .post(async function(req, res) {
      const { id } = req.params;
      const { comment } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('no book exists');
      }

      if (!comment) {
        return res.status(400).send('missing required field comment');
      }

      console.log(req.body)

      try {

        let book = await BookModel.findById(id).exec();
    
        // if (!book) {
        //   return res.status(400).send('no book exists');
        // }
    
        book.comments.push(comment);
        // book.commentcount = book.comments.length;
    
        book = await book.save();
    
        return res.status(200).json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.commentcount
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send('no book exists');
      }
    })
    .delete(async function(req, res){
      let bookid = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send('no book exists');
      }

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
