import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { SettingsService } from "src/app/core/services/settings.service";
import { Moment } from "../../interfaces/moment";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
//import * as moment from "moment";

@Component({
  selector: "app-moments",
  templateUrl: "./moments.component.html",
  styleUrls: ["./moments.component.css"],
})
export class MomentsComponent implements OnInit {
  newName: string = "";
  newType = "1";
  moments: Moment[];
  loading = true;
  secondLoading = false;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.settingsService.getDefaultMoments().subscribe((res) => {
      this.moments = res.data.data;
      this.loading = false;
      this.prepareMoments();
      this.sortMomentsArr();
    });
  }

  editMoment(moment) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    moment.edit = !moment.edit;
  }

  saveMoment(moment, f: NgForm) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    if (f.value.name.length == 0) {
      this.toastr.info(this.translate.instant("Enter name"));
      return;
    }
    moment.name = f.value.name;
    moment.type = f.value.type;

    if (moment.id.length > 0) {
      this.secondLoading = true;
      this.settingsService.updateDefaultMoments(moment).subscribe({
        next: (response) => {
          if (response.status) {
            this.toastr.success(
              this.translate.instant("You have successfully updated Moment") +
                " " +
                moment.name
            );
            this.secondLoading = false;
          }
        },
        error: (err) => {
          this.toastr.error(this.translate.instant("Server error"));
        },
      });
    } else {
      this.addNewSubMoment(moment);
    }

    moment.edit = false;
  }

  removeMoment(moment) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.panelClass = "mat-dialog-confirmation";
    dialogConfig.data = {
      questionText: this.translate.instant(
        "Are you sure you want to delete this moment?"
      ),
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        this.secondLoading = true;
        if (response.result) {
          this.deleteMoment(moment);
        }
      });
  }

  toggleMoment(moment) {

    moment.toggle = !moment.toggle;
    moment.childrens.forEach((child) => {
      child.edit = false;
    });
  }


    addMoment() {

        if (!this.userDetails.create_settings_Global) {
            return;
        }
        if (this.newName.length > 0) {
            let momentNumber = this.getNewMomentNumber(this.moments);
            let momentSort = this.getNewMomentSortNumber(this.moments);
            let newMoment = {
                name: this.newName,
                type: this.newType,
                edit: false,
                toggle: false,
                childrens: [],
                moment_number: (++momentNumber).toString(),
                parent: "0",
                sort: (momentSort + 1).toString(),
            };

            this.secondLoading = true;
            this.settingsService.createDefaultMoment(newMoment).subscribe({
                next: (response) => {
                    if (response.status) {
                        this.toastr.success(
                            this.translate.instant("Moment") +
                            " " +
                            newMoment.name +
                            " " +
                            this.translate.instant("added")
                        );
                        this.moments = response.data.data;
                    }
                    this.newName = "";
                    this.newType = "1";
                    this.secondLoading = false;
                },
                error: (err) => {
                    this.toastr.error(this.translate.instant("Server error"));
                },
            });
        } else {
            this.toastr.info(this.translate.instant("Enter name"));
        }
    }

  addSubmoment(moment) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    moment.toggle = true;
    let momentNumber = this.getNewMomentNumber(moment.childrens);
    let momentSort = this.getNewMomentSortNumber(moment.childrens);
    const newSubMoment = {
      id: "",
      name: "",
      type: "1",
      edit: true,
      parent: moment.id,
      moment_number: momentNumber.toString(),
      sort: (momentSort + 0.1).toString(),
      childrens: [],
    };
    moment.childrens.push(newSubMoment);
  }

  prepareMoments() {
    this.moments.forEach((moment) => {
      moment.edit = false;
      moment.toggle = false;
      moment.childrens.forEach((subMoment) => {
        subMoment.edit = false;
      });
    });
  }

  getNewMomentNumber(moments: Moment[]) {
    let sortMoments: any = structuredClone(moments);
    let sort: number[] = [];
    sortMoments.forEach((m) => sort.push(+m.sort));
    if (sort.length > 0) {
      return Math.max(...sort);
    } else {
      return 0;
    }
  }

  getNewMomentSortNumber(moments: Moment[]) {
    let sortMoments: any = structuredClone(moments);
    let sortNumbers: number[] = [];
    sortMoments.forEach((m) => sortNumbers.push(+m.moment_number));
    if (sortNumbers.length > 0) {
      return Math.max(...sortNumbers);
    } else {
      return 0;
    }
  }

  deleteMoment(moment: Moment) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.settingsService.deleteDefaultMoment(moment).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("You have successfully deleted moment.")
          );
          this.moments = response.data.data;
        }
        this.secondLoading = false;
      },
    });
  }

  addNewSubMoment(moment: Moment) {
    if (!this.userDetails.create_settings_Global) {
      return;
    }
    this.secondLoading = true;
    this.settingsService.createDefaultMoment(moment).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success(
            this.translate.instant("Moment") +
              " " +
              moment.name +
              " " +
              this.translate.instant("added")
          );
          this.moments = response.data.data;
          this.secondLoading = false;
        }
        this.newName = "";
        this.newType = "1";
      },
      error: (err) => {
        this.toastr.error(this.translate.instant("Server error"));
      },
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.moments, event.previousIndex, event.currentIndex);
    this.changeOrder(this.moments)
  }

  dropchild(event: CdkDragDrop<string[]>,arr) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.changeOrder(arr);
  }

    changeOrder(moments){

        if(moments.length == 0 ) return;

        let type = moments[0]['parent'] == 0 ? 'parent' : 'chlidren';
        let moment_ids = [];
        moments.forEach((moment, index)=>{
            moment_ids.push(moment.id);
        //this.settingsService.updateSortOfDefaultMoments(moment).subscribe();
        });
        let data = {
            'moments_ids': moment_ids,
            'type': type,
            'parent': moments[0]['parent']
        }
        this.settingsService.updateSortOfDefaultMoments(data).subscribe();
    }

  sortMomentsArr(){
   this.moments.sort((a:any, b:any) => a.sort - b.sort);
   this.moments.forEach(moment=>{
       moment.childrens.sort((a:any, b:any) => a.sort - b.sort);
   })
  }
}