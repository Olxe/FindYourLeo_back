const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const path = require('path');
const randomize = require('randomatic');
const fs = require('fs');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true
}));

app.use(bodyParser.json({
  limit: '50mb'
}));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password: "rootmdp20",
  password: "",
  database: "find_your_leo"
});

con.connect(function (err) {
  try {
    if (err) throw err;
    console.log("Connected to MySQL database !");

    app.get('/file/:name', function (req, res) {
      var file = path.join(__dirname, '../data/' + req.params.name)

      res.sendFile(file, function (err) {
        if (err) {
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

    app.get('/data/:name', function (req, res) {
      console.log(new Date().toString());
      console.log('data: ' + req.params.name);

      let levels = [];
      if (req.params.name == 'AAAA') {
        levels.push({
          id: 1,
          amount: 100,
          path: '1.jpg',
        });
        levels.push({
          id: 2,
          amount: 50,
          path: '2.jpg',
        });
      }
      res.send({ levels: levels });
    });

    app.post('/rooms', async (req, res) => {
      let code = randomize('A', 5);
      const levels = req.body.levels;

      try {
        let query = "INSERT INTO room (code) VALUES ('" + code + "')";
        var id;
        con.query(query, function (err, result) {
          if (err) throw err;
          else {
            id = result.insertId;
            console.log('Room created with the code: ' + code);
            levels.forEach(lvl => {
              query = "INSERT INTO level (idRoom, nbLevel, amount) VALUES ('" + id + "', '" + lvl.id + "', '" + lvl.amount + "')";
              con.query(query, function (err) {
                if (err) throw err;
                else {
                  console.log('Level created in room: ' + code);
                  uploadImage(code, lvl.id, lvl.base64Image);
                }
              });
            });
          }
        });

        return res.send(code);
      }
      catch (err) {
        console.log(err);
      }

      return res.sendStatus(500);
    });
  }
  catch (err) {
    console.log(err);
  }
});


app.listen(port, function (err) {
  if (err) throw err;
  console.log('Started server at http://localhost:' + port);
});

async function uploadImage(code, lvl, imgData) {
  fs.mkdir('./data/' + code, { recursive: true }, (err) => {
    if (err) console.log(err);
    else {
      const path = './data/' + code + '/' + lvl + '.jpg';
      const base64Data = imgData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      fs.writeFileSync(path, base64Data, { encoding: 'base64' });
    }
  });
}