import { Directive, NgZone, OnInit, Host, Self } from "@angular/core";
import { MatDatepicker } from "@angular/material/datepicker";

import { fromEvent, Subject, takeUntil } from "rxjs";

@Directive({
  selector: "[jpDatepickerSwitch]",
})
export class JpDatepickerSwitchDirective implements OnInit {
  _isShortScreen = false;

  private _monitorScreenHeight$ = fromEvent(window, "resize");
  private _destroy$ = new Subject<void>();

  constructor(
    private _zone: NgZone,
    @Self() @Host() private datepicker: MatDatepicker<Date>
  ) {
    this._zone.runOutsideAngular(() => {
      this._monitorScreenHeight$
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._switchDatepickerMode();
        });
    });
  }

  ngOnInit() {
    setTimeout(() => (this.datepicker.touchUi = this._isThereFreeSpace()));
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _isThereFreeSpace(): boolean {
    const windowHeight = this._getWindowHeight();
    const inputElementRect = (this.datepicker as any)._datepickerInput
      .getPopupConnectionElementRef()
      .nativeElement.getBoundingClientRect();
    const inputHeight = inputElementRect.height;
    const freeTopSpace = inputElementRect.top;
    const freeBottomSpace = windowHeight - (freeTopSpace + inputHeight);
    return freeTopSpace < 354 && freeBottomSpace < 354;
  }

  private _switchDatepickerMode() {
    const isThereFreeSpace = this._isThereFreeSpace();
    if (isThereFreeSpace !== this.datepicker.touchUi) {
      this._zone.run(() => (this.datepicker.touchUi = isThereFreeSpace));
    }
  }

  private _getWindowHeight() {
    return window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight ||
          document.body.clientHeight ||
          0;
  }
}
