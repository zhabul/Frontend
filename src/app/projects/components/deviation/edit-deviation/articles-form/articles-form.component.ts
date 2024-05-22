import { Component, OnInit, Input } from '@angular/core';
import { RikiService } from '../riki.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { MaterialsService } from 'src/app/core/services/materials.service';
import { FortnoxApiService } from 'src/app/core/services/fortnoxApi.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';

// fetch konto

@Component({
  selector: 'app-articles-form',
  templateUrl: './articles-form.component.html',
  styleUrls: ['./articles-form.component.css']
})
export class ArticlesFormComponent implements OnInit {

  @Input('articlesMaterialProjectDeduct') set setArticlesMaterialProjectDeduct(value) {
    if (this.articlesMaterialProjectDeduct !== value) {
      this.articlesMaterialProjectDeduct = value;
    }
  };
  @Input('articlesOtherProjectDeduct') set setArticlesOtherProjectDeduct(value) {
    if (this.articlesOtherProjectDeduct !== value) {
      this.articlesOtherProjectDeduct = value;
    }
  };
  createForm: any;
  articlesMaterialProjectDeduct = 0;
  articlesOtherProjectDeduct = 0;
  materialProperties = [];
  enabledAccounts = [];
  emptyArticle = {
    id: '',
    Name: '',
    Quantity: '',
    Unit: '',
    Price: '',
    Deduct: '',
    Total: '',
    Account: '',
  };
  totalSum = '0.00';
  units: any;

  constructor(
              private fb: FormBuilder,
              private RikiService: RikiService,
              private materialsService: MaterialsService,
              private fortnoxApiService: FortnoxApiService,
              private dialog: MatDialog,

  ) { }



  ngOnInit() {

    this.materialsService.getAllMaterialProperties().subscribe((properties) => {
      this.materialProperties = properties;
    });
    this.fortnoxApiService.getAllEnabledAccounts().subscribe((accounts) => {
      this.enabledAccounts = accounts;
    });
    this.materialsService.getUnitsSortedByArticleType().subscribe((unit) => {

      const articles = this.RikiService.getArticles();
      const articlesAdditionalWork = articles.articlesAdditionalWork.map((article)=>{
        article.Quantity = this.timeStringToFloat(article.Quantity);
        return this.fb.group(article);
      });
      const articlesMaterial = articles.articlesMaterial.map((article)=>{
        return this.fb.group(article);
      });
      const articlesOther = articles.articlesOther.map((article)=>{
        return this.fb.group(article);
      });

      this.units = unit;
      this.createForm = this.fb.group({
        articlesAdditionalWork: this.fb.array(
          articlesAdditionalWork.concat([
            this.fb.group(this.addEmptyArticle("articlesAdditionalWork")),
            this.fb.group(this.addEmptyArticle("articlesAdditionalWork")),
          ])
        ),
        articlesMaterial: this.fb.array(
          articlesMaterial.concat([
            this.fb.group(this.addEmptyArticle("articlesMaterial")),
            this.fb.group(this.addEmptyArticle("articlesMaterial")),
          ])
        ),
        articlesOther: this.fb.array(
          articlesOther.concat([
            this.fb.group(this.addEmptyArticle("articlesOther")),
            this.fb.group(this.addEmptyArticle("articlesOther")),
          ])
        ),
      });
    });
  }

  toggleRikiModal() {

    const data = this.createForm.value;
    //data.articlesAdditionalWork = data.articlesAdditionalWork.filter(function (row) {
    //  return row.Name != "";
    //});

    data.articlesAdditionalWork = data.articlesAdditionalWork.map(function(article) {
      article.Price = Number(article.Price.toString().replace(',', '.'));
      return article;
    });

    //data.articlesMaterial = data.articlesMaterial.filter(function (row) {
    //  return row.Name != "";
    //});

    data.articlesMaterial = data.articlesMaterial.map(function(article) {
      article.Quantity = Number(article.Quantity.toString().replace(',', '.'));
      article.Price = Number(article.Price.toString().replace(',', '.'));
      return article;
    });

    //data.articlesOther = data.articlesOther.filter(function (row) {
    //  return row.Name != "";
    //});

    data.articlesOther = data.articlesOther.map(function(article) {
      article.Quantity = Number(article.Quantity.toString().replace(',', '.'));
      article.Price = Number(article.Price.toString().replace(',', '.'));
      return article;
    });

    this.RikiService.addArticles(data);
    this.RikiService.toggleRikiModal(false);
  }

