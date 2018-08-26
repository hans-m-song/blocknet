var moment = require('moment');
var Block = require('./block');

var index = 0;
var chain = Block.init_chain();

console.log(chain);

function msg_toString(message) {
    return message.time + '|' + message.name + '|' + message.text;
}

function msg_toElem(message) {
    return '<div class="card msg'+ index + '"><span class="badge">' + message.time + '</span><h5>' + message.name + '</h5><p>' + message.text + '</div>';
}

function block_toElem(block) {
    return '<div class="card block'+ block.index + '"><span class="badge">' + block.time + '</span><h5>' + block.hash + '</h5><p>' + msg_toElem(block.data) + '</div>';
}

// on message submission
document.getElementById('send').onclick = function(e) {
    if(!$('#textInput').val()) {
        $('#submit-warn-text').removeClass('hidden');
        return;
    }
    $('#submit-warn-text', '#submit-warn-name').addClass('hidden');
    var msg = {
        time: moment().format('YYYY-MM-DD|HH:mm:ss'),
        name: (!$('#nameInput').val()) ? 'anon' : $('#nameInput').val(),
        text: $('#textInput').val()
    };
    console.log(msg_toString(msg));
    $('#pending').append(msg_toElem(msg));
    index++;
    var block = Block.generate_block(chain, msg);
    console.log(block);
    $('#log').append(block_toElem(block));
    $('#textInput').val("");
}