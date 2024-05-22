import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.css']
})
export class PreviewImageComponent implements OnInit {

  @Input('item') item;
  @Input('index') index;
  @Input('pageTotal') pageTotal;

  constructor() { }

  ngOnInit(): void {
  }

  public loaded = false;
  public parentStyle = { opacity: 0 };
  onLoad() {
    this.loaded = true;
    this.parentStyle = { opacity: 1 };
  }
}
