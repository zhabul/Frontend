import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plus-svg',
  templateUrl: './plus-svg.component.html',
  styleUrls: ['./plus-svg.component.css']
})
export class PlusSvgComponent implements OnInit {
  @Input() color: string = 'grey'

  constructor() { }

  ngOnInit(): void {
  }

}
