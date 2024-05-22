import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Activity } from "../../../../interfaces/activity";

@Component({
  selector: "app-settings-activity-plan-list",
  templateUrl: "./settings-activity-plan-list.component.html",
  styleUrls: ["./settings-activity-plan-list.component.css"],
})
export class SettingsActivityPlanListComponent implements OnInit {
  @Input() activities: Activity[];
  @Input() level: number;
  @Output() openEdModal = new EventEmitter<Activity>();
  @Output() deleteActivity = new EventEmitter<{
    activities: Activity[];
    index: number;
  }>();
  nextLevel = false;
  constructor() {}

  ngOnInit(): void {
    this.activities.forEach((activity) => (activity.toggle = false));
    this.nextLevel = this.level > 0 ? true : false;
  }

  toggleActivity(activity: Activity) {
    activity.toggle = !activity.toggle;
  }

  editAct(activity) {
    this.openEdModal.emit(activity);
  }

  removeActiv(activitiyArray: Activity[], indexToRemove: number) {
    this.deleteActivity.emit({
      activities: activitiyArray,
      index: indexToRemove,
    });
  }

  removeAct(event) {
    this.deleteActivity.emit({
      activities: event.activities,
      index: event.index,
    });
  }
}
