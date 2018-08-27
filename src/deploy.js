const Web3 = require('web3');

var defaultDest = 'ws://localhost:8545';
var dest = defaultDest;

const connect = async(destination) => {
    
    var web3 = new Web3(Web3.givenProvider || destination);
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    return(accounts[0]);
};

function handle_connect() {
    if(!$('#ipInput').val()) {
        $('#connect-warn').text('Using default IP: 127.0.0.1:8545');
    } else {
        dest = $('#ipInput').val();
        $('#ipInput').val('');
        $('#connect-warn').text('Using IP: ', dest);
    }
    console.log('attempting to connnect to: ', dest);
    if(connect(dest)) {
        $('#ipInput').prop('disabled', true);
        $('#connect').text('disconnect');
    }
    $('#connect').attr('connected', 'connected');
    $('#submit-warn').text('');
}

function handle_disconnect() { // doesnt actually do anything
    $('#connect-warn').text('');
    $('#ipInput').prop('disabled', false);
    $('#connect').text('connect');
    $('#connect').attr('connected', 'disconnected');
}

document.getElementById('connect').onclick = function(e) {
    if($('#connect').attr('connected') == 'disconnected') {
        handle_connect();
    } else {
        handle_disconnect();
    }
}