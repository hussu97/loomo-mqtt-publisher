var mongoose     = require('mongoose'),
    beaconSchema = require('./beacons');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

var doorSchema = new mongoose.Schema({
    id : String,
    corners : {
        0 : String,
        1 : String,
        2 : String,
        3 : String
    }
});

var obstacleSchema = new mongoose.Schema({
    corners : {
        0 : String,
        1 : String,
        2 : String,
        3 : String
    }
});
var MapSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    cellWidth : {
        type : Number,
        required : true
    },
    cellHeight : {
        type : Number,
        required : true
    },
    rows : {
        type : Number,
        required : true
    },
    columns : {
        type : Number,
        required : true
    },
    doors : [doorSchema],
    beacons : [beaconSchema],
    obstacles : [obstacleSchema]
});

module.exports = mongoose.model("Map",MapSchema);