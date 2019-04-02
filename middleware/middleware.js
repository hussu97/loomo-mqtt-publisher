var fs = require('fs'),
    dirName = `${__dirname}/../log.log`;
var middleWareObj = {}

middleWareObj.writeLog = (logMessage) => {
    fs.appendFile(dirName, "\n" +logMessage, (err) => {
        if(err) { console.log(err); }
    }); 
}

middleWareObj.getDistance = (rssiArray) => {
    var kf = new KF();
    var KalmanArray = rssiArray.map(function(v) {
        return kf.filter(v);
      });
    return KalmanArray[KalmanArray.length-1];
}

module.exports = middleWareObj;