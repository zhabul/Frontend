import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-offer-filters",
  templateUrl: "./offer-filters.component.html",
  styleUrls: ["./offer-filters.component.css"],
})
export class OfferFiltersComponent implements OnInit {
  enabled = true;
  userDetails: any;
  loading = true;
  @Output() newFilters: EventEmitter<string[]> = new EventEmitter();

  statusFilters = [
    {
      title: "All",
      checked: false,
      color: "#FB721F",
      statusNumber: "-1",
    },
    {
      title: "Draft",
      checked: false,
      color: "#F7F3D1",
      statusNumber: "0",
    },
    {
      title: "Sent",
      checked: false,
      color: "#B3F6FF",
      statusNumber: "1",
    },
    {
      title: "Accepted",
      checked: false,
      color: "#CAF2A2",
      statusNumber: "2",
    },
    {
      title: "Declined",
      checked: false,
      color: "#fd4444",
      statusNumber: "3",
    },
    {
      title: "Marked",
      checked: false,
      color: "#B8B8B8",
      statusNumber: "5",
    },
  ];

  numberStatusArray = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.userService
      .getUserPermissionTabs()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.setFiltersInitialData(res["data"]["Offer"]);
          this.loading = false;
        },
        error: (err) => {},
      });
  }

  setFiltersInitialData(filters) {
    if (filters) {
      const filtersArray = Object.keys(filters);
      this.statusFilters.forEach((filter) => {
        if (filtersArray.includes(filter.statusNumber)) filter.checked = true;
      });
    }
    this.setStatusArray();
  }

  onStatusChange(statusFilter) {
    statusFilter.checked = !statusFilter.checked;
    this.updateFilters(statusFilter);
    if (statusFilter.statusNumber == "-1") {
      this.statusFilters.forEach((filter) => {
        filter.checked = statusFilter.checked;
        this.updateFilters(filter);
      });
    }
    this.setStatusArray();
  }

  setStatusArray() {
    this.numberStatusArray = [];
    this.statusFilters.forEach((filter) => {
      if (filter.checked && filter.statusNumber != "-1") {
        this.numberStatusArray.push(filter.statusNumber);
      }
    });

    const oldAllStatus = this.statusFilters[0].checked;
    this.statusFilters[0].checked =
      this.numberStatusArray.length == this.statusFilters.length - 1
        ? true
        : false;
    if (oldAllStatus != this.statusFilters[0].checked) {
      this.updateFilters(this.statusFilters[0].checked);
    }
    this.newFilters.emit(this.numberStatusArray);
  }

  updateFilters(statusFilter) {
    const updateObject = {
      user_id: this.userDetails.user_id,
      tab_name: statusFilter.statusNumber,
      type: "Offer",
    };

    if (statusFilter.checked) {
      this.userService.createUserPermissionTabs(updateObject);
      return;
    }
    this.userService.deleteUserPermissionTabs(updateObject);
  }
}
