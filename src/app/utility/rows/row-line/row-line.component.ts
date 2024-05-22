import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { copyEmptyArticle } from '../utils';
import { Subject, debounceTime } from 'rxjs';
import { sanitizeNumber } from '../utils';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-row-line',
  templateUrl: './row-line.component.html',
  styleUrls: ['./row-line.component.css']
})
export class RowLineComponent implements OnInit, OnDestroy {

  @Input('line') line: any;
  @Input('index') index: number;
  @Input('units') units = [];
  @Input('properties') properties = [];
  @Input('type') type;
  @Input('service') service: any;

  @Output('deleteRow') deleteRow:EventEmitter<{ index: number }> = new EventEmitter();
  @Output('enableSave') enableSave:EventEmitter<boolean> = new EventEmitter();

  private _total$ = new Subject<number>();
  private total$ = this._total$.pipe(
    debounceTime(200)
  );

  public translateX = {};

  public title = '';
  public articles = [];
  public boundNextTotal;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.boundNextTotal = this.nextTotal.bind(this);
   }

  ngOnInit(): void {
    this.setTitleTranslateX();
    this.setTitle();
    this.setArticles();
    this.subToTotal();
    this.calculateArticlesTotals();
    this.setCanDelete();
  }

  ngOnDestroy() {
    this.unsubFromTotal();
  }

  public canDelete = false;
  setCanDelete() {
    if (this.type === 'offer' && this.index) {
      this.canDelete = true;
    }
  }

  public totalSub;
  subToTotal() {
    this.totalSub = this.total$.subscribe(()=>{
      this.calculateArticlesTotals();
    });
  }
  unsubFromTotal() {
    if (this.totalSub) {
      this.totalSub.unsubscribe();
    }
  }

  public total: number = 0;
  calculateArticlesTotals() {
    this.total = 0;
    this.articles.forEach((article)=>{
      const total = sanitizeNumber(article.value.total);
      this.total = this.total + total;
    });
  }

  nextTotal(total) {
    this._total$.next(total);
  }

  setTitle() {
    this.title = this.getTitle().value;
  }

  getTitle() {
    return this.line.get('title');
  }

  getId() {
    return this.line.get('id').value;
  }

  setArticles() {
    this.articles = this.getArticles().controls;
  }

  getArticles() {
    return this.line.get('articles');
  }

  public lineForm:FormGroup | any;

  setTitleTranslateX() {
    this.translateX = { transform: `translateX(${(this.index + 1)* 35}px)` }
  }

  filterArticle(index) {
    if (this.articles.length > 1) {
      const articlesForm = this.getArticles();
      articlesForm.removeAt(index);
    }
  }

  emptyFormGroupArticle() {
    return this.fb.group(copyEmptyArticle());
  }

  addRow(index) {
    this.insert(index, this.emptyFormGroupArticle());
  }

  insert(index, item) {
    const articlesForm = this.getArticles();
    articlesForm.insert(index, item);
    this.setArticles();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.articles, event.previousIndex, event.currentIndex);
    const articlesForm = this.getArticles();
    articlesForm.patchValue(this.articles);
    this.enableSave.emit(true);
  }

  public show = true;
  toggleShow() {
    this.show = !this.show;
  }

  public loading = false;
  confirmDeleteRow() {
    this.onConfirmationModal().then(async (res)=>{
      if (res) {
        const id = this.getId();
        if (id === -1) {
          this.emitDeleteRow();
        } else {
          try {
            await this.service.removeLines([id]);
            this.emitDeleteRow();
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
    this.toastr.success(this.translateText('OFFER_LINE_REMOVED'), this.translateText("Success"));
  }

  deleteError() {
    this.toastr.error(this.translateText('OFFER_LINE_REMOVED_ERROR'), this.translateText("Error"));
  }

  translateText(text) {
    return this.translate.instant(text);
  }

  emitDeleteRow() {
    this.deleteRow.emit({ index: this.index });
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

}
