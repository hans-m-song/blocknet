const Web3 = require('web3');
//var ganache = require('ganache-cli');
//const {abi, bytecode} = require('./ganache'); // get compiled contracts

// attempts to initialize a connection to a blockchain network
// params   : destination - currently an ip to connect to, may change to invitation at a later date
// returns  : the account - need to figure this out
async function connect(dest) { // async to wait for connection
    try {
        var web3 = await new Web3(Web3.givenProvider || dest);
    } catch (e) {
        throw e;
    }
    
    return web3;
};

// retrieves the destination or returns the default if none
// returns  : default destination or users input if any
function get_destination() {
    var dest = 'ws://localhost:8545';
    
    // get destination or use default
    if($('#destInput').val()) {
        var dest = $('#destInput').val();
        $('#destInput').val('');
    }
    
    return dest;
}

// get existing user details from chain
async function get_user(web3) {
    const accounts = await web3.eth.getAccounts();
    console.log('using account', accounts);
}

// handles UI changes when connecting and initializes connection
function handle_connect() {
    var dest = get_destination();
    console.log('using destination:', dest);
    $('#connect-warn').text('Using destination: ' + dest);
    
    try {
        var web3 = connect(dest); 
        var account = get_user(web3);
    } catch (e) {
        console.log(e);
        $('#connect-warn').text('Invalid destination or connection refused');
        return;
    }

    $('#connect').attr('connected', 'connected');
    disable($('#destInput'));
    $('#connect').text('Disconnect');

    //enable($('#entropy'));
    //enable($('#entropyInput'));

    // remove this stuff once user accounts are implemented
    enable($('#nameInput'));
    enable($('#textInput'));
    enable($('#send'));
}

// handles UI changes when connecting and terminates connection (doesnt actually do anything for now)
function handle_disconnect() { 
    console.log('disconnecting...');
    // remove account from list?
    $('#connect-warn').text('');

    enable($('#destInput'));

    disable($('#entropyInput'));
    disable($('#entropy'));

    disable($('#nameInput'));
    disable($('#textInput'));
    disable($('#send'));

    $('#connect').text('Connect');
    $('#connect').attr('connected', 'disconnected');
}

// connect button event handler
$("#connect").click(function(e) {
    if($('#connect').attr('connected') == 'disconnected') {
        handle_connect();
    } else {
        handle_disconnect();
    }
});

// account generation handler
$("#entropy").click(function(e) {
//    var account = web3.eth.accounts.create($('#entropyInput').val());


    disable($('#entropy'));
    disable($('#entropyInput'));

    enable($('#nameInput'));
    enable($('#textInput'));
    enable($('#send'));
});

// enables given element
// params   : element - object in document to enable
function enable(element) {
    element.prop('disabled', false);
}

// disables given element
// params   : element - object in document to disable
function disable(element) {
    element.prop('disabled', true);
}