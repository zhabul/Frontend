import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hex-status-icon',
  templateUrl: './hex-status-icon.component.html',
  styleUrls: ['./hex-status-icon.component.css']
})
export class HexStatusIconComponent implements OnInit {

  @Input() iconColor;
  @Input() type;

  constructor() { }

  ngOnInit(): void {
  }

}
