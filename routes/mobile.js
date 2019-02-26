var C = require('../constants');

var mobileMessenger = {}
mobileMessenger.run = (client, mware) => {
    client.subscribe(`${C.M2S}/#`);

    client.on('message', (topic, message, packet) => {
        mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");
        switch(topic){
            case `${C.M2S}/${C.beaconSignals}`:
                var msg = {
                    status : 'available',
                    userID : 'bbbbb',
                    userXPosition : '4.5',
                    userYPosition : '4.67',
                    loomoXPosition : '4.99',
                    loomoYPosition : '6.79',
                    loomoID : 'aaaaa'
                };
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                client.publish(`${C.S2M}/${C.loomoStatus}`, JSON.stringify(msg), ()=>{});
                // dummy publish, should come from Loomo itself
                client.publish(`${C.L2S}/${C.loomoArrival}`, JSON.stringify({status: 'arrived'}), () => {});
                break;

            case `${C.M2S}/${C.userDestination}`:
                var msg = JSON.parse(message);
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2L}/${C.userDestination}`,JSON.stringify(msg), ()=> {});
                break;

            case `${C.M2S}/${C.loomoDismissal}`:
                var msg = {
                    type : 'loomo-dismissal',
                    message : 'loomo could not be dismissed'
                };
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.errorRoute}` + "'");
                client.publish(`${C.S2M}/${C.errorRoute}`, JSON.stringify(msg), ()=>{});
                break;
        }
    });
}

module.exports = mobileMessenger;