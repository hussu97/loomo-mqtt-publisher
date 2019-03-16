var C = require('../constants'),
    BTTrilat = require('../trilateration/index'),
    userDB = require('../models/user');

var mobileMessenger = {}
mobileMessenger.run = (client, mware) => {
    client.subscribe(`${C.M2S}/#`);

    client.on('message', (topic, message, packet) => {
        var JSONMessage = JSON.parse(message);
        if(topic.startsWith(`${C.M2S}`))
            mware.writeLog(new Date().toString() + " Received '" + message + "' on '" + topic + "'");

        switch(topic){
            case `${C.M2S}/${C.beaconSignals}`:
                userDB.findOne({id: JSONMessage.clientID}).exec().then((user) => {
                    BTTrilat.run(JSONMessage).then((response) => {
                        //what cells you are covering, if using proximity beacon
                        //TODO
                        if(user) {
                            userDB.findOneAndUpdate({id: JSONMessage.clientID}, 
                                {
                                    currentLocation : {
                                        x_coordinate : response.x,
                                        y_coordinate : response.y,
                                        timestamp : Date.now(),
                                        mapName : response.map
                                    },
                                    destination : JSONMessage.destination,
                                    mode : JSONMessage.mode
                                }, {new: true}, (err, updatedUser) => {})
                        } else {
                            const newUser = new userDB(
                                {
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
                            newUser.save((err) => {
                                if(err) console.log(err);
                                else console.log(newUser);
                            })
                        }
                        userDB.findOne({status: 'available'})
                            .exec()
                            .then((loomo) => {
                                if(loomo){
                                    var msg = {
                                        clientID : JSONMessage.clientID,
                                        loomoID : loomo.id,
                                        //TODO
                                        //center of user beacon response
                                        x_coordinate : 1,
                                        y_coordinate : 1,
                                    }
                                    var tmpMsg = {
                                        status : 'available',
                                        loomoID : loomo.id
                                    }
                                    //TODO
                                    //remove next 2 lines
                                    client.publish(`${C.S2M}/${C.loomoStatus}`,JSON.stringify(tmpMsg), () => {});
                                    // setTimeout(() => {
                                    //     client.publish(`${C.S2M}/${C.loomoArrival}`, "loomo here", () => {});
                                    // }, 3000);
                                    client.publish(`${C.S2L}/${C.loomoCall}`, JSON.stringify(msg), () => {});
                                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoCall}` + "'");
                                } else {
                                    var msg = {status: 'unavailable'};
                                    client.publish(`${C.S2M}/${C.loomoStatus}`, JSON.stringify(msg), () => {});
                                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoStatus}` + "'");
                                }
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                });           
                break;

            case `${C.M2S}/${C.userDestination}`:
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2L}/${C.userDestination}`,JSON.stringify(msg), ()=> {});
                client.publish(`${C.S2M}/${C.userDestination}`,JSON.stringify(msg), () => {});
                break;

            case `${C.M2S}/${C.loomoDismissal}`:
                var msg = {
                    loomoID : JSONMessage.loomoID
                };
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2L}/${C.loomoDismissal}` + "'");
                client.publish(`${C.S2L}/${C.loomoDismissal}`, JSON.stringify(msg), ()=>{});
                //TODO
                //remove next line
                client.publish(`${C.L2S}/${C.loomoDismissal}`, JSON.stringify(msg), ()=>{});
                break;
        }
    });
}

module.exports = mobileMessenger;