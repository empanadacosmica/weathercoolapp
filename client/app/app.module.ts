import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { WeatherService } from './services/weather.service';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    NotFoundComponent
  ],
  imports: [
    RoutingModule,
    SharedModule
  ],
  providers: [
    WeatherService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
