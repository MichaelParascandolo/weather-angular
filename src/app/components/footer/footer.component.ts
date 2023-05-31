import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template:
    '<footer>{{currentYear}} &copy; WeatherMate Inc. All rights reserved.</footer>',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
