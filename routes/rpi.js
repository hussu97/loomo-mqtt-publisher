var C = require('../constants');
var rPiMessenger = {}
rPiMessenger.run = (client, mware) => {
    client.subscribe(`${C.R2S}/#`);
    client.on('message', (topic, message, packet) => {
        var msg = message.toString('utf-8');
        if (topic.startsWith(`${C.R2S}`)){
            mware.writeLog(new Date().toString() + " Received '" + msg + "' on '" + topic + "'");
            const loomoID = 'ca02571ca1ba7718';
            var res = {
                loomoID : loomoID,
                sensor  : msg
            }
            client.publish(`${C.S2L}/${C.rPiSensor}`, JSON.stringify(res), () => {});
            mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(res) + "' to '" + `${C.S2L}/${C.rPiSensor}` + "'");
        }
    });
}
module.exports = rPiMessenger;