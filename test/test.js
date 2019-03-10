var map      = require('../models/map'),
    user     = require('../models/user'),
    mware    = require('../middleware/middleware'),
    beacon   = require('../models/beacons'),
    BTTrilat = require('../trilateration/index');

var test = {};
test.createSampleMap = () => {
    map.create(
        {
            name : 'SampleMap',
            cellWidth : 4,
            cellHeight : 4,
            rows : 15,
            columns : 25,
            beaconIDs : ['59bfdda585767280f886db284653ee35','3c52a5930c34db229451868164d7fc13','e158516ea666f214c38d5464c5440d1f','5812ca89ff64bf356564f5ee641f6f1b']
        }, (err, newMap) => {
            if (err) console.log('Error in creating map: '+err);
        }
    )
}
test.createSampleBeacons = () => {
    beacon.create(
        [{
            id: '283acdcf5be28c0f71dc4b6a84219d29',
            mapName : 'SampleMap',
            height : 42.56,
            corners : {
                0 : '9,9',
                1 : '9,9',
                2 : '9,9',
                3 : '9,9'
            }
        },
        {
            id: '6a811095d963f29290ea5371b4177020',
            mapName : 'SampleMap',
            height : 42.90,
            corners : {
                0 : '5,7',
                1 : '5,7',
                2 : '5,7',
                3 : '5,7'
            }
        },
        {
            id: '4454649ebee76a8e5f23a202825c8401',
            mapName : 'SampleMap',
            height : 67.90,
            corners : {
                0 : '18,10',
                1 : '18,10',
                2 : '18,10',
                3 : '18,10'
            } 
        },
        {
            id: 'd9b0b6f879088d8f767576e07841e43a',
            mapName : 'SampleMap',
            height : 36.90,
            corners : {
                0 : '1,10',
                1 : '1,10',
                2 : '1,10',
                3 : '1,10'
            } 
        }], (err, newBeacons) => {
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
module.exports = test;