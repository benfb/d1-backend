var express = require('express');
var router = express.Router();
var Client = require('telapi').client;
var bodyParser = require('body-parser')
var numbers = [];

var telapi = new Client(process.env.TELAPI_SID, process.env.TELAPI_TOKEN);

router.post('/', function(req, res) {
  console.log(req.body);
  for(var i = 0; i < req.body.selected.length; i++) {
    telapi.create("sms_messages", {
      "From": process.env.TELAPI_NUMBER,
      "To": req.body.selected[i].phone,
      "Body": req.body.user.name + " is having a hard time and needs your help. Message them to let them know you are there for them."
    }, function (response) {
        res.send("Messages sent successfully");
      },
      function (error) {
        res.send(400, "An error occurred while sending messages");
      }
    );
  }
});

module.exports = router;
