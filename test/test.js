var map      = require('../models/map'),
    user     = require('../models/user'),
    mware    = require('../middleware/middleware'),
    beacon   = require('../models/beacons'),
    tour     = require('../models/tours'),
    BTTrilat = require('../trilateration/index');

const floorPlanToReal = 100;
const cellSize = 100;
const N = 0,
E = -Math.PI/2,
W = Math.PI/2,
S = Math.PI;

var test = {};
test.createSampleMap = () => {
    map.create(
        {
            name : 'EB1-Rotunda',
            cellSize : cellSize,
            rows : test.convertToServerCoord(15.15),
            columns : test.convertToServerCoord(16.7),
            beaconIDs : ['59bfdda585767280f886db284653ee35','3c52a5930c34db229451868164d7fc13','e158516ea666f214c38d5464c5440d1f','5812ca89ff64bf356564f5ee641f6f1b'],
            destinations : [
                test.createDestinationObj('EB1-101',3,10.5,S),
                test.createDestinationObj('EB1-102',3,11.2,W),
                test.createDestinationObj('Washroom',5.6,13,W),
                test.createDestinationObj('Elevator',7.4,12,W),
                test.createDestinationObj('EB1-107A',9,12,N),
                test.createDestinationObj('EB1-112',10.1,9,N),
                test.createDestinationObj('EB1-113',10.1,7,N),
                test.createDestinationObj('EB1-114',10,3.5,N),
                test.createDestinationObj('EB1-115',9,4.4,E),
                test.createDestinationObj('EB1-116',5,4.5,E),
                test.createDestinationObj('EB1-119',3,5,E),
                test.createDestinationObj('EB1-120',3.5,6,S),
                test.createDestinationObj('Entrance/Exit',3.5,8.3,S),

            ],
            homeStations : [
                {
                    name : 'homeA',
                    x_coordinate : test.convertToServerCoord(3.5),
                    y_coordinate : test.convertToServerCoord(7)
                }
            ],
            obstacles : [
                test.createObstacleObj(0,15.15,0,3.7),
                test.createObstacleObj(10.2,15.15,0,11.1),
                test.createObstacleObj(0,2.7,0,16.7),
                test.createObstacleObj(3.4,5.3,12.5,16.7),
                test.createObstacleObj(5.3,6.6,14.0,16.7),
                test.createObstacleObj(6.6,15.15,12.5,16.7),
                test.createObstacleObj(10.8,15.15,0,16.7)
            ]
        }, (err, newMap) => {
            if (err) console.log('Error in creating map: '+err);
        }
    )
}

test.createEB2Map = () => {
    map.create(
        {
            name : 'EB2-Rotunda',
            cellSize : cellSize,
            rows : test.convertToServerCoord(36.22),
            columns : test.convertToServerCoord(40.38),
            beaconIDs : ['59bfdda585767280f886db284653ee35','3c52a5930c34db229451868164d7fc13','e158516ea666f214c38d5464c5440d1f','5812ca89ff64bf356564f5ee641f6f1b'],
            destinations : [
                test.createDestinationObj('EB2-125',6.893,11.458,N),
                test.createDestinationObj('Praveena',6.893,11.458,N),
                test.createDestinationObj('Suresh',6.893,11.458,N),
                test.createDestinationObj('Washroom',15.207,11.636,W),
                test.createDestinationObj('Stairs',15.207,11.636,W),
                test.createDestinationObj('Elevator',17.248,11.636,W),
                test.createDestinationObj('Cisco Lab',21.750,11.549,W),
                test.createDestinationObj('Wissam',21.750,11.549,W),
                test.createDestinationObj('IoT Lab',26.884,11.325,S),
                test.createDestinationObj('EB2-109',26.069,27.968,S),
                test.createDestinationObj('EB2-108',26.383,28.5,E),
                test.createDestinationObj('EB2-104',23.760,28.5,E),
                test.createDestinationObj('EB2-103',11.882,28.5,E),
                test.createDestinationObj('Hicham',7.148,28.5,N),
                test.createDestinationObj('IT-Dept',7.148,28.5,N),
                test.createDestinationObj('Entrance/Exit',8.2,19.99,N),
                test.createDestinationObj('destA',11,23,N),
                test.createDestinationObj('destB',13,21,N),
                test.createDestinationObj('destC',15,23,E),
                test.createDestinationObj('destD',14,23,S),
            ],
            homeStations : [
                {
                    name : 'homeA',
                    x_coordinate : test.convertToServerCoord(8.2),
                    y_coordinate : test.convertToServerCoord(19.99),
                    thetha : N
                }
            ],
            obstacles : [
                test.createObstacleObj(0,7.319,0,40.380),
                test.createObstacleObj(0,36.220,0,10.202),
                test.createObstacleObj(26.075,36.22,12.308,30),
                test.createObstacleObj(0,36.22,30,40.38)
            ]
        }, (err, newMap) => {
            if (err) console.log('Error in creating map: '+err);
        }
    )
}

