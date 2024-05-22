import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    HostListener,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../../core/models/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../../../core/services/users.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { DeleteErrorModalComponent } from "./delete-error-modal/delete-error-modal.component";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { AuthService } from "src/app/core/services/auth.service";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { NewFileDialogComponent } from "src/app/projects/components/attachment/new-file-dialog/new-file-dialog.component";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";
import { FormUserComponent } from "../shared/form-user/form-user.component";
import { EditRolesService } from "../../services/edit-roles.service";


declare var $;
interface IFile {
  Name: string;
  Url: string;
  content_id: null | number | string;
  content_type: string;
  created: boolean;
  description: string;
  date: string;
  document_type: string;
  file: string;
  id: null | number | string;
  name: string;
  type: string;
  type_id: null | number | string;
}

@Component({
    selector: "app-edit-user",
    templateUrl: "./edit-user.component.html",
    styleUrls: ["./edit-user.component.css"],
})
export class EditUserComponent implements OnInit {
    @Output() updateCauseOfAnomaly = new EventEmitter();
    public user: User;
    public old_user_status: any;
    public filterNotificationsMenu = false;

    public projectsThatUserIsResponsibleFor: Object[] = [];

    public editForm: FormGroup;
    public changePasswordForm: FormGroup;
    public userDetails: any;

    public formIsDirty:any = false;

    public disabled = false;
    public updateHourlyRateIsValid = true;

    public chosenRole = 0;

    public hasOneRoleError = false;
    public filterMenu: boolean = false;
    public showPasswordChange = false;
    public defaultMoments = [];
    public chosenDefaultMoments = [];
    public dropdownSettings;
    public suppliersDisabledRead = false;
    public suppliersDisabledWrite = false;
    public isClickedOnSave: boolean = false;
    public formIsDirtyOnPermit:boolean = false;
    public sendDialogIsOpen:boolean = false;

    Object = Object;
    public endDateUnspecified = true;
    public showOptionalInputs = false;
    public selectedBankAccount;

    public userRoles = [];
    public userRolesMoments = {};
    public userRolesMomentsToSet = [];
    public selectedRoleID;

    public userOpts: any = {};
    public rolesBeforeChange: any = {};
    public currentUserOpts = {
        name: "",
        type: "",
    };

    public previousRoute: string;
    public currentAddRoute: string;
    public showNewUserRoleInput = false;
    public showNewUserProfessionInput = false;
    public showNewBankAccountInput = false;
    public language = "en";
    public week = "Week";
    public componentVisibility: number = 0;
    public professions: any = [];
    public userRolesMomentsNames = [];
    public timTaxMsgShown = false;

    public canEditHourlyRate = false;
    public changeRoleMoments = false;

    public userDefaultMomentsALL = [];
    public roleMomentsALL = [];

    public manuallyAddedMoments = [];
    public manuallyRemovedMoments = [];

    public selectedTab:any;
    public modalInfo = null;
    public clickedRow:any;
    public toggleClicked:boolean=false;
    public arrThreeDot:any = [];

    public incoming_sub;
    public todayDate = new Date();
    public today = moment(this.todayDate).format("YYYY-MM-DD");

    public accMenuToggle = true;
    public relMenuToggle = true;
    dotsDiv: boolean = false;
    public permitArray = [];
    public disableCustomSimpleDropdown: boolean = false;

    public modalPosition = {
        top: 0,
        left: 0,
    };

    public showCounter = 0;
    public createCounter = 0;

    public comments = [];
    public array = [];
    public user_roles:any = [];

    public isParentChecked: boolean = false;

    public userOptionsKeys = [];
    public whichIndexCanYouEdit: number = null;
    public spinner: boolean = false;
    public showEducation:boolean = true;

    public ataKsDisabled = false;
    public deviationDisabled = false;
    public orderDisabled = false;
    public weeklyReportDisabled = false;
    public timesheetsDisabled = false;
    public paymentPlanDisabled = false;
    public suppliersReadDisabled = false;
    public suppliersWriteDisabled = false;
    public holdCheckedRead = false;
    public holdCheckedWrite = false;
    public number_of_checked:number = 0;

    public typesItems: {id: string, status: string}[] = [
        {id: "Own Personal", status: "Own Personal"},
        {id: "Hired", status: "Hired"},
        {id: "Subcontractor", status: "Subcontractor"},
        {id: "Others", status: "Others"}
    ];
    public statusOfUser: {id: string, status: string}[] = [
        {id: 'Active', status: 'Active'},
        {id: 'Inactive', status: 'Inactive'},
        {id: 'Incoming', status: 'Incoming'},
        {id: 'Locked', status: 'Locked'}
    ];
    public userRoleSelected;
    public active_tab:any = null;
    images: IFile[] = [];
    pdf_documents: IFile[] = [];
    files: {
        images: IFile[];
        pdfs: IFile[];
        description: any;
        date: any;
        user_id: any;
        education_id: any;
    } = {
        images: [],
        pdfs: [],
        description: '',
        date: '',
        user_id: null,
        education_id: null
    };
    public updatedEducationId:number;
    public active_education:any;


