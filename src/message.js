var moment = require('moment');
var Block = require('./block');

var index = 0;
var localChain = Block.init_chain(); 

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
    if($('#connect').attr('connected') == 'disconnected') {
        $('#submit-warn').text('Must connect first');
        return;
    } else if(!$('#textInput').val()) {
        $('#submit-warn').text('Cannot send empty message');
        return;
    }
    $('#submit-warn').text('');
    var msg = {
        time: moment().format('YYYY-MM-DD|HH:mm:ss'),
        name: (!$('#nameInput').val()) ? 'anon' : $('#nameInput').val(),
        text: $('#textInput').val()
    };
    console.log('got message:', msg_toString(msg));
    $('#pending').append(msg_toElem(msg));
    index++;
    var block = Block.generate_block(localChain, msg);
    console.log('got block: ', block);
    $('#log').append(block_toElem(block));
    $('#textInput').val("");
}