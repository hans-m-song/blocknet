import React, {Component} from 'react'

import getWeb3 from './getWeb3'
import abi from './src/compiled/abi.json'

const ContractAddress = '' // TODO get this key

class App extends Component {
    state = {
        web3GetError: false,
        web3InvalidNetwork: false,
        accounts: [],
        claimableTokens: 0,
        selectedAccountIndex: 0,
        balance: 0,
        messageHistory: [],
        latestBlockNo: 0
    }

    // Connection handler for web3
    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract(abi, ContractAddress)
            contract.setProvider(web3.currentProvider);
            const networkType = await web3.eth.net.getNetworktype();
            const web3InvalidNetwork = networkType !== 'rinkeby'
            this.setState({web3, accounts, contract, web3InvalidNetwork}, this.syncDappData(), 1000);
        } catch(error) {
            alert('Failed to initialize connection, check console for specifics');
            this.setState({web3GetError: true});
            console.log(error);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    // TODO write this after contracts
    // Constructor for current session
    syncDappData = async () => {
        const {web3, accounts, contract, selectedAccountIndex} = this.state;
        const from = accounts[selectedAccountIndex];
        const balance = await contract.methods.balanceOf(from).call();
        const latestBlockNo = await web3.eth.getBlockNumber();

        this.setState({
            balance,
            latestBlockNo
        })
    }

    render () {
        const {}
    }
}