import { Component, OnInit} from "@angular/core";
import {  FormGroup} from "@angular/forms";
import { User } from "../core/models/user";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "../core/services/users.service";
//import { CompareValidator } from "../core/validator/password.validator";
import { ToastrService } from "ngx-toastr";
//import { SpecialCharactherMustBeValidators } from "src/app/core/validator/special-characther-must-be.validator";
//import { ConfirmedValidator } from "../core/validator/confirmed.validator";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.css"],
})
export class MyAccountComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
      //  private fb: FormBuilder,
        private usersService: UsersService,
        private toastr: ToastrService,
        private userService: UsersService,
      //  private special_validator: SpecialCharactherMustBeValidators,
        private translate: TranslateService,
    ) { this.language = sessionStorage.getItem("lang");
        this.translate.use(this.language); }

    public selectedtab = 0;
    public createForm: FormGroup;
    public user: User;
    public userDetails;
    public disabled = false;
    public showPasswordChange = false;
    public selectedBankAccount;
    public showNewBankAccountInput = false;
    public bankAccountNumbers;
    public passwordChanged = false;
    public filterMenu: boolean = false;
    public userId: string;
    public language = "en";

    ngOnInit() {
        this.bankAccountNumbers = this.route.snapshot.data["bankAccountNumbers"];
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.userId = this.userDetails.user_id;
        this.user = this.route.snapshot.data["myAccount"]["user"];
        
    //     this.createForm = this.fb.group(
    //         {
    //             type: [this.user.type],
    //             personalNumber: [this.user.personalNumber, [Validators.required]],
    //             firstName: [this.user.firstname, [Validators.required]],
    //             lastName: [this.user.lastname, [Validators.required]],
    //             phoneNumber: [this.user.phone],
    //             mobileNumber: [this.user.mobile],
    //             mobileNumber2: [this.user.mobile2],
    //             email: [this.user.email, [Validators.required, Validators.email]],
    //             bic: [this.user.bic, []],
    //             iban: [this.user.iban, []],
    //             bankNumber: [this.user.bankNumber, []],
    //             accountNumber: [this.user.accountNumber, []],
    //             employeeNumber: [this.user.employeeNumber, [Validators.required]],
    //             password: [
    //                 null,
    //                 [
    //                     Validators.required,
    //                     Validators.minLength(8), 
    //                     Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/),
    //                     this.special_validator.nameValidator
    //                 ],
    //             ],
    //             confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
    //             status: [this.user.status],
    //             postalAddress1: [this.user.postalAddress1],
    //             postalAddress2: [this.user.postalAddress2],
    //             zipCode: [this.user.zipCode],
    //             city: [this.user.city],
    //             familyMember1: this.fb.group({
    //                 name: [this.user.familyMemberName1],
    //                 phone: [this.user.familyMemberPhone1],
    //                 note: [this.user.familyMemberNote1],
    //             }),
    //             familyMember2: this.fb.group({
    //                 name: [this.user.familyMemberName2],
    //                 phone: [this.user.familyMemberPhone2],
    //                 note: [this.user.familyMemberNote2],
    //             }),
    //             shareMobilePhoneNumber: [this.user.shareMobilePhoneNumber],
    //             shareEmail: [this.user.shareEmail],
    //         },
    //         {
    //             validator: ConfirmedValidator("password", "confirmPassword"),
    //         }
    //     );
    }

    // isFormValid() {
    //     return this.createForm.get('personalNumber').valid && this.createForm.get('firstName').valid && this.createForm.get('lastName').valid && this.createForm.get('email').valid && this.createForm.get('employeeNumber').valid;
    // }

    async saveUser(userData) {
        const res = await this.userService.saveUser(userData);
        if (res["status"] === "wrong password") {
            this.toastr.error(
                this.translate.instant("Wrong password entered."),
                this.translate.instant("Error")
            );
        }else if (res["status"]) {
            this.toastr.success(
                this.translate.instant("Successfully edited user!"),
                this.translate.instant("Success")
            );
    
        }else {
            this.toastr.error(
                this.translate.instant("Something went wrong!"),
                this.translate.instant("Error")
            );
        }
        this.disabled = false;
    }

    // createUser() {
    //     if (!this.isFormValid()) {
    //         return;
    //     }

    //     const data = this.createForm.value;

    //     const userData: User = {
    //         id: this.userDetails.user_id,
    //         password: null,
    //         email: data.email,
    //         firstname: data.firstName,
    //         lastname: data.lastName,
    //         phone: data.phoneNumber,
    //         personalNumber: data.personalNumber,
    //         employeeNumber: data.employeeNumber,
    //         bankNumber: data.bankNumber,
    //         accountNumber: data.accountNumber,
    //         bic: data.bic,
    //         iban: data.iban,
    //         mobile: data.mobileNumber,
    //         mobile2: data.mobileNumber2,
    //         zipCode: data.zipCode,
    //         city: data.city,
    //         postalAddress1: data.postalAddress1,
    //         postalAddress2: data.postalAddress2,
    //         familyMemberName1: data.familyMember1.name,
    //         familyMemberPhone1: data.familyMember1.phone,
    //         familyMemberNote1: data.familyMember1.note,
    //         familyMemberName2: data.familyMember2.name,
    //         familyMemberPhone2: data.familyMember2.phone,
    //         familyMemberNote2: data.familyMember2.note,
    //         shareMobilePhoneNumber: data.shareMobilePhoneNumber,
    //         shareEmail: data.shareEmail,
    //     };

    //     if(this.passwordChanged) {
    //         userData.password = data.password;
    //     }

    //     this.userService.updateAccount(userData).subscribe((res) => {
    //         if (res["status"]) {
    //             this.toastr.success("Successfully edited user!", "Success");
    //             this.passwordChanged = false;
    //         } else {
    //             this.toastr.error("There was an error while editing user.", "Error");
    //         }
    //     });
    // }

    onPasswordChange() {
        this.passwordChanged = !this.passwordChanged;
        this.showPasswordChange = !this.showPasswordChange;
    }

    changePassword() {
        if (this.createForm.valid) {
            const data = {
                UserID: this.userDetails["UserID"],
                Password: this.createForm.value.password,
            };

            this.disabled = true;
            this.usersService.setNewPassword(data).subscribe((res) => {
                this.disabled = false;

                if (res["status"]) {
                    this.toastr.success("Successfully created user!", "Success");
                } else {
                    this.toastr.error("There was an error while creating user.", "Error");
                }
            });
        }
    }

    togglePasswordVisibility(e) {
        if (this.userDetails.type) {
            const input = e.target.parentNode.parentNode.previousSibling;

            if (input.type === "password") {
                input.type = "text";
                e.target.classList.add("text-danger");
            } else {
                input.type = "password";
                e.target.classList.remove("text-danger");
            }
        }
    }

    bankAccountChanged(selectedBankAccount) {
        this.selectedBankAccount = selectedBankAccount;
    }

    toggleNewBankAccountInput() {
        this.showNewBankAccountInput = !this.showNewBankAccountInput;
    }

    async addNewBankAccount(bankNumber, accountNumber) {
        if (bankNumber.value.trim() === "") {
            this.toastr.error("Please enter bank number.", "Error");
            return;
        }

        if (accountNumber.value.trim() === "") {
            this.toastr.error("Please enter account number.", "Error");
            return;
        }

        const fullAccount = bankNumber.value + "" + accountNumber.value;
        const res: any = await this.userService.addNewBankAccount({
            user_id: this.user.id,
            account_number: fullAccount,
        });

        if (res.status) {
            this.selectedBankAccount = res.id;
            this.bankAccountNumbers = await this.userService.getUserBankAccounts(
                this.user.id
            );
            bankNumber.value = "";
            accountNumber.value = "";
            this.showNewBankAccountInput = !this.showNewBankAccountInput;
        }
    }
    togglePasswordChange(e): void {
        if (e) {
            if (e.target.id !== "looksLikeModal") {
                return;
            }
        }
        this.showPasswordChange = !this.showPasswordChange;
    }

    closePasswordChange() {
        this.showPasswordChange = false;
    }

    
  changeSelectedTab(index) {
    this.selectedtab = index;
  //  this.ngAfterViewInit();
  }


}
