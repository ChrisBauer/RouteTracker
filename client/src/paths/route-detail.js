import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import Helper from 'modules/helpers';

@inject(HttpClient)
export class RouteDetail {

    constructor(http, element) {
        this.http = http.configure(config => {
            config.withBaseUrl('http://localhost:3000/route');
        });
    }

    activate(params, routeConfig, nav) {
        return this.http.fetch('/' + nav.params.id)
            .then(response => response.json())
            .then(response => this.route = response);
    }

    attached() {
        if (!this.map) {
            this.map = new google.maps.Map(this.detailMap, {
                zoom: 11,
                center: this.route.waypoints[this.route.waypoints.length / 2]
            });
        }

        this.route.waypoints.forEach(waypoint => {
            var marker = new google.maps.Marker({
                position: waypoint,
                map: this.map,
                title: '' + Helper.getWaypointName(waypoint.seq),
                label: '' + Helper.getWaypointName(waypoint.seq)
            });
        });
    }
}