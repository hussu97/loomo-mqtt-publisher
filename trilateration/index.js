var KF = require('kalmanjs'),
    beaconDB = require('../models/beacons'),
    beaconObj = require('./beaconObj'),
    mapDB = require('../models/map'),
    userDB = require('../models/user'),
    trilateration = require('node-trilateration'),
    test = require('../test/test');

var lateration = require("lateration");
var Circle = lateration.Circle;
var Vector = lateration.Vector;
var laterate = lateration.laterate;
 
var svgIntersections = require('svg-intersections');
var intersect = svgIntersections.intersect;
var shape = svgIntersections.shape;
var BTTrilat = {}

const cornerKeys = ['0','1','2','3'];

BTTrilat.getDistance = (rssiArray) => {
    var kf = new KF();
    var KalmanArray = rssiArray.map(function(v) {
        return kf.filter(v);
      });
    return KalmanArray[KalmanArray.length-1];
}

BTTrilat.signalToDistance = (beaconID,rssiSignal) => {
    const beacons = {
        "5812ca89ff64bf356564f5ee641f6f1b" : -62,
        "3c52a5930c34db229451868164d7fc13" : -54,
        "59bfdda585767280f886db284653ee35" : -67,
        "e158516ea666f214c38d5464c5440d1f" : -57
    }
    if(beacons[beaconID]){
        const tXPower = beacons[beaconID];
    }
    else{
        const tXPower = -57;
    }
    const n = 2
    return Math.pow(10,(tXPower-rssiSignal)/(10*n))*100;
}

BTTrilat.findCenter = (points) => {
    var x = 0;
    var y = 0;
    for (i =0; i<points.length; i++) {
        var point = points[i].split(",");
        x += Number(point[0]);
        y += Number(point[1]);
    }
    return `${(x/points.length).toFixed(3)},${(y/points.length).toFixed(3)}`;
}

BTTrilat.findArea = (points,radii) => {

}

BTTrilat.getBeacon = (beaconID) =>{
    return beaconDB.findOne({id: beaconID}).exec();
}

BTTrilat.run = (JSONMessage) => {
    var signalsData = JSONMessage.beaconSignals;
    beaconArray = [];
    return new Promise((resolve,reject) => {
        resolve({x: 1, y: 1, map: "SampleMap"});
    });
    return new Promise((resolve, reject) => {
        for(var p in signalsData){
            Object.keys(signalsData[p]).forEach( (beaconID) => {
                var currentBeacon = new beaconObj(beaconID);
                var arrays = signalsData[p][beaconID];
                var signal = BTTrilat.getDistance(JSON.parse(arrays));

                currentBeacon.setRadius(BTTrilat.signalToDistance(currentBeacon.id,signal));
                
                beaconFromDBPromise = BTTrilat.getBeacon(currentBeacon.id);
                beaconFromDBPromise.then((beaconFromDB) => {
                    cornerCoords = []
                    for (i in cornerKeys){
                        cornerCoords.push(beaconFromDB.corners[i])
                    }

                    currentBeacon.setHeight(beaconFromDB.height);
                    currentBeacon.setCoordinates(BTTrilat.findCenter(cornerCoords));
                    currentBeacon.setMapName(beaconFromDB.mapName);
                    
                    beaconArray.push(currentBeacon);
                    if(beaconArray.length===signalsData.length){
                        BTTrilat.findIntersection(beaconArray);
                        resolve(BTTrilat.findPosition(beaconArray), "hello");
                    }
                });
            });
        }
    })
    
}

BTTrilat.findIntersection = (beaconArray) => {
    var intersections = intersect(
        shape("circle",{cx : beaconArray[0].x, cy: beaconArray[0].y, r : beaconArray[0].radius}),
        shape("circle",{cx : beaconArray[1].x, cy: beaconArray[1].y, r : beaconArray[1].radius}),
        shape("circle",{cx : beaconArray[2].x, cy: beaconArray[2].y, r : beaconArray[2].radius})
    );
    console.log("Intersections are: "+JSON.stringify(intersections));
}

BTTrilat.findPosition = (beaconArray) => {
    beaconTriLat = []
    for(i in beaconArray){
        var x = beaconArray[i].x;
        var y = beaconArray[i].y;
        var distance = beaconArray[i].radius;
        beaconTriLat.push(
            new Circle(new Vector(x,y),distance)
        )
    }
  return laterate(beaconTriLat);
}

module.exports = BTTrilat;


