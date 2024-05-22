import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProjectsService } from "src/app/core/services/projects.service";
import { WeeklyReportsService } from "src/app/core/services/weekly-reports.service";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "src/app/core/services/users.service";
import { WeeklyReportInfoService } from 'src/app/projects/components/weekly-report-modify/weekly-report-info.service';
import { TranslateService } from "@ngx-translate/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-weekly-overview',
  templateUrl: './weekly-overview.component.html',
  styleUrls: ['./weekly-overview.component.css']
})
export class WeeklyOverviewComponent implements OnInit {

    public active_tab:number = 1;
    public statusObjectDUOverview: any = {
        all: false,
        "2": false,
        "1": false,
        "0": false,
        "5": false,
    };
    public reports: any[];
    public project;
    public showWeekyReports = true;
    public showDetails = false;
    public projectWeeklyReports: any[] = [];
    public sumAllTotallyWorkedUp: number = 0;
    public sumAllWorkedButNotApproved: number = 0;
    public sumAllApprovedForInvoice: number = 0;
    public sumAllInvoicedTotal: number = 0;
    public sumAllSentWr: number = 0;
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    public documentsImagesKeyList: any[] = [];
    public documentsImagesList: any = [];
    public swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    public comment:string = '';
    public offDiv:boolean = false;
    public document_type:string = '';
    public objData: any = {};
    public searchQuery = "";
    @Output() onWeekChange: EventEmitter<any> = new EventEmitter();
    @Input() weekly_report_names;

    constructor(
        private projectService: ProjectsService,
        private route: ActivatedRoute,
        private weeklyReportsService: WeeklyReportsService,
        private usersService: UsersService,
        private weeklyReportInfoService: WeeklyReportInfoService,
        private translate: TranslateService,
        private dialog: MatDialog,
        private toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.weeklyReportInfoService.setSpinner(true);
        this.project =  this.route.snapshot.data["project"];
        this.getAllProjectWeeklyReports();
        this.getImages();
        this.getUserPermissionTabs();
    }

    getAllProjectWeeklyReports() {
        this.projectService.getAllProjectWeekyReports(this.project.id).then((res) => {

            if (res["status"]) {
                    this.weeklyReportInfoService.setSpinner(false);
                    const weeks = Object.keys(res["data"]);
                this.projectWeeklyReports = weeks.map((week) => {
                    const report = res["data"][week];
                    this.sumAllTotallyWorkedUp += parseFloat(report["totallyWorkedUp"]);
                    this.sumAllWorkedButNotApproved += parseFloat(
                      report["workedButNotApproved"]
                    );
                    this.sumAllSentWr += parseFloat(report["total_sent"]);
                    this.sumAllApprovedForInvoice += parseFloat(
                      report["approvedForInvoice"]
                    );
                    this.sumAllInvoicedTotal += parseFloat(report["invoicedTotal"]);
                    return report;
                });
                this.projectWeeklyReports = Object.values(this.projectWeeklyReports);
            }
        });
    }

    getImages() {
        this.projectService.getProjectDocuments(this.project.id).then((response:any) => {
            if(response.status) {
                this.documentsImagesList = response['data'];
            }
        });
    }


    setActiveAta(arg) {
        this.active_tab = arg;
    }


    checkAll(status, type) {
        const keys = Object.keys(this.statusObjectDUOverview);

        keys.forEach((key) => {
            this.statusObjectDUOverview[key] = status;
            if (key !== "all") {
                this.createUserPermissionTabs(key, type, status);
            }
        });
    }


    get getFilteredProjectWeeklyReports() {
        return this.projectWeeklyReports.filter((weekly) => {
            return ["WrName"].some((property) => {
                return (
                    weekly[property].toLowerCase().includes(this.searchQuery.toLowerCase()) && this.statusObjectDUOverview[weekly["WrStatus"]]
                );
            });
        });
    }

    onStatusChangeExternal(value) {

        const type = "DUOverview";
        var status = !this.statusObjectDUOverview[value];

        if (value == "all") {
            this.checkAll(status, type);
        } else {
            if (!status) {
                this.statusObjectDUOverview["all"] = false;
            }
            this.statusObjectDUOverview[value] = status;
            this.createUserPermissionTabs(value, type, status);
        }
        this.handleAllStatus(type);
    }

    handleAllStatus(type) {
        const statusObject = this[`statusObject${type}`];
        const keys = Object.keys(statusObject);
        let flag = true;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!statusObject[key]) {
                flag = false;
                break;
            }
        }
        statusObject["all"] = flag;
    }

    createUserPermissionTabs(value, type, status) {
        this.objData = {
          user_id: this.userDetails.user_id,
          tab_name: value,
          type: type,
        };

        if (status) {
          this.usersService.createUserPermissionTabs(this.objData);
        } else {
          this.usersService.deleteUserPermissionTabs(this.objData);
        }
    }

    deleteUserPermissionTabs(value, type) {
        this.usersService.deleteUserPermissionTabs(this.objData);
    }

