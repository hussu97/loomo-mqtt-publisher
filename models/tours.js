var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

var UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    mapName : {
        type : String,
        required : true
    },
    destinations : [
        {
            destinationName : {
                type : String,
                required : true
            },
            speech : String
        }
    ]
});

module.exports = mongoose.model("Tour",UserSchema);