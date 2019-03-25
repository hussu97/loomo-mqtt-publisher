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
                userDB.findOne({id: JSONMessage.loomoID})
                .exec()
                .then((loomo) => {
                    if(!loomo){
                        const newLoomo = new userDB({
                            id : JSONMessage.loomoID,
                            entity : 'loomo',
                            status : 'available',
                            currentLocation : {
                                x_coordinate : 0.0,
                                y_coordinate : 0.0,
                                timeStamp : Date.now,
                                mapName : 'SampleMap'
                            }
                        });
                        newLoomo.save((err) => {if (err) console.log(err);} );
                    }
                })
                mapDB.findOne({name: JSONMessage.mapName})
                .exec()
                .then((newMap) => {
                    console.log(newMap.timeStamp+" vs "+JSONMessage.timeStamp);
                    if(!JSONMessage.timeStamp || newMap.timeStamp > Number(JSONMessage.timeStamp)){
                        var msg = {
                            loomoID : JSONMessage.loomoID,
                            map : newMap,
                            updated : true
                        }
                    } else {
                        var msg = {
                            loomoID : JSONMessage.loomoID,
                            updated : false
                        }
                    }
                    client.publish(`${C.S2L}/${C.sendMap}`, JSON.stringify(msg), () => {});
                    mware.writeLog(new Date().toString() + " Sent '"+ JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.sendMap}` + "'");
                });
                break;

            case `${C.L2S}/${C.routeToUser}`:
                var msg = {
                    status : 'available',
                    loomoID : JSONMessage.loomoID,
                    clientID : JSONMessage.clientID
                }
                userDB.findOneAndUpdate({id: JSONMessage.loomoID}, {status: 'unavailable'}, {new: true})
                .exec()
                .then((updatedUser) => {
                    client.publish(`${C.S2M}/${C.loomoStatus}`,JSON.stringify(msg), () => {});
                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                });
                break;

            case `${C.L2S}/${C.loomoArrival}`:
                var msg = {
                    loomoID : JSONMessage.loomoID,
                    clientID : JSONMessage.clientID,
                }
                console.log(JSONMessage.x_coordinate);
                console.log(JSONMessage.y_coordinate);
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2M}/${C.loomoArrival}`, JSON.stringify(msg), ()=>{});
                break;

            //TODO
            //Remove below routes as they are not being used
            case `${C.L2S}/${C.beaconSignals}`:
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                break;

            case `${C.L2S}/test-VLS-service`:
                console.log('Speed: '+JSONMessage.speed+' and thetha '+JSONMessage.thetha);
            case `${C.L2S}/${C.userDestination}`:
                
                break;
        }
    });
}

module.exports = loomoMessenger;