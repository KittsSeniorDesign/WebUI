ws = require('ws');
net = require('net');

var tcpClient;
var websocketClient;

const wss = new ws.Server({
    perMessageDeflate: false,
    port: 9002
});

const nss = net.createServer((c) => {
    tcpClient = c;
    console.log('TCP client has connected.');
    c.on('end', () => {
        console.log('TCP client has disconnected.');
    });
    c.on('data', (m) => {
        console.log('Received on TCP: ' + m);
        sendToWebsocket(m);
    });
});

nss.listen(9001, () => {
    console.log('TCP server listening on port 9001.');
});

wss.on('connection', (ws) => {
    ws.on('message', (m) => {
        console.log('Received on Websocket: ' + m);
        sendToTCP(m);
    });
    ws.on('end', () => {
        console.log('Websocket client has disconnected.');
    })
    console.log('Websocket client has connected.');
    websocketClient = ws;
})

function sendToWebsocket(m) {
    websocketClient.send(m);
    console.log('Sent on Websocket: ' + m);
}

function sendToTCP(m) {
    tcpClient.write(m);
    console.log('Sent on TCP: ' + m);
}