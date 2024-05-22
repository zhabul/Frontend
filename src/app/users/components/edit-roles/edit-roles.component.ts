import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "src/app/core/services/users.service";
import { AppService } from "src/app/core/services/app.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Location } from "@angular/common";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { EditRolesService } from "../../services/edit-roles.service";


@Component({
  selector: "app-edit-roles",
  templateUrl: "./edit-roles.component.html",
  styleUrls: ["./edit-roles.component.css"],
})
export class EditRolesComponent implements OnInit {
  public userDetails: any;
  public user: any;
  public userOpts = {};
  public selectedRole: any;
  public roleName:any;

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

  public spinner:boolean=false;

  public currentAddRoute;
  public previousRoute;
  public filterMenu: any;
  Object = Object;
  public currentUserOpts = {
    name: "",
    type: "",
  };
  public language;
  allRoles: any = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UsersService,
    public appService: AppService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private location: Location,
    private editRolesService: EditRolesService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
    this.selectedRole = this.route.snapshot.data.roles.find((role) => {
      if (role.id === this.route.snapshot.params.id) {
        return role;
      }
    });

    this.previousRoute = "back";
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;
    this.userOpts = this.route.snapshot.data["predefinedRoles"];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.getRoles();
    this.roleName = this.selectedRole.roles;
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

  updateUserRole(name, type, subname, status, createElement = null) {

    if (createElement) {
        this.userService.patchPredefinedRole({
            role_id: this.selectedRole.id,
            name,
            type: "create",
            subname,
            status,
        });
      createElement.disabled = !status;
      this.userOpts[name].create[
        this.getRoleIndex(this.userOpts[name].create, "Global")
      ].status = status;
    }

        this.userService.patchPredefinedRole({
            role_id: this.selectedRole.id,
            name,
            type,
            subname,
            status,
        });
  }

  deletePredefinedRole() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.userService.deletePredefinedRole(this.selectedRole.id);
          this.goBack();
        }
      });
  }

  getRoleIndex(roles, subname) {
    return roles.findIndex((role) => role.subname == subname);
  }

  async showGlobalChanged(role, status) {
    role.status = status;
  }

  toggleFilterMenu(name, type, action = "save", e = null): void {
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

  subRoleClicked(name, type, subname, status, i, e) {
    const roles = JSON.parse(JSON.stringify(this.userOpts[name][type]));
    if (name === "project") {
      roles.pop();
    }

    if (roles.filter((role) => role.status).length === 0 && !status) {
      this.toastr.info("You need to leave at least one sub role checked") + ".";
      this.userOpts[name][type][i].status = true;
      e.target.checked = true;
    } else {
        this.userService.patchPredefinedRole({
            role_id: this.selectedRole.id,
            name,
            type,
            subname,
            status,
        });
    }
  }

  goBack() {
    this.location.back();
    this.editRolesService.setSelectedTab('2');
  }

  toggleChildrenArticles(user_role) {
    user_role.visible = !user_role.visible;
 }

 updateUserPermissionStatus(user_role, type, event, parent_index, children_index_1,isParent = false) {
   let checked = event.target.checked;

   if(type =='parent'){
    if(checked){
       type='write';
    }else{
       type ='read';
    }
  }

    this.rulesOfPermission(user_role, type, checked);

    if(user_role.parent > 0 && children_index_1 != null) {
    this.allRoles[parent_index].children[children_index_1].update = true;
    this.rulesOfPermissionParent(this.allRoles[parent_index].children[children_index_1], type);
  }
    if(user_role.parent > 0 && parent_index != null) {
    this.allRoles[parent_index].update = true;
    this.rulesOfPermissionParent(this.allRoles[parent_index], type);
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
}

public externaAta;public internaAta;public externaU; public internaU;
public order; public weeklyReport; public timesheets; public paymentPlan;
public supplier; public notice;
public timeRegNotice; public ataKsNotice; public reportNotice; public devNotice;
public orderNotice; public paymentNotice; public supplierInProject; public projectRole;


checkingDisabledPermision(){

  this.allRoles.forEach(role => {
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

  this.disablePermissionNotice(this.externaAta.read, this.externaAta.write, this.internaAta.read,this.internaAta.write,'1', this.ataKsNotice);
  this.disablePermissionNotice(this.externaU.read, this.externaU.write, this.internaU.read,this.internaU.write,'2', this.devNotice);
  this.disablePermissionNotice(this.order.read, this.order.write, false, false, '3', this.orderNotice);
  this.disablePermissionNotice(this.weeklyReport.read, this.weeklyReport.write,false, false,'4', this.reportNotice);
  this.disablePermissionNotice(this.timesheets.read, this.timesheets.write, false, false,'5', this.timeRegNotice);
  this.disablePermissionNotice(this.paymentPlan.read, this.paymentPlan.write, false, false,'6', this.paymentNotice);
  this.disableSuppliers(this.supplier.read,this.supplier.write, this.supplierInProject);

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
  if(num == '6')  this.paymentPlanDisabled = status
}

uncheckPermissionInNotice(role:any){
  let count = 0;
  this.notice?.children.forEach(child=>{
    if(child.eligibility == role.eligibility){
      child.read = false;
      child.write = false;
    }
    if(!child.read) count++;
    if(count == this.notice?.children.length){
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

rulesOfPermission(user_role, type, checked) {
  user_role.checked = checked;
  user_role.update = true;
  if(type == 'read') {
    user_role.read = user_role.checked;
    if(!user_role.checked) {
      user_role.write = false;
    }
  } else {
    user_role.write = user_role.checked;
    if(user_role.checked) {
      user_role.read = true;
    }
  }
  user_role.children.forEach(element =>{
    this.rulesOfPermission(element, type, checked);
  });
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
   }  else {
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

getRoles() {
    this.editRolesService.getRoles(this.route.snapshot.params.id).subscribe({
      next: (response) => {
         if (response.status) {
          response.data.forEach(child => {
            if(child.checked==true){
              child.visible=true;
              child.children.forEach(gchild =>{
                if(gchild.checked==true){
                  gchild.visible=true;
                }
              });
            }
          });

           response.data.forEach(parent =>{
           parent.eligibility =(parent.eligibility.charAt(0).toUpperCase() + parent.eligibility.slice(1)).split("_").join(" ");
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
            this.allRoles = response.data;
            this.checkingDisabledPermision();
        }
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
}

updatePermission() {
        let data = {
          'permissions': this.allRoles,
          'role_id': this.route.snapshot.params.id
        }
        this.spinner=true;
        this.editRolesService.updateRolePermissionsByRoleId(data).then((res) => {
          this.spinner=false;
          this.ngOnInit();
          console.log(res)
        });
  /*this.editRolesService.updateRolePermissionsByRoleId(data).then((res) => {
    // uraditi ako treba nesto kada se dobije response
  });  */
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

 parentNoticeDisable(role){
  if(this.timesheetsDisabled && this.paymentPlanDisabled && this.weeklyReportDisabled && this.orderDisabled &&
    this.deviationDisabled && this.ataKsDisabled && role.name == 'notice' && role.sub_name == 'Global'){
      return true;
    } return false;
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

  printPermit(user_role) {
      if(user_role.name == 'notice' && user_role.sub_name != 'Global') {
          return user_role.eligibility2;
      }else {
          return user_role.eligibility;
      }
  }
}
