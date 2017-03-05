chalk = require('chalk');
ws = require('ws');
net = require('net');
log = require('./logger.js');

const info = 'info';
const debug = 'debug';
const warning = 'warning';

log('Server started', info);

error = chalk.bold.red;
packet = chalk.magenta;
connect = chalk.green;
disconnect = chalk.red;
w = chalk.yellow;
tcp = chalk.cyan;

websocketClient = undefined;
wsPort = 9002;

tcpClient = undefined;
tcpPort = 9001;

const wss = new ws.Server({
    perMessageDeflate: false,
    port: wsPort
});

wss.on('connection', (ws) => {
    ws.on('message', (m) => {
        console.log(`Received on ${w('Websocket')}: ${packet(m)}`);
        tcpClient.write(m);
        console.log(`Sent on ${tcp('TCP')}: ${packet(m)}`);
    });
    ws.on('close', () => {
        console.log(`${w('Websocket client')} has ${disconnect('disconnected')}.`);
        log('Websocket client has disconnected', info);
        websocketClient = undefined;
    })
    ws.on('error', (e) => {
        console.log(`An ${error('error')} has occured: ${error(e.message)}`);
        log(e.message);
        websocketClient = undefined;
    });
    console.log(`${w('Websocket client')} has ${connect('connected')}.`);
    log('Websocket client has connected', info);
    websocketClient = ws;
})
    
const nss = net.createServer((c) => {
    tcpClient = c;
    console.log(`${tcp('TCP client')} has ${connect('connected')}.`);
    log('TCP client has connected', info);
    c.on('end', () => {
        console.log(`${tcp('TCP client')} has ${disconnect('disconnected')}.`);
        log('TCP client has disconnected', info);
    });
    c.on('data', (m) => {
            console.log(`Received on ${tcp('TCP')}: ${packet(m)}`);
        if(websocketClient) {
            if (websocketClient.readyState === 1) {
                websocketClient.send(m);
                console.log(`Sent on ${w('Websocket')}: ${packet(m)}`);
            }
        } else {
            console.log(`Not connected to ${w('Websocket')}.`);
        }
    });
    c.on('error', (e) => {
        console.log(`An ${error('error')} has occured: ${error(e.message)}`);
        log(e.message);
    });
});

nss.listen(tcpPort, () => {
    console.log(`${tcp('TCP server')} listening on port ${tcp(tcpPort)}.`);
});

process.on('SIGINT', () => {
    process.stdout.write("\033[2K\033[200D");
    if(process.platform === 'win32')
        process.stdout.write('Shutting down server.');
    else if(process.platform === 'darwin')
        console.log('Shutting down server.');
    log('Server shut down', info, () => {
        process.exit(); 
    });
});