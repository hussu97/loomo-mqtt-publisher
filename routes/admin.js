var C = require('../constants');
var adminMessenger = {}
adminMessenger.run = (client, mware) => {
    client.subscribe(`${C.L2SA}/#`);
    client.on('message', (topic, message, packet) => {
        if (topic.startsWith(`${C.L2SA}`)) {
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");
        }
        switch (topic) {
            case `${C.L2SA}/${C.log}`:
                client.publish(`${C.S2A}/${C.log}`, message, () => {});
                break;
            case `${C.L2SA}/${C.pose}`:
                client.publish(`${C.S2A}/${C.pose}`, message, () => {});
                break;
            case `${C.L2SA}/${C.dest}`:
                client.publish(`${C.S2A}/${C.dest}`, message, () => {});
                break;
            case `${C.L2SA}/${C.reset}`:
                mware.writeLog(new Date().toString() + " Sent '" + message.toString('utf-8') + "' to '" + `${C.S2L}/${C.reset}` + "'");
                msg = {
                    loomoID: 'hi'
                }
                client.publish(`${C.S2L}/${C.reset}`, JSON.stringify(msg), () => {});
                break;
            case `${C.L2SA}/${C.getMap}`:
                mware.writeLog(new Date().toString() + " Sent '" + message.toString('utf-8') + "' to '" + `${C.S2L}/${C.resetMap}` + "'");
                msg = {
                    loomoID: 'hi'
                }
                client.publish(`${C.S2L}/${C.resetMap}`, JSON.stringify(msg), () => {});
                break;
        }
    });
}
module.exports = adminMessenger;