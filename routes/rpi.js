var C = require('../constants');
var rPiMessenger = {}
rPiMessenger.run = (client, mware,client2) => {
    client.subscribe(`${C.R2S}/#`);
    client2.publish(`${C.S2R}`, "hello", () => {});
    client.on('message', (topic, message, packet) => {
        var msg = message.toString('utf-8');
        console.log(msg);
        if (topic.startsWith(`${C.R2S}`)) {
            const loomoID = 'ca02571ca1ba7718';
            if (msg.endsWith("f")) {
                var res = {
                    loomoID: msg.split(':')[0],
                    sensor: 'f'
                }
                console.log(res);
                client.publish(`${C.S2L}/${C.rPiSensor}`, JSON.stringify(res), () => {});
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(res) + "' to '" + `${C.S2L}/${C.rPiSensor}` + "'");
            }else if(msg.endsWith("r")){
                var res = {
                    loomoID: msg.split(':')[0],
                    sensor: 'r'
                }
                console.log(res);
            }else{
                var res = {
                    loomoID: msg.split(':')[0],
                    sensor: 'l'
                }
                console.log(res);
            }
                
            console.log(msg);
            client.publish(`${C.S2R}`, message, () => {});
            }
    });
}
module.exports = rPiMessenger;