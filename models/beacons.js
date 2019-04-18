var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

var BeaconSchema = new mongoose.Schema({
    id : {
        type: String,
        required : true
    },
    x_coordinate : {
        type : Number,
        required : true
    },
    y_coordinate : {
        type : Number,
        required : true
    },
    mapName : String,
    name : String,
});

module.exports = mongoose.model("Beacon", BeaconSchema);