'use strict';

// server
const express = require('express');
const app = express();
const path = require('path');

// canvas generator
const CanvasGenerator = require('./canvas-generator');

app.use(express.static('public'));

// root
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/www/index.html'));
});

// generate and download the gif
app.get('/generate', function (req, res) {
    let {time, width, height, color, bg, name} = req.query;

    if(!time){
        throw Error('Time parameter is required.')
    }
    
    CanvasGenerator.init(time, width, height, color, bg, name, () => {
        let file = __dirname + '/public/generated/' + name + '.gif';
        res.download(file);
    });
});

// serve the gif to a browser
app.get('/serve', function (req, res) {
    let {time, width, height, color, bg, name} = req.query;

    if(!time){
        throw Error('Time parameter is required.')
    }

    CanvasGenerator.init(time, width, height, color, bg, name, () => {
        let file = __dirname + '/public/generated/' + name + '.gif';
        res.sendFile(file);
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
