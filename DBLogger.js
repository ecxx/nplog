const sqlite3 = require('sqlite3').verbose();
const Logger = require('./Logger')

var makeArray = function (nonarray) {
    return Array.prototype.slice.call(nonarray);
};

class DBLogger extends Logger {

    constructor(db_path, options) {
        super();
        this.db = new sqlite3.Database(db_path);
        this.table = options.table || 'log';
        this.level = options.level || 'level';
        this.timestamp = options.timestamp || 'time';
        this.message = options.message || 'message';
    }

    write(level, message) {

        var ts = Math.round((new Date()).getTime() / 1000);
        this.db.run(`INSERT INTO ${this.table} (${this.level},${this.timestamp},${this.message}) VALUES ('${level}',${ts},'${message}')`);

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

DBLogger.levels.forEach(function (level) {
    DBLogger.prototype[level.toLowerCase()] = function () {
        var args = makeArray(arguments);
        args.unshift(level);
        return this.log.apply(this, args);
    };
});

module.exports = DBLogger;