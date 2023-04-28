import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

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
// https://api.openweathermap.org/data/2.5/weather?q=Tuckerton&units=imperial&appid=6e21e21d00dac27b8e466eb450211833
export class AppComponent {
  apiKey: string = '6e21e21d00dac27b8e466eb450211833';
  weatherData: WeatherData | undefined;
  inputValue = '';
  minTemp = '';

  constructor(private http: HttpClient) {}

  public search = (inputValue: string | number, currentLocation: boolean) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=imperial&appid=${this.apiKey}`;
    this.http
      .get<WeatherData>(apiUrl)
      .pipe(
        tap((response: WeatherData | undefined) => {
          this.weatherData = response;
          // console.log(this.weatherData);
        })
      )
      .subscribe();
  };
}
