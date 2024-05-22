import { Component, OnInit, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MomentsService } from "src/app/core/services/moments.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NewDefaultMomentsComponent } from "src/app/moments/components/new-default-moments/new-default-moments.component";
import { EditDefaultMomentsComponent } from "../edit-default-moments/edit-default-moments.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ViewEncapsulation } from "@angular/core";
import { GeneralsService } from "src/app/core/services/generals.service";
@Component({
  selector: "app-default-moments",
  templateUrl: "./default-moments.component.html",
  styleUrls: ["./default-moments.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DefaultMomentsComponent implements OnInit {
  @Input() moments: any[];
  @Input() generals:any[];
  number_of_parent: number = 0;
  child_sort: number = 0;
  index: any;
  temp: number;
  public check_default_moments:boolean = false;

  constructor(
    private toastr: ToastrService,
    private momentsService: MomentsService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private generalsService: GeneralsService,
  ) {}

  ngOnInit() {
    this.number_of_parent = this.moments["number_of_parent"];

    let data = {
      key: "Default moment",
    };


    this.generalsService.getSingleGeneralByKey(data).subscribe((res) => {
        if (res["status"]) {

            this.check_default_moments = res['data'][0]['value'];

            if(res['data'][0]['value'] == 1)
                this.check_default_moments = true;
            else
                this.check_default_moments
       }
    });
  }

    onchangeValue() {

        this.check_default_moments = !this.check_default_moments;
        this.generalsService.updateMometStatus(this.check_default_moments);
    }

  openModal(
    type,
    id: number,
    sort,
    childrens_lenght,
    parent_index,
    parent_moment_number
  ) {
    if (parent_index != null) {
      if (childrens_lenght != 0) {
        this.child_sort =
          this.moments["data"][parent_index].childrens.slice(-1)[0].sort;
      }
    }
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.panelClass = "custom-dialog-container";
    diaolgConfig.data = {
      type: type,
      parent: id,
      sort: sort,
      number_of_parent: this.number_of_parent,
      childrens_lenght: childrens_lenght,
      parent_moment_number: parent_moment_number,
      child_sort: this.child_sort,
    };

    this.dialog
      .open(NewDefaultMomentsComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.parent !== 0) {
            this.moments["data"][parent_index].childrens.push(response);
          } else {
            response.childrens = [];
            this.moments["data"].push(response);
            this.number_of_parent += 1;
          }
        }
      });
  }

  openEditModal(moment, parent_index, children_index) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.panelClass = "custom-dialog-container";
    diaolgConfig.data = {
      moment: moment,
    };

    this.dialog
      .open(EditDefaultMomentsComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          if (children_index == null) {
            response.childrens = this.moments["data"][parent_index].childrens;
            this.moments["data"][parent_index] = response;
          } else {
            this.moments["data"][parent_index].childrens[children_index] =
              response;
          }
        }
      });
  }

  openDeleteModal(moment, id, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "300px";
    dialogConfig.data = {
      questionText: this.translate.instant("Are you sure you want to delete?"),
    };
    dialogConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.deleteMoment(moment, id, i);
        }
      });
  }

  deleteMoment(moment, id, i) {
    if (moment.parent != 0) {
      this.index = this.moments["data"][i].childrens.findIndex(
        (m) => m.id == id
      );
    }

    this.momentsService.deleteDelfaultMoment(moment).subscribe((response) => {
      if (response["status"]) {
        this.toastr.success(
          this.translate.instant("You have successfully deleted moment."),
          this.translate.instant("Success")
        );
        if (moment.parent != 0) {
          this.moments["data"][i].childrens.splice(this.index, 1);
          this.moments["data"] = response["data"];
        } else {
          this.moments["data"].splice(i, 1);
          this.moments["data"] = response["data"];
          this.number_of_parent -= 1;
        }
      }
    });
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.moments["data"],
      event.previousIndex,
      event.currentIndex
    );

    this.moments["data"].forEach((moment, idx) => {
      moment.moment_number = idx + 1;
      moment.childrens.forEach((momentchild, idchild) => {
        let temp = idchild + 1;
        momentchild.moment_number = moment.moment_number + "." + temp;
      });
    });

    this.momentsService.sortDefaultMoments(this.moments["data"]);
  }

  onDropChild($momentnumber, $momentchildrens: any, event: CdkDragDrop<any[]>) {
    moveItemInArray($momentchildrens, event.previousIndex, event.currentIndex);

    $momentchildrens.forEach((momentchild, idchild) => {
      let temp = idchild + 1;
      momentchild.moment_number = $momentnumber + "." + temp;
    });

    this.momentsService.sortDefaultMoments(this.moments["data"]);
  }
}
