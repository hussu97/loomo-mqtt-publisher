var fs = require('fs'),
    dirName = `${__dirname}/../log.log`;
var middleWareObj = {}
middleWareObj.writeLog = (logMessage) => {
    fs.appendFile(dirName, "\n" +logMessage, (err) => {
        if(err) { console.log(err); }
    }); 
}
module.exports = middleWareObj;