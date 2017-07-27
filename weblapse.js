#!/usr/bin/env node

var d3 = require('d3'),
    Nightmare = require('nightmare'),
    moment = require('moment');

var argv = require('minimist')(process.argv.slice(2))

const url = argv._[0];

console.log(`Making timelapse of ${url} (first nameless command line argument)`);

const period = argv.period || 60 * 1000;
console.log(`Capturing one frame every ${period} milliseconds (control with --period)`);

const delay = argv.delay || 3000;
console.log(`Screenshot will be taken ${delay} milliseconds after page load (control with --delay)`);

const width = argv.width || 1536;
const height = argv.height || 1536;
console.log(`Screenshot will be ${width} x ${height} (control with --width and --height)`);

const evalSource = argv.eval || '/* no-op */';
const _eval = new Function(evalSource);
console.log(`Will evaluate ${evalSource} in page context before each capture (pass JavaScript expression with --eval)`);

function captureFrame() {
    const filename = moment().toISOString()+'.png';
  new Nightmare({show: false})
    .viewport(width, height)
    .goto(url)
    .evaluate(_eval)
    .wait(delay)
    .screenshot(filename)
    .run(() => {
        console.log('saved ' + filename);
    });
}

// every minute
setInterval(captureFrame, period);
// also immediately so it's easier to debug
captureFrame();
