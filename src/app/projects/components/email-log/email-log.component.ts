import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EmailLogAttachmentsModalComponent } from "./email-log-attachments-modal/email-log-attachments-modal.component";
import * as _ from "lodash";
@Component({
  selector: "email-log",
  templateUrl: "./email-log.component.html",
  styleUrls: ["./email-log.component.css"],
})
export class EmailLogComponent implements OnInit {
  @Input() ataid = 0;
  @Input() ItemName;
  @Input() projectId;
  @Input() client_workers;
  @Input() logs;
  @Input() haveQuestionStatus: boolean = true;
  @Input() files;

  //Use app part to differentiate component for different parts of the app
  @Input() appPart = "";
  ///////////////////////////////////////////
  public userDetails: any;
  public weeks: any[] = [];
  public activeReportIndex: number = 0;
  public activeReportRevisionIndex: number = -1;
  public reports: any[] = [];
  public showPagination = true;
  public logNames = [];
  private logsCopy: any;
  // private filteredLogsCopy: any;
  public statusObject: any = {
    "-1": false, //all
    "0": false, //reminder
    "1": false, //sent
    "2": false, //accepted
    "3": false, //not accepted
    "4": false, //canceled
    "6": false, //question
  };
  @ViewChild("searchInput") searchInput: ElementRef;
  public searchQuery = "";

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    //welding truck wrecks
    if(this.appPart == "offer"){
      for(let offer in this.logs){
        this.logs[offer] = this.logs[offer].filter((log) => {
          if(log.Status == 1 && log.comment != "")
            return false;
          return true;
        }).reverse();
      }
    }
    //and welding truck wrecks (For filtering logs that are duplicated due to messages that are written and answered from emails and forms)
    else if(this.appPart == "deviation"){
      for(let deviation in this.logs){
        this.logs[deviation] = this.logs[deviation].filter((log) => {
          if(log.Status == 6 && log.comment != "")
            return false;
          return true;
        })
      }
    }

