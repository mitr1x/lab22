"use strict";

var express = require("express");

var hbs = require("hbs");

var fs = require('fs');

var request = require('request');

var apiKey = '899758bd068d693f89c18d6694531cfb';
var app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.get("/", function (req, res) {
  res.render("home.hbs");
});
app.get("/weather", function (req, res) {
  var data = fs.readFileSync('Weather.json', 'utf8');
  var weathers = JSON.parse(data);
  res.render("weather.hbs", {
    weathers: weathers
  });
});
app.get("/weather/:city", function (req, res) {
  var city = req.params.city;
  var data = fs.readFileSync('Weather.json', 'utf8');
  var weathers = JSON.parse(data);
  var url = "http://api.openweathermap.org/data/2.5/weather?q=".concat(city, "&units=imperial&appid=").concat(apiKey);
  request(url, function (err, response, body) {
    if (err) {
      res.render('weather', {
        weather: null,
        error: 'Error, try again'
      });
    } else {
      var weather = JSON.parse(body);

      if (weather.main == undefined) {
        res.render('weather', {
          weather: null,
          error: 'Error, try again'
        });
      } else {
        console.log(weather);
        res.render('weather', {
          weather: weather,
          weathers: weathers,
          error: null
        });
      }
    }
  });
});
app.listen(process.env.PORT || 5000, function () {
  console.log("Listen port 3000");
});