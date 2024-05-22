import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CompetenceDialogComponent } from "../competence-dialog/competence-dialog.component";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { Subscription, take } from "rxjs";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { saveAs } from "file-saver";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-tree-item",
  templateUrl: "./tree-item.component.html",
  styleUrls: ["./tree-item.component.css"],
})
export class TreeItemComponent implements OnInit, OnDestroy {
  @Input() item: any;
  @Input() lavel: number = 0;
  private indentInPx: number = 10;
  isPdfOrImage: boolean = true;
  suppliers = [];
  projectId: string = "";

  isExpanded: boolean = false;
  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  hasParams: boolean = false;
  toastr: any;
  roleName: string = JSON.parse(sessionStorage.getItem("roleName"));
  isAdmin: boolean = false;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public adminRole;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private attachmentService: AttachmentService,
    private suppliersService: SuppliersService,
    private projectsService: ProjectsService,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
  }

  ngOnInit(): void {
    this.ifFileIsPdfOrImage();
    this.setFileExtension();
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params.folder == this.item.Id) {
          this.hasParams = true;
          this.onToggleSvg(event);
        } else this.hasParams = false;
      },
    });

    this.loadProjectId();
    this.loadSuppliers();
    this.loadRoleName();
    this.activeUsersThatCanEdit();
  }

  activeUsersThatCanEdit() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("userDetails"));
    if (!loggedInUser) return;
    const loggedInUserId = loggedInUser.user_id;
    if (!loggedInUserId) return;
    this.projectsService
      .getProjectInformationActiveCompanyWorkers(this.projectId)
      .then((response) => {
        if (!response) return;
        for (let _user of response) {
          if (_user["Id"] === loggedInUserId) this.isAdmin = true;
        }
      });

    ////
    //this.loadRoleName();



    if (this.roleName == "Administrator" || this.roleName == this.adminRole) {
      this.isAdmin = true;
    }
  }

  allowEdit() {
    if (this.item.permissions[this.item.Id].create) {
      return true;
    } else {
      return false;
    }
  }

  loadProjectId() {
    this.projectId = this.activatedRoute.snapshot.params["id"];
    if (!this.projectId) {
      this.activatedRoute.parent.paramMap.subscribe((params) => {
        this.projectId = params.get("id");
      });
    }
  }

  loadRoleName() {
    if (
      JSON.parse(localStorage.getItem("lastUser")).roleName != this.adminRole /* "Administrator"*/
    )
      return;
    this.roleName = JSON.parse(localStorage.getItem("lastUser")).roleName;
    if (
      this.roleName == this.adminRole /* "Administrator" */||
      JSON.parse(localStorage.getItem("lastUser")).roleName ==  this.adminRole /*"Administrator"*/
    )
      this.isAdmin = true;
  }

  loadSuppliers() {
    this.suppliersService
      .getProjectMaterialSupplier(this.projectId)
      .pipe(take(1))
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
        },
      });
  }

  getIndent(): string {
    if (this.lavel == 0) return;
    return `${this.indentInPx}px solid #C2D8FA`;
  }

  getIndentGrid(): any {
    if (this.isExpanded && this.lavel == 0)
      return {
        display: "grid",
        "grid-template-columns": "292px 28px 273px 55px 75px 130px 62px 25px",
      };
    return {
      display: "grid",
      "grid-template-columns":
        `${291 - this.indentInPx * this.lavel}px` +
        " 28px 273px 55px 75px 130px 62px 25px",
    };
  }

  onToggleItem() {
    // ako bude u buducnosti trebalo da se doda
  }

  public isLoading: boolean = false;

  onToggleSvg(event) {
    this.isLoading = true;
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
    if (!this.isExpanded) {
      this.isLoading = false;
      return;
    }
    this.item.children = [];
    this.attachmentService
      .getAttachments(this.item.Id, this.item.project_id, this.item.category)
      .subscribe({
        next: (response: { status: boolean; data: any[] }) => {
          if (response.status) {
            for (const key in response.data) {
              this.item.children.push(response.data[key]);
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        },
      });
  }

  onView(e) {
    e.stopPropagation();
  }

  removingFolderSpinner: boolean = false;
  async onRemove(e) {
    e.stopPropagation();
    // if (!this.item.permissions[this.item.Id].create) return;
    if (!this.projectId || !this.item) return;
    this.removingFolderSpinner = true;
    const response = await this.attachmentService.checkIfUserCanEditFolder(this.projectId, this.item.Id);
    this.removingFolderSpinner = false;
    if (!response['status']) return;
    const canRemove = response['data'];
    console.log(canRemove);
    if (!canRemove) return;




    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.data = {
      questionText: "Are you sure you want to delete item?",
    };
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    const dialogRef = this.dialog.open(
      ConfirmationModalComponent,
      diaolgConfig
    );
    dialogRef.afterClosed().subscribe({
      next: async (response) => {
        if (response.result) {
          // izbirsati komentar
          // this.isLoading = true;
          if (
            this.item.Id === this.activatedRoute.snapshot.queryParams["folder"]
          ) {
            this.attachmentService.deleteAttachment(this.item.Id);
            this.attachmentService.isDeleted.next(true);
            this.router.navigate([], {
              queryParams: {
                folder: null,
              },
              queryParamsHandling: "merge",
            });
            return;
          }
          this.attachmentService.deleteAttachment(this.item.Id);
          this.attachmentService.isDeleted.next(true);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  nameDescriptionSub: Subscription | undefined;
  onCompetence(e) {
    e.stopPropagation();

    // Ovdje bi trebalo provjeriti odgovorne osobe
    if (!this.isAdmin) return;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      item: this.item,
      suppliers: this.suppliers,
    };

    dialogConfig.panelClass = "app-full-bleed-dialog";
    const dialogRef = this.dialog.open(CompetenceDialogComponent, dialogConfig);

    this.nameDescriptionSub = dialogRef.afterClosed().subscribe({
      next: (answer: {nameDescription: any, howManyChecked: number | null}) => {
        if (!answer) return;
        if (answer.nameDescription.name !== this.item.name || answer.nameDescription.description !== this.item.comment) {
          this.changeFolderNameAndDescription(this.item.Id, answer.nameDescription);
        }
        if (answer.howManyChecked && answer.howManyChecked >= 0) {
          this.item = {
            ...this.giveAllChildSamePermissionNumber(this.item, answer.howManyChecked)
          };
        }
      }
    });
  }

  giveAllChildSamePermissionNumber(folder, permissionsNumber) {
    let children = [];
    if (folder.children && folder.children.length > 0) {
      for (let child of folder.children) {
        child = {
          ...this.giveAllChildSamePermissionNumber(child, permissionsNumber)
        };
        children.push(child);
      }
    }
    return {
      ...folder,
      permissionsNumber: permissionsNumber,
      children: [...children]
    }
  }

  changeFolderNameAndDescription(id, data) {
    this.attachmentService
      .changeFolderNameAndDescription(id, data)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          if (!result['status']) return;
          // this.item.name = result['name'];
          this.item = {
            ...this.item,
            name: result['name'],
            comment: result['description']
          }
          // this.item.comment = result['description'];
        }
      });
  }

  isPDFViewer: boolean = false;
  openSwiper() {
    if (this.item.type === "folder") {
      this.setQueryParams();
    } else {
      if (
        this.item.extension !== "PNG" &&
        this.item.extension !== "JPG" &&
        this.item.extension !== "JPEG" &&
        this.item.extension !== "PDF"
      )
        return;

      if (this.item.extension === "PDF" || this.item.name.endsWith("pdf")) {
        const imageArray = this.createImageArray(this.item);
        this.isPDFViewer = true;
        this.swiper = {
          active: 0,
          images: imageArray,
          album: -1,
          index: -1,
          parent: this.item,
        };
        // return;
      } else {
        const imageArray = this.createImageArray(this.item);
        this.isPDFViewer = false;
        this.swiper = {
          active: 0,
          images: imageArray,
          index: -1,
          parent: null,
          album: -1,
        };
      }
    }
  }

  createImageArray(image) {
    const id = image.id;
    const comment = image.Description;
    const name = image.Name ? image.Name : image.name;
    //const image_path = image.image_path;
    const file_path = image.file_path;

    const imageArray = file_path.split(",").map((imageString) => {
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

  downloadURI(uri, name) {
    const link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute("download", name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  setQueryParams() {
    const queryParams: Params = {
      folder: this.item.Id,
    };

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: "merge",
    });
  }

  goBackOneFolder() {
    let queryParams: Params = {};
    if (this.item.belongs_to != "0") {
      queryParams = {
        folder: this.item.belongs_to,
      };
    } else {
      queryParams = {
        folder: null,
      };
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: "merge",
    });
  }

  ifFileIsPdfOrImage() {
    if (this.item.type == "folder") return;
    if (this.item.name.includes(".xlsx") || this.item.name.includes(".docx")) {
      this.item.isNeededFormat = false;
    } else {
      this.item.isNeededFormat = true;
    }
  }

  setFileExtension() {
    if (this.item.name.includes(".xlsx")) {
      this.item.extension = "XLSM";
      return;
    } else if (this.item.name.includes(".docx")) {
      this.item.extension = "DOCX";
      return;
    } else if (this.item.name.includes(".jpeg")) {
      this.item.extension = "JPEG";
      return;
    } else if (this.item.name.includes(".JPEG")) {
      this.item.extension = "JPEG";
      return;
    } else if (this.item.name.includes(".png")) {
      this.item.extension = "PNG";
      return;
    } else if (this.item.name.includes(".jpg")) {
      this.item.extension = "JPG";
      return;
    } else if (this.item.name.includes(".pdf")) {
      this.item.extension = "PDF";
      return;
    } else {
      this.item.extension = "";
      return;
    }
  }

  removeSwiperImage() {}

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }

  downloadFolder(e) {
    e.stopPropagation();

    if (this.item.type == "folder") {
      this.attachmentService
        .downloadFolder(this.item.Id, this.projectId, this.item.name)
        .then((res) => {
          this.attachmentService.unlinkDocument(this.item.name);
        });
    } else {
      if (this.item.type == "folder") {
        this.attachmentService
          .downloadFolder(this.item.Id, this.projectId, this.item.name)
          .then((res) => {
            this.attachmentService.unlinkDocument(this.item.name);
          });
      } else {
        saveAs(this.item.file_path, this.item.name);
      }
    }
  }

  onOpenImage() {
    this.openSwiper();
  }

  ngOnDestroy(): void {
    this.nameDescriptionSub?.unsubscribe();
  }
}
