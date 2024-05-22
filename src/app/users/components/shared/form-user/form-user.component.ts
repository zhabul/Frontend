import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
//import { User } from "src/app/core/models/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "src/app/core/services/users.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { ClientsService } from 'src/app/core/services/clients.service';
//import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
declare var $;
@Component({
    selector: 'app-form-user',
    templateUrl: './form-user.component.html',
    styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

    @Input() user;
    @Input() chosenDefaultMoments;
    @Input() manuallyAddedMoments;
    @Input() disabled ;
    @Input() timTaxMsgShown;
    @Input() userOpts;
    @Input() component_type;
    @Input() isMyAccount = false;
    @Output() dataForStore = new EventEmitter<object>();
    @Output() isFormDirty =new EventEmitter<boolean>();
    @Output() predefined_roles = new EventEmitter<object>();

    public editForm: FormGroup;
    public todayDate = new Date();
    public today = moment(this.todayDate).format("YYYY-MM-DD");
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    public endDateUnspecified = true;
    public disableCustomSimpleDropdown: boolean = false;
    public chosenRole = 0;
    public previousRoute: string;
    public currentAddRoute: string;
    public old_user_status:any;
    public incoming_sub;
    public disabledFirstTime:any;

    public showNewUserRoleInput = false;

   /* public typesItems: {id: string, status: string}[] = [
        {id: "Own Personal", status: "Own Personal"},
        {id: "Hired", status: "Hired"},
        {id: "Subcontractor", status: "Subcontractor"},
        {id: "Others", status: "Others"}
    ];*/
    public typesItems: {id: string, status: string}[] = [];
    public statusOfUser: {id: string, status: string}[] = [
        {id: 'Active', status: 'Active'},
        {id: 'Inactive', status: 'Inactive'},
        {id: 'Incoming', status: 'Incoming'}
    ];
    public userRoleSelected;
    public accMenuToggle = true;
    public taxaMenuToggle = true;
    public relMenuToggle = true;
    public hourlyToggle = true;
    public userRoles = [];
    public userRolesMoments = {};
    public userRolesMomentsToSet = [];
    public selectedRoleID;
    public userDefaultMomentsALL = [];
    public roleMomentsALL = [];
    public comments = [];
    public language = "en";
    public week = "Week";
    public selectedTab = 0;
    public modalInfo = null;
    public user_roles:any = [];
    public change_role_for_user:boolean = false;
    public user_ue = [];

    constructor(
        private fb: FormBuilder,
        private clientsService: ClientsService,
        private userService: UsersService,
        private toastr: ToastrService,
        public translate: TranslateService,
        private router: Router,
    ){
        this.language = sessionStorage.getItem("lang");
        this.translate.use(this.language);
    }

    ngAfterDestroy() {
        if (this.incoming_sub) {
            this.incoming_sub.unsubscribe();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.openDatepicker()
        }, 500);
    }

    ngOnInit(): void {
        this.userRoleSelected = this.user.role;
        this.old_user_status = this.user.status;
        this.previousRoute = "/users";

        this.initForm();
        this.getUserTypes();
        this.getUserUE();
        this.userService.getRoles().subscribe((res) => {

            this.userRoles = res;
            let status = this.user['role_exist'];
            if(!status && this.component_type == 'edit') {
                let obj = {
                    'id': '0',
                    'roles': 'Select Role',
                    'isAdmin': '0',
                    'color': '#ffffff'
                }
                this.userRoles = [obj].concat(this.userRoles);
            }

            if(this.component_type == 'edit') {
                this.user.role_name = this.userRoles.find(x => x.id == this.user.role).roles;
            }else {
                this.user.role_name = this.userRoles[0].roles;
                this.user.role = this.userRoles[0].id;
                this.editForm.get("role").patchValue(this.user.role);
                let role = {
                    'id': this.user.role
                };

                setTimeout( () => {  this.toggleRole(role) }, 1000 );
            }
        });


        this.incoming_sub = this.editForm.get("status").valueChanges.subscribe((value) => {
            this.editForm.get("personalNumber").updateValueAndValidity();
            this.editForm.get("employeeNumber").updateValueAndValidity();
            this.editForm.get("email").updateValueAndValidity();
            if(this.editForm.get("hourlyRate")) {
                this.editForm.get("hourlyRate").updateValueAndValidity();
            }
        });
        this.chosenRole = this.user.role;
        this.endDateUnspecified = !this.user.endDate;
        this.selectedRoleID = this.user.role;

        if (this.enableForm()) {
            this.editForm.enable();
        }else {
            this.editForm.disable();
        }

        this.disabledFirstTime = this.disabled;
        if(!this.disabledFirstTime){
            this.editForm.valueChanges.subscribe(form =>{
            this.disabled = false;
            })
        }

        if(this.user.status == 'Locked'){
            this.statusOfUser.push({id: 'Locked', status: 'Locked'});
        }

    }

    enableForm() {
        let status = false;
        if (this.userDetails.create_users_Manageusers || this.userDetails.user_id == this.user.id) {
            status = true;
        }
        return status;
    }

    initForm() {

        const startDate = this.user.startDate.replace(
          "Vecka",
          this.translate.instant("Week")
        );
        const endDate = this.user.endDate
          ? this.user.endDate.replace("Vecka", this.translate.instant("Week"))
          : this.user.endDate;

        if(this.component_type == 'new') {
            const hourlyRateDate = `${this.today} ${this.translate.instant("Week")} ${this.getNumberOfWeek(this.todayDate)[1]}`;

            this.editForm = this.fb.group({
                role: [this.user.role],
                profession: [this.user.profession],
                language: [this.user.language, []],
                email: [
                    this.user.email,
                    [
                    this.requiredIfValidator(() => this.editForm.get("status").value),
                        Validators.email,
                    ],
                ],
                hourlyRate: ['', [Validators.required]],
                hourlyRateDate: [hourlyRateDate, [Validators.required]],
                firstName: [this.user.firstname, [Validators.required]],
                lastName: [this.user.lastname, [Validators.required]],
                startDate: [startDate, [Validators.required]],
                endDate: [endDate, []],
                employeeNumber: [this.user.employeeNumber],
                bic: [this.user.bic],
                iban: [this.user.iban],
                bankNumber: [this.user.bankNumber],
                accountNumber: [this.user.accountNumber],
                type: [this.user.type],
                ue: [this.user.ue],
                personalNumber: [this.user.personalNumber],
                phone: [this.user.phone],
                mobile: [this.user.mobile, [Validators.required]],
                mobile2: [this.user.mobile2],
                status: [this.user.status],
                city: [this.user.city],
                zipCode: [this.user.zipCode],
                postalAddress1: [this.user.postalAddress1],
                postalAddress2: [this.user.postalAddress2],
                familyMember1: this.fb.group({
                    name: [this.user.familyMemberName1],
                    phone: [this.user.familyMemberPhone1],
                    note: [this.user.familyMemberNote1],
                }),
                familyMember2: this.fb.group({
                    name: [this.user.familyMemberName2],
                    phone: [this.user.familyMemberPhone2],
                    note: [this.user.familyMemberNote2],
                }),
            });
        }else {
            this.editForm = this.fb.group({
                role: [this.user.role],
                profession: [this.user.profession],
                language: [this.user.language, []],
                email: [
                    this.user.email,
                    [
                    this.requiredIfValidator(() => this.editForm.get("status").value),
                        Validators.email,
                    ],
                ],
                firstName: [this.user.firstname, [Validators.required]],
                lastName: [this.user.lastname, [Validators.required]],
                startDate: [startDate, [Validators.required]],
                endDate: [endDate, []],
                employeeNumber: [this.user.employeeNumber],
                bic: [this.user.bic],
                iban: [this.user.iban],
                bankNumber: [this.user.bankNumber],
                accountNumber: [this.user.accountNumber],
                type: [this.user.type],
                ue: [this.user.ue],
                personalNumber: [this.user.personalNumber],
                phone: [this.user.phone],
                mobile: [this.user.mobile, [Validators.required]],
                mobile2: [this.user.mobile2],
                status: [this.user.status],
                city: [this.user.city],
                zipCode: [this.user.zipCode],
                postalAddress1: [this.user.postalAddress1],
                postalAddress2: [this.user.postalAddress2],
                familyMember1: this.fb.group({
                    name: [this.user.familyMemberName1],
                    phone: [this.user.familyMemberPhone1],
                    note: [this.user.familyMemberNote1],
                }),
                familyMember2: this.fb.group({
                    name: [this.user.familyMemberName2],
                    phone: [this.user.familyMemberPhone2],
                    note: [this.user.familyMemberNote2],
                }),
            });
        }
    }

    toggleRole(role) {

        this.userService.getRolePermissionsWithPredefinedSelected(role.id, this.user.id).then((res:any)=> {
            if(res.status) {
                this.user_roles = res['data'];
                this.change_role_for_user = true;
                this.editForm.get("role").patchValue(role.id);

                let obj = {
                    'role_id': role.id,
                    'user_id': this.user.id,
                    'user_roles': this.user_roles
                };

                this.predefined_roles.emit(obj);

            }
        });
        this.userRoleSelected = role.id;
    }

    getNumberOfWeek(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(((d - Number(yearStart)) / 86400000 + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    }

    requiredIfValidator(predicate) {
        return (formControl) => {
        if (!formControl.parent) {
            return null;
        }

        const predicate_r = predicate();
        if (this.user.status === "Incoming" && predicate_r === "Inactive") {
            return null;
        }

        if (predicate() !== "Incoming") {
            return Validators.required(formControl);
        }
            return null;
        };
    }

    async saveUser() {
        if (this.editForm.valid) {

            const data = this.editForm.getRawValue();
            const userData = {
                id: this.user.id,
                language: data.language,
                email: data.email,
                hourlyRate: data.hourlyRate,
                hourlyRateDate: data.hourlyRateDate,
                firstname: data.firstName,
                lastname: data.lastName,
                startDate: data.startDate.split(" ")[0],
                endDate: data.endDate ? data.endDate.split(" ")[0] : null,
                type: data.type,
                ue: data.ue,
                personalNumber: data.personalNumber,
                employeeNumber: data.employeeNumber,
                bankNumber: data.bankNumber,
                accountNumber: data.accountNumber,
                bic: data.bic,
                iban: data.iban,
                phone: data.phone,
                mobile: data.mobile,
                mobile2: data.mobile2,
                status: data.status,
                city: data.city,
                zipCode: data.zipCode,
                postalAddress1: data.postalAddress1,
                postalAddress2: data.postalAddress2,
                role: data.role,
                familyMemberName1: data.familyMember1.name,
                familyMemberPhone1: data.familyMember1.phone,
                familyMemberNote1: data.familyMember1.note,
                familyMemberName2: data.familyMember2.name,
                familyMemberPhone2: data.familyMember2.phone,
                familyMemberNote2: data.familyMember2.note,
                profession: data.profession,
                old_user_status: this.old_user_status,
                user_permission_id: this.user.user_permission_id
            };

            if(!userData.role) {
                userData.role = this.userRoles[0].id;
            }

            this.disabled = true;
            const lastUserLoggedIn = JSON.parse(localStorage.getItem("lastUser"));

            if (
                this.userDetails.user_id == this.user.id &&
                this.userDetails.email != data.email &&
                lastUserLoggedIn.email != data.email
            ) {
                this.userDetails.email = data.email;
                lastUserLoggedIn.email = data.email;
                sessionStorage.setItem("userDetails", JSON.stringify(this.userDetails));
                localStorage.setItem("lastUser", JSON.stringify(lastUserLoggedIn));
            }

              this.dataForStore.emit(userData);
              this.editForm.markAsUntouched();

        }else {
            this.toastr.error(
                this.translate.instant("Form is invalid."),
                this.translate.instant("Error")
            );
        }
    }

    async newUserRolePermission(name) {
        if (name && name.trim() !== "") {
            const res: any = await this.userService.newPredefinedRole({
                name,
                opts: this.userOpts,
                user_id: this.user.id
            });


            if (res.role_id == -1) {
                this.toastr.error(
                    this.translate.instant("User role exists."),
                    this.translate.instant("Error")
                );
            } else {
                window.location.reload();
            }
        }
    }

    editUserRolePermissions() {
        if (this.editForm.get("status").value !== "Incoming") {
            this.router.navigate(["users/edit/roles/", this.userRoleSelected]);
        }
    }

    endDateUnspecifiedChanged(e) {
        if (e.target.checked) {
            $("#endDateSelect").prop("disabled", true);
            this.editForm.get("endDate").patchValue("");
        } else {
            $("#endDateSelect").prop("disabled", false);
        }
    }


    getDefaultType() {
        const defaultValue: string = this.editForm.get('type').value;
        const defaultUserType: {id: string, status: string} =
        {id: defaultValue, status: defaultValue}
        return defaultUserType;
    }

    getDefaultUserStatus() {
        const defaultValue: string = this.editForm.get('status').value;
        const defaultUserStatus: {id: string, status: string} =
          {id: defaultValue, status: defaultValue}
        return defaultUserStatus;
    }

    selectType(selectedType, formControlName) {
        this.editForm.markAsDirty();
        this.editForm.get(formControlName).patchValue(selectedType.status);
    }

    selectUserStatus(selectedStatus, formControlName) {

        this.editForm.markAsDirty();
        this.editForm.get(formControlName).patchValue(selectedStatus.status);

        if(selectedStatus.status == 'Incoming') {
            this.editForm.disable();
            this.disableCustomSimpleDropdown = true;
            this.editForm.get('firstName').enable();
            this.editForm.get('lastName').enable();
            this.editForm.get('startDate').enable();
            this.editForm.get('endDate').enable();
            this.editForm.get('email').enable();
            this.editForm.get('postalAddress1').enable();
            this.editForm.get('employeeNumber').enable();
        } else {
            this.editForm.enable();
            this.disableCustomSimpleDropdown = false;
        }
}

    openDatepicker() {
        $("#endDateSelect").prop("disabled", !this.user.endDate);

        const datepickerOptions = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: this.language,
            todayHighlight: true,
            currentWeek: true,
            showWeek: true,
            currentWeekTransl: this.translate.instant("Week"),
            currentWeekSplitChar: "-",
            weekStart: 1,
        };

        $("#startDateSelect").datepicker(datepickerOptions).on("changeDate", (ev) => {
            if (
                this.editForm.value.endDate &&
                Date.parse(ev.target.value.split(" ")[0]) >
                Date.parse(this.editForm.value.endDate.split(" ")[0])
            ) {
                setTimeout(() => {
                    this.toastr.info(
                    this.translate.instant("Start date cannot be after end date."),
                    this.translate.instant("Info")
                );
                    ev.target.value = this.editForm.value.startDate;
                }, 0);
            } else {
                this.editForm.get("startDate").patchValue(ev.target.value);
            }
            this.editForm.markAsDirty();
        }).on("blur", (e) => {
            e.target.value = this.editForm.value.startDate;
            this.editForm.markAsDirty();
        });

        $("#endDateSelect").datepicker(datepickerOptions).on("changeDate", (ev) => {
            if (
                Date.parse(ev.target.value.split(" ")[0]) <
                Date.parse(this.editForm.value.startDate.split(" ")[0])
            ) {
                setTimeout(() => {
                    this.toastr.info(
                        this.translate.instant("End date cannot be before start date."),
                        this.translate.instant("Info")
                    );
                    ev.target.value = this.editForm.value.endDate;
                }, 0);
                this.editForm.markAsDirty();
            } else {
                this.editForm.get("endDate").patchValue(ev.target.value);
                this.editForm.markAsDirty();
            }
            this.editForm.markAsDirty();
        }).on("blur", (e) => {
            e.target.value = this.editForm.value.endDate;
        });

        $("#hourlyRateDateForm").datepicker(datepickerOptions).on("changeDate", (ev) => {
            this.editForm.get("hourlyRateDate").patchValue(ev.target.value);
        })
        .on("blur", (e) => {
            e.target.value = this.editForm.value.hourlyRateDate;
            this.editForm.markAsDirty();
        });
    }

    setPadding() {
        let status = '45px 0 0 27px';
        if(this.editForm.controls["firstName"].value) {
            status = '15px 0 0 27px';
        }
        return status;
    }

    checkIsFormDirty(){
      return this.editForm.touched;
    }

    formtMobileNumber(mobile_number, name) {
        this.clientsService.formatMobileNumber({'mobile_number': mobile_number}).subscribe((res:any) => {
          if(res.status) {
            if(name == 'mobile') this.editForm.get('mobile').patchValue(res['result']);
            if(name == 'mobile2') this.editForm.get('mobile2').patchValue(res['result']);
            if(name == 'phone') this.editForm.get('familyMember1').get('phone').patchValue(res['result']);
            if(name == 'phone2') this.editForm.get('familyMember2').get('phone').patchValue(res['result']);
          }
        });
      }

    autogrowNote1(){
        let  textArea = document.getElementById("familyMemberNote1");
        textArea.style.overflow = 'hidden';
        textArea.style.minHeight  = '120px';
        textArea.style.height = '0px';
        textArea.style.height = textArea.scrollHeight + 'px';
    }

    autogrowNote2() {
        let  textArea = document.getElementById("familyMemberNote2");
        textArea.style.overflow = 'hidden';
        textArea.style.minHeight  = '120px';
        textArea.style.height = '0px';
        textArea.style.height = textArea.scrollHeight + 'px';
    }

    getUserTypes() {
        this.userService.getUserTypes().then((res:any) => {

            if(res.status) {
                res['data'].forEach((data) => {

                    let obj = {
                        'id': data.id,
                        'status': data.name
                    }
                    this.typesItems.push(obj);
                });
            }
        });
    }

    getUserUE() {
        this.userService.getUserUE().then((res:any) => {

            if(res.status) {
                res['data'].forEach((data) => {

                    let obj = {
                        'id': data.name,
                        'value': data.name
                    }
                    this.user_ue.push(obj);
                });
            }
        });
    }

    getDefaultUEType() {
        return this.user_ue[0];
    }

    replacePhoneNumber(event, type) {

        if(type == 'mobile1') {
            this.editForm.get("mobile").patchValue(event);
        }

        if(type == 'mobile2') {
            this.editForm.get("mobile2").patchValue(event);
        }

        if(type == 'phone') {
            this.editForm.get('familyMember1').get('phone').patchValue(event);
        }

        if(type == 'phone2') {
            this.editForm.get('familyMember2').get('phone').patchValue(event);
        }
    }
}