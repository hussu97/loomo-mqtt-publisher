var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/senior-design", { useNewUrlParser: true });

var TourSchema = new mongoose.Schema({
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
            speech : String,
            order : Number
        }
    ]
});

module.exports = mongoose.model("Tour",TourSchema);