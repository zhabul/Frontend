import { AbstractControl } from "@angular/forms";

export class SelectValidator {
  static selectStatusValidator(control: AbstractControl) {
    const status: string = control.get("status").value;
    if (status == "0") {
      control.get("status").setErrors({ required: true });
    }
  }

  static selectResposibleValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("responsiblePerson").value;
    if (responsiblePerson == "0") {
      control.get("responsiblePerson").setErrors({ required: true });
    }
  }

  static selectClientValidator(control: AbstractControl) {
    const client_id: string = control.get("client_id").value;
    if (client_id == "0") {
      control.get("client_id").setErrors({ required: true });
    }

    const client_worker: string = control.get("client_worker").value;
    if (client_worker == "0") {
      control.get("client_worker").setErrors({ required: true });
    }
  }

  static selectTypeDeviationValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("DeviationType").value;
    if (responsiblePerson == "0") {
      control.get("DeviationType").setErrors({ required: true });
    }
  }

  static selectQualityStatusValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("QualityStatus").value;
    if (responsiblePerson == "0") {
      control.get("QualityStatus").setErrors({ required: true });
    }
  }

  static selectDemandValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("Demand").value;
    if (responsiblePerson == "0") {
      control.get("Demand").setErrors({ required: true });
    }
  }

  static selectEconomyStatusValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("EconomyStatus").value;
    if (responsiblePerson == "0") {
      control.get("EconomyStatus").setErrors({ required: true });
    }
  }

  static selectReportedByValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("ReportedBy").value;
    if (responsiblePerson == "0") {
      control.get("ReportedBy").setErrors({ required: true });
    }
  }

  static selectClientsValidator(control: AbstractControl) {
    const responsiblePerson: string = control.get("Clients").value;
    if (responsiblePerson == "0") {
      control.get("Clients").setErrors({ required: true });
    }
  }

  static selectProjectIDValidator(control: AbstractControl) {
    const Project: string = control.get("ProjectID").value;
    if (!Project) {
      control.get("ProjectID").setErrors({ required: true });
    }
  }

  static selectAtaIDValidator(control: AbstractControl) {
    const Project: string = control.get("AtaID").value;
    if (!Project) {
      control.get("AtaID").setErrors({ required: true });
    }
  }
  static MomentsWorkValidator(control: AbstractControl) {
    const Moments: string = control.get("Moments").value;
    if (!Moments) {
      control.get("Work").setErrors({ required: true });
    }
  }

  static MomentsTimeValidator(control: AbstractControl) {
    const Moments: string = control.get("Moments").value;
    if (!Moments) {
      control.get("Hours").setErrors({ required: true });
    }
  }
}
