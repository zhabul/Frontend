import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { sanitizeNumber } from '../../utils';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TabService } from 'src/app/shared/directives/tab/tab.service';

@Component({
  selector: 'app-line-article',
  templateUrl: './line-article.component.html',
  providers: [TabService],
  styleUrls: ['./line-article.component.css']
})
export class LineArticleComponent implements OnInit {

  @Input('article') article:any;
  @Input('articles') articles;
  @Input('properties') properties = [];
  @Input('units') units = [];
  @Input('index') index;
  @Input('service') service;
  @Input('nextTotal') nextTotal;

  @Output('filterArticle') filterArticle:EventEmitter<number> = new EventEmitter();
  @Output('addRow') addRow:EventEmitter<number> = new EventEmitter();

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
     if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeModal();
     }
  }

  private toPasteFun;
  public column;

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getTotal();
    this.getFontWeight();
    document.addEventListener("keydown", this.getSelected.bind(this));
    this.toPasteFun = (e : ClipboardEvent) => {
      let clipboardData = e.clipboardData //|| window.clipboardData;
      if(this.column ){
        this.article.get(this.column).patchValue(clipboardData.getData('text'));
      }

      e.preventDefault();

    }
    addEventListener("paste", this.toPasteFun)
  }

  setFocusColumn(column){
    this.column = column;
  }

  updateTotal(event:KeyboardEvent) {
    if(event.key < "0" || event.key > "9" ) return;
    const quantity = sanitizeNumber(this.article.get('quantity').value);
    const price = sanitizeNumber(this.article.get('pricePerUnit').value);
    const deduct = (sanitizeNumber(this.article.get('percentage').value) / 100) + 1;
    if(quantity != 0) {
      const total = quantity * price * deduct;
      const strTotal = total.toFixed(2).toString().replace('.',',');
      this.article.get('total').patchValue(strTotal);
    } else {
      // this.article.get('quantity').patchValue("0,00");
      const total = 0 * price * deduct;
      const strTotal = total.toFixed(2).toString().replace('.',',');
      this.article.get('total').patchValue(strTotal);
      // this.article.get('pricePerUnit').patchValue(price.toFixed(2).toString().replace('.',','));
    }

    this.getTotal();
    this.nextTotal(this.total);
  }

  updateTotalOnBlur() {
    const quantity = sanitizeNumber(this.article.get('quantity').value);
    const price = sanitizeNumber(this.article.get('pricePerUnit').value);
    const deduct = (sanitizeNumber(this.article.get('percentage').value) / 100) + 1;
    if(quantity != 0) {
      const total = quantity * price * deduct;
      const strTotal = total.toFixed(2).toString().replace('.',',');
      this.article.get('total').patchValue(strTotal);
    } else {
      // this.article.get('quantity').patchValue("0,00");
      const total = 0 * price * deduct;
      const strTotal = total.toFixed(2).toString().replace('.',',');
      this.article.get('total').patchValue(strTotal);
      // this.article.get('pricePerUnit').patchValue(price.toFixed(2).toString().replace('.',','));
    }

    this.getTotal();
    this.nextTotal(this.total);
  }

  updateQuantityOrPrice(){
    const quantity = sanitizeNumber(this.article.get('quantity').value);
    const total = sanitizeNumber(this.article.get('total').value);
    const price = sanitizeNumber(this.article.get('pricePerUnit').value);
    const deduct = (sanitizeNumber(this.article.get('percentage').value) / 100) + 1;
    if(quantity > 0) {
      const priceNew = total / (quantity * deduct);
      const strPriceNew = priceNew.toFixed(2).toString().replace('.',',');
      this.article.get('pricePerUnit').patchValue(strPriceNew);
    } else if (price == 0){
      this.article.get('quantity').patchValue("1,00");
      this.article.get('pricePerUnit').patchValue(total.toFixed(2).toString().replace('.',','));
    }
    // const total = quantity * price * deduct;
    // this.article.get('total').patchValue(total);
    // this.getTotal();
    // this.nextTotal(this.total);
  }

  public total:number = 0;
  getTotal() {
    this.total = this.article.get('total').value;
  }

  getId() {
    return this.article.get('id').value;
  }

  public fontWeight:string = '';
  getFontWeight() {
    this.fontWeight = this.article.get('fontWeight').value;
  }

  getSelected(event) {
    // const articlesLength = this.articles.length;
    // const secondToLastArticle = this.articles[articlesLength - 2];
    // const lastArticle = this.articles[articlesLength - 1];
    // if (secondToLastArticle && secondToLastArticle.value.description === '' &&
    //     lastArticle && lastArticle.value.description === '') return;

    if ((event.keyCode === 13 && event.target["form"]) || (event.keyCode === 9 && event.target["form"])) {

      const form = event.target["form"];
      const index = Array.prototype.indexOf.call(form, event.target);
      const nextEl = form.elements[index + 1];
      // console.log(form,index,nextEl)
      if (nextEl) {
          if (nextEl.type == "fieldset") {
              form.elements[index + 3].focus();
          } else if (nextEl.type == "hidden") {
              form.elements[index + 2].focus();
          } else {
              nextEl.focus();
          }
      }

      event.preventDefault();
      // this.addRowOnClick();
    }
  }

  public addRowOnClick(fromInput){
    this.column = undefined;
    if(fromInput == "quantity" || fromInput == "pricePerUnit" || fromInput == "percentage")
      this.updateTotalOnBlur()

    if(fromInput == "total"){
      const total = sanitizeNumber(this.article.get('total').value);
      this.article.get('total').patchValue(total.toFixed(2).toString().replace('.',','));
      this.updateQuantityOrPrice()
    } else if(fromInput == "percentage"){
      const percentage = sanitizeNumber(this.article.get('percentage').value);
      this.article.get('percentage').patchValue(percentage.toFixed(2).toString().replace('.',','));
    }
    // this.updateQuantityOrPrice()
    if (this.index < this.articles.length - 1) return;
    this.addRow.emit(this.articles.length);
  }

  public loading = false;
  removeRow() {
    this.onConfirmationModal().then(async (res)=>{
      if (res) {
        const id = this.getId();
        if (id == -1) {
          this.emitFilterArticle();
        } else {
          try {
            this.toggleLoading();
            await this.service.removeArticle(id);
            this.emitFilterArticle();
            this.deleteSuccess();
            this.toggleLoading();
          } catch (e) {
            this.deleteError();
            this.toggleLoading();
          }
        }
      }
    })
  }

  toggleLoading() {
    this.loading = !this.loading;
  }

  deleteSuccess() {
    this.toastr.success(this.translateText('OFFER_ARTICLE_REMOVED_SUCCESS'), this.translateText("Success"));
  }

  deleteError() {
    this.toastr.error(this.translateText('OFFER_ARTICLE_REMOVE_ERROR'), this.translateText("Error"));
  }

  translateText(text) {
    return this.translate.instant(text);
  }

  emitFilterArticle() {
    this.filterArticle.emit(this.index);
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "mat-dialog-confirmation";
      this.dialog.open(ConfirmationModalComponent, dialogConfig).afterClosed()
        .subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  public modal = false;
  toggleModal() {
    this.modal = !this.modal;
  }

  closeModal() {
    this.modal = false;
  }

  addRowByIndex(index) {
    this.modal = false;
    this.addRow.emit(index);
  }

  setFontWeight(fontWeight) {
    this.article.get('fontWeight').patchValue(fontWeight);
    this.getFontWeight();
    this.toggleModal();
  }

  ngOnDestroy(): void{
    removeEventListener("paste", this.toPasteFun)
  }
}
