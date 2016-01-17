import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';

@inject(HttpClient, Router)
export class List {
    
    constructor (http, router) {
        http.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl('http://localhost:3000/route');
        });
        
        this.http = http;
        this.r = router;
    }
    
    activate () {
        return this.http.fetch('')
            .then(response => response.json())
            .then(response => this.routes = response);
    }
    
    openRoute(route) {
        this.r.navigate('route-detail/' + route.id);
    }
}