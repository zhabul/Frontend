import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-item-for-results',
  templateUrl: './tree-item-for-results.component.html',
  styleUrls: ['./tree-item-for-results.component.css']
})
export class TreeItemForResultsComponent implements OnInit {

  @Input() item: any=[];
  @Input() lavel: number = 0;

  isExpanded: boolean = true;
  indentInPx: number = 10;

  constructor() { }

  ngOnInit(): void {


   }



  getIndent(): string {
    return `${(this.lavel + 1) * 0}px solid #daeaca`
  }

}
