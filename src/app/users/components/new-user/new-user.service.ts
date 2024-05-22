import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";

@Injectable({ providedIn: "root" })
export class NewUserStore {
  constructor(private translate: TranslateService) {
    this.resetUserInfo();
  }

  private newUser: any;

  getNewUserInfo() {
    return this.newUser;
  }

  setNewUserInfo(newUserInfo) {
    this.newUser = newUserInfo;
  }

  resetUserInfo() {
    this.newUser = {
      type: "Own Personal",
      ue: "Ange Företagsnamn",
      language: "sw",
      personalNumber: "",
      firstName: "",
      lastName: "",
      role: "",
      startDate: "",
      endDate: "",
      employeeNumber: "",
      bankNumber: "",
      accountNumber: "",
      bic: "",
      iban: "",
      mobileNumber: "",
      email: "",
      hourlyRate: "",
      hourlyRateDate: moment().format(
        `YYYY-MM-DD [${this.translate.instant("Week")}] WW`
      ),
      password: "",
      confirmPassword: "",
      status: "Active",
      postalAddress1: "",
      postalAddress2: "",
      zipCode: "",
      city: "",
      familyMember1: {
        name: "",
        phone: "",
        note: "",
      },
      familyMember2: {
        name: "",
        phone: "",
        note: "",
      },
      user_permission_id: 0
    };
  }
}
