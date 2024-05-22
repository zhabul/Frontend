import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-tab',
  templateUrl: './nav-tab.component.html',
  styleUrls: ['./nav-tab.component.css', '../nav-tabs.component.css']
})
export class NavTabComponent implements OnInit {

  @Input('tab') tab;
  @Input('index') index;
  public selected;
  @Input('selected') set setSelected(index) {
    if (index === this.index) {
      this.selected = true;
    } else {
      this.selected = false;
    }
  };
  

  constructor() { }

  ngOnInit(): void {
  }

}
