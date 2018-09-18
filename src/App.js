import React, {Component} from 'react'

// backend
import abi from './compiled/abi.json'
import getTime from './utils/getTime'
import getWeb3 from './utils/getWeb3'
import getIPFS from './utils/getIPFS'
import {contractAddress} from './utils/getAddress'

// frontend
import './App.css'
import PerfectScrollbar from 'perfect-scrollbar'

let ipfs

class App extends Component {
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
            this.setState({ web3, accounts, contract, web3InvalidNetwork }, this.syncData)
            this.interval = setInterval(() => this.syncData(), 100)
            if (accounts[this.state.selectedAccountIndex]) {
                this.setState({ metamaskOnline: true })
            }
        } catch (error) {
            alert('Failed to initialize connection, check console for specifics')
            this.setState({ web3GetError: true })
            console.log(error)
        }

        try {
            ipfs = await getIPFS()
            //Buffer = ipfs.types.Buffer

            ipfs.on('ready', async () => {
                this.setState({ ipfsIsOnline: true })
                console.log("IPFS initalized")
            })

            ipfs.once('start', async () => {
                const version = await ipfs.version()
                const info = await ipfs.id()
                const ipfsHash = info.id
                console.log("IPFS version", version.version, "started\nat:", ipfsHash)
                // in case you're getting websock 502, its a known issue: https://github.com/ipfs/js-ipfs/issues/941
            })

        } catch (error) {
            alert('Failed to initalize IPFS, check console for specifics')
            this.setState({ ipfsGetError: true })
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

    readHash = async () => {
        const { contract } = this.state
        var latestMessage = await contract.methods.getMessage().call()
        //console.log('attempting to read file at: ', latestMessage)
        try {
            const hashBuffer = await ipfs.files.cat(latestMessage)
            //console.log('read file contents:\n', hashBuffer.toString())
            var hashContents = hashBuffer.toString()

            this.setState({ hashContents })
        } catch (err) {
            this.setState({ hashContents: '' })
        }
    }

    // get info from deployed dapp and sync with session state
    syncData = async () => {
        const { web3, accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]

        const balance = await contract.methods
            .balanceOf(from).call()
        const messageHistory = await contract.methods
            .getMessageHistory(from).call()
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
        }
        const ipfsAddr = ipfsInfo.addresses
        var ipfsPeers = { __html: '' }
        if (this.state.ipfsIsOnline) {
            ipfsPeers = { __html: await this.refreshPeerList() }
        }

        const contractIPFSHash = await contract.methods.getHash().call()

        var latestMessage = await this.readHash()
        if (!latestMessage) {
            latestMessage = ''
        }
        //console.log(latestMessage)

        this.setState({
            ipfsHash,
            contractIPFSHash,
            ipfsAddr,
            ipfsPeers,
            balance,
            messageHistory,
            blocksTilClaim,
            claimableTokens,
            blocksPerClaim,
            tokensPerMessage,
            dailyTokensNo,
            latestBlockNo,
            latestMessage
        })
    }

    // TODO determine gas cost
    // get tokens to use to send messages
    claimMessageTokens = () => {
        const { accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]

        contract.methods.claim().send({ gas: '2352262', from })
            .then((x) => { this.syncData() })
    }

    // send message
    sendMessage = async () => {
        const { accounts, contract, selectedAccountIndex } = this.state
        const from = accounts[selectedAccountIndex]
        const to = this.addressInput.value
        var message = `${getTime()}|${this.messageInput.value}\n`
        console.log(this.state.hashContents)
        if (this.state.hashContents) {
            message = `${message}${this.state.hashContents}`
        }
        console.log('attempting to send from:', from, '\nto', to, '\nmessage:', message)
        try {
            if (this.state.ipfsHash) {
                const filesAdded = await ipfs.files.add({
                    path: 'testipfs',
                    content: Buffer.from(message)
                })
                console.log('added file:', filesAdded[0].path, filesAdded[0].hash)
                await contract.methods.sendMessage(filesAdded[0].hash).send({ gas: '2352262', from })
                console.log('sent hash');
            }
            this.syncData()
            this.addressInput.value = ''
            this.messageInput.value = ''
        } catch (err) {
            alert('transaction rejected, console for details')
            console.log(err)
        }
    }

    render() {
        const {
            web3GetError,
            ipfsGetError,
            ipfsIsOnline,
            metamaskOnline,
            ipfsHash,
            contractIPFSHash,
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
            latestMessage,
            hashContents,
            accounts,
            selectedAccountIndex
        } = this.state
        const address = accounts[selectedAccountIndex]

        if (accounts.length <= 0 && !web3GetError && !web3InvalidNetwork && !ipfsGetError && !ipfsHash && !ipfsIsOnline) {
            console.log('loading components')
            return (
                <p>loading components</p>
            )
        }

        if (!metamaskOnline) {
            console.log('unable to load metamask account, make sure you are logged in')
            return (
                <p>unable to load metamask account, make sure you are logged in</p>
            )
        }

        if (web3GetError) {
            console.log('unable to load web3, make sure metamask is installed')
            return (
                <p>unable to load web3, make sure metamask is installed</p>
            )
        }

        if (ipfsGetError) {
            console.log('unable to load ipfs, i dont know how to fix this yet')
            return (
                <p>unable to load ipfs, i dont know how to fix this yet</p>
            )
        }

        if (web3InvalidNetwork) {
            console.log('please change to the rinkeby network and refresh')
            return (
                <p>please change to the rinkeby network and refresh</p>
            )
        }
        /* Hiding this for testing design*//*
        return (

            <div className="App">
                <Header/>
                <MainPage/>
                <Console/>
            </div>
        )
        */
       return (
           <div className="App">
            <Header/>
            <MainPage/>
           </div>
       )
    }
}

