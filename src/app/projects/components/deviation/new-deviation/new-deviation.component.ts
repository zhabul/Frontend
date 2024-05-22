import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AtaService } from "src/app/core/services/ata.service";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { GeneralsService } from "src/app/core/services/generals.service";
import { HttpEventType } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";

declare var $: any;

@Component({
  selector: "app-new-deviation",
  templateUrl: "./new-deviation.component.html",
  styleUrls: [
    "./new-deviation.component.css",
    "../../../../utility/image-preview.css",
  ],
  providers: [ImageModalUtility],
})
export class NewDeviationComponent implements OnInit {
  public createForm: FormGroup;
  public project: any;
  public files = [];
  public removed_files = [];
  public documents = [];
  public DeviationTypes = [];
  public week = "Week";
  public chooseFile = false;
  public uploadMessage = "";
  public previousRoute: string;
  public dropdownSettings: any;
  public showPdfPreview = false;
  public language = "en";
  public nextDeviationNumber;
  public generalImage;
  public client_workers = [];
  public clientContacts = [];
  public spinner = false;
  public disabledButton = true;
  public type: any;
  public allFiles: any[] = [];

  public showPdf: boolean = false;
  public currentAttachmentPdf = null;
  public currentAttachmentImage = null;
  public showAttachmentImage = false;
  public wrapper: any;
  public viewer: any;
  public rotateValue: number = 0;
  public selectedTab = 0;
  public nextNumber = 1;
  public ataTypeName = "";
  createDeviationSub: any;
  public progress: number = 0;
  public projectUserDetails: any;
  infoObject = {
    content_type: "KS",
    content_id: null,
    type: "Ata",
    images: this.files,
    documents: this.documents,
    type_id: null,
  };
  key = ["-1"];
  albums: any = {};

  public username = '';
  public userDetails:any = {};
  public setHeight = {
    'height' : 'calc(100vh - 132px - 0px)'
  };

  public desMenuToggle = true;
  currentPage: number = 1;
  totalPage: number = 1;

  @ViewChild('bluScroll') bluScroll;

  updateAlbums(event) {
    this.albums = event;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ataService: AtaService,
    private toastr: ToastrService,
    private appService: AppService,
    private translate: TranslateService,
    private generalsService: GeneralsService,
    public sanitizer: DomSanitizer,
    private imageModalUtility: ImageModalUtility,
    private fsService: FileStorageService
  ) {}

  ngOnInit() {
    this.language = sessionStorage.getItem("lang");
    this.userDetails =  JSON.parse(sessionStorage.getItem("userDetails"));
    this.username = `${this.userDetails.firstname} ${this.userDetails.lastname}`
    this.week = this.language === "en" ? "Week" : "Vecka";
    this.projectUserDetails = this.route.snapshot.data['projectUserDetails'];
    this.project = this.route.snapshot.data["project"];
    this.client_workers = this.route.snapshot.data["client_workers"];
    this.DeviationTypes = this.route.snapshot.data["type_deviations"];
    let data_key = {
        key: "Logo",
    };
    this.generalsService.getSingleGeneralByKey(data_key).subscribe((res: any) => {
        this.generalImage = res["data"][0]["value"];
    });

    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get("type") || null;
      this.ataTypeforView(this.type);
      this.nextNumber = Number(params.get("nextNumber")) || null;

      if(this.type == 1) {

          const ataInternal = Number(this.userDetails.show_project_Internaldeviation);
          if(!ataInternal && this.projectUserDetails.Deviation_Internal == 0) {
              this.router.navigate(["projects", "view", this.project.id]);
          }
      }

      if(this.type == 0) {

          const ataExternal = Number(this.userDetails.show_project_Externaldeviation);
          if(!ataExternal && this.projectUserDetails.Deviation_External == 0) {
              this.router.navigate(["projects", "view", this.project.id]);
          }
      }
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: "Id",
      textField: "Name",
      selectAllText: this.translate.instant("Select All"),
      unSelectAllText: this.translate.instant("Unselect All"),
      itemsShowLimit: 0,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText:
        this.translate.instant("No data available"),
      searchPlaceholderText: this.translate.instant("Search"),
    };

    this.ataService.getNextDeviationNumber(this.project.id).subscribe((res) => {
      if (res["status"]) {
        this.nextDeviationNumber = res["nextNumber"];
      }
    });

    this.previousRoute = "/projects/view/" + this.project.id;
    this.appService.setBackRoute(this.previousRoute);
    this.appService.setShowAddButton = false;

    this.createForm = this.fb.group({
      Title: ["", [Validators.required, Validators.maxLength(50)]],
      DeviationType: [this.DeviationTypes[0].id, [Validators.required]],
      StartDate: [
        moment().format(`YYYY-MM-DD [${this.week}] W`),
        [Validators.required],
      ],
      DueDate: ["", [Validators.required]],
      street: [this.project.clientStreet],
      city: [this.project.clientCity],
      zip: [this.project.clientZip],
      clientName: [this.project.clientName],
      Description: [""],
      Reason: [""],
      Suggestion: [""],
      State: ["", [Validators.required]],
      Type: [this.type == "1" ? "0" : "1"],
      Client: [this.project.ClientContactPerson],
    });

