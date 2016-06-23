'use strict';

// server
const express = require('express');
const app = express();
const path = require('path');

let tempDir = __dirname + '/tmp/';

// canvas generator
const CanvasGenerator = require('./canvas-generator');

app.use(express.static(tempDir));

// root
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/www/index.html'));
});

// generate and download the gif
app.get('/generate', function (req, res) {
    let {time, width, height, color, bg, name, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    CanvasGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tempDir + name + '.gif';
        res.download(filePath);
    });
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    let {time, width, height, color, bg, name, frames} = req.query;

    if(!time){
        throw Error('Time parameter is required.');
    }

    CanvasGenerator.init(time, width, height, color, bg, name, frames, () => {
        let filePath = tempDir + name + '.gif';
        res.sendFile(filePath);
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
