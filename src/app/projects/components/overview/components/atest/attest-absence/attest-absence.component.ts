import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

interface IAbsence {
  Answer: string;
  Approved: string | number;
  Comment: string;
  EndDate: string;
  StartDate: string;
  Name: string;
  Lastame: string;
  Surname: string;
  UserAbsenceID: string | number;
  UserHasSeen: string | number;
  UserID: string | number;
  created_at: string;
  isAnswered: string | number;
  isPublicHoliday: string | number;
  isRejected: string | number;
  attested?: boolean;
  waiting?: boolean;
}

interface IAbsenceData {
  string: IAbsence[];
}

interface IRes {
  data: IAbsence[];
  status: boolean;
}

interface IAbsencesObject {
  string: string[];
}

export interface IAttestedAbsence {
  UserAbsenceID: string | number;
  userId: string | number;
}

@Component({
  selector: "app-attest-absence",
  templateUrl: "./attest-absence.component.html",
  styleUrls: ["./attest-absence.component.css", "../atest.component.css"],
})
export class AttestAbsenceComponent implements OnInit {
  @Input("userId") userId;
  @Input("projectId") projectId;
  @Input("attestedAbsencesSubject") attestedAbsencesSubject;
  @Input() allowEdit;
  @Output() addAbsencesEvent = new EventEmitter<IAttestedAbsence[]>();
  @Output() removeAbsencesEvent = new EventEmitter<IAttestedAbsence[]>();
  @Output() userAbsenceExist = new EventEmitter<any>();
  users: IAbsence[] = [];
  absences: IAbsencesObject | any = {};
  absenceData: IAbsenceData | any = {};

  selectOpen = true;

  checkAll = false;

  attestedAbsencesSub: Subscription;

  constructor(
    private timeRegistrationService: TimeRegistrationService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getAllNonApprovedAbsences().subscribe((res: any) =>
       this.createUserAndAbsence(res)
    );
    this.attestedAbsencesSub = this.attestedAbsencesSubject.subscribe(
      this.filterAttestedAbsences.bind(this)
    );
  }

  ngOnDestroy() {
    if (this.attestedAbsencesSub) {
      this.attestedAbsencesSub.unsubscribe();
    }
  }



  checkedRevert(absence){

    absence.checked = !absence.checked;

  }

  toggleselectOpen() {
    this.selectOpen = !this.selectOpen;
  }

  getAllNonApprovedAbsences() {
    return this.timeRegistrationService.getAllNonApprovedAbsences(
      this.userId,
      this.projectId
    );
  }

  createUserAndAbsence(res: IRes) {
    if (res.status === true) {
      const data:IAbsence[] = res.data;
      this.users = data;

      this.userAbsenceExist.emit(this.users);
    }
  }

  attestAbsence(event: any, user: IAbsence) {
    event.stopPropagation();
    const checked = event.target.checked;
    user.attested = checked;
    if (checked) {
      this.addAbsences([
        { UserAbsenceID: user.UserAbsenceID, userId: user.UserID },
      ]);
    } else {
      this.removeAbsences([
        { UserAbsenceID: user.UserAbsenceID, userId: user.UserID },
      ]);
    }
  }

  attestAll(event: any, userId: string) {
    event.stopPropagation();
    this.checkAll = event.target.checked
    const absences = this.absences[userId];
    const checked = event.target.checked;
    const addedAbsences = [];
    const removedAbsences = [];
    absences.forEach((abs: string) => {
      const absenceData = this.absenceData[abs];
      absenceData.attested = checked;
      if (checked) {
        this.checkAll == true;
        addedAbsences.push({
          checkAll: true,
          UserAbsenceID: absenceData.UserAbsenceID,
          userId: userId,
        });
      } else {
        this.checkAll == false;
        removedAbsences.push({
          checkAll: false,
          UserAbsenceID: absenceData.UserAbsenceID,
          userId: userId,
        });
      }
    });

    if (addedAbsences.length > 0) {
      this.addAbsences(addedAbsences);
    }
    if (removedAbsences.length > 0) {
      this.removeAbsences(removedAbsences);
    }
  }

  addAbsences(absences: IAttestedAbsence[]) {
    this.addAbsencesEvent.emit(absences);
  }

  removeAbsences(absences: IAttestedAbsence[]) {
    if(!this.allowEdit) {
      return;
    }
    this.removeAbsencesEvent.emit(absences);
  }

  filterAttestedAbsences(attestedAbsences: string[]) {
    this.users = this.users.filter((user) => !attestedAbsences.some(UserAbsenceID => UserAbsenceID == user.UserAbsenceID));
  }

  removeAbsence(UserAbsenceID, UserID, index) {

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.data = { questionText: "Reject absence?" };
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.users[index].waiting = true;
          this.timeRegistrationService
            .rejectAbsenceWithAttestStatus(UserAbsenceID)
            .subscribe((response: any) => {

              if (response.status) {
                this.handleReject(UserAbsenceID);
              } else {
                this.users[index].waiting = false;
                this.toastr.error(
                  this.translate.instant("Something went wrong."),
                  this.translate.instant("Error")
                );
              }
            });
        }
      });
  }

  handleReject(
    UserAbsenceID: string
  ) {

    this.users = this.users.filter((us: IAbsence) => {
      return us.UserAbsenceID !== UserAbsenceID;
    });
    this.toastr.success(
      this.translate.instant("You have successfully deleted moment!"),
      this.translate.instant("Success")
    );
  }
}
