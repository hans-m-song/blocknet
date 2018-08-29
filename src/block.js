const CryptoJS = require('crypto-js');
var moment = require('moment');

// hash function for Blocks
// params   : block - pre-filled Block object
// returns  : a sha256 hashed string based on the blocks contents
function get_hash (block){
    return CryptoJS.SHA256(block.index + block.prevHash + block.time + block.data).toString();
}

// toString of Block
// params   : block - pre-filled Block object
// returns  : string representation of block contents
exports.toString = function(block) {
    return block.index + '|' + block.time + '|' + block.prevHash + '|' + block.hash + '|' + block.data;
}

// constructor for block objects
// params   : index - position in block
//            prevHash - hash of previous block
//            data - payload to carry
// returns  : a new Block object
function Block(index, prevHash, data) {
    var block = {
        index: index,
        prevHash: prevHash,
        time: moment().format('YYYY-MM-DD|HH:mm:ss'), 
        data: data,
    }
    block.hash = get_hash(block)
    return block;
}

// creates a new Chain object with a genesis block
// for now creates a new chain, should change this to get blocks from the ipfs net once its implemented
// returns  : a Chain object
exports.init_chain = function() {
    var genesisBlock = Block(
        0, 
        CryptoJS.SHA256('sugoi'), 
        CryptoJS.SHA256('desu'), 'hello world'
    );
    return {
        index: 0,
        blocks: [genesisBlock]
    }
}

// creates a Block with the given data and adds it to the Chain
// params   : chain - Chain object to store block in
//            data - data to save into block
// returns  : block - the new Block that was created and stored (mainly for convenience)
exports.generate_block = function(chain, data) {
    var prevBlock = chain.blocks[chain.index];
    block = Block(
        prevBlock.index + 1,
        prevBlock.hash,
        data
    );
    chain.index++;
    chain.blocks.push(block);
    return block;
}