import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { formatNumber } from "@angular/common";
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.css', '../payment-plan.component.css']
})
export class AmountInputComponent implements OnInit {

  @ViewChild('amountInput') amountInput;

  @Input('userData') userData;
  @Input('selectedPaymentPlan') selectedPaymentPlan;
  @Input('article') article;
  public articleAmount: any = 0;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  @Input('articleAmount') set setArticle(value) {
    this.articleAmount = value;

  };
  @Input('index') index;
  @Input('keyIndex') keyIndex;
  @Input('month') month;
  @Input('clickedArticle') clickedArticle;
  @Input('project') project;
  @Input('setAmount') set setAmount(value) {

    if (
      this.amountInput &&
      this.clickedArticle == (this.index + this.keyIndex + this.month.date) &&
      this.amountInput.nativeElement.value != this.articleAmount

      ) {
      this.amountInput.nativeElement.value = this.articleAmount;
      this.setArticleAmount();
    }
  };

  @Output() onPasteEvent = new EventEmitter<any>();
  @Output() updateSaveStatusEvent = new EventEmitter<any>();
  @Output() getSameEvent = new EventEmitter<any>();

  public modelChanged = new Subject<string>();

  constructor() {}

  public articleAmountTimeout;

  setArticleAmount() {

    if (this.articleAmountTimeout) {
      clearTimeout(this.articleAmountTimeout);
    }

    this.articleAmountTimeout = setTimeout(()=>{
      this.modelChanged.next(this.articleAmount);
    }, 150);
  }

  ngOnInit(): void {
    this.pipeModelChange();
  }

  pipeModelChange() {
    this.modelChanged
      .pipe(
        debounceTime(50)
        )
      .subscribe((value) => {
        value = value.toString().replace(",", ".");
        this.getSame(value);
      })
  }

  changed($event) {
    if ($event.ctrlKey === false && $event.keyCode !== 17) {
      this.modelChanged.next($event.target.value);
    }
  }

  formatNumber($event){
      $event.preventDefault();
      if ($event.clipboardData != null || $event.clipboardData != undefined){
        const value = $event.clipboardData.getData("text").trim().replace(/\s/g, "").replace(",", ".");
        this.amountInput.nativeElement.value = value;
      }
  }

  updateSaveStatus(selectedPlan, $event) {
    this.updateSaveStatusEvent.emit({
      event: $event,
      selectedPlan: selectedPlan
    });
  }

  onPaste_($event, article, index, keyIndex, date) {
    $event.stopPropagation();
    $event.preventDefault();
    const value = $event.clipboardData.getData("text").trim().replace(/\s/g, "").replace(",", ".");
    if (isNaN(Number(value))) return;
    this.modelChanged.next(value);
    this.amountInput.nativeElement.value = value;
    return false;
  }

  getSame(value) {
    this.getSameEvent.emit({
      value: value,
      article: this.article,
      index: this.index,
      keyIndex: this.keyIndex,
      date: this.month.date
    });
  }

  conditionallyCalculateRemainder(articleId) {
    if (articleId === this.clickedArticle) {
      const contractAmount = this.userData[this.selectedPaymentPlan].editContractAmount != 0 ?
                           Number(this.userData[this.selectedPaymentPlan].editContractAmount.toString().replace(/\s/g, "").replace(",", ".")) :
                           this.project.data.contractAmount;
      const sumAmount = Number(
        this.userData[this.selectedPaymentPlan].sumAmount.toString().replace(/\s/g, "").replace(",", ".")
      );
      return  contractAmount - sumAmount > 0 ? formatNumber(contractAmount - sumAmount, "fr", "1.2-2") : formatNumber(0, "fr", "1.2-2");
    }
    return '';
  }
}
