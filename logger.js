const fs = require('fs');

if(process.platform === 'darwin') {
    path = __dirname + '/server.log';
    time = Date().split(' ').slice(0,-2).join(' ');
    line_ending = '\n';
}
else if(process.platform === 'win32') {
    path = __dirname + '\\server.log';
    time = Date().split(' ').slice(0,-4).join(' ');
    line_ending = '\n';
}

var log = function(message, level, callback) {
    var l = 'Error';
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
    fs.open(path, 'a', function(error, fd) {
        if (error) {
            console.error(`Couldn't open log file: ${path}`);
            return;
        }
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

module.exports = log;