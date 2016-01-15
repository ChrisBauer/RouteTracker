import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class List {
    
    constructor (http) {
        http.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl('http://jsonplaceholder.typicode.com/');
        });
        
        this.http = http;
    }
    
    activate () {
        return this.http.fetch('posts/1')
            .then(response => response.json())
            .then(response => this.response = response);
    }
}