import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";
import { interval, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpEventType } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ImageModalOldComponent } from "src/app/projects/components/image-modal-old/image-modal-old.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { DomSanitizer } from "@angular/platform-browser";
import { FileStorageService } from "src/app/core/services/file-storage.service";

declare var $;

interface IFile {
  Name: string;
  Url: string;
  content_id: null | number | string;
  content_type: string;
  created: boolean;
  description: string;
  document_type: string;
  file: string;
  id: null | number | string;
  name: string;
  type: string;
  type_id: null | number | string;
}

interface IAttachment {
  Id: string;
  file_path: string;
  name: string;
  project_id: string;
  typE: string;
}

@Component({
  selector: "app-directory-detail",
  templateUrl: "./directory-detail.component.html",
  styleUrls: ["./directory-detail.component.css"],
})
export class DirectoryDetailComponent implements OnInit {
  @Input("canRemove") set setCanRemove(value: boolean) {
    this.canRemove = value;
  }
  canRemove = true;
  @Output() removeFile = new EventEmitter<any>();

  public directories: any[] = [];
  public userDetails: any;
  public messages: object;
  public lang: string;
  public belongsTo: any;
  public projectId: any;
  public previousRoute: string;
  public fileComment = "";
  public parentFolder;
  public progress: number = 0;
  resSub: any;

  public showCreateFile = false;
  public showCreateFolder = false;

  public file: any;
  public fileName: string;

  public uploadMessage: any;
  public directory: any;
  public attachmentCategory: string;

  deletedDocuments = [];
  public spinner = false;
  public atas: any;
  public selectedAta = 0;
  public attachments;

  public canPressSave = true;
  public hasLock = 1;
  public userScalableToggle;
  public showUpdate = false;
  public showComment = true;
  public folderComment = "";
  private subscription: Subscription;

  images: IFile[] = [];
  pdf_documents: IFile[] = [];
  files: {
    images: IFile[],
    pdfs: IFile[]
  } = {
    images: [],
    pdfs: []
  };
  documents = [];

