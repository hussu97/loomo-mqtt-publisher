var mqtt            = require('mqtt'),
    map             = require('./models/map'),
    C               = require('./constants'),
    test            = require('./test/test'),
    mware           = require('./middleware/middleware'),
    loomoMessenger  = require('./routes/loomo'),
    mobileMessenger = require('./routes/mobile'),
    TEST            = true,
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
    //test.createSampleMap();
    //test.createSampleUser();
    //test.createSampleBeacons();
    //test.findSampleCenter();
    //test.createSampleTour();
}

client.on('connect', (packetInfo) => { // When connected
    mware.writeLog(new Date().toString() + ' Connected to MQTT Server');
    loomoMessenger.run(client,mware);
    mobileMessenger.run(client,mware);
});

client.on("error", (error) => { 
    mware.writeLog("MQTT server error: "+error);
});