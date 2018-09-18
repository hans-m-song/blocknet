const IPFS = require('ipfs')

// TODO figure out how set up locally run ipfs daemon
/*
* Constructor for the options constant
*/
const options = {
    EXPERIMENTAL: {pubsub: true},
    repo: 'ipfs-' + Math.random(),
    config: {
        Addresses: {
            Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
        }
    }
}

/* 
* Function that instantiates an IPFS given the options constant
* returns: IPFS(options) An IPFS instance with aforementioned options
*/
async function getIPFS() {
    return await new IPFS(options)
}

export default getIPFS