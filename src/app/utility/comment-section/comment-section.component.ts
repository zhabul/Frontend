import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
  HostBinding,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { Com, NameCom } from "./com";

@Component({
  selector: "app-comment-section",
  templateUrl: "./comment-section.component.html",
  styleUrls: ["./comment-section.component.css"],
})
export class CommentSectionComponent implements OnInit {
  icon: boolean = false;
  fontfamilys: any;
  defaultfont: string;
  fWeight: boolean = false;
  name = "Angular 6";
  htmlContent = "";
  commentForm: FormGroup;
  textAlign: any;
  defaultAlign: string;
  sparaShow: boolean = false;
  spinner: boolean = false;
  commentsData: any;
  rows: any = [];

  comInfo: Com = new Com();
  @HostBinding("attr.tabindex") tabindex = "0";
  @HostListener("blur", ["$event.target"]) onBlur(info) {
    this.informParent.emit(this.buttonDisabled);
  }
  @Input("parentId") parentId;
  @Input("content_type") content_type;
  @Input("status") status;
  @Input("project") project;
  @Input("canAttachFiles") canAttachFiles = true;
  @Input("saveComment") set saveComment(value) {
    if (value == 0) {
      return;
    }
    this.postAllComments();
  }
  @Input() disabled;
  @Input('visibility') set setVisibility(value){
    if(value == false){
      this.visibility = value;
    }
  }
  public visibility: boolean = true;
  infoStatus = true;
  @Output() commentGet: EventEmitter<any> = new EventEmitter();

  getName: any = [];
  nameModel: NameCom = new NameCom();
  nameForm: FormGroup;
  nameee: any;
  opacity = 0;
  display = "none";
  translateY = "150px";
  addedRows: any;
  background = "rgb(128 128 128 / 50%)";
  buttonDisabled: boolean = true;
  color: any = '#858585';

  public searchQuery = '';
  clearSearchText(){
    this.searchQuery = "";
    this.filterCommentsBySearchValue();
  }

  @Output() informParent: EventEmitter<any> = new EventEmitter();
  @Output() dataListener: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private http: PaymentPlanService) {}

  getK() {
    this.commentGet.emit(this.rows);
  }

  ngOnInit() {

    this.getCom();
    this.nameForm = this.fb.group({
      content_type: [""],
      content_id: [""],
      comment: [""],
      isDeleted: [""],
      name: ["", [Validators.required,Validators.nullValidator]],
    });
    this.commentForm = this.fb.group({
      body: [""],
      name: [""],
    });

    this.defaultAlign = "right";
    this.textAlign = [];
    this.textAlign.push({ title: "Align Left", value: "left" });
    this.textAlign.push({ title: "Align Center", value: "center" });
    this.textAlign.push({ title: "Align Right", value: "right" });
  }

  iconRotate() {
    this.icon = !this.icon;
    this.toggleSpara();
  }

  onChange(fon) {
    this.defaultfont = fon;
  }

  changeAlignment(ali) {
    this.textAlign = ali;
  }

  boldTrue() {
    this.fWeight = !this.fWeight;
  }

  toggleSpara() {
    this.sparaShow = !this.sparaShow;
  }

  postTheName() {
    this.nameModel.name = this.nameForm.value.name;
    this.nameModel.content_type = this.nameForm.value.comment;
    this.nameModel.content_id = this.nameForm.value.content_id;
    this.nameModel.comment = this.nameForm.value.comment;
    this.nameModel.isDeleted = this.nameForm.value.isDeleted;

    this.http.postName(this.nameModel).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
  }

  onAddComment() {
    if(!this.nameForm.valid)
      return;
    const name = this.nameForm.value.name;

    this.spinner = true;
    this.rows.push({
      comment: "",
      content_id: this.parentId,
      content_type: this.content_type,
      isDeleted: "0",
      pdfs: [],
      images: [],
      files: [],
      name: name,
    });
    this.spinner = false;
    this.setOpacity();

    setTimeout(() => {
      this.nameForm.reset();
    }, 1500);
  }

  public allRows = [];
  //GET Comments
  getCom() {
    this.spinner = true;
    this.http
      .getTheComments(this.parentId, this.content_type)
      .subscribe((res) => {
        const rows = res['data'];
        this.rows = rows.slice(0);
        this.allRows = rows.slice(0);
        this.addedRows = rows.slice(0);
        this.filterCommentsBySearchValue();
        this.spinner = false;
        this.getK();
        this.emitRows();
      });
  }

  filterCommentsBySearchValue() {
    this.rows = this.allRows.filter((row)=>{
      return row.name.toLowerCase().includes(this.searchQuery);
    });
  }

  //Delete comment
  deleteCom(info: any, index) {

    if (info.id == undefined) {
      this.rows = this.rows.filter((a, i) => {
        return i != index;
      });
    } else {
      this.spinner = true;
      this.http.deleteComment(info.id).subscribe((res) => {
        if (res) {
          this.rows = this.rows.filter((a, i) => {
            this.spinner = false;
            return i != index;
          });
        }
      });
    }
  }

  public newComments = {};

  //Post comment
  postCom(info: any) {
    this.spinner = true;

    this.rows[info.index].comment = info.comment;
    this.rows[info.index].name = info.name;
    this.spinner = false;
    this.buttonDisabled = true;
    this.color = '#858585';
    this.emitRows();

  }

  emitRows() {
    this.dataListener.emit({ data: this.rows, content_type: this.content_type });
  }

  postAllComments() {
    this.spinner = true;
    this.rows.forEach((info, index) => {
      this.http.postComment(info).subscribe((res) => {
        this.addedRows = res["data"];
        this.buttonDisabled = true;
        this.spinner = false;
        this.color = "#858585";
        this.getCom();
        this.informParent.emit(this.buttonDisabled);
      });
    });
  }

  setOpacity() {
    this.display = this.opacity == 0 ? "block" : "none";
    setTimeout(() => {
      this.opacity = this.opacity == 1 ? 0 : 1;
      this.translateY = this.opacity == 1 ? "0px" : "150px";
      this.background = this.opacity == 1 ? "rgb(128 128 128 / 50%)" : "none";
    }, 0);
  }

  takeAction(info: any) {

    if (info.comment != null || (info.images == undefined) || (info.images && info.images.length > 0)) {
      this.buttonDisabled = false;
      this.color = "#FF7000";
    } else {
      this.buttonDisabled = true;
      this.color = "#858585";
    }
    this.informParent.emit(this.buttonDisabled);
  }
}
