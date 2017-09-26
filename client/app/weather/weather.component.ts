import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';



@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

  constructor(public weather: WeatherService, public activatedRoute: ActivatedRoute,  public router: Router, private location: Location) {
  }

  images: any = [{}, {}, {}];
  loading: boolean = true;
  loadingImage: boolean = true;
  currentWeather: any;
  forecast: any;
  city: string;

  ngOnInit(){

    let self = this;

    self.activatedRoute.params.subscribe((params: Params) => {
      //save param name
      if(params['city']) {
        self.city = decodeURIComponent(params['city']);
      }

      if(self.city === 'current' && navigator.geolocation) {
        self.city = undefined;
        //if it's a current param, use the GEOPOS loc

        if ('geolocation' in navigator) {


          navigator.geolocation.getCurrentPosition(position => {
            self.weather.getByCoord(position.coords.latitude, position.coords.longitude).subscribe((data) => {

              /**
               * Happy path for GEOPOS
               */

              this.getData(data);
            }, error => {
              self.router.navigate(['notfound'], {queryParams: {error: 'notfound'}});
            });

          }, error => {
            if (error.code == error.PERMISSION_DENIED) {
              self.router.navigate(['notfound'], {queryParams: {error: 'notgeopos'}});
              console.log('you denied me :-(');
            }
          });

        } else {
          self.router.navigate(['notfound']);
        }

      } else {

        //If it's not a current param, should use and search it as a city name
        self.weather.getByCity(self.city).subscribe((data) =>{

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
    this.images = data.images ? data.images : [{}, {}, {}];
    this.loading = false;
    this.forecast = data.forecast;
    this.currentWeather = data.weather;
    this.city = this.currentWeather.name;
  }

  showImage (succcess: boolean) {
    if(succcess) {
      this.loadingImage = false;
    }
  }

  search () {
    let self = this;
    self.loading = true;
    self.loadingImage = true;

    self.weather.getByCity(self.city).subscribe((data) =>{

      /**
       * Happy path for city name
       */
      self.getData(data);

      self.location.go( self.city );

    }, err => {
      self.router.navigate(['notfound'], { queryParams: { error: 'notfound' } });
    });
  }

}
