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
        console.log('Received bytes on TCP: ' + m);
        if (websocketClient) {
            sendToWebsocket(m);
        }
    });
    c.on('error', (e) => {
        console.log('An error has occured: ' + e.message); 
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
        websocketClient = undefined;
    })
    ws.on('error', (e) => {
        console.log('An error has occured: ' + e.message);
        websocketClient = undefined;
    });
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