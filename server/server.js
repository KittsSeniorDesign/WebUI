chalk = require('chalk');
ws = require('ws');
net = require('net');
logger = require('./logger.js');

const info = 'info';
const debug = 'debug';
const warning = 'warning';

logger.log.info('Server started');

color_error = chalk.bold.red;
color_packet = chalk.cyan;
color_connect = chalk.green;
color_disconnect = chalk.red;
color_websocket = chalk.yellow;
color_tcp = chalk.magenta;

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
    console.log(`Received on ${color_websocket('Websocket')}: ${color_packet(m)}`);
    if(tcpClient) {
      tcpClient.write(m);
      console.log(`Sent on ${color_tcp('TCP')}: ${color_packet(m)}`);
    }
  });
  ws.on('close', () => {
    console.log(`${color_websocket('Websocket client')} has ${color_disconnect('disconnected')}.`);
    logger.log.info('Websocket client has disconnected');
    websocketClient = undefined;
  })
  ws.on('error', (e) => {
    console.log(`An ${color_error('error')} has occured: ${color_error(e.message)}`);
    logger.log.error(e.message);
    websocketClient = undefined;
  });
  console.log(`${color_websocket('Websocket client')} has ${color_connect('connected')}.`);
  logger.log.info('Websocket client has connected');
  websocketClient = ws;
})
    
const nss = net.createServer((c) => {
  tcpClient = c;
  console.log(`${color_tcp('TCP client')} has ${color_connect('connected')}.`);
  logger.log.info('TCP client has connected')
  c.on('end', () => {
    console.log(`${color_tcp('TCP client')} has ${color_disconnect('disconnected')}.`);
    logger.log.info('TCP client has disconnected');
    tcpClient = undefined;
  });
  c.on('data', (m) => {
      console.log(`Received on ${color_tcp('TCP')}: ${color_packet(m)}`);
    if(websocketClient) {
      if (websocketClient.readyState === 1) {
        websocketClient.send(m);
        console.log(`Sent on ${color_websocket('Websocket')}: ${color_packet(m)}`);
      }
    }
  });
  c.on('error', (e) => {
    console.log(`An ${color_error('error')} has occured: ${color_error(e.message)}`);
    logger.log.error(e.message);
    tcpClient = undefined;
  });
});

nss.listen(tcpPort, () => {
  console.log(`${color_tcp('TCP server')} listening on port ${color_tcp(tcpPort)}.`);
});

process.on('SIGINT', () => { process.exit() });

process.on('exit', () => {
  process.stdout.write("\033[2K\033[200D");
  logger.logSync.info('Server shut down');
  console.log('Shutting down server.');
});