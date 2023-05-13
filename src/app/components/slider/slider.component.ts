import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent {
  @Output() newItemEvent = new EventEmitter<boolean>();
  imperial: boolean = false;
  public flip = () => {
    this.imperial = !this.imperial;
    this.newItemEvent.emit(this.imperial);
    // console.log('outputting ' + this.imperial);
  };
}
