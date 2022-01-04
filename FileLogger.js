const Logger = require('./Logger')
var path = require('path'),
    fs   = require('fs');

var makeArray = function (nonarray) {
    return Array.prototype.slice.call(nonarray);
};

class FileLogger extends Logger {

    constructor(file_path, options) {
        super();
        this.file_path = file_path;

        if (this.file_path) {
            this.file_path = path.normalize(this.file_path);
            this.stream = fs.createWriteStream(this.file_path, { flags: 'a', encoding: 'utf8' });
        }
    }

    write(level, message) {

        var msg = [level, ' [', new Date(), '] ', message].join('');

        if (this.stream) {
            this.stream.write(msg);
        }

    }

    log() {

        var args = makeArray(arguments);
        var log_index = Logger.levels.indexOf(args[0]);
        var message = '';

        if (log_index === -1) {
            log_index = 3;
        } else {
            args.shift();
        }

        args.forEach(function (arg) {
            if (typeof arg === 'string') {
                message += ' ' + arg;
            } else {
                message += ' ' + sys.inspect(arg, false, null);
            }
        });

        message = message.trim();

        this.write(Logger.levels[log_index], message);

        return message;

    }

}

FileLogger.levels.forEach(function (level) {
    FileLogger.prototype[level.toLowerCase()] = function () {
        var args = makeArray(arguments);
        args.unshift(level);
        return this.log.apply(this, args);
    };
});

module.exports = FileLogger;