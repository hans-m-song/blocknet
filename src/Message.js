/*
 * Defines a Message class for passing messages and metadata between backend and frontend
 */

const Moment = require('moment')
/*
 * Constructor for the Msg object
 * used to store the message and its metadata
 * params:  _userHash - users unique identifier or hash
 *          _message - contents of message
 * returns: a new "msg" object
 */
function Msg(_userHash, _message) {
    return {
        userHash: _userHash,
        message: _message,
        time: Moment().format()
    }
}

function msg2str(message) {
    return JSON.stringify(message)
}

module.exports = {
    Msg: Msg,
    msg2str: msg2str
}