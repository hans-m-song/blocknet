const IPFS = require('ipfs-api')

// TODO figure out how set up locally run ipfs daemon

var host = 'localhost'
if(!true) { // local version does not exist
    host = 'ipfs.infura.io'
}

const ipfs = new IPFS(host, '5001', {protocol: 'http'})

export default ipfs