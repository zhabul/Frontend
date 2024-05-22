import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";

@Component({
  selector: "app-lock-icons",
  templateUrl: "./lock-icons.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./lock-icons.component.css"],
})
export class LockIconsComponent implements OnInit {
  @Input("location") location;
  @Input("day") set setDay(value) {
    if (this.day !== value) {
      this.day = value;
      if (this.size) {
        //this.showLockCondition();
      }
    }
  }
  @Input("user") set setUser(value) {
    if (this.user !== value) {
      this.user = value;
      if (this.day) {
        this.showLockCondition();
      }
    }
  }
  @Input("size") size;

  public user;
  public day;
  public computedConditions = {
    showLockCondition: false,
  };

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.showLockCondition();
  }

  showLockCondition() {
    const date = this.day.date;
    const absenceExists = !Array.isArray(this.user.absences);
    if (absenceExists && this.user.absences[date] && this.user.absences[date][0]) {
      this.handleAbsenceLock(date);
      this.ref.detectChanges();
      return;
    }
    this.handleMomentsLock(date);
  }

  handleAbsenceLock(date) {
    const showCircle =
      Math.abs(this.user.absences[date + "-info"].displacement) > 0;
    if (showCircle && this.location === "calendar") {
      this.computedConditions.showLockCondition =
        this.user.absences[date + "-info"].week_locked;
      return;
    }
    this.computedConditions.showLockCondition =
      this.user.absences[date][0].raportedDayHaveMomentsAndLocked;
  }

  handleMomentsLock(date) {
    const dayExists = this.user.moments[date];
    if (dayExists) {
      this.computedConditions.showLockCondition =
        dayExists.raportedDayHaveMomentsAndLocked;
      this.ref.detectChanges();
    }
  }
}
