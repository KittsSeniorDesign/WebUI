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

var t = timers.setInterval(() => {
    var val_0 = Math.round(generateRandom(0,1));;
    var val_1 = Math.round(generateRandom(0,100));
    var val_2 = Math.round(generateRandom(0,100));
    var val_3 = Math.round(generateRandom(0,100));
    var val_4 = Math.round(generateRandom(0,100));
    var val_5 = Math.round(generateRandom(0,100));
    var val_6 = Math.round(generateRandom(0,100));
    var val_7 = Math.round(generateRandom(0,100));
    try {
        tcpClient.write('robot_' + val_0 + ', ' + val_1 + ', ' + val_2 + ', ' + val_3 + ', ' + val_4 + ', ' + val_5 + ', ' + val_6 + ', ' + val_7);
    } catch(e) {
        console.error(`An error has occured: ${e.message}`);
        process.exit(1);
    }
}, 1000);