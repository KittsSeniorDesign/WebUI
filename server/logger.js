const fs = require('fs');

exports.log = {
  error(message) {
    this.writeFile(message,'ERROR');
  },
  warning(message) {
    this.writeFile(message,'WARNING');
  },
  debug(message) {
    this.writeFile(message,'DEBUG');
  },
  info(message) {
    this.writeFile(message,'INFO');
  },
  writeFile(message,level) {
    if(process.platform === 'darwin') {
      var _path = __dirname + '/server.log';
      var _time = Date().split(' ').slice(0,-2).join(' ');
      var _lineending = '\n';
    } else if(process.platform === 'win32') {
      var _path = __dirname + '\\server.log';
      var _time = Date().split(' ').slice(0,-4).join(' ');
      var _lineending = '\r\n';
    }
    fs.open(_path, 'a', function(error, fd) {
      if (error)
        return console.error(`Couldn't open log file: ${path}`);
      var log_message = `${_time} - ${level}: ${message}.${_lineending}`;
      var buffer = new Buffer(log_message);
      fs.write(fd, buffer, 0, buffer.length, null, function(error) {
        if (error)
          return console.error(`Couldn't write to log file: ${path}`);
        fs.close(fd, () => { buffer = null; });
      });
    });
  }
}

exports.logSync = {
  error(message) {
    this.writeFile(message,'ERROR');
  },
  warning(message) {
    this.writeFile(message,'WARNING');
  },
  debug(message) {
    this.writeFile(message,'DEBUG');
  },
  info(message) {
    this.writeFile(message,'INFO');
  },
  writeFile(message,level) {
    if(process.platform === 'darwin') {
      var _path = __dirname + '/server.log';
      var _time = Date().split(' ').slice(0,-2).join(' ');
      var _lineending = '\n';
    } else if(process.platform === 'win32') {
      var _path = __dirname + '\\server.log';
      var _time = Date().split(' ').slice(0,-4).join(' ');
      var _lineending = '\r\n';
    }
    var log_message = `${_time} - ${level}: ${message}.${_lineending}`;
    var buffer = new Buffer(log_message);
    try {
      var fd = fs.openSync(_path, 'a');
    } catch(e) {
      return console.error(`Couldn't open log file: ${path}`);
    }
    try {
      fs.writeSync(fd, buffer, 0, buffer.length, null);
    } catch(e) {
      return console.error(`Couldn't write to log file: ${path}`);
    }
  }
}