"use strict";

const express = require("express");
var sqlite3 = require("sqlite3").verbose();
let fetch = require("node-fetch");
const cors = require("cors");
var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var db = new sqlite3.Database(
  "./config/data.db",
  sqlite3.OPEN_READWRITE,
  err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
  }
);

app.post("/trm", (req, res) => {
  var source = req.body.source;
  var target = req.body.target;

  fetch(
    "https://transferwise.com/gb/currency-converter/api/historic?source=" +
      source +
      "&target=" +
      target +
      "&period=30"
  )
    .then(data => data.json())
    .then(data => {
      const response = data;

      if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          db.run(
            `INSERT INTO trm(source, target, rate, time) VALUES(?,?,?,?)`,
            [
              response[i].source,
              response[i].target,
              response[i].rate,
              response[i].time
            ],
            function(err) {
              if (err) {
                console.log("error", err.message);
              }
            }
          );
        }
      } else {
        res.status(404).send({
          message: "source and target not found"
        });
      }

      res.status(200).send({ message: "data inserted" });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/trm", function(req, res) {
  db.all(`SELECT * FROM trm`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.status(200).send(rows);
  });
});

app.listen(3000, function() {
  console.info("Server running");
});

/*
trm table:
 - id INTEGER PRIMARY KEY AUTOINCREMENT,
 - source VARCHAR(10) NOT NULL,
 - target VARCHAR(10) NOT NULL,
 - rate NUMERIC(10,5) NOT NULL,
 - time DATE
*/
