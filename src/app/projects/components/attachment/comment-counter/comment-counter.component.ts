import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-comment-counter',
  templateUrl: './comment-counter.component.html',
  styleUrls: ['./comment-counter.component.css']
})
export class CommentCounterComponent implements OnInit, OnChanges {
  @Input() top: string = '0';
  @Input() right: string = '0';
  @Input() commentNumber: number = 0;

  constructor() { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    this.commentNumber = changes.commentNumber.currentValue;
  }
}
