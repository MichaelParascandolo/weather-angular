import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
    main: string;
    icon: string;
  }[];
  sys: {
    country: string;
  };
  wind: {
    speed: number;
    gust: number;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  apiKey: string = '6e21e21d00dac27b8e466eb450211833';
  weatherData: WeatherData | undefined;
  imperial: boolean = false;
  showLoading: boolean = false;
  inputValue = '';
  placeHolder = 'Search City | ZIP Code (US)';
  tempUnit = '';
  speedUnit = '';
  // currentLocation: boolean = false;

  constructor(private http: HttpClient) {}

  public search = (inputValue: any, currentLocation: boolean) => {
    if (inputValue != '') {
      this.showLoading = true;
      console.log(inputValue);
      let units: string;
      let searchHow: string;
      let latitude;
      let longitude;
      if (currentLocation == true) {
        searchHow = searchHow = '&lat=' + latitude + '&lon=' + longitude;
      } else {
        if (isNaN(inputValue)) {
          // does not working if we type cast inputValue
          searchHow = 'q=';
        } else {
          searchHow = 'zip=';
        }
      }
      if (this.imperial == false) {
        units = 'imperial';
        this.tempUnit = '°F';
        this.speedUnit = 'mp/h';
      } else {
        units = 'metric';
        this.tempUnit = '°C';
        this.speedUnit = 'kp/h';
      }

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${searchHow}${inputValue}&units=${units}&appid=${this.apiKey}`;
      this.http
        .get<WeatherData>(apiUrl)
        .pipe(
          tap((response: WeatherData | undefined) => {
            this.showLoading = false;
            this.placeHolder = 'Search City | ZIP Code (US)';
            this.weatherData = response;
          }),
          catchError((error: any) => {
            this.showLoading = false;
            console.log('SOMETHING WENT WRONG');
            this.placeHolder = 'CITY NOT FOUND!';
            this.inputValue = '';
            this.weatherData = undefined;
            return error;
          })
        )

        .subscribe();
    }
  };
  // ngOnInit() {
  //   this.inputValue = 'Tuckerton';
  //   this.search(this.inputValue, false);
  // }
}
