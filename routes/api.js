'use strict';

const ObjectId = require('mongodb').ObjectID

module.exports = function (app) {

  var mongoose = require('mongoose')
  mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,  
    useUnifiedTopology: true 
  });
  const { nanoid } = require('nanoid')
  
  const { Schema } = mongoose
  
  const issueSchema = new Schema({
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },
    open: { type: Boolean, default: true },
    _id: String,
    issue_title: { type: String, require: true },
    issue_text: { type: String, require: true },
    created_by: { type: String, require: true },
    created_on: String,
    updated_on: String
  }, {
    versionKey: false
})
  
  // let Issue = mongoose.model("Issue", issueSchema)
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      if (req.query != {}){
        Issue.find(req.query, (err, issues) => {
          if(err){
            console.log(err)
          }
          else{
            return res.send(issues)
          }
        })
      }
      else {
        Issue.find( (err, issues) => {
          if(err){
            console.log(err)
          }
          else{
            return res.send(issues)
          }
        })
      }
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        return res.json({ error: 'required field(s) missing' })
      }
      
      // const id = mongoose.Types.ObjectId()
      const id = nanoid()
      const date = new Date().toISOString();
  
      const newIssue = new Issue({assigned_to: req.body.assigned_to,
                                  status_text: req.body.status_text,
                                  open: true,
                                  _id: id,
                                  issue_title: req.body.issue_title,
                                  issue_text: req.body.issue_text,
                                  created_by: req.body.created_by,
                                  created_on: date,
                                  updated_on: date
                                 })
      newIssue.save((err, issue) => {
        if(err){
          console.log(err)
        }
        else{
          return res.json(issue)
        }
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)

      if(!req.body._id){
        return res.json({ error: 'missing _id' })
      }
      
      const id = req.body._id
      
      let updated = {}
      for (let item in req.body){
        if (req.body[item] && item != '_id'){
          updated[item] = req.body[item]
        }
      }
      updated.updated_on = new Date().toISOString()
      
      if (Object.keys(updated).length == 1){
        return res.json({ error: 'no update field(s) sent', '_id': id })
      }
      
      Issue.findByIdAndUpdate(id, {$set: updated}, {new: true}, (err, issue) => {
        if (!issue){
          console.log(err)
          return res.json({ error: 'could not update', '_id': id })
        }
        else {
          return res.json({  result: 'successfully updated', '_id': id })
        }
      })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let Issue = mongoose.model(project, issueSchema)
      
      if(!req.body._id){
        return res.json({ error: 'missing _id' })
      }
      const id = req.body._id

      Issue.findByIdAndDelete(id, (err, issue) => {
        if (!issue) {
          console.log(err)
          return res.json({ error: 'could not delete', '_id': id })
        }
        else {
          return res.json({  result: 'successfully deleted', '_id': id })
        }
      })
    });
    
};
