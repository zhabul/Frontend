import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "trimStr" })
export class TrimStr implements PipeTransform {
  transform(str: string): string {
    const removeCompany = str.substring(7);
    return removeCompany;
  }
}
