import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-mileage-review",
  templateUrl: "./mileage-review.component.html",
  styleUrls: ["./mileage-review.component.css"],
})
export class MileageReviewComponent implements OnInit {
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
  public mileages: any[] = [];
  public language;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private timeRegistrationService: TimeRegistrationService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);

    this.mileages = this.route.snapshot.data["mileages"]["data"];
  }

  removeMileage(id, event, i) {
    event.stopPropagation();
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (!response.result) {
          this.timeRegistrationService.removeMileage(id).subscribe((res) => {
            if (res) {
              this.mileages.splice(i, 1);
              this.toastrService.success(
                this.translate.instant("Mileage successfully removed") + ".",
                this.translate.instant("Success")
              );
            }
          });
        }
      });
  }
}
