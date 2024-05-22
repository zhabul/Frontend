import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesModalServiceService {
  private weeklyReportChecked = new BehaviorSubject([]);

  public weeklyReportChecked$ = this.weeklyReportChecked.asObservable();

  constructor() { }


  setWeeklyReportChecked(checkedIndex) {
    this.weeklyReportChecked.next(checkedIndex);
  }


}
