import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/core/services/app.service";
import { UsersService } from "src/app/core/services/users.service";
import { TranslateService } from "@ngx-translate/core";
//import { get, type } from "jquery";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
})
export class UsersComponent implements OnInit {

  public users: any[];
  public allUsers = [];
  public allUsersCopy = [];
  public userDetails: any;
  public allTypes: string[] = [];
  public allRoles: string[] = [];
  public allStatus: string[] = [];
  public currentAddRoute: string;
  public previousRoute: string;
  public page = 1;
  public numberOfRowsArray = [];
  public showPaginate: boolean = true;
  public spinner: boolean = false;
  public p: number = 1;
  public buttonToggle = false;
  public buttonToggle1 = false;
  public buttonToggle2 = false;
  public type;
  public statusObjectUsers: any = {
    "Active": false,
    "Inactive": false,
    'Locked': false,
    "Incoming": false
  };

  public statusUsers: any = [
    "Active",
    "Inactive",
    'Locked',
    "Incoming"
  ];

  public typeObjectUsers: any = {
    "Own Personal": false,
    "Inhyrd personal": false,
    "Subcontractor": false,
    "Konslult": false
  };

  public roleObjectUsers: any = {
    "Arbetsledare": false,
    "Ledande montör": false,
    "Montör": false,
    "Diverse": false
  };

  order: string = 'firstname';
  reverse: boolean = false;
  sortedCollection: any[];
  public container_height = "calc(100vh - 131px - 0px)";
  public from_edit:boolean = false;

