var mqtt            = require('mqtt'),
    map             = require('./models/map'),
    C               = require('./constants'),
    test            = require('./test/test'),
    mware           = require('./middleware/middleware'),
    loomoMessenger  = require('./routes/loomo'),
    mobileMessenger = require('./routes/mobile'),
    TEST            = false,
    ERROR           = true;

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
    loomoMessenger.run(client,mware);
    mobileMessenger.run(client,mware);

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