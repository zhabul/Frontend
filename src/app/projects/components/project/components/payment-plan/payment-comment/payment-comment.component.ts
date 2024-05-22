import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { Com, NameCom } from "./com";

@Component({
  selector: "app-payment-comment",
  templateUrl: "./payment-comment.component.html",
  styleUrls: ["./payment-comment.component.css"],
})
export class PaymentCommentComponent implements OnInit {
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
  @Input() selectedPaymentPlan;
  @Input() userData;
  infoStatus = false;
  @Output() commentGet: EventEmitter<any> = new EventEmitter();
  getName: any = [];
  nameModel: NameCom = new NameCom();
  nameForm: FormGroup;
  nameee: any;
  opacity = 0;
  display = 'none';
  translateY = '150px';
  addedRows: any;

  constructor(
    private fb: FormBuilder,
    private http: PaymentPlanService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

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
      name: ["", Validators.required],
    });
    this.commentForm = this.fb.group({
      body: [""],
      name: [""],
    });

    //Text align
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

  //Bold text
  boldTrue() {
    this.fWeight = !this.fWeight;
  }

  //COMMENT SECTION
  //Spara btn
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
    const name = this.nameForm.value.name;

    this.spinner = true;
    this.rows.push({
      comment: "",
      content_id: this.route.snapshot.params["id"],
      content_type: "paymentplan",
      isDeleted: "0",
      name: name,
    });
    this.spinner = false;
    this.setOpacity();

    setTimeout(() => {
      this.nameForm.reset();
    }, 1500);
  }

  getN() {
    this.http.getName(this.route.snapshot.params["id"]).subscribe((res) => {
      this.nameee = res;
    });
  }

  //GET Comments
  getCom() {
    this.spinner = true;
    this.http
      .getTheComments(this.route.snapshot.params["id"])
      .subscribe((res) => {
        this.rows = res['data'].slice(0);
        this.addedRows = res['data'].slice(0);
        this.spinner = false;
      });
  }

  //Delete comment
  deleteCom(info: any) {
    this.spinner = true;

    if (info.id == undefined) {
      this.rows = this.rows.filter((a, i) => {
        this.spinner = false;
        return i != info.index;
      });
    } else {
      this.http.deleteComment(info.id).subscribe((res) => {
        if (res) {
          this.rows = this.rows.filter((a, i) => {
            this.spinner = false;
            return i != info.index;
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
  }

  postAllComments() {
    this.spinner = true;
    this.rows.forEach((info, index) => {
      this.http.postComment(info).subscribe((res) => {
        this.addedRows = res['data'];
        this.getCom();
        this.spinner = false;
      });
    });
  }

  setOpacity() {
    this.display = this.opacity == 0 ? 'block' : 'none'
    setTimeout(()=>{
      this.opacity = this.opacity == 1 ? 0 : 1;
      this.translateY = this.opacity == 1 ? '0px' : '150px';
    }, 0);
  }

}
