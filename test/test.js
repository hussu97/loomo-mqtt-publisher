var map      = require('../models/map'),
    user     = require('../models/user'),
    mware    = require('../middleware/middleware'),
    beacon   = require('../models/beacons'),
    tour     = require('../models/tours'),
    BTTrilat = require('../trilateration/index');

const floorPlanToReal = 100;
const cellSize = 70;
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

// test.createEB2Map = () => {
//     map.create(
//         {
//             name : 'EB2-Rotunda',
//             cellSize : cellSize,
//             rows : test.convertToServerCoord(36.22),
//             columns : test.convertToServerCoord(40.38),
//             beaconIDs : ['59bfdda585767280f886db284653ee35','3c52a5930c34db229451868164d7fc13','e158516ea666f214c38d5464c5440d1f','5812ca89ff64bf356564f5ee641f6f1b'],
//             destinations : [
//                 test.createDestinationObj('EB2-125',6.893,11.458,N),
//                 test.createDestinationObj('Praveena',6.893,11.458,N),
//                 test.createDestinationObj('Suresh',6.893,11.458,N),
//                 test.createDestinationObj('Washroom',15.207,11.636,W),
//                 test.createDestinationObj('Stairs',15.207,11.636,W),
//                 test.createDestinationObj('Elevator',17.248,11.636,W),
//                 test.createDestinationObj('Cisco Lab',21.750,11.549,W),
//                 test.createDestinationObj('Wissam',21.750,11.549,W),
//                 test.createDestinationObj('IoT Lab',26.884,11.325,S),
//                 test.createDestinationObj('EB2-109',26.069,27.968,S),
//                 test.createDestinationObj('EB2-108',26.383,28.5,E),
//                 test.createDestinationObj('EB2-104',23.760,28.5,E),
//                 test.createDestinationObj('EB2-103',11.882,28.5,E),
//                 test.createDestinationObj('Hicham',7.148,28.5,N),
//                 test.createDestinationObj('IT-Dept',7.148,28.5,N),
//                 test.createDestinationObj('Entrance/Exit',8.2,19.99,N),
//                 test.createDestinationObj('destA',11,23,N),
//                 test.createDestinationObj('destB',13,21,N),
//                 test.createDestinationObj('destC',15,23,E),
//                 test.createDestinationObj('destD',14,23,S),
//             ],
//             homeStations : [
//                 {
//                     name : 'homeA',
//                     x_coordinate : test.convertToServerCoord(8.2),
//                     y_coordinate : test.convertToServerCoord(19.99),
//                     thetha : N
//                 }
//             ],
//             obstacles : [
//                 test.createObstacleObj(0,7.319,0,40.380),
//                 test.createObstacleObj(0,36.220,0,10.202),
//                 test.createObstacleObj(26.075,36.22,12.308,30),
//                 test.createObstacleObj(0,36.22,30,40.38)
//             ]
//         }, (err, newMap) => {
//             if (err) console.log('Error in creating map: '+err);
//         }
//     )
// }