    if (this.logs) {
      this.logNames = Object.keys(this.logs);
      this.createEmailLogsCopy();
      this.onStatusChange("-1"); //set all filters to true;
    }
  }

  createEmailLogsCopy() {
    this.logsCopy = _.cloneDeep(this.logs);
  }

  hasPDFsOrImage(logs) {
    for (const logName in logs) {
      if (logs.hasOwnProperty(logName)) {
        const log = logs[logName];
        if (log.files && log.files.length > 0) {
          return true;

        }
        if (log.pdfs && log.pdfs.length > 0) {
          return true;
        }
        if (log.images && log.images.length > 0) {
              return true;
        }
      }
    }
    return false;
  }

  viewAttachmentsSent(logs) {
    const attachments = [];
    const addedFileUrls = new Set();

    if (this.appPart === "offer") {
        logs.forEach((log) => {
            if (log.pdfs && log.pdfs.length > 0) {
                log.pdfs.forEach((pdf) => {
                    if (!addedFileUrls.has(pdf.Url)) {
                        attachments.push(pdf);
                        addedFileUrls.add(pdf.Url);
                    }
                });
            }
            if (log.files && log.files.length > 0) {
                log.files.forEach((file) => {
                    if (!addedFileUrls.has(file.Url)) {
                        attachments.push(file);
                        addedFileUrls.add(file.Url);
                    }
                });
            }
        });
    } else if (this.appPart === "other" || this.appPart === "deviation") {

        let log = logs[0];
        if (log.files && log.files.length > 0) {
            log.files.forEach((file) => {
                if (!addedFileUrls.has(file.Url)) {
                    attachments.push(file);
                    addedFileUrls.add(file.Url);
                }
            });
        }
    }

    if (attachments.length > 0) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = "616px";
        dialogConfig.data = { attachments };
        dialogConfig.panelClass = 'app-email-log';
        this.dialog.open(EmailLogAttachmentsModalComponent, dialogConfig);
    }
}

  onStatusChange(value) {
    const status = !this.statusObject[value];
    if (value == "-1") {
      this.checkAll(status);
    } else {
      // if (!status) {
      //   this.statusObject["-1"] = false;
      // }
      this.statusObject[value] = status;
      this.statusObject["-1"] = this.checkAllChecked();
    }
    this.filterEmailLogs();
    // this.filteredLogsCopy = _.cloneDeep(this.logs);
  }

  checkAll(status) {
    const keys = Object.keys(this.statusObject);
    keys.forEach((key) => {
      this.statusObject[key] = status;
    });
  }

  checkAllChecked(){
    const keys = Object.keys(this.statusObject);
    let isAllChecked = false;
    keys.forEach((key) => {
      if(key != "-1")
        isAllChecked = this.statusObject[key];
    });

    return isAllChecked;
  }

  filterEmailLogs() {
    if (this.appPart == "offer" ) {
      this.filterOfferEmailLogs();
    }else if(this.appPart == "other"){
      this.filterOtherEmailLogs();
    }else if(this.appPart == "deviation"){
      this.filterDeviationEmailLogs();
    }
  }

  filterOfferEmailLogs(){
    const filterArray = this.getOnlyOfferFilterArray();
    this.logNames.forEach((logName) => {
      this.logs[logName] = this.logsCopy[logName].filter((log) =>
        filterArray.includes(log.Status) ||
        filterArray.includes(log.StatusName)
      );
    });
  }

  filterOtherEmailLogs() {
    const filterArray = this.getOfferFilterArray();
      this.logNames.forEach((logName) => {
        this.logs[logName] = this.logsCopy[logName].filter((log) => {
        const statusToCheck = log.StatusName ? log.StatusName : log.Status;
        return (
          (statusToCheck == '1' &&
            ((log.reminder == '1' && filterArray.includes('0')) ||
              (log.reminder == '0' && filterArray.includes('1')))) ||
          (statusToCheck !== '1' && filterArray.includes(statusToCheck))
        );
      });
    });
  }

  filterDeviationEmailLogs() {
      const filterArray = this.getDeviationFilterArray();
      this.logNames.forEach((logName) => {
        this.logs[logName] = this.logsCopy[logName].filter((log) => {
        const statusToCheck = log.StatusName ? log.StatusName : log.Status;
        return (
          (statusToCheck == '1' &&
            ((log.reminder == '1' && filterArray.includes('0')) ||
              (log.reminder == '0' && filterArray.includes('1')))) ||
          (statusToCheck == '0' && log.reminder == '0' && filterArray.includes('4')) ||
          (statusToCheck !== '1' && statusToCheck !== '0' && filterArray.includes(statusToCheck))
        );
      });
    });
  }

  getOnlyOfferFilterArray() {
    const filterArray = [];
    Object.keys(this.statusObject).forEach((filter) => {
      if (this.statusObject[filter] && filter != "-1") {
        filterArray.push(filter);
      }
      if (this.statusObject[filter] && filter == "4")
        filterArray.push("5", "7");
      // if (this.statusObject[filter] && filter == "1") filterArray.push("7");
    });
    return filterArray;
  }

  getOfferFilterArray() {
    const filterArray = [];
    Object.keys(this.statusObject).forEach((filter) => {
      if (this.statusObject[filter] && filter != "-1") {
        filterArray.push(filter);
      }
      if (this.statusObject[filter] && filter == "4")
        filterArray.push("", "");
        // filterArray.push("5", "6");
      if (this.statusObject[filter] && filter == "1") filterArray.push("7");
    });
    return filterArray;
  }

  getDeviationFilterArray() {
    const filterArray = [];
    Object.keys(this.statusObject).forEach((filter) => {
      if (this.statusObject[filter] && filter != "-1") {
        filterArray.push(filter);
      }
      // if (this.statusObject[filter] && filter == "4")
        // filterArray.push("");
        // filterArray.push("5", "6");
      if (this.statusObject[filter] && filter == "1") filterArray.push("7");
    });
    return filterArray;
  }

  filterBySearchQuery() {
    if (this.searchQuery === '' || this.searchQuery.length === 0) {
      this.logs = _.cloneDeep(this.logsCopy);
      return;
    }

    this.searchQuery = this.searchQuery.toLowerCase();
    const filteredLogs = {};

    for (const logKey in this.logsCopy) {
      if (this.logsCopy.hasOwnProperty(logKey)) {
        const logArray = this.logsCopy[logKey];
        const filteredLogArray = logArray.filter((log) => {

          const logValues = [
            log.answerEmail.toLowerCase(),
            log.sentFrom.toLowerCase(),
            log.name.toLowerCase(),
            log.Date ? log.Date : '',
            log.openDate ? log.openDate : '',
            log.answerDate ? log.openDate : '',
            logKey.toLowerCase()
          ];

          return logValues.some((value) => value.includes(this.searchQuery));
        });

        if (filteredLogArray.length > 0) {
          filteredLogs[logKey] = filteredLogArray;
        }
      }
    }
    this.logs = filteredLogs;
  }

  formatDate(dateString) {
    const parts = dateString.split(' ');
    const datePart = parts[0];
    const timePart = parts[1];
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // filterBySearchQuery() {
  //   this.searchQuery = this.searchQuery.toLowerCase();
  //   this.logs = _.cloneDeep(this.filteredLogsCopy);

  //   if (Array.isArray(this.logs)) {
  //     this.logs.forEach((log, index) => {
  //       this.logs[index] = this.checkLogs(log);
  //     });
  //   }
  // }

  // checkLogs(logs) {
  //   let match = false;
  //   logs.forEach((log) => {
  //     if (
  //       log.answerEmail.includes(this.searchQuery) ||
  //       log.sentFrom.includes(this.searchQuery) ||
  //       log.date.includes(this.searchQuery) ||
  //       log.openDate.includes(this.searchQuery) ||
  //       log.name.toLowerCase().includes(this.searchQuery)
  //     ) {
  //       match = true;
  //       log.show = true;
  //     } else {
  //       log.show = false;
  //     }
  //   });

  //   return match;
  // }

  clearSearchText() {

    this.searchQuery = ""

    if (this.searchQuery === '') {
      this.logs = _.cloneDeep(this.logsCopy);
      return;
    }
    // return (this.searchQuery = "");
  }

  getRowBackgroundColor(emailLog) {
    if(this.appPart == "deviation"){
      if(emailLog.StatusName !== null){
        let color = "#FFF";
        switch (emailLog.StatusName) {
          case "0":
            color = "#C7C6C4";
            break;
          case "1":
            // color = "#DEFBFF"; break;
            if (emailLog.StatusName === "1" && emailLog.active === "1") {
              color = "#DEFBFF";
            } else if (emailLog.StatusName === "1" && emailLog.active === "0" && emailLog.reminder == "0") {
              color = "#C7C6C4";
            } else if (emailLog.reminder !== "0" && emailLog.active === "1"){
              color = "#DEFBFF";
            }else if (emailLog.reminder !== "0" && emailLog.active === "0"){
              color = "#C7C6C4";
            }
            break;
          case "2":
            color = "#E3E9DD";
            break;
          case "3":
            color = "#fCE4E4";
            break;
          case "4":
              color = "#B8B8B8";
            break;
          case "5":
            color = "#B8B8B8";
            break;
          case "6":
            if(emailLog.Status === "1" && emailLog.StatusName === "6"){
              color = "#FFF335"; //Fraga
            }else{
              color = "#BFE29C"; //Svar
            }
            break;
          case "7":
            color = "#DEFBFF";
            break;
        }
        return color;

      }else if(emailLog.Status){
        let color = "#FFF";
        switch (emailLog.Status) {
          case "0":
            color = "#C7C6C4";
            break;
          case "1":
            // color = "#DEFBFF"; break;
            if (emailLog.Status === "1" && emailLog.active === "1") {
              color = "#DEFBFF";
            } else if (emailLog.Status === "1" && emailLog.active === "0" && emailLog.reminder == "0") {
              color = "#C7C6C4";
            } else if (emailLog.reminder !== "0" && emailLog.active === "1"){
              color = "#DEFBFF";
            }else if (emailLog.reminder !== "0" && emailLog.active === "0"){
              color = "#C7C6C4";
            }
            break;
          case "2":
            color = "#E3E9DD";
            break;
          case "3":
            color = "#fCE4E4";
            break;
          case "4":
              color = "#B8B8B8";
            break;
          case "5":
            color = "#B8B8B8";
            break;
          case "6":
            color = "#FFF335";
            break;
          case "7":
            color = "#DEFBFF";
            break;
        }
        return color;
      }

    }else{
      let color = "#FFF";
      switch (emailLog.Status) {
        case "0":
          color = "#C7C6C4";
          break;
        case "1":
          // color = "#DEFBFF"; break;
          if (emailLog.Status === "1" && emailLog.active === "1") {
            color = "#DEFBFF";
          } else if (emailLog.Status === "1" && emailLog.active === "0" && emailLog.reminder == "0") {
            color = "#C7C6C4";
          } else if (emailLog.reminder !== "0" && emailLog.active === "1"){
            color = "#DEFBFF";
          }else if (emailLog.reminder !== "0" && emailLog.active === "0"){
            color = "#C7C6C4";
          }
          break;
        case "2":
          color = "#E3E9DD";
          break;
        case "3":
          color = "#fCE4E4";
          break;
        case "4":
          if(emailLog.StatusName === "2"){
            color = "#E3E9DD";
          }else{
            color = "#B8B8B8";
          }
          break;
        case "5":
          color = "#B8B8B8";
          break;
        case "6":
          // color = "#FFF335";
          if (this.appPart == "offer") {
            color = "#FFF335";
          } else if (this.appPart == "other") {
            color = "#FFF335"; //staviti ("sivu") boju ako bude zahtjevao da se razlikuje od offera jer je kod offera za pitanje zuta boja
            // color = "#C7C6C4";
          } else {}
          break;
        case "7":
          color = "#B8B8B8";
          break;
      }
      return color;
    }

  }

  getOfferLogsBackgroundColor(logName) {
    let allAnswered = true;
    this.logs[logName].forEach((log) => {
      if (log.Status == "1" || log.Status == "5" || log.Status == 4) {
        allAnswered = false;
      }
    });
    if (allAnswered) return "#C7C6C4";
    return "#FFFFFF";
  }

}
