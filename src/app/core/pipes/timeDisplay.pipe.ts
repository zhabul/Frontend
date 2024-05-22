import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeDisplay",
})
export class TimeDisplay implements PipeTransform {
  transform(value: string): string {
    if (value && value.toString().includes(":")) {
      const hours = parseInt(value.toString().split(":")[0]);
      const minutes = parseInt(value.toString().split(":")[1]);
      value = (hours + minutes / 60).toLocaleString("fr");
    } else if (value) {
      value = parseFloat(value).toLocaleString("fr");
    }

    return value === "NaN" ? "0" : value;
  }
}
