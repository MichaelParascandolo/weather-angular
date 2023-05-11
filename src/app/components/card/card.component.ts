import { Component, Input } from '@angular/core';
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
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() removeCard: any;
  @Input() addCard: any;

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
      // makes sure input is not null and current location was not pressed
      this.showLoading = true;
      let units: string;
      let searchHow: string;
      if (currentLocation == true) {
        // if current location was pressed, get lat and long
        searchHow = searchHow =
          '&lat=' + this.latitude + '&lon=' + this.longitude;
      } else {
        if (isNaN(parseInt(inputValue))) {
          // if city is not a number
          searchHow = 'q='; // search by city name
        } else {
          searchHow = 'zip='; // search by zip code (US only)
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
            this.placeHolder = 'Search City | ZIP Code (US)';
            this.weatherData = response;
            this.longitude = this.weatherData?.coord.lon;
            this.latitude = this.weatherData?.coord.lat;
            // console.log(response);
            if ((inputValue = ' ')) {
              // if using current location, set input to city name
              this.inputValue = this.weatherData?.name + '';
            }
            this.showLoading = false;
          }),
          catchError((error: any) => {
            console.log('SOMETHING WENT WRONG');
            this.placeHolder = 'CITY NOT FOUND!';
            this.inputValue = '';
            this.weatherData = undefined;
            this.showLoading = false;
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
  // flips between imperial and metrics
  public flipSwitch = () => {
    this.imperial = !this.imperial;
    this.search(this.inputValue, false);
  };
  // generates up to 5 day forecast, 3 hours each day
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
