import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Validators } from "@angular/forms";
import { ClientsService } from "src/app/core/services/clients.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TabService } from "src/app/shared/directives/tab/tab.service";

@Component({
  selector: "app-add-customer-contact",
  templateUrl: "./add-customer-contact.component.html",
  providers: [TabService],
  styleUrls: ["./add-customer-contact.component.css"],
})
export class AddCustomerContactComponent implements OnInit {
  public form: FormGroup;
  public status = true;
  private clientId: string;
  public formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private clientsService: ClientsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AddCustomerContactComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {
    this.clientId = modal_data.data.clientId;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      clientID: [this.clientId, [Validators.required]],
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      Mobile: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      status: ["1"],
      Title: ["", [Validators.required]],
    });
  }

  setTrueStatus() {
    console.log("set status true");
    this.status = true;
    this.form.get("status").setValue("1");
  }

  setFalseStatus() {
    console.log("set status false");
    this.form.get("status").setValue("0");
    this.status = false;
  }

  close(parameter = false) {
    this.dialogRef.close();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.form.valid) {
      this.toastr.info(this.translate.instant("Enter all fields"));
      return;
    }
    this.clientsService.addOneWorker(this.form.value).subscribe({
      next: (res) => {
        if (res.status) {
          this.dialogRef.close({
            Id: res.data.worker_id,
            Name: `${this.form.value.FirstName} ${this.form.value.LastName}`,
            finalName:`${this.form.value.FirstName} ${this.form.value.LastName}`
          });
        }
      },
      error: () => this.toastr.error(this.translate.instant("Error")),
    });
  }
}
