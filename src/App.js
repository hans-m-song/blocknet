import React, {Component} from 'react'

import getWeb3 from './utils/getWeb3'
//import getIPFS from './utils/getIPFS'
import abi from './compiled/abi.json'
import {contractAddress} from './utils/getAddress'
import './App.css'

class App extends Component {
    // global vars for the current session state
    state = {
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
            const contract = new web3.eth.Contract(abi, contractAddress)
            contract.setProvider(web3.currentProvider)
            const networkType = await web3.eth.net.getNetworkType()
            const web3InvalidNetwork = networkType !== 'rinkeby'
            this.setState({web3, accounts, contract, web3InvalidNetwork}, this.syncDappData)
            this.interval = setInterval(() => this.syncDappData(), 1000)
        } catch(error) {
            alert('Failed to initialize connection, check console for specifics')
            this.setState({web3GetError: true})
            console.log(error)
        }
        /*
        try {
            const ipfs = await getIPFS()
            const ipfsContract = new this.state.web3.eth.Contract(abiIPFS, ipfsContractAddress)
            ipfsContract.setProvider(this.state.web3.currentProvider)
            this.setState({ipfsContract}, this.syncDappData)
        } catch(error) {
            alert('Failed to initalize IPFS, check console for specifics')
            this.setState({ipfsGetError: true})
            console.log(error)
        }
        */
    }

    // exit
    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    // get info from deployed dapp and sync with session state
    syncDappData = async () => {
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

        this.setState({
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
        console.log('attempting to send from:', from, 
            '\nto', to, '\nmessage:', message)

        contract.methods.sendMessage().send({gas: '2352262', from})
            .then((x) => {this.syncDappData()})
    }

    render () {
        const {
            web3GetError, 
            ipfsGetError,
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

        if(accounts.length <= 0 && !web3GetError && !web3InvalidNetwork && !ipfsGetError) {
            console.log('loading components')
            return (
                <p>loading components</p>
            )
        }

        if(web3GetError) {
            console.log('unable to load web3, make sure metamask is installed or use brave')
            return (
                <p>unable to load web3, make sure metamask is installed or use brave</p>
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
                <Header/>
                <MainPage/>
                <Console/>
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
            <div className="header">
                <h1 className="title">Message Blocks</h1>
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

class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <div className="main-screen">
                    <LeftPanel/>
                    <Content/>
                    <RightPanel/>
                </div>
            </div>
        );
    }
}

/*Links to major sections of the app live here*/
class LeftPanel extends Component {
    render() {
        return (
            <div className="left-panel">
                <SectionButton sectionName="Rooms"/>
                <SectionButton sectionName="Messages"/>
                <SectionButton sectionName="History"/>
                <SectionButton sectionName="Settings"/>
            </div>
        )
    }
}

class SectionButton extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="section-button">{this.props.sectionName}</div>
        );
    }
}

/*This is where the message / room screens will live */
class Content extends Component {
    render() {
        return (
            <div className="content">
                A large gaping hole.
            </div>
        );
    }
}

/*Placeholder for now... more or less just a border*/
class RightPanel extends Component {
    render() {
        return (
            <div className="right-panel">
            
            </div>
        )
    }
}

/*Draggable sliding panel for console. Need to find out how to be implement*/
class Console extends Component {
    render() {
        return(
            <div className="console">
                <div className="console-header">
                    <p>Console</p>
                </div>
                <div className="console-content">
                    Console content goes here.
                    To be drag-able / slide-able by the header bar above.
                </div>
            </div>
        );
    }
}

class Footer extends Component {
    render() {
        return(
            <div className="footer">
                footer
            </div>
        );
    }
}

class BackendStuff extends Component {
    render() {
        return (
/*            <div class="backend-stuff">
                <p>address: {address}</p>
                <p>claimableTokens: {claimableTokens}</p>
                <p>latestBlockNo: {latestBlockNo}</p>
                <p>tokensPerMessage: {tokensPerMessage}</p>
                <p>dailyTokensNo: {dailyTokensNo}</p>
                <p>blocksPerClaim: {blocksPerClaim}</p>
                <p>balance: {balance}</p>
                <p>messageHistory: {messageHistory}</p>
                <p>blocksTilClaim: {blocksTilClaim}</p>
                <button onClick={this.claimMessageTokens}>Claim Tokens</button>  
                <br /><br />
                <p>address: </p>
                <input latype="text" ref={(input) => this.addressInput = input}/>
                <br /><br />
                <p>message: </p>
                <input type="text" ref={(input) => this.messageInput = input}/>
                <button onClick={this.sendMessage}>Send</button>
            </div>*/
            <div></div>
        );
    }
}

export default App
