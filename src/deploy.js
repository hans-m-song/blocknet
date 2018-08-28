const Web3 = require('web3');

var defaultDest = 'ws://localhost:8545';
var dest = defaultDest;

// initializes a connection to a blockchain network
// params   : destination - currently an ip to connect to, may change to invitation at a later date
// returns  : the account - need to figure this out
const connect = async(destination) => {
    var web3 = new Web3(Web3.givenProvider || destination);
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    return(accounts[0]);
};

// handles UI changes when connecting and initializes connection
function handle_connect() {
    if(!$('#ipInput').val()) {
        $('#connect-warn').text('Using default IP: 127.0.0.1:8545');
    } else {
        dest = $('#ipInput').val();
        $('#ipInput').val('');
        $('#connect-warn').text('Using IP: ', dest);
    }
    console.log('attempting to connnect to: ', dest);
    try {
        connect(dest); 
    } catch(err) {// if connect failed
        $('#ipInput').prop('disabled', true);
        $('#connect').text('disconnect');
        return;
    }
    console.log('connected to: ', dest);
    $('#connect').attr('connected', 'connected');
    $('#submit-warn').text('');
}

// handles UI changes when connecting and terminates connection (doesnt actually do anything for now)
function handle_disconnect() { 
    $('#connect-warn').text('');
    $('#ipInput').prop('disabled', false);
    $('#connect').text('connect');
    $('#connect').attr('connected', 'disconnected');
}

// connect button event handler
document.getElementById('connect').onclick = function(e) {
    if($('#connect').attr('connected') == 'disconnected') {
        handle_connect();
    } else {
        handle_disconnect();
    }
}
