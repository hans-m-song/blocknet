const path = require('path')
const fs = require('fs')
const solc = require('solc')
const compiledPath = path.resolve(__dirname, 'src/compiled')

/*
 * finds a solidity file with the given name
 * params:  x - name of file
 * returns: the path and full filename of the given file
 */
const resolveSol = (x) => {
    const contractsPath = path.resolve(__dirname, 'contracts', x)
    return fs.readFileSync(contractsPath, 'utf8')
}

/*
 * writes the compiled contract to a file
 * params:  x - name of file to write
 *          data - contents of file
 */
const writeCompiled = (x, data) => {
    const f = path.resolve(compiledPath, x)
    fs.writeFileSync(f, data)
}

/*
 * Contracts to be compiled
 */
const input = {
    'BaseToken.sol': resolveSol('BaseToken.sol'),
    'MessageToken.sol': resolveSol('MessageToken.sol'),
    'SafeMath.sol': resolveSol('SafeMath.sol'),
    'Token.sol': resolveSol('Token.sol')
}

// compile all contracts
const compiled = solc.compile({sources: input}, 1)

//console.log(compiled)

// check if compile destination exists
if(!fs.existsSync(compiledPath)) {
    fs.mkdirSync(compiledPath)
}

// write the interface of the main contract to disk
const mainContract = compiled.contracts['MessageToken.sol:MessageToken']
writeCompiled('abi.json', mainContract.interface)

module.exports = {
    abi: mainContract.interface,
    byteCode: mainContract.byteCode
}
