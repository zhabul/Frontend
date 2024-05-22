import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-image-for-dropdown',
  templateUrl: './send-image-for-dropdown.component.html',
  styleUrls: ['./send-image-for-dropdown.component.css']
})
export class SendImageForDropdownComponent implements OnInit {
  public setFill = 'var(--main-bg)';
  @Input('fill') set fill(value) {
    if(value?.length >0){
      this.setFill = value;
    }else{
      this.setFill = 'var(--main-bg)';
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
