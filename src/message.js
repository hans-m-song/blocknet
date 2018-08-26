var moment = require('moment');
const {secret, hash} = require('./block');
console.log(secret + '|' + hash);

var log = [];
var index = 0;

function msg_toString(message) {
    return message.time + '|' + message.name + '|' + message.message;
}

function msg_toElem(message) {
    return '<div class="card pending-msg"><span class="badge">' + message.time + '</span><h5>' + message.name + '</h5><p>' + message.text + '</div>'
}

// on message submission
document.getElementById('send').onclick = function(e) {
    var msg = {
        time: moment().format('YYYY-MM-DD|HH:mm:ss'),
        name: document.getElementById('nameInput').value,
        text: document.getElementById('textInput').value
    };
    console.log(msg_toString(msg));
    $('#history').append(msg_toElem(msg));
    index++;
}