const five = require('johnny-five');
const LedLine = require('./ledline');

const board = new five.Board();

const pwmPins = [11, 10, 9, 6, 5, 3];
const ledCount = 6;

board.on('ready', function() {
    const ledLine = new LedLine(pwmPins.slice(0, ledCount));
    const photoresistor = new five.Sensor({
        pin: "A2",
        freq: 250
    });

    this.repl.inject({
        ledLine: ledLine,
        pot: photoresistor
    });

    photoresistor.on("data", (value) => ledLine.bounceInterval = value);
})
