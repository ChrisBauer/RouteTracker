import {Route} from 'modules/route';
import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';

@inject(HttpClient)
export class NewRoute {

    constructor(http) {
        this.isStarted = false;
        this.isFinished = false;

        http.configure(config => {
            config.withBaseUrl('http://localhost:3000/route');
        });

        this.http = http;
        this.routeID = null;
    }

    startRoute() {
        this.route = new Route();
        this.http.fetch('', {
            method: 'post'
        }).then(response => response.json())
            .then(data => {
                this.routeID = data.id;
                console.log(data);
                this.isStarted = true;
            });
    }

    addWaypoint() {
        if (this.route) {
            this.route.addWaypoint()
                .then(waypoint => {
                    this.http.fetch('/' + this.routeID + '/addWaypoint', {
                        method: 'post',
                        body: json(waypoint)
                    }).catch(e => {
                        console.log(e);
                    }).then(response => response.json())
                    .then(data => {
                        console.log(data);
                    })

                    if (!this.map) {
                        this.map = new google.maps.Map(document.getElementById('routeMap'), {
                            zoom: 11,
                            center: waypoint
                        });
                    }

                    var marker = new google.maps.Marker({
                        position: waypoint,
                        map: this.map,
                        title: '' + waypoint.seq,
                        label: '' + waypoint.seq
                    });
                    
                    this.map.panTo(marker.getPosition())
                });
        }
    }

    finishRoute() {
        if (!this.finishInProgress) {
            this.finishInProgress = true;
            this.http.fetch('/' + this.routeID + '/finalize', {
                method: 'post'
            }).then(response => response.json())
            .then(data => {
                this.finishInProgress = false;
                this.isFinished = true;
                console.log(data);
                console.log(this.route.waypoints);
            });
        }
    }
}