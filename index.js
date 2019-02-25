var mqtt  = require('mqtt'),
    fs    = require('fs'),
    map   = require('./models/map'),
    C     = require('./constants'),
    test  = require('./test/test'),
    mware = require('./middleware/middleware'),
    TEST  = true,
    ERROR = true;

var options = {
    port: 17852 ,
    host: 'mqtt://m24.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'gwvgvrbb',
    password: 'ZaQHr9ysNDPm',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://m24.cloudmqtt.com', options);

if(TEST){
    test.createSampleMap();
    test.createSampleUser();
    //test.findSampleCenter();
}

client.on('connect', (packetInfo) => { // When connected
    mware.writeLog(new Date().toString() + ' Connected to MQTT Server');

    // subscribe to a topic
    client.subscribe(`${C.L2S}/#`);
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
                client.publish(`${C.S2M}/${C.userDestination}`,JSON.stringify(msg), ()=> {});
                client.publish(`${C.S2L}/${C.userDestination}`,JSON.stringify(msg), ()=> {});
                break;

            case `${C.M2S}/${C.loomoDismissal}`:
                if(ERROR){
                    var msg = {
                        type : 'loomo-dismissal',
                        message : 'loomo could not be dismissed'
                    };
                    mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.errorRoute}` + "'");
                    client.publish(`${C.S2M}/${C.errorRoute}`, JSON.stringify(msg), ()=>{});
                }
                break;

            case `${C.L2S}/${C.loomoArrival}`:
                var msg = JSON.parse(message);
                mware.writeLog(new Date().toString() + " Sent '"+JSON.stringify(msg) + "' to '" + `${C.S2M}/${C.loomoArrival}` + "'");
                client.publish(`${C.S2M}/${C.loomoArrival}`, JSON.stringify(msg), ()=>{});
                break;

        }
    });

    // publish a message to a topic
    // client.publish(`${C.M2S}/${C.userInfo}`, 'my message', function(err) {
    //     if(err){
    //         console.log('publish error: '+err)
    //     }
    //     console.log("Message is published");
    //     //client.end(); // Close the connection when published
    // });
});
client.on("error", (error) => { 
    console.log("Can't connect"+error);
});