'use strict';

// server
const express = require('express');
const app = express();
const path = require('path');

const tmpDir = __dirname + '/tmp/';
const publicDir = __dirname + '/public/';
const imagesDir = __dirname + '/images/';
const defaultBgImage = 'bg-image.jpg';

// canvas generator
const CountdownGenerator = require('./countdown-generator');

app.use(express.static(publicDir));
app.use(express.static(tmpDir));

// root
app.get('/', function (req, res) {
    res.sendFile(publicDir + 'index.html');
});

// generate and download the gif
app.get('/generate', function (req, res) {
    let {time, width, height, color, bg, name, withImageBg, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    const imageBgSrc = `${imagesDir}${defaultBgImage}`;


    CountdownGenerator.init(time, width, height, color, bg, name, (withImageBg ? imageBgSrc : null),  frames, () => {
        let filePath = tmpDir + name + '.gif';
        res.sendFile(filePath);
    });
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    let {time, width, height, color, bg, name, withImageBg, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    const imageBgSrc = `${imagesDir}${defaultBgImage}`;


    CountdownGenerator.init(time, width, height, color, bg, name, (withImageBg ? imageBgSrc : null),  frames, () => {
        let filePath = tmpDir + name + '.gif';
        res.sendFile(filePath);
    });
});

app.listen(process.env.PORT || 3500, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
