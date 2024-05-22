import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { Location } from "@angular/common";
import { ProjectsService } from "src/app/core/services/projects.service";


declare var $;
@Component({
  selector: "app-new-supplier-invoice",
  templateUrl: "./new-supplier-invoice.component.html",
  styleUrls: ["./new-supplier-invoice.component.css"],
  providers: [ImageModalUtility],
})
export class NewSupplierInvoiceComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private invoicesService: InvoicesService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fortnoxApiService: FortnoxApiService,
    private imageModalUtility: ImageModalUtility,
    private fsService: FileStorageService,
    private location: Location,
    private projectService: ProjectsService

  ) {}
  public createForm: FormGroup;
  public week = "Week";
  public language = "en";
  public projectId: any;
  public type: any = "0";
  public enable_add_image: boolean = true;
  infoObject = {
    content_type: "Ata",
    content_id: null,
    type: "Project",
    type_id: null,
  };
  key = ["-1"];
  albums: any = {};
  enabledAccounts = [];
  public projectName:any;
  public customName:any;
  characterCount: number = 0;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params["id"];
    // Dobijte informacije o projektu koristeći ProjectService
    this.projectService.getProject(this.projectId).then((projectData) => {
      if (projectData) {
        this.projectName=projectData.name;
        this.customName=projectData.CustomName;
      }
    });
    this.language = sessionStorage.getItem("lang");

    this.fortnoxApiService.getAllEnabledAccounts().subscribe((accounts) => {
      this.enabledAccounts = accounts.filter(
        (invoice) => invoice.fixed_cost == 1
      );
    });

    this.createForm = this.fb.group({
      //OrderNR: ['', [Validators.required]],
      SupplierName: ["", [Validators.required]],
      AtaID: ["", []],
      InvoiceDate: ["", [Validators.required]],
      DueDate: ["", [Validators.required]],
      Status: ["", []],
      ProjectID: ["", []],
      Ocr: [this.getRandomInt(88888888), [Validators.required]],
      InvoiceNumber: [this.getRandomInt(7777777), [Validators.required]],
      VAT: ["0", []],
      Total: ["0", []],
      TotalWihoutWat: ["0", [Validators.required]],
      account: [null, [Validators.required]],
      images: [[], []],
      documents: [[], []],
      //ovo dodajem
      interComment: ["", []],
    });

    const datepickerOptions = {
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: this.language,
      currentWeek: true,
      todayHighlight: true,
      currentWeekTransl: this.language === "en" ? "Week" : "Vecka",
      currentWeekSplitChar: "-",
      weekStart: 1
    };

    $("#dateSelectStartDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        this.createForm.get("InvoiceDate").patchValue(ev.target.value);
      });

    $("#dateSelectEndDate")
      .datepicker(datepickerOptions)
      .on("changeDate", (ev) => {
        this.createForm.get("DueDate").patchValue(ev.target.value);
      });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  create() {
    const data = this.createForm.value;
    data.AtaID = 0;
    data.ProjectID = this.projectId;

    if (this.createForm.valid) {

      data.TotalWihoutWat = data.TotalWihoutWat.replaceAll(/\s/g, '').trim();
      data.VAT = data.VAT.replaceAll(/\s/g, '').trim();

      this.invoicesService.createSupplierInvoice(data).subscribe((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant("You have successfully edited invoice!"),
            this.translate.instant("Success")
          );
          let url = "/projects/view/" + this.projectId + "/supplier-invoices";
          this.router.navigate([url], {
            queryParams: { type: this.type },
          });
        }
      });
    }
  }

  setValue(value) {
    const total_without_wat = Number(
      this.createForm
        .get("TotalWihoutWat")
        .value.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    );

    const vat = Number(
      this.createForm
        .get("VAT")
        .value.toString()
        .replace(/\s/g, "")
        .replace(",", ".")
    );

    let total = total_without_wat + vat;
    this.createForm.get("Total").patchValue(total);
  }

  setAccount(value) {
    this.createForm.get("account").setValue(value);
  }

  updateAlbums(event) {
    this.albums = event;

    const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);

    if (albumFiles.images.length > 0) {
      this.enable_add_image = false;
      this.fsService.mergeFilesAndAlbums(albumFiles).then((response: any) => {
        if (response != null) {
          this.createForm.get("images").patchValue(response.images);
        }
      });
    } else {
      this.enable_add_image = true;
      this.createForm.get("images").patchValue([]);
    }
  }
  goBack() {
    this.location.back();
  }
  updateCharacterCount() {
    const maxCharacters = 150;
    const interCommentValue = this.createForm.get('interComment').value;
    this.characterCount = interCommentValue.length;
    if (this.characterCount > maxCharacters) {
      this.createForm.get('interComment').setValue(interCommentValue.slice(0, maxCharacters));
      this.characterCount = maxCharacters;
    }
  }
  autoGrowTextZone(e) {
    e.target.style.height = (e.target.scrollHeight)+"px";
  }
}
