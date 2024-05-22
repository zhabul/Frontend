import { Component, OnInit } from "@angular/core";
import { SupportService } from "src/app/core/services/support.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
    selector: "app-support-tasks",
    templateUrl: "./support-tasks.component.html",
    styleUrls: ["./support-tasks.component.css"],
})
export class SupportTasksComponent implements OnInit {
    public selectedTab = 1;
    public tasks = [];
    public spinner = false;
    public showPdf = false;
    public currentAttachmentPdf = null;
    public currentAttachmentImage = null;
    public showAttachmentImage = false;
    public wrapper: any;
    public viewer: any;
    public rotateValue: number = 0;
    public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
    swiper = {
        images: [],
        active: -1,
        album: -2,
    };

    constructor(
        private supportService: SupportService,
        private dialog: MatDialog,
        public sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.getAllSupportRequests();
    }

    getAllSupportRequests() {
        let allTasks = [];
        this.spinner = true;
        this.tasks = [];
        this.supportService.getSupportRequests().subscribe((supportTasks) => {
            if(supportTasks && supportTasks["data"]) {
                allTasks = supportTasks["data"];
                let versions = Object.entries(allTasks);
                versions.forEach((version) => {
                    this.tasks.push(version);
                });
                this.spinner = false;
                this.tasks.sort((a, b) => (a[0] < b[0] ? 1 : -1));
            }else {
                this.spinner = false;
            }
        });
    }

    toggleSolveBtn(id) {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe((response) => {
                if (response.result) {
                    this.supportService.deleteSupportRequest(id).subscribe(_ => { this.getAllSupportRequests(); });
                    /*this.supportService.setRequestDone(id).subscribe(() => {
                        this.getAllSupportRequests();
                    });*/
                }
            });
    }
    changeSelectedTab(index) {
        this.selectedTab = index;
    }

    getInitials(user) {
        let initials = user;
        if (user == "zlatko@cmax.se") {
            initials = "Z.L.";
        }
        if (user == "tommie@cmax.se") {
            initials = "T.A.";
        }
        if (user == "gordana@cmax.se") {
            initials = "G.L.";
        }
        if (user == "tiho@cmax.se") {
            initials = "T.V.";
        }
        if (user == "daniel@cmax.se") {
            initials = "D.S.";
        }
        return initials;
    }
    openImageModal(image) {
        let formatPath = image.slice(-3);
        if (formatPath == "pdf") {
            this.showPdf = true;
            this.currentAttachmentPdf =
                this.sanitizer.bypassSecurityTrustResourceUrl(image);
        } else {
            this.currentAttachmentImage = image;
            this.showPdf = false;
        }

        this.toggleAttachmentImage();
    }

    toggleAttachmentImage(e = null) {
        if (e) {
            if (e.target.id !== "looksLikeModal") {
                return;
            }
        }
        this.showAttachmentImage = !this.showAttachmentImage;
    }
    rotateRight() {
        this.rotateValue = this.rotateValue + 90;
        let d = document.getElementsByClassName(
            "iv-large-image"
        )[0] as unknown as HTMLElement;
        d.style.transform = "rotate(" + this.rotateValue + "deg)";
        let x = document.getElementsByClassName(
            "iv-snap-image"
        )[0] as unknown as HTMLElement;
        x.style.transform = "rotate(" + this.rotateValue + "deg)";
        let c = document.getElementsByClassName(
            "iv-snap-handle"
        )[0] as unknown as HTMLElement;
        c.style.transform = "rotate(" + this.rotateValue + "deg)";
    }

    rotateLeft() {
        this.rotateValue = this.rotateValue - 90;
        let d = document.getElementsByClassName(
            "iv-large-image"
        )[0] as unknown as HTMLElement;
        d.style.transform = "rotate(" + this.rotateValue + "deg)";
        let x = document.getElementsByClassName(
            "iv-snap-image"
        )[0] as unknown as HTMLElement;
        x.style.transform = "rotate(" + this.rotateValue + "deg)";
        let c = document.getElementsByClassName(
            "iv-snap-handle"
        )[0] as unknown as HTMLElement;
        c.style.transform = "rotate(" + this.rotateValue + "deg)";
    }

    get getUnsolvedTasks() {
        return this.tasks.filter((task) => task[1].some((t) => t.solved === "0"));
    }

    get getSolvedTasks() {
        return this.tasks.filter((task) => task[1].some((t) => t.solved === "1"));
    }

    openSwiper(index, images, album) {
        this.swiper = {
            active: 0,
            images: images,
            album: 0,
        };
    }

    closeSwiper() {
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
        };
    }

    removeSwiperImage(event) { }
}
