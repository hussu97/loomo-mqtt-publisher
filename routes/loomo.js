var C = require('../constants'),
    userDB = require('../models/user'),
    mapDB = require('../models/map'),
    tourDB = require('../models/tours');
var loomoMessenger = {}

loomoMessenger.run = (client, mware) => {
    client.subscribe(`${C.L2S}/#`);

    client.on('message', (topic, message, packet) => {
        var JSONMessage = JSON.parse(message);
        if (topic.startsWith(`${C.L2S}`))
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");

        switch (topic) {
            case `${C.L2S}/${C.getMap}`:
                userDB.findOne({ id: JSONMessage.loomoID })
                    .exec()
                    .then((loomo) => {
                        if (!loomo) {
                            const newLoomo = new userDB({
                                id: JSONMessage.loomoID,
                                entity: 'loomo',
                                status: 'available',
                                currentLocation: {
                                    x_coordinate: 0.0,
                                    y_coordinate: 0.0,
                                    timeStamp: Date.now,
                                    mapName: 'EB1-Rotunda'
                                }
                            });
                            newLoomo.save((err) => { if (err) console.log(err); });
                        }
                    })
                mapDB.findOne({ name: JSONMessage.mapName })
                    .exec()
                    .then((newMap) => {
                        if (!JSONMessage.timeStamp || newMap.timeStamp > Number(JSONMessage.timeStamp)) {
                            if (JSONMessage.timeStamp) {
                                console.log(JSONMessage.timeStamp + " vs " + newMap.timeStamp);
                            }
                            var msg = {
                                loomoID: JSONMessage.loomoID,
                                map: newMap,
                                updated: true
                            }
                        } else {
                            var msg = {
                                loomoID: JSONMessage.loomoID,
                                updated: false
                            }
                        }
                        client.publish(`${C.S2L}/${C.sendMap}`, JSON.stringify(msg), () => { });
                        mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.sendMap}` + "'");
                    });
                break;

            case `${C.L2S}/${C.routeToUser}`:
                var msg = {
                    status: 'available',
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID
                }
                userDB.findOneAndUpdate({ id: JSONMessage.loomoID }, { status: 'unavailable' }, { new: true })
                    .exec()
                    .then((updatedUser) => {
                        client.publish(`${C.S2M}/${C.loomoStatus}`, JSON.stringify(msg), () => { });
                        mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                    });
                break;

            case `${C.L2S}/${C.loomoArrival}`:
                var msg = {
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID,
                }
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2M}/${C.loomoArrival}`, JSON.stringify(msg), () => { });
                break;
            case `${C.L2S}/${C.startedJourney}`:
                var msg = {
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID,
                }
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.startedJourney}` + "'");
                client.publish(`${C.S2M}/${C.startedJourney}`, JSON.stringify(msg), () => { });
                break;

            case `${C.L2S}/${C.endJourney}`:
                var msg = {
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID,
                }
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.endJourney}` + "'");
                client.publish(`${C.S2M}/${C.endJourney}`, JSON.stringify(msg), () => { });

            case `${C.L2S}/${C.getTours}`:
                tourDB.findOne({ mapName: JSONMessage.mapName, name: JSONMessage.tourName })
                    .exec()
                    .then((tour) => {
                        console.log(tour);
                    });
                break;

            case `${C.L2S}/${C.loomoDismiss}`:
                userDB.findOneAndUpdate({ id: JSONMessage.loomoID }, { status: 'available' }, { new: true })
                    .exec()
                    .then((newLoomo) => {
                        console.log(newLoomo.status);
                    });
                var msg = {
                    clientID: JSONMessage.clientID,
                    loomoID: JSONMessage.loomoID
                }
                client.publish(`${C.S2M}/${C.loomoDismiss}`, JSON.stringify(msg), () => { });
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoDismiss}` + "'");
                break;
            //TODO
            //Remove below routes as they are not being used
            case `${C.L2S}/${C.beaconSignals}`:
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                break;

            case `${C.L2S}/test-mqtt-client`:
                if(JSONMessage.clientID){
                    console.log('client: ' + JSONMessage.clientID + ' and loomo ' + JSONMessage.loomoID);
                } else {
                    console.log('loomo: '+JSONMessage.loomoID)
                }
                break;

            case `${C.L2S}/test-VLS-service`:
                console.log('Speed: ' + JSONMessage.speed + ' and thetha ' + JSONMessage.thetha);
                break;
            case `${C.L2S}/${C.userDestination}`:

                break;
            case `${C.L2S}/test-checkpoint`:
                console.log('X value: ' + JSONMessage.x_coordinate + ' Y value: ' + JSONMessage.y_coordinate + ' thetha: ' + JSONMessage.thetha + ' isLast: ' + JSONMessage.lastCheckpoint + ' ID: ' + JSONMessage.ID);
        }
    });
}

module.exports = loomoMessenger;