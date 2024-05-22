import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "trimStr2" })
export class TrimStrTwo implements PipeTransform {
  transform(str: string): string {
    if (!str) return str;
    const takeFirst7 = str.substring(0, 10); // so the string is set to e.g. 2019-08-23
    return takeFirst7;
  }
}
