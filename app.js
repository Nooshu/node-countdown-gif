'use strict';

// server
const express = require('express');
const app = express();
const path = require('path');

const tmpDir = __dirname + '/tmp/';
const publicDir = __dirname + '/public/';

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
    let {time, width, height, color, bg, name, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    CountdownGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tmpDir + name + '.gif';
        res.download(filePath);
    });
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    let {time, width, height, color, bg, name, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    CountdownGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tmpDir + name + '.gif';
        res.sendFile(filePath);
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
