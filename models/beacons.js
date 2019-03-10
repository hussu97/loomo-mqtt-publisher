var mongoose = require('mongoose');

var BeaconSchema = new mongoose.Schema({
    id : {
        type: String,
        required : true
    },
    height : {
        type : Number,
        required : true
    },
    corners : {
        0 : String,
        1 : String,
        2 : String,
        3 : String
    },
    mapName : String
});

module.exports = mongoose.model("Beacon",BeaconSchema);