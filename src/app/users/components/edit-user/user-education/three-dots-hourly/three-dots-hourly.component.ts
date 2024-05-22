import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-three-dots-hourly',
  templateUrl: './three-dots-hourly.component.html',
  styleUrls: ['./three-dots-hourly.component.css'],
  host: {'(document:click)': 'onClick($event)'},
})
export class ThreeDotsHourlyComponent implements OnInit {
  @Input() item = {};
  @Input() indexOfItem: number = null;
  @Input() whichIndexCanYouEdit:any;
 

  public isOpen: boolean = false;
  public isEditing: boolean = false;

  @Output() toggleOnDelete = new EventEmitter<any>();
  @Output() toggleOnEdit = new EventEmitter<number>();
  @Output() toggleOnSave = new EventEmitter<any>();
  @Output() IsOpen = new EventEmitter<any>();

  constructor(private _eref: ElementRef) { }

  ngOnInit(): void {
  }

  toggleThreeDots() {
    this.isOpen = !this.isOpen;
    if(this.isEditing){
      this.isEditing = false;
      this.toggleOnEdit.emit(undefined);
    }
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
       this.isOpen = false;
    }
    this.IsOpen.emit(this.isOpen);
   }

   onSave() {
    this.isEditing = false;
    this.toggleOnSave.emit(this.item);
    this.isOpen = false;
   }

   onDelete() {
    this.isEditing = false;
    this.toggleOnDelete.emit(this.item);
   }

  //  onEdit(){
  //   this.isEditing = true;
  //   this.toggleOnEdit.emit(this.indexOfItem);
  //  }

   onEdit() {
    this.isEditing = !this.isEditing;
    if(this.isEditing){
      this.toggleOnEdit.emit(this.indexOfItem);
    }else{
      this.toggleOnEdit.emit(undefined);
    }
   }
  
}
