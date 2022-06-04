const express = require("express");
const hbs = require("hbs");
const fs = require('fs');

const request = require('request');
const apiKey = '899758bd068d693f89c18d6694531cfb';

let app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.get("/", (req, res) => {
    res.render("home.hbs");
});

app.get("/weather", (req, res) => {

    const data = fs.readFileSync('Weather.json', 'utf8');
    const weathers = JSON.parse(data);
    res.render("weather.hbs", { weathers });
});

app.get("/weather/:city", (req, res) => {

    const city = req.params.city;

    const data = fs.readFileSync('Weather.json', 'utf8');
    const weathers = JSON.parse(data);

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, function (err, response, body) {

        if (err) {
            res.render('weather', { weather: null, error: 'Error, try again' });
        } else {
            let weather = JSON.parse(body)

            if (weather.main == undefined) {
                res.render('weather', { weather: null, error: 'Error, try again' });
            } else {

                console.log(weather);

                res.render('weather', { weather, weathers, error: null });
            }
        }

    });
});

app.listen(process.env.PORT || 5000, () => {

    console.log("Listen port 3000");

})

