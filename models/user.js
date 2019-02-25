var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

var UserSchema = new mongoose.Schema({
    entity : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    },
    currentLocation : {
        coorindates : String,
        timestamp : {
            type : Number,
            default : Date.now
        },
        accuracy : Number,
        mapName : String
    }
});

module.exports = mongoose.model("User",UserSchema);