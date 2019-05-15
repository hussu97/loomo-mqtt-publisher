var mqtt            = require('mqtt'),
    map             = require('./models/map'),
    C               = require('./constants'),
    test            = require('./test/test'),
    mware           = require('./middleware/middleware'),
    loomoMessenger  = require('./routes/loomo'),
    mobileMessenger = require('./routes/mobile'),
    rPiMessenger = require('./routes/rpi'),
    TEST            = false;

var options = {
    port: 17852 ,
    host: 'mqtt://m24.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'config@username',
    password: 'config@password',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var options2 = {
    port: 11466 ,
    host: 'mqtt://m16.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'config@username2',
    password: 'config@password2',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://m24.cloudmqtt.com', options);
var client2 = mqtt.connect('mqtt://m16.cloudmqtt.com',options2);

if(TEST){
    test.createSampleMap();
    test.createEB2Map();
    test.createEB2v2Map();
    test.createSampleUser();
    test.createSampleBeacons();
    test.findSampleCenter();
    test.createSampleTour();
    test.createSDLMap();
}

client.on('connect', (packetInfo) => { // When connected
    mware.writeLog(new Date().toString() + ' Connected to MQTT Server');
    loomoMessenger.run(client,mware);
    mobileMessenger.run(client,mware);
    adminMessenger.run(client,mware);
});
client2.on('connect',(packetInfo)=> {
    mware.writeLog(new Date().toString() + ' Connected to MQTT Server2');
    rPiMessenger.run(client,mware,client2);
})
client.on("error", (error) => { 
    
    mware.writeLog("MQTT server error: "+error);
});