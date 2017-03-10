chalk = require('chalk');
ws = require('ws');
net = require('net');
logger = require('./logger.js');

const info = 'info';
const debug = 'debug';
const warning = 'warning';

logger.log('Server started', info);

error = chalk.bold.red;
packet = chalk.cyan;
connect = chalk.green;
disconnect = chalk.red;
w = chalk.yellow;
tcp = chalk.magenta;

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
    if(tcpClient) {
      tcpClient.write(m);
      console.log(`Sent on ${tcp('TCP')}: ${packet(m)}`);
    }
  });
  ws.on('close', () => {
    console.log(`${w('Websocket client')} has ${disconnect('disconnected')}.`);
    logger.log('Websocket client has disconnected', info);
    websocketClient = undefined;
  })
  ws.on('error', (e) => {
    console.log(`An ${error('error')} has occured: ${error(e.message)}`);
    logger.log(e.message);
    websocketClient = undefined;
  });
  console.log(`${w('Websocket client')} has ${connect('connected')}.`);
  logger.log('Websocket client has connected', info);
  websocketClient = ws;
})
    
const nss = net.createServer((c) => {
  tcpClient = c;
  console.log(`${tcp('TCP client')} has ${connect('connected')}.`);
  logger.log('TCP client has connected', info);
  c.on('end', () => {
    console.log(`${tcp('TCP client')} has ${disconnect('disconnected')}.`);
    logger.log('TCP client has disconnected', info);
    tcpClient = undefined;
  });
  c.on('data', (m) => {
      console.log(`Received on ${tcp('TCP')}: ${packet(m)}`);
    if(websocketClient) {
      if (websocketClient.readyState === 1) {
        websocketClient.send(m);
        console.log(`Sent on ${w('Websocket')}: ${packet(m)}`);
      }
    }
  });
  c.on('error', (e) => {
    console.log(`An ${error('error')} has occured: ${error(e.message)}`);
    logger.log(e.message);
    tcpClient = undefined;
  });
});

nss.listen(tcpPort, () => {
  console.log(`${tcp('TCP server')} listening on port ${tcp(tcpPort)}.`);
});

process.on('SIGINT', () => { process.exit() });

process.on('exit', () => {
  process.stdout.write("\033[2K\033[200D");
  logger.logSync('Server shut down', info);
  console.log('Shutting down server.');
});