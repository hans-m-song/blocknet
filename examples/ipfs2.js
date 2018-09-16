const IPFS = require('ipfs')

// ipfs hash to send message to
const $multiHashInput = document.querySelector('#multihash-input')
const $multiAddrInput = document.querySelector('#multiaddr-input')

// list of connected peers
const $peersList = document.querySelector('#peers-list')

// somewhere to write status/logs
const $log = document.querySelector('#log')

// somewhere to show hash of ipfs
const $ipfsID = document.querySelector('#ipfs-id')

// elements to attach event listeners to
const $connectButton = document.querySelector('#connect-btn')
const $sendButton = document.querySelector('#send-btn')


let node
let info
let Buffer

function start() {
    if(!node) {
        const options = {
            EXPERIMENTAL: {pubsub: true},
            repo: 'ipfs-' + Math.random(),
            config: {
                Addresses: {
                    Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']
                }
            }
        }
    }

    node = new IPFS(options)

    Buffer = node.types.Buffer

    node.once('start', () => {
        try {
            info = await node.id()
            updateView('ready', node)
            onSuccess('IPFS node is ready')
            setInterval(refreshPeerList, 1000)
            setInterval(sendFileList, 10000)
        } catch(err) {
            onError(err)
        }

        subscibeToWorkspace()
    })
}

const messageHandler = (message) => {
    const myNode = info.id
    const hash = message.data.toString()
    const messageSender = message.from

    if(myNode !== messageSender && !isFileInList(hash)) {
        getFile()
    }

    const subscibeToWorkspace = () => {
        node.pubsub.subscribe(workspace, messageHandler)
            .catch(() => onerror('Error subscribing to workspace'))
    }

    const publishHash = (hash) => {
        const data = Buffer.from(hash)

        node.pubsub.publish(workspace, data)
            .catch(() => onerror('Error publishing message'))
    }
}

const isFileInList = (hash) => FILES.indexOf(hash) !== -1

const sendFileList = () => FILES.forEach((hash) => publishHash(hash))

// can use these for progressbars
const updateProgress = (bytesLoaded) => {
    let percent = 100 - ((bytesLoaded/fileSize) * 100)
    //progressbar status = percent
}

const resetProgress = () => {
    //progressbar status = 0
}

function appendFile(name, hash, size, data) {
    // for visualising new message
    publishHash(hash)
}

function getFile() {
    const hash = $multiHashInput.nodeValue
    $multiHashInput.value = ''
    if(!hash) {
        onError('Must provide a destination hash')
    } else if(isFileInList(hash)) {
        onSuccess('File already exists in this workspace')
    }

    FILES.push(hash)
    try {
        const files = await node.files.get(hash)
    } catch(err) {
        onError('Error fetching files')
    }
    files.forEach((file) => {
        if(file.content) {
            appendFile(file.name, hash, file.size. file.content)
            onSuccess(`${file.name} added successfully`)
        }
    })
}

function onSend(event) {
    //handle sending message
}

function connectToPeer(event) {
    const multiAddr = $multiHashInput.value
    if(!multiAddr) {
        onError('No hash was provided')
    }

    try {
        node.swarm.connect(multiAddr)
    } catch(err) {
        onError('Error connecting to peers')
    }
}

async function refreshPeerList() {
    try {
        const peers = await node.swarm.peers()
        const peersAsHtml = peers.reverse()
        .map((peer) => {
            if(peer.addr) {
                const addr = peer.addr.toString()
                if(addr.indexOf('ipfs') >= 0) {
                    return addr
                } else {
                    return addr + peer.peer.id.toB58String()
                }
            }
        })
        /*.map((addr) => {
            // return html element here
            return `<tr><td>${addr}</td></tr>`
        }).join('')
        $peersList.innerHTML = peersAsHtml*/
    } catch(err) {
        onError(err)
    }

}

function onSuccess(msg) {
    // put message somewhere
    $log.innerHTML = msg
}

function onError(err) {
    let msg = 'Error, check console for details'
    console.log(err)
}

window.onerror = onError

const states = {
    ready: () => {
        /* to show the addresses of peers
        const addressHtml = info.addresses.map((addresses) => {
            // html of addresses
        }).join('')
        $peerAddresses.innerHTML = addressesHtml*/
        $ipfsID.innerText = info.id
    }
}

function updateView(state) {
    if(states[state] !== undefined) {
        states[state]()
    } else {
        throw new Error("Could not find state", state)
    }
}

const startApplication = () => {
    // set event listeners here
    $sendButton.addEventListener('click', onSend)
    $connectButton.addEventListener('click', connectToPeer)
    start()
}

startApplication()
