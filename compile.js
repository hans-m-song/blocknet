const path = require('path');
const solc = require('solc');
const fs = require('fs');
var browserify = require('browserify');
//var watchify = require('watchify');

// make path for compiled if none exists
if(!fs.existsSync('src/compiled')) {
    fs.mkdirSync('src/compiled');
}

// message.js bundle
var messagejs = browserify({
    entries: ['src/message.js'], //'src/contract.js, 'src/deploy.js'],
    cache: {},
    packageCache: {},
    plugin: []//[watchify]
});

// compile message.js
function message() {
    messagejs.bundle().on('error', console.error).pipe(fs.createWriteStream('src/compiled/message.js'));
}

// deploy.js bundle
var deployjs = browserify({
    entries: ['src/message.js'], //'src/contract.js, 'src/deploy.js'],
    cache: {},
    packageCache: {},
    plugin: []
});

// compile deploy.js
function deploy() {
    deployjs.bundle().on('error', console.error).pipe(fs.createWriteStream('src/compiled/deploy.js'));
}

message();
deploy();

/*
// retrieve contract from filesystem
// params   : x - retrieved contract
const get_contract = (x) => {
    const contractsPath = path.resolve(__dirname, 'contracts');
    return fs.readFileSync(contractsPath, 'utf8');
}

// compile retrieved contract
// params   : x - compiled contract
//            data - data to compile into contract
const compile_contract = (x, data) => {
    const f = path.resolve(__dirname, 'src/compiled');
    fs.writeFileSync(f, data);
}

// list of contracts to compile
const input = {'Message.sol': get_contract('Message.sol')};

// compile contracts
const compiled = solc.compile({sources: input}, 1);
const mainContract = compiled.contracts['Message.sol:Message'];
compile_contract('abi.json', mainContract.interface);



module.exports = {
    abi: mainContract.interface,
    bytecode: mainContract.bytecode
};
*/