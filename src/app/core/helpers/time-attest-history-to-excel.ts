import { Workbook, Worksheet } from "exceljs";
import * as fs from "file-saver";
import * as moment from "moment";

export class TimeAttestHistory {
    private data: any = {};
    private worksheet: Worksheet;
    private workbook: Workbook;
    private save_name: any;

    private colmunWidth: any = {
        A: 21,
        B: 23,
        C: 18,
        D: 20,
        E: 25,
        F: 12,
        G: 24,
        H: 16,
        I: 22,
        J: 15,
    };

    private columns_translated = [];
    private language_translated = [];

    constructor() {}

    setLanguage(data: any) {

        this.language_translated = data;
        this.columns_translated = [
            data['Datum'],
            data['Namn'],
            data['Tid.tot.'],
            data['Typ'],
            data['Moment'],
            data['Tid'],
            data['Läge'],
            data['Kommentar'],
            data['Attesterad av'],
            data['Attest datum'],
        ];
    }

    setData(data: any) {
        this.data = data;
        let date = new Date();
        let date1 = moment(date, "YYYY-MM-DD");
        let momentDateFormated = date1.format("YYYYMMDD");
        this.save_name = data.saveName + "-timmar-" + momentDateFormated + ".xlsx";
    }

  prepareWorksheet() {
    this.worksheet.mergeCells("A1:I1");
    this.worksheet.mergeCells("A2:I2");

    this.worksheet.mergeCells("A3:B3");
    this.worksheet.mergeCells("A4:B4");
    this.worksheet.mergeCells("A5:B5");
    this.worksheet.mergeCells("A6:B6");
  }

  // TO-DO
  // Styling
  toExcel() {
    this.data.projectName = this.language_translated['Project'] + ':' + this.data.projectName;
    const projectNameRow = this.worksheet.addRow([this.data.projectName]);
    projectNameRow.font = { name: "Calibri", size: 14 };

    this.worksheet.addRow([]);

    // TO-DO
    // Translate columns
    this.worksheet.addRow([this.language_translated['Totalsumma'], "", this.data.totals.totalHours]);
    this.worksheet.addRow([
        this.language_translated['Projekt Totalt'],
      "",
      this.data.totals.totalProjectHours,
    ]);
    this.worksheet.addRow([this.language_translated['Äta Totalt'], "", this.data.totals.totalAtaHours]);
    this.worksheet.addRow([]);

    // TO-DO
    // Translate columns
    const tableRow = this.worksheet.addRow(this.columns_translated);
    tableRow.alignment = { horizontal: "center" };

    this.data.weeks.forEach((item) => {
      item.users.forEach((user) => {
        if (user.total && typeof user.total != "number") {
          user.total = this.timeStringToFloat(user.total);
        }

        const row = this.worksheet.addRow([
          item.date,
          user.name,
          user.total,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        row.getCell("A").alignment = { horizontal: "center" };
        row.getCell("C").alignment = { horizontal: "right" };

        user.moments.forEach((moment) => {
          let type = "";

          if (moment.AtaNumber) {
            type = "ÄTA-" + moment.AtaNumber;
            if (moment.wr_name) type = type + "-" + moment.wr_name;
          } else if (moment.wr_name) {
            type = moment.wr_name;
          }

          // TO-DO
          // Typ Column value
          const row = this.worksheet.addRow([
            "",
            "",
            "",
            type,
            moment.moment,
            moment.time_qty,
            moment.state,
            moment.comment,
            moment.attestedBy,
            moment.attestedDate,
          ]);
          row.getCell("D").alignment = { horizontal: "center" };
          row.getCell("F").alignment = { horizontal: "right" };
          row.getCell("G").alignment = { horizontal: "right" };
          row.getCell("J").alignment = { horizontal: "center" };
        });
      });
    });
    this.prepareWorksheet();

    this.workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, this.save_name);
    });
  }

  newWorksheet(name: string) {
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet(name);
    Object.keys(this.colmunWidth).forEach(
      (key) => (this.worksheet.getColumn(key).width = this.colmunWidth[key])
    );
  }

  timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }
}
