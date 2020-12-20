var express = require('express');
var app = express();
var path = require('path');

app.get('/file/:name', function (req, res) {
  var file = req.params.name

  // res.sendFile('/data/' + file);
  res.sendFile(path.join( __dirname, '../data/' + file));
})

app.listen(4000, function (err) {
  if (err) console.log(err);
  console.log('Listening to 4000');
});