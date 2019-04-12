var mongoose     = require('mongoose');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

var doorSchema = new mongoose.Schema({
    name : String,
    x_coordinate : {
        type : Number,
        required : true
    },
    y_coordinate : {
        type : Number,
        required : true
    }
});

var homeStationSchema = new mongoose.Schema({
    name : String,
    x_coordinate : {
        type : Number,
        required : true
    },
    y_coordinate : {
        type : Number,
        required : true
    },
});

var obstacleSchema = new mongoose.Schema({
    corners : {
        0 : String,
        1 : String,
        2 : String,
        3 : String
    }
});

var destinationSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    x_coordinate : {
        type : Number,
        required : true
    },
    y_coordinate : {
        type : Number,
        required : true
    }
});

var MapSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    cellSize : {
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
    beaconIDs : [String],
    obstacles : [obstacleSchema],
    timeStamp : {
        type : Number,
        required : true,
        default : Date.now
    },
    destinations : [destinationSchema],
    homeStations : [homeStationSchema],
    loomoIDs : [String]
});

module.exports = mongoose.model("Map",MapSchema);