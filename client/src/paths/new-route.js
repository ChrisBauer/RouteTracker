import {Route} from 'modules/route';


export class NewRoute {

    constructor() {
        this.isStarted = false;
        this.isFinished = false;
    }

    startRoute() {
        this.route = new Route();
        this.isStarted = true;
    }

    addWaypoint() {
        if (this.route) {
            this.route.addWaypoint()
            .then(wayPoint => {
                if (!this.map) {
                    this.map = new google.maps.Map(document.getElementById('routeMap'), {
                        zoom: 8,
                        center: wayPoint
                    });
                }
                
                var marker = new google.maps.Marker({
                    position: wayPoint,
                    map: this.map,
                    title: '' + wayPoint.index,
                    label: '' + wayPoint.index
                });
            });
        }
    }

    finishRoute() {
        this.isFinished = true;
        if (this.route) {
            console.log(this.route.wayPoints);
        }
    }
}