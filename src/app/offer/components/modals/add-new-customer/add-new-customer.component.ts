import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ClientsService } from "src/app/core/services/clients.service";
import { TabService } from "src/app/shared/directives/tab/tab.service";

@Component({
  selector: "app-add-new-customer",
  templateUrl: "./add-new-customer.component.html",
  providers: [TabService],
  styleUrls: ["./add-new-customer.component.css"],
})
export class AddNewCustomerComponent implements OnInit {
  public stringProba: any;
  public createForm: FormGroup;
  public active: boolean = true;
  public inactive: boolean = false;
  public reversePayment = true;
  @ViewChild("myform", { static: true }) myform!: NgForm;
  @Output() closeModalData = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddNewCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any
  ) {
    this.stringProba = modal_data.questionText;
  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      company_id: ["", [Validators.required//, Validators.pattern("[0-9]{6}-[0-9]{4}")
                        ]], //org nmbr
      number: ["", [Validators.required]], //customer number
      company: ["", [Validators.required]], //companyName
      vatNumber: ["", [Validators.required//, Validators.pattern("[A-Z]{2}[0-9]{6}-[0-9]{4}")
                      ]],
      order_email: ["", []],
      reference_theirs: ["", []],
      reference_ours: ["", []],
      mobile_number: ["" //, [Validators.pattern("[0-9]{3}-[0-9]{6}")]
                      ],
      telephone_number: ["" //, [Validators.pattern("[0-9]{3}-[0-9]{6}")]
                        ],
      email: ["", []],
      web_address: ["", []],
      visiting_address_street_and_no: ["", []],
      visiting_address_postnr: ["" //, [Validators.pattern("[0-9]{3}-[0-9]{2}")]
                                ],
      visiting_address_city: ["", []],
      visiting_address_land: ["", []],
      invoice_address_street_and_no: ["", []],
      invoice_address_postnr: ["" //, [Validators.pattern("[0-9]{3}-[0-9]{2}")]
                                ],
      invoice_address_city: ["", []],
      invoice_address_land: ["", []],
      status: ["1", []],
      type: ["0", []],
      reversePaymentObligation: ["1", []],
      bedomning: ["", []],
      clientCategoryId: ["10", []], //There was not a option on the design.Hardcoded and default for now!!!
    });
  }

  setEmailValidation(event, controlName) {
    this.createForm.get(controlName).setValue(event.target.value);
    if (event.target.value.length > 0) {
      this.createForm.get(controlName).setValidators(Validators.email);
      return;
    }
    this.createForm.get(controlName).clearValidators();
  }

  setActiveStatus() {
    this.active = true;
    this.createForm.get("status").setValue("1");
  }
  setInactiveStatus() {
    this.active = false;
    this.createForm.get("status").setValue("0");
  }

  setReversePaymentObligation(value) {
    this.reversePayment = value;
    this.createForm.get("reversePaymentObligation").setValue(value ? "1" : "0");
  }

  displayError(input: string) {
    const control = this.createForm.get(input);
    return (
      (this.myform.submitted && control.invalid) ||
      (control.dirty && control.invalid)
    );
  }

  close(parameter = false) {
    this.dialogRef.close();
  }

  createCustomer() {
    if (!this.createForm.valid) return;

    const data = this.createForm.value;
    this.clientsService.addNewClient(data).subscribe((res) => {
      if (res["status"]) {
        const client = {
          id: res["data"]["clientId"],
          name: data.company,
        };
        this.toastr.success(
          this.translate.instant("Successfully created client."),
          this.translate.instant("Success")
        );
        this.dialogRef.close(client);
      }
    });
  }

  clearAll() {
    this.createForm.reset({});
  }
}
