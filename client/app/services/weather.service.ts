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

  /**
   * Use google fallback
   * @param success
   * @param error
     */
  getCoord(success: any, error: any) {
    let triggered: boolean = false;

    //check html5 geolcation compatibilty
    if ('geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(position => {
          triggered = true;
          success(position.coords);
        }, error => {
          //on error , try google
          tryGoogle(success, error, 0);
        }, {timeout: 5000});
      } catch(err) {
        tryGoogle(success, error, 0);
      }
    } else {
      //google fallback for non html5 browsers
      tryGoogle(success, error, 0);
    }

    //if got timeout, use google
    setTimeout(() => {
      if(!triggered) {
        tryGoogle(success, error, 0);
      }
    }, 7000);


    /**
     * Use google fallback
     * NOTE: Please make sure to include the google api script
     * @param success
     * @param error
     * @param tries
       */
    function tryGoogle(success: any, error: any, tries: number) {
      let t = tries || 0;
      let google = window['google'];

      if ((typeof google == 'object') && google.loader && google.loader.ClientLocation) {
        triggered = true;
        success(google.loader.ClientLocation);
      } else {
        if(t < 3) {
          setTimeout(() => {
            t++;
            tryGoogle(success, error, t);
          }, 1000);
        } else {
          error({message: 'no google loaded'});
        }
      }
    }

  }
}
