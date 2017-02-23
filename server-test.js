var net = require('net');

var nss = new net.Socket();

var tcpClient;

nss.connect(9001, '127.0.0.1', function() {
    tcpClient = nss;
    console.log('Connected to TCP server.');
});

nss.on('data', function(data) {
    console.log('Received on TCP: ' + data);
    writeToTCP(data);
});

nss.on('close', function() {
    console.log('TCP connection closed.');
});

function writeToTCP(m) {
    tcpClient.write(m);
}