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

BTTrilat.signalToDistance = (rssiSignal) => {
    const tXPower = -57
    const n = 2.25
    return Math.pow(10,(tXPower-rssiSignal)/(10*n));
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

BTTrilat.run = (JSONStr) => {
    var JSONObj = JSON.parse(JSONStr);
    var signalsData = JSONObj.BeaconSignals;
    beaconArray = [];
    return new Promise((resolve, reject) => {
        for(var p in signalsData){
            Object.keys(signalsData[p]).forEach( (beaconID) => {
                var currentBeacon = new beaconObj(beaconID);
                var arrays = signalsData[p][beaconID];
                var signal = BTTrilat.getDistance(JSON.parse(arrays));
                console.log("Value: "+signal);
                currentBeacon.setRadius(BTTrilat.signalToDistance(signal));
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
                        //BTTrilat.findIntersection(beaconArray);
                        resolve(BTTrilat.findPosition(beaconArray), {map: currentBeacon.map});
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
    console.log("Intersections are: "+intersections);
}

BTTrilat.findPosition = (beaconArray) => {
    beaconTriLat = []
    console.log(beaconArray);
    for(i in beaconArray){
        var x = beaconArray[i].x;
        var y = beaconArray[i].y;
        var distance = beaconArray[i].radius;
        beaconTriLat.push(
            new Circle(new Vector(x,y),distance)
        )
    }
   
  // Laterating
  return laterate(beaconTriLat);
}

module.exports = BTTrilat;


