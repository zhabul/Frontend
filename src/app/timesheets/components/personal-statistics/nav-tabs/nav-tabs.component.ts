import { 
  Component, 
  OnInit, 
  OnDestroy,
  Input, 
  Output, 
  EventEmitter 
} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.css']
})
export class NavTabsComponent implements OnInit, OnDestroy {

  @Input('tabs') tabs;
  @Output('emitValue') emitValue:EventEmitter<number> = new EventEmitter();
 
  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.getQueryParams();
  }

  ngOnDestroy() {
    this.unsubFromQueryParams();
  }


  public selectedTab = 0;
  setSelectedTab(index) {
    this.selectedTab = index;
    this.setQueryParams();
    this.emitValue.emit(this.selectedTab);
  }

  public queryParamsSub;
  getQueryParams() {
    this.queryParamsSub = this.route.queryParams.subscribe(this.queryParamsHandler.bind(this));
  }
  queryParamsHandler(params) {
    const st = Number(params.st);

    if (st && !Number.isNaN(st) && st < this.tabs.length) {
      this.setSelectedTab(st);
    }
  }

  unsubFromQueryParams() {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }

  setQueryParams() {
    const queryParams = { st: this.selectedTab };
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}