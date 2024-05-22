import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-list-for-results',
  templateUrl: './tree-list-for-results.component.html',
  styleUrls: ['./tree-list-for-results.component.css']
})
export class TreeListForResultsComponent implements OnInit {
  @Input() list: any[];
  constructor() { }

  ngOnInit(): void {
  }

}
