import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: ':city', component: WeatherComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/current' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
