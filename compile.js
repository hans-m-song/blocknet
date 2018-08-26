var fs = require('fs');
var browserify = require('browserify');
//var watchify = require('watchify');

var b = browserify({
    entries: ['src/message.js'], //'src/contract.js', 'src/deploy.js'],
    cache: {},
    packageCache: {},
    plugin: []//[watchify]
});

function message() {//bundle() {
    b.bundle().on('error', console.error).pipe(fs.createWriteStream('src/compiled/message.js'));
}

//b.on('update', bundle);
//bundle();
message();