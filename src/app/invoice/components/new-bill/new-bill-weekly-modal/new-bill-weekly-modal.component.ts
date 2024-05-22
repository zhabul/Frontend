import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralsService } from "src/app/core/services/generals.service";

@Component({
  selector: 'app-new-bill-weekly-modal',
  templateUrl: './new-bill-weekly-modal.component.html',
  styleUrls: ['./new-bill-weekly-modal.component.css']
})
export class NewBillWeeklyModalComponent implements OnInit {

  public data;
  public allChecked: boolean = false;
  public addGreenBorder: boolean = false;
  public generals;

  constructor(
    private dialogRef: MatDialogRef<NewBillWeeklyModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private generalsService: GeneralsService
  ) { 
    this.data = JSON.parse(JSON.stringify(data));

    this.generalsService.getAllGeneralsSortedByKey().subscribe((res) => {
        this.generals = res;
    });
  }

  ngOnInit(): void {
    this.addGreenBorder = this.isSomeoneChecked();
    for (let item of this.data) {
      if (!item.checked) {
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


  onCheckItem(report) {
    report.checked = !report.checked;
    report.checked2 = report.checked;
    if(!report.checked) {
        report.is_deleted = true;
    }else {
        report.is_deleted = false;
    }
    this.addGreenBorder = this.isSomeoneChecked();
    for(let item of this.data) {
      if(!item.checked) {
        this.allChecked = false;
        return;
      }
    }
    this.allChecked = true;
  }

  onCheckAllItems(event) {
    if(event.target.checked) {
      this.allChecked = true;
      for (let item of this.data) item.checked = true;
    } else {
      this.allChecked = false;
        for(let item of this.data) {
          if(item.checked) {
            item.is_deleted = true;
          }
          item.checked = false;
        }
    }

    this.addGreenBorder = this.isSomeoneChecked();
  }

  isSomeoneChecked() {
    for (let item of this.data) {
      if (item.checked) return true;
    }
    return false;
  }

}
