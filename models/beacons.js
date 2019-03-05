var mongoose = require('mongoose');

var BeaconSchema = new mongoose.Schema({
    id : String,
    height : Number,
    corners : {
        0 : String,
        1 : String,
        2 : String,
        3 : String
    }
});

module.exports = BeaconSchema;