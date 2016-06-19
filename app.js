"use strict";

// Server
const moment = require('moment');
const express = require('express');
const app = express();
const path = require('path');

// Canvas Generator
const CanvasGenerator = require('./canvas-generator');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/www/index.html'));
});

app.get('/generate', function (req, res) {
    let time = req.query.time;
    let width = req.query.width;
    let height = req.query.height;
    let color = req.query.color;
    let bg = req.query.bg;
    let name = req.query.name || "default";

    CanvasGenerator.init(time, width, height, color, bg, name, download);
    
    function download(){
        let file = __dirname + '/public/generated/' + name + '.gif';
        res.download(file);
    }
});

app.get('/serve', function (req, res) {
    let time = req.query.time;
    let width = req.query.width;
    let height = req.query.height;
    let color = req.query.color;
    let bg = req.query.bg;
    let name = req.query.name || "default";

    CanvasGenerator.init(time, width, height, color, bg, name, serve);

    function serve(){
        let file = __dirname + '/public/generated/' + name + '.gif';
        res.sendFile(file);
    }
});

app.listen(process.env.PORT || 3000);

module.exports = app;