    const datepickerOptions = {
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      todayHighlight: true,
      currentWeek: true,
      currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
      currentWeekSplitChar: "-",
      weekStart: 1
    };

    $("#startDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) >
          Date.parse(this.createForm.value.DueDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Start date cannot be after end date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.StartDate;
          }, 0);
        } else {
          this.createForm.get("StartDate").patchValue(ev.target.value);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.StartDate;
      });

    $("#dueDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        if (
          Date.parse(ev.target.value.split(" ")[0]) <
          Date.parse(this.createForm.value.StartDate.split(" ")[0])
        ) {
          setTimeout(() => {
            this.toastr.info(
              this.translate.instant("Due date cannot be before start date."),
              this.translate.instant("Info")
            );
            ev.target.value = this.createForm.value.DueDate;
          }, 0);
        } else {
          this.createForm.get("DueDate").patchValue(ev.target.value);
        }
      })
      .on("blur", (e) => {
        e.target.value = this.createForm.value.DueDate;
      });

      document.querySelector(".container-pdf-preview").addEventListener("scroll", () => {
        this.updateCurrentPageDeviationPdfPreview();
      });
  }

  ataTypeforView(ata){
    if(ata == "0"){
      this.ataTypeName = "External Deviation";
    }
    else {
     this.ataTypeName = "Internal Deviation";
    }
    return this.ataTypeName;
  }

  ngOnDestroy() {
    if (this.createDeviationSub) {
      this.createDeviationSub.unsubscribe();
    }
  }

  createDeviation() {
    const data = this.createForm.value;

    data.contacts = this.clientContacts;
    data.nextDeviationNumber = this.nextDeviationNumber;
    data.generalImage = this.generalImage;
    data.Status = 0;
    data.ProjectID = this.project.id;

    const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);

    if (!this.createForm.valid) return;

    this.disabledButton = false;
    this.spinner = true;

    this.fsService.mergeFilesAndAlbums(albumFiles).then((response: any) => {
        data.images = [];
        data.documents = [];

        if(response != null) {
            data.images = response.images;
            data.documents = response.pdfs;
        }

        this.sendCreateRequest(data);
    });
  }

  private sendCreateRequest(data: any) {
    this.createDeviationSub = this.ataService
        .createDeviation(data)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
            const response = res["body"];
            this.progress = 100;

            if (response["status"]) {
              this.toastr.success(
                this.translate.instant(
                  "You have successfully created deviation!"
                ),
                this.translate.instant("Success")
              );

              if (data.Type == "0")
                this.router.navigate(
                  [
                    "/projects/view/deviation/edit",
                    this.project.id,
                    response["createdDeviationId"],
                  ],
                  { queryParams: { projectId: this.project.id } }
                );
              else
                this.router.navigate(
                  [
                    "/projects/view/deviation/edit",
                    this.project.id,
                    response["createdDeviationId"],
                  ],
                  {
                    queryParams: {
                      type: "external",
                      projectId: this.project.id,
                    },
                  }
                );
            }

            this.progress = 0;
          }

          if (res.type === HttpEventType.UploadProgress) {
            let percentDone = Math.round((100 * res.loaded) / res.total);
            if (percentDone === 100) {
              percentDone = percentDone - 50;
            }

            this.progress = percentDone;
          }
        });
  }

  togglePdfPreview() {
    this.showPdfPreview = !this.showPdfPreview;
  }

  removeDocument(index) {
    this.files.splice(index, 1);
  }

  removeNewAttachment(index, type) {
    this[type].splice(index, 1);
  }

  renderText() {

    if (this.type == 1)
      return 'Internal deviation';
    else
      return 'External deviation';
  }


  containerHeightToggle(event){
    if(event){
        this.setHeight.height = 'calc(100vh - 462px - 0px)'
    }else{
        this.setHeight.height = 'calc(100vh - 132px - 0px)'
    }
  }

  autoGrowTextZone(e) {
    e.target.style.height = (e.target.scrollHeight)+"px";
  }

  updateTotalPageDeviationPdfPreview(TotalPageNumber: number) {
    this.totalPage = TotalPageNumber;
  }

  updateCurrentPageDeviationPdfPreview() {
    const dokument = document.querySelector(".container-pdf-preview");
    const currentPositionPX = dokument.scrollTop;
    const heightWindowPX = window.innerHeight;
    const totalPage =  this.totalPage;

    const calculatedPage = Math.floor(currentPositionPX / heightWindowPX) + 1;

    this.currentPage = Math.min(calculatedPage, totalPage);
  }
}
