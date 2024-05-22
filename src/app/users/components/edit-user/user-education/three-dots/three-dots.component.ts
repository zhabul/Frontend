import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-three-dots',
  templateUrl: './three-dots.component.html',
  styleUrls: ['./three-dots.component.css'],
  host: {'(document:click)': 'onClick($event)'},
})
export class ThreeDotsComponent implements OnInit {
  public isOpen: boolean = false;
  @Input() education;
  @Input() disabled = false;
  @Input() isPermitDialog = false;
  @Input() isMyAccount = false;
  @Output() toggleEducationId: EventEmitter<string> = new EventEmitter<string>;
  @Output() toggleEducationEdit: EventEmitter<object> = new EventEmitter<object>;
  @Output() IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>;

  constructor(private _eref: ElementRef) { }

  ngOnInit(): void {
  }


  toggleThreeDots() {
    if(!this.disabled){
    this.isOpen = !this.isOpen;
    this.IsOpen.emit(this.isOpen);
    }
  }

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target))
      this.isOpen = false;
   }

    onEdit() {
        this.toggleEducationEdit.next(this.education);
    }

   onSave() {
    console.log("onSave");
    // TODO: implement onSave()
   }

    onDelete() {
        this.toggleEducationId.next(this.education.id);
    }
}