test.createEB2Map = () => {
    map.findOneAndUpdate({name: 'EB2-Rotunda'}, 
        {
            name : 'EB2-Rotunda',
            cellSize : cellSize,
            rows : test.convertToServerCoord(36.22),
            columns : test.convertToServerCoord(40.38),
            beaconIDs : [
                '59bfdda585767280f886db284653ee35',
                '3c52a5930c34db229451868164d7fc13',
                'e158516ea666f214c38d5464c5440d1f',
                '5812ca89ff64bf356564f5ee641f6f1b',
                'd9b0b6f879088d8f767576e07841e43a',
                '4454649ebee76a8e5f23a202825c8401',
                '6a811095d963f29290ea5371b4177020',
                '283acdcf5be28c0f71dc4b6a84219d29'
            ],
            destinations : [
                test.createDestinationObj('TV Wall',21.858,20,S),//
                test.createDestinationObj('EB2-125',9.7,14.8,W),//
                test.createDestinationObj('Praveena',9.7,14.8,W),
                test.createDestinationObj('Suresh',9.7,14.8,W),
                test.createDestinationObj('Washroom',15.16,12.104,W),//
                test.createDestinationObj('Stairs',15.16,12.104,W),//
                test.createDestinationObj('Elevator',17.16,12.104,W),
                test.createDestinationObj('Cisco Lab',18.46,12.104,W),//
                test.createDestinationObj('Wissam',18.46,12.104,W),
                test.createDestinationObj('EB2-109',23.4,29.104,E),//
                test.createDestinationObj('EB2-108',23.4,29.104,E),
                test.createDestinationObj('EB2-104',18.4,29.104,E),//
                test.createDestinationObj('EB2-103',12.4,29.104,E),//
                test.createDestinationObj('Hicham',9.46,26.90,E),//
                test.createDestinationObj('IT-Dept',9.46,26.90,E),
                test.createDestinationObj('Entrance/Exit',8.26,20,N)
            ],
            homeStations : [
                {
                    name : 'homeA',
                    x_coordinate : test.convertToServerCoord(9.86),
                    y_coordinate : test.convertToServerCoord(17.304),
                    thetha : N
                }
            ],
            timeStamp : Date.now(),
            obstacles : [
                test.createObstacleObj(0,14.06,0,10.104),//1
                test.createObstacleObj(0,3.86,10.104,12.808),//2
                test.createObstacleObj(0,6.26,12.808,32.304),//3
                test.createObstacleObj(0,5.06,32.304,33.804),//4
                test.createObstacleObj(0,17.36,33.804,40.380),//5
                test.createObstacleObj(17.36,23.06,33.804,40.380),//6 // can be combined with 5
                test.createObstacleObj(23.06,36.220,33.804,40.380),//7
                test.createObstacleObj(25.46,36.220,0,33.804),//8
                // test.createObstacleObj(26.258,36.220,0,26.686),//9
                // test.createObstacleObj(23.053,26.258,0,10.183),//10
                test.createObstacleObj(16.16,25.46,0,10.104),//11
                // test.createObstacleObj(16.16,20.66,0,10.104),//12
                test.createObstacleObj(20.46,25.46,10.104,13.104),//13
                test.createObstacleObj(21.46,25.46,31.104,33.804),//14
                test.createObstacleObj(6.26,10.46,31.104,33.804),//15
                test.createObstacleObj(6.26,12.56,10.104,12.8),//16
                test.createObstacleObj(6.26,7.76,12.804,17.604),//17
                test.createObstacleObj(23.858,26.258,17.604,21.804),//18
                test.createObstacleObj(6.26,7.46,23.304,26.904)//19
            ]
        }, (err, newMap) => {
            console.log(newMap)
            if (err) console.log('Error in creating map: '+err);
        }
    )
}

