var fs = require('fs'),
    dirName = `${__dirname}/../log.log`;
var middleWareObj = {}

middleWareObj.writeLog = (logMessage) => {
    fs.appendFile(dirName, "\n" +logMessage, (err) => {
        if(err) { console.log(err); }
    }); 
}
middleWareObj.findCenter = (points) => {
    var x = 0;
    var y = 0;
    for (i =0; i<points.length; i++) {
        var point = points[i].split(",");
        x += Number(point[0]);
        y += Number(point[1]);
    }
    return `${(x/points.length).toFixed(3)},${(y/points.length).toFixed(3)}`;
}
module.exports = middleWareObj;