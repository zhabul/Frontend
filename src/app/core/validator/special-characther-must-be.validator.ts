import { FormControl } from "@angular/forms";

export class SpecialCharactherMustBeValidators {
  nameValidator(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const value = control.value;

    if (value && nameRegexp.test(control.value)) {
      if (value.includes('/')) {
        return { invalidName: false };
      } else {
        return null;
      }
    } else {
      return { invalidName: false };
    }
  }
}
