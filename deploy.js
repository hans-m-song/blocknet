const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider')
const {abi, byteCode} = require('./compile')

// TODO get these keys
const InfuraApiKey = ''
const Mnemonic = ''

const deployLocalHost = (InfuraApiKey === undefined || Mnemonic === undefined)

let web3
if(deployLocalHost) {
    console.log('Deploying to https://localhost:8545')
    web3 = new Web3('https://localhost:8545')
} else {
    console.log('Deploying to Rinkeby')
    web3 = new Web3(new HDWalletProvider(Mnemonic, 'https://rinkeby.infura.io/' + InfuraApiKey))
}

//TODO
var _gas
var _gasLimit
var _gasPrice

const deploy = async () => {
    const accounts = await web3.getAccounts() // TODO may need a different method of getting account
    const prefix = deployLocalHost ? '' : '0x'

    console.log('Deploying from account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(abi))
        .deploy({data: prefix + byteCode, arguments: [/*TODO*/]})
        .send({gas: _gas, gasLimit: _gasLimit, gasPrice: _gasPrice, from: accounts[0]})

    console.log('Contract deployed to', result.options.address)
}

deploy()