var C = require('../constants'),
    userDB = require('../models/user'),
    mapDB = require('../models/map'),
    tourDB = require('../models/tours');
var loomoMessenger = {}
var array = []
loomoMessenger.run = (client, mware) => {
    client.subscribe(`${C.L2S}/#`);

    client.on('message', (topic, message, packet) => {
        if (topic.startsWith(`${C.L2S}`)){
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");
            var JSONMessage = JSON.parse(message);
        }
        switch (topic) {
            case `${C.L2S}/${C.getMap}`:
                userDB.findOne({
                        id: JSONMessage.loomoID
                    })
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
                            newLoomo.save((err) => {
                                if (err) console.log(err);
                            });
                        }
                    })
                mapDB.findOne({
                        name: JSONMessage.mapName
                    })
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
                        client.publish(`${C.S2L}/${C.sendMap}`, JSON.stringify(msg), () => {});
                        mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.sendMap}` + "'");
                        tourDB.findOne({
                                mapName: JSONMessage.mapName
                            })
                            .exec()
                            .then((tour) => {
                                if (tour) {
                                    var msg2 = {
                                        loomoID: JSONMessage.loomoID,
                                        tour: tour
                                    }
                                    client.publish(`${C.S2L}/${C.sendTour}`, JSON.stringify(msg2), () => {});
                                    mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg2) + "' to '" + `${C.S2L}/${C.sendTour}` + "'");
                                } else {
                                    var msg2 = {
                                        loomoID: JSONMessage.loomoID,
                                        tour : 'unavailable'
                                    }
                                    client.publish(`${C.S2L}/${C.sendTour}`, JSON.stringify(msg2), () => {});
                                    mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg2) + "' to '" + `${C.S2L}/${C.sendTour}` + "'");
                                }
                            });
                    });
                break;

            case `${C.L2S}/${C.routeToUser}`:
                var msg = {
                    status: 'available',
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID
                }
                userDB.findOneAndUpdate({
                        id: JSONMessage.loomoID
                    }, {
                        status: 'unavailable'
                    }, {
                        new: true
                    })
                    .exec()
                    .then((updatedUser) => {
                        client.publish(`${C.S2M}/${C.loomoStatus}`, JSON.stringify(msg), () => {});
                        mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                    });
                break;

            case `${C.L2S}/${C.loomoArrival}`:
                var msg = {
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID,
                }
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2M}/${C.loomoArrival}`, JSON.stringify(msg), () => {});
                break;
            case `${C.L2S}/${C.startedJourney}`:
                var msg = {
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID,
                }
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.startedJourney}` + "'");
                client.publish(`${C.S2M}/${C.startedJourney}`, JSON.stringify(msg), () => {});
                break;

            case `${C.L2S}/${C.endJourney}`:
                var msg = {
                    loomoID: JSONMessage.loomoID,
                    clientID: JSONMessage.clientID,
                }
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.endJourney}` + "'");
                client.publish(`${C.S2M}/${C.endJourney}`, JSON.stringify(msg), () => {});
                break;

            case `${C.L2S}/${C.loomoDismiss}`:
                userDB.findOneAndUpdate({
                        id: JSONMessage.loomoID
                    }, {
                        status: 'available'
                    }, {
                        new: true
                    })
                    .exec()
                    .then((newLoomo) => {
                        console.log(newLoomo.status);
                    });
                var msg = {
                    clientID: JSONMessage.clientID,
                    loomoID: JSONMessage.loomoID
                }
                client.publish(`${C.S2M}/${C.loomoDismiss}`, JSON.stringify(msg), () => {});
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoDismiss}` + "'");
                break;
            case `${C.L2S}/${C.reachedHome}`:
                console.log('hello');
                break;
                //TODO
                //Remove below routes as they are not being used
            case `${C.L2S}/${C.beaconSignals}`:
                mware.writeLog(new Date().toString() + " Sent '" + JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                break;

            case `${C.L2S}/test-mqtt-client`:
                if (JSONMessage.clientID) {
                    console.log('client: ' + JSONMessage.clientID + ' and loomo ' + JSONMessage.loomoID);
                } else {
                    console.log('loomo: ' + JSONMessage.loomoID)
                }
                break;

            case `${C.L2S}/SampleFunctions-VLS-service`:
                console.log('Speed: ' + JSONMessage.speed + ' and thetha ' + JSONMessage.thetha);
                break;
            case `${C.L2S}/${C.userDestination}`:

                break;
            case `${C.L2S}/SampleFunctions-checkpoint`:
                //console.log('X value: ' + JSONMessage.x_coordinate + ' Y value: ' + JSONMessage.y_coordinate + ' thetha: ' + JSONMessage.thetha + ' isLast: ' + JSONMessage.lastCheckpoint + ' ID: ' + JSONMessage.ID);
                break;
            case `${C.L2S}/SampleFunctions-VLSPose`:
                console.log('X value: ' + JSONMessage.x_coordinate + ' Y value: ' + JSONMessage.y_coordinate + ' thetha: ' + JSONMessage.thetha);
                break;
        }
    });
    var stdin = process.openStdin();
    counter = 0;
    stdin.addListener("data", function (d) {
        array[(counter) % 3] = Number(d.toString().trim());
        counter = counter + 1;
        if (counter % 3 == 0) {
            x = array[0];
            y = array[1];
            t = array[2];
            msg = {
                x: x,
                y: y,
                thetha: t
            }
            client.publish(`${C.S2L}/test-route`, JSON.stringify(msg), () => {});
            console.log('hi');
        }
    });
}

module.exports = loomoMessenger;