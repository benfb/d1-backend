var express = require('express');
var router = express.Router();
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS);
var bodyParser = require('body-parser')
var emails = [];

router.post('/', function(req, res) {
  if(req.body.user.name == null | req.body.user.phone == null || req.body.user.email == null) {
    return res.send(400, "You need to put in your user information in the settings page.");
  }
  for(var i = 0; i < req.body.selected.length; i++) {
    if(req.body.selected[i].email != undefined) {
      emails.push(req.body.selected[i].email);
    }
  }
  if(emails.length === 0) { return res.send(400, "None of the contacts you selected have a phone number.");}
  sendgrid.send({
    to      : emails,
    from    : process.env.SENDGRID_USER,
    subject : req.body.user.name + ' needs your help',
    text    : req.body.user.name + ' is having a hard time and needs your help. Message them at ' + req.body.user.phone + ' or ' + req.body.user.email + ' now to let them know you\'re there for them. \n\n-' +req.body.user.name + ' via Defcon One (http://defconone.us)'
  }, function(err, json) {
    if (err) { res.send(400, "An error occurred while sending messages"); }
    res.send("Messages sent successfully");
    emails = [];
  });
});

module.exports = router;
