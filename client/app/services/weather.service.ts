import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  constructor(private http: Http) { }

  getByCity(city: string): Observable<any> {
    return this.http.get('/api/city?name=' + encodeURIComponent(city)).map(res => res.json());
  }

  getByCoord(latitude: any, longitude: any): Observable<any> {
    return this.http.get('/api/coord?latitude=' + encodeURIComponent(latitude) + '&longitude=' + encodeURIComponent(longitude)).map(res => res.json());
  }

}
