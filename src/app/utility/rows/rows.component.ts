import { Component, OnInit, Input, HostBinding, Output, EventEmitter} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Com, NameCom } from "src/app/utility/comment-section/com";
import { LineInterface } from './row-line/interfaces';
import { pushEmptyArticlesToLines } from './utils';
import { MaterialsService } from "src/app/core/services/materials.service";
import {
  LinesServiceInterface
} from './interfaces';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-rows",
  templateUrl: "./rows.component.html",
  styleUrls: ["./rows.component.css"],
})
export class RowsComponent implements OnInit {
  icon: boolean = false;
  fontfamilys: any;
  defaultfont: string;
  fWeight: boolean = false;
  name = "Angular 6";
  htmlContent = "";
  textAlign: any;
  defaultAlign: string;
  sparaShow: boolean = false;
  spinner: boolean = false;
  commentsData: any;
  rows: any = [];
  comInfo: Com = new Com();
  @HostBinding('attr.tabindex') tabindex = '0';

  infoStatus = false;
  addedRows: any;
  buttonDisabled: boolean = true;
  color: any = '#858585';

  getName: any = [];
  nameModel: NameCom = new NameCom();
  nameee: any;

  @Input('service') service:LinesServiceInterface;
  @Input('id') id;
  @Input('type') type;

  @Output() dataListener: EventEmitter<any> = new EventEmitter();
  @Output() emitSaveRows: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private materialsService: MaterialsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getUnits();
    this.getLines();
  }

  public loading = false;
  public lines: LineInterface[] = [];
  getLines() {
    this.toggleLoading();
    this.service.getLines(this.id).then(res => {
      this.lines = pushEmptyArticlesToLines(res.data)
    }).then(()=>{
      this.initLineForm();
      this.toggleLoading();
      this.emitLines();
    });
  }

  toggleLoading() {
    this.loading = !this.loading;
  }

  public lineForm: FormGroup | any = this.fb.group({});
  public linesArray = [];
  initLineForm() {
    this.lineForm = this.fb.group({
      lines: this.fb.array(this.generateLinesForm())
    });
    this.linesArray = this.lineForm.get('lines').controls;
  }
  generateLinesForm() {
    return this.lines.map((line)=>{
      return this.generateLineGroup(line);
    });
  }
  generateLineGroup(line) {
    return this.fb.group({
      id: [ line.id ],
      title: [ line.title ],
      offerId: [ line.offerId ],
      articles: this.fb.array(this.generateLineArticlesForm(line.articles))
    });
  }
  generateLineArticlesForm(articles) {
    return articles.map((article)=>{
      return this.fb.group({
        id: [ article.id ],
        article: [ article.article ],
        description: [ article.description ],
        quantity: [ article.quantity ],
        unit: [ article.unit ],
        pricePerUnit: [ article.pricePerUnit ],
        percentage: [ article.percentage ],
        fontWeight: [ article.fontWeight ],
        total: [ article.total ],
        orderIndex: [ article.orderIndex ]
      })
    });
  }
  resetLineForm() {
    this.lineForm = this.fb.group({});
  }

  public units = [];
  getUnits() {
    this.materialsService
      .getUnitsSortedByArticleType().toPromise2().then((res)=>{
        this.units = res.Material;
      });
  }

  iconRotate() {
    this.icon = !this.icon;
    this.toggleSpara();
  }

  toggleSpara() {
    this.sparaShow = !this.sparaShow;
  }

  takeAction(info: any) {
    if(info.comment != null ||(info.images == undefined) || (info.images && info.images.length > 0)){
      this.buttonDisabled = false;
      this.color = '#FF7000'
    }else{
      this.buttonDisabled = true;
      this.color = '#858585'
    }
  }

  async saveForm() {

    if (this.saveDisabled) return;
    if (this.loading) return;

    const data = this.lineForm.value;
    let lines = data.lines;
    this.toggleLoading();

    try {

      lines.forEach((line) => {
        line.articles.forEach((article) => {
          article.pricePerUnit = article.pricePerUnit.replace(" ","").replace(/[\u{0080}-\u{FFFF}]/gu,"").replace(",",".");
          article.total = article.total.replace(" ","").replace(/[\u{0080}-\u{FFFF}]/gu,"").replace(",",".");
          article.quantity = article.quantity.replace(" ","").replace(/[\u{0080}-\u{FFFF}]/gu,"").replace(",",".");
          article.percentage = article.percentage.replace(" ","").replace(/[\u{0080}-\u{FFFF}]/gu,"").replace(",",".");
        })
      })

      const res = await this.service.saveLines(lines);
      this.lines = res.data;
      this.resetLineForm();
      this.initLineForm();
      this.toggleLoading();
      this.disableSave();
      this.saveSuccess();
      this.emitLines()
      this.emitSaveRows.emit(true);

    } catch (e) {
      this.saveError();
    }

  }

  saveSuccess() {
    this.toastr.success(this.translateText('OFFER_LINES_SAVED'), this.translateText("Success"));
  }

  saveError() {
    this.toastr.error(this.translateText('OFFER_LINES_SAVED_ERROR'), this.translateText("Error"));
  }

  translateText(text) {
    return this.translate.instant(text);
  }

  public newLineModalOpen = false;
  toggleNewLineModal() {
    this.newLineModalOpen = !this.newLineModalOpen;
  }

  addLine(title) {
    const lineArray = [{
      title: title,
      id: -1,
      offerId: this.id,
      articles: []
    }];
    const [ line ] = pushEmptyArticlesToLines(lineArray, 2);
    const lineFormgroup = this.generateLineGroup(line);
    this.lineForm.get('lines').insert(this.linesArray.length, lineFormgroup);
    this.toggleNewLineModal();
    this.setSaveEnabled();
  }

  deleteRow(info) {

    const { index } = info;
    this.removeLineAtIndex(index);
  }

  removeLineAtIndex(index) {
    this.lineForm.get('lines').removeAt(index);
  }

  public saveDisabled = true;
  public saveStyle:any = {
    borderColor: 'grey',
    color: 'grey',
    opacity: 0.5
  };
  setSaveEnabled() {
    this.saveDisabled = false;
    this.saveStyle = {};
    // this.emitLines();
  }
  disableSave() {
    this.saveDisabled = true;
    this.saveStyle = {
      borderColor: 'grey',
      color: 'grey',
      opacity: 0.5
    };
  }

  emitLines() {
    this.dataListener.emit({ data: this.lines, content_type: 'lines' });
  }
}
