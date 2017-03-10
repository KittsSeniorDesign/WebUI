const fs = require('fs');

exports.log = (message, level, callback) => {
  if(process.platform === 'darwin') {
    path = __dirname + '/server.log';
    time = Date().split(' ').slice(0,-2).join(' ');
    line_ending = '\n';
  }
  else if(process.platform === 'win32') {
    path = __dirname + '\\server.log';
    time = Date().split(' ').slice(0,-4).join(' ');
    line_ending = '\r\n';
  }
  var l = 'ERROR';
  switch(level) {
    case 'error':
      l = 'ERROR';
      break;
    case 'warning':
      l = 'WARNING';
      break;
    case 'debug':
      l = 'DEBUG';
      break;
    case 'info':
      l = 'INFO';
      break;
  }
  fs.open(path, 'a', function(error, fd) {
    if (error) {
      console.error(`Couldn't open log file: ${path}`);
      return;
    }
    var log_message = `${time} - ${l}: ${message}.${line_ending}`;
    var buffer = new Buffer(log_message);
    fs.write(fd, buffer, 0, buffer.length, null, function(error) {
      if (error) {
        console.error(`Couldn't write to log file: ${path}`);
      }
      fs.close(fd, () => {
        buffer = null;
        if(callback)
          callback();
      });
    });
  });
}

exports.logSync = (message, level) => {
  if(process.platform === 'darwin') {
    path = __dirname + '/server.log';
    time = Date().split(' ').slice(0,-2).join(' ');
    line_ending = '\n';
  }
  else if(process.platform === 'win32') {
    path = __dirname + '\\server.log';
    time = Date().split(' ').slice(0,-4).join(' ');
    line_ending = '\r\n';
  }
  var l = 'ERROR';
  switch(level) {
    case 'error':
      l = 'ERROR';
      break;
    case 'warning':
      l = 'WARNING';
      break;
    case 'debug':
      l = 'DEBUG';
      break;
    case 'info':
      l = 'INFO';
      break;
  }
  var log_message = `${time} - ${l}: ${message}.${line_ending}`;
  var buffer = new Buffer(log_message);
  try {
    var fd = fs.openSync(path, 'a');
  } catch(e) {
    console.error(`Couldn't open log file: ${path}`);
  }
  try {
    fs.writeSync(fd, buffer, 0, buffer.length, null);
  } catch(e) {
    console.error(`Couldn't write to log file: ${path}`);
  }
}