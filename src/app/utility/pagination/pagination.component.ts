import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
})
export class PaginationComponent implements OnInit {
  @Input("itemsPerPage")
  itemsPerPage: number = 20;

  @Input("maxPage")
  maxPage: number = 10;

  @Input("selectedPage")
  selectedPage: number = 1;

  @Input("itemsSize") set setItemsSize(value: number) {
    this.maxPage = Math.ceil(value / this.itemsPerPage);
  }

  @Output() pageChange = new EventEmitter<number>();

  pages: any[] = [];

  numOfPagesShown: number = 10;

  ngOnInit(): void {
    this.generatePageArray(1);
  }

  public generatePageArray(selectedPage, clicked = null) {
    this.selectedPage =
      selectedPage > this.maxPage
        ? this.maxPage
        : selectedPage < 1
        ? 1
        : selectedPage;

    const selPageMinus = this.selectedPage - this.numOfPagesShown - 1;
    const selPagePlus = this.selectedPage + this.numOfPagesShown - 1;
    const limit =
      selPagePlus > this.maxPage
        ? this.maxPage
        : this.maxPage >= 10
        ? selPagePlus > 10
          ? selPagePlus
          : 10
        : selPagePlus;
    const start =
      this.numOfPagesShown - limit >= 0
        ? selPageMinus < 1
          ? 1
          : selPageMinus > this.maxPage - 9
          ? this.maxPage - 9
          : selPageMinus
        : Math.abs(this.numOfPagesShown - limit);

    const newPages = [];

    for (let i = start; i <= limit; i++) {
      newPages.push(i);
    }

    this.pages = newPages;

    if (clicked) {
      this.pageChange.emit(this.selectedPage);
    }
  }
}
