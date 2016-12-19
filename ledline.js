const five = require('johnny-five');

class LedLine {
    constructor (pins) {
        this._leds = [];
        pins.forEach((pin) => this._leds.push(new five.Led(pin)));
        this._bounceOptions = {};
    }

    _genValueArray(maxVal, count, maxValPos, exponent = 3) {
        let arr = []
        for (let i = 0; i<count; i++){
            arr.push(maxVal/((Math.pow(Math.abs(maxValPos-i), exponent)+1)))
        }
        return arr;
    }

    _bounce() {
        const interval = this._bounceOptions.interval || 1000;
        if (this._bounceOptions.bounce === true) {
            this.right(interval/2);
        }
        if (this._bounceOptions.bounce === true) {
            setTimeout(() => {this.left(interval/2)}, interval/2);
        }
        if (this._bounceOptions.bounce === true) {
            setTimeout(() => {this._bounce()}, interval);
        }
    }

    changeLEDsBrightness(brightness, fadeTime = 1000) {
        this._leds.forEach((led, i) => led.fade(brightness[i], fadeTime));
    }

    peakBrightness(maxBrightnessPos, fadeTime = 1000, maxBrightness = 255) {
        this.changeLEDsBrightness(this._genValueArray(maxBrightness, this._leds.length, maxBrightnessPos), fadeTime);
    }

    right(time = 1000, start = 1){
        let t = time / this._leds.length;
        let i = start;
        let interval = setInterval(() => {i++; i<=this._leds.length ? this.peakBrightness(i-1, t) : clearInterval(interval)}, t);
    }

    left(time = 1000, start = this._leds.length - 2){
        let t = time / this._leds.length;
        let i = start;
        let interval = setInterval(() => {i--; i>=-1 ? this.peakBrightness(i+1, t) : clearInterval(interval)}, t);
    }

    startBouncing(interval = this._bounceOptions.interval || 1000) {
        this._bounceOptions.interval = interval;
        if (!this._bounceOptions.bounce) {
            this._bounceOptions.bounce = true;
            this._bounce();
        }
    }

    stopBouncing() {
        this._bounceOptions.bounce = false;
    }

    off(time = 0) {
        this._leds.forEach((led) => led.fade(0, time));
    }

    fade(brightness, time = 1000) {
        this._leds.forEach((led) => led.fade(brightness, time));
    }

    set bounceInterval(interval) {this._bounceOptions.interval = interval || 1000}
    get bounceInterval() {return this._bounceOptions.interval}
}

module.exports = LedLine;
