import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

interface WeatherData {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
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
  apiKey: string = '6e21e21d00dac27b8e466eb450211833'; // hide this later in .env
  weatherData: WeatherData | undefined;
  imperial: boolean = false;
  showLoading: boolean = false;
  latitude: number | undefined = undefined;
  longitude: number | undefined = undefined;
  placeHolder = 'Search City | ZIP Code (US)';
  inputValue = '';
  tempUnit = '';
  speedUnit = '';

  constructor(private http: HttpClient) {}

  public search = (inputValue: string, currentLocation: boolean) => {
    if (inputValue != '' || currentLocation) {
      this.showLoading = true;
      // console.log(inputValue);
      // console.log(this.imperial);
      let units: string;
      let searchHow: string;
      if (currentLocation == true) {
        searchHow = searchHow =
          '&lat=' + this.latitude + '&lon=' + this.longitude;
      } else {
        if (isNaN(parseInt(inputValue))) {
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
            this.longitude = this.weatherData?.coord.lon;
            this.latitude = this.weatherData?.coord.lat;
            // console.log(response);
            // console.log(response?.coord.lon);
            // console.log(response?.coord.lat);
            if ((inputValue = ' ')) {
              // if using current location, set input to city name
              this.inputValue = this.weatherData?.name + '';
            }
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
  // gets the users location from the browser
  public getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.search(this.inputValue, true);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  public flipSwitch = () => {
    this.imperial = !this.imperial;
    this.search(this.inputValue, false);
  };
  public forecast = () => {
    const count = 7;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitude}&lon=${this.longitude}&cnt=${count}&appid=${this.apiKey}`;
    this.http
      .get<any>(apiUrl)
      .pipe(
        tap((response: any) => {
          console.log(response);
        }),
        catchError((error: any) => {
          return error;
        })
      )
      .subscribe();
  };
}
