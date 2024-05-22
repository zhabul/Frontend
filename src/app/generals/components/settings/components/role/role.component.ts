import { Component, OnInit, ViewChild } from "@angular/core";
import { RoleListComponent } from "./role-list/role-list.component";
import { SettingsService } from "src/app/core/services/settings.service";
import { Role } from "../../interfaces/role";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "src/app/core/services/users.service";

@Component({
  selector: "app-role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.css"],
})
export class RoleComponent implements OnInit {
  statusDdownOpen = false;
  workTypeDdownOpen = false;
  roleDdownOpen = false;
  workingMomentDDownOpen = false;
  loading = true;
  public defaultMoments;
  @ViewChild(RoleListComponent) listComponent: RoleListComponent;

  roles: Role[];

  statusDropdown = {
    labelText: "Status",
    selectedOption: "",
    options: ["Inactive", "Active"]
  };

  // workTypeDropdown = {
  //   labelText: "Work type",
  //   selectedOption: "",
  //   options: ["Tip 1", "Tip 2", "Tip 3"],
  // };

  roleDropdown = {
    labelText: "Work role",
    selectedOption: "",
    options: [],
  };

  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public number_of_selected_moments:number;

  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private userService: UsersService,
  ) {}

  public selectedRole:any;
  public userRolesMoments;
  public momentsArr:any = [];
  public workRoles:any = [];
  public workRolesCopy:any = [];
  public selectedMomentIds:any=[];
  public RoleNotSelected:boolean = false;
  public momentsTouched:boolean = false;

  public momentsForDropdown:any = {
    labelText: "Moments",
    selectedOptions: [],
    options:this.momentsArr
  };

  ngOnInit(): void {
    this.defaultMoments = this.route.snapshot.data["default_moments"];
    this.defaultMoments.forEach(moment=>{
        this.momentsArr.push({ name:moment.Name, id:moment.id, selected:false, parent:moment.parent});
    })

    this.userService.getRolesMoments().subscribe((res) => {
        this.userRolesMoments = res;
    });

    this.settingsService.getDefaultRoles().subscribe({
      next: (response) => {
        if (response.status) {
          this.roles = response.data.map((role: Role) => {
            return { ...role, changed: false };
          });
          this.roles.forEach((role) => {
            this.roleDropdown.options.push(role.roles);
            this.workRoles.push(role);
            this.workRolesCopy.push(role);
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  numberOfSelectedMoments() {
    let moments = this.momentsForDropdown.find((res) => res.parent == 0);
    return moments.length
  }

  onSave() {
    this.userService.setRoleMoments(
            this.selectedRole,
            this.selectedMomentIds
         ).then(res=>{
            if(res){ this.toastr.success(
                this.translate.instant("You successfully updated the role."),
                this.translate.instant("Success")
            );
                this.momentsTouched = false;
            }
        });
  }

  openNewRoleModal() {
    this.listComponent.openNewRoleModal();
  }

  changeStatusOption(event: any) {
     if(event.id == '1') this.workRolesCopy = this.workRoles.filter(role=>{return role.active==1;})
     else
     if(event.id == '0') this.workRolesCopy = this.workRoles.filter(role=>{return role.active==0;})

     let roles = this.workRolesCopy;
     this.workRolesCopy = [];
     roles.forEach(role=>{this.workRolesCopy.push(role.roles)})
     this.roleDropdown.options = this.workRolesCopy;
     this.roleDropdown.selectedOption = "";
     this.selectedRole = undefined;
  }

  // changeWorkTypeOption(event: string) {
  //   console.log(event);
  // }

  changeRoleOption(event: string) {
    this.workRoles.forEach(role=>{
      if(role.roles == event) this.selectedRole = role.id;
    })

    let momentsForChosenRole = this.userRolesMoments[this.selectedRole];
    this.selectedMomentIds = momentsForChosenRole;
    this.setMomentsForRole(momentsForChosenRole);
    this.momentsForDropdown.selectedOptions = this.selectedMomentIds;
  }

  selectMoment(event) {
     if(event.selected){
        this.selectedMomentIds.push(event.id);
        this.addChildsAndParents(event);
     }else{
        this.selectedMomentIds = this.selectedMomentIds.filter((id)=>{return id!=event.id;})
        this.deleteChildsAndParents(event);
     }
      this.checkOptions();
      this.momentsForDropdown.selectedOptions = this.selectedMomentIds;
      this.momentsTouched = true;
  }

  setMomentsForRole(momentsForChosenRole){
    this.momentsArr.forEach(moment=>{
      if(momentsForChosenRole.includes(moment.id)){
         moment.selected = true;
        } else {
         moment.selected = false;
      }
    })
  }

  addChildsAndParents(event){
     this.defaultMoments.forEach(moment=>{
       if(moment.parent == event.id) this.selectedMomentIds.push(moment.id);
       //
       if(event.parent == moment.id && !this.selectedMomentIds.includes(moment.id)) this.selectedMomentIds.push(moment.id);
     })
  }

  deleteChildsAndParents(event){
    let indexForDelete=[];
    this.defaultMoments.forEach(moment=>{
      if(moment.parent == event.id) indexForDelete.push(moment.id);
      //
      if(moment.id == event.parent){
      if(this.isAnyChildChecked(moment.id)){
        indexForDelete.push(moment.id);
       }
      }
    })
    this.selectedMomentIds = this.selectedMomentIds.filter((el)=>!indexForDelete.includes(el));
 }

  checkOptions(){
    this.momentsArr.forEach(moment=>{
      if(this.selectedMomentIds.includes(moment.id)) moment.selected = true;
      else moment.selected = false;
    })
   }

   isAnyChildChecked(id){
    let checked = [];
    this.momentsArr.forEach(moment=>{
        if(moment.parent==id && moment.selected) checked.push(moment.id);
    })
        if(checked.length==0){
           return true;
        }
    return false;
   }

   isRoleSelected(){
    if(this.selectedRole==undefined){
      return true;
    }
    return false;
   }

   saveDisabled(){
    if(!this.isRoleSelected()&&this.momentsTouched){
      return false;
    }
    return true;
   }

}