test.createSDLMap = () => {
    map.create(
        {
            name : 'SDL',
            cellSize : cellSize,
            rows : test.convertToServerCoord(9.50),
            columns : test.convertToServerCoord(5.00),
            beaconIDs : ['59bfdda585767280f886db284653ee35','3c52a5930c34db229451868164d7fc13','e158516ea666f214c38d5464c5440d1f','5812ca89ff64bf356564f5ee641f6f1b'],
            destinations : [
                test.createDestinationObj('destA',5,1,S),
            ],
            homeStations : [
                {
                    name : 'homeA',
                    x_coordinate : test.convertToServerCoord(1.00),
                    y_coordinate : test.convertToServerCoord(2.00),
                    thetha : N
                }
            ],
            obstacles : [
                test.createObstacleObj(0,9.50,0,1.0),
                test.createObstacleObj(0,1.0,0,5.0),
                test.createObstacleObj(0,9.50,4.0,5.0),
                test.createObstacleObj(8.5,9.5,0,5.0)
            ]
        }, (err, newMap) => {
            if (err) console.log('Error in creating map: '+err);
        }
    )
}

test.createDestinationObj = (name, x_coordinate, y_coordinate, thetha) => {
    return {
        name : name,
        x_coordinate : test.convertToServerCoord(x_coordinate),
        y_coordinate : test.convertToServerCoord(y_coordinate),
        thetha : thetha
    };
}



test.convertToServerCoord = (coordinate) => {
    return coordinate*floorPlanToReal/cellSize;
}

test.createObstacleObj = (x1,x2,y1,y2) => {
    x1 = test.convertToServerCoord(x1);
    x2 = test.convertToServerCoord(x2);
    y1 = test.convertToServerCoord(y1);
    y2 = test.convertToServerCoord(y2);
    return {
        corners : {
            0 : `${x1},${y1}`,
            1 : `${x1},${y2}`,
            2 : `${x2},${y1}`,
            3 : `${x2},${y2}`,
        }
    }
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
        test.createBeaconObj("59bfdda585767280f886db284653ee35", "EB1-Rotunda", 24.56, '4,5',1,6),
        test.createBeaconObj("5812ca89ff64bf356564f5ee641f6f1b", "EB1-Rotunda", 24.56, '1,5',2,6),
        test.createBeaconObj("3c52a5930c34db229451868164d7fc13", "EB1-Rotunda", 24.56, '2,5',3,6),
        test.createBeaconObj("e158516ea666f214c38d5464c5440d1f", "EB1-Rotunda", 24.56, '6,5',4,6),
        test.createBeaconObj("d9b0b6f879088d8f767576e07841e43a", "EB1-Rotunda", 24.56, '6,5',5,6),
        test.createBeaconObj("4454649ebee76a8e5f23a202825c8401", "EB1-Rotunda", 24.56, '6,5',6,6),
        test.createBeaconObj("6a811095d963f29290ea5371b4177020", "EB1-Rotunda", 24.56, '6,5',7,6),
        test.createBeaconObj("283acdcf5be28c0f71dc4b6a84219d29", "EB1-Rotunda", 24.56, '6,5',8,6)
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
test.createTourDestinationObj = (destinationName, speech, order) => {
    return {
        destinationName : destinationName,
        speech : speech,
        order : order
    }
} 
test.createSampleTour = () => {
    // tour.create(
    //     {
    //         name : 'EB2 Tour',
    //         tourName : 'EB2-Rotunda',
    //         destinations : [
    //             test.createTourDestinationObj('Praveena','This is the office of Miss Praveena and Mr Suresh. It is also the Computer Science and Engineering lab',1),
    //             test.createTourDestinationObj('Elevator','You can go to the second floor or the basement from this elevator',2),
    //             test.createTourDestinationObj('IoT-Lab','You can go forward and see all the cool rooms we have for you',3),
    //             test.createTourDestinationObj('Hicham','Here we have the office of Dr. Hicham, and the IT-Department',4),
    //         ]
    //     }
    // )
    tour.create(
        {
            name : 'EB2 Tour',
            mapName : 'EB2-Rotunda',
            destinations : [
                test.createTourDestinationObj('destA','This is destination A',1),
                test.createTourDestinationObj('destB','This is destination B',2),
                test.createTourDestinationObj('destC','This is destination C',3),
                test.createTourDestinationObj('destD','This is destination D',4),
            ]
        }
    )
}
module.exports = test;