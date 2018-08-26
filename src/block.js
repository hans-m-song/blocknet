const crypto = require('crypto');

const secret = 'test'; // need to set this somehow
const hash = crypto.createHmac('sha256', secret).update('test2').digest('hex');
console.log(hash);

module.exports = {
    secret,
    hash
}