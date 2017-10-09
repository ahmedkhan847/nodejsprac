var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + "/" + "contact.htm");
})

app.post('/contactreq',urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      email:req.body.email,
      pwd:req.body.pwd
   };
   console.log(response);
   res.sendFile(__dirname + "/" + "contact.htm");
})
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})