import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

declare var $: any;

@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.css"],
})
export class OfferComponent implements OnInit {
  public date: any;
  public searchText = "0";
  public language = "en";
  public week = "Week";
  public offers: any[];
  public selectedDate: any = 0;
  public selectedStatus: any = 2;
  public selectResponsiblePerson: any = 0;
  public originalOffers: any[];
  private statusFilters = [];
  public totalSum: number;

  @ViewChild("searchInput") searchInput: ElementRef;
  @ViewChild("selectedDate") selectedDateInput: ElementRef;
  @ViewChild("selectStatus") selectStatusInput: ElementRef;
  @ViewChild("selectResponsiblePerson")
  selectResponsiblePersonInput: ElementRef;
  public statusText = [
    0,
    this.translate.instant("Draft"),
    this.translate.instant("Sent"),
    this.translate.instant("Ongoing"),
    this.translate.instant("Not accepted"),
    this.translate.instant("Marked"),
  ];
  userDetails: any;
  public currentClass = "title-new";
  public showPagination = true;

  public searchQuery = "";

  opacity = 0;
  display = "none";
  translateY = "150px";
  addedRows: any;
  background = "rgb(128 128 128 / 50%)";

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.language = sessionStorage.getItem("lang");
    if (this.language == "en") this.week = "Week";
    else this.week = "Vecka";
  }

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.offers = this.route.snapshot.data["offers"].data;
    this.originalOffers = this.route.snapshot.data["offers"].data;
  }

  filterOffers(statusFilters,calculateSum=true) {
    const index = statusFilters.findIndex((filter) => filter == 0);
    if (index != -1) statusFilters[index] = null;

    this.offers = this.originalOffers.filter((offer) => {
      return statusFilters.includes(
        offer.status && offer.status != 4 && offer.status != 6 && offer.status != 7 ? offer.status.toString() : null
      );
    });
    this.statusFilters = statusFilters;
    if (calculateSum) this.setTotalSum();
  }

  textFilter() {
    const query = this.searchQuery.toLowerCase();
    this.filterOffers(this.statusFilters,false);
    this.offers = this.offers.filter((offer) => {
      return offer.name.toLowerCase().includes(query);
    });
    this.setTotalSum();
  }

  setTotalSum() {
    this.totalSum=this.offers.reduce(
      (accumulator, currentOffer) =>
        (accumulator += currentOffer.article_total),
      0
    );

  }

  // onSelected(selectedDate, selectedStatus, selectResponsiblePerson) {
  //   this.selectedStatus = selectedStatus.value;
  //   this.selectResponsiblePerson = selectResponsiblePerson.value;

  //   if (selectedDate.value == "") {
  //     this.selectedDate = 0;
  //   } else {
  //     this.selectedDate = selectedDate.value;
  //   }
  //   this.offersService
  //     .searchByStatus(
  //       this.selectedDate,
  //       this.selectedStatus,
  //       this.selectResponsiblePerson,
  //       this.searchText
  //     )
  //     .subscribe((response) => {
  //       this.offers = response["data"];
  //     });
  // }

  getAll() {
    this.selectedDateInput.nativeElement.value = "";
    this.selectStatusInput.nativeElement.selectedIndex = 0;
    this.selectResponsiblePersonInput.nativeElement.selectedIndex = 0;
    this.selectedDate = 0;
    this.searchText = "0";
    this.selectedStatus = 0;
    this.selectResponsiblePerson = 0;
    this.offers = JSON.parse(JSON.stringify(this.originalOffers));

  }

  enter() {
    this.currentClass = "title-new-hover";
  }

  leave() {
    this.currentClass = "title-new";
  }

  clearSearchText() {
    return (this.searchQuery = "");
  }

  public createOfferModal = false;
  openCreateOfferModal() {
    this.createOfferModal = !this.createOfferModal;
  }

  onAddComment() {}
}
