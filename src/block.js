let crypto;
try {
    const crypto = require('crypto');
} catch(err) {
    console.log('crypto support is disabled');
}

const secret = 'test'; // need to set this somehow
const hash = crypto.createHmac('sha256', secret).update('test2').digest('hex');
console.log(hash);

module.exports = {
    secret,
    hash
}