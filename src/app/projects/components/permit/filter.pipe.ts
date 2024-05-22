import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
})
export class FilterUsersPipe implements PipeTransform {
  transform(items: any[], searchText: string): any {
    if (!items) return [];
    if (!searchText) return items;

    let filtered = items.forEach((item) => {
      ["Surname", "Lastname", "StartDate", "EndDate"].some((property) =>
        item[property].toLowerCase().includes(searchText.toLowerCase())
      )
        ? (item.hidden = false)
        : (item.hidden = true);
    });
    return filtered;
  }
}
