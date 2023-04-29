import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
  inputValue = '';
  placeHolder = 'Search City | ZIP Code (US)';
  // currentLocation: boolean = false;

  constructor(private http: HttpClient) {}

  public search = (inputValue: string | number, currentLocation: boolean) => {
    if (inputValue != '') {
      this.weatherData = undefined;
      console.log(inputValue);
      let units: string;
      let searchHow: string;
      let latitude;
      let longitude;
      if (currentLocation == true) {
        searchHow = searchHow = '&lat=' + latitude + '&lon=' + longitude;
      } else {
        if (typeof inputValue === 'number') {
          searchHow = 'zip=';
        } else {
          searchHow = 'q=';
        }
      }
      if (this.imperial == false) {
        units = 'imperial';
      } else {
        units = 'metric';
      }

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${searchHow}${inputValue}&units=${units}&appid=${this.apiKey}`;
      this.http
        .get<WeatherData>(apiUrl)
        .pipe(
          tap((response: WeatherData | undefined) => {
            this.placeHolder = 'Search City | ZIP Code (US)';
            this.weatherData = response;
          }),
          catchError((error: any) => {
            console.log('SOMETHING WENT WRONG');
            this.placeHolder = 'CITY NOT FOUND!';
            this.inputValue = '';
            return error;
          })
        )

        .subscribe();
    }
  };
}
