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
    MainPage,
    ConsoleHeaderButton
} from './modules/MainPage'
import { 
    ConsoleScreen,
    WaitingAnimation 
} from './modules/ConsoleScreen'
import { LoadingScreen } from './modules/LoadingScreen'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faPencilAlt,
    faTerminal,
    faChevronUp,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons'

library.add(faPencilAlt)
library.add(faTerminal)
library.add(faChevronUp)
library.add(faChevronDown)

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
        ipfsGetError: false,
        web3InvalidNetwork: false,
        ipfsIsOnline: false,
        web3Online: false,
        accounts: [],
        claimableTokens: 0,
        selectedAccountIndex: 0,
        balance: 0,
        blocksTilClaim: 0,
        messageHistory: [],
        currentRoom: 0,
        tokensPerMessage: 0,
        DailyTokensNo: 0,
        latestBlockNo: 0,
        backendLog: [],
        loadingRoom: { status: false, index: -1 },
        latestHash: "",
        loggedIn: false,
        lastMessage: null
    }

    constructor(props) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.claimTokens = this.claimMessageTokens.bind(this);
        this.addRoom = this.addRoom.bind(this);
        /*Storing this.rooms in backend for each user would allow users to have their own saved favourite rooms
            -Rooms also probably should be updated to using unique ID's on both front and backend
        */
        //this.rooms = ["BlockNet", "Programming", "Gaming", "Random"];   //might be better to make each an object and store its unique id with it
        this.handleLogin = this.handleLogin.bind(this);
        this.manageRooms = this.manageRooms.bind(this);
        this.manageWhitelist = this.manageWhitelist.bind(this);
        //this.rooms = new Map([[0, "Block Net"], [1, "Programming"], [2, "Gaming"], [3, "Random"]]);
        //this.roomList = this.roomMapToArray(); 
        this.roomList = [];
    }   

    roomMapToArray() {
        let roomList = [];
        this.rooms.forEach(function(value, key, map) {
            roomList.push(`${key}`);
        })
        console.log(roomList[0]);
        return roomList;
    }

    /**
     * Rearrange the room storage variable which maps rooms to front-end components in order to rearrange their order of appearance
     * 
     * 
     */
    manageRooms(action, index) {
        console.log("ARRANGE ROOMS CALLED");
        if (action === "moveUp") {
            this.moveRoomUp(index);
            return;
        } 
        if (action === "moveDown") {
            this.moveRoomDown(index);
        }
        if (action == "delete") {
            this.deleteRoom(index);
        }
    }

    /**
     * Helper function for manageRooms to move rooms up array
     * 
     * @param {integer} index
     *      index of room to be moved
     * 
     */
    moveRoomUp(index) {
        if (index > 0) {
            let higherRoom = this.roomList[index-1];
            this.roomList[index-1] = this.roomList[index];
            this.roomList[index] = higherRoom;
        }
    }

    /**
     * Helper function for manageRooms to move rooms down array
     * 
     * @param {integer} index
     *      index of room to be moved
     * 
     */
    moveRoomDown(index) {
        if (index < this.roomList.length-1) {
            let lowerRoom = this.roomList[index+1];
            this.roomList[index+1] = this.roomList[index];
            this.roomList[index] = lowerRoom;
        }
    }

    /**
     * Helper function for manageRooms to delete rooms from room array
     * 
     * @param {integer} index
     *      index of room to be deleted
     * 
     */
    deleteRoom(index) {
        if ((index > -1) && (index < this.roomList.length)) {
            console.log("index: " + index + "|| length: " + this.roomList.length);
            //this.rooms.splice(index, ((this.rooms.length)-(index)), this.rooms.slice(index+1, this.rooms.length));
            this.roomList.splice(index, 1);
        }
    }
