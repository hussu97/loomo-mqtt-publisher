var C = require('../constants');
var loomoMessenger = {}

loomoMessenger.run = (client, mware) => {
    client.subscribe(`${C.L2S}/#`);

    client.on('message', (topic, message, packet) => {
        if(topic.startsWith(`${C.L2S}`))
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");
        switch(topic){
            case `${C.L2S}/${C.loomoArrival}`:
                var msg = JSON.parse(message);
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2M}/${C.loomoArrival}`, JSON.stringify(msg), ()=>{});
                break;
            case `${C.L2S}/${C.beaconSignals}`:
                var msg = JSON.parse(message);
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                break;

        }
    });
}

module.exports = loomoMessenger;