var C = require('../constants'),
    BTTrilat = require('../trilateration/index'),
    userDB = require('../models/user');

var mobileMessenger = {}
mobileMessenger.run = (client, mware) => {
    client.subscribe(`${C.M2S}/#`);

    client.on('message', (topic, message, packet) => {
        if(topic.startsWith(`${C.M2S}`))
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");

        switch(topic){
            case `${C.M2S}/${C.beaconSignals}`:
                mware.writeLog(new Date().toString() + " insice M2S");
                userDB.findOne({id: message.clientID}).exec().then((user) => {
                    BTTrilat.run(message).then((position, map) => {
                        console.log(position.x);
                        console.log(position.y);
                        console.log(map);
                        if(user) {
                            userDB.update({id: message.clientID}, 
                                {
                                    currentLocation : {
                                        x_coordinate : position.x,
                                        y_coordinate : position.y,
                                        timestamp : Date.now,
                                        mapName : map
                                    }
                                })
                        } else {
                            userDB.create(
                                {
                                    id : message.clientID,
                                    entity : "client",
                                    currentLocation : {
                                        x_coordinate : position.x,
                                        y_coordinate : position.y,
                                        timestamp : Date.now,
                                        mapName : map
                                    } 
                                }, (err,user) => {}
                            )
                        }
                        userDB.findOne({status: 'available'}).exec().then((loomo) => {
                            if(loomo){
                                console.log('loomo found');
                            } else {
                                console.log('loomo not found');
                            }
                        })
                    }).catch((err) => {
                        console.log(err);
                    });
                });
                
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
                beaconMsg = JSON.parse(message);
                client.publish(`${C.S2M}/${C.loomoStatus}`, JSON.stringify(msg), ()=>{});
                // dummy publish, should come from Loomo itself
                client.publish(`${C.L2S}/${C.loomoArrival}`, JSON.stringify({status: 'arrived'}), () => {});
                break;

            case `${C.M2S}/${C.userDestination}`:
                var msg = JSON.parse(message);
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2L}/${C.userDestination}`,JSON.stringify(msg), ()=> {});
                client.publish(`${C.S2M}/${C.userDestination}`,JSON.stringify(msg), () => {});
                break;

            case `${C.M2S}/${C.loomoDismissal}`:
                var msg = {
                    type : 'loomo-dismissal',
                    message : 'loomo was successdfully dismissed'
                };
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoDismissal}` + "'");
                client.publish(`${C.S2M}/${C.loomoDismissal}`, JSON.stringify(msg), ()=>{});
                break;
        }
    });
}

module.exports = mobileMessenger;