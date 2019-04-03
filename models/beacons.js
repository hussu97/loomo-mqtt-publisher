var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

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
    x_coordinate : {
        type : Number,
        required : true
    },
    y_coordinate : {
        type : Number,
        required : true
    },
    mapName : String
});

module.exports = mongoose.model("Beacon",BeaconSchema);