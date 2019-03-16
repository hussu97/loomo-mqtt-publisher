var C = require('../constants'),
    userDB = require('../models/user'),
    mapDB = require('../models/map');
var loomoMessenger = {}

loomoMessenger.run = (client, mware) => {
    client.subscribe(`${C.L2S}/#`);

    client.on('message', (topic, message, packet) => {
        var JSONMessage = JSON.parse(message);
        if(topic.startsWith(`${C.L2S}`))
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");
        switch(topic){
            case `${C.L2S}/${C.getMap}`:
                mapDB.findOne({name: "SampleMap"}, (err, map) => {
                    var msg = {
                        loomoID : message.id,
                        map : map
                    }
                    client.publish(`${C.S2L}/${C.getMap}`, JSON.stringify(msg), () => {});
                    mware.writeLog(new Date.toString() + " Sent '"+ JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.getMap}`);
                });
                break;
            case `${C.L2S}/${C.routeToUser}`:
                var msg = {
                    status : 'available',
                    loomoID : message.loomoID
                }
                userDB.findOneAndUpdate({id: message.loomoID}, {status: 'unavailable'}, {new: true})
                .exec()
                .then((err, updatedUser) => {
                    client.publish(`${C.S2M}/${C.loomoStatus}`,JSON.stringify(msg), () => {});
                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                });
                break;
            case `${C.L2S}/${C.loomoArrival}`:
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2M}/${C.loomoArrival}`, JSON.stringify(msg), ()=>{});
                break;
            case `${C.L2S}/${C.beaconSignals}`:
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                break;
            case `${C.L2S}/${C.loomoDismissal}`:
                userDB.findByIdAndUpdate({id : JSONMessage.loomoID}, {status: 'available'}, {new:true})
                .exec()
                .then((err,newLoomo) => {
                    console.log(newLoomo.status);
                }).catch((err) => {
                    console.log(err);
                });
        }
    });
}

module.exports = loomoMessenger;