"use strict";

const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');
const fs = require('fs');
const moment = require('moment');

var generator = {
    init: function(time, width, height, color, bg, name, cb){
        this.width = Number(width) || 200;
        this.height = Number(height) || 200;
        this.bg = bg || "000000";
        this.name = name;
        this.textColor = color || 'ffffff';
        
        this.encoder = new GIFEncoder(this.width, this.height);
        this.canvas = new Canvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');
        
        let timeResult = this.time(time);
        
        this.encode(timeResult, cb);
    },
    time: function (timeString) {
        // grab the current and target time
        let target = moment(timeString);
        let current = moment();
        // difference between the 2 (ms)
        let difference = target.diff(current);
        
        if(difference <= 0){
            return "Event date has passed!";
        } else {
            // duration of the difference
            let duration = moment.duration(difference);
            
            return duration;
        }
    },
    encode: function(timeResult, cb){
        let enc = this.encoder;
        let ctx = this.ctx;
        
        // estimate the font size based on the provided width
        let fontSize = Math.floor( this.width / 10 ) + "px";
        let fontFamily = "Helvetica";
        
        // set the font style
        ctx.font = [fontSize, fontFamily].join(" ");
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Start Encoding Gif
        enc.start();
        enc.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        enc.setDelay(1000);  // frame delay in ms
        enc.setQuality(10); // image quality. 10 is default.

        // if we have a duration object
        if(typeof timeResult === "object"){
            for(let i = 0; i < 2; i++){
                // Extract the information we need form the duration
                let days = timeResult.days().toString();
                let hours = timeResult.hours().toString();
                let minutes = timeResult.minutes().toString();
                let seconds = timeResult.seconds().toString();
                
                // Make sure we have 2 characters in the string
                days = (days.length == 1) ? "0" + days : days;
                hours = (hours.length == 1) ? "0" + hours : hours;
                minutes = (minutes.length == 1) ? "0" + minutes : minutes;
                seconds = (seconds.length == 1) ? "0" + seconds : seconds;
                
                // Build the date string
                let string = [days, hours, minutes, seconds].join(':');
                
                // paint BG
                ctx.fillStyle = '#' + this.bg;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // paint text
                ctx.fillStyle = '#' + this.textColor;
                ctx.fillText(string, (this.width / 2), (this.height / 2));
                enc.addFrame(ctx);
                
                // remove a second for the next loop
                timeResult.subtract(1, 'seconds');
            }
        } else {
            let string = timeResult.toUpperCase();
            
            // Date has passed so only using a string
            ctx.fillStyle = '#' + this.bg;
            ctx.fillRect(0, 0, this.width, this.height);
            
            ctx.fillStyle = '#' + this.textColor;
            ctx.fillText(timeResult.toUpperCase(), (this.width / 2), (this.height / 2));
            enc.addFrame(ctx);
        }
        
        // Finish the gif
        enc.finish();
        
        // grab the completed image data
        let buf = enc.out.getData();
        // write the file to the system
        fs.writeFile('./public/generated/' + this.name + '.gif', buf, function (err) {
            // serve or generate the file
            cb();
        });
    }
};

module.exports = generator;
