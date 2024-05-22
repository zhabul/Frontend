import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "app-user-day-moments",
  templateUrl: "./user-day-moments.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./user-day-moments.component.css"],
})
export class UserDayMomentsComponent implements OnInit {
  @Input("moments") moments;
  @Input("day") day;
  @Input("user") user;
  @Input("index") index;
  @Input('queryParams') queryParams
  _calendarStyle: any;
  get calendarStyle(): any {
    return this._calendarStyle;
  }
  @Input("calendarStyle") set calendarStyle(value: any) {
    if (value !== this.calendarStyle) {
      this._calendarStyle = value;
      this.namesDefined();
      this.lockIconSizeCondition();
      this.lockItemStyle();
      this.setMileage();
    }
  }

  public computedStyles = {
    lockItemStyle: {},
    namesDefined: false,
    lockIconSizeCondition: "medium",
    contStyle: {},
  };

  public mileage = false;

  constructor() {}

  ngOnInit() {
    this.namesDefined();
    this.lockIconSizeCondition();
    this.lockItemStyle();
    this.computedStyles.contStyle = {
      border: this.moments.needAtest !== "" ? "1px solid red" : "",
      background: 'none'
    };
    this.setMileage();
  }

  setMileage() {
    if (this.queryParams) {
      this.mileage =
      this.queryParams.fetched == 14 ? this.moments.mileages_total : false; 
    }
  }

  namesDefined() {
    this.computedStyles.namesDefined =
      this.moments.time_qty ||
      this.moments.ShortName ||
      this.moments.ProjectName;
  }

  lockIconSizeCondition() {
    const zoom = this.calendarStyle.rowHeight === 60;
    this.computedStyles.lockIconSizeCondition = this.computedStyles.namesDefined
      ? zoom
        ? "medium"
        : "small"
      : zoom
      ? "large"
      : "medium";
    
    if (this.moments.time_qty === 0) this.computedStyles.lockIconSizeCondition = 'small';
  }

  lockItemStyle() {
    const zoom = this.calendarStyle.rowHeight === 60;
    this.computedStyles.lockItemStyle = {
      paddingTop: this.computedStyles.lockIconSizeCondition
        ? zoom
          ? "0.60rem"
          : "0.40rem"
        : zoom
        ? "1.1rem"
        : "0.70rem",
      fontSize: this.calendarStyle.fontSizeSmall,
    };
  }
}
