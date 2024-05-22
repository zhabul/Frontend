import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Import necessary modules
import {  MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
    selector: 'app-adding-contact-supplier',
    templateUrl: './adding-contact-supplier.component.html',
    styleUrls: ['./adding-contact-supplier.component.css']
})
export class AddingContactSupplierComponent implements OnInit {

    myForm: FormGroup; // Define a FormGroup
    supplier_id:any;
    public editForm:boolean=false;


    constructor(
        public dialogRef: MatDialogRef<AddingContactSupplierComponent>,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private dialog: MatDialog,
        public translate: TranslateService,
        private suppliersService: SuppliersService,
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
    ) { }

    ngOnInit(): void {

        let first_name = this.modal_data['worker'] ? this.modal_data['worker']['FirstName'] : '';
        let last_name = this.modal_data['worker'] ? this.modal_data['worker']['LastName'] : '';
        let Active = this.modal_data['worker'] ? this.modal_data['worker']['Active'] : '1';
        let Email = this.modal_data['worker'] ? this.modal_data['worker']['Email'] : '';
        let Personnummer = this.modal_data['worker'] ? this.modal_data['worker']['Personnummer'] : '';
        let PhoneNumber1 = this.modal_data['worker'] ? this.modal_data['worker']['PhoneNumber1'] : '';
        let PhoneNumber2 = this.modal_data['worker'] ? this.modal_data['worker']['PhoneNumber2'] : '';
        let Title = this.modal_data['worker'] ? this.modal_data['worker']['Title'] : '';
        let id = this.modal_data['worker'] ? this.modal_data['worker']['id'] : 0;

        this.myForm = this.fb.group({
            FirstName: [first_name, Validators.required],
            LastName: [last_name, Validators.required],
            Active: [Active],
            Personnummer: [Personnummer],
            Title: [Title],
            PhoneNumber1: [PhoneNumber1],
            PhoneNumber2: [PhoneNumber2],
            Email: [Email, [ Validators.required, Validators.email ]],
            supplier_id: [this.modal_data.supplier_id],
            id:[id]
        });
        this.editForm = !!first_name;



    }

    close(parameter) {
        this.dialogRef.close(parameter);
       // if(from == "submit"){
       //     window.location.reload();
       // }
    }

    onSubmit() {

        if (this.myForm.valid) {

            const data = this.myForm.value;
            data.type = "create_or_update"
            this.suppliersService.createOrUpdateWorker(data).subscribe((result:any) => {
                data.id = result.id;
                this.close(data);
            });
        }else{
            return this.toastr.info(
                this.translate.instant(
                    "You first need to fill required fields!"
                ) ,
                this.translate.instant("Info")
            );
        }
    }

    replacePhoneNumber(event, type) {

        if(type == 'PhoneNumber1') {
            this.myForm.get("PhoneNumber1").patchValue(event);
        }

        if(type == 'PhoneNumber2') {
            this.myForm.get("PhoneNumber2").patchValue(event);
        }
    }

    removeSupplier() {
        console.log(this.myForm.get("id").value)
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog.open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe(async (response) => {
                let data = {
                    'id': this.myForm.get("id").value,
                    'type': 'remove',
                    'confiramation_allow': true
                }
                console.log(data)
                this.close(data);
            });
    }
}
