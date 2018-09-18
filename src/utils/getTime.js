const moment = require('moment')

function getTime() { 
    return moment().format()
}

export default getTime