  constructor(private route: ActivatedRoute, private appService: AppService, private userService: UsersService,
    private translate: TranslateService) {
   }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
        this.from_edit = params.get("from_edit") ? JSON.parse(params.get("from_edit")) : false;
    });
    if(!this.from_edit) {
        sessionStorage.removeItem("filterUsersByRoles");
        sessionStorage.removeItem("filterUsersByTypes");
        sessionStorage.removeItem("filterUsersByStatus");
        sessionStorage.removeItem("filterUsersBySearch");
    }
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.currentAddRoute = '/users/new';
    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton = true && this.userDetails.create_users_Global;

    this.previousRoute = '/home';
    this.appService.setBackRoute(this.previousRoute);

    this.users = this.route.snapshot.data['users'];
    this.userService.getUsers(0).subscribe(users => {
      this.allUsers = users;
      this.allUsersCopy = users;
      this.users = users;
      this.refreshSearch();
    });
  }

    refreshSearch() {

        let filterUsersBySearch = JSON.parse(sessionStorage.getItem("filterUsersBySearch"));
        if(filterUsersBySearch && filterUsersBySearch.length > 0) {
            let search = document.getElementById('searchInput') as HTMLInputElement;
            search.value = filterUsersBySearch;
            this.onChange(search);
        }
    }

    onChange(search) {
        this.allUsersCopy = [...this.users];
        sessionStorage.setItem("filterUsersBySearch", JSON.stringify(search.value));
        this.allUsers = this.allUsersCopy.filter(user => ['firstname', 'lastname', 'fullname', 'mobile', 'email', 'role'].some(property => user[property].toLowerCase().includes(search.value.toLowerCase())));
        this. finalSelectedUsers();
    }

    get nextPage() {
        return this.page + 1;
    }

    get previousPage() {
        return this.page - 1;
    }

    getUsers(newPage = null) {
        this.userService.getUsers(newPage).subscribe(users => {
        this.users = users;
        if (newPage != null) {
            this.page = newPage;
        }
        this.spinner = false;
        });
    }


  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;

    if (!this.reverse) {
      if(this.order == "employeeNumber")
        this.allUsers = this.allUsers.sort((a, b) => {return a["employeeNumber"] - b["employeeNumber"]});
      else {
        this.allUsers = this.allUsers.sort((a, b) => {
          try {
            if (this.translate.instant(a[value]) < this.translate.instant(b[value])) return 1;
            if (this.translate.instant(a[value]) > this.translate.instant(b[value])) return -1;
          }
          catch {
            if (a[value] < b[value]) return 1;
            if (a[value] > b[value]) return -1;
          }
          return 0;
        });
      }
    }
    else {
      if(this.order == "employeeNumber")
          this.allUsers = this.allUsers.sort((a, b) => { return b["employeeNumber"] - a["employeeNumber"] });
      else{
        this.allUsers = this.allUsers.sort((a, b) => {
          try {
            if (this.translate.instant(a[value]) < this.translate.instant(b[value])) return -1;
            if (this.translate.instant(a[value]) > this.translate.instant(b[value])) return 1;
          }
          catch {
            if (a[value] < b[value]) return -1;
            if (a[value] > b[value]) return 1;
          }
          return 0;
        });
      }
    }
  }

  buttonNameSummary(event, type) {
    event.stopPropagation();

    if (type) {
      this.buttonToggle = true;

    } else {
      this.buttonToggle = !this.buttonToggle;
    }
  }

  buttonNameSummary1(event, type) {
    event.stopPropagation();

    if (type) {
      this.buttonToggle1 = true;
    } else {
      this.buttonToggle1 = !this.buttonToggle1;
    }
  }

  buttonNameSummary2(event, type) {
    event.stopPropagation();

    if (type) {
      this.buttonToggle2 = true;
    } else {
      this.buttonToggle2 = !this.buttonToggle2;
    }
  }


  checkIfContactSelected(contact) {
    if (contact) {
      return true;
    } else {
      return false
    };
  }



  changeStatusObj(status){
    this.statusObjectUsers[status] = !this.statusObjectUsers[status];
  }

  changeTypeObj(type){
    this.typeObjectUsers[type] = !this.typeObjectUsers[type];
  }

  changeRoleObj(role){
    this.roleObjectUsers[role] = !this.roleObjectUsers[role];
  }


  filterByStatus(status) {
    this.statusObjectUsers[status] = !this.statusObjectUsers[status];
    this.allUsers = this.allUsersCopy.filter((users) => this.statusObjectUsers[users.status]);

}

  filterByType(type){
    this.typeObjectUsers[type] = !this.typeObjectUsers[type];
    this.allUsers = this.allUsersCopy.filter((users) => this.typeObjectUsers[users.type]);
  }

  filterByRole(role){
    this.roleObjectUsers[role] = !this.roleObjectUsers[role];
    this.allUsers = this.allUsersCopy.filter((users) => this.roleObjectUsers[users.role]);
  }

  getAllTypes() {
    for (let user of this.allUsersCopy) {
      if(!this.allTypes.includes(user.type))  this.allTypes.push(user.type);
    }
    return this.allTypes;
  }

  getAllRoles() {
    for (let user of this.allUsersCopy) {
      if(!this.allRoles.includes(user.role)) this.allRoles.push(user.role);
    }
    return this.allRoles;
  }

  getAllStatus() {
    for (let user of this.allUsersCopy) {
      if(!this.allStatus.includes(user.status)) this.allStatus.push(user.status);
    }
    // return this.allStatus;
    return this.statusUsers;
  }


  public selectedOptionsForTypes: string[] = [];
  public selectedOptionsForRoles: string[] = [];
  public selectedOptionsForStatus: string[] = [];

  filterUsersByTypes(event) {
    this.selectedOptionsForTypes = event;
    sessionStorage.setItem("filterUsersByTypes", JSON.stringify(this.selectedOptionsForTypes));
  }

  filterUsersByRoles(event) {
    this.selectedOptionsForRoles = event;
    sessionStorage.setItem("filterUsersByRoles", JSON.stringify(this.selectedOptionsForRoles));
  }

  filterUsersByStatus(event) {
    this.selectedOptionsForStatus = event;
    sessionStorage.setItem("filterUsersByStatus", JSON.stringify(this.selectedOptionsForStatus));
  }

  finalSelectedUsers() {

    if (this.selectedOptionsForTypes.length <= 0
        && this.selectedOptionsForRoles.length <= 0
        && this.selectedOptionsForStatus.length <= 0
    ) {
        this.allUsersCopy = this.allUsers;
        return;
    }

    this.allUsersCopy = [];
    const finalUserHave = {
      type: this.selectedOptionsForTypes.length > 0,
      roles: this.selectedOptionsForRoles.length > 0,
      status: this.selectedOptionsForStatus.length > 0
    };

    for(let user of this.allUsers) {
      if (finalUserHave.type) {
        if (!this.selectedOptionsForTypes.includes(user.type)) continue;
      }

      if (finalUserHave.roles) {
        if (!this.selectedOptionsForRoles.includes(user.role)) continue;
      }

      if (finalUserHave.status) {
        if (!this.selectedOptionsForStatus.includes(user.status)) continue;
      }

      this.allUsersCopy.push(user);
    }
  }

    clearSearchText(event) {
        event.preventDefault();
        (document.getElementById('searchInput') as HTMLInputElement).value = '';
    }


    get existString() {
        if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }
}
