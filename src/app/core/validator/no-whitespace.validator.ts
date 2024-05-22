import { FormControl } from "@angular/forms";

export class NoWhitespaceValidator {
  static noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { required: true };
  }
}
