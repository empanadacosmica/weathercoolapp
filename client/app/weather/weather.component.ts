import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import {Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

  constructor(public weather: WeatherService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(){

    let self = this;

    self.activatedRoute.params.subscribe((params: Params) => {
      let cityURL = decodeURIComponent(params['city']);

      if(cityURL === 'current' && navigator.geolocation){

        navigator.geolocation.getCurrentPosition(position => {
          self.weather.getByCoord(position.coords.latitude, position.coords.longitude).subscribe((data) =>{
            //console.log('coords--->', data);
          });

        }, error => {
          if (error.code == error.PERMISSION_DENIED) {
            console.log('you denied me :-(');
          }
        });
      } else {
        self.weather.getByCity(cityURL).subscribe((data) =>{
          //console.log('city-->', data);
        });
      }
    });

  }


}