  swiper = {
    images: [],
    active: -1,
    album: -2,
    directory: null,
  };

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private attachmentService: AttachmentService,
    private toastr: ToastrService,
    private router: Router,
    private appService: AppService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private fsService: FileStorageService
  ) {}

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
    if (this.resSub) {
      this.resSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.userScalableToggle = document.querySelector("meta[name='viewport']");
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=no";

    this.projectId = this.route.snapshot.params.id;
    this.belongsTo = this.route.snapshot.params.directory_id;

    this.directory = this.route.snapshot.data["directory"]["data"];
    this.directory.comment_san = this.sanitizer.bypassSecurityTrustHtml(
      this.directory.comment
    );

    this.attachmentCategory = this.directory.category;
    this.directories = this.route.snapshot.data["directories"]["data"] || [];
    this.parentFolder = this.directory.belongs_to;
    this.appService.setShowAddButton = false;
    this.previousRoute =
      this.directory.belongs_to == "0"
        ? "/projects/view/" + this.directory.project_id
        : "/projects/directory/" +
          this.directory.belongs_to +
          "/" +
          this.directory.project_id;
    this.appService.setBackRoute(this.previousRoute);
    this.lang = sessionStorage.getItem("lang");

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.hideMessage();
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.uploadMessage = event.target.files[0].name;

      reader.onload = () => {
        this.file = reader.result;
        this.fileName = event.target.files[0].name;
      };
    }
  }

  toggleCreateFile(e): void {
    let object = {
      content_type: "A&D",
      content_id: null,
      type: "A&D",
      images: this.images,
      documents: this.pdf_documents,
      type_id: null,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.maxHeight = "90vh";
    diaolgConfig.data = {
      data: object,
      type: ".xlsx, .docx, .png, .jpg, .jpeg, .pdf",
    };
    this.dialog
      .open(ImageModalOldComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.images = res.files.map((item: IFile) => {
            return {
              name: item.Name,
              belongs_to: this.belongsTo,
              project_id: this.projectId,
              file: item.file,
              attachmentCategory: this.attachmentCategory,
              comment: item.description,
              id: null,
              album: -1,
              description: item.description,
            };
          });
          this.pdf_documents = res.pdf_documents.map((item: IFile) => {
            return {
              name: item.Name,
              belongs_to: this.belongsTo,
              project_id: this.projectId,
              file: item.file,
              attachmentCategory: this.attachmentCategory,
              comment: item.description,
              id: null,
              album: -1,
              description: item.description,
            };
          });
          this.files = {
            images: this.images,
            pdfs: this.pdf_documents
          };
          this.addNewFiles();
        }
      });
  }

  toggleCreateFolder(e): void {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showCreateFile = false;
    this.showCreateFolder = !this.showCreateFolder;
  }

  async addNewFolder(folderName) {
    if (!this.canPressSave) {
      return;
    }

    this.showCreateFolder = false;
    this.canPressSave = false;

    if (folderName.trim().length < 1) {
      this.toastr.error(
        this.translate.instant(
          "Please enter name of folder before creating it."
        ),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }

    const res = await this.attachmentService.addNewFolder({
      folderName,
      comment: this.folderComment,
      belongs_to: this.belongsTo,
      project_id: this.projectId,
      attachmentCategory: this.directory.category,
    });

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant("There was an error while creating folder."),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }
    if (res["status"]) {
      this.showCreateFolder = false;

      this.toastr.success(
        this.translate.instant("Successfully created folder."),
        this.translate.instant("Success")
      );
      res["createdAttachment"].category = this.attachmentCategory;
      this.directories.push(res["createdAttachment"]);

      this.canPressSave = true;
    }
  }

  async addNewFiles() {
    if (!this.canPressSave) {
      return;
    }

    this.showCreateFile = false;
    this.canPressSave = false;

    if (this.files.images.length === 0 && this.files.pdfs.length === 0) {
      this.toastr.error(
        this.translate.instant("Please choose file."),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }

    const files = {
      images: this.images,
      pdfs: this.pdf_documents
    };

    this.fsService.mergeFilesAndAlbums(files).then((response)=>{

        this.files = {
          images: [],
          pdfs: []
        };

        if (response) {
          this.files = {
            images: response.images,
            pdfs: response.pdfs
          };
        }

        this.resSub = this.attachmentService
          .addNewFiles(this.files)
          .subscribe((res: any) => {
            if (res.type === HttpEventType.Response) {
              const resp: { status: boolean; createdAttachments: IAttachment[] } =
                res["body"];
              this.progress = 100;

              if (!resp["status"]) {
                this.toastr.error(
                  this.translate.instant("Please choose file."),
                  this.translate.instant("Error")
                );
                this.canPressSave = true;
                return;
              }
              if (resp["status"]) {
                const createdAttachments = resp["createdAttachments"];
                this.showCreateFile = false;

                this.toastr.success(
                  this.translate.instant("Successfully created file."),
                  this.translate.instant("Success")
                );
                this.directories = [...this.directories, ...createdAttachments];
                this.canPressSave = true;
                this.files = {
                  images: [],
                  pdfs: []
                };
                this.images = [];
                this.pdf_documents = [];

                this.canPressSave = true;
                this.progress = 0;
              }
            }

            if (res.type === HttpEventType.UploadProgress) {
              let percentDone = Math.round((100 * res.loaded) / res.total);
              if (percentDone === 100) {
                percentDone = percentDone - 50;
              }

              this.progress = percentDone;
            }
          });
      });
  }

  removeFolder(event) {
    this.deleteFolder(event, this.belongsTo);
  }

  async deleteFolder(e, id) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.data = {
      questionText: this.translate.instant(
        "There are files in this folder, do you want to delete all files?"
      ),
    };

    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          const res = await this.attachmentService.deleteAttachment(id);
          if (res["status"] === -1) {
            this.toastr.error(
              this.translate.instant(
                "Folder must be empty before deleting it."
              ),
              this.translate.instant("Error")
            );
          } else if (res["status"]) {
            this.closeSwiper();
            this.directories = this.directories.filter((item: any) => {
              return id != item.Id;
            });

            this.toastr.success(
              this.translate.instant("Successfully deleted folder."),
              this.translate.instant("Success")
            );

            if (id === this.belongsTo) {
              this.routeBack();
            }
          } else {
            this.toastr.error(
              this.translate.instant(
                "There was an error while trying to delete folder."
              ),
              this.translate.instant("Error")
            );
          }
        }
      });
  }

  formatName(name) {
    return name;
  }

  goTo(i, e) {
    if (e) {
      if (e.target.dataset.id === "noNavigate") {
        return;
      }
    }
    const route =
      this.directories[i].type === "folder"
        ? "projects/directory/" +
          this.directories[i].Id +
          "/" +
          this.directories[i].project_id
        : "projects/directory/file/" +
          this.directories[i].Id +
          "/" +
          this.directories[i].project_id;
    this.router.navigate([route]);
  }

  changeLock(event, directory, i) {
    event.stopPropagation();
    if (this.userDetails.type == 1) {
      this.attachmentService
        .changeLockAttachment(
          directory.Id,
          Number(!parseInt(directory.lock)).toString()
        )
        .subscribe((res) => {
          this.directories[i].lock = Number(
            !parseInt(directory.lock)
          ).toString();
        });
    }
  }

  downloadFolder(id) {
    this.attachmentService.downloadFolder(id, this.projectId);
  }

  stopClickPropagation(e) {
    e.stopPropagation();
  }

  getFileName(file) {
    return file.split(".")[0];
  }

  routeBack() {
    this.router.navigate([this.getBackRoute]);
  }

  get getBackRoute() {
    let backRoute = `/projects/directory/${this.directory.belongs_to}/${this.directory.project_id}`;

    if (this.directory.belongs_to != "0") return backRoute;

    switch (this.directory.category) {
      case "agreement":
        backRoute = `/projects/view/project/${this.directory.project_id}/agreement`;
        break;
      case "security":
        backRoute = `/projects/view/project/${this.directory.project_id}/security`;
        break;
      case "information":
        backRoute = `/projects/view/project/${this.directory.project_id}/information`;
        break;
      default:
        backRoute = `/projects/view/${this.directory.project_id}`;
    }

    return backRoute;
  }

  editComment() {
    this.showUpdate = !this.showUpdate;
    this.showComment = !this.showComment;
  }

  doEdit() {
    this.attachmentService
      .updateComment(this.directory.Id, this.directory.comment)
      .subscribe((res) => {
        if (res["status"]) {
          this.directory.comment_san = this.sanitizer.bypassSecurityTrustHtml(
            this.directory.comment
          );

          this.toastr.success(
            this.translate.instant("Successfully updated comment."),
            this.translate.instant("Success")
          );
        } else {
          this.toastr.error(
            this.translate.instant(
              "There was an error while updating comment."
            ),
            this.translate.instant("Error")
          );
        }
        this.showComment = true;
        this.showUpdate = false;
      });
  }

  cancelEdit() {
    this.showUpdate = !this.showUpdate;
    this.showComment = !this.showComment;
  }

  createImageArray(image) {
    const id = image.Id;
    const comment = image.comment;
    const name = image.name;
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

  openSwiper(index, image, album) {
    if (image.image_path === null) {
      image.image_path = "";
    }

    if (this.directories[index].type === "folder") {
      const route =
        this.directories[index].type === "folder"
          ? "projects/directory/" +
            this.directories[index].Id +
            "/" +
            this.directories[index].project_id
          : "projects/directory/file/" +
            this.directories[index].Id +
            "/" +
            this.directories[index].project_id;
      this.router.navigate([route]);
    } else {
      const ext = image.name.split(".").pop();

      if (
        ext === "jpg" ||
        ext === "png" ||
        ext === "gif" ||
        ext === "pdf" ||
        ext === "jpeg"
      ) {
        if (image.image_path || image.image_path === "") {
          const imageArray = this.createImageArray(image);
          this.swiper = {
            active: 0,
            images: imageArray,
            album: image.Id,
            directory: image,
          };
        }
      } else {
        this.downloadURI(image.file_path, image.name);
      }
    }
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

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      directory: null,
    };
  }

  editCommentSwiper(event) {
    const id = event.id;
    const comment = event.comment;

    this.attachmentService.updateComment(id, comment).subscribe((res) => {
      if (res["status"]) {
        this.directories = this.directories.map((item) => {
          if (item.Id == id) {
            const newItem = { ...item, comment: comment };
            return newItem;
          }
          return item;
        });
        this.swiper.images = this.swiper.images.map((image) => {
          image.Description = comment;
          return image;
        });

        this.toastr.success(
          this.translate.instant("Successfully updated comment."),
          this.translate.instant("Success")
        );
      } else {
        this.toastr.error(
          this.translate.instant("There was an error while updating comment."),
          this.translate.instant("Error")
        );
      }
    });
  }

  removeSwiperImage(event) {
    const album = event.album;
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.deleteFolderSwiper(album);
        }
      });
  }

  async deleteFolderSwiper(id) {
    const res = await this.attachmentService.deleteAttachment(id);
    if (res["status"] === -1) {
      this.toastr.error(
        this.translate.instant("Folder must be empty before deleting it."),
        this.translate.instant("Error")
      );
    } else if (res["status"]) {
      this.closeSwiper();
      this.directories = this.directories.filter((item: any) => {
        return id != item.Id;
      });

      this.toastr.success(
        this.translate.instant("Successfully deleted folder."),
        this.translate.instant("Success")
      );
    } else {
      this.toastr.error(
        this.translate.instant(
          "There was an error while trying to delete folder."
        ),
        this.translate.instant("Error")
      );
    }
  }

  checkIfFoldersHaveItems() {
    let folderNames = "";

    for (let i = 0; i < this.deletedDocuments.length; i++) {
      const doc = this.deletedDocuments[i];
      if (doc.hasItems) {
        folderNames = " " + folderNames + doc.name + ",";
      }
    }

    folderNames = folderNames.substring(0, folderNames.length - 1);

    const doYouWantToDeleted = this.translate.instant(
      "Do you want to delete all selected items?"
    );

    let question = doYouWantToDeleted;

    if (folderNames !== "") {
      question = `${this.translate.instant(
        "There are files in the selected folders"
      )}! ${doYouWantToDeleted}`;
    }

    return question;
  }

  removeSelectedDocuments() {
    const question = this.checkIfFoldersHaveItems();

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    diaolgConfig.data = {
      questionText: question,
    };
    diaolgConfig.width = "";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async (response) => {
        if (response.result) {
          this.spinner = true;
          this.attachmentService
            .removeSelectedDocuments(this.deletedDocuments)
            .subscribe((res: any) => {
              if (res["status"]) {
                this.handleRemoveFile(this.deletedDocuments);
                this.deletedDocuments = [];
                this.toastr.success(
                  this.translate.instant("Successfully deleted folder."),
                  this.translate.instant("Success")
                );
              }
              this.spinner = false;
            });
        }
      });
  }

  selectDocumentsForRemove(event, directory) {
    event.stopPropagation();
    const checked = event.target.checked;
    if (checked) {
      this.deletedDocuments.push(directory);
    } else {
      this.deletedDocuments = this.deletedDocuments.filter(
        (file) => directory.Id != file.Id
      );
    }
  }

  removeSelectedDocumentsOnClientSide(event, directory) {
    this.deletedDocuments.forEach((doc) => {
      const albumKey = doc.album;
      const type = doc.deleteType;
      this.atas[this.selectedAta]["files"][albumKey][type] = this.atas[
        this.selectedAta
      ]["files"][albumKey][type].filter((file: any) => {
        return file.Id != doc.Id;
      });
    });
    this.deletedDocuments = [];
  }

  handleRemoveFile(deletedFiles) {
    this.directories = this.directories.filter((item: any) => {
      let found = true;
      for (let i = 0; i < deletedFiles.length; i++) {
        const del_item = deletedFiles[i];
        if (del_item.Id == item.Id) {
          found = false;
          break;
        }
      }
      return found;
    });
  }

  textEditorKeyDown(editor) {
    const event = editor.event;
    const value = new String(this.directory.comment);
    console.log(value.length)
    console.log(this.directory.comment)

    const wordcount = value.length;
    if (wordcount >= 4000 && event.keyCode != 8 && event.keyCode != 46) {
      event.preventDefault();
    }
  }

  textEditorOnPaste(editor) {
    editor.event.preventDefault();
  }
}
