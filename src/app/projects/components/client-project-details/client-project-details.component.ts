import { Component, OnInit, Inject } from "@angular/core";
import { ClientsService } from "../../../core/services/clients.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CompanyService } from "src/app/core/services/company.service";
import { AsYouType } from 'libphonenumber-js';

@Component({
  selector: "project-client-details",
  templateUrl: "./client-project-details.component.html",
  styleUrls: ["./client-project-details.component.css"],
  animations: [],
})
export class ClientProjectDetailsComponent implements OnInit {
  public buttonToggle: boolean = true;
  public buttonName: string = "show";
  public client: any;
  public boldOrNot: boolean = !true;
  public status: any = "1";

  public newWorker: any;

  public activeCheck;
  public inactiveCheck;

  public createForm: FormGroup;
  public createFormNewEmployee: FormGroup;
  public createFormClientInvoice: FormGroup;

  public userDetails: any;
  public clientId = -1;
  state: string = "large";
  public phone_codes:any[] = [];

  animateMe() {
    this.state = this.state === "small" ? "large" : "small";
    this.newWorker.status = "Active";
  }

  constructor(
    private clientsService: ClientsService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ClientProjectDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
  ) {}

  ngOnInit() {
    this.clientsService.client.subscribe((id) => {
      this.clientId = id["Id"] || id;
    });

    this.getPhoneCodes();

    this.createFormNewEmployee = this.fb.group({
      clientID: [this.clientId, []],
      FirstName: [ "" , [ Validators.required ]],
      LastName: [ "" , [ Validators.required ]],
      Mobile: [ "" , [ Validators.required ]],
      email: [ "" , [ Validators.required, Validators.email ],
      ],
      status: ["Active"],
      Title: ["", [ Validators.required ]],
    });

  }
  addOneWorker() {
    if (this.createFormNewEmployee.valid) {
      const data = this.createFormNewEmployee.value;
      this.clientsService.addOneWorker(data).subscribe((res) => {
        if (res.status) {
          const name =  data.FirstName + " " + data.LastName + '-' + data.Title;
          const clientWorker = {
            Id: res["data"]["worker_id"],
            Name: name,
            finalName: name
          };
          this.clientsService.setComponentVisibility(0);
          this.clientsService.clientWorker.next(clientWorker);
          this.toastr.success(
            this.translate.instant(
              "You have successfully added a new worker to this client."
            ),
            this.translate.instant("Worker added to client!")
          );
          this.state = "small";
          this.dialogRef.close(clientWorker);
        }
      });
    }
  }

  updateClientInvoice() {
    const data = this.createFormClientInvoice.value;

    this.clientsService.updateOneClientInvoice(data);
    this.toastr.success(
      "You have successfully update the client invoice.",
      "Client invoice update!"
    );
  }

  setActive() {
    this.createFormNewEmployee.get('status').setValue('Active');
  }
  setInactive() {
    this.createFormNewEmployee.get('status').setValue('Inactive');
  }

  public mobile_number;

  // formtMobileNumber(mobile_number) {
  //   this.mobile_number = mobile_number
  //   this.clientsService.formatMobileNumber({'mobile_number': mobile_number}).subscribe((res:any) => {
  //     if(res.status) {
  //       this.createFormNewEmployee.get('Mobile').patchValue(res['result']);
  //     }
  //   });
  // }

  USformatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
}

otherFormatPhoneNumber(input) {

    input = input.replace(/\D/g,'');
    input = input.substring(0,10);
    var size = input.length;

    if(size > 8) {
        if(size == 0){
                input = input;
        }else if(size < 4){
                input = '('+input;
        }else if(size < 7){
                input = '('+input.substring(0,3)+') '+input.substring(3,6);
        }else if(size == 10){
            input = input.substring(0,3)+'-'+input.substring(3,6)+ ' ' + input.substring(6,8)+ ' ' + input.substring(8,10);
        }else{
            //input = '('+input.substring(0,3)+') '+input.substring(3,6)+' - '+input.substring(6,10);
            input = input.substring(0,3)+' '+input.substring(3,6)+' - '+input.substring(6,10);
        }
    }
    return input;
}

formtMobileNumber(mobile_number) {

    let mobile_number_copy =JSON.parse(JSON.stringify(mobile_number))
    let index = this.phone_codes.findIndex((phone) => {
        return mobile_number_copy.startsWith(phone.code_1) || mobile_number_copy.startsWith(phone.code_2) || mobile_number_copy.startsWith(phone.code_3) || mobile_number_copy.startsWith(phone.code_4)
    });

    if(index != -1) {
        let country = this.phone_codes[index];
        let phone_number = new AsYouType(country.country_short);
        this.mobile_number = phone_number.input(mobile_number_copy);
    }else if(mobile_number.length > 3){
        this.mobile_number = this.otherFormatPhoneNumber(mobile_number_copy);
    }else {
        this.mobile_number = mobile_number_copy;
    }
    // this.phone_number.emit(this.mobile_number);
}

  getPhoneCodes() {
    this.companyService.getPhoneCodes().then((result) => {
        this.phone_codes = result;
        if(this.mobile_number) {
            this.formtMobileNumber(this.mobile_number);
        }
    });
  }
}
