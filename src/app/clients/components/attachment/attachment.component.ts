import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpEventType } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ImageModalOldComponent } from "src/app/projects/components/image-modal-old/image-modal-old.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ClientsService } from "src/app/core/services/clients.service";
import { FileStorageService } from "src/app/core/services/file-storage.service";

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
  selector: "app-attachment",
  templateUrl: "./attachment.component.html",
  styleUrls: ["./attachment.component.css"],
})
export class AttachmentComponent implements OnInit {
  @Input("canRemove") set setCanRemove(value: boolean) {
    this.canRemove = value;
  }
  canRemove = true;
  @Output() removeFile = new EventEmitter<any>();
  public directories: any[] = [];
  public file: any;
  public fileName: string;
  public uploadMessage = "";
  public progress: number = 0;
  public userDetails: any;
  public lang: string;
  public messages: object;
  public belongsTo: any;
  public canPressSave = true;
  public client;
  public showCreateFile = false;
  public showCreateFolder = false;
  public attachments;
  public client_id;

  deletedDocuments = [];
  public spinner = false;
  public atas: any;
  public selectedAta = 0;

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

  resSub: any;
  swiper = {
    images: [],
    active: -1,
    album: -2,
    directory: null,
  };

  clientSub;

  constructor(
    private attachmentService: AttachmentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private fsService: FileStorageService
  ) {}

  ngOnInit() {
    this.directories = this.route.snapshot.data["attachments"]["data"] || [];
    this.client_id = this.route.snapshot.data["client"].id;
    this.belongsTo = this.route.snapshot.params.directory_id;
    this.lang = sessionStorage.getItem("lang");
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }

  unSubFromRes() {
    if (this.resSub && typeof this.resSub.unsubsrcibe === 'function') {
      this.resSub.unsubsrcibe();
    }
  }

  ngOnDestroy() {
    this.unSubFromRes();
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
      noComment: true,
    };
    this.dialog
      .open(ImageModalOldComponent, diaolgConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const client_id = this.client_id;

          this.images = res.files.map((item: IFile) => {
            return {
              name: item.Name,
              belongs_to: "0",
              client_id: client_id,
              file: item.file,
              comment: item.description,
              id: null,
              album: -1,
              description: item.description,
            };
          });
          this.pdf_documents = res.pdf_documents.map((item: IFile) => {
            return {
              name: item.Name,
              belongs_to: "0",
              client_id: client_id,
              file: item.file,
              id: null,
              comment: item.description,
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

    let client_id = this.client.id ? this.client.id : this.client;
    const res = await this.attachmentService.addNewFolder({
      folderName,
      belongs_to: "0",
      client_id: client_id,
    });

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant("There was an error while creating folder."),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }

    this.showCreateFolder = false;
    this.toastr.success(
      this.translate.instant("Successfully created folder."),
      this.translate.instant("Success")
    );

    this.directories.push(res["createdAttachment"]);

    this.canPressSave = true;
  }

  goTo(i, e) {
    if (e) {
      if (e.target.dataset.id === "noNavigate") {
        return;
      }
    }
    const route =
      this.directories[i].type === "folder"
        ? "clients/directory/" +
          this.directories[i].Id +
          "/" +
          this.directories[i].ClientId
        : "clients/directory/file/" +
          this.directories[i].Id +
          "/" +
          this.directories[i].ClientId;
    this.router.navigate([route]);
  }

  changeLock(event, directory, i) {
    event.stopPropagation();
    if (this.userDetails.type == 1) {
      this.attachmentService
        .changeLockAttachment(
          directory.id,
          Number(!parseInt(directory.lock)).toString()
        )
        .subscribe((res) => {
          this.directories[i].lock = Number(
            !parseInt(directory.lock)
          ).toString();
        });
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
          .addNewFilesClient(this.files)
          .subscribe(
            (res: {
              loaded: number;
              total: number;
              type: any;
              body: { status: boolean; createdAttachments: IAttachment[] };
            }) => {
              if (res.type === HttpEventType.Response) {
                const resp: { status: boolean; createdAttachments: IAttachment[] } =
                  res["body"];
                this.progress = 100;

                if (!resp["status"]) {
                  this.toastr.error(
                    this.translate.instant(
                      "There was an error while creating file."
                    ),
                    this.translate.instant("Error")
                  );
                  this.canPressSave = true;
                  this.showCreateFile = false;
                  return;
                }

                if (resp["status"]) {
                  const createdAttachments = resp["createdAttachments"];
                  this.toastr.success(
                    this.translate.instant("Successfully created file."),
                    this.translate.instant("Success")
                  );
                  this.showCreateFile = false;
                  this.directories = [...this.directories, ...createdAttachments];

                  this.canPressSave = true;
                  this.files = {
                    images: [],
                    pdfs: []
                  };
                  this.images = [];
                  this.pdf_documents = [];
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
            }
          );

      });
  }

  getFileName(file) {
    return file.split(".")[0];
  }

  async deleteFolder(e, id) {
    e.stopPropagation();

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
          const res = await this.attachmentService.deleteAttachment(id);
          if (res["status"] === -1) {
            this.toastr.error(
              this.translate.instant("Error while deleting file."),
              this.translate.instant("Error")
            );
          } else if (res["status"]) {
            this.closeSwiper();
            this.directories = this.directories.filter((item: any) => {
              return id != item.id;
            });
            this.toastr.success(
              this.translate.instant("Successfully deleted file."),
              this.translate.instant("Success")
            );
          } else {
            this.toastr.error(
              this.translate.instant("Error while deleting file."),
              this.translate.instant("Error")
            );
          }
        }
      });
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      directory: null,
    };
  }

  isPDFViewer: boolean = false;
  openSwiper(index, file, album) {
    if (file.image_path === null) {
      file.image_path = "";
    }

    if (this.directories[index].type === "folder") {
      const route =
        this.directories[index].type === "folder"
          ? "projects/directory/" +
            this.directories[index].Id +
            "/" +
            this.directories[index].project_id
          : "projects/directory/file/" +
            this.directories[index].id +
            "/" +
            this.directories[index].project_id;
      this.router.navigate([route]);
    } else {
      const ext = file.name.split(".").pop();

      if (
        ext === "jpg" ||
        ext === "png" ||
        ext === "gif" ||
        ext === "pdf" ||
        ext === "jpeg"
      ) {
        if (file.image_path || file.image_path === "") {
          const fileArray = this.createFileArray(file);
          this.swiper = {
            active: 0,
            images: fileArray,
            album: file.id,
            directory: file,
          };
        }
      } else {
        this.downloadURI(file.file_path, file.name);
      }
    }

    if (file.name.endsWith('pdf')) {
      this.isPDFViewer = true;
    }else{
      this.isPDFViewer = false;
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

  createFileArray(file) {
    const id = file.id;
    const comment = file.comment;
    const name = file.name;
    // const image_path = file.image_path;
    const file_path = file.file_path;

    const fileArray = file_path.split(",").map((fileArray) => {
      return {
        image_path: fileArray,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return fileArray;
  }

  stopClickPropagation(e) {
    e.stopPropagation();
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

          this.clientsService
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
        if (del_item.id == item.id) {
          found = false;
          break;
        }
      }
      return found;
    });
  }
}
