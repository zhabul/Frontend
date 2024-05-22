import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "underscoreToSpace" })
export class UnderscoreToSpace implements PipeTransform {
  transform(str: string): string {
    const replaceStr = "_";
    const replacementStr = " ";
    return str.replace(new RegExp(replaceStr, "g"), replacementStr);
  }
}
