var C = require('../constants'),
    BTTrilat = require('../trilateration/index'),
    userDB = require('../models/user'),
    mapDB = require('../models/map');

var mobileMessenger = {}
mobileMessenger.run = (client, mware) => {
    client.subscribe(`${C.M2S}/#`);

    client.on('message', (topic, message, packet) => {
        var JSONMessage = JSON.parse(message);
        if(topic.startsWith(`${C.M2S}`))
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");
        switch(topic){
            case `${C.M2S}/${C.getMapDestinations}`:
                mapDB.findOne({name : JSONMessage.mapName})
                .exec()
                .then((map) => {
                    var msg = {
                        clientID : JSONMessage.clientID,
                        destinations : map.destinations
                    }
                    client.publish(`${C.S2M}/${C.getMapDestinations}`, JSON.stringify(msg), () => {});
                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.getMapDestinations}` + "'");
                });
                break;
            case `${C.M2S}/${C.beaconSignals}`:
                userDB.findOne({id: JSONMessage.clientID}).exec().then((user) => {
                    BTTrilat.run(JSONMessage).then((response) => {
                        //what cells you are covering, if using proximity beacon
                        //TODO
                        if(user) {
                            userDB.findOneAndUpdate({id: JSONMessage.clientID}, {       
                                currentLocation : {
                                    x_coordinate : response.x,
                                    y_coordinate : response.y,
                                    timestamp : Date.now(),
                                    mapName : response.map
                                },
                                destination : JSONMessage.destination,
                                mode : JSONMessage.mode
                            }, {new: true})
                            .exec()
                            .then((updatedUser) => {});
                        } else {
                            const newUser = new userDB({
                                    id : JSONMessage.clientID,
                                    entity : "client",
                                    currentLocation : {
                                        x_coordinate : response.x,
                                        y_coordinate : response.y,
                                        timestamp : Date.now(),
                                        mapName : response.map
                                    }, 
                                    destination : JSONMessage.destination,
                                    mode : JSONMessage.mode
                                }
                            );
                            newUser.save((err) => { if(err) console.log(err); });
                        }
                        userDB.findOne({status: 'available'})
                        .exec()
                        .then((loomo) => {
                            if(loomo){
                                mapDB.findOne({name: loomo.currentLocation.mapName})
                                .exec()
                                .then((map) => {
                                    destinationObj = map.destinations.find((element) => {
                                        if(element.name == JSONMessage.destination){
                                            return element;
                                        }
                                    })
                                    var msg = {
                                        clientID : JSONMessage.clientID,
                                        loomoID : loomo.id,
                                        //TODO
                                        //center of user beacon response
                                        x_coordinate : 1,
                                        y_coordinate : 1,
                                        //TODO add to database destinations
                                        // and what beacon is covered under it
                                        //TODO need to test this out
                                        destinationBeaconID : destinationObj,
                                        mode : JSONMessage.mode
                                    }
                                    client.publish(`${C.S2L}/${C.loomoCall}`, JSON.stringify(msg), () => {});
                                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoCall}` + "'");
                                });
                            } else {
                                var msg = {
                                    clientID : JSONMessage.clientID,
                                    status: 'unavailable'
                                };
                                client.publish(`${C.S2M}/${C.loomoStatus}`, JSON.stringify(msg), () => {});
                                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                });           
                break;

            case `${C.M2S}/${C.loomoDismiss}`:
                var msg = {
                    loomoID : JSONMessage.loomoID,
                    clientID : JSONMessage.clientID
                };
                userDB.findOneAndUpdate({id : JSONMessage.loomoID}, {status: 'available'}, {new:true})
                .exec()
                .then((newLoomo) => {
                    console.log(newLoomo.status);
                }).catch((err) => {
                    console.log(err);
                });
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoDismiss}` + "'");
                client.publish(`${C.S2L}/${C.loomoDismiss}`, JSON.stringify(msg), ()=>{});
                break;

            //TODO
            // Route is unused so far, need to figure out what this is for
            case `${C.M2S}/${C.userDestination}`:
                client.publish(`${C.S2M}/${C.loomoArrival}`, "loomo here", () => {});
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2L}/${C.userDestination}`,JSON.stringify(msg), ()=> {});
                client.publish(`${C.S2M}/${C.userDestination}`,JSON.stringify(msg), () => {});
                break;
        }
    });
}

module.exports = mobileMessenger;