import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { EmailInfo } from "./email-info";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-payment-plan-email",
  templateUrl: "./payment-plan-email.component.html",
  styleUrls: ["./payment-plan-email.component.css"],
})
export class PaymentPlanEmailComponent implements OnInit {
  project: any;
  userData: any = [];
  selectedPaymentPlan = 0;
  errorModal: boolean = false;
  fEmail: FormGroup;
  info: EmailInfo = new EmailInfo();
  email: any;
  emailData: any;
  today: any;
  CurrentDate: any;
  spinner = false;
  month: any;
  day: any;
  public emailLogId = -1;

  dueDate = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: PaymentPlanService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.data["email"]["data"];

    if (!this.email) {
      this.router.navigate(["/external/response/fail"]);
      this.spinner = false;
    }

    this.userData = this.email.paymentplan;

    this.emailLogId = Number(this.email.emailLogId);

    this.generateTranslatedDueDate();

    this.project = this.email.project;
    this.today = new Date();
    this.month = "" + (this.today.getMonth() + 1);
    this.day = "" + this.today.getDate();
    if (this.month.length < 2) this.month = "0" + this.month;
    if (this.day.length < 2) this.day = "0" + this.day;
    this.CurrentDate =
      this.today.getFullYear() + "-" + this.month + "-" + this.day;

    this.fEmail = this.fb.group({
      clientComment: [""],
      confirmStatus: [""],
    });
  }

  generateTranslatedDueDate() {

    this.dueDate = this.userData[this.selectedPaymentPlan].dueDate.replace('Week', this.translate.instant('Week'));
  }

  //Project name
  getName() {
    this.http
      .getNameOfProject(this.route.snapshot.params["id"])
      .subscribe((res: any) => {
        return (this.project = res);
      });
  }

  //Get details
  getDetails() {
    this.http
      .getProjectData(this.route.snapshot.params["id"])
      .subscribe((res: any) => {
        if (res.status) {
          this.userData = res.data;
        }
      });
  }

  //Post statuses
  postStatus(status) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().toPromise().then((response)=>{

      if (response.result) {

          this.spinner = true;
          const data = {
            paymentplan: this.email.paymentplan,
            token: this.email.token,
            email: decodeURIComponent(this.email.email),
            CwId: this.email.CwId,
            group: this.email.group,
            status: status == "Accepted" ? 2 : status == "Declined" ? 3 : 0,
            comment: this.fEmail.get('clientComment').value,
            mainContact: this.email.client_workerEmail,
            isMainContact: this.email.CwId == this.email.client_workerEmail.Id,
            reminder: this.email.reminder,
            emailLogId: this.emailLogId,
            projectId: this.project.id
          };
          data.paymentplan[0]["projectID"] = this.project.id;
          data.paymentplan[0]["clientComment"] = data.comment;
          data.paymentplan[0]["confirmStatus"] = data.status;
          data.paymentplan[0]["answerEmail"] = data.email;
          data.paymentplan[0]["projectCustomName"] = this.project.CustomName + '-' + this.project.name;

          if (status === "Declined" && data.comment === "") {
            this.errorModal = true;
            this.spinner = false;
            this.toastr.error(this.translate.instant('Please provide a comment.'), this.translate.instant('Error'));
            return;
          }

          this.errorModal = false;
          this.http.postEmail(data).subscribe({
            next: (res) => {
              if (res["status"]) {
                this.router.navigate(["/external/response/success"]);
                this.spinner = false;
              } else {
                this.router.navigate(["/external/response/fail"]);
                this.spinner = false;
              }
            },
            error: () => {
              this.router.navigate(["/external/response/fail"]);
              this.spinner = false;
            },
          });
      }
    });
  }
}
