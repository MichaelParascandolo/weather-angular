import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  cards: number[] = [0, 0];
  public addCard = () => {
    this.cards.push(Math.floor(Math.random() * 100));
  };

  public removeCard = () => {
    console.log('removing card');
    if (this.cards.length > 1) {
      this.cards.splice(0, 1);
    }
  };
}
