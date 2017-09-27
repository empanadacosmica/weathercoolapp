import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WeatherComponent } from './weather.component';
import { LoadingComponent } from '../shared/loading/loading.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { WeatherService } from '../services/weather.service'
import { AbstractMockObservableService } from '../shared/mock.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';


describe('Component: Weather', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;


  class MockService extends AbstractMockObservableService {
    getByCity(city: any) {
      return this;
    }
    getByCoord(latitude: any, longitude: any) {
      return this;
    }
    getCoord(success: any, error: any) {
      return this;
    }
  }

  let mockService = new MockService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, LazyLoadImageModule, RouterTestingModule],
      declarations: [ WeatherComponent, LoadingComponent ],
      providers: [{provide: WeatherService, useValue: mockService }]
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.loading).toBeTruthy();
    expect(component.loadingImage).toBeTruthy();
  }));

});
