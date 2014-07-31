var express = require('express');
var router = express.Router();
var Client = require('telapi').client;
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS);
var bodyParser = require('body-parser');
var numbers = [];
var emails = [];
var telapi = new Client(process.env.TELAPI_SID, process.env.TELAPI_TOKEN);

router.post('/', function(req, res) {
  if(req.body.user.name == null | req.body.user.phone == null || req.body.user.email == null) {
    return res.send(400, "You need to put in your user information in the settings page.");
  }
  for(var i = 0; i < req.body.selected.length; i++) {
    if(req.body.selected[i].phone != undefined) {
      numbers.push(req.body.selected[i].phone);
    }
    if(req.body.selected[i].email != undefined) {
      emails.push(req.body.selected[i].email);
    }
  }
  console.log(numbers);
  for(var i = 0; i < numbers.length; i++) {
    telapi.create("sms_messages", {
        "From": process.env.TELAPI_NUMBER,
        "To": numbers[i],
        "Body": req.body.user.name + ' is suicidal and needs help. Contact them and take them to a hospital to get a suicide assessment. If you can\'t reach them, call 911.'
      }, function (response) {
        res.send("Messages sent successfully");
      },
      function (error) {
        return res.send(400, "An error occurred while sending messages");
      }
    );
  }

  console.log(emails);
  sendgrid.send({
    to      : emails,
    from    : process.env.SENDGRID_USER,
    fromname: "Defcon One",
    subject : 'Emergency! ' + req.body.user.name + ' needs your help immediately',
    text    : 'I am having suicidal thoughts right now and I need your help. Please call or text me immediately at ' + req.body.user.phone + ' and take me to a local hospital to get a suicide assessment. If you are unable to reach me, call 911. I am not safe and cannot guarantee you that right now I will not hurt myself. This is urgent and you must take immediate action.\n\n' + req.body.user.name + '\n(via the Defcon One app)'
  }, function(err, json) {
    if (err) { return res.send(400, "An error occurred while sending messages"); }
    res.send("Messages sent successfully");
  });
});

module.exports = router;
