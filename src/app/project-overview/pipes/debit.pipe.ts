import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'debit'
})
export class DebitPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const debitId=+value
    switch (debitId) {
      case 3:
        return "Enl. á-prislista";
      case 4:
        return "Riktkostnad";
      case 1:
        return "Löpande räkning";
      case 2:
        return "Fast pris";
      case 5:
        return "Riktpris Hög/Sänkt";
      case 6:
        return "-";
    }
  }

}
