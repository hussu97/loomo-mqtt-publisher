var C = require('../constants');
var rPiMessenger = {}
rPiMessenger.run = (client, mware,client2) => {
    client2.subscribe(`${C.R2S}/#`);
    client2.publish(`${C.S2R}`, "hello", () => {});
    client2.on('message', (topic, message, packet) => {
        var msg = message.toString('utf-8');
        console.log(msg);
        if (topic.startsWith(`${C.R2S}`)) {
            mware.writeLog(new Date().toString() + " Received '" + msg + "' on '" + topic + "'");
            const loomoID = 'ca02571ca1ba7718';
            if (msg.endsWith("f")) {
                var res = {
                    loomoID: msg.split(':')[0],
                    sensor: 'f'
                }
                console.log(res);
                client.publish(`${C.S2L}/${C.rPiSensor}`, JSON.stringify(res), () => {});
            }else if(msg.endsWith("r")){
                var res = {
                    loomoID: msg.split(':')[0],
                    sensor: 'r'
                }
                console.log(res);
                client.publish(`${C.S2L}/${C.rPiSensor}`, JSON.stringify(res), () => {});
            }else{
                var res = {
                    loomoID: msg.split(':')[0],
                    sensor: 'l'
                }
                console.log(res);
                client.publish(`${C.S2L}/${C.rPiSensor}`, JSON.stringify(res), () => {});
            }
                
            console.log(msg);
            client.publish(`${C.S2R}`, message, () => {});
            mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(res) + "' to '" + `${C.S2L}/${C.rPiSensor}` + "'");
        }
    });
}
module.exports = rPiMessenger;