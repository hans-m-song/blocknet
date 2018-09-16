import React, {Component} from 'react'

import abi from './compiled/abi.json'
import getWeb3 from './utils/getWeb3'
import getIPFS from './utils/getIPFS'
import {contractAddress} from './utils/getAddress'

let ipfs
//let Buffer

class App extends Component {
    // global vars for the current session state
    state = {
        ipfsHash: null,
        ipfsAddr: null,
        web3GetError: false,
        ipfsGetError: false,
        web3InvalidNetwork: false,
        accounts: [],
        claimableTokens: 0,
        selectedAccountIndex: 0,
        balance: 0,
        blocksTilClaim: 0,
        messageHistory: [],
        tokensPerMessage: 0,
        DailyTokensNo: 0,
        latestBlockNo: 0
    }

    // Connection handler for web3
    componentDidMount = async () => {
        try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()
            console.log("using address", contractAddress)
            const contract = new web3.eth.Contract(abi, contractAddress)
            contract.setProvider(web3.currentProvider)
            const networkType = await web3.eth.net.getNetworkType()
            const web3InvalidNetwork = networkType !== 'rinkeby'
            this.setState({web3, accounts, contract, web3InvalidNetwork}, this.syncDappData)
            this.interval = setInterval(() => this.syncData(), 1000)
        } catch(error) {
            alert('Failed to initialize connection, check console for specifics')
            this.setState({web3GetError: true})
            console.log(error)
        }
        
        try {
            ipfs = await getIPFS()
            //Buffer = ipfs.types.Buffer
            ipfs.once('start', async () => {
                const version = await ipfs.version()
                const info = await ipfs.id()
                const ipfsHash = info.id
                console.log("IPFS version", version.version, "initalized\nat:", ipfsHash)
                // in case you're getting websock 502, its a known issue: https://github.com/ipfs/js-ipfs/issues/941
                //setInterval(refreshPeerList, 1000)
                //setInterval(sendFileList, 10000)
                /*const filesAdded = await ipfs.files.add({
                    path: 'hello',
                    content: Buffer.from('hello ipfs')
                })
                console.log('added file:', filesAdded[0].path, filesAdded[0].hash)
            
                const fileBuffer = await ipfs.files.cat(filesAdded[0].hash)
                console.log('added file contents:', fileBuffer.toString())*/
            })
            
        } catch(error) {
            alert('Failed to initalize IPFS, check console for specifics')
            this.setState({ipfsGetError: true})
            console.log(error)
        }
    }

    // exit
    componentWillUnmount = () => {
        clearInterval(this.interval)
        ipfs.stop()
    }

    async refreshPeerList() {
        var peersAsHtml
        try {
            const peers = await ipfs.swarm.peers()
            peersAsHtml = peers.reverse()
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
                .map((addr) => {
                    return `<li>${addr}</li>`
                }).join('')
        } catch(err) {
            console.log(err)
        }
        return peersAsHtml
    }

    // get info from deployed dapp and sync with session state
    syncData = async () => {
        const {web3, accounts, contract, selectedAccountIndex} = this.state
        const from = accounts[selectedAccountIndex]

        const balance = await contract.methods
            .balanceOf(from).call()
        const messageHistory = await contract.methods
            .getMessageHistory(from).call()
        const blocksTilClaim = await contract.methods
            .getBlocksTillClaimable(from).call
        const claimableTokens = await contract.methods
            .getClaimableTokens(from).call()
        const blocksPerClaim = await contract.methods
            .getBlocksPerClaim().call()
        const tokensPerMessage = await contract.methods
            .getTokensPerMessage().call()
        const dailyTokensNo = await contract.methods
            .getDailyTokensNo().call
        const latestBlockNo = await web3.eth.getBlockNumber()

        const ipfsInfo = await ipfs.id()
        const ipfsHash = ipfsInfo.id
        const ipfsAddr = ipfsInfo.addresses
        const peers = await this.refreshPeerList()
        const ipfsPeers = {__html: peers}

        this.setState({
            ipfsHash,
            ipfsAddr,
            ipfsPeers,
            balance,
            messageHistory,
            blocksTilClaim,
            claimableTokens,
            blocksPerClaim,
            tokensPerMessage,
            dailyTokensNo,
            latestBlockNo
        })
    }

    // TODO determine gas cost
    // get tokens to use to send messages
    claimMessageTokens = () => {
        const {accounts, contract, selectedAccountIndex} = this.state
        const from = accounts[selectedAccountIndex]

        contract.methods.claim().send({gas: '2352262', from})
            .then((x) => {this.syncDappData()})
    }

    // send message
    sendMessage = () => {
        const {accounts, contract, selectedAccountIndex} = this.state
        const from = accounts[selectedAccountIndex]
        var to = this.addressInput.value
        var message = this.messageInput.value
        console.log('attempting to send from:', from, '\nto', to, '\nmessage:', message)

        contract.methods.sendMessage().send({gas: '2352262', from})
            .then((x) => {this.syncDappData()})
    }

    render () {
        const {
            web3GetError, 
            ipfsGetError,
            ipfsHash,
            ipfsAddr,
            ipfsPeers,
            web3InvalidNetwork, 
            claimableTokens,
            latestBlockNo,
            tokensPerMessage,
            dailyTokensNo,
            blocksPerClaim,
            balance,
            messageHistory,
            blocksTilClaim,
            accounts,
            selectedAccountIndex
        } = this.state
        const address = accounts[selectedAccountIndex]

        if(accounts.length <= 0 && !web3GetError && !web3InvalidNetwork && !ipfsGetError && !ipfsHash) {
            console.log('loading components')
            return (
                <p>loading components</p>
            )
        }

        if(web3GetError) {
            console.log('unable to load web3, make sure metamask is installed')
            return (
                <p>unable to load web3, make sure metamask is installed</p>
            )
        }

        if(ipfsGetError) {
            console.log('unable to load ipfs, i dont know how to fix this yet')
            return (
                <p>unable to load ipfs, i dont know how to fix this yet</p>
            )
        }

        if(web3InvalidNetwork) {
            console.log('please change to the rinkeby network and refresh')
            return (
                <p>please change to the rinkeby network and refresh</p>
            )
        }

        return (
            <div className="App">
                <header className="App-header">
                    <h1>eth/ipfs example</h1>
                </header>
                <p>account address: {address}</p>
                <p>ipfs hash: {ipfsHash}</p>
                <p>ipfs swarm address: {ipfsAddr}</p>
                <p>claimableTokens: {claimableTokens}</p>
                <p>latestBlockNo: {latestBlockNo}</p>
                <p>tokensPerMessage: {tokensPerMessage}</p>
                <p>dailyTokensNo: {dailyTokensNo}</p>
                <p>blocksPerClaim: {blocksPerClaim}</p>
                <p>balance: {balance}</p>
                <p>messageHistory: {messageHistory[messageHistory.length - 1]}</p>
                <p>blocksTilClaim: {blocksTilClaim}</p>
                <button onClick={this.claimMessageTokens}>Claim Tokens</button>  
                <br /><br />
                <p>address: </p>
                <input latype="text" ref={(input) => this.addressInput = input}/>
                <br /><br />
                <p>message: </p>
                <input type="text" ref={(input) => this.messageInput = input}/>
                <button onClick={this.sendMessage}>Send</button>

                <p>ipfs peerlist: </p>
                <ul dangerouslySetInnerHTML={ipfsPeers}></ul>
            </div>
        )
    }
}

export default App
