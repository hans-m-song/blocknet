import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'

const InfuraEndPoint = 'https://rinkeby.infura.io/v3/f6741efdb4e944069b44573eb516acae'
const defaultMnemonic = 'quote ozone head labor fly ribbon zone amused confirm pool library real'

/*
* Function that checks if there is a web3 instance and deploys to it, otherwise uses localhost (ganache-cli required)
* returns web3 A web3 instance
*/
const getWeb3 = (mode) =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', () => {
            let web3 = window.web3
            if(mode === undefined) { // use default wallet
                web3 = new Web3(new HDWalletProvider(defaultMnemonic, InfuraEndPoint))
                console.log('Using default wallet')
            } else if(mode === "metamask") { // use metamask
                if(typeof web3 === 'undefined') {
                    throw new Error("no injected web3 instance detected")
                }
                web3 = new Web3(web3.currentProvider)
                console.log('Using injected web3 instance')
            } else { // user has given a wallet address
                if(mode.split(" ").length !== 12) {
                    throw new Error("invalid mnemonic")
                }
                web3 = new Web3(new HDWalletProvider(mode, InfuraEndPoint))
                console.log('Using users wallet')
            }
            resolve(web3)
        })
    })

export default getWeb3