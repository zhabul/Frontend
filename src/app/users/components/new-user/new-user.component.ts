import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
//import { User } from "../../../core/models/user";
import { UsersService } from "../../../core/services/users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CompareValidator } from "../../../core/validator/password.validator";
import { ToastrService } from "ngx-toastr";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { NewUserStore } from "./new-user.service";
import { SpecialCharactherMustBeValidators } from "src/app/core/validator/special-characther-must-be.validator";

declare var $;

@Component({
  selector: "app-new-user",
  templateUrl: "./new-user.component.html",
  styleUrls: ["./new-user.component.css"],
})
export class NewUserComponent implements OnInit {
  @Output() updateCauseOfAnomaly = new EventEmitter();
  @ViewChild("myform", { static: true }) myform!: NgForm;
  public user:any;
  public incoming_sub;
  public createForm: FormGroup;
  public userDetails: any;
  public filterNotificationsMenu = false;

  public disabled = false;
  public chosenRole = 0;

  public hasOneRoleError = false;
  public filterMenu = false;
  public isItChecked = false;


 public showPasswordChange:any;
 public selectedTab:any=0;
 public user_roles:any;
 public userRoleSelected:any;
 public disableCustomSimpleDropdown: boolean = false;
 public timTaxMsgShown:boolean=false;
 
 public accMenuToggle = true;
 public relMenuToggle = true;
 public hourlyRates:any=[];
 
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

  public currentUserOpts = {
    name: "",
    type: "",
  };
  public userOpts: any = {};
  public previousRoute: string;
  public defaultMoments = [];
  public chosenDefaultMoments = [];
  public dropdownSettings;
  public endDateUnspecified = true;

  public changeRoleMoments = false;
  public spinner = false;

  Object = Object;

  public showOptionalInputs = false;

  public showNewUserRoleInput = false;

  public language = "en";
  public week = "Week";

  public userRoles = [];
  public manuallyAddedMoments = [];
  public userRolesMoments = {};
  public selected_role_id:number = 0;


