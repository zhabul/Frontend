import { Component, OnInit } from "@angular/core";
import { GeneralsService } from "src/app/core/services/generals.service";

@Component({
  selector: "app-work-week",
  templateUrl: "./work-week.component.html",
  styleUrls: ["./work-week.component.css"],
})
export class WorkWeekComponent implements OnInit {
  public workWeek: any = [];

  constructor(public generalsService: GeneralsService) {}

  ngOnInit() {
    this.generalsService
      .getWorkWeek()
      .then((response) => (this.workWeek = response));
  }

  changeWorkingDay(index) {
    this.workWeek[index].type = this.workWeek[index].type == 1 ? 0 : 1;
    this.generalsService
      .updateWorkWeek({
        id: this.workWeek[index].id,
        type: this.workWeek[index].type,
      })
      .subscribe(() => {});
  }
}
