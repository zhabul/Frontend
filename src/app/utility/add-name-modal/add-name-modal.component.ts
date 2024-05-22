import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-name-modal',
  templateUrl: './add-name-modal.component.html',
  styleUrls: ['./add-name-modal.component.css', '../rows/rows.component.css']
})
export class AddNameModalComponent implements OnInit {

  @Output('close') close:EventEmitter<boolean> = new EventEmitter();
  @Output('save') save:EventEmitter<string> = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initNameForm();
  }

  public nameForm: FormGroup;
  initNameForm() {
    this.nameForm = this.fb.group({
      name: ["", Validators.required]
    });
  }

  closeModal() {
    this.close.emit(true);
  }

  saveModalData() {
    this.save.emit(this.nameForm.value.name);
  }

}
