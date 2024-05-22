import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Import necessary modules
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsService } from "../../../core/services/clients.service";
//import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-adding-contact-client',
  templateUrl: './adding-contact-client.component.html',
  styleUrls: ['./adding-contact-client.component.css']
})
export class AddingContactClientComponent implements OnInit {
  createForm: FormGroup; // Define a FormGroup
  contactPerson;
  public userDetails;
  fillColor: string = '82A7E2'; // Početna boja

  isEdit: boolean;
  public editForm:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<AddingContactClientComponent>,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    //private toastr: ToastrService,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public modal_data: any

  ) {
    this.contactPerson = modal_data.contactClient;
   }

  ngOnInit(): void {

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.createForm = this.fb.group({
      Name: [this.contactPerson ? this.contactPerson.FirstName : '', Validators.required], // Define the 'Name' control and add validation if needed
      LastName: [this.contactPerson ? this.contactPerson.LastName : '', Validators.required], // Define the 'Name' control and add validation if needed
      status: [this.contactPerson ? this.contactPerson.status : ''],
      PersonalNumber: [this.contactPerson ? this.contactPerson.PersonalNumber : ''], // Define the 'Name' control and add validation if needed
      Title: [this.contactPerson ? this.contactPerson.Title : ''],
      Mobile: [this.contactPerson ? this.contactPerson.Mobile : ""],
      Mobile2: [this.contactPerson ? this.contactPerson.Mobile2 : ""],
      email: [this.contactPerson ? this.contactPerson.email : "", [ Validators.required, Validators.email ]],
      id: [this.contactPerson ? this.contactPerson.id : null, []],
      client_id: [this.modal_data.client_id, []],
      comment: [this.contactPerson ? this.contactPerson.comment : ""],
    });
    this.isEdit = !this.checkIfAllEmpty();
    this.editForm = !!this.contactPerson;

  }

  save() {

    if (this.createForm.invalid) {
      setTimeout(() => {
        document.querySelector(".is-invalid").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 1);
      return;
    }
    const data = this.createForm.value;
    this.clientsService.updateClientWorker(data).subscribe((res:any)=> {
      if(res.status) {
        this.dialogRef.close({
          result: true,
          contactPerson: this.createForm.value
        });
      }
    });
  }

  delete() {
    this.dialogRef.close({
      'type': 'delete',
      result: false,
      contactPerson: this.createForm.value
    });
  }

  close(parameter = false, from) {
    this.dialogRef.close(parameter);
    // if(from == "submit"){
    //   window.location.reload();
    // }
  }

  onSubmit() {
    // Handle form submission here
  }

    checkIfAllEmpty(): boolean {
        const formValues = this.createForm.value;

        for (const key in formValues) {
        if (formValues[key] !== null && formValues[key] !== '') {
            return false;
        }
        }
        return true;
    }

    replacePhoneNumber(event, type) {

        if(type == 'Mobile1') {
            this.createForm.get("Mobile").patchValue(event);
        }

        if(type == 'Mobile2') {
            this.createForm.get("Mobile2").patchValue(event);
        }
    }


    onEnterKeyPress(data) {

        let text = data.split(/\r\n|\r|\n/).join('\n');
        this.createForm.get("comment").patchValue(text);
    }
}
