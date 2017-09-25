import { Component } from '@angular/core';
import { WeatherService } from './services/weather.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public weather: WeatherService) {

   weather.getWeather().subscribe((data) =>{
    console.log('data--->', data);
  });

  }

}
