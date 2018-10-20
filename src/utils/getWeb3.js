import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'

const InfuraEndPoint = 'https://rinkeby.infura.io/v3/f6741efdb4e944069b44573eb516acae'
const defaultMnemonic = 'quote ozone head labor fly ribbon zone amused confirm pool library real'

/*
* Function that checks if there is a web3 instance and deploys to it, otherwise uses localhost (ganache-cli required)
* returns web3 A web3 instance
*/
async function getWeb3(mode) {
    console.log("attempting to load web3 with " + mode)
    let web3 = window.web3
    if(mode.split(" ").length === 12) {
        // not sure how to check for invalid mnemonics
        //throw new Error("invalid mnemonic")
        web3 = await new Web3(new HDWalletProvider(mode, InfuraEndPoint))
        console.log('Using users wallet')
    } else if(mode === "metamask") { // use metamask
        if(typeof web3 === 'undefined') {
            throw new Error('Failed to find injected Web3 instance');
        }
        web3 = await new Web3(web3.currentProvider)
        console.log('Using injected web3 instance')
    } else { // user has given a wallet address
        // if(mode === "default") { // use default wallet
        web3 = await new Web3(new HDWalletProvider(defaultMnemonic, InfuraEndPoint))
        console.log('Using default wallet')
    }
    return web3
}

export default getWeb3