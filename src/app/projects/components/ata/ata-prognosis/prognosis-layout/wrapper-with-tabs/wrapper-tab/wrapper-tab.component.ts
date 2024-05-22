import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-wrapper-tab",
  templateUrl: "./wrapper-tab.component.html",
  styleUrls: ["./wrapper-tab.component.css"]
})
export class WrapperTabComponent implements OnInit, OnDestroy {
  @Input("isRight") isRight: boolean = false;
  @Input("tabContent") tabContent: string = "";
  @Input("index") index: number = 0;

  isActive: boolean = false;
  paramSub: Subscription | undefined;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getQueryParams();
  }

  getQueryParams() {
    this.paramSub = this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (!params) return;
        if (this.isRight && params.rightTabIndex == this.index)
          this.isActive = true;
        else if (!this.isRight && params.leftTabIndex == this.index)
          this.isActive = true;
        else this.isActive = false;
      },
    });
  }

  setQueryParams() {
    let queryParams: Params = this.isRight
      ? { rightTabIndex: this.index }
      : { leftTabIndex: this.index };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }
}
