// https://github.com/ipfs/js-ipfs/tree/master/examples/ipfs-101
const IPFS = require('ipfs')

const node = new IPFS()

node.on('ready', async () => {
    const version = await node.version()
    console.log('IPFS version:', version.version)
    const filesAdded = await node.files.add({
        path: 'hello',
        content: Buffer.from('hello ipfs')
    })
    console.log('added file:', filesAdded[0].path, filesAdded[0].hash)

    const fileBuffer = await node.files.cat(filesAdded[0].hash)
    console.log('added file contents:', fileBuffer.toString())
})

node.stop(() => {
    console.log("shutting down ipfs")
})