/********** Main Screen and Panels ************/

/*Header navigation bar*/
class Header extends Component {
    render() {
        return (
            <div className="header">
                <h1 className="title text-unselectable hover-cursor">BLOCK NET >></h1>
                <nav className="header-nav">
                    <div>
                        <a href="#">Dev Blog</a>
                    </div>
                    <div>
                        <a href="#">About Us</a>
                    </div>
                </nav>
            </div>
        );
    }
}

/*Page body High level elements of the page body, including:
    - Left panel
    - Content body
    - Right panel
*/
class MainPage extends Component {
    constructor(props) {
        super(props);
        this.activateSection = this.activateSection.bind(this);
        this.state = {activeSection: "Rooms"};
    }
    activateSection(sectionName) {
        this.setState({activeSection : sectionName});
    }
    render() {
        return (
            <div className="main-page">
                <div className="main-screen">
                    <LeftPanel onSectionClick={this.activateSection} activeSection={this.state.activeSection}/>
                    <Content section={this.state.activeSection}/>
                    <RightPanel/>
                </div>
            </div>
        );
    }
}

/*Left panel containing sections for main sections of application*/
class LeftPanel extends Component {
    constructor(props) {
        super(props);
        this.activateSection = this.activateSection.bind(this);
    }
    activateSection(sectionName) {
        this.props.onSectionClick(sectionName);
    }
    render() {
        return (
            <div className="left-panel">
                <SectionButton sectionName="Rooms" onSectionClick={this.activateSection} activeSection={this.props.activeSection}/>
                <SectionButton sectionName="Messages" onSectionClick={this.activateSection} activeSection={this.props.activeSection}/>
                <SectionButton sectionName="History" onSectionClick={this.activateSection} activeSection={this.props.activeSection}/>
                <SectionButton sectionName="Settings" onSectionClick={this.activateSection} activeSection={this.props.activeSection}/>
            </div>
        )
    }
    //<SectionButton sectionName="Invitates" onSectionClick={this.activateSection} activeSection={this.props.activeSection}/>

}

/*Button that links to the main sections of the site*/
class SectionButton extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.prop
    }
    handleClick() {
        console.log(this.props.sectionName + " was clicked.")
        this.props.onSectionClick(this.props.sectionName);
    }
    render() {
        let selectedStatus = "unselected";
        //console.log("active: {" + this.props.activeSection + "}| this: {" + this.props.sectionName + "}");
        if (this.props.activeSection == this.props.sectionName) {
            selectedStatus = "selected";
        }
        var classes = `${selectedStatus} section-button text-unselectable`;

        return (
            <div className={classes} onClick={(e) => this.handleClick(e)}>{this.props.sectionName}</div>
        );
    }
}

/*Right panel, for stylistic purposes (acting as a border for now)
    -content: unsure for now, icons could potentially be added
*/
class RightPanel extends Component {
    render() {
        return (
            <div className="right-panel">
            
            </div>
        )
    }
}

/**
 * Rooms and Messages
 * */
class Content extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.section) {
            case "Rooms":
                return (
                    <RoomScreen/>
                );
            case "Messages":
                return (
                    <div className="content">
                        <PrivateChatsScreen/>
                    </div>
                );
            case "History":
                return (
                    <div className="content">
                        <HistoryScreen/>
                    </div>
                );
            case "Settings":
                return (
                    <div className="content">
                        <SettingsScreen/>
                    </div>
                );
            case "Invitates":
                return (<InvitationScreen/>);
        }
    }
}

