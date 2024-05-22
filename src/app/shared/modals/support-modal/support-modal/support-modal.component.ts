import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { RemembererService } from "src/app/core/services/rememberer.service";
import { SupportService } from "src/app/core/services/support.service";
import { GeneralsService } from "src/app/core/services/generals.service";
import { interval, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpEventType } from "@angular/common/http";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

declare var $;

@Component({
    selector: "app-support-modal",
    templateUrl: "./support-modal.component.html",
    styleUrls: ["./support-modal.component.css"],
})
export class SupportModalComponent implements OnInit, AfterViewInit {
    public supportForm: FormGroup;
    public project: any;
    public currentTab: any;
    public currentBrowser = "Unknown";
    public priorityOptions = [];
    public urgencyOptions = [];
    public version = "2.3";
    public chooseFile = false;
    public uploadMessage = "";
    public files = [];
    public spinner = false;
    public disabledButton = true;
    private subscription: Subscription;
    public sending: boolean = false;

    supportSub: any;
    progress: number = 0;
    fileType = "image/*";

    public uploadImages = [];
    public uploadPdfs = [];

    swiper = {
        images: [],
        active: -1,
        album: -2,
    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private supportService: SupportService,
        private generalsService: GeneralsService,
        private remembererService: RemembererService,
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<SupportModalComponent>,
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
        private translate: TranslateService
    ) { }

    ngAfterViewInit(): void {
        this.hideMessage();
        const source = interval(500);
        if (environment.production) {
            this.subscription = source.subscribe((val) => {
                this.hideMessage();
            });
        }
    }

    hideMessage() {
        if ($(".tox-notifications-container").length > 0)
            $(".tox-notifications-container").css("display", "none");

        if ($(".tox-statusbar").length > 0)
            $(".tox-statusbar").css("display", "none");
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.supportSub) {
            this.supportSub.unsubscribe();
        }
    }

    ngOnInit() {
        for (let i = 1; i <= 10; i++) {
            this.priorityOptions.push(i);
            this.urgencyOptions.push(i);
        }
        let user = JSON.parse(sessionStorage.getItem("userDetails"));
        let initials =
            user["firstname"].split("")[0] +
            "." +
            user["lastname"].split("")[0] +
            ".";
        this.currentTab = this.remembererService.getState(
            this.router.url,
            "projectTab",
            0
        );
        let pmShow = this.remembererService.getState(
            this.router.url,
            "pmShow",
            false
        );
        this.supportForm = this.fb.group({
            text: ["", [Validators.required]],
            location: [this.router.url],
            tab: [this.currentTab],
            projectManagementOpen: [pmShow],
            browser: this.checkUserBrowser(),
            priority: [1, [Validators.required]],
            urgency: [1, [Validators.required]],
            version: ["2.3", [Validators.required]],
            user: initials,
        });
        this.generalsService.getGenerals().subscribe((res) => {
            this.version = res.find(x => x.key === 'Company_Version').value;

            this.version = this.version?.split(" ")[0];
            this.supportForm.controls.version.patchValue(this.version);
        });
        this.hideMessage();
    }

    checkUserBrowser() {
        let browser = window.navigator.userAgent;
        if ((browser.indexOf("Opera") || browser.indexOf("OPR")) != -1) {
            browser = "Opera";
        } else if (browser.indexOf("Chrome") != -1) {
            browser = "Chrome";
        } else if (browser.indexOf("Safari") != -1) {
            browser = "Safari";
        } else if (browser.indexOf("Firefox") != -1) {
            browser = "Firefox";
        } else if (browser.indexOf("MSIE") != -1) {
            browser = "Edge";
        } else {
            browser = "Unknown";
        }
        return browser;
    }

    send() {
        let data = this.supportForm.value;
        data.files = this.uploadImages;

        if (this.supportForm.valid) {
            const data = this.supportForm.value;
            this.sending = true;

            this.supportSub = this.supportService
                .createSupportRequest(data)
                .subscribe(
                    (res) => {
                        if (res.type === HttpEventType.Response) {
                            const response = res["body"];
                            this.progress = 100;
                            this.sending = false;

                            if (response["status"]) {
                                this.dialogRef.close(data);
                                this.toastr.success(
                                    this.translate.instant(
                                        "You have successfully created support request."
                                    ),
                                    this.translate.instant("Success")
                                );
                            } else {
                                this.dialogRef.close(data);
                                this.toastr.error(this.translate.instant("Something wrong!"));
                            }

                            this.progress = 0;
                        }

                        if (res.type === HttpEventType.UploadProgress) {
                            let percentDone = Math.round((100 * res.loaded) / res.total);
                            if (percentDone === 100) {
                                percentDone = percentDone - 5;
                            }

                            this.progress = percentDone;
                        }
                    },
                    (error) => {
                        this.dialogRef.close(data);
                        this.toastr.error(this.translate.instant("Something wrong!"));
                    }
                );
        } else {
            this.toastr.warning(
                this.translate.instant("Please, describe the issue you have!")
            );
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getRadioBg(option, type) {
        let radioClass = "whiteColor";
        if (option == this.supportForm.controls[type].value) {
            if (option == 1 || option == 2) {
                radioClass = "blueColor";
            }
            if (option == 3 || option == 4) {
                radioClass = "greenColor";
            }
            if (option == 5 || option == 6) {
                radioClass = "yellowColor";
            }
            if (option == 7 || option == 8) {
                radioClass = "orangeColor";
            }
            if (option == 9 || option == 10) {
                radioClass = "redColor";
            }
        }
        return radioClass;
    }

    onFileDropped($event) {
        this.documentsOnChange({ target: { files: $event } });
    }

    documentsOnChange(event) {
        this.chooseFile = true;
        const files = event.target.files;
        if (files && files.length) {
            Array.from(files).forEach((file: any) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                const fileName = file.name;
                const type = file.type;
                const url = URL.createObjectURL(file);

                reader.onload = () => {
                    let obj = {
                        file: reader.result,
                        Name: fileName,
                        previewUrl: url,
                    };

                    if (type.includes("image")) {
                        this.uploadImages.push(obj);
                    } else {
                    }
                };
            });

            event.target.value = "";
        } else {
            this.chooseFile = false;
        }
    }

    removeFile(albumKey, index, type) {
        this.uploadImages.splice(index, 1);

        if (!this.uploadImages.length) {
            this.closeSwiper();
        }
    }

    openSwiper(index, images, album) {
        this.swiper = {
            active: index,
            images: images,
            album: album,
        };
    }

    closeSwiper() {
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
        };
    }

    removeSwiperImage(event) {
        const index = event.index;
        const album = event.album;
        this.removeFile(album, index, "images");
    }
    textEditorKeyDown(editor) {
        const event = editor.event;
        const value = this.supportForm.get("text").value;
        const wordcount = value.length;
        if (wordcount >= 500 && event.keyCode != 8 && event.keyCode != 46) {
            event.preventDefault();
        }
    }

    textEditorOnPaste(editor) {
        editor.event.preventDefault();
    }
}
