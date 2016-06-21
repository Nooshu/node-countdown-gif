'use strict';

const fs = require('fs');
const GIFEncoder = require('gifencoder');
const Canvas = require('canvas');
const moment = require('moment');

module.exports = {
    /**
     * Initialise the GIF generation
     * @param {string} time
     * @param {number} width
     * @param {number} height
     * @param {string} color
     * @param {string} bg
     * @param {string} name
     * @param {requestCallback} cb - The callback that is run once complete.
     */
    init: function(time, width=200, height=200, color='ffffff', bg='000000', name='default', cb){
        this.width = Number(width);
        this.height = Number(height);
        this.bg = '#' + bg;
        this.textColor = '#' + color;
        this.name = name;
        
        // loop optimisations
        this.halfWidth = Number(this.width / 2);
        this.halfHeight = Number(this.height / 2);
        
        this.encoder = new GIFEncoder(this.width, this.height);
        this.canvas = new Canvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');
        
        // calculate the time difference (if any)
        let timeResult = this.time(time);
        
        // start the gif encoder
        this.encode(timeResult, cb);
    },
    /**
     * Calculate the diffeence between timeString and current time
     * @param {string} timeString
     * @returns {string|Object} - return either the date passed string, or a valid moment duration object
     */
    time: function (timeString) {
        // grab the current and target time
        let target = moment(timeString);
        let current = moment();
        
        // difference between the 2 (in ms)
        let difference = target.diff(current);
        
        // either the date has passed, or we have a difference
        if(difference <= 0){
            return 'Date has passed!';
        } else {
            // duration of the difference
            return moment.duration(difference);
        }
    },
    /**
     * Encode the GIF with the information provided by the time function
     * @param {string|Object} timeResult - either the date passed string, or a valid moment duration object
     * @param {requestCallback} cb - the callback to be run once complete
     */
    encode: function(timeResult, cb){
        let enc = this.encoder;
        let ctx = this.ctx;
        
        // pipe the image to the filesystem to be written
        var imageStream = enc
                .createReadStream()
                    .pipe(fs.createWriteStream('./public/generated/' + this.name + '.gif'));
        // once finised, generate or serve
        imageStream.on('finish', () => {
            cb();
        });
        
        // estimate the font size based on the provided width
        let fontSize = Math.floor(this.width / 11) + 'px';
        let fontFamily = 'Courier New'; // monospace works slightly better
        
        // set the font style
        ctx.font = [fontSize, fontFamily].join(' ');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // start encoding gif with following settings
        enc.start();
        enc.setRepeat(0);
        enc.setDelay(1000);
        enc.setQuality(10);

        // if we have a moment duration object
        if(typeof timeResult === 'object'){
            for(let i = 0; i < 60; i++){
                // extract the information we need form the duration
                let days = timeResult.days().toString();
                let hours = timeResult.hours().toString();
                let minutes = timeResult.minutes().toString();
                let seconds = timeResult.seconds().toString();
                
                // make sure we have 2 characters in the string
                days = (days.length == 1) ? '0' + days : days;
                hours = (hours.length == 1) ? '0' + hours : hours;
                minutes = (minutes.length == 1) ? '0' + minutes : minutes;
                seconds = (seconds.length == 1) ? '0' + seconds : seconds;
                
                // build the date string
                let string = [days, 'd ', hours, 'h ', minutes, 'm ', seconds, 's'].join('');
                
                // paint BG
                ctx.fillStyle = this.bg;
                ctx.fillRect(0, 0, this.width, this.height);
                
                // paint text
                ctx.fillStyle = this.textColor;
                ctx.fillText(string, this.halfWidth, this.halfHeight);
                
                // add finalised frame to the gif
                enc.addFrame(ctx);
                
                // remove a second for the next loop
                timeResult.subtract(1, 'seconds');
            }
        } else {
            // Date has passed so only using a string
            
            // BG
            ctx.fillStyle = this.bg;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Text
            ctx.fillStyle = this.textColor;
            ctx.fillText(timeResult, this.halfWidth, this.halfHeight);
            enc.addFrame(ctx);
        }
        
        // finish the gif
        enc.finish();
    }
};