test.createEB2v2Map = () => {
    map.findOneAndUpdate({name: 'EB2v2-Rotunda'}, 
        {
            name : 'EB2v2-Rotunda',
            cellSize : cellSize,
            rows : test.convertToServerCoord(20.8),
            columns : test.convertToServerCoord(20.5),
            beaconIDs : [
                '59bfdda585767280f886db284653ee35',
                '3c52a5930c34db229451868164d7fc13',
                'e158516ea666f214c38d5464c5440d1f',
                '5812ca89ff64bf356564f5ee641f6f1b',
                'd9b0b6f879088d8f767576e07841e43a',
                '4454649ebee76a8e5f23a202825c8401',
                '6a811095d963f29290ea5371b4177020',
                '283acdcf5be28c0f71dc4b6a84219d29'
            ],
            homeStations : [
                {
                    name : 'homeA',
                    x_coordinate : test.convertToServerCoord(4.2),
                    y_coordinate : test.convertToServerCoord(8.4),
                    thetha : N
                }
            ],
            timeStamp : Date.now(),
            obstacles : [
                test.createObstacleObj(0,20.8,0,1.0),//1-o
                test.createObstacleObj(0,1.0,0,20.5),//2-o
                test.createObstacleObj(0,20.8,19.5,20.5),//3-o
                test.createObstacleObj(19.8,20.8,0,20.5),//4-o
                test.createObstacleObj(1,2.8,3.4,8.8),//1
                test.createObstacleObj(1,7.6,1,3.5),//2 
                test.createObstacleObj(14.5,20.8,1,4),//3
                test.createObstacleObj(17.49,20.8,8.2,13),//4
                test.createObstacleObj(16.4,20.8,18.1,20.5),//5
                test.createObstacleObj(1,5.2,17.49,20.5),//6
                test.createObstacleObj(1,2.2,13.9,20.5),//7
            ],
            destinations : [
                test.createDestinationObj('TV Wall',18.1,12.7,S),//
                test.createDestinationObj('EB2-125',3.7,4.9,W),//
                test.createDestinationObj('Praveena',3.7,4.9,W),
                test.createDestinationObj('Suresh',3.7,4.9,W),
                test.createDestinationObj('Washroom',9.4,2.8,W),//
                test.createDestinationObj('Stairs',9.4,2.8,W),//
                test.createDestinationObj('Elevator',11.8,2.8,W),
                test.createDestinationObj('Cisco Lab',13.6,2.8,W),//
                test.createDestinationObj('Wissam',13.6,2.8,W),
                test.createDestinationObj('EB2-109',19,16.9,E),//
                test.createDestinationObj('EB2-108',19,16.9,E),
                test.createDestinationObj('EB2-104',16.6,16.9,E),//
                test.createDestinationObj('EB2-103',6.4,16.9,E),//
                test.createDestinationObj('Hicham',2.8,16.9,E),//
                test.createDestinationObj('IT-Dept',2.8,16.9,E),
                test.createDestinationObj('Entrance/Exit',2.5,11.2,N)
            ],
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
            beaconIDs : [
                '59bfdda585767280f886db284653ee35',
                '3c52a5930c34db229451868164d7fc13',
                'e158516ea666f214c38d5464c5440d1f',
                '5812ca89ff64bf356564f5ee641f6f1b',
                'd9b0b6f879088d8f767576e07841e43a',
                '4454649ebee76a8e5f23a202825c8401',
                '6a811095d963f29290ea5371b4177020',
                '283acdcf5be28c0f71dc4b6a84219d29'
            ],
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

test.createBeaconObj = (id, name,x_coordinate,y_coordinate) => {
    return {
        id : id,
        mapName : 'EB2-Rotunda',
        x_coordinate : test.convertToServerCoord(x_coordinate),
        y_coordinate : test.convertToServerCoord(y_coordinate),
        name : name
    };
}

test.createSampleBeacons = () => {
    beacon.create(
        [
        test.createBeaconObj("e158516ea666f214c38d5464c5440d1f", 'Blueberry B',10,10.9),
        test.createBeaconObj("3c52a5930c34db229451868164d7fc13", 'Coconut B',19,16.9),
        test.createBeaconObj("59bfdda585767280f886db284653ee35", 'Icy B',11.5,16.9),
        test.createBeaconObj("5812ca89ff64bf356564f5ee641f6f1b", 'Mint B',2.8,16.9),
        test.createBeaconObj("d9b0b6f879088d8f767576e07841e43a", 'Blueberry A',9.4,2.8),
        test.createBeaconObj("4454649ebee76a8e5f23a202825c8401", 'Coconut A',13.6,2.8),
        test.createBeaconObj("283acdcf5be28c0f71dc4b6a84219d29", 'Icy A',18.1,12.7),
        test.createBeaconObj("6a811095d963f29290ea5371b4177020", 'Mint A',3.7,6.1),
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
    tour.findOneAndUpdate({mapName:'EB2v2-Rotunda'},
        {
            name : 'EB2 Tour',
            mapName : 'EB2v2-Rotunda',
            destinations : [
                test.createTourDestinationObj('EB2-125','I have reached one two five. You can also visit Miss Praveena and Mister Suresh office over here',1),
                test.createTourDestinationObj('Stairs','I have reached the stairs and the washroom. You can access the other floors from here',2),
                test.createTourDestinationObj('Elevator','I have reached the elevator. This is quicker to access the other floors from',3),
                test.createTourDestinationObj('Cisco Lab','I have reached the Cisco Lab. You can also visit Mister Wissam office from here',4)
            ]
        },(err,newTour) =>{
            if(err) console.log(err);
        }
    )
    // tour.create(
    //     {
    //         name : 'EB2 Tour',
    //         mapName : 'EB2-Rotunda',
    //         destinations : [
    //             test.createTourDestinationObj('destA','This is destination A',1),
    //             test.createTourDestinationObj('destB','This is destination B',2),
    //             test.createTourDestinationObj('destC','This is destination C',3),
    //             test.createTourDestinationObj('destD','This is destination D',4),
    //         ]
    //     }
    // )
}
module.exports = test;