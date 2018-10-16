import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'

const InfuraEndPoint = 'https://rinkeby.infura.io/v3/f6741efdb4e944069b44573eb516acae'
const defaultMnemonic = 'quote ozone head labor fly ribbon zone amused confirm pool library real'

/*
* Function that checks if there is a web3 instance and deploys to it, otherwise uses localhost (ganache-cli required)
* returns web3 A web3 instance
*/
const getWeb3 = (mnemonic) =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', () => {
            let web3 = window.web3
            let ethWallet
            if(mnemonic !== undefined) {
                web3 = new Web3(new HDWalletProvider(mnemonic, InfuraEndPoint))
                console.log('Using users wallet')
            } else if(typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider)
                console.log('Using injected web3 instance')
            } else {
                web3 = new Web3(new HDWalletProvider(defaultMnemonic, InfuraEndPoint))
                console.log('Using default wallet')
            }
            resolve(web3)
        })
    })

export default getWeb3