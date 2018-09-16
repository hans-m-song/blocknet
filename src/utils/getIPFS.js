const IPFS = require('ipfs')

// TODO figure out how set up locally run ipfs daemon

const options = {
    EXPERIMENTAL: {pubsub: true},
    repo: 'ipfs-' + Math.random(),
    config: {
        Addresses: {
            Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
        }
    }
}

async function getIPFS() {
    return await new IPFS(options)
}

export default getIPFS