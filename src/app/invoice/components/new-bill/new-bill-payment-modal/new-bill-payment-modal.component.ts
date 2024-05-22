import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-bill-payment-modal',
  templateUrl: './new-bill-payment-modal.component.html',
  styleUrls: ['./new-bill-payment-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewBillPaymentModalComponent implements OnInit {

  public data;
  public allChecked: boolean = false;
  public addGreenBorder: boolean = false;
  public total_of_final_invoices:number;
  public all_invoiced_total_of_final_invoices:boolean = false;
  public isChecked:boolean = false;
  public due_date:any;
  public from_component;
  public final_invoice;

  constructor(
    private dialogRef: MatDialogRef<NewBillPaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    let response = JSON.parse(JSON.stringify(data));
    this.data = response.paymentPlansNotInvoiced;
    this.total_of_final_invoices = response.total_of_final_invoices;
    this.all_invoiced_total_of_final_invoices = response.all_invoiced_total_of_final_invoices;
    this.due_date = response.due_date ? response.due_date.split(" ")[0] : null;
    this.from_component = response.from_component;
    this.final_invoice = response.final_invoice;
    if(this.all_invoiced_total_of_final_invoices && this.from_component == 'edit' || response.isChecked) {
        this.isChecked = true;
    }
  }

  ngOnInit(): void {
    this.addGreenBorder = this.isSomeoneChecked();
    for (let i=1; i<= this.data.length; i++) {
      this.data[i-1].description = `Avstämning ${this.data[i-1].avst}`;
    }

    if(this.data.length > 0) {
      this.allChecked = true;
    }
    for (let item of this.data) {
      if (!item.checked) {
        this.allChecked = false;
        return;
      }
    }
    if(this.all_invoiced_total_of_final_invoices && this.final_invoice != 0) {
        if(this.isChecked) {
            this.allChecked = true;
        }else {
            this.allChecked = false;
        }
    }
  }

  checkValue(event) {
    this.isChecked = event.target.checked;

    if(this.isChecked) {
        this.allChecked = true;
        let object = {
            'check':this.isChecked,
            'checkbox': this.isChecked,
            'checked': this.isChecked,
            'date': this.due_date,
            'Description': 'Final invoice',
            'description': 'Final invoice',
            'id': -1,
            'invoce_id': 0,
            'is_deleted': 0,
            'loopThroughArticles': [],
            'quantity': 1,
            'Price': this.total_of_final_invoices,
            'ataId': "",
            'MaterialId': "",
            'ReportIds': "",
            'AtaNumber': "",
            'DeliveredQuantity': 1,
            'Unit': "",
            'Deduct': "0",
            'Total': this.total_of_final_invoices,
            'total': this.total_of_final_invoices,
            'week': "",
            'MonthId': "",
            'PaymentPlanId': "",
            'PaymentPlanArticleId': "",
            'Arrears': '',
            'makeid': '',
        }
        this.data.push(object)
    }else {
        this.data = [];
        this.allChecked = false;
    }

  }


  onSave() {
    this.dialogRef.close(this.data);
  }

  onClose() {
    this.dialogRef.close();
  }

  disableIfPreviousUnchecked(index) {
    if((index > 0 && this.data[index -1].checked) || index == 0) {
      return null;
    }else {
      return true;
    }
  }

  onCheckItem(payment, index) {
    payment.checked = !payment.checked;
    payment.checked2 = payment.checked;
    payment.check = payment.checked;
    if(!payment.checked) {
        payment.is_deleted = true;
    }else {
        payment.is_deleted = false;
    }
    this.addGreenBorder = this.isSomeoneChecked();

    if(!payment.checked) {

      for (let i = index; i < this.data.length; i++) {

        if(this.data[i].checked) {
          this.data[i].checked = false;
          this.data[i].checked2 = false;
          this.data[i].check = false;
          this.data[i].is_deleted = true;
        }
      }
    }

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
            item.check = false;
          }
        }
        this.addGreenBorder = this.isSomeoneChecked();
        if(this.all_invoiced_total_of_final_invoices) {
            this.checkValue(event);
        }
    }

    isSomeoneChecked() {

        if(this.all_invoiced_total_of_final_invoices && this.from_component == 'new') {
            return true;
        }

        for (let item of this.data) {
            if (item.checked) return true;
        }
        return false;
    }
}
