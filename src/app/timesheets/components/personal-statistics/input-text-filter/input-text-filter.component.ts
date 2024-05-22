import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { 
  Subject,
  debounceTime,
  distinctUntilChanged
} from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: 'app-input-text-filter',
  templateUrl: './input-text-filter.component.html',
  styleUrls: ['./input-text-filter.component.css']
})
export class InputTextFilterComponent implements OnInit {

  @Input('width') width = 225;
  @Input('prefix') prefix = '';
  @Input('disableQueryParams') disableQueryParams = false;
  @Output('emitValue') emitValue:EventEmitter<string> = new EventEmitter();


  public baseQueryParam = 's';
  public searchValueUpdate = new Subject<string>();
  public searchValueSub;

  constructor(
            private translate: TranslateService,
            private route: ActivatedRoute,
            private router: Router) { }

  ngOnInit(): void {

    this.initSearchValueSub();
    this.translatePlaceholder();
    this.getQueryParams();
  }

  appendPrefix() {
    return `${this.prefix}_${this.baseQueryParam}`;
  }

  ngOnDestroy() {
    this.unsubFromSearchValue();
    this.unsubFromQueryParams();
  }

  initSearchValueSub() {
    this.searchValueSub = this.searchValueUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.emitSearchValue(value.toLowerCase());
        this.setQueryParams();
      });
  }

  /* query params */

  public queryParamsSub;
  getQueryParams() {
    this.queryParamsSub = this.route.queryParams.subscribe(this.queryParamsHandler.bind(this));
  }
  queryParamsHandler(params) {
    if (params[this.appendPrefix()]) {
      this.value = params[this.appendPrefix()];
    }
    this.emitSearchValue(this.value);
  }

  unsubFromQueryParams() {
    this.queryParamsSub.unsubscribe();
  }

  /* query params */

  emitSearchValue(value) {
    this.emitValue.emit(value)
  }

  unsubFromSearchValue() {
    this.searchValueSub.unsubscribe();
  }

  public placeholder = 'Search';
  public value = '';
  translatePlaceholder() {
    this.placeholder = this.translate.instant(this.placeholder);
  }

  setQueryParams() {
    if (this.disableQueryParams) return;
    const queryParams = { [this.appendPrefix()]: this.value };
    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
}