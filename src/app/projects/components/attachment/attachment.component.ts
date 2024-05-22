import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  take,
} from "rxjs";
import { environment } from "src/environments/environment";
import { HttpEventType } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ImageModalOldComponent } from "src/app/projects/components/image-modal-old/image-modal-old.component";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { ClientsService } from "src/app/core/services/clients.service";
import { NewFileDialogComponent } from "./new-file-dialog/new-file-dialog.component";
import { NewFolderDialogComponent } from "./new-folder-dialog/new-folder-dialog.component";
import { NewCommentDialogComponent } from "./new-comment-dialog/new-comment-dialog.component";
import { LoadingSpinnerService } from "src/app/core/services/loading-spinner.service";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
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
  belongs_to: number;
  project_id: number;
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
  @Input() directories: any[] = [];
  @Input() ataid = 0;
  @Input() projectId;
  @Input() attachmentCategory = "default";
  @Input("index") index;
  @Input("imageModal") imageModal;
  @Input("canRemove") set setCanRemove(value: boolean) {
    this.canRemove = value;
  }
  @Input('inAnotherComponent') inAnotherComponent: boolean = false;
  canRemove = true;
  @Output() removeFile = new EventEmitter<any>();

  public progress: number = 0;
  public file: any;
  public atas: any;
  public fileName: string;
  public uploadMessage = "";
  public userDetails: any;
  public lang: string;
  public messages: object;
  public belongsTo: any;
  public canPressSave = true;
  public fileComment = "";
  public folderComment = "";
  private subscription: Subscription;
  public translations = {};
  public spinner = false;
  public selectedAta = 0;
  public inFolder: string = "0";
  public commentNumber: number = 0;
  private searchSubscription?: Subscription;
  private commentSubscription?: Subscription;

  deletedDocuments = [];

  images: IFile[] = [];
  pdf_documents: IFile[] = [];
  files: {
    images: IFile[];
    pdfs: IFile[];
  } = {
    images: [],
    pdfs: [],
  };
  documents = [];

  public showCreateFile = false;
  public adminRole;
  public showCreateFolder = false;
  formdata;
  resSub: any;

  swiper = {
    images: [],
    active: -1,
    album: -2,
    directory: null,
  };

  getTranslationsSub: any;
  previousRoute: any;
  url: any;
  httpClient: any;
  type: any;
  checked: any;
  canEditFolder: boolean = false;
  folder: any;

  constructor(
    private translate: TranslateService,
    private attachmentService: AttachmentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private fsService: FileStorageService,
    private clientsService: ClientsService,
    private activatedRoute: ActivatedRoute,
    public loadingSpinnerService: LoadingSpinnerService,
    private paymentPlanService: PaymentPlanService,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.adminRole = this.AESEncryptDecryptService.sha256('Administrator');
  }

  onClickSubmit(data) {
    if (this.formdata.invalid) {
      this.formdata.get("description").markAsTouched();
    }
  }

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

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.folder = params.get("folder") || null;
    });
    this.directories = this.directories.filter(
      (directory) => directory.category == this.attachmentCategory
    );
    this.belongsTo = this.route.snapshot.params.directory_id;
    this.lang = sessionStorage.getItem("lang");
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.formdata = this.formBuilder.group({
      description: [
        "",
        [
          Validators.required,
          Validators.maxLength(400),
          Validators.minLength(5),
        ],
      ],
    });
    this.hideMessage();

    this.clientsService.showNewClientForm.subscribe((val) => {
      this.componentVisibility = val;
    });

    this.updateFoldersOnChangeQueryParams();
    this.somethingDeleted();
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchQuery) =>
          this.attachmentService.getAttachments(
            this.inFolder,
            this.projectId,
            this.attachmentCategory,
            searchQuery
          )
        )
      )
      .subscribe({
        next: (result: { status: boolean; data: any[] }) => {
          if (result.status) {
            this.listOfFolders$ = of(result.data);
          }
          this.isLoading = false;
        },
      });

    this.getCommentNumber();

    this.checkIfUserCanEditFolder();
  }

