import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoicesModalServiceService } from './invoices-modal-service.service';
import { Subscription } from 'rxjs';
// import { Subscription } from 'rxjs';

// import { NewBillService } from '../new-bill/new-bill.service';

@Component({
  selector: 'app-invoices-modal',
  templateUrl: './invoices-modal.component.html',
  styleUrls: ['./invoices-modal.component.css']
})
export class InvoicesModalComponent implements OnInit, OnDestroy {
  public typeOpenModal:any;

  // public weeklyReportSub: Subscription = new Subscription();
  public weeklyReport:any = []
  public allIsChecked : boolean = false;

  public checkedToTable:any = [];
  public checkedItemsIndexes: any[] = [];
  public invoiceServiceSubscription: Subscription;

  constructor(
    private invoicesModalService: InvoicesModalServiceService,
    public dialogRef: MatDialogRef<InvoicesModalComponent>,

    @Inject(MAT_DIALOG_DATA) public modal_data: any,

  )
  {
    this.typeOpenModal = this.modal_data.data.type;
  }



  ngOnInit(): void {
    this.invoiceServiceSubscription = this.invoicesModalService.weeklyReportChecked$.subscribe({
      next: arrayOfResult => {
        this.checkedToTable = arrayOfResult.map(a => {return {...a}});
        this.allIsChecked = this.checkAllIsChecked();
      }
    });
  }



  checkAll(){
    this.allIsChecked = !this.allIsChecked;
    if(this.allIsChecked) {
      for(let item of this.checkedToTable) item.checked = true;
      return;
    }
    for(let item of this.checkedToTable) item.checked = false;
    return;
  }



  checkWr(wr, index){
    if(!wr.checked) {
      this.checkedToTable[index].checked = true;
      this.allIsChecked = this.checkAllIsChecked();
      return;
    }

    this.checkedToTable[index].checked = false;
    this.allIsChecked = this.checkAllIsChecked();
    return;

  }



  checkAllIsChecked(){
    for(let item of this.checkedToTable) {
      if(!item.checked) return false;
    }
    return true;
  }



  add(){
    for (let item of this.checkedToTable) {
      if(item.checked) this.weeklyReport.push(item);
    }
    this.invoicesModalService.setWeeklyReportChecked(this.checkedToTable);
    this.dialogRef.close(this.weeklyReport);
  }

  close(parameter = false) {
    this.weeklyReport = []
    this.dialogRef.close(parameter);
  }


  ngOnDestroy(): void {
    this.invoiceServiceSubscription.unsubscribe();
  }



}
