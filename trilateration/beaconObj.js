class beaconObj {
    constructor(id) {
        this.id = id;
    }
    setMapName(map) {
        this.map = map;
    }
    setCoordinates(coordinate){
        var point = coordinate.split(",");
        this.x = Number(point[0]);
        this.y = Number(point[1]);
    }
    setHeight(height){
        this.height = Number(height);
    }
    setRadius(radius){
        this.radius = Number(radius);
    }
}

module.exports = beaconObj;