/*   activeUsersThatCanEdit() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("userDetails"));
    if (!loggedInUser) return;
    const loggedInUserId = loggedInUser.user_id;
    if (!loggedInUserId) return;
    this.projectsService
      .getProjectInformationActiveCompanyWorkers(this.projectId)
      .then((response) => {
        if (!response) return;
        for (let _user of response) {
          if (_user["Id"] === loggedInUserId) this.canEditFolder = true;
        }
      });

    this.attachmentService
      .getAttachments(this.inFolder, this.projectId, this.attachmentCategory)
      .subscribe({
        next: (result: { status: boolean; data: any[] }) => {
          this.directories = result.data;
        },
      });
  } */

  checkIfUserCanEditFolder() {
    if (this.inFolder == "0") {
      this.canEditFolder = true;
      return;
    }
    if (!this.projectId) return;
    this.attachmentService.checkIfUserCanEditFolder(this.projectId, this.inFolder).then((response) => {
      if (response['status']) {
        this.canEditFolder = response['data'];
      }
    });
  }

  getCommentNumber() {
    this.commentSubscription = this.paymentPlanService
      .getTheComments(this.projectId, this.attachmentCategory)
      .subscribe({
        next: (res: { status: boolean; data: any[] }) => {
          if (!res) return;
          this.commentNumber = res.data.length;
        },
      });
  }

  updateFoldersOnChangeQueryParams() {
    this.loadingSpinnerService.setLoading(true);
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params.folder) {
          this.inFolder = params.folder;

          this.listOfFolders$ = this.attachmentService
            .getAttachment(params.folder, this.projectId)
            .pipe(
              map((resp: { status: boolean; data: {} }) => {
                const putFolderInList = [];
                putFolderInList.push(resp.data);
                this.loadingSpinnerService.setLoading(false);
                return putFolderInList;
              })
            );
        } else {
          this.inFolder = "0";
          this.attachmentService
            .getAttachments(0, this.projectId, this.attachmentCategory)
            .subscribe({
              next: (result: { status: boolean; data: any[] }) => {
                if (result.status) this.listOfFolders$ = of(result.data);
                this.loadingSpinnerService.setLoading(false);
              },
            });
        }
      },
      error: (error) => console.log(error),
    });
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let size = Math.round(event.target.files[0].size / 1024);
      if (size > 500000) {
        this.toastr.error(
          this.translate.instant("Maximum file size is 500 MB."),
          this.translate.instant("Error")
        );
        this.uploadMessage = null;
        this.file = null;
        this.fileName = null;
      } else {
        reader.onload = () => {
          this.uploadMessage = event.target.files[0].name;
          this.file = reader.result;
          this.fileName = event.target.files[0].name;
        };
      }
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
              belongs_to: "0",
              project_id: this.projectId,
              file: item.file,
              ataid: this.ataid,
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
              belongs_to: "0",
              project_id: this.projectId,
              file: item.file,
              ataid: this.ataid,
              attachmentCategory: this.attachmentCategory,
              comment: item.description,
              id: null,
              album: -1,
              description: item.description,
            };
          });
          this.files = {
            images: this.images,
            pdfs: this.pdf_documents,
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
    this.showCreateFolder = false;

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
      belongs_to: "0",
      project_id: this.projectId,
      ataid: this.ataid,
      attachmentCategory: this.attachmentCategory,
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
      pdfs: this.pdf_documents,
    };


    this.fsService.mergeFilesAndAlbums(files).then((response) => {
      this.files = {
        images: [],
        pdfs: [],
      };

      if (response) {
        this.files = {
          images: response.images,
          pdfs: response.pdfs,
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
                pdfs: [],
              };
              this.images = [];
              this.pdf_documents = [];

              // Ovaj if - else ispod je da se ponovo getaju fajlovi i folderi kada
              // se zavrsi upload
              if (this.activatedRoute.snapshot.queryParamMap.get("folder")) {
                this.listOfFolders$ = this.attachmentService
                  .getAttachment(this.inFolder, this.projectId)
                  .pipe(
                    map((resp: { status: boolean; data: {} }) => {
                      const putFolderInList = [];
                      putFolderInList.push(resp.data);
                      this.loadingSpinnerService.setLoading(false);
                      return putFolderInList;
                    })
                  );
              } else {
                this.attachmentService
                  .getAttachments(
                    this.inFolder,
                    this.projectId,
                    this.attachmentCategory
                  )
                  .subscribe({
                    next: (result: { status: boolean; data: any[] }) => {
                      if (result.status) {
                        this.directories = [...result.data];
                        this.listOfFolders$ = of(this.directories);
                        this.loadingSpinnerService.setLoading(false);
                      }
                    },
                  });
              }
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

  stopClickPropagation(e) {
    e.stopPropagation();
  }

  downloadFolder(id) {
    this.attachmentService.downloadFolder(id, this.projectId);
  }

  getFileName(file) {
    return file.split(".")[0];
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

  editComment(event) {
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
        }
      });
  }

  emitRemoveFile() {
    this.removeFile.emit(this.deletedDocuments);
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
                this.emitRemoveFile();
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

  renameDirectory($event, directory, value) {
    $event.stopPropagation();
    if (directory.name != value) {
      let obj = {
        id: directory.Id,
        name: value,
      };
      this.attachmentService.renameFolder(obj).subscribe((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant("Successfully renamed folder."),
            this.translate.instant("Success")
          );
        }
      });
    }
  }

  // ************** Od novog dizajna (3.3.2023.g.) ***************

  public buttonToggle = true;
  public selectedTab = 0;
  public componentVisibility: number = 0;
  public listOfFolders$: Observable<any>;

  setSelectedTab(tab) {
    this.selectedTab = tab;
  }

  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;
  }

  onNewFile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "app-full-bleed-dialog";
    const refSelector = this.dialog.open(NewFileDialogComponent, dialogConfig);

    refSelector.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.loadingSpinnerService.setLoading(true);
          this.images = res.files.map((item: IFile) => {
            return {
              name: item.Name,
              belongs_to: this.inFolder,
              project_id: this.projectId,
              file: item.file,
              ataid: this.ataid,
              attachmentCategory: this.attachmentCategory,
              comment: res.description,
              id: null,
              album: -1,
              description: res.description,
            };
          });
          this.pdf_documents = res.pdf_documents.map((item: IFile) => {
            return {
              name: item.Name,
              belongs_to: this.inFolder,
              project_id: this.projectId,
              file: item.file,
              ataid: this.ataid,
              attachmentCategory: this.attachmentCategory,
              comment: res.description,
              id: null,
              album: -1,
              description: res.description,
            };
          });
          this.files = {
            images: this.images,
            pdfs: this.pdf_documents,
          };

          this.addNewFiles();
        }
      },
    });
  }

  onNewFolder() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      projectId: this.projectId,
      ataId: this.ataid,
      category: this.attachmentCategory,
      belongsTo: this.inFolder,
    };

    dialogConfig.panelClass = "app-full-bleed-dialog";
    const dialogRef = this.dialog.open(NewFolderDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: (_) => {
        if (this.activatedRoute.snapshot.queryParamMap.get("folder")) {
          this.listOfFolders$ = this.attachmentService
            .getAttachment(this.inFolder, this.projectId)
            .pipe(
              map((resp: { status: boolean; data: {} }) => {
                const putFolderInList = [];
                putFolderInList.push(resp.data);
                this.loadingSpinnerService.setLoading(false);
                return putFolderInList;
              })
            );
        } else {
          this.attachmentService
            .getAttachments(
              this.inFolder,
              this.projectId,
              this.attachmentCategory
            )
            .subscribe({
              next: (result: { status: boolean; data: any[] }) => {
                if (result.status) {
                  this.directories = [...result.data];
                  this.listOfFolders$ = of(this.directories);
                  this.loadingSpinnerService.setLoading(false);
                }
              },
            });
        }
      },
    });
  }

  onNewComment() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(NewCommentDialogComponent, dialogConfig);
  }



  somethingDeleted() {
    this.attachmentService.isDeleted.subscribe({
      next: (_) => {
        if (this.activatedRoute.snapshot.queryParamMap.get("folder")) {
          this.listOfFolders$ = this.attachmentService
            .getAttachment(this.inFolder, this.projectId)
            .pipe(
              map((resp: { status: boolean; data: {} }) => {
                const putFolderInList = [];
                putFolderInList.push(resp.data);
                return putFolderInList;
              })
            );
        } else {
          this.attachmentService
            .getAttachments(
              this.inFolder,
              this.projectId,
              this.attachmentCategory
            )
            .subscribe({
              next: (result: { status: boolean; data: any[] }) => {
                if (result.status) {
                  this.directories = [...result.data];
                  this.listOfFolders$ = of(this.directories);
                }
              },
            });
        }
        this.loadingSpinnerService.setLoading(false);
      },
    });
  }

  private readonly searchSubject = new Subject<string | undefined>();
  filterView(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }

  @ViewChild("inputSearch") inputSearch;
  isLoading: boolean = false;

  clearSearchText() {
    this.inputSearch.nativeElement.value = "";
    this.isLoading = true;
    this.attachmentService
      .getAttachments(this.inFolder, this.projectId, this.attachmentCategory)
      .pipe(take(1))
      .subscribe({
        next: (result: { status: boolean; data: any[] }) => {
          if (result.status) {
            this.listOfFolders$ = of(result.data);
          }
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.resSub) {
      this.resSub.unsubscribe();
    }
    if (this.getTranslationsSub) {
      this.getTranslationsSub.unsubscribe();
    }

    this.searchSubscription.unsubscribe();
    this.commentSubscription.unsubscribe();
  }
}