    @ViewChild(FormUserComponent) formUserComponent: FormUserComponent;
    @ViewChild('hourlyRateInput') hourlyRateInTable;
    @ViewChild("newUserRoleName") newRoleInput: ElementRef;
    @ViewChild("newUserProfessionName") newProfessionInput: ElementRef;
    filterMenuTest: boolean;
    results: any[];
    result: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private userService: UsersService,
        private paymentPlanService: PaymentPlanService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private appService: AppService,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private authService: AuthService,
        private fsService: FileStorageService,
        private attachmentService: AttachmentService,
        private editRolesService: EditRolesService
    ) {
        this.language = sessionStorage.getItem("lang");
        this.translate.use(this.language);
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

        $("#hourlyRateDate").datepicker(datepickerOptions).on("changeDate", (ev) => {

            if (
                Date.parse(ev.target.value.split(" ")[0]) <
                Date.parse(this.user.hourlyRates[0].created.split(" ")[0])
            ) {
                setTimeout(() => {
                    this.toastr.info(
                      this.translate.instant("Date should be grater then last date added"),
                      this.translate.instant("Info")
                    );
                    ev.target.value = this.editForm.value.hourlyRateDate;
                }, 0);
            } else {
                this.editForm.get("hourlyRateDate").patchValue(ev.target.value);
            }
        })
        .on("blur", (e) => {
            e.target.value = this.editForm.value.hourlyRateDate;
        });

        this.initHourlyRate(0);

    }

    initHourlyRate(index) {


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
        let class_name = ".hourly-rate-" + index;

        $(class_name).datepicker(datepickerOptions).on("changeDate", (ev) => {
          let last_date;
          if(this.user.hourlyRates.length > 1) {
            last_date = Date.parse(this.user.hourlyRates[1].created.split(" ")[0]);
          }else {
            last_date = Date.parse(this.user.hourlyRates[0].created.split(" ")[0]);
          }

            if (
                Date.parse(ev.target.value.split(" ")[0]) <
                last_date
            ) {
                setTimeout(() => {
                    this.toastr.info(
                      this.translate.instant("Date should be grater then last date added"),
                      this.translate.instant("Info")
                    );
                }, 0);
            } else {
              this.changeRateData(index, 'created', ev.target.value);
            }
        })
        .on("blur", (e) => {
            e.target.value = this.editForm.value.hourlyRateDate;
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.openDatepicker()
            this.initRole();
        }, 500);
    }

    getNumberOfWeek(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(((d - Number(yearStart)) / 86400000 + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    }

    public parentCheckboxes = {};

    ngOnInit() {
        this.route.queryParamMap.subscribe((params) => {
            this.selectedTab = Number(params.get("active-tab")) || 0;
        });

        this.userService.getProfessions().subscribe((res) => {
          this.professions = res;
        });

        this.userService.showNewProfesionForm.subscribe((val) => {
          this.componentVisibility = val;
        });

        this.defaultMoments = this.route.snapshot.data["default_moments"];
        this.user_roles = this.route.snapshot.data["user_roles"];
        this.visibleAndNameCorrector(this.user_roles);

        this.dropdownSettings = {
          singleSelection: false,
          idField: "id",
          textField: "Name",
          selectAllText: this.translate.instant("Select All"),
          unSelectAllText: this.translate.instant("Unselect All"),
          itemsShowLimit: 0,
          allowSearchFilter: true,
          noDataAvailablePlaceholderText:
            this.translate.instant("No data available"),
          searchPlaceholderText: this.translate.instant("Search"),
        };
        this.spinner = true;
        this.userService.getRoles().subscribe((res) => {
          this.userRoles = res;
          this.spinner = false;
          let status = this.user['role_exist'];
          if(!status) {
            let obj = {
                'id': '0',
                'roles': 'Select Role',
                'isAdmin': '0',
                'color': '#ffffff'
            }
            this.userRoles = [obj].concat(this.userRoles);
            console.log(this.userRoles)
          }
        });

        this.user = this.route.snapshot.data["user"]["user"];
        this.userRoleSelected = this.user.role;
        this.old_user_status = this.user.status;
        this.previousRoute = "/users";
        this.appService.setBackRoute(this.previousRoute);
        this.appService.setShowAddButton = false;
        this.userOpts = this.route.snapshot.data["user"]["opts"];

        Object.keys(this.userOpts).forEach(key => {
          if (key != 'notifications') {
            this.permitArray[key] = this.mapPermissions(this.userOpts[key]);
            for (let i = 0; i < this.permitArray[key].length; i++) {
              if (this.userOpts[key].show[this.permitArray[key][i].show] != undefined) {
                this.array.push(this.userOpts[key].show[this.permitArray[key][i].show].status)
                this.result = this.array.every(element => element === true);

              }
              if (this.userOpts[key].show[this.permitArray[key][i].show]) {
                if (this.userOpts[key].show[this.permitArray[key][i].show].status) {
                  this.showCounter += 1;
                }
              }
              if (this.userOpts[key].create[this.permitArray[key][i].create]) {
                if (this.userOpts[key].create[this.permitArray[key][i].create].status) {
                  this.createCounter += 1;

                }
              }
            }
          }

          this.parentCheckboxes[key] = this.isParentCheckboxActive(key);
        });
        delete this.userOpts.messages;

        this.userOptionsKeys = Object.keys(this.userOpts);

        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

        this.changePasswordForm = this.fb.group({
          password: ["", [Validators.minLength(6)]],
          confirmPassword: [""],
        });

        let hourlyRateDate = `${this.today} ${this.translate.instant("Week")} ${this.getNumberOfWeek(this.todayDate)[1]}`;

        if(this.user.hourlyRates.length > 0 &&
            (Date.parse(this.today.split(" ")[0]) <= Date.parse(this.user.hourlyRates[0].created.split(" ")[0]))
          ) {
            hourlyRateDate = moment(this.user.hourlyRates[0].created, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');
        }

        const startDate = this.user.startDate.replace(
          "Vecka",
          this.translate.instant("Week")
        );
        const endDate = this.user.endDate
          ? this.user.endDate.replace("Vecka", this.translate.instant("Week"))
          : this.user.endDate;


        this.editForm = this.fb.group({
          role: [this.user.role],
          profession: [this.user.profession],
          language: [this.user.language, [Validators.required]],
          email: [
            this.user.email,
            [
              this.requiredIfValidator(() => this.editForm.get("status").value),
              Validators.email,
            ],
          ],
          hourlyRate: [
            this.user.hourlyRate,
            [this.requiredIfValidator(() => this.editForm.get("status").value)],
          ],
          hourlyRateDate: [hourlyRateDate, [Validators.required]],
          hourlyRateID: [null, []],
          firstName: [this.user.firstname, [Validators.required]],
          lastName: [this.user.lastname, [Validators.required]],
          startDate: [startDate, [Validators.required]],
          endDate: [endDate, []],
          employeeNumber: [
            this.user.employeeNumber // [this.requiredIfValidator(() => this.editForm.get("status").value)],
          ],
          bic: [this.user.bic],
          iban: [this.user.iban],
          bankNumber: [this.user.bankNumber],
          accountNumber: [this.user.accountNumber],
          type: [this.user.type],
          personalNumber: [this.user.personalNumber // [this.requiredIfValidator(() => this.editForm.get("status").value)],
          ],
          phone: [this.user.phone],
          mobile: [this.user.mobile, [Validators.required]],
          mobile2: [this.user.mobile2, [Validators.required]],
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

        this.incoming_sub = this.editForm
          .get("status")
          .valueChanges.subscribe((value) => {
            this.editForm.get("personalNumber").updateValueAndValidity();
            this.editForm.get("employeeNumber").updateValueAndValidity();
            this.editForm.get("email").updateValueAndValidity();
            this.editForm.get("hourlyRate").updateValueAndValidity();
          });

        this.chosenRole = this.user.role;

        this.endDateUnspecified = !this.user.endDate;
        this.selectedRoleID = this.user.role;

        this.userService.getRolesMoments().subscribe((res) => {
          this.userRolesMoments = res;
          const data = {
            user_id: this.user.id,
            role_id: this.user.role,
            deleted: false,
          };

          this.userService.getMomentsForUser(data).subscribe((res) => {
            this.userDefaultMomentsALL = res.moments;
            this.chosenDefaultMoments = res.moments;
            this.numberOfSelectedMoments();
          });
        });

        this.paymentPlanService.getTheComments(this.user.id, 'user').subscribe((res) => {
            this.comments = res['data'].slice(0);
        });

        if(this.userDetails.create_users_Manageusers) {
            this.editForm.enable();
        }else {
            this.editForm.disable();
        }

        this.selectedTab = this.editRolesService.getSelectedTab();
        this.checkingDisabledPermision();
    }

    initRole() {

        let status = this.user['role_exist'];
        if(!status) {

            this.user['role'] = 0;
            this.user['role_name'] = 'Select Role';

            this.toastr.error(
                this.translate.instant("Please user select role!")
              );
            this.changeSelectedTab(2);
        }
    }

    hourlyRateButton() {
        let status = true;

        if(this.whichIndexCanYouEdit != null) {
          status = false;
        }else if(this.user.hourlyRates.length > 0) {
            if (
                Date.parse(this.editForm.get("hourlyRateDate").value.split(" ")[0]) <=
                Date.parse(this.user.hourlyRates[0].created.split(" ")[0])
            ) {
              status = false;
            }else {
              status = true;
            }
        }

        return status;
    }

  isParentCheckboxActive(key) {

    if (key === 'notifications') return this.isNotificationChecked(key);
    let flag = true;
    const create = this.userOpts[key].create;
    const show = this.userOpts[key].show;
    for (let checked of create) {
      if (!checked.status) {
        flag = false;
        break;
      }
    }
    if (flag === false) {
      return flag;
    }
    for (let checked of show) {
      if (!checked.status) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  isNotificationChecked(key) {
    let flag = true;
    const notis = Object.keys(this.userOpts[key]);
    for (let key2 of notis) {
      if (!this.userOpts[key][key2].status) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  mapPermissions(permissions) {

    const showCreateObject = {};
    this.addIndex(permissions.show, 'show', showCreateObject);
    this.addIndex(permissions.create, 'create', showCreateObject);
    const showCreateArray = this.generateShowCreateArray(showCreateObject);
    return showCreateArray;
  }

  addIndex(array, type, showCreateObject) {
    let index = 0;

    for (let item of array) {
      if (!showCreateObject[item.subname]) {
        showCreateObject[item.subname] = { ...item, [type]: index };
      } else {
        showCreateObject[item.subname] = { ...showCreateObject[item.subname], [type]: index };
      }
      index = index + 1;
    }
  }

  generateShowCreateArray(showCreateObject) {
    const showCreateArray = [];
    const keys = Object.keys(showCreateObject);
    for (let key of keys) {
      showCreateArray.push({ ...showCreateObject[key] });
    }
    return showCreateArray;
  }

  ngAfterDestroy() {
    if (this.incoming_sub) {
      this.incoming_sub.unsubscribe();
    }
  }

  setSelectedTab(tab) {
    this.selectedTab = tab;
  }

  async savePassword() {
    if (this.changePasswordForm.valid) {
      const data = this.changePasswordForm.value;
      if (data.password !== data.confirmPassword) {
        this.toastr.error(
          this.translate.instant("Passwords are not matching!")
        );
      } else if (data.password !== "") {
        this.userService
          .setNewPassword({ UserID: this.user.id, Password: data.password })
          .subscribe((res) => {
            this.disabled = false;
            if (res["status"]) {
              this.toastr.success(
                this.translate.instant("Password updated successfully."),
                this.translate.instant("Success")
              );
            } else {
              this.toastr.error(
                this.translate.instant(
                  "Password could not be updated.",
                  this.translate.instant("Success")
                )
              );
            }
            this.showPasswordChange = false;
          });
      }
    }
  }

    async saveUser(userData) {

        userData.role = this.userRoleSelected;
        userData.defaultMoments = this.chosenDefaultMoments;
        userData.manuallyAddedMoments = this.manuallyAddedMoments;
        userData.manuallyRemovedMoments = this.manuallyRemovedMoments;
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
            if(res.data && res.data.msg && res.data.msg == 'Type already exist') {
                this.toastr.error(
                    this.translate.instant("Type already exist"),
                    this.translate.instant("Error")
                );
                this.spinner = false;
            }else {
                this.toastr.error(
                    this.translate.instant("Something went wrong!"),
                    this.translate.instant("Error")
                );
            }
        }
        this.disabled = false;
        this.whichIndexCanYouEdit = null;
        this.isClickedOnSave = true;
    }

  deleteUser() {
    const userId = this.user.id;

    this.userService
      .checkIfUserIsResponsibleForAnyProject(userId)
      .subscribe((res) => {
        if (res["projects"]) {
          this.openModal(res["projects"]);
          this.projectsThatUserIsResponsibleFor = res["projects"];
        } else {
          this.userService.deleteUser(this.user.id).subscribe((res2) => {
            if (res2["status"]) {
              this.toastr.success(
                this.translate.instant("Successfully deleted user!"),
                this.translate.instant("Success")
              );
              this.router.navigate(["/users"]);
            }
          });
        }
      });
  }

  openModal(projects) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { projects };
    this.dialog
      .open(DeleteErrorModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => { });
  }

  togglePasswordVisibility(e) {
    if (this.userDetails.type == "1") {
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

  toggleFilterMenu(name, type, action = "save", e = null): void {

    if (this.editForm.get("status").value !== "Incoming") {
      if (action === "save") {
        this.currentUserOpts = { name, type };

        if (name === this.currentUserOpts.name) {
          this.filterMenuTest = !this.filterMenuTest;
        }
      } else {
        if (e) {
          if (e.target.id !== "looksLikeModal") {
            return;
          }
        }
        this.filterMenuTest = !this.filterMenuTest;
        this.currentUserOpts = { name, type };
      }
    }
  }

  toggleFilterNotifications(e) {
    if (
      e.target.dataset.origin === "filterNotifications" &&
      this.editForm.get("status").value !== "Incoming"
    ) {
      this.filterNotificationsMenu = !this.filterNotificationsMenu;
    }
  }

  toggleNewUserRoleInput() {
    if(!this.userDetails.create_users_Manageusers) {
        return;
    }
    if (this.editForm.get("status").value !== "Incoming") {
      this.showNewUserRoleInput = !this.showNewUserRoleInput;
      this.cd.detectChanges();
      this.newRoleInput.nativeElement.focus();
    }
  }

  toggleNewUserProfessionInput() {
    this.showNewUserProfessionInput = !this.showNewUserProfessionInput;
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
        //window.location.reload();
        this.router.navigate(["/users/edit/roles/" + res.role_id]);/*.then(() => {
            window.location.reload();
        });*/
      }
    }
  }

  async newUserProfession(profession) {
    if (profession && profession.trim() !== "") {
      const res: any = await this.userService.addNewProfession({ profession });
      if (res.status) {
        if (res.data == -1) {
          this.toastr.error(
            this.translate.instant("User profession exists."),
            this.translate.instant("Error")
          );
        } else {
          this.professions.push({
            id: res.data,
            profession: profession,
          });
          this.toggleNewUserProfessionInput();
        }
      }
    }
  }

    subRoleClicked(name, type, subname, status, i, e) {

        const roles = JSON.parse(JSON.stringify(this.userOpts[name][type]));
        if (name === "project") {
          roles.pop();
        }

        if (roles.filter((role) => role.status).length === 0 && !status) {
            this.toastr.info(
                this.translate.instant("You need to leave at least one sub role checked."),
                this.translate.instant("Info")
            );
            this.userOpts[name][type][i].status = true;
            e.target.checked = true;
        } else {
            this.patchUserEditOptions({
                name,
                type,
                subname,
                userId: this.user.id,
                status,
            });
        }
    }

    formatOptionName(optionName) {
        const a = optionName.match(/[A-Z]/);
        if (a) {
            const upToCap = optionName.substr(0, a.index);
            const afterCap = optionName.substr(a.index);
            const formattedString = upToCap + " " + afterCap;
            return formattedString.replace(/\b\w/g, (l) => l.toUpperCase()).trim();
        }
        return optionName.replace(/\b\w/g, (l) => l.toUpperCase()).trim();
    }

    editUserRolePermissions() {
        if(!this.userDetails.create_users_Manageusers) {
            return;
        }
        if (this.editForm.get("status").value !== "Incoming") {
            this.router.navigate(["users/edit/roles/", this.userRoleSelected]);
        }
    }

    toggleRole(role) {

        this.userService.getRolePermissionsWithPredefinedSelected(role.id, this.user.id).then((res:any)=> {
          if(res.status) {
            this.user_roles = res['data'];
          }
        });

        this.userRoleSelected = role.id;
    }

  toggleItem(role) {

    this.userService.getRolePermissionsWithPredefinedSelected(role.id, this.user.id).then((res:any)=> {
      if(res.status) {
        this.visibleAndNameCorrector(res['data']);
        this.user_roles = res['data'];
        this.checkingDisabledPermision();
        this.userRoleSelected = role.id;
      }
    });
    this.userRoleSelected = role.id;

    this.formIsDirtyOnPermit = true;
    this.editForm.value.role = role.id;

    this.userRoleChange(role.id);
  }

  async userRoleChange(select) {

    if (this.editForm.get("status").value !== "Incoming") {
      //this.userOpts = await this.userService.getPredefinedRoles(select);

      this.selectedRoleID = select;

      this.manuallyAddedMoments = [];
      this.manuallyRemovedMoments = [];
      this.chosenDefaultMoments = [];

      this.userRolesMoments[this.editForm.value.role].forEach((m) => {
        this.chosenDefaultMoments.push({
          id: m,
          Name: this.defaultMoments.find((dm) => dm.id == m).Name,
        });
        if (this.defaultMoments.find((dm) => dm.id == m).parent !== "0") {
          this.userRolesMoments[this.editForm.value.role].push(
            this.defaultMoments.find((dm) => dm.id == m).parent
          );
        }
      });

      this.userRolesMoments[this.editForm.value.role] = this.userRolesMoments[
        this.editForm.value.role
      ].filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });

      this.chosenRole = this.editForm.value.role;
      this.chosenDefaultMoments = JSON.parse(
        JSON.stringify(this.chosenDefaultMoments)
      );
    }
  }

  setMomentsToRoleMoments() {

    this.chosenDefaultMoments = this.userRolesMoments[this.chosenRole].map(
      (m) => {
        return {
          id: m,
          Name: this.defaultMoments.find((dm) => dm.id == m).Name,
        };
      }
    );
  }

  getRoleIndex(roles, subname) {
    return roles.findIndex((role) => role.subname == subname);
  }

  async showGlobalChanged(role, status) {
    role.status = status;
  }

  private patchUserEditOptions(data) {
    const userPermissions = JSON.parse(sessionStorage.getItem("userDetails"));
    if (userPermissions.user_id == data.userId) {
      const key = `${data.type}_${data.name}_${data.subname.replace(" ", "")}`;
      userPermissions[key] = +data.status;
      sessionStorage.setItem("userDetails", JSON.stringify(userPermissions));
    }
    this.userService.patchUserEditOptions(data).then();
  }

  updateUserRole(name, type, subname, status, createElement = null) {
    if (createElement) {
      this.patchUserEditOptions({
        name,
        type: "create",
        subname,
        userId: this.user.id,
        status,
      });
    }

    this.patchUserEditOptions({
      name,
      type,
      subname,
      userId: this.user.id,
      status,
    });
  }

  toggleOptionalInputs() {
    if (this.editForm.get("status").value !== "Incoming") {
      this.showOptionalInputs = !this.showOptionalInputs;
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

  openComponentDetail(e) {
    e.preventDefault();
    scroll(0, 0);
    this.userService.setComponentVisibility(1);
  }

  public onCloseClick() {
    this.userService.setComponentVisibility(0);
  }

  GenerateNewPassword() {
    this.userService.generateNewPassword(this.user.id).subscribe((res) => {
      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("TSC_NEW_GENERATED_PASSWORD_SENT"),
          this.translate.instant("Success")
        );
      } else {
        this.toastr.error(
          this.translate.instant("You could not send  new generate password."),
          this.translate.instant("Error")
        );
      }
    });
  }

  toggleHourlyRateEdit() {
    if (this.editForm.get("status").value !== "Incoming") {
      if (!this.updateHourlyRateIsValid) {
        this.toastr.error(
          this.translate.instant("All fields are required."),
          this.translate.instant("Error")
        );
        return;
      }
      if (this.canEditHourlyRate) {
        this.disabled = true;

        this.userService
          .updateHourlyRates(this.user.hourlyRates)
          .subscribe((res) => {
            if (res["status"]) {

              this.toastr.success(
                this.translate.instant("Successfully updated hourly rates."),
                this.translate.instant("Success")
              );
            } else {
              this.toastr.error(
                this.translate.instant(
                  "There was an error while trying to update hourly rate."
                ),
                this.translate.instant("Error")
              );
            }
            this.disabled = false;
          });
        this.canEditHourlyRate = false;
      } else {
        this.canEditHourlyRate = true;
      }
    }
  }

  changeRateData(index, property, newValue) {

    let value;
    if(property == 'hourlyRate') {
      value = newValue.replace("T", " ");
      //this.editForm.get('hourlyRate').patchValue(value);
      this.user.hourlyRates[index].hourlyRate = value;
    }else {
      value = newValue.replace("T", " ");
      //this.editForm.get('hourlyRateDate').patchValue(value);
      this.user.hourlyRates[index].created = value.split(" ")[0];
    }
    this.updateHourlyRateIsValid = newValue.trim() != "";
  }

  endDateUnspecifiedChanged(e) {
    if (e.target.checked) {
      $("#endDateSelect").prop("disabled", true);
      this.editForm.get("endDate").patchValue("");
    } else {
      $("#endDateSelect").prop("disabled", false);
    }
  }

  onNotificationsCheck() {
    if (this.user.Notification == "1") {
      this.user.Notification = "0";
    } else {
      this.user.Notification = "1";
    }
    this.userService.setUserNotifications(this.user.id, this.user.Notification).then();
  }

  onFilterNotificationsCheck(event, type) {
    const notis = this.userOpts.notifications[type][0];
    const data = {
      checked: event.target.checked,
      type: type,
      userId: this.user.id,
    };

    this.userService.setPermissionUserNotifications(data).subscribe(() => {
      notis.status = data.checked;
    });
  }

  isAtLeastOneNotisChecked() {
    const notis = this.userOpts.notifications;
    const notisKeys = Object.keys(notis);
    let flag = false;

    for (let i = 0; i < notisKeys.length; i++) {
      const key = notisKeys[i];

      if (notis[key][0].status) {
        flag = true;
        break;
      }
    }

    return flag;
  }

    editRoleMoments() {
        if(!this.userDetails.create_users_Manageusers) {
            return;
        }
        if (this.editForm.get("status").value !== "Incoming") {
            this.changeRoleMoments = true;
        }
    }

    toggleRoleMoments(e): void {
        if (e) {
            if (e.target.id !== "looksLikeModal") {
                return;
            }
        }
        this.changeRoleMoments = !this.changeRoleMoments;
    }

    setRoleMoments() {
        this.userService.setRoleMoments(
            this.editForm.value.role,
            this.userRolesMoments[this.editForm.value.role]
        );
    }

  roleMomentClicked(item, e) {

    var item =
      this.defaultMoments[
      this.defaultMoments.findIndex((m) => m.id == item.id)
      ];
    if (e.target.checked) {
      var dropdownchildren =
        document.getElementsByClassName("item2")[0].children;
      var parentindex = this.defaultMoments.findIndex((m) => m.id == item.id);

      if (item.parent !== "0") {
        var parentindex = this.defaultMoments.findIndex(
          (m) => m.id == item.parent
        );

        dropdownchildren[parentindex].getElementsByTagName("input")[0].checked =
          true;
        this.userRolesMoments[this.editForm.value.role].push(item.id);
        this.userRolesMoments[this.editForm.value.role].push(item.parent);
      } else {
        this.userRolesMoments[this.editForm.value.role].push(item.id);
        this.defaultMoments.forEach((m, index) => {
          if (item.id == m.parent) {
            dropdownchildren[index].getElementsByTagName("input")[0].checked =
              true;
            this.userRolesMoments[this.editForm.value.role].push(m.id);
          }
        });
      }

      if (this.chosenDefaultMoments.every((dm) => dm.id != item.id)) {
        this.chosenDefaultMoments.push({ id: item.id, Name: item.Name });
      }
    } else {
      var dropdownchildren =
        document.getElementsByClassName("item2")[0].children;
      var parentindex = this.defaultMoments.findIndex((m) => m.id == item.id);

      if (item.parent == "0") {
        this.userRolesMoments[this.editForm.value.role] = this.userRolesMoments[
          this.editForm.value.role
        ].filter((v) => v != item.id);
        this.defaultMoments.forEach((m, index) => {
          if (item.id == m.parent) {
            dropdownchildren[index].getElementsByTagName("input")[0].checked =
              true;
            this.userRolesMoments[this.editForm.value.role] =
              this.userRolesMoments[this.editForm.value.role].filter(
                (v) => v != m.id
              );
          }
        });
      } else {
        var parentindex = this.defaultMoments.findIndex(
          (m) => m.id == item.parent
        );
        var tempArr = [];
        var compareArr = [];
        this.defaultMoments.forEach((m, index) => {
          if (item.parent == m.parent) {
            dropdownchildren[parentindex].getElementsByTagName(
              "input"
            )[0].checked = false;
            this.userRolesMoments[this.editForm.value.role] =
              this.userRolesMoments[this.editForm.value.role].filter(
                (v) => v != item.id
              );
            tempArr.push(m.id);
            if (
              this.userRolesMoments[this.editForm.value.role].includes(m.id) ==
              false
            ) {
              compareArr.push(m.id);
            }
          }
        });
        if (tempArr.length == compareArr.length) {
          this.userRolesMoments[this.editForm.value.role] =
            this.userRolesMoments[this.editForm.value.role].filter(
              (v) => v != item.parent
            );
        }
      }

      this.manuallyAddedMoments = this.manuallyAddedMoments.filter(
        (m) => m != item.id
      );
      this.manuallyRemovedMoments.push(item.id);

      this.userRolesMoments[this.editForm.value.role] = this.userRolesMoments[
        this.editForm.value.role
      ].filter((urm) => urm != item.id);

      const index = this.chosenDefaultMoments.findIndex((m) => m.id == item.id);

      if (
        index !== -1 &&
        !this.manuallyAddedMoments.includes(this.chosenDefaultMoments[index].id)
      ) {
        this.chosenDefaultMoments = this.chosenDefaultMoments.filter(
          (m) => m.id != item.id
        );
      }

      this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
        this.chosenRole
      ].filter((urm) => urm != item.id);
    }
    if (e.target.checked) {
        this.onMomentSelect(item)
    }else {
        this.onMomentDeSelect(item);
    }
/*
    this.chosenDefaultMoments = JSON.parse(
      JSON.stringify(this.chosenDefaultMoments)
    );*/
    this.setRoleMoments();
    this.initializeChoosenMoments();
  }

  removeHourlyRate(i) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "300px";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.userService
            .removeHourlyRate(this.user.hourlyRates[i].id)
            .subscribe((res) => {
              if (res["status"]) {
                this.user.hourlyRates.splice(i, 1);
                this.toastr.success(
                  this.translate.instant("Successfully removed hourly rate!"),
                  this.translate.instant("Success")
                );
              }
            });
        }
      });
  }

  unique(array, propertyName) {
    return array.filter(
      (e, i) =>
        array.findIndex((a) => a[propertyName] === e[propertyName]) === i
    );
  }

  onMomentSelect(moment) {

    var dropdownchildren = document.getElementsByClassName("item2")[0].children;
    let selected_index = this.defaultMoments.findIndex(
      (m) => m.id == moment.id
    );
    let selected_moment = this.defaultMoments[selected_index];
    moment.parent = selected_moment.parent;


    if (selected_moment.parent == 0) {
      let parent_moment_id = selected_moment.id;

      this.chosenDefaultMoments.push(moment);
      this.manuallyAddedMoments.push(moment.id);

      this.defaultMoments.forEach((m, index) => {
        if (m.parent == parent_moment_id) {
          let obj = {
            Name: m.Name,
            id: m.id,
            parent: m.parent
          };
          this.chosenDefaultMoments.push(obj);
          this.manuallyAddedMoments.push(m.id);
          if (
            dropdownchildren[index].getElementsByTagName("input")[0].checked ==
            false
          ) {
            dropdownchildren[index].getElementsByTagName("input")[0].click();
          }
        }
      });
    } else {
      let obj = {
        Name: moment.Name,
        id: moment.id,
        parent: moment.parent
      };

      this.chosenDefaultMoments.push(obj);
      this.manuallyAddedMoments.push(moment.id);
      this.numberOfSelectedMoments();
    }

    this.refreshSortData();

    if (selected_moment.parent != 0) {
      let selected_parent_index = this.defaultMoments.findIndex(
        (m) => m.id == selected_moment.parent
      );
      let parent_moment = this.defaultMoments[selected_parent_index];

      if (!this.manuallyAddedMoments.includes(parent_moment.id)) {
        this.manuallyAddedMoments.push(parent_moment.id);
      }

      let index_for_chosenDefaultMoments = this.chosenDefaultMoments.findIndex(
        (m) => m.id == parent_moment.id
      );

      if (index_for_chosenDefaultMoments == -1) {
        let obj = {
          Name: parent_moment.Name,
          id: parent_moment.id,
        };
        this.chosenDefaultMoments.push(obj);
      }
      if (
        dropdownchildren[selected_parent_index].getElementsByTagName("input")[0]
          .checked == false
      ) {
        dropdownchildren[selected_parent_index].getElementsByTagName(
          "input"
        )[0].checked = true;
      }
    }

    let index_for_manuallyRemovedMoments = this.manuallyRemovedMoments.indexOf(
      selected_moment.id
    );
    if (index_for_manuallyRemovedMoments != -1) {
      this.manuallyRemovedMoments.splice(index_for_manuallyRemovedMoments, 1);
    }

    let selected_parent_index = this.manuallyRemovedMoments.indexOf(
      selected_moment.parent
    );

    if (selected_parent_index != -1) {
      this.manuallyRemovedMoments.splice(selected_parent_index, 1);
    }
    this.refreshSortData();

    this.formIsDirtyOnPermit = true;
    this.initializeChoosenMoments();

  }

  refreshSortData() {

    this.manuallyAddedMoments = [...new Set(this.manuallyAddedMoments)];
    this.manuallyRemovedMoments = [...new Set(this.manuallyRemovedMoments)];
    this.chosenDefaultMoments = this.unique(this.chosenDefaultMoments, "id");
  }

  onMomentDeSelect(moment) {

    var dropdownchildren = document.getElementsByClassName("item2")[0].children;
    let selected_index = this.defaultMoments.findIndex(
      (m) => m.id == moment.id
    );
    let selected_moment = this.defaultMoments[selected_index];

    if (selected_moment.parent == 0) {
      let parent_moment_id = selected_moment.id;
      this.defaultMoments.forEach((m, index) => {
        if (m.parent == parent_moment_id) {
          if (
            dropdownchildren[index].getElementsByTagName("input")[0].checked ==
            true
          ) {
            dropdownchildren[index].getElementsByTagName("input")[0].click();
          }
        }
      });
    }

    let index_for_manuallyAddedMoments = this.manuallyAddedMoments.indexOf(
      moment.id
    );
    if (index_for_manuallyAddedMoments != -1) {
      this.manuallyAddedMoments.splice(index_for_manuallyAddedMoments, 1);
    }

    this.manuallyRemovedMoments.push(moment.id);

    let index_for_chosenDefaultMoments = this.chosenDefaultMoments.findIndex(
      (m) => m.id == moment.id
    );
    if (index_for_chosenDefaultMoments != -1) {
      this.chosenDefaultMoments.splice(index_for_chosenDefaultMoments, 1);
    }

    let moments_with_parent_ids = [];
    let moments_with_parent = [];
    if (selected_moment.parent != 0) {
      moments_with_parent = this.defaultMoments.filter(
        (res) =>
          res["parent"] == selected_moment.parent ||
          res["id"] == selected_moment.parent
      );
      moments_with_parent.forEach((m, index) => {
        let ii = this.chosenDefaultMoments.findIndex((mm) => mm.id == m.id);
        if (ii != -1) {
          moments_with_parent_ids.push(m.id);
        }
      });
    }

    if (moments_with_parent_ids.length <= 1 && selected_moment.parent != 0) {
      let selected_parent_index = this.defaultMoments.findIndex(
        (m) => m.id == selected_moment.parent
      );
      let selected_parent_moment = this.defaultMoments[selected_parent_index];

      if (
        selected_parent_index != -1 &&
        dropdownchildren[selected_parent_index].getElementsByTagName("input")[0]
          .checked == true
      ) {
        dropdownchildren[selected_parent_index].getElementsByTagName(
          "input"
        )[0].checked = false;
      }

      let parent_index_for_manuallyAddedMoments =
        this.manuallyAddedMoments.indexOf(selected_parent_moment.id);
      if (parent_index_for_manuallyAddedMoments != -1) {
        this.manuallyAddedMoments.splice(
          parent_index_for_manuallyAddedMoments,
          1
        );
      }

      this.manuallyRemovedMoments.push(selected_parent_moment.id);
      let parent_index_for_chosenDefaultMoments =
        this.chosenDefaultMoments.findIndex(
          (m) => m.id == selected_parent_moment.id
        );
      if (parent_index_for_chosenDefaultMoments != -1) {
        this.chosenDefaultMoments.splice(
          parent_index_for_chosenDefaultMoments,
          1
        );
      }
    }

    let pom = [];
    this.chosenDefaultMoments.forEach((m, index) => {
      if (m.Name) {
        pom.push(m);
      }
    });

    this.chosenDefaultMoments = pom;
    this.refreshSortData();
    this.updateCauseOfAnomaly.next(this.chosenDefaultMoments);

    this.formIsDirtyOnPermit = true;
    this.initializeChoosenMoments();
  }

  onMomentSelectAll() {

  //  this.manuallyAddedMoments = this.defaultMoments.map((dm) => dm.id);
    this.manuallyRemovedMoments = [];
    this.chosenDefaultMoments = [];
    this.manuallyAddedMoments = [];

    this.defaultMoments.forEach((m, index) => {
        let obj = {
          Name: m.Name,
          id: m.id,
          parent: m.parent
        };
        this.chosenDefaultMoments.push(obj);
        this.manuallyAddedMoments.push(m.id);
    });

    this.numberOfSelectedMoments();
    this.formIsDirtyOnPermit = true;
  }

  onMomentDeSelectAll() {
    this.manuallyRemovedMoments = this.defaultMoments.map((dm) => dm.id);
    this.chosenDefaultMoments = [];
    this.manuallyAddedMoments = [];
    this.number_of_checked = 0;
    this.formIsDirtyOnPermit = true;

  }

  userStatusChanged(event) {
    const status = event.target.value;

    if (status === "Incoming") {
      this.jQueryDisableInput(true);
      return;
    }

    if (this.user.status === "Incoming" && status === "Inactive") {
    } else {
      this.jQueryDisableInput(false);
    }
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

  jQueryDisableInput(bool) {
    $(`input:not(
        #firstName,
        #lastName,
        #startDateSelect,
        #endDateSelect,
        #unspecified-end-date

    )`).prop("disabled", bool);

    $(`select:not(
      #status
    )`).prop("disabled", bool);
    $(`textarea`).prop("disabled", bool);
  }

  resetPassword() {
    this.disabled = true;
    let obj = {
      user_id: this.user.id,
      email: this.user.email,
      first_name: this.user.firstname,
      last_name: this.user.lastname,
    };

    this.authService.resetPassword(obj).subscribe((result) => {
      this.disabled = false;
      if (result["status"]) {
        this.toastr.success(
          this.translate.instant("Reset password link is sent!"),
          this.translate.instant("Success")
        );
      }
    });
  }

   changeSelectedTab(index) {
    this.editRolesService.setSelectedTab('0');
    this.canDeactivate(index);
  }

  closeP() {
    this.dotsDiv = false;
  }

  popUp(index, rate) {
    this.dotsDiv = !this.dotsDiv;
    const elem = document.getElementById(
      "hourly-table-" + index
    );
    const position = elem.getBoundingClientRect();
    this.modalPosition.top = position.top - 66;
    this.modalPosition.left = position.left + 50;

    this.modalInfo = {
      rate: rate,
      rateId: rate.id,
      index: index,
      user: this.user,
      editForm: this.editForm,
      userOpts: this.userOpts,
      canEditHourlyRate: this.canEditHourlyRate,
      disabled: this.disabled
    };
  }

  editUserPermision() {

    if (this.editForm.valid) {
      const data = this.editForm.value;
      const userData = {
        id: this.user.id,
        type: data.type,
        status: data.status,
        role: data.role,
        defaultMoments: this.chosenDefaultMoments,
        manuallyAddedMoments: this.manuallyAddedMoments,
        manuallyRemovedMoments: this.manuallyRemovedMoments,
        old_user_status: this.old_user_status,
      };
      this.userService.saveUserPermit(userData);
    }
  }

  async editUserRate(data = null, setUserOptions = true) {
    if(!data) {
      data = this.editForm.value;
    }

    this.whichIndexCanYouEdit = null;
    this.spinner = true;
    const userData = {
      id: this.user.id,
      hourlyRate: data.hourlyRate,
      hourlyRateDate: data.hourlyRateDate,
      hourlyRateID: data.hourlyRateID
    };

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

    const res = await this.userService.addHourlyRate(userData);

    this.spinner = false;
    this.editForm.get('hourlyRateID').patchValue(null);
    if (res["status"] === "wrong password") {
      this.toastr.error(
        this.translate.instant("Wrong password entered."),
        this.translate.instant("Error")
      );
    } else if (res["status"]) {

      if (res["hourlyRateId"] != 0 && !userData.hourlyRateID) {
        this.user.hourlyRates.unshift({
          id: res["hourlyRateId"],
          hourlyRate: userData["hourlyRate"],
          created: userData["hourlyRateDate"].substring(0, 10),
          dateWithoutTime: userData["hourlyRateDate"].substring(0, 10),
          userId: this.user.id,
        });
      }

      if (res["hourlyRateId"] == 0 && this.timTaxMsgShown === false) {
        this.toastr.info(
          this.translate.instant("Hourly rate already exists."),
          this.translate.instant("Info")
        );
        this.timTaxMsgShown = true;
      }

      this.toastr.success(
        this.translate.instant("Successfully edited user!"),
        this.translate.instant("Success")
      );
      if(setUserOptions) {
        await this.userService.setUserEditOptions({
          userOpts: this.userOpts,
          userId: this.user.id,
        });
      }
    } else {
      this.toastr.error(
        this.translate.instant("Something went wrong!"),
        this.translate.instant("Error")
      );
    }

    this.disabled = false;
    this.editForm.markAsUntouched();
  }


  selectType(selectedType, formControlName) {
    this.editForm.markAsDirty();
    this.editForm.get(formControlName).patchValue(selectedType.status);
    this.formIsDirtyOnPermit = true;
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

    } else {
      this.editForm.enable();
      this.disableCustomSimpleDropdown = false;
    }
     this.formIsDirtyOnPermit = true;
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


  clickedOnParentCheckbox(event, option) {
    const checked = event.target.checked;
    this.userOpts[option].create.forEach((option_)=>{
      option_.status = checked;
    });
    this.userOpts[option].show.forEach((option_)=>{
      option_.status = checked;
    });
  }


  toggleChildCheckboxes(event, option, item) {
    const checked = event.target.checked;
    if (this.userOpts[option].create[item.create]) {
      this.userOpts[option].create[item.create].status = checked;
    }
    if (this.userOpts[option].show[item.show]) {
      this.userOpts[option].show[item.show].status = checked;
    }

    this.checkIfParentShouldBeActive(option);
    return;
  }

  checkIfParentShouldBeActive(key) {
    this.parentCheckboxes[key] = this.isParentCheckboxActive(key);
  }


  toggleBlackParentShow(event, option) {
    const checked = event.target.checked;
    if(checked) {
      for(let i=0; i < this.userOpts[option].show.length; i++){
        this.userOpts[option].show[i].status = true;
      }
    } else {
      for (let i=0; i < this.userOpts[option].show.length; i++) {
        this.userOpts[option].show[i].status = false;
      }
    }
  }

  toggleBlackParentCreate(event, option) {
    const checked = event.target.checked;
    if(checked){
      for(let i = 0; i < this.userOpts[option].create.length; i++) {
        this.userOpts[option].create[i].status = true;
      }
    } else {
      for(let i = 0; i < this.userOpts[option].create.length; i++) {
        this.userOpts[option].create[i].status = false;
      }
    }
  }

  DoesParentShowNeedToBeChecked(option): boolean {
    let flag: boolean = true;
    for(let i = 0; i < this.userOpts[option].show.length; i++) {
      if(this.userOpts[option].show[i].status == false) {
        flag = false;
        break;
      }
    }

    this.checkIfParentShouldBeActive(option);
    return flag;
  }

  DoesParentCreateNeedToBeChecked(option): boolean {
    let flag: boolean = true;
    for (let i = 0; i < this.userOpts[option].create.length; i++) {
      if(this.userOpts[option].create[i].status == false) {
        flag = false;
        break;
      }
    }
    return flag;
  }


  toggleOnDeleteThreeDotsHourly(event) {
    this.user.hourlyRates = this.user.hourlyRates.filter(
      x => x.id !== event.id
    );
  }


  toggleOnEditThreeDotsHourly(event, index) {
    this.editForm.get('hourlyRateID').patchValue(this.user.hourlyRates[index].id);
    setTimeout(() =>
    {
        this.initHourlyRate(index);
    },
    500);
    this.whichIndexCanYouEdit = event;
  }

  toggleOnSaveThreeDotsHourly(event = null, index = 0) {

    const userData = {
      id: this.user.id,
      hourlyRate: event.hourlyRate,
      hourlyRateDate: event.created,
      hourlyRateID: event.id
    };

    this.editUserRate(userData, false);
    this.whichIndexCanYouEdit = null;

    this.editForm.markAsUntouched();
  }


  public isNewAttachmentDialogOpen: boolean = false;

    toggleNewAttachment(from_button = false) {
        ///this.isNewAttachmentDialogOpen = !this.isNewAttachmentDialogOpen;

        if(from_button) {
            this.active_education = null;
        }

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = "app-full-bleed-dialog";
        dialogConfig.data = { type: 'user', active_education: this.active_education, 'limited': 4 };
        const refSelector = this.dialog.open(NewFileDialogComponent, dialogConfig);

        refSelector.afterClosed().subscribe({
            next: (res) => {

                if (res) {
                    this.images = res.files.map((item: IFile) => {
                        return {
                            name: item.Name,
                            file: item.file,
                            comment: res.description,
                            id: null,
                            album: -1,
                            description: res.description,
                        };
                    });
                    this.pdf_documents = res.pdf_documents.map((item: IFile) => {
                        return {
                            name: item.Name,
                            file: item.file,
                            comment: res.description,
                            id: null,
                            album: -1,
                            description: res.description,
                        };
                    });
                    this.files = {
                        images: this.images,
                        pdfs: this.pdf_documents,
                        description: res.description,
                        date: res.date,
                        user_id: this.user.id,
                        education_id: this.updatedEducationId
                    };

                    if(this.files.images.length > 0 || this.files.pdfs.length > 0) {
                        this.addNewFiles();
                    }

                    if(res.removed_files.length > 0) {
                        this.removeEducationDocumentsCall(res.removed_files);
                    }
                }
            },
        });
    }

    removeEducationDocumentsCall(removed_documents) {
        this.spinner = true;
        this.userService
          .removeEducationDocuments(removed_documents)
          .subscribe((res: any) => {
            if (res.status) {
                this.spinner = false;
                this.toastr.success(
                    this.translate.instant("Successfully deleted documents."),
                    this.translate.instant("Success")
                );
            }
        });
    }

    async addNewFiles() {

        if (this.files.images.length === 0 && this.files.pdfs.length === 0) {
          this.toastr.error(
            this.translate.instant("Please choose file."),
            this.translate.instant("Error")
          );
          return;
        }

        const files = {
          images: this.images,
          pdfs: this.pdf_documents,

        };

        this.spinner = true;
        this.showEducation = false;
        this.fsService.mergeFilesAndAlbums(files).then((response) => {

            const description = this.files.description;
            const date = this.files.date;
            this.files = {
                images: [],
                pdfs: [],
                description: description,
                date: date,
                user_id: this.user.id,
                education_id: this.updatedEducationId
            };

            if (response) {
                this.files = {
                    images: response.images,
                    pdfs: response.pdfs,
                    description: description,
                    date: date,
                    user_id: this.user.id,
                    education_id: this.updatedEducationId
                };

                this.attachmentService.addNewFilesForEducation(this.files).subscribe((res: any) => {
                    this.showEducation = true;
                    this.spinner = false;
                });
            }
        });
    }

  updateUserPermissionStatus(user_role, type, event, parent_index, children_index_1, status = false, isParent = false) {

    if(!this.userDetails.create_users_Manageusers) {
        return;
    }

    let checked = status;
    if(event) {
      checked = event.target.checked;
    }

    // if(!isParent && user_role.name == 'project' && user_role.sub_name == 'Global' &&
    // (this.supplier.read || this.supplier.write)){
    //  checked = !checked;
    // }

    this.rulesOfPermission(user_role, type, checked);
    user_role.children.forEach(element =>{
      this.rulesOfPermission(element, type, checked);
    });

    if(user_role.parent > 0 && children_index_1 != null) {
      this.user_roles[parent_index].children[children_index_1].update = true;
      this.user_roles[parent_index].children[children_index_1].manual = 1;
      this.rulesOfPermissionParent(this.user_roles[parent_index].children[children_index_1], type);
    }

    if(user_role.parent > 0 && parent_index != null) {
      this.user_roles[parent_index].update = true;
      this.user_roles[parent_index].manual = 1;
      this.rulesOfPermissionParent(this.user_roles[parent_index], type);
    }

    this.setCheckboxClass(user_role);
    this.checkingDisabledPermision();

    if(this.supplier.read || this.supplierInProject.read){
      this.projectRole.read = true;
      this.holdCheckedRead = true;
    } else {
      this.holdCheckedRead = false;
    }

    if(this.supplier.write || this.supplierInProject.write){
      this.projectRole.write = true;
      this.holdCheckedWrite = true;
    } else {
      this.holdCheckedWrite = false;
    }
    this.formIsDirtyOnPermit = true;
  }

   public externaAta;public internaAta;public externaU; public internaU;
   public order; public weeklyReport; public timesheets; public paymentPlan;
   public supplier; public notice;
   public timeRegNotice; public ataKsNotice; public reportNotice; public devNotice;
   public orderNotice; public paymentNotice; public supplierInProject; public projectRole;

checkingDisabledPermision(){

  this.user_roles.forEach(role => {
    this.findRolesForDisable(role);
    this.findRolesForDisableInNotice(role);
    if(role.children){
      role.children.forEach(child => {
        this.findRolesForDisable(child);
        this.findRolesForDisableInNotice(child);
        if(child.children){
          child.children.forEach(grandchild => {
            this.findRolesForDisable(grandchild);
            this.findRolesForDisableInNotice(grandchild);
          })
        }
      })
    }
  })
  if(this.externaAta) {
    this.disablePermissionNotice(this.externaAta.read, this.externaAta.write, this.internaAta.read,this.internaAta.write,'1', this.ataKsNotice);
  }
  if(this.externaU) {
    this.disablePermissionNotice(this.externaU.read, this.externaU.write, this.internaU.read,this.internaU.write,'2', this.devNotice);
  }
  if(this.order) {
    this.disablePermissionNotice(this.order.read, this.order.write, false, false, '3', this.orderNotice);
  }
  if(this.weeklyReport) {
    this.disablePermissionNotice(this.weeklyReport.read, this.weeklyReport.write,false, false,'4', this.reportNotice);
  }
  if(this.timesheets) {
    this.disablePermissionNotice(this.timesheets.read, this.timesheets.write, false, false,'5', this.timeRegNotice);
  }
  if(this.paymentPlan) {
    this.disablePermissionNotice(this.paymentPlan.read, this.paymentPlan.write, false, false,'6', this.paymentNotice);
  }
  if(this.supplier) {
    this.disableSuppliers(this.supplier.read,this.supplier.write, this.supplierInProject);
  }
}

disablePermissionNotice(read, write, read2 = false, write2 = false, num, role){
  if(read == false && write == false && read2 == false && write2== false){
    this.choseDisableRole(num,true);
    this.uncheckPermissionInNotice(role);
 }
   else  this.choseDisableRole(num,false);
}

disableSuppliers(read, write, role){
  if(read) {
    this.suppliersReadDisabled=true;
    this.checkPermissionSupplier(role,'read');
    }
       else
       this.suppliersReadDisabled=false;
  if(write) {
    this.suppliersWriteDisabled=true;
    this.checkPermissionSupplier(role,'write');
     } else
       this.suppliersWriteDisabled=false;
}

choseDisableRole(num, status){
  if(num == '1')  this.ataKsDisabled = status; else
  if(num == '2')  this.deviationDisabled = status; else
  if(num == '3')  this.orderDisabled = status; else
  if(num == '4')  this.weeklyReportDisabled = status; else
  if(num == '5')  this.timesheetsDisabled = status; else
  if(num == '6')  this.paymentPlanDisabled = status;
}

uncheckPermissionInNotice(role:any){
  let count = 0;

  this.notice?.children.forEach(child=>{
    if(child.eligibility == role.eligibility){
      child.read = false;
      child.write = false;
    }
    if(!child.read) count++;
    if(count == this.notice.children.length){
      this.notice.write = false;
      this.notice.read = false;
    }
  })
}

 checkPermissionSupplier(role:any,type){
  this.projectRole?.children.forEach(child=>{
    if(child.eligibility == role.eligibility && type == 'write'){
      child.read = true;
      child.write = true;
    }
    if(child.eligibility == role.eligibility && type == 'read'){
      child.read = true;
    }
  })
}


  rulesOfPermissionParent(user_role, type) {
    let parent_check = false;
    user_role.children.forEach(element =>{
      if(element.checked) {
        parent_check = true;
      }
    });

    user_role.checked = parent_check;

    if(type == 'read') {
      user_role.read = user_role.checked;

      if(!user_role.checked) {
        user_role.write = false;
      }
    }else {
      user_role.write = user_role.checked;
      if(user_role.checked) {
        user_role.read = true;
      }
    }

    user_role.children.forEach(element =>{
      if(element.read) {
        user_role.read = true;
      }
    });
    let count=0;
    user_role.children.forEach(element =>{
      if(element.write){
        count+=1;
      }
    });
    if(count>0){
      user_role.write=true;
    }else{
      user_role.write=false;
    }
  }

  rulesOfPermission(user_role, type, checked) {
    user_role.checked = checked;
    user_role.update = true;
    user_role.manual = 1;

    if(type == 'read') {
      user_role.read = user_role.checked;

      if(!user_role.checked) {
        user_role.write = false;
      }
    }else {
      user_role.write = user_role.checked;
      if(user_role.checked) {
        user_role.read = true;
      }
    }

    user_role.children.forEach(element =>{
      this.rulesOfPermission(element, type, checked);
    });
  }

  updatePermission() {
    let data = {
      'user_data': this.user_roles,
      'user_id': this.user.id,
      'role_id': this.userRoleSelected,
      'defaultMoments': this.chosenDefaultMoments,
      'manuallyAddedMoments': this.manuallyAddedMoments,
      'manuallyRemovedMoments': this.manuallyRemovedMoments,
    }

    this.spinner = true;
    this.userService.updateUserPermissionsByUserId(data).then((res) => {
      this.professions = res;
      this.editForm.get("role").patchValue(this.userRoleSelected);
      this.user.role = this.userRoleSelected;
      this.spinner = false;
      let status = this.user['role_exist'];
      if(!status) {
        window.location.reload();
      }
    });

     this.formIsDirtyOnPermit = false;
   // this.ngOnInit();
  }

  setValueForPermissions(value, type_of_loop, parent_index, children_index_1, children_index_2, event) {

    if(!this.userDetails.create_users_Manageusers) {
        return;
    }

    let index = -1;
    if( type_of_loop == 'parent') {
      index = this.user_roles.findIndex((permission) => permission.id == value.id);
      this.user_roles[parent_index].manual = 1;
      this.user_roles[parent_index].update = 1;
    }
    if( type_of_loop == 'children1') {
      index = this.user_roles[parent_index].children.findIndex((permission) => permission.id == value.id);
      this.user_roles[parent_index].manual = 1;
      this.user_roles[parent_index].update = 1;
      this.user_roles[parent_index].children[children_index_1].manual = 1;
      this.user_roles[parent_index].children[children_index_1].update = 1;
    }
    if( type_of_loop == 'children2') {
      index = this.user_roles[parent_index].children[children_index_1].children.findIndex((permission) => permission.id == value.id);
      this.user_roles[parent_index].manual = 1;
      this.user_roles[parent_index].update = 1;
      this.user_roles[parent_index].children[children_index_1].manual = 1;
      this.user_roles[parent_index].children[children_index_1].update = 1;
    }

    let type='';
    let status = event.target.checked;

  if(value.name == 'project' && value.sub_name == 'Global' && (this.supplier.read || this.supplier.write)){
    status = !status;
  }

    // if(status&&value.write){
    //   type='read';
    // }else
    if(status){
      type='write';
    }else{
      type='read';
    }

    if(index > -1){
      if(type_of_loop == 'children2'){
        this.updateUserPermissionStatus(value, type, event, parent_index, children_index_1, status,true);
      } else if(type_of_loop == 'children1'){
        this.updateUserPermissionStatus(value, type, event, parent_index, null, status,true);
      } else {
        this.updateUserPermissionStatus(value, type, null, parent_index, null, status,true);
      }
    }
  }


  toggleChildrenArticles(user_role) {
    user_role.visible = !user_role.visible;
  }

  setCheckboxClass(user_role) {
    let class_name = '';
    if(user_role.children.length > 0) {
      let write = 0;
      let read = 0;
      let number_of_rows = 0;
      user_role.children.forEach((ch, index) => {
        number_of_rows += 1;
        if(ch.read) {
          read += 1;
        }
        if(ch.write) {
          write += 1;
        }
        if(ch.children.length > 0) {
          ch.children.forEach((ch2, index) => {
            number_of_rows += 1;
            if(ch2.read) {
              read += 1;
            }
            if(ch2.write) {
              write += 1;
            }
          });
        }
      });
      if(read == 0 && write == 0) {
      //  user_role.read = false; user_role.write = false;///ahmed
        class_name = 'default-icon';
      }else if(write > 0 && write == number_of_rows) {
        class_name = 'write-icon';
      }else {
        class_name = 'show-icon';
      }
    }else {
      if(user_role.read && !user_role.write) {
        class_name = 'show-icon';
      }else if(user_role.read > 0 && user_role.write) {
        class_name = 'write-icon';
      }else {
        class_name = 'default-icon';
      }
    }
    return class_name;
  }

    async setPredefinedRole(value) {

        if(value.role_id) {
            this.user.role = value.role_id;
            this.userRoleSelected = value.role_id;
            let user_roles:any = await this.userService.getRolePermissionsWithPredefinedSelected(value.role_id, null);
            this.user_roles = user_roles.data;
        }
    }

    toggleEducationEdit(event) {
        this.updatedEducationId = event.ued_id;
        this.active_education = event;
        this.toggleNewAttachment();
    }

   rowClicked(i){
    this.clickedRow = i;
    if(this.clickedRow != this.whichIndexCanYouEdit){
      this.whichIndexCanYouEdit=-1;
    }
    this.arrThreeDot=[];
    }

  isOpen(event){
    this.arrThreeDot.push(event);
    if(this.arrThreeDot.every(x => x == false)){
      this.toggleClicked = false;
    }else{
      this.toggleClicked = true;
    }
  }

   @HostListener('document:click' , ['$event'])
     ondocumentClick(event: MouseEvent){
       this.arrThreeDot = [];
     }


checkDisableNotice(role){
  if(role.name == 'notice' && role.sub_name == 'ata_and_KS' && this.ataKsDisabled){
    return true;
  } if(role.name == 'notice' && role.sub_name == 'time_registration' && this.timesheetsDisabled){
    return true;
  } if(role.name == 'notice' && role.sub_name == 'weekly_report' && this.weeklyReportDisabled){
    return true;
  } if(role.name == 'notice' && role.sub_name == 'deviation' && this.deviationDisabled){
    return true;
  } if(role.name == 'notice' && role.sub_name == 'order' && this.orderDisabled){
    return true;
  } if(role.name == 'notice' && role.sub_name == 'payment_plan' && this.paymentPlanDisabled){
    return true;
  } return false;
}

    checkDisableSuppliersRead(role){
      if(role.name == 'project' && role.sub_name == 'Supplier Invoices' && this.suppliersReadDisabled){
        return true;
      }
    }

    checkDisableSuppliersWrite(role){
        if(role.name == 'project' && role.sub_name == 'Supplier Invoices' && this.suppliersWriteDisabled){
          return true;
        }
    }

    disableInput1(user_children_role_1) {

        let status = null;

        if(!this.userDetails.create_users_Manageusers || this.checkDisableNotice(user_children_role_1) || this.checkDisableSuppliersRead(user_children_role_1) ) {
            status = true;
        }

        return status;
    }


    disableInput2(user_children_role_1) {

      let status = null;

      if(!this.userDetails.create_users_Manageusers || this.checkDisableNotice(user_children_role_1) || this.checkDisableSuppliersWrite(user_children_role_1) ) {
          status = true;
      }

      return status;
  }

    parentNoticeDisable(role){
        let status = null;

        if(!this.userDetails.create_users_Manageusers) {
            status = true;
        }


        if(this.timesheetsDisabled && this.paymentPlanDisabled && this.weeklyReportDisabled && this.orderDisabled &&
            this.deviationDisabled && this.ataKsDisabled && role.name == 'notice' && role.sub_name == 'Global'){
          status = true;;
        }

        return status;
    }

  holdCheckedReadInput(role){
    if(role.name == 'project' && role.sub_name == 'Global' && this.holdCheckedRead){
       return true;
    }  return false;
  }

  holdCheckedWriteInput(role){
    if(role.name == 'project' && role.sub_name == 'Global' && this.holdCheckedWrite){
      return true;
   }  return false;

  }

    printPermit(user_role) {
        if(user_role.name == 'notice' && user_role.sub_name != 'Global') {
            return user_role.eligibility2;
        }else {
            return user_role.eligibility;
        }
    }

 visibleAndNameCorrector(roles){
  roles.forEach(child => {
    if(child.checked==true){
      child.visible=true;
      child.children.forEach(gchild =>{
        if(gchild.checked==true){
          gchild.visible=true;
        }else{gchild.visible=false;}
      });
    } else{ child.visible=false;}
  });

    roles.forEach(parent =>{
        parent.eligibility =(parent.eligibility.charAt(0).toUpperCase() + parent.eligibility.slice(1)).split("_").join(" ");
        if(parent.eligibility2 != undefined){
          parent.eligibility2 =(parent.eligibility2.charAt(0).toUpperCase() + parent.eligibility2.slice(1)).split("_").join(" ");
        }
        parent.children.forEach(child=>{
            let newWord;
            let words = child.eligibility.split(/[!\s_]+/);
            let correctWord=[];
            words.forEach(x => {
                newWord = x.charAt(0).toUpperCase() + x.slice(1);
                correctWord.push(newWord)
            })
            child.eligibility = correctWord.join(' ');
        })
    })
 }


 onConfirmationModal(index): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "185px";
    dialogConfig.position = {top:'400px', left:'500px'};
    dialogConfig.panelClass = "confirm-modal";
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if(response.result){

          this.selectedTab = index;
          this.formIsDirty = false;
          this.formIsDirtyOnPermit=false;
          this.sendDialogIsOpen = false;
          this.editForm.markAsUntouched();

        }
     });
  });
}

