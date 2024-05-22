import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "new-contact-organisation-modal",
  templateUrl: "./new-contact-organisation-modal.component.html",
  styleUrls: ["./new-contact-organisation-modal.component.css"],
})
export class NewContactOrganisationModalComponent implements OnInit {
  newContactForm: FormGroup;
  contacts: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.contacts = this.data.contacts;
    console.log(this.contacts);

    this.newContactForm = this.fb.group({
      FirstName: [""],
      LastName: [""],
      Role: [""],
      Section: [""],
      Mobile: [""],
      Email: ["", [Validators.required, Validators.email]],
      Active: ["1"],
      Note: [""],
    });
  }

  createContact() {
    const data = this.newContactForm.value;
    console.log(this.newContactForm);
    console.log(data);

    const { FirstName, LastName, Role, Section, Mobile, Email, Active, Note } =
      data;

    this.contacts.push({
      FirstName,
      LastName,
      Role,
      Section,
      Mobile,
      Email,
      Active,
      Note,
    });
  }
}
