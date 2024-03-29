/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test("#example Test GET /api/books", function(done){
  //   this.timeout(5000);
  //    chai.request(server)
  //     .get("/api/books")
  //     .end(function(err, res){
  //       console.log(res.body); 
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
  //       assert.property(res.body[0], "title", "Books in array should contain title");
  //       assert.property(res.body[0], "_id", "Books in array should contain _id");
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite("Routing tests", function() {

    let id1 = "";

    suite("POST /api/books with title => create book object/expect book object", function() {
      
      test("Test POST /api/books with title", function(done) {
        this.timeout(5000);
        chai.request(server)
        .post("/api/books")
        .send({title: "test"})
        .end(function(err, res) {
          id1 = res.body._id; 
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "test");
          assert.property(res.body, "_id");
          done();
        });
      });
      
      test("Test POST /api/books with no title given", function(done) {
        chai.request(server)
        .post("/api/books")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title");
          done();
        });
      });
      
    });


    suite("GET /api/books => array of books", function(){
      
      test("Test GET /api/books",  function(done){
        this.timeout(5000);
        chai.request(server)
        .get("/api/books")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          // assert.property(res.body[0], "title");
          // assert.property(res.body[0], "_id");
          assert.property(res.body[0], "commentcount");
          done();
        });
      });      
      
    });


    suite("GET /api/books/[id] => book object with [id]", function(){
      
      test("Test GET /api/books/[id] with id not in db",  function(done){
        this.timeout(5000);
        chai.request(server)
        .get(`/api/books/12345`)
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          assert.equal(res.status, 400);
          assert.equal(res.text, "no book exists");
          done();
        });
        
      });
      
      test("Test GET /api/books/[id] with valid id in db",  function(done){

        this.timeout(5000);
        chai.request(server)
        .get(`/api/books/${id1}`)
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          assert.equal(res.status, 200);
          assert.equal(res.body._id, id1);
          assert.equal(res.body.title, "test");
          assert.isArray(res.body.comments);
          assert.equal(res.body.commentcount, 0);
          done();
        });
        
      });
      
    });


    suite("POST /api/books/[id] => add comment/expect book object with id", function(){
      
      test("Test POST /api/books/[id] with comment", function(done){
        this.timeout(5000);
        chai.request(server)
        .post(`/api/books/${id1}`)
        .send({comment: "test comment"})
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          // assert.equal(res.status, 200);
          assert.equal(res.body._id, id1);
          assert.equal(res.body.title, "test");
          assert.isArray(res.body.comments);
          done();
        });
      });

      test("Test POST /api/books/[id] without comment field", function(done){
        this.timeout(5000);
        chai.request(server)
        .post(`/api/books/${id1}`)
        .send({})
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          // assert.equal(res.status, 400);
          assert.equal(res.body, "missing required field comment");
          done();
        });
      });

      test("Test POST /api/books/[id] with comment, id not in db", function(done){
        this.timeout(5000);
        chai.request(server)
        .post(`/api/books/12345`)
        .send({comment: "test comment"})
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          // assert.equal(res.status, 400);
          assert.equal(res.body, "no book exists");
          done();
        });
      });
      
    });

    suite("DELETE /api/books/[id] => delete book object id", function() {

      test("Test DELETE /api/books/[id] with valid id in db", function(done){
        this.timeout(5000);
        chai.request(server)
        .delete(`/api/books/${id1}`)
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          assert.equal(res.status, 200);
          assert.equal(res.text, "delete successful");
          done();
        });

      });

      test("Test DELETE /api/books/[id] with  id not in db", function(done){
        this.timeout(5000);
        chai.request(server)
        .delete(`/api/books/12345`)
        .end(function(err, res) {
          console.log("res dot status is =>", res.status)
          assert.equal(res.status, 400);
          assert.equal(res.text, "no book exists");
          done();
        });
      });

    });

  });

});
