import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnInit {
  @Input() item: any=[];
  @Input() lavel: number = 0;

  isExpanded: boolean = true;
  indentInPx: number = 10;

  constructor() { }

  ngOnInit(): void {


   }



}
