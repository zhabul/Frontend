import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-bill-ata-modal',
  templateUrl: './new-bill-ata-modal.component.html',
  styleUrls: ['./new-bill-ata-modal.component.css']
})
export class NewBillAtaModalComponent implements OnInit {

  public data;
  public allData;
  public isEdit;
  public allChecked: boolean = false;
  public addGreenBorder: boolean = false;


  constructor(
    private dialogRef: MatDialogRef<NewBillAtaModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.allData = JSON.parse(JSON.stringify(data));
    this.data = this.allData.neededArray;
    this.isEdit = this.allData.isEdit;
  }

  ngOnInit(): void {

    this.addGreenBorder = this.isSomeoneChecked();
    for (let item of this.data) {
      if (!item.checked2) {
        this.allChecked = false;
        return;
      }
    }
    
    this.allChecked = true;
  }


  onSave() {
    this.dialogRef.close(this.data);
  }

  onClose() {
    this.dialogRef.close();
  }

  check_if_all_checked() {
    for(let item of this.data) {
      if(!item.checked) {
        this.allChecked = false;
        return;
      }
    }
    this.allChecked = true;    
  }

  onCheckItem(report) {

    //report.checked2 = !report.checked2;
    report.checked = !report.checked;
    report.checked2 = report.checked;
    if(!report.checked) {
        report.is_deleted = true;
    }else {
      report.is_deleted = false;
    }

    if(!this.areWeeklyReportsChecked(report) && report.checked2) this.checkAllWeeklyReports(report);

    this.addGreenBorder = this.isSomeoneChecked();
    this.check_if_all_checked();
  }

  selectedWREmited(ata) {

    let index = this.data.findIndex(
      (obj) => obj.ataId == ata.ataId
    );

    let at_least_one_selected = false;
    ata.weeklyReports.forEach((wr, index) => {
      if(wr.checked || wr.includeInInvoice) {
          at_least_one_selected = true;
      }
    });
    ata.checked = at_least_one_selected;
    ata.checked2 = at_least_one_selected;
    this.data[index].checked = at_least_one_selected;
    if(!this.data[index].checked) {
        this.data[index].is_deleted = true;
    }else {
      this.data[index].is_deleted =  false;
    }
    this.addGreenBorder = this.isSomeoneChecked();
    this.check_if_all_checked();
  }


    onCheckAllItems(event) {
        if(event.target.checked) {
          this.allChecked = true;
          for (let item of this.data) {
              item.checked2 = true;
              item.checked = true;
              this.checkAllWeeklyReports(item);
          };
        } else {
          this.allChecked = false;
          for(let item of this.data) {
            if(item.checked) {
              item.is_deleted = true;
            }
            item.checked = false;
            item.checked2 = false;
          }
        }
        this.addGreenBorder = this.isSomeoneChecked();
        this.check_if_all_checked();
    }

  isSomeoneChecked() {

    for (let item of this.data) {
      if (item.checked) return true;
    }
    return false;
  }

  areWeeklyReportsChecked(report) {

    const weekRep = report.weeklyReports;
    if(weekRep && weekRep.length > 0) {
        if (this.isEdit) {
          for (let item of weekRep) {
            if(item.includeInInvoice) return true;
          }
        } else {
          for (let item of weekRep) {
            if(item.checked) return true;
          }
        }
    }

    return false;
  }


  checkAllWeeklyReports(report) {
    const weekRep = report.weeklyReports;
    if(weekRep && weekRep.length > 0) {
        for(let item of weekRep) {
            item.includeInInvoice = true;
            item.checked = true;
        };
    }
  }


}