  @ViewChild("newUserRoleName") newRoleInput: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UsersService,
    private toastr: ToastrService,
    private appService: AppService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private newUserStore: NewUserStore,
    private special_validator: SpecialCharactherMustBeValidators
  ) {
    this.language = sessionStorage.getItem("lang");
    this.week = this.translate.instant("Week");
  }

  openDatepicker() {
   // $("#endDateSelect").prop("disabled", !this.user.endDate);

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

    $("#startDateSelect")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          this.createForm.value.endDate &&
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.endDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.startDate;
          }, 0);
        } else {
          this.createForm.get("startDate").patchValue(ev.target.value);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.startDate;
      });

    $("#endDateSelect")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.startDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("End date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.endDate;
          }, 0);
        } else {
          this.createForm.get("endDate").patchValue(ev.target.value);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.endDate;
      });

    $("#hourlyRateDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.user.hourlyRates[0].created.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("End date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.hourlyRateDate;
          }, 0);
        } else {
          this.createForm.get("hourlyRateDate").patchValue(ev.target.value);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.hourlyRateDate;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.openDatepicker()
    }, 500);
  }

  notification: string = "1";

  ngOnInit() {
  
    this.defaultMoments = this.route.snapshot.data["default_moments"];
    const newUserInfo = this.newUserStore.getNewUserInfo();
    this.user = this.newUserStore.getNewUserInfo();

 

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

    this.userRoles = this.route.snapshot.data["roles"];
    this.selected_role_id = this.userRoles[0].id;

    this.previousRoute = "/users";
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.userService.getPredefinedRoles(this.selected_role_id).then((res) => {
      this.userOpts = res;
      if(this.userOpts.notification){
        this.userOpts.notifications.moment[0].status = true;
      }
     // this.userOpts.notifications.moment[0].status = true;
    });
  
    this.createForm = this.fb.group(
      {
        type: [this.user.type],
        language: [this.user.language, [Validators.required]],
        personalNumber: [
          this.user.personalNumber,
          [this.requiredIfValidator(() => this.createForm.get("status").value)],
        ],
        firstName: [newUserInfo.firstName, [Validators.required]],
        lastName: [this.user.lastName, [Validators.required]],
        startDate: [this.user.startDate, [Validators.required]],
        endDate: [this.user.endDate, []],
        employeeNumber: [
          this.user.employeeNumber,
          [this.requiredIfValidator(() => this.createForm.get("status").value)],
        ],
        bankNumber: [this.user.bankNumber, [Validators.maxLength(6)]],
        accountNumber: [this.user.accountNumber],
        role: [''],
        bic: [this.user.bic],
        iban: [this.user.iban],
        mobile: [this.user.mobileNumber, [Validators.required]],
        mobileNumber: [this.user.mobileNumber, [Validators.required]],
        email: [
          this.user.email,
          [ 
            this.requiredIfValidator(() => this.createForm.get("status").value),
            Validators.email,
          ],
        ],
        hourlyRate: [
          this.user.hourlyRate,
          [this.requiredIfValidator(() => this.createForm.get("status").value)],
        ],
        hourlyRateDate: [this.user.hourlyRateDate, [Validators.required]],
        password: [
          this.user.password,
          [
            this.requiredIfValidator(() => this.createForm.get("status").value),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/),
            Validators.minLength(6), 
            this.special_validator.nameValidator
          ], 
        ],
        confirmPassword: [
          this.user.confirmPassword,
          [this.requiredIfValidator(() => this.createForm.get("status").value)],
        ],
        status: [this.user.status],
        postalAddress1: [this.user.postalAddress1],
        postalAddress2: [this.user.postalAddress2],
        zipCode: [this.user.zipCode],
        city: [this.user.city],
        familyMember1: this.fb.group({
          name: [this.user.familyMember1.name],
          phone: [this.user.familyMember1.phone],
          note: [this.user.familyMember1.note],
        }),
        familyMember2: this.fb.group({
          name: [this.user.familyMember2.name],
          phone: [this.user.familyMember2.phone],
          note: [this.user.familyMember2.note],
        }),
      },
      {
        validator: [CompareValidator.passwordMatchValidator],
      }
    );

    this.incoming_sub = this.createForm
      .get("status")
      .valueChanges.subscribe((value) => {
        this.createForm.get("personalNumber").updateValueAndValidity();
        this.createForm.get("employeeNumber").updateValueAndValidity();
        this.createForm.get("password").updateValueAndValidity();
        this.createForm.get("confirmPassword").updateValueAndValidity();
        this.createForm.get("email").updateValueAndValidity();
        this.createForm.get("hourlyRate").updateValueAndValidity();
      });
  }

  ngAfterDestroy() {
    if (this.incoming_sub) {
      this.incoming_sub.unsubscribe();
    }
  }

  clearDataForIncomingUser(data) {
    data.accountNumber = "";
    data.bankNumber = "";
    data.bic = "";
    data.city = "";
    data.defaultMoments = [];
    data.email = "";
    data.employeeNumber = "";
    data.familyMemberName1 = "";
    data.familyMemberName2 = "";
    data.familyMemberNote1 = "";
    data.familyMemberNote2 = "";
    data.familyMemberPhone1 = "";
    data.familyMemberPhone2 = "";
    data.hourlyRate = 0;
    data.iban = "";
    data.manuallyAddedMoments = [];
    data.mobile = "";
    data.password = "randomPassword";
    data.personalNumber = "";
    data.postalAddress1 = "";
    data.postalAddress2 = "";
    data.zipCode = "";

    return data;
  }

  async createUser() {

    return;

    if (this.createForm.valid) {
      const data = this.createForm.value;
      let userData = {
        password: data.password,
        language: data.language,
        email: data.email,
        hourlyRate: data.hourlyRate,
        hourlyRateDate: data.hourlyRateDate,
        firstname: data.firstName,
        lastname: data.lastName,
        Notification: this.notification,
        startDate: data.startDate.split(" ")[0],
        endDate: data.endDate.split(" ")[0],
        role: this.chosenRole,
        type: data.type,
        status: data.status,
        personalNumber: data.personalNumber,
        employeeNumber: data.employeeNumber,
        bic: data.bic,
        iban: data.iban,
        bankNumber: data.bankNumber,
        accountNumber: data.accountNumber,
        mobile: data.mobileNumber,
        zipCode: data.zipCode,
        city: data.city,
        postalAddress1: data.postalAddress1,
        postalAddress2: data.postalAddress2,
        familyMemberName1: data.familyMember1.name,
        familyMemberPhone1: data.familyMember1.phone,
        familyMemberNote1: data.familyMember1.note,
        familyMemberName2: data.familyMember2.name,
        familyMemberPhone2: data.familyMember2.phone,
        familyMemberNote2: data.familyMember2.note,
        defaultMoments: this.chosenDefaultMoments,
        manuallyAddedMoments: this.manuallyAddedMoments,
      };

      if (this.createForm.get("status").value === "Incoming") {
        userData = this.clearDataForIncomingUser(userData);
      }

      this.disabled = true;

      const res = await this.userService.createUser(userData);

      this.disabled = false;

      if (res["status"]) {
        this.toastr.success(
          this.translate.instant("Successfully created user!"),
          this.translate.instant("Success")
        );
        const createdUserId = res["userId"];
        this.newUserStore.resetUserInfo();

        await this.userService.setUserNewOptions({
          userOpts: this.userOpts,
          userId: createdUserId,
        });

        this.router.navigate(["users/edit", createdUserId]);
      }

      if (!res["status"]) {
        if (res["data"]["code"] === -1) {
          this.createForm.controls["email"].markAsDirty();
          this.createForm.controls["email"].setErrors({
            exists: true,
          });
          this.toastr.error(
            this.translate.instant("Email already taken") + ".",
            this.translate.instant("Error")
          );
          return;
        }
        this.toastr.error(
          this.translate.instant("There was an error while creating user") +
            ".",
          this.translate.instant("Error")
        );
      }
    } else {
      setTimeout(() => {
        document.querySelector(".is-invalid").scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 1);
      return;
    }

  }


  toggleFilterMenu(name, type, action = "save", e = null): void {
    if (this.createForm.get("status").value !== "Incoming") {
      const roles = this.userOpts[name][type];
      if (roles[roles.length - 1].status) {
        if (action === "save") {
          this.filterMenu = !this.filterMenu;
          this.currentUserOpts = { name, type };
        } else {
          if (e) {
            if (e.target.id !== "looksLikeModal") {
              return;
            }
          }
          this.filterMenu = !this.filterMenu;
          this.currentUserOpts = { name, type };
        }
      }
    }
  }

  toggleNewUserRoleInput() {
    if (this.createForm.get("status").value !== "Incoming") {
      this.showNewUserRoleInput = !this.showNewUserRoleInput;
      this.cd.detectChanges();
      this.newRoleInput.nativeElement.focus();
    }
  }

  async newUserRolePermission(name) {
    if (name && name.trim() !== "") {
      const res: any = await this.userService.newPredefinedRole({
        name,
        opts: this.userOpts,
      });

      if (res["role_id"] == -1) {
        this.toastr.error(
          this.translate.instant("User role exists") + ".",
          this.translate.instant("Error")
        );
        return;
      }

      this.toastr.success(
        this.translate.instant("Successfully created user role."),
        this.translate.instant("Success")
      );
      this.router.navigate(["/users/edit/roles/" + res.role_id]);
    }
  }

  async subRoleClicked(name, type, subname, status, e) {
    const roles = JSON.parse(JSON.stringify(this.userOpts[name][type]));
    if (name === "project") {
      roles.pop();
    }

    if (roles.filter((role) => role.status).length === 1 && status) {
      this.toastr.info(
        this.translate.instant(
          "You need to leave at least one sub role checked"
        ) + ".",
        this.translate.instant("Info")
      );
      e.preventDefault();
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

  editUserRolePermissions(id) {
    if (this.createForm.get("status").value !== "Incoming") {
      this.router.navigate(["users/edit/roles/", id]);
      const data = this.createForm.value;
      this.newUserStore.setNewUserInfo(data);
    }
  }

  async userRoleChange(select) {

    if (this.createForm.get("status").value !== "Incoming") {
        this.chosenRole = parseInt(select.value, 10);
        this.userOpts = await this.userService.getPredefinedRoles(select.value);
        this.manuallyAddedMoments = [];
        this.setMomentsToRoleMoments();
    }
  }

  getRoleIndex(roles, subname) {
    return roles.findIndex((role) => role.subname == subname);
  }

  async showGlobalChanged(role, status) {
    role.status = status;
  }

  toggleOptionalInputs() {
    if (this.createForm.get("status").value !== "Incoming") {
      this.showOptionalInputs = !this.showOptionalInputs;
    }
  }

  endDateUnspecifiedChanged(e) {
    if (e.target.checked) {
      $("#endDateSelect").prop("disabled", true);
      this.createForm.get("endDate").patchValue("");
      this.endDateUnspecified = true;
    } else {
      $("#endDateSelect").prop("disabled", false);
      this.endDateUnspecified = false;
    }
  }

  onNotificationsCheck() {
    if (this.notification == "1") {
      this.notification = "0";
    } else {
      this.notification = "1";
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

  editRoleMoments() {
    if (this.createForm.get("status").value !== "Incoming") {
      this.changeRoleMoments = true;
    }
  }

  async setRoleMoments() {
    await this.userService.setRoleMoments(
      this.chosenRole,
      this.userRolesMoments[this.chosenRole]
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
        this.userRolesMoments[this.chosenRole].push(item.id);
        this.userRolesMoments[this.chosenRole].push(item.parent);
      } else {
        this.userRolesMoments[this.chosenRole].push(item.id);
        this.defaultMoments.forEach((m, index) => {
          if (item.id == m.parent) {
            dropdownchildren[index].getElementsByTagName("input")[0].checked =
              true;
            this.userRolesMoments[this.chosenRole].push(m.id);
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
        this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
          this.chosenRole
        ].filter((v) => v != item.id);
        this.defaultMoments.forEach((m, index) => {
          if (item.id == m.parent) {
            dropdownchildren[index].getElementsByTagName("input")[0].checked =
              true;
            this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
              this.chosenRole
            ].filter((v) => v != m.id);
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
            this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
              this.chosenRole
            ].filter((v) => v != item.id);
            tempArr.push(m.id);
            if (
              this.userRolesMoments[this.chosenRole].includes(m.id) == false
            ) {
              compareArr.push(m.id);
            }
          }
        });
        if (tempArr.length == compareArr.length) {
          this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
            this.chosenRole
          ].filter((v) => v != item.parent);
        }
      }

      this.manuallyAddedMoments = this.manuallyAddedMoments.filter(
        (m) => m != item.id
      );

      this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
        this.chosenRole
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

    this.chosenDefaultMoments = JSON.parse(
      JSON.stringify(this.chosenDefaultMoments)
    );
    this.setRoleMoments();
  }

  setMomentsToRoleMoments() {

    this.chosenDefaultMoments = this.userRolesMoments[this.chosenRole].map(
      (m) => {
        if (this.defaultMoments.find((dm) => dm.id == m).parent !== "0") {
          this.userRolesMoments[this.chosenRole].push(
            this.defaultMoments.find((dm) => dm.id == m).parent
          );
        }
        return {
          id: m,
          Name: this.defaultMoments.find((dm) => dm.id == m).Name,
        };
      }
    );

    this.userRolesMoments[this.chosenRole] = this.userRolesMoments[
      this.chosenRole
    ].filter(function (elem, index, self) {
      return index === self.indexOf(elem);
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

    if (selected_moment.parent == 0) {
      let parent_moment_id = selected_moment.id;

      this.chosenDefaultMoments.push(moment);
      this.manuallyAddedMoments.push(moment.id);

      this.defaultMoments.forEach((m, index) => {
        if (m.parent == parent_moment_id) {
          let obj = {
            Name: m.Name,
            id: m.id,
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
      };

      this.chosenDefaultMoments.push(obj);
      this.manuallyAddedMoments.push(moment.id);
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

    this.refreshSortData();
  }

  refreshSortData() {
    this.manuallyAddedMoments = [...new Set(this.manuallyAddedMoments)];
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
          res["id"] ==
            selected_moment.parent /*&& res['id'] != selected_moment.id*/
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
  }

  onMomentSelectAll() {
    this.manuallyAddedMoments = this.defaultMoments.map((dm) => dm.id);
  }

  onMomentDeSelectAll() {
    this.manuallyAddedMoments = [];
  }

  displayError(input: string) {
    const control = this.createForm.get(input);
    return (
      (this.myform.submitted && control.invalid) ||
      (control.dirty && control.invalid)
    );
  }

    displayErrorObj(input: string, type: string) {
        const control = this.createForm.get(input);
        let err = false;

        if (control.errors) {
          if (type === "required") {
            err = control.errors.required;
          }

          if (type === "pattern") {
            err = control.errors.pattern;
          }

          if (type === "email") {
            err = control.errors.email;
          }
        }

        return err;
    }

    isAtLeastOneNotisChecked() {
        const notis = this.userOpts.notifications;
        let flag = false;

        if (notis) {
            const notisKeys = Object.keys(notis);

            for (let i = 0; i < notisKeys.length; i++) {
                const key = notisKeys[i];

                if (notis[key][0].status) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    toggleFilterNotifications(e) {
        if (
            e.target.dataset.origin === "filterNotifications" &&
            this.createForm.get("status").value !== "Incoming"
        ) {
            this.filterNotificationsMenu = !this.filterNotificationsMenu;
        }
    }

    onFilterNotificationsCheck(event, type) {
        this.userOpts.notifications[type][0].status = event.target.checked;
    }

    userStatusChanged(event) {
        const status = event.target.value;

        if (status === "Incoming") {
            this.jQueryDisableInput(true);
            return;
        }

        this.jQueryDisableInput(false);
    }

    requiredIfValidator(predicate) {
        return (formControl) => {
            if (!formControl.parent) {
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

    getDefaultType() {
        const defaultValue: string = this.createForm.get('type').value;
        const defaultUserType: {id: string, status: string} = {id: defaultValue, status: defaultValue}
        return defaultUserType;
    }

selectType(selectedType, formControlName) {
    this.createForm.markAsDirty();
    this.createForm.get(formControlName).patchValue(selectedType.status);
}

    toggleRole(role) {

        this.chosenRole=role;

      // this.userService.getRolePermissionsWithPredefinedSelected(role.id, this.user.id).then((res:any)=> {
      //   if(res.status) {
      //     this.user_roles = res['data'];
      //   }
      // });
      // this.userRoleSelected = role.id;
    }

    changeSelectedTab(index) {
        this.selectedTab = index;
        this.ngAfterViewInit();
    }

    getDefaultUserStatus() {
        const defaultValue: string = this.createForm.get('status').value;
        const defaultUserStatus: {id: string, status: string} =
            {id: defaultValue, status: defaultValue}
        return defaultUserStatus;
    }

    selectUserStatus(selectedStatus, formControlName) {
        this.createForm.markAsDirty();
        this.createForm.get(formControlName).patchValue(selectedStatus.status);

        if(selectedStatus.status == 'Incoming') {
            this.createForm.disable();
            this.disableCustomSimpleDropdown = true;
            this.createForm.get('firstName').enable();
            this.createForm.get('lastName').enable();
            this.createForm.get('startDate').enable();
            this.createForm.get('endDate').enable();
        } else {
            this.createForm.enable();
            this.disableCustomSimpleDropdown = false;
        }
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

    async saveUser(userData) {

        this.spinner = true;
        if (userData.status === "Incoming") {
            userData = this.clearDataForIncomingUser(userData);
        }

        userData.password = "Profesionalno18";
        userData.Notification = this.notification;

        this.disabled = true;
        const res = await this.userService.createUser(userData);
        this.disabled = false;

        if (res["status"]) {
            this.toastr.success(
                this.translate.instant("Successfully created user!"),
                this.translate.instant("Success")
            );
            const createdUserId = res["userId"];
            this.newUserStore.resetUserInfo();

            await this.userService.setUserNewOptions({
                user_data: this.user_roles,
                user_id: createdUserId,
                role_id: this.user.role
            });
            this.spinner = false;
            this.router.navigate(["users/edit", createdUserId], { queryParams: { 'active-tab': 3 } });
        }else {
          if(res.data.msg == 'Type already exist') {
            this.toastr.error(
                this.translate.instant("Type already exist"),
                this.translate.instant("Error")
            );
            this.spinner = false;            
          }
        }
    }

    async setPredefinedRole(event) {
        this.user.role = event.role_id;
        this.userRoleSelected = event.role_id;
        this.user_roles = event.user_roles;
    }
}
