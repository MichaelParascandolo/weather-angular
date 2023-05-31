import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  // templateUrl: './logo.component.html',
  template:
    '<div style="width: 100%; display: flex; justify-content: center"><div class="title">WeatherMate<i class="fa-solid fa-bolt" style="color: #2196f3"></i></div></div>',
  styleUrls: ['./logo.component.css'],
})
export class LogoComponent {}