  addEmptyArticle(table):any {
    let article = { ...this.emptyArticle };
    if (table == 'articlesAdditionalWork') {
      article.Deduct = article.Deduct;
    }
    else if (table == 'articlesMaterial') {
      article.Deduct = this.articlesMaterialProjectDeduct.toString();
    }
    else if (table == 'articlesOther') {
      article.Deduct = this.articlesOtherProjectDeduct.toString();
    }
    return article;
  }

  get articlesAdditionalWork() {
    return this.createForm.get('articlesAdditionalWork') as FormArray;
  }

  get articlesMaterial() {
    return this.createForm.get('articlesMaterial') as FormArray;
  }

  get articlesOther() {
    return this.createForm.get('articlesOther') as FormArray;
  }

  addRow(formGroup, table, index = -1) {
    let status = false;

    if(formGroup.value.length -1 == index) {
        status = true;
    }

    if (status) {
      formGroup.push(this.fb.group(this.addEmptyArticle(table)));
    }
  }

  updateTotal(i, formGroup, calcTime = false) {
    let total: any = '0';


    if (calcTime) {
      if (formGroup.controls[i].value.Quantity.includes(':')) {
        const hours = parseInt(formGroup.controls[i].value.Quantity.split(':')[0]);
        const minutes = parseInt(formGroup.controls[i].value.Quantity.split(':')[1]);

        const hoursTotal = hours * formGroup.controls[i].value.Price;
        const minutesTotal = (minutes / 60) * formGroup.controls[i].value.Price;

        total = ((hoursTotal + minutesTotal) * ((formGroup.controls[i].value.Deduct / 100) + 1)).toFixed(2);
      }
      else {

        const Price = Number(formGroup.controls[i].value.Price.toString().replace(',', '.'));
        const Quantity = Number(formGroup.controls[i].value.Quantity.toString().replace(',', '.'));
        const Deduct = Number(formGroup.controls[i].value.Deduct.toString().replace(',', '.'));

        total = (Quantity * Price *
          ((Deduct / 100) + 1)).toFixed(2);
      }
    } else {

      const Price = Number(formGroup.controls[i].value.Price.toString().replace(',', '.'));
      const Quantity = Number(formGroup.controls[i].value.Quantity.toString().replace(',', '.'));
      const Deduct = Number(formGroup.controls[i].value.Deduct.toString().replace(',', '.'));

      total = (Quantity * Price *
        ((Deduct / 100) + 1)).toFixed(2);
    }

    (<FormGroup>formGroup.controls[i]).controls['Total'].patchValue(total);
  }

  calcAllTotal(data) {
    let total = 0;
    data.forEach(data2 => {
      if (data2.length > 0) {
        data2.forEach(data3 => {
          let amount = data3.Total != '' ? data3.Total : 0;
          total += parseFloat(amount);
        });
      }
    });

    this.totalSum = total.toFixed(2);
    return this.totalSum;
  }

  removeRow(index, formGroup, table) {

    const diaolgConfig = new MatDialogConfig();
		diaolgConfig.autoFocus = false;
		diaolgConfig.disableClose = true;
		diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe((response)=>{
      if (response.result) {
        if (formGroup.controls[index].value.Name == '' && formGroup.value.filter(article => article.Name == '').length == 1) {
          return;
        }

        if (formGroup.controls.length > 1) {
          formGroup.controls.splice(index, 1);
          formGroup.value.splice(index, 1);
        } else {
          formGroup.controls[0].setValue(this.addEmptyArticle(table))
        }
      }
    });
  }

  timeStringToFloat(time) {
    const hoursMinutes = time.split(/[.:]/);
    const hours = parseInt(hoursMinutes[0], 10);
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  selected_article;
  moveToNextColumn(event: any) {
    if (event.target["dataset"] && event.target["dataset"].selected_article) {
      this.selected_article = event.target["dataset"].selected_article;
    }

    if(event.srcElement.localName == 'textarea') {
      return;
    }

    if (
      (event.keyCode === 13 && event.target["form"]) ||
      (event.keyCode === 9 && event.target["form"])
    ) {
      const form = event.target["form"];
      const index = Array.prototype.indexOf.call(form, event.target);
      const nextEl = form.elements[index + 1];
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
      if (this.selected_article == "additional-work") {
        this.addRow(this.articlesAdditionalWork, "articlesAdditionalWork");
      }
      if (this.selected_article == "article-material") {
        this.addRow(this.articlesMaterial, "articlesMaterial");
      }
      if (this.selected_article == "article-other") {
        this.addRow(this.articlesOther, "articlesOther");
      }
    }
  }

}
