import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'

const InfuraEndPoint = 'https://rinkeby.infura.io/v3/f6741efdb4e944069b44573eb516acae'
const defaultMnemonic = 'quote ozone head labor fly ribbon zone amused confirm pool library real'

/*
* Function that checks if there is a web3 instance and deploys to it, otherwise uses localhost (ganache-cli required)
* params: mode - either "mnemonic", "metamask" or it will use the default wallet
*         mnemonic - optional parameter if mode is "mnemonic", used to open the wallet
* returns: web3 A web3 instance
*/
async function getWeb3(mode, mnemonic) {
    console.log("attempting to load web3 with " + mode)
    let web3 = window.web3
    if(mode === "mnemonic") {
        if(mnemonic === undefined || mnemonic.split(" ").length !== 12) {
            throw new Error("Invalid mnemonic")
        }
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