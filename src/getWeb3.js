import Web3 from 'web3'

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', () => {
            let web3 = window.web3

            if(typeof web3 !== 'undfined') {
                web3 = new Web3(web3.currentProvider)
                console.log('Injected web3 instance detected')
                resolve(web3)
            } else {
                web3 = new Web3(new Web3.providers.HttpProvider('https://localhost:8546'))
                console.log('No web3 instance detected, using localhost')
                resolve(web3)
            }
        })
    })

export default getWeb3