class RoomScreen extends Component {
    render() {
        return (
            <div className="room-screen">
                <div className="room-nav">
                    <ul>
                        <li><a href="#room1">Room 1</a></li>
                        <li><a href="#room2">Room 2</a></li>
                        <li><a href="#room3">Room 3</a></li>
                        <li><a href="#room4">Room 4</a></li>
                        <li><a href="#room5">Room 5</a></li>
                    </ul>
                </div>
                <MessageContainer/>
                <ChatBox />          
            </div>
        );
    }
}

class MessageContainer extends Component {
    componentDidMount() {
        const container = document.querySelector('.scroll-container');
        const scrollbar = new PerfectScrollbar(container, {
            wheelSpeed: 2,
            wheelPropagation: true,

        });
    }

    render() {
        return (
            <div className="scroll-container">
                <div className="message-container">
                    <Message/>
                    <Message/>
                    <Message/>
                    <Message/>
                    <Message/>
                </div>
            </div>
            
        );
    }
}

class Message extends Component {
    render() {
        return (
            <div className="message">
                    <MessageHeader/>
                    <MessageContent/>
            </div>
        );
    }
}

class Menu extends Component {
    constructor() {
      super();
      
      this.state = {
          
        showMenu: false,
      };

      this.showMenu = this.showMenu.bind(this);
      this.closeMenu = this.closeMenu.bind(this);
    }
    
    showMenu(event) {
      event.preventDefault();
      
      this.setState({ showMenu: true }, () => {
        document.addEventListener('click', this.closeMenu);
      });
    }
    
    closeMenu(event) {
      
      if (!this.dropdownMenu.contains(event.target)) {
        
        this.setState({ showMenu: false }, () => {
          document.removeEventListener('click', this.closeMenu);
        });  
        
      }
    }
}

class MessageHeader extends Menu {
    render() {
        return (
            <div className="message-header">
                <div className="composer" onClick={this.showMenu}>
                    <h3 className="message-username hover-hand hover-cursor"> #123321</h3>
                        {/* <!-- <button className="invite-button hover-cursor"> Invite </button> -->*/}

                    <div className="invite-menu hover-hand hover-cursor">

                        {
                            this.state.showMenu
                            ? (
                                <div
                               
                                ref={(element) => {
                                    this.dropdownMenu = element;
                                }}
                                >
                                <button className="inner-invite-menu"n> Invite to private chat  </button>
                                <button className="inner-invite-menu"> Invite Someone to this room </button>
                                <button className="inner-invite-menu"> Mute  </button>
                                </div>
                            )
                            : (
                                null
                            )
                        }
                    </div>
                </div>
                <h3 className="message-time hover-cursor">Jan 1, 12:33 PM</h3>
            </div>
        );
    }
}

class MessageContent extends Component {
    render () {
        return (
            <p className="message-content hover-cursor">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna 
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna 
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
        );
    }
}

/*Chat box for sending a message*/
class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="chat-box">
                <form onSubmit={this.handleSubmit}>
                    <textarea cols="1" placeholder="Enter message..." 
                        value={this.state.value} 
                        onChange={this.handleChange} />
                    <input className="chat-box-send" type="submit" value="Send"/>
                </form>
            </div>
        );
    }
}

/*Draggable sliding panel for console. Need to find out how to be implement*/
/*
class Message extends Component {
    render() {
        return (
            
        );
    }
}*/

/**
 * Private Messages
 */
class PrivateChatsScreen extends Component {
    render() {
        return(
            <div className="private-messages-screen">
                <p>Private messaging is a work in progress.</p>
            </div>
        );
    }
}

/**
 * History
 */
class HistoryScreen extends Component {
    render() {
        return(
            <div className="history-screen">
                <p>History is a work in progress.</p>
            </div>
        );
    }
}

/**
 * Settings
 */
class SettingsScreen extends Component {
    render() {
        return(
            <div className="settings-screen content">
                <p>Settings is a work in progress.</p>
            </div>
        );
    }
}

/**
 * Invitation Screen
 */
class InvitationScreen extends Component {
    render() {
        return (
            <div className="content">
               
            </div>
        );
    }
}
/**
 * Console
 */
class Console extends Component {
    render() {
        return(
            <div className="console">
                <div className="console-header">
                    <p>Console</p>
                </div>
                <div className="console-content">
                    Console content goes here.
                </div>
            </div>
        );
    }
}

class BackendStuff extends Component {
    render() {
        return (
          <div class="backend-stuff">
              <header className="App-header">
                  <h1>eth/ipfs example</h1>
              </header>
              <p>account address: {address}</p>
              <p>contract ipfs hash: {contractIPFSHash}</p>
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
    }
}

export default App