/*
    0 1 2 3
    index = 1
    length = 4
    index+1 - length = amount to replace
    index+1 -> length
    */

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

    /**
     * handles login for user
     * assumes some form of checking is done before this is called
     * 
     * @param {string} mode either "metamask", "mnemonic" or anything
     * @param {string} mnemonic optional parameter if mode === "mnemonic", used for openning the wallet
     */
    handleLogin = async (mode, mnemonic) => {
        try {
            console.log("mode: " + mode + " || mnemonic: " + mnemonic);
            const web3 = await getWeb3(mode, mnemonic)
            console.log("web3 loaded")
            const accounts = await web3.eth.getAccounts()    
            this.setState({ loggedIn: true });
            console.log("using address", contractAddress)
            this.updateLog("w{Web3||https://github.com/ethereum/web3.js}w Loaded | using w{contract||https://en.wikipedia.org/wiki/Smart_contract}w address: " + contractAddress)
            const contract = new web3.eth.Contract(abi, contractAddress)
            contract.setProvider(web3.currentProvider)
            const networkType = await web3.eth.net.getNetworkType()
            const web3InvalidNetwork = networkType !== 'rinkeby'
            this.setState({ web3, accounts, contract, web3InvalidNetwork }, this.syncData)
            if (accounts[this.state.selectedAccountIndex]) {
                this.setState({ web3Online: true })
                this.updateLog("Successfully connected to client's w{MetaMask||https://github.com/MetaMask/metamask-extension}w w{wallet||https://en.wikipedia.org/wiki/Cryptocurrency_wallet}w")
            }
            await this.populateRoomList();
            console.log(this.roomList);
        } catch (error) {
            alert('Failed to initialize connection, check console for specifics')
            this.updateLog("Failed to initialize connection")
            console.log(error)
        }
    }

    // Connection handler for web3
    componentDidMount = async () => {
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
        const { accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        var messageHistory = [];
        // Read the latest message (hash)
        var latestHash = await contract.methods.getHash(this.state.currentRoom).call({ from: from })
        if (latestHash[1]) {
            if (latestHash[0] === undefined || latestHash[0] === '' || latestHash[0] === null) {
                console.log("Invalid Hash");
            } else {
                this.setState({ latestHash: latestHash[0] })
                //console.log('attempting to read file at: ', latestHash)
                try {
                    const fileBuffer = await ipfs.files.cat(latestHash[0])
                    var messageHistory = JSON.parse(fileBuffer)
                    //console.log('read file contents:\n', messageHistory)
                } catch (err) {
                    console.error(err)
                }
            }
        } else {
            console.log("Unable to retrieve hash: ", latestHash[0]);
        }
        this.setState({ messageHistory })
    }

    // get info from deployed decentralised application (dapp) and sync with session state
    syncData = async () => {
        if(this.state.loggedIn === false || this.state.web3Online === false) {
            console.log("waiting for login")
            return; // wait until user has logged in
        }

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
                this.setLogFinished()   //if user spams a room button before one is finished, the first doesn't get set to finished.
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
        this.setState({ lastMessage: message })
        console.log('attempting to send from:', from, '\nmessage:', message)
        this.updateLog("Attempting to send message: [" + message.message + "] from address: [" + from + "] to room: [" + this.state.currentRoom + "]");
        try {
            if (this.state.ipfsHash) {
                var tempHistory = messageHistory.slice(0)
                tempHistory.push(message)


                /*fs.writeFileSync('/Rooms/BlockNet.json', JSON.stringify(messageHistory, null, 4), (err) => {
                    if (err) {
                        console.error(err)
                        return;
                    }
                    console.log('File Created')
                })*/

                // Create a new file on ipfs with new message
                const filesAdded = await ipfs.files.add({
                    path: `BlockNetRoom${this.state.currentRoom}.json`,
                    content: Buffer.from(JSON.stringify(tempHistory, null, 4))
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
                this.setState({ lastMessage: null })
            }
            this.syncData()
            //this.addressInput.value = ''
            //this.messageInput.value = ''
        } catch (err) {
            alert('transaction rejected, console for details')
            console.log(err)
            this.setLogFinished()
            this.updateLog("An error occurred: message has failed to be added to the room's message list", 1)
            this.setState({ lastMessage: null })
        }
    }

    // TODO: Implement and finish
    createRoom = async (roomName, is_private, dailyTokens = 0, tokensPerUpdate = 0, updateRate = 0, tokensPerMessage = 0) => {
        const { accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        try {
            contract.once("RoomMade", {
                filter: { creator: from }
            }, function (error, event) {
                if (!error) {
                    var tempid = parseInt(event.returnValues.roomID);
                    if (!isNaN(tempid)) {
                        this.roomList.push({ id: tempid, name: roomName });
                        console.log(this.roomList);
                        //this.setRoom(this.roomList.length - 1);
                        //this.roomList = this.roomMapToArray();
                        //this.sendMessage("Created Room " + tempid);
                    }
                } else {
                    console.error(error);
                }
            }.bind(this));
            await contract.methods.newRoom(roomName, is_private, dailyTokens, tokensPerUpdate, updateRate, tokensPerMessage)
                .send({ gas: '2352262', from })
            console.log("New Room ", roomName, " successfully created.")
        } catch (err) {
            console.error(err)
        }
    }

    populateRoomList = async (data) => {
        await this.joinRoom({ roomID: 0 });
        await this.joinRoom({ roomID: 1 });
        await this.joinRoom({ roomID: 2 });
    }

    joinRoom = async (data) => {
        var roomID = parseInt(data.roomID);
        const { contract, accounts, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        try {
            var roomName = await contract.methods.getRoomName(roomID).call({ from: from });
            if (roomName[1]) {
                console.log("Joining room ", roomID, " : ", roomName[0])
                this.roomList.push({ id: roomID, name: roomName[0] });
                console.log(this.roomList);
                //this.setRoom(this.roomList.length - 1);
            } else {
                console.log("Unable to Join Room: ", roomName[0]);
            }
        } catch (err) {
            console.error(err);
        }
    }

    /* Set currently selected room to 'room'
     * 
     * @param int room -> name of room to set as selected
     */
    setRoom = async (room) => {
        var currentRoom = room
        this.setState({ currentRoom }) 
        this.state.loadingRoom.status = true
        this.state.loadingRoom.index = this.updateLog("Room set to " + this.roomList[room] + ". Loading messages", 0, true)
    }

    manageWhitelist(room, user, index) {
        if (user === -1 && index == -1) {
            //get whitelist
            return this.getWhitelist(room);
        } else if (index == -1) {
            //add to whitelist
            this.addToWhitelist(room, user);
        } else {
            //remove from whitelist
            this.removeFromWhitelist(room, user, index);
        }
    }

    getPrivacy = async (room) => {
        const { contract, accounts, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        try {
            var privacy = await contract.methods.checkPrivacy(room).call({ from: from });
            if (privacy[1]) {
                console.log("Privacy of room: " + room + " is: " + privacy[0]);
                return privacy[0];
            } else {
                console.log("Room doesn't exist.");
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    }


    getWhitelist = async (room) => {
        const { contract, accounts, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        try {
            var whitelist = await contract.methods.getWhitelist(room).call({ from: from });
            if (whitelist[1]) {
                console.log(whitelist[0]);
                return whitelist[0];
            } else {
                console.log("Unable to Retrieve Whitelist");
            }
        } catch (err) {
            console.error(err);
        }
    }

    addToWhitelist = async (room, user) => {
        const { contract, accounts, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        try {
            await contract.methods.addToWhitelist(room, user)
                .send({ gas: '2352262', from })
        } catch (err) {
            console.error(err);
        }
    }

    removeFromWhitelist = async (room, user, index) => {
        const { contract, accounts, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        try {
            await contract.methods.removeFromWhitelist(room, user, index)
                .send({ gas: '2352262', from })
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const {
            ipfsGetError,
            ipfsIsOnline,
            web3Online,
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
        if (!loggedIn) {
            return (
                <div className="purgatory-content">
                    <LoadingScreen 
                        handleLogin={this.handleLogin}/>
                </div>
            )
        }

        if ((accounts.length <= 0 && !web3InvalidNetwork && !ipfsGetError) ||
                !ipfsHash || !ipfsIsOnline || !web3Online) {
            console.log('Loading components')
            return (
                <div className="purgatory-content">
                    <div className="warning-message">
                        <span>loading components</span>
                        <WaitingAnimation />    
                    </div>
                </div>
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
                    rooms={this.roomList}
                    roomList={this.roomList}
                    manageRooms={this.manageRooms}
                    manageWhitelist={this.manageWhitelist}
                    claimTokens={this.claimTokens}
                    state={this.state}
                    sendMessage={this.sendMessage}
                    setRoom={this.setRoom}
                    messageHistory={this.state.messageHistory}
                    currentState={this.state}
                    consoleActive={this.props.consoleActive}
                    addRoom={this.addRoom}
                    joinRoom={this.joinRoom}
                    backendLog={this.state.backendLog}
                    lastMessage={this.state.lastMessage}
                    swarmAddr={this.refreshPeerList()}
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
            this.createRoom(data.roomName, data.is_private/*, data.messageCost*/);
            //this.roomList = this.roomMapToArray();
            //console.log(this.roomList);
    }

    }

    class Frontend extends Component {
        constructor(props) {
            super(props);
            this.switchConsole = this.switchConsole.bind(this);
            this.state={consoleActive: false}
        }

        onTildePress(e) {
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
                            roomList={this.props.roomList}
                            manageRooms={this.props.manageRooms}
                            manageWhitelist={this.props.manageWhitelist}
                            sendMessage={this.props.sendMessage}
                            messageHistory={this.props.state.messageHistory}
                            setRoom={this.props.setRoom}
                            currentState={this.props.state}
                            addRoom={this.props.addRoom}
                            lastMessage={this.props.lastMessage}
                            joinRoom={this.props.joinRoom}
                        />
                        <ConsoleScreen 
                            swarmAddr={() => this.props.swarmAddr()}
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
