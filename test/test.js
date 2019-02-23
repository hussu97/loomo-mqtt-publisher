var map = require('../models/map');

var test = {};
test.createSampleMap = () => {
    console.log(map)
    map.create(
        {
            name : 'SampleMap',
            cellWidth : 4,
            cellHeight : 4,
            rows : 15,
            columns : 25,
            beacons : [
                {
                    id : 'w20wsi0skw0ks',
                    corners : {
                        0 : '5,6',
                        1 : '5,6',
                        2 : '5,6',
                        3 : '5,6',
                    }
                },
                {
                    id : 'e33i230ei3209ei3',
                    corners : {
                        0 : '3,6',
                        1 : '3,6',
                        2 : '3,6',
                        3 : '3,6',
                    }
                },
                {
                    id : 'e2jo2koeok3ok23o',
                    corners : {
                        0 : '4,9',
                        1 : '4,9',
                        2 : '4,9',
                        3 : '4,9',
                    }
                },
            ]
        }, (err, newMap) => {
            if (err) console.log('Error in creating map: '+err);
        }
    )
}

module.exports = test;