canDeactivate(index){
  if(this.selectedTab == '0' ){
    this.formIsDirty = this.formUserComponent.checkIsFormDirty();
  }
  if(this.selectedTab == '2'){
    this.formIsDirty = this.formIsDirtyOnPermit;
  }

   if(this.selectedTab == '3' &&
     (this.editForm.get('hourlyRate').touched ||
     this.editForm.get('hourlyRateDate').touched) ){

             this.formIsDirty = true;
  }

  if(this.selectedTab == '4'){
    this.formIsDirty = this.sendDialogIsOpen;
  }

  if(this.selectedTab == '5'){
    this.formIsDirty = false;
  }

    if(this.formIsDirty) {
      this.onConfirmationModal(index);
     }else{
      this.selectedTab = index;
      this.whichIndexCanYouEdit = null;
    }
}


   isSendDialogOpen(event){
      this.sendDialogIsOpen = event;
   }


   findRolesForDisable(role){
      if(role.name == 'project' && role.sub_name == 'Order') this.order = role;
      if(role.name == 'project' && role.sub_name == 'External ata') this.externaAta = role;
      if(role.name == 'project' && role.sub_name == 'Internal ata') this.internaAta = role;
      if(role.name == 'project' && role.sub_name == 'External deviation')  this.externaU = role;
      if(role.name == 'project' && role.sub_name == 'Internal deviation') this.internaU = role;
      if(role.name == 'project' && role.sub_name == 'Weekly Report') this.weeklyReport = role;
      if(role.name == 'timesheets' && role.sub_name == 'Global') this.timesheets = role;
      if(role.name == 'project' && role.sub_name == 'Payment plan') this.paymentPlan = role;
      if(role.name == 'register' && role.sub_name == 'suppliers') this.supplier = role;
      if(role.name == 'project' && role.sub_name == 'Supplier Invoices') this.supplierInProject = role;
      if(role.name == 'project' && role.sub_name == 'Global') this.projectRole = role;
   }

   findRolesForDisableInNotice(role){
    if(role.name == 'notice' && role.sub_name == 'Global') this.notice = role;
    if(role.name == 'notice' && role.sub_name == 'time_registration') this.timeRegNotice = role;
    if(role.name == 'notice' && role.sub_name == 'ata_and_KS') this.ataKsNotice = role;
    if(role.name == 'notice' && role.sub_name == 'weekly_report') this.reportNotice = role;
    if(role.name == 'notice' && role.sub_name == 'deviation')  this.devNotice = role;
    if(role.name == 'notice' && role.sub_name == 'order') this.orderNotice = role;
    if(role.name == 'notice' && role.sub_name == 'payment_plan') this.paymentNotice= role;
   }

    numberOfSelectedMoments() {

      let checked_moments = this.chosenDefaultMoments.filter((moment)=> {
          return Number(moment.parent) > 0
      });
      this.number_of_checked =  checked_moments.length;
   }

   initializeChoosenMoments() {

        let filtered_array = [];
        this.chosenDefaultMoments.forEach((choosen_moment) => {

            let record =  this.defaultMoments.find(
              (activity) => activity.id === choosen_moment.id
            );
            if(record) {
                filtered_array.push(record);
            }
        });

        this.chosenDefaultMoments = filtered_array;
        this.numberOfSelectedMoments();
   }
}