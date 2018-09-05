import React, {Component} from 'react'

import getWeb3 from './getWeb3'
import abi from './compiled/abi.json'

const ContractAddress = '0xe5d161ba85cc0fde5e40fd96902fd0d9713db40a' // TODO get this key

class App extends Component {
    state = {
        web3GetError: false,
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
            const contract = new web3.eth.Contract(abi, ContractAddress)
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
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    // TODO write this after contracts
    // Constructor for current session
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
    claimMessageTokens = () => {
        const {accounts, contract, selectedAccountIndex} = this.state
        const from = accounts[selectedAccountIndex]

        contract.methods.claim().send({gas: '2352262', from})
            .then((x) => {this.syncDappData()})
    }

    sendMessage = () => {
        const {accounts, contract, selectedAccountIndex} = this.state
        const from = accounts[selectedAccountIndex]

        contract.methods.sendMessage().send({gas: '2352262', from})
            .then((x) => {this.syncDappData()})
    }

    render () {
        const {
            web3GetError, 
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

        if(accounts.length <= 0 && !web3GetError && !web3InvalidNetwork) {
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

        if(web3InvalidNetwork) {
            console.log('please change to the rinkeby network and refresh')
            return (
                <p>please change to the rinkeby network and refresh</p>
            )
        }

        return (
            <p></p>
        )
    }
}

export default App