/*
    openSwiper(index, files, album) {

        if (files[index].document_type === "Image") {
            this.isPDFViewer = false;
            this.swiper = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
            };
        } else {

            const fileArray = this.createFileArray(files[index]);
            this.isPDFViewer = true;
            this.swiper = {
                active: 0,
                images: fileArray,
                album: album,
                index: index,
                parent: files[index],
            };
        }

        this.offDiv = true;
    }
*/
    openSwiper(index, files, album) {

        if (files[index].row_type !== "pdf" && files[index].row_type !== "Pdf") {
            this.swiper = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
            };
            this.document_type = 'image';
        } else {
            const imageArray = this.createFileArray(files[index]);

            this.swiper = {
                active: 0,
                images: imageArray,
                album: album,
                index: index,
                parent: files[index],
            };
            this.document_type = 'pdf';
        }

        this.offDiv = true;
    }

    closeSwiper() {
        this.swiper = {
            images: [],
            active: -1,
            album: -2,
            index: -1,
            parent: null,
        };
        this.offDiv = false;
    }

    createImageArray(image) {
        const id = image.id;
        const comment = image.Description;
        const name = image.Name ? image.Name : image.name;
        const image_path = image.image_path;
        const file_path = image.file_path;

        const imageArray = image_path.split(",").map((imageString) => {
            return {
                image_path: imageString,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
            };
        });
        return imageArray;
    }

    createFileArray(file) {
        const id = file.id;
        const comment = file.Description;
        const name = file.Name ? file.Name : file.name;
        //const image_path = file.image_path;
        const file_path = file.file_path;

        const fileArray = file_path.split(",").map((fileString) => {
            return {
                image_path: fileString,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
            };
        });
        return fileArray;
    }

    removeSwiperImage(event) {}

    downloadActive(data) {

        let url = '';
        if(data.file_path) {
            url = data.file_path;
        }else {
            url = data.image_path;
        }

        const link = document.createElement("a");
        link.setAttribute("download", 'download');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


    setColorByStatus(status) {
        let class_name = 'rowforunderpricing';

        if(status == 0) {
            class_name = 'rowforInitial';
        }

        if(status == 1) {
            class_name = 'rowforSent';
        }

        if(status == 2) {
            class_name = 'rowforAccepted';
        }

        if(status == 5) {
            class_name = 'rowforCompleted';
        }

        return class_name;
    }

    changeWeek(report) {
        const obj = {
            week: report.Week,
            year: report.Year,
            name: report.WrName
        };
        this.onWeekChange.emit(obj);
    }

    setComment(comment) {
        this.comment = comment;
    }
    setOrUpdateComment(event, wr_id) {

        const target = event.target;
        const comment = target.innerText;

        let obj = {
            'wr_id': wr_id,
            'comment': comment
        }
        if(this.comment == comment) {
            return;
        }

        this.comment = comment

        if(comment) {
            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.autoFocus = false;
            diaolgConfig.disableClose = true;
            diaolgConfig.width = "";
            diaolgConfig.data = {
                questionText: this.translate.instant("Do you want to save?"),
            };
            diaolgConfig.panelClass = "mat-dialog-confirmation";
            this.dialog
              .open(ConfirmationModalComponent, diaolgConfig)
              .afterClosed()
              .subscribe((response) => {
                if (response.result) {

                    this.weeklyReportsService.setOrUpdateComment(obj).then((res) => {
                        if (res["status"]) {
                                this.toastr.success(
                                this.translate.instant("TSC_You_have_successfully_updated_comment"),
                                this.translate.instant("Success")
                            );
                        }else {
                            this.toastr.error(this.translate.instant("Error"));
                        }
                    });
                }
            });
        }
    }

    getUserPermissionTabs() {

        this.usersService.getUserPermissionTabs().subscribe((res) => {

            if(res['data']) {
                const data = res["data"]["DUOverview"];
                const keys_data = data ? Object.keys(data) : [];
                keys_data.forEach((status) => {
                  this.statusObjectDUOverview[status] = true;
                });

                if (keys_data.length === 4) {
                  this.statusObjectDUOverview["all"] = true;
                }
            }
        });
    }

    checkedLengthRequirements($event){

        const target = $event.target;
        const maxLn = target.innerText.length
        if(maxLn >= 500)
        {
            target.innerText = target.innerText.slice(0, 500);
            $event.target.blur();
        }
    }

    clearSearchText(event) {
        event.preventDefault();
        (document.getElementById('searchInput') as HTMLInputElement).value = '';
    }

    get existString() {
        if (((document.getElementById('searchInput') as HTMLInputElement).value).length > 0)
            return true;
        else
            return false;
    }
}
