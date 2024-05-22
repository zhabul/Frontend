import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";

@Pipe({ name: "week" })
export class WeekPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string): string {
    const weekTrans = this.translate.instant("Week");
    const week = moment(value, "YYYY-MM-DD").isoWeek();
    return `${value} ${weekTrans} ${week}`;
  }
}
