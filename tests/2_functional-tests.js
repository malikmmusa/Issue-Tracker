const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', function() {
  var id;
  suite('POST', function(){
    // #1
    test("Create an issue with every field", function(done){
      chai
        .request(server)
        .post('/api/issues/{project}')
        .send({
          issue_title: 'title',
          issue_text:'text',
          created_by: 'author',
          assigned_to: 'person',
          status_text: 'status'
        })
        .end((err, res) => {
          if(err){
            console.log((err))
          }
          else {
            assert.equal(res.body.issue_title, 'title', 'issue_title is not null')
            assert.equal(res.body.issue_text, 'text', 'issue_text is not null')
            assert.equal(res.body.created_by, 'author',  'created_by is not null')
            assert.equal(res.body.assigned_to, 'person', 'assigned_to is not null')
            assert.equal(res.body.status_text, 'status', 'status_text is not null')
            id = res.body._id
          }
          done();
        })
    })
    // #2
    test("Create an issue with only required fields", function(done){
      chai
        .request(server)
        .post('/api/issues/{project}')
        .send({
          issue_title: 'title',
          issue_text:'text',
          created_by: 'author',
        })
        .end((err, res) => {
          if(err){
            console.log((err))
          }
          else {
            assert.equal(res.body.issue_title, 'title', 'issue_title is not null')
            assert.equal(res.body.issue_text, 'text', 'issue_text is not null')
            assert.equal(res.body.created_by, 'author',  'created_by is not null')
            assert.equal(res.body.assigned_to, '', 'assigned_to is empty string')
            assert.equal(res.body.status_text, '', 'status_text is empty string')
          }
          done();
        })
    })
    // #3
    test("Create an issue with missing required fields", function(done){
      chai
        .request(server)
        .post('/api/issues/{project}')
        .send({
          issue_title: 'title',
          issue_text:'text',
        })
        .end((err, res) => {
          if(err){
            console.log((err))
          }
          else {
            assert.equal(res.text, '{"error":"required field(s) missing"}',  'created_by is required but missing')
          }
          done();
        })
    })
  })
  
  suite('GET', function(){
      // #4
    test("View issues on a project", function(done){
      chai
        .request(server)
        .get('/api/issues/{project}')
        .end((err, res) => {
          res.body.forEach(issue => {
            assert.property(issue, '_id')
            assert.property(issue, 'issue_title')
            assert.property(issue, 'issue_text')
            assert.property(issue, 'created_on')
            assert.property(issue, 'updated_on')
            assert.property(issue, 'created_by')
            assert.property(issue, 'assigned_to')
            assert.property(issue, 'open')
            assert.property(issue, 'status_text')
          })
          done();
        })
    })
    // #5
    test("View issues on a project with one filter", function(done){
      chai
        .request(server)
        .get('/api/issues/{project}')
        .query({ open: true })
        .end((err, res) => {
          res.body.forEach(issue => {
            assert.property(issue, '_id')
            assert.property(issue, 'issue_title')
            assert.property(issue, 'issue_text')
            assert.property(issue, 'created_on')
            assert.property(issue, 'updated_on')
            assert.property(issue, 'created_by')
            assert.property(issue, 'assigned_to')
            assert.property(issue, 'open')
            assert.equal(issue.open, true)
            assert.property(issue, 'status_text')
          })
          done();
        })
    })
    // #6
    test("View issues on a project with multiple filters", function(done){
      chai
        .request(server)
        .get('/api/issues/{project}')
        .query({ 
          open: true,
          issue_title: 'q'
        })
        .end((err, res) => {
          res.body.forEach(issue => {
            assert.property(issue, '_id')
            assert.property(issue, 'issue_title')
            assert.equal(issue.issue_title, 'q')
            assert.property(issue, 'issue_text')
            assert.property(issue, 'created_on')
            assert.property(issue, 'updated_on')
            assert.property(issue, 'created_by')
            assert.property(issue, 'assigned_to')
            assert.property(issue, 'open')
            assert.equal(issue.open, true)
            assert.property(issue, 'status_text')
          })
          done();
        })
    })
  })

  suite('PUT', function(){
    // #7
    test("Update one field on an issue", function(done){
        chai
        .request(server)
        .put('/api/issues/{project}')
        .send({
          _id: id,
          issue_title: 'test'
        })
        .end((err, res) => {
          assert.equal(res.text, `{"result":"successfully updated","_id":"${id}"}`)
          done();
        })
    })
    // #8
    test("Update multiple fields on an issue", function(done){
      chai
        .request(server)
        .put('/api/issues/{project}')
        .send({
          _id: id,
          issue_title: 'test',
          issue_text: 'test'
        })
        .end((err, res) => {
          assert.equal(res.text, `{"result":"successfully updated","_id":"${id}"}`)
          
          done();
        })
    })
    // #9
    test("Update an issue with missing _id", function(done){
        chai
        .request(server)
        .put('/api/issues/{project}')
        .send({
          issue_title: 'test'
        })
        .end((err, res) => {
          assert.equal(res.text, '{"error":"missing _id"}')
          done();
        })
    })
    // #10
    test("Update an issue with no fields to update", function(done){
        chai
          .request(server)
          .put('/api/issues/{project}')
          .send({
            _id: id
          })
          .end((err, res) => {
            assert.equal(res.text, `{"error":"no update field(s) sent","_id":"${id}"}`)
            
            done();
          })
    })
    // #11
    test("Update an issue with an invalid _id", function(done){
        chai
        .request(server)
        .put('/api/issues/{project}')
        .send({
          _id: '123123456456',
          issue_title: 'test'
        })
        .end((err, res) => {
          assert.equal(res.text, `{"error":"could not update","_id":"123123456456"}`)
          
          done();
        })
    })
  })
  
  suite('DELETE', function(){
    // #12
    test("Delete an issue", function(done){
        chai
          .request(server)
          .delete('/api/issues/{project}')
          .send({
            _id: id,
          })
          .end((err, res) => {
            assert.equal(res.text, `{"result":"successfully deleted","_id":"${id}"}`)
            done();
          })
    })
    // #13
    test("Delete an issue with an invalid _id", function(done){
        chai
          .request(server)
          .delete('/api/issues/{project}')
          .send({
            _id: '123123456456',
          })
          .end((err, res) => {
            assert.equal(res.text, `{"error":"could not delete","_id":"123123456456"}`)
            done();
          })
    })
      // #14
    test("Delete an issue with missing _id", function(done){
        chai
        .request(server)
        .delete('/api/issues/{project}')
        .end((err, res) => {
          assert.equal(res.text, `{"error":"missing _id"}`)
          done();
        })
    })
  })
});
