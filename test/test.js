var map      = require('../models/map'),
    user     = require('../models/user'),
    mware    = require('../middleware/middleware'),
    beacon   = require('../models/beacons'),
    tour     = require('../models/tours'),
    BTTrilat = require('../trilateration/index');

var test = {};
test.createSampleMap = () => {
    map.create(
        {
            name : 'EB1-Rotunda',
            cellWidth : 100,
            rows : 25,
            columns : 25,
            beaconIDs : ['59bfdda585767280f886db284653ee35','3c52a5930c34db229451868164d7fc13','e158516ea666f214c38d5464c5440d1f','5812ca89ff64bf356564f5ee641f6f1b'],
            destinations : [
                test.createDestinationObj('EB1-103','6,5',4,6),
                test.createDestinationObj('EB1-104','6,5',4,6),
                test.createDestinationObj('EB1-105','6,5',4,6),
                test.createDestinationObj('EB1-106','6,5',4,6),
                test.createDestinationObj('EB1-107','6,5',4,6),
                test.createDestinationObj('EB1-108','6,5',4,6),
                test.createDestinationObj('EB1-109','6,5',4,6),
            ],
            doors : [
                {
                    id : 'doorA',
                    corners : {
                        0 : '4,5',
                        1 : '4,7',
                        2 : '5,5',
                        3 : '5,7'
                    },
                    x_coordinate : 7,
                    y_coordinate : 5
                }
            ]
        }, (err, newMap) => {
            if (err) console.log('Error in creating map: '+err);
        }
    )
}
test.createDestinationObj = (name, corner, x_coordinate,y_coordinate) => {
    return {
        name : name,
        corners : {
            0 : corner,
            1 : corner,
            2 : corner,
            3 : corner
        },
        x_coordinate : x_coordinate,
        y_coordinate : y_coordinate
    };
}
test.createBeaconObj = (id, mapName, height, corner,x_coordinate,y_coordinate) => {
    return {
        id : id,
        mapName : mapName,
        height : height,
        corners : {
            0 : corner,
            1 : corner,
            2 : corner,
            3 : corner
        },
        x_coordinate : x_coordinate,
        y_coordinate : y_coordinate
    };
}

test.createSampleBeacons = () => {
    beacon.create(
        [
        test.createBeaconObj("59bfdda585767280f886db284653ee35", "EB1-Rotunda", 24.56, '4,5',4,6),
        test.createBeaconObj("5812ca89ff64bf356564f5ee641f6f1b", "EB1-Rotunda", 24.56, '1,5',4,6),
        test.createBeaconObj("3c52a5930c34db229451868164d7fc13", "EB1-Rotunda", 24.56, '2,5',4,6),
        test.createBeaconObj("e158516ea666f214c38d5464c5440d1f", "EB1-Rotunda", 24.56, '6,5',4,6),
        test.createBeaconObj("d9b0b6f879088d8f767576e07841e43a", "EB1-Rotunda", 24.56, '6,5',4,6),
        test.createBeaconObj("4454649ebee76a8e5f23a202825c8401", "EB1-Rotunda", 24.56, '6,5',4,6),
        test.createBeaconObj("6a811095d963f29290ea5371b4177020", "EB1-Rotunda", 24.56, '6,5',4,6),
        test.createBeaconObj("283acdcf5be28c0f71dc4b6a84219d29", "EB1-Rotunda", 24.56, '6,5',4,6)
        ], (err, newBeacons) => {
            if(err) console.log('Error in creating beacons: '+err);
        }
    )
}
test.createSampleUser = () => {
    user.create(
        {
            entity : 'loomo',
            id   : 'w2i0wi20',
            currentLocation : {
                coordinates : '5.6,9.8',
                mapName : 'SampleMap'
            }

        }, (err, newUser) => {
            if (err) console.log('Error in creating user: '+err);
        }
    )
}
test.createSampleTour = () => {
    tour.create(
        {
            name : 'Demo Tour',
            mapName : 'EB1-Rotunda',
            destinations : [
                {
                    destinationName : 'EB1-103',
                    speech : 'Here is EB1-103'
                },
                {
                    destinationName : 'EB1-106',
                    speech : 'Here is not EB1-103, but it is in fact EB1-106'
                }
            ]
        }
    )
}
module.exports = test;