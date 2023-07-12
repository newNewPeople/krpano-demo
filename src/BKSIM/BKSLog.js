const  config = require("./configuration");
function log(){
    if(config.mode === 'debug'){
       /// console.log(new Date().toLocaleString(),...arguments)
    }
}

module.exports = {
    log,
}
