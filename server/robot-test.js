var net = require('net');
var timers = require('timers')

var nss = new net.Socket();

var tcpClient;

nss.connect(9001, '127.0.0.1', function() {
    tcpClient = nss;
    console.log('Connected to TCP server.');
});

nss.on('data', function(data) {
    console.log('Received on TCP: ' + data);
});

nss.on('close', function() {
    console.log('TCP connection closed.');
});

nss.on('error', (error) => {
    console.log(`An error has occured: ${error.message}`);
    process.exit(1);
})

function generateRandom(low,high) {
    return Math.random() * (high - low) + low
}

var i = 0;
var k = 1750
var t = timers.setInterval(() => {
    if(i > 3874) {
        i = 0;
    }
    var val_0 = Math.round(generateRandom(0,0));
    var val_1 = Math.round(generateRandom(0,0));
    var val_2 = Math.round(generateRandom(0,0));
    var val_3 = i++;
    var val_4 = k;
    var val_5 = Math.round(generateRandom(0,0));
    var val_6 = Math.round(generateRandom(0,0));
    var val_7 = Math.round(generateRandom(0,0));
    try {
        tcpClient.write('robot_' + val_0 + ',' + val_1 + ',' + val_2 + ',' + val_3 + ',' + val_4 + ',' + val_5 + ',' + val_6 + ',' + val_7 + ';');
    } catch(e) {
        console.error(`An error has occured: ${e.message}`);
        process.exit(1);
    }
}, 50);

var j = 0;
var l = 750
var t = timers.setInterval(() => {
    if(j > 3874) {
        j = 0;
    }
    var val_0 = Math.round(generateRandom(1,1));
    var val_1 = Math.round(generateRandom(0,0));
    var val_2 = Math.round(generateRandom(0,0));
    var val_3 = j++;
    var val_4 = l;
    var val_5 = Math.round(generateRandom(0,0));
    var val_6 = Math.round(generateRandom(0,0));
    var val_7 = Math.round(generateRandom(0,0));
    try {
        tcpClient.write('robot_' + val_0 + ',' + val_1 + ',' + val_2 + ',' + val_3 + ',' + val_4 + ',' + val_5 + ',' + val_6 + ',' + val_7 + ';');
    } catch(e) {
        console.error(`An error has occured: ${e.message}`);
        process.exit(1);
    }
}, 50);