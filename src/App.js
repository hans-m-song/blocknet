import React, { Component } from 'react'

// Imports the backend components
import abi from './compiled/abi.json'
import getTime from './utils/getTime'
import getWeb3 from './utils/getWeb3'
import getIPFS from './utils/getIPFS'
import { contractAddress } from './utils/getAddress'

// Imports the frontend components
import './App.css'
import {
    Header,
    MainPage
} from './modules/MainPage'
import { ConsoleScreen } from './modules/ConsoleScreen'
import { LoadingScreen } from './modules/LoadingScreen'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus)

/* Unused components
LeftPanel,
SectionButton,
RightPanel,
Content,
RoomScreen,
MessageContainer,
Message,
Menu,
MessageHeader,
MessageContent,
ChatBox,
PrivateChatsScreen,
HistoryScreen,
SettingsScreen,
InvitationScreen,
Console
*/

class App extends Component {
    render() {
        // current implementation of the frontend
        return (
            <div className="App">
                <Backend />
            </div>
        )
    }
}

let ipfs

class Backend extends Component {
    // global vars for the current session state
    state = {
        web3GetError: false,
        ipfsGetError: false,
        web3InvalidNetwork: false,
        ipfsIsOnline: false,
        metamaskOnline: false,
        accounts: [],
        claimableTokens: 0,
        selectedAccountIndex: 0,
        balance: 0,
        blocksTilClaim: 0,
        messageHistory: [],
        currentRoom: "BlockNet",
        tokensPerMessage: 0,
        DailyTokensNo: 0,
        latestBlockNo: 0,
        backendLog: [],
        loadingRoom: { status: false, index: -1 },
        latestHash: "",
        loggedIn: false
    }

    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.claimTokens = this.claimMessageTokens.bind(this);
        this.addRoom = this.addRoom.bind(this);
        /*Storing this.rooms in backend for each user would allow users to have their own saved favourite rooms
            -Rooms also probably should be updated to using unique ID's on both front and backend
        */
        this.rooms = ["BlockNet", "Programming", "Gaming", "Random"];
    }

    /**
     * Create a log entry that is rendered in the console. Log entry comprises the time that this function is called, the message provided as parameter, indent level, and whether it is waiting to be finished or not.
     * 
     * @param msg 
     *      {string} Message content of log
     * @param tab
     *      {integer} Indent level; 4 spaces per indent.
     * @param waiting
     *      {boolean} Whether or not the message is referring to an action that will eventually complete (i.e. is waiting)
     *          >To set complete: call setLogFinished(index) where index is the value returned by this function. 
     * 
     * @return index
     *      {int} index of created message in backendLog array 
     */
    updateLog(msg, tab = 0, waiting = false) {
        let log = { 
            time: new Date().toLocaleTimeString('en-US', { hour12: false }), 
            message: msg,
            indents: tab
        };
        waiting ? log.waiting=true : log.waiting=false;
        let tempLog = this.state.backendLog;
        let index = tempLog.push(log)-1;
        this.setState({ backendLog: tempLog });
        return index;
    }
  
    /**
     * Set a message in backendLog specified by index to not be waiting (finished). Default sets ALL logs to finished.
     * 
     * @param index
     *      {int} Index of log message that is to be set to be not waiting 
     */
    setLogFinished(index = -1) {
        if (index === -1) {
            let tempLog = this.state.backendLog;
            tempLog.forEach(function(log) {
                log.waiting = false;
            });
        } else {
            this.state.backendLog[index].waiting = false;
        }
    }

    // Connection handler for web3
    componentDidMount = async () => {
        try {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts()    
            console.log("using address", contractAddress)
            this.updateLog("w{Web3||https://github.com/ethereum/web3.js}w Loaded | using w{contract||https://en.wikipedia.org/wiki/Smart_contract}w address: " + contractAddress)
            const contract = new web3.eth.Contract(abi, contractAddress)
            contract.setProvider(web3.currentProvider)
            const networkType = await web3.eth.net.getNetworkType()
            const web3InvalidNetwork = networkType !== 'rinkeby'
            this.setState({ web3, accounts, contract, web3InvalidNetwork }, this.syncData)
            if (accounts[this.state.selectedAccountIndex]) {
                this.setState({ metamaskOnline: true })
                this.updateLog("Successfully connected to client's w{MetaMask||https://github.com/MetaMask/metamask-extension}w w{wallet||https://en.wikipedia.org/wiki/Cryptocurrency_wallet}w")
            }
        } catch (error) {
            alert('Failed to initialize connection, check console for specifics')
            this.updateLog("Failed to initialize connection")
            this.setState({ web3GetError: true })
            console.log(error)
        }

        try {
            ipfs = await getIPFS()
            //Buffer = ipfs.types.Buffer

            ipfs.on('ready', async () => {
                this.setState({ ipfsIsOnline: true })
                console.log("IPFS initalized")
                this.updateLog("w{IPFS||https://en.wikipedia.org/wiki/InterPlanetary_File_System}w has been connected to and is initialized")
            })

            ipfs.once('start', async () => {
                const version = await ipfs.version()
                const info = await ipfs.id()
                const ipfsHash = info.id
                console.log("IPFS version", version.version, "started\nat:", ipfsHash)
                this.updateLog("Using IPFS version: " + version.version + ", started at: " + ipfsHash)
                // in case you're getting websock 502, its a known issue: https://github.com/ipfs/js-ipfs/issues/941
                // once everything has been initialized
                this.interval = setInterval(() => this.syncData(), 1000)
                this.updateLog("IPFS data synchronization interval set to 1000 ms")
            })

        } catch (error) {
            alert('Failed to initalize IPFS, check console for specifics')
            this.setState({ ipfsGetError: true })
            console.log(error)
            this.updateLog("Failure to initialize IPFS")
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
                    if (peer.addr) {
                        const addr = peer.addr.toString()
                        if (addr.indexOf('ipfs') >= 0) {
                            return addr
                        }
                        return addr + peer.peer.id.toB58String()
                    }
                    return null
                })
                .map((addr) => {
                    return `<li>${addr}</li>`
                }).join('')
        } catch (err) {
            console.log(err)
        }
        return peersAsHtml
    }

    /*
     * Reads the hash of the selected room and retrieve the messages stored
     * in the file at that location to var hashContents
     */
    readHash = async () => {
        const { contract } = this.state
        // Read the latest message (hash)
        var latestHash = await contract.methods.getHash(this.state.currentRoom).call()
        this.setState({ latestHash: latestHash })
        //console.log('attempting to read file at: ', latestHash)
        var messageHistory = []
        try {
            const fileBuffer = await ipfs.files.cat(latestHash)
            var messageHistory = JSON.parse(fileBuffer)
            //console.log('read file contents:\n', messageHistory)
        } catch (err) {
            console.error(err)
        }
        this.setState({ messageHistory })
    }

    // get info from deployed decentralised application (dapp) and sync with session state
    syncData = async () => {
        const { web3, accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]

        const balance = await contract.methods
            .balanceOf(from).call()
        //const blockHistory = await contract.methods
        //  .getMessageHistory(from).call()
        const blocksTilClaim = await contract.methods
            .getBlocksTillClaimable(from).call()
        const claimableTokens = await contract.methods
            .getClaimableTokens(from).call()
        const blocksPerClaim = await contract.methods
            .getBlocksPerClaim().call()
        const tokensPerMessage = await contract.methods
            .getTokensPerMessage().call()
        const dailyTokensNo = await contract.methods
            .getDailyTokensNo().call()
        const latestBlockNo = await web3.eth.getBlockNumber()

        const ipfsInfo = await ipfs.id()
        var ipfsHash
        if (ipfsInfo) {
            ipfsHash = ipfsInfo.id
            if (this.state.loadingRoom.status === true) {
                this.setLogFinished(this.state.loadingRoom.index)   //if user spams a room button before one is finished, the first doesn't get set to finished.
                this.updateLog("Room messages successfully loaded", 1)
                this.state.loadingRoom = { status: false, index: -1 }
            }   
        }
        const ipfsAddr = ipfsInfo.addresses
        var ipfsPeers = { __html: '' }
        if (this.state.ipfsIsOnline) {
            ipfsPeers = { __html: await this.refreshPeerList() }
    }

    var latestMessage = await this.readHash()

    //console.log(latestMessage)

    this.setState({
        ipfsHash,
        ipfsAddr,
        ipfsPeers,
        balance,
        //messageHistory,
        blocksTilClaim,
        claimableTokens,
        blocksPerClaim,
        tokensPerMessage,
        dailyTokensNo,
        latestBlockNo
        //latestMessage
    })
    }

    // TODO determine gas cost
    // get tokens to use to send messages
    claimMessageTokens = () => {
        this.updateLog("Sending request to contract to claim tokens")
        const { accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]

        contract.methods.claim().send({ gas: '2352262', from })
            .then((x) => { this.syncData() })
        this.updateLog("Tokens successfully claimed")
    }

    /*
     * Function that sends a message
     * Message is read from the message field and appended to the current contents
     * of the selected rooms (unimplented) hash file
     * This is then saved as a new file to ipfs and the hash location
     * of this new file is added to the contract
     * @param msg -> message to be sent
     */
    sendMessage = async (msg) => {
        // Retrieve necessary information from the local saved state
        const { accounts, contract, selectedAccountIndex, messageHistory } = this.state
        const from = accounts[selectedAccountIndex]
        //const to = this.addressInput.value
        //console.log(this.state.hashContents)

        // Add message to current room messages
        var message = {user: from, date: getTime(), message: msg}
        console.log('attempting to send from:', from, '\nmessage:', message)
        this.updateLog("Attempting to send message: [" + message.message + "] from address: [" + from + "]");
        try {
            if (this.state.ipfsHash) {
                messageHistory.push(message)

                /*fs.writeFileSync('/Rooms/BlockNet.json', JSON.stringify(messageHistory, null, 4), (err) => {
                    if (err) {
                        console.error(err)
                        return;
                    }
                    console.log('File Created')
                })*/

                // Create a new file on ipfs with new message
                const filesAdded = await ipfs.files.add({
                    path: `${this.state.currentRoom}.json`,
                    content: Buffer.from(JSON.stringify(messageHistory, null, 4))
                })
                this.updateLog("Successfully added new message file: [" + filesAdded[0].hash + "] to room: [" + this.state.latestHash + "]", 1)
                let waitingLogMessage = this.updateLog("Sending new hash through contract and awaiting response from Ethereum network", 1, true)
                // Send the new hash through the contract
                console.log('added file:', filesAdded[0].path, filesAdded[0].hash)
                await contract.methods.sendHash(this.state.currentRoom, filesAdded[0].hash)
                    .send({ gas: '2352262', from })
                console.log('Hash ')
                this.setLogFinished(waitingLogMessage)
                this.updateLog("Success: IPFS now points to updated message", 1)
            }
            this.syncData()
            //this.addressInput.value = ''
            //this.messageInput.value = ''
        } catch (err) {
            alert('transaction rejected, console for details')
            console.log(err)
            this.setLogFinished()
            this.updateLog("An error occurred: message has failed to be added to the room's message list", 1)
        }
    }

    setRoom = async (room) => {
        this.state.currentRoom = room
        this.state.loadingRoom.status = true
        this.state.loadingRoom.index = this.updateLog("Room set to " + room + ". Loading messages", 0, true)

        //this.updateLog("Room set to [" + room + "] | Room hash: [" + this.state.latestHash + "]")
        /*Would be good to display an expandable list of the messages comprising the message history on load 
            seems to require:
                -getting the message list here to print when first loading room, and;
                -nice formatting to allow for expanding (because message history could be quite long)
        */
    }

    render() {
        const {
            web3GetError,
            ipfsGetError,
            ipfsIsOnline,
            metamaskOnline,
            ipfsHash,
            web3InvalidNetwork,
            accounts,
            balance,
            messageHistory,
            selectedAccountIndex,
            ipfsAddr,
            ipfsPeers,
            claimableTokens,
            latestBlockNo,
            tokensPerMessage,
            dailyTokensNo,
            blocksPerClaim,
            blocksTilClaim,
            latestMessage,
            hashContents,
            loggedIn
        } = this.state
        const address = accounts[selectedAccountIndex]

        /*Render login screen*/
        //if you want to see the log in screen make the below if statement check for !loggenIn
        if (loggedIn) {
            return (
                <div className="purgatory-content">
                    <LoadingScreen />
                </div>
            )
        }

        if ((accounts.length <= 0 && !web3GetError && !web3InvalidNetwork && !ipfsGetError) ||
                !ipfsHash || !ipfsIsOnline || !metamaskOnline) {
            console.log('Loading components')
            return (
                <div className="purgatory-content">
                    <p className="warning-message">loading components</p>
                    
                </div>
            )
        }

        if (web3GetError) {
            console.log('unable to load web3, make sure metamask is installed')
            return (
                <p className="warning-message">unable to load web3, make sure metamask is installed</p>
            )
        }

        if (ipfsGetError) {
            console.log('unable to load ipfs, i dont know how to fix this yet')
            return (
                <p className="warning-message">unable to load ipfs, i dont know how to fix this yet</p>
            )
        }

        if (web3InvalidNetwork) {
            console.log('please change to the rinkeby network and refresh')
            return (
                <p className="warning-message">please change to the rinkeby network and refresh</p>
            )
        }
            /*
            return (
              <div class="Backend">
                <header className="Backend-header">
                  <h1>eth/ipfs example</h1>
                </header>
                <p>account address: {address}</p>
                <p>local ipfs hash: {ipfsHash}</p>
                <p>ipfs swarm address: {ipfsAddr}</p>
                <p>claimableTokens: {claimableTokens}</p>
                <p>latestBlockNo: {latestBlockNo}</p>
                <p>tokensPerMessage: {tokensPerMessage}</p>
                <p>dailyTokensNo: {dailyTokensNo}</p>
                <p>blocksPerClaim: {blocksPerClaim}</p>
                <p>balance: {balance}</p>
                <p>messageHistory: {messageHistory[messageHistory.length - 1]}</p>
                <p>blocksTilClaim: {blocksTilClaim}</p>
                <p>latestMessage: {latestMessage}</p>
                <button onClick={this.readHash}>Read from Hash</button>
                <p>Contents from Hash: {hashContents}</p>
                <button onClick={this.claimMessageTokens}>Claim Tokens</button>
                <br /><br />
                <p>address: </p>
                <input latype="text" ref={(input) => this.addressInput = input} />
                <br /><br />
                <p>message: </p>
                <input type="text" ref={(input) => this.messageInput = input} />
                <button onClick={this.sendMessage}>Send</button>
        
                <p>ipfs peerlist: </p>
                <ul dangerouslySetInnerHTML={ipfsPeers}></ul>
              </div>
            )
        */

        return (
            <div className="front-app">
                <Frontend
                    rooms={this.rooms}
                    claimTokens={this.claimTokens}
                    state={this.state}
                    sendMessage={this.sendMessage}
                    setRoom={this.setRoom}
                    messageHistory={this.state.messageHistory}
                    currentState={this.state}
                    consoleActive={this.props.consoleActive}
                    addRoom={this.addRoom}
                    backendLog={this.state.backendLog}
                />
            </div>
            );
        }

        /**
         * Add a room to the backend's room registry
         */
        addRoom(data) {
            //console.log(data);
            //this.rooms.push(data);
            this.rooms.push(data.roomName);
            console.log(this.rooms);
        }
    }

    class Frontend extends Component {
        constructor(props) {
            super(props);
            this.switchConsole = this.switchConsole.bind(this);
            this.state={consoleActive: false}
        }

        onTildePress(e) {
            console.log("key pressed >" + e.keyCode);
            if (e.keyCode === 192) {
                e.preventDefault();
                this.switchConsole();
            }
        }
        
        /**
         * This sets whether the console is showing or not
         */
        switchConsole() {
            this.state.consoleActive ? this.setState({consoleActive: false}) 
                : this.setState({consoleActive: true})
        }

        render() {
            return (
                <div className="frontend" tabIndex="0" onKeyDown={(e) => this.onTildePress(e)}>
                    <div className="content-page">
                        <Header 
                            claimTokens={this.props.claimTokens} 
                            state={this.props.state} 
                            consoleClick={this.switchConsole}
                            consoleActive={this.state.consoleActive}
                        />
                        <MainPage
                            rooms={this.props.rooms}
                            sendMessage={this.props.sendMessage}
                            messageHistory={this.props.state.messageHistory}
                            setRoom={this.props.setRoom}
                            currentState={this.props.state}
                            addRoom={this.props.addRoom}
                        />
                        <ConsoleScreen 
                            currentState={this.props.state}
                            consoleActive={this.state.consoleActive}
                            backendLog={this.props.backendLog}
                        />
                    </div>
                </div>
            );
        }
    }   

    export default App
