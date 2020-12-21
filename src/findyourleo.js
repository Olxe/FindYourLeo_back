var express = require('express');
var app = express();
var path = require('path');

app.get('/file/:name', function (req, res) {
  var file = path.join( __dirname, '../data/' + req.params.name)

  res.sendFile(file, function(err) {
    if(err) {
      console.log(new Date().toString());
      console.log(err);
      res.status(404).send('Sorry! You can\'t see that.');
    }
    else {
      console.log(new Date().toString());
      console.log(file);
    }
  });
});

app.get('/data/:name', function(req, res) {
  let levels = [];
  levels.push({
    id: 1,
    amount: 10,
    path: '1.jpg',
  });
  levels.push({
    id: 2,
    amount: 50,
    path: '2.jpg',
  });
  res.send({levels: levels});
});

app.listen(4000, function (err) {
  if (err) console.log(err);
  console.log('Listening to 4000');
});