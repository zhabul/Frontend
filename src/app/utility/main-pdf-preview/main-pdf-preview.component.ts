import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-pdf-preview',
  templateUrl: './main-pdf-preview.component.html',
  styleUrls: ['./main-pdf-preview.component.css']
})
export class MainPdfPreviewComponent implements OnInit {

  @Input('items') items;
  @Output() pageTotal = new EventEmitter<Number>();

  constructor() { }

  ngOnInit(): void {
    this.pageTotal.emit(this.items.length + 1);
  }

}
