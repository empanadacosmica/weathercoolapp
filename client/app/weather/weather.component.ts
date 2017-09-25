import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import {Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

  constructor(public weather: WeatherService, public activatedRoute: ActivatedRoute,  public router: Router) {
  }

  images: any = [];

  ngOnInit(){

    let self = this;

    self.activatedRoute.params.subscribe((params: Params) => {
      //save param name
      let cityURL = decodeURIComponent(params['city']);

      if(cityURL === 'current' && navigator.geolocation){
        //if it's a current param, use the GEOPOS loc
        navigator.geolocation.getCurrentPosition(position => {
          self.weather.getByCoord(position.coords.latitude, position.coords.longitude).subscribe((data) =>{

            /**
             * Happy path for GEOPOS
             */

            this.getData(data);
          }, error => {
            self.router.navigate(['notfound'], { queryParams: { error: 'notfound' } });
          });

        }, error => {
          if (error.code == error.PERMISSION_DENIED) {
            self.router.navigate(['notfound']);
            console.log('you denied me :-(');
          }
        });
      } else {

        //If it's not a current param, should use and search it as a city name
        self.weather.getByCity(cityURL).subscribe((data) =>{

          /**
           * Happy path for city name
           */
          this.getData(data);

        }, err => {
          self.router.navigate(['notfound'], { queryParams: { error: 'notfound' } });
        });
      }
    });

  }


  private getData(data) {
    this.images = data.image;
  }

}
