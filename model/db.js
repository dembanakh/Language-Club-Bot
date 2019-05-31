const pg = require('pg');
const CONSTANTS = require('./Constants.js');

var config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

// ONLY FOR TESTING
pool.query('DELETE FROM users WHERE 1=1')
    .then((err, res) => console.log(err, res))
    .catch(err => console.log(err));
// END

async(function query(type, args) {
    switch (type) {
        case CONSTANTS.GET_STATUS:
            let status = await(getStatus(args));
            return status;
        case CONSTANTS.INSERT_USER:
            insertUser(args);
            break;
        case CONSTANTS.UPDATE_STATUS:
            updateStatus(args);
            break;
        case CONSTANTS.UPDATE_NICKNAME:
            updateNickname(args);
        default:
            break;
    }
});

function insertUser(args) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        } else {
            if (checkIfUserExists(args[0])) return;
            client.query(CONSTANTS.INSERT_USER_QUERY, args, (err, result) => {
                release();
                if (err) {
                    return console.error('Error INSERT_USER query', err.stack);
                }
            })
        }
    })
}

function updateStatus(args) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        } else {
            client.query(CONSTANTS.UPDATE_CYCLE_STATUS, args, (err, result) => {
                release();
                if (err) {
                    return console.error('Error UPDATE_STATUS query', err.stack);
                }
            })
        }
    })
}

function checkIfUserExists(id) {
    var exists = undefined;
    
    return exists;
}

async(function getStatus(args) {
    var status = undefined;
    var result = await(pool.query(CONSTANTS.GET_STATUS_QUERY, args));
    return result.rows[0].status;
});

function updateNickname(args) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.log('Error acquiring client', err.stack);
        } else {
            client.query(CONSTANTS.UPDATE_NICKNAME_QUERY, args, (err, result) => {
                updateStatus(nextStatus(args[0]));
                release();
                if (err) {
                    return console.error('Error UPDATE_NICKNAME query', err.stack);
                }
            })
        }
    })
}

function nextStatus(status) {
    switch (status) {
        case CONSTANTS.STARTED_REGISTRATION:
            return CONSTANTS.GOT_NICKNAME;
        default:
            return undefined;
    }
}

module.exports = query;