const IPFS = require('ipfs')

// TODO figure out how set up locally run ipfs daemon

/*var host = 'localhost'
if(!true) { // local version does not exist
    host = 'ipfs.infura.io'
}

const ipfs = new IPFS(host, '5001', {protocol: 'http'})
*/

//var ipfs = IPFS({host: 'localhost', port: '4002', protocol: 'http'})
async function getIPFS() {
    return await new IPFS({repo: '~/.jsifps/datastore', init: false})
}

export default getIPFS