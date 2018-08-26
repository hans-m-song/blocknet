const CryptoJS = require('crypto-js');
var moment = require('moment');

function get_hash (block){
    return CryptoJS.SHA256(block.index + block.prevHash + block.time + block.data).toString();
}

exports.toString = function(block) {
    return block.index + '|' + block.time + '|' + block.prevHash + '|' + block.hash + '|' + block.data;
}

function Block(index, prevHash, time, data) {
    var block = {
        index: index,
        prevHash: prevHash,
        time: time,
        data:data,
    }
    block.hash = get_hash(block)
    return block;
}

exports.init_chain = function() {
    var genesisBlock = Block(
        0, 
        CryptoJS.SHA256('sugoi'), 
        moment().format('YYYY-MM-DD|HH:mm:ss'), 
        CryptoJS.SHA256('desu'), 'hello world'
    );
    return {
        index: 0,
        blocks: [genesisBlock]
    }
}

exports.generate_block = function(chain, data) {
    var prevBlock = chain.blocks[chain.index];
    block = Block(
        prevBlock.index + 1,
        prevBlock.hash,
        moment().format('YYYY-MM-DD|HH:mm:ss'),
        data
    );
    chain.index++;
    chain.blocks.push(block);
    return block;
}