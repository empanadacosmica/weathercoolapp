import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  constructor(private http: Http) { }

  getWeather(): Observable<any> {
    return this.http.get('/api/weather').map(res => res.json());
  }

}
