import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-directory-wrapper',
  templateUrl: './directory-wrapper.component.html',
  styleUrls: ['./directory-wrapper.component.css']
})
export class DirectoryWrapperComponent implements OnInit {
  @Input('buttonLeftDistance') buttonLeftDistance: number = 40;
  @Input('textInButton') textInButton: string = '';

  isOpen: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
