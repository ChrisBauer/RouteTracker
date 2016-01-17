import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import ServerConfig from 'modules/server-config';

@inject(HttpClient, Router)
export class List {
    
    constructor (http, router) {
        http.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl(ServerConfig.baseUrl);
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