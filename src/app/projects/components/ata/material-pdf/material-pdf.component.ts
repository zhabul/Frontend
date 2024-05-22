import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "material-pdf",
  templateUrl: "./material-pdf.component.html",
  styleUrls: ["./material-pdf.component.css"],
})
export class MaterialPdfComponent implements OnInit {
  @Input() materials;
  @Input() formValues;
  @Input() currentWeeklyReport;
  @Input() project;
  @Input() generalImage;
  @Input() type;
  @Input() typeKSorDU;
  @Input() reminderCheckboxDU;
  @Input() get_last_email_log_but_first_client_wr;
  @Output() emitNewAtaChanged = new EventEmitter<any>();

  public totalBilledSum = "0.00";
  public generals = [];
  public AtaTypes = [];
  public current_user: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public current_user_full_name;
  currency = JSON.parse(sessionStorage.getItem("currency"));

  constructor(private route: ActivatedRoute) {}

  today() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }

  ngOnInit() {
    if(!this.currency) {
        this.currency = 'SEK';
    }
    this.AtaTypes = this.route.snapshot.data["type_atas"];
    this.generals = this.route.snapshot.data["generals"] || [];
    this.formatWRNumber();
    this.current_user_full_name = this.current_user.firstname + " " + this.current_user.lastname;
  }

  get showCommentIfExist() {

    let status = false;
    if(this.materials && this.materials.length > 0) {
        let index = this.materials.findIndex((material) => { return material.ClientComment && material.ClientComment.length > 0});

        if(index > -1) {
            status = true;
        }
    }
    return status;
  }

  getAtaType(id) {
    const type = this.AtaTypes.find((type) => type.id == id);
    if (type) {
      return type.Name;
    }
  }

  calcRemainingToBill(workedUp) {
    return (
      parseFloat(this.currentWeeklyReport[workedUp]) -
      parseFloat(this.totalBilledSum)
    ).toFixed(2);
  }

  calcTotal(data) {
    let total = 0;
    data.forEach((data2) => {
      let amount = data2.Total != "" ? data2.Total : 0;
      total += parseFloat(amount);
    });
    return total.toFixed(2);
  }

  formatWRNumber() {
    if (this.currentWeeklyReport && this.currentWeeklyReport.name) {
      this.currentWeeklyReport.formatWRNumber = this.currentWeeklyReport.name;
    } else {
      this.currentWeeklyReport.formatWRNumber = "";
    }
  }

  formatWRNumber2(number, type) {
    if (number) {
      return `${type}` + number.split("-")[1];
    } else {
      return "";
    }
  }

  checkDisplayText() {
    let displayText = "";

    let dis_text = "- Materialsammanställning ";

    if (this.type == "other") {
      dis_text = "- Sammanställning ";
    }

    if (this.reminderCheckboxDU) {
      if (this.currentWeeklyReport.timesReminderSentDU <= 1) {
        displayText = "Påminnelse";
      } else {
        displayText =
          "Påminnelse - " + this.currentWeeklyReport.timesReminderSentDU;
      }
    } else {
      displayText = dis_text + this.currentWeeklyReport.name;
    }

    return displayText;
  }
  checkDisplayTextDU() {
    let text = "Materialsammanställning ";

    if (this.type === "other") {
      text = "Sammanställning ";
    }

    return text + this.currentWeeklyReport.name;
  }

  dclMaterialClass(ClientStatus, i) {
    let cls = "";

    if (i % 2 != 0) {
      cls = "row bg-table dcl-mat-pt";
    } else {
      cls = "row dcl-mat-pt";
    }

    return cls;
  }
  getTotalDeclinedMaterials(materials) {
    let sum = 0;
    materials.forEach((element) => {
      if (element["ClientStatus"] == "0" || !element["ClientStatus"]) {
        sum += parseFloat(element["Total"]);
      }
    });
    return sum.toFixed(2);
  }

  getTotalAcceptedMaterials(materials) {
    let sum = 0;
    materials.forEach((element) => {
      if (element["ClientStatus"] == 1) {
        sum += parseFloat(element["Total"]);
      }
    });
    return sum.toFixed(2);
  }

  checkDU(nameDU) {
    return nameDU.includes("DU");
  }

  isOdd(num) {
    return num % 2;
  }

  generatePdf(from) {
    this.emitNewAtaChanged.emit({
      type: this.type,
      from: from,
    });
  }
}
