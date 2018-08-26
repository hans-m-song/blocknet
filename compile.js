var fs = require('fs');
var browserify = require('browserify');
//var watchify = require('watchify');

var b = browserify({
    entries: ['src/block.js', 'src/message.js', 'src/contract.js', 'src/deploy.js'],
    cache: {},
    packageCache: {},
    plugin: []//[watchify]
});

function bundle() {
    b.bundle().on('error', console.error).pipe(fs.createWriteStream('src/bundle.js'));
}

//b.on('update', bundle);
bundle();