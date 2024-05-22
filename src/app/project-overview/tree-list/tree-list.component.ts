import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.css']
})
export class TreeListComponent implements OnInit {
  @Input() list: any[];

  constructor() { }

  ngOnInit(): void {
  
 }

}
