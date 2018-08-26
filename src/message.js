var moment = require('moment');

var log = [];
var index = 0;

// message constructor
function Message(time, name, message) {
    this.time = time;
    this.name = name;
    this.message = message;
}

function msg_toString(message) {
    return time + '|' + name + '|' + message;
}

function log_toString() {
    for(var i = 0; i < index; i++) {
        console.log(msg_toString(log[i]));
    }
}

// on message submission
document.getElementById('send').onclick = function(e) {
    var time = moment().format('YYYY-MM-DD-HH-mm-ss Z');
    var name = document.getElementById('nameInput').value;
    var message = document.getElementById('messageInput').value;
    console.log('New message:' + msg_toString(message));
    log.push(Message(time, name, message));
    index++;
}