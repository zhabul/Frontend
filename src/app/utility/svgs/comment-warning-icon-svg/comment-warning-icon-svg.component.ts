import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-warning-icon-svg',
  templateUrl: './comment-warning-icon-svg.component.html',
  styleUrls: ['./comment-warning-icon-svg.component.css']
})
export class CommentWarningIconSvgComponent implements OnInit {
  public widthParams = 14;
  public heightParams = 15;
  public bgColorParams = "#b63418"
  public colorParams = "#fff"

  @Input() set width(value) {
    this.widthParams = value;
  }
  @Input() set height(value) {
    this.heightParams = value;
  }

  @Input() set color(value) {
    this.bgColorParams = '#' + value;
  }

  @Input() set exclamationMark(value) {
    this.colorParams = '#' + value;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
