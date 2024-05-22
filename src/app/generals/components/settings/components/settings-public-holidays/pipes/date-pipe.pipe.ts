import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "date",
})
export class DatePipePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(dateString: string): string {
    const dateStringSegments = dateString.split(" ");
    return `${dateStringSegments[0]} ${this.translate.instant("Week")} ${
      dateStringSegments[2]
    }`;
  }
}
