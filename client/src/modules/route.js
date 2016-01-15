export class Route {
    
    constructor () {
        this.wayPoints = [];
        this.loc = navigator.geolocation || null;
        this.geoOptions = {
            timeout: 10000 // ms
        };
    }
 
    addWaypoint () {
        var self = this;
        if (self.loc) {
            return new Promise(function (resolve, reject) {
                self.loc.getCurrentPosition(
                    position => {
                        self.wayPoints.push({
                            tstamp: position.timestamp,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            index: self.wayPoints.length
                        });
                        resolve(self.wayPoints[self.wayPoints.length - 1]);
                    },
                    error => {
                        reject('Add Waypoint Failed. Reason: ' + error);
                    },
                    self.geoOptions);
            });
        }
        else {
            return Promise.reject('Geolocation Failed');
        }
    }
}