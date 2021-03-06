const path = require('path')
const fs = require('fs')
const solc = require('solc')
const compiledPath = path.resolve(__dirname, 'src/compiled')

const resolveSol = (x) => {
    const contractsPath = path.resolve(__dirname, 'contracts', x)
    return fs.readFileSync(contractsPath, 'utf8')
}

const writeCompiled = (x, data) => {
    const f = path.resolve(compiledPath, x)
    fs.writeFileSync(f, data)
}

// put contracts here
const input = {
    'BaseToken.sol': resolveSol('BaseToken.sol'),
    'MessageToken.sol': resolveSol('MessageToken.sol'),
    'SafeMath.sol': resolveSol('SafeMath.sol'),
    'Token.sol': resolveSol('Token.sol')
}

const compiled = solc.compile({sources: input}, 1)

//console.log(compiled)

// check if compile destination exists
if(!fs.existsSync(compiledPath)) {
    fs.mkdirSync(compiledPath)
}

const mainContract = compiled.contracts['MessageToken.sol:MessageToken']
writeCompiled('abi.json', mainContract.interface)

module.exports = {
    abi: mainContract.interface,
    byteCode: mainContract.byteCode
}