import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SettingsService } from "src/app/core/services/settings.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { RoleElligibilityService } from "./role-elligibility.service";
import { Subscription } from "rxjs";
import { UsersService } from "src/app/core/services/users.service";
import { RoleEligibilityListComponent } from "./role-eligibility-list/role-eligibility-list.component";

@Component({
  selector: "app-role-elligibility",
  templateUrl: "./role-elligibility.component.html",
  styleUrls: ["./role-elligibility.component.css"],
})
export class RoleElligibilityComponent implements OnInit, OnDestroy {
  @ViewChild(RoleEligibilityListComponent) child:RoleEligibilityListComponent;
  
  dropdownOpen = false;
  roleDropdown = {
    labelText: "Role",
    selectedOption: "Administrator",
    options: [],
  };
  public roles = [];
  public eligibilities = [];
  public role:any;
  subscriptionTab: Subscription;
  rang = 1;
  public spinner: boolean = false;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));


  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private roleEligibilityService: RoleElligibilityService,
    private userService: UsersService,
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.subscribeToPermitChange();
    this.subscribeToSettingsTabChange();
  }

  getRoles() {
    this.settingsService.getDefaultRoles().subscribe({
      next: (response) => {
        if (response.status) {
          this.roles = response.data;
          response.data.forEach((role, index) => {
            this.roleDropdown.options.push(role.roles);
          });
          const index = this.roles.findIndex((role) => role.roles === 'Administrator');
          this.role = this.roles[index].id
          this.getUserPermission(this.roles[index].id);
        }
        this.spinner = false;
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  getUserPermission(role_id = 0) {
    this.spinner = true;
    this.settingsService.getUserPermission(role_id).subscribe({
      next: async(response) => {
        if (response.status) {
          this.eligibilities = response.data;
          await this.setInitialPermitContidions();
        }
        this.spinner = false;
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  subscribeToPermitChange() {
    this.roleEligibilityService.permitChange.subscribe({
      next: (res) => {
        this.spinner = true;
        this.searchAndEditEligibility(res);
      },
    });
  }

  subscribeToSettingsTabChange() {
    this.subscriptionTab = this.settingsService.getActiveTab().subscribe((result) => {

      if(result == 3) {

        const index = this.roles.findIndex((role) => role.roles === this.roleDropdown.selectedOption);
        let data = {
          'permissions': this.eligibilities,
          'role_id': this.roles[index].id
        }
        this.spinner = true;
        this.userService.updateUserPermissions(data).then((res) => {
          this.spinner = false;
        });
      }
    });
  }

  changeRoleOption(event) {
    const index = this.roles.findIndex((role) => role.roles === event);
    this.role =this.roles[index].id;
    this.getUserPermission(this.roles[index].id);
  }

  ngOnDestroy() {
    this.roleEligibilityService.permitChange.unsubscribe();
  }

  searchAndEditEligibility(eligibility) {
    const foundEligibility = this.findEligitility(eligibility.id);
    foundEligibility.checked = eligibility.checked;
    foundEligibility.read = eligibility.read;
    foundEligibility.write = eligibility.write;
    foundEligibility.permit = eligibility.permit;
    this.changeCheckedCheckbox(foundEligibility);
    this.updateParentPermissions(foundEligibility);
    this.eligibilities = JSON.parse(JSON.stringify(this.eligibilities));
    this.spinner = false;
  }

  findEligitility(id, searchArray = this.eligibilities) {
    const index = searchArray.findIndex((eligibility) => eligibility.id == id);
    if (index != -1) return searchArray[index];
    for (let i = 0; i < searchArray.length; i++) {
      const child = this.findEligitility(id, searchArray[i].children);
      if (child) return child;
    }
    return false;
  }

  changeCheckedCheckbox(eligibility) {
    if (eligibility.permit == "check") {
      const status = eligibility.checked;
      eligibility.read = status;
      eligibility.write = status;
      this.changeChildsCheckStatus(eligibility, status);
    } else if (eligibility.permit == "read") {
      const status = eligibility.read;
      eligibility.write = !status ? false : eligibility.write;
      eligibility.checked =
        eligibility.read && eligibility.write ? true : false;
      this.changeChildsReadStatus(eligibility, status);
    } else if (eligibility.permit == "write") {
      const status = eligibility.write;
      eligibility.read = status ? true : eligibility.read;
      eligibility.checked = status;
      this.changeChildWriteStatus(eligibility, status);
    }
  }
  changeChildsCheckStatus(eligibility, status) {
    eligibility.children.forEach((child) => {
      child.checked = status;
      child.read = status;
      child.write = status;
      this.changeChildsCheckStatus(child, status);
    });
  }

  changeChildsReadStatus(eligibility, status) {
    eligibility.children.forEach((child) => {
      child.read = status;
      child.write = !status ? false : child.write;
      child.checked = child.read && child.write ? true : false;
      if (child.children.length > 0) {
        this.changeChildsReadStatus(child, status);
      }
    });
  }

  changeChildWriteStatus(eligibility, status) {
    eligibility.children.forEach((child) => {
      child.write = status;
      child.read = status ? true : child.read;
      child.checked = status;
      if (child.children.length > 0) {
        this.changeChildWriteStatus(child, status);
      }
    });
  }

  updateParentPermissions(childEligibility) {
    if (childEligibility.parent == 0) return;
    const parent = this.findEligitility(childEligibility.parent);
    const permitCount = {
      write: 0,
      read: 0,
      checked: 0,
    };

    parent.children.forEach((child) => {
      permitCount.write = child.write
        ? permitCount.write + 1
        : permitCount.write;
      permitCount.read = child.read ? permitCount.read + 1 : permitCount.read;
      permitCount.checked = child.checked
        ? permitCount.checked + 1
        : permitCount.checked;
    });

    parent.read = permitCount.read > 0 ? true : false;
    parent.write = permitCount.write > 0 ? true : false;
    parent.checked =
      permitCount.checked == parent.children.length ? true : false;
    this.updateParentPermissions(parent);
  }

////////////////////////Data received from backend has to be modified to suit to the design///////////////

  async setInitialPermitContidions(eligibilityArray = this.eligibilities) {
    eligibilityArray.forEach((eligibility) => {
      if (eligibility.children.length > 0) {
        eligibility.checked = this.checkChildrenOnInitialCondition(
          eligibility.children
        );
      } else if (!(eligibility.read&&eligibility.read)){
        eligibility.checked = false;
      }
      this.setInitialPermitContidions(eligibility.children);
    });
  }

  checkChildrenOnInitialCondition(childrens) {
    let checkedCount = 0;
    childrens.forEach((child) => {
      checkedCount = child.checked ? checkedCount++ : checkedCount;
    });
    if (checkedCount == childrens.length) {
      return true;
    }
    return false;
  }

//call in parent
savePermission(){
 this.child.updatePermission();
}

}
