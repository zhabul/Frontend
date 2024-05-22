import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "src/app/core/services/app.service";
import { UsersService } from "src/app/core/services/users.service";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.css"],
})
export class ContactsComponent implements OnInit {
  public users: any[];
  public allUsers = [];
  public allUsersCopy = [];
  public userDetails: any;

  public currentAddRoute: string;
  public previousRoute: string;
  public showPaginate: boolean = false;
  public page: number = 1;
  private searchFilter: string = "";

  order: string = "firstname";
  reverse: boolean = false;
  sortedCollection: any[];

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private userService: UsersService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.currentAddRoute = "/users/new";
    this.appService.setAddRoute(this.currentAddRoute);
    this.appService.setShowAddButton =
      true && this.userDetails.create_users_Global;

    this.previousRoute = "/home";
    this.appService.setBackRoute(this.previousRoute);

    this.users = this.route.snapshot.data["users"];

    this.userService.getUsers(0).subscribe((users: any) => {
      this.allUsers = users;
      this.allUsersCopy = users;
      this.filterUsersBySearchAndPage();

      this.showPaginate = this.allUsersCopy.length > 20;
    });
  }

  onChange(search) {
    this.searchFilter = search.value;
    this.filterUsersBySearchAndPage();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;

    if (!this.reverse) {
      if (this.order == "employeeNumber")
        this.allUsers = this.allUsers.sort((a, b) => {
          return a["employeeNumber"] - b["employeeNumber"];
        });
      else {
        this.allUsers = this.allUsers.sort((a, b) => {
          try {
            if (
              this.translate.instant(a[value]) <
              this.translate.instant(b[value])
            )
              return 1;
            if (
              this.translate.instant(a[value]) >
              this.translate.instant(b[value])
            )
              return -1;
          } catch {
            if (a[value] < b[value]) return 1;
            if (a[value] > b[value]) return -1;
          }
          return 0;
        });
      }
    } else {
      if (this.order == "employeeNumber")
        this.allUsers = this.allUsers.sort((a, b) => {
          return b["employeeNumber"] - a["employeeNumber"];
        });
      else {
        this.allUsers = this.allUsers.sort((a, b) => {
          try {
            if (
              this.translate.instant(a[value]) <
              this.translate.instant(b[value])
            )
              return -1;
            if (
              this.translate.instant(a[value]) >
              this.translate.instant(b[value])
            )
              return 1;
          } catch {
            if (a[value] < b[value]) return -1;
            if (a[value] > b[value]) return 1;
          }
          return 0;
        });
      }
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.filterUsersBySearchAndPage();
  }

  filterUsersBySearchAndPage() {
    this.allUsers = this.allUsersCopy
      .filter((user) =>
        ["fullname", "mobile", "email", "role"].some((property) =>
          user[property].toLowerCase().includes(this.searchFilter.toLowerCase())
        )
      )
      .slice((this.page - 1) * 20, (this.page - 1) * 20 + 20);
  }
}
