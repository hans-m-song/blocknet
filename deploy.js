const Web3 = require('web3');

var dest = 'http://127.0.0.1:4242'; // should make this changeable
const web3 = new Web3(dest);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    const result = null;
};

deploy();
