import { Component, OnInit, Input, Output, EventEmitter,ViewChild, ElementRef, HostListener} from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ImageModalOldComponent } from "src/app/projects/components/image-modal-old/image-modal-old.component";
import { FileStorageService } from "src/app/core/services/file-storage.service";
import { EducationDialogComponent } from "./education-dialog/education-dialog.component";

@Component({
  selector: "user-education",
  templateUrl: "./user-education.component.html",
  styleUrls: ["./user-education.component.css"]
})
export class UserEducation implements OnInit {
  @Input() username = "";
  @Input() userId: number = -1;
  @Output() toggleEducationEdit: EventEmitter<object> = new EventEmitter<object>;
  @Output() isDialogOpen: EventEmitter<boolean> = new EventEmitter<boolean>;
  @ViewChild('dropdownBtn') element: ElementRef;

  public arr:any = [];
  public toggleClicked = false;
  public clickedRow:any;
  public dropdownIsOpen:boolean = false;
  public y:any;
  public x:any;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public spinner;

  name = "";
  sending = false;
  educations = [];
  nameError = false;
  fetchError = false;
  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };
  public whichNumber: number[] = [];
  public selectedDocuments: {
    index: number;
    name: string;
    images:any[];
    pdfs:any[];
  }[] = [];
  public client_workers:any[] = [];

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UsersService,
    private fsService: FileStorageService,
  ) {}


  ngOnInit() {
    this.getEducations();
    this.getAllClientsWhereWorkingThisUser();

  }

  getEducations() {
    if (this.sending) {
      return false;
    }

    this.sending = true;

    this.userService
      .getEducationsForEditUser(this.userId)
      .subscribe({
        next: (res: any) => {
          this.sending = false;
          if (res.status) {
            this.educations = res.data;
          } else {
            this.fetchError = true;
          }
        },
        error: () => {
          this.fetchError = true;
        }
      });
  }

  toggleEducation(event, education) {
    const checked = event.target.checked;
    if (this.sending) {
      return false;
    }

    if (!checked && (education.images.length || education.pdfs.length)) {
      event.preventDefault();
      event.target.checked = true;
      this.toastr.info(
        this.translate.instant("Remove documents before unchecking."),
        this.translate.instant("Info")
      );
      return false;
    }

    this.sending = true;

    education.userId = this.userId;

    this.userService
      .toggleEducation(education)
      .subscribe((res: any) => {
        this.sending = false;

        if (res.status) {
          this.handleEducationAfterToggle(education, res.id);
        } else {
          this.toastr.error(
            this.translate.instant("Server Error."),
            this.translate.instant("Error")
          );
        }
      });
  }

  handleEducationAfterToggle(education, ued_id) {
    this.educations = this.educations.map((education_) => {
      if (education.id === education_.id) {
        return {
          ...education_,
          ued_id: ued_id === true ? null : ued_id,
        };
      }

      return education_;
    });
  }

  openImageModal(education): void {
    let object = {
      content_type: "Education",
      content_id: education.ued_id,
      type: "User",
      documents: education.pdf_documents,
      type_id: this.userId,
      noComment: true,
    };

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "50%";
    diaolgConfig.maxHeight = "550px";
    diaolgConfig.data = {
      data: object,
      type: ".xlsx, .docx, .png, .jpg, .jpeg, .pdf",
    };
    this.dialog
      .open(ImageModalOldComponent, diaolgConfig)
      .afterClosed()
      .subscribe(async(res) => {
        if (res && (res.pdf_documents.length || res.files.length)) {


            const albumFiles = {
                'images': res.files,
                'pdfs': res.pdf_documents
            };


          const _newAlbumFiles = await this.fsService.mergeFilesAndAlbums(albumFiles);


          if(_newAlbumFiles != null) {
            albumFiles.images = _newAlbumFiles.images;
            albumFiles.pdfs = _newAlbumFiles.pdfs;
          }

          this.uploadEducationDocuments(
            {
              documents: albumFiles.pdfs,
              images: albumFiles.images,
            },
            education
          );
        }
      });
  }

  uploadEducationDocuments(documents, education) {
    this.sending = true;

    this.userService.uploadEducationDocuments(documents).subscribe((res: any) => {
      this.sending = false;
      if (res.status) {
        education.images = [...education.images, ...res.images];
        education.pdfs = [...education.pdfs, ...res.documents];
      }
    });
  }

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {
    if (files[index].document_type === "Image" || files[index].name.endsWith('.jpg') || files[index].name.endsWith('.jpeg') || files[index].name.endsWith('.png')) {
      this.isPDFViewer = false;
      this.swiper = {
        active: index,
        images: files,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const fileArray = this.createImageArray(files[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: fileArray,
        album: album,
        index: index,
        parent: files[index],
      };
    }
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }


  createImageArray(file) {

    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
   // const image_path = image.image_path;
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


  toggleRemoveFile(education, file) {

    if (file.deleted) {
      education.removed_documents = education.removed_documents.filter(
        (file_) => {
          return file.id != file_.id;
        }
      );
    } else {
      education.removed_documents.push(file);
    }

    file.deleted = !file.deleted;
  }

  removeSelectedDocuments(education) {
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
          this.removeEducationDocumentsCall(education);
        }
      });
  }

  removeEducationDocumentsCall(education) {
    const removed_documents = education.removed_documents;
    this.sending = true;

    this.userService
      .removeEducationDocuments(removed_documents)
      .subscribe((res: any) => {
        this.sending = false;
        if (res.status) {
          education.images = education.images.filter((image) => {
            return !removed_documents.some((doc) => doc.id == image.id);
          });
          education.pdfs = education.pdfs.filter((pdf) => {
            return !removed_documents.some((doc) => doc.id == pdf.id);
          });
          education.removed_documents = [];

          this.toastr.success(
            this.translate.instant("Successfully deleted documents."),
            this.translate.instant("Success")
          );
        }
      });
  }


  toggleRow(event, name: string, index: number): void {
    this.educations[index] = {...this.educations[index], isChecked: event.target.checked};
    const isChecked = event.target.checked;

    if(isChecked) {
      this.whichNumber.push(index);
      const selectedDocument = {
        index: index,
        name: name,
        images: this.educations[index].images,
        pdfs: this.educations[index].pdfs,
      };
      this.selectedDocuments.push(selectedDocument);
    }
    else {
      this.whichNumber = this.whichNumber.filter(x => x != index);
      this.selectedDocuments = this.selectedDocuments.filter(x => x.index != index);
    }

    if(this.selectedDocuments.length == 0){
      this.dropdownIsOpen=false;
      this.isDialogOpen.emit(this.dropdownIsOpen);
    }

  }


  deleteEducation(event, index){
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
          this.whichNumber = this.whichNumber.filter(x => x != index);
          this.selectedDocuments = this.selectedDocuments.filter(x => x.index != index);
          this.educations = this.educations.filter(_education => _education.id != event);

          let obj = {
            'education_id': event,
            'user_id': this.userId
          }

          this.userService.deleteEducation(obj).subscribe((res: any) => {
          });
        }
      });
  }


  toggleWhiteSend() {
    if(!this.whichNumber.length) {
      this.toastr.info(this.translate.instant('Please select or write email'));
      return;
    }

    this.openDialog();

  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let selectedDocuments = [];
    for (let education of this.educations) {
      if (education.isChecked) selectedDocuments.push(education);
    }
    if(selectedDocuments.length == 0) {
      return;
    }
    dialogConfig.data = {
      selectedDocuments: selectedDocuments
    };
    const dialogRef = this.dialog.open(EducationDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(

      (data) => {


        if(data) {
          this.userService.sendDataToClients(data).subscribe((result:any) => {
            if(result.status) {
              this.toastr.info(
                this.translate.instant("You have successfully sent documents"),
                this.translate.instant("Info")
              );
            }
          })
        }
      }
    );
  }

  sendData(data) {
    this.spinner = true;
    this.userService.sendDataToClients(data).subscribe((result:any) => {
      if(result.status) {
        this.spinner = false;
        this.toastr.info(
          this.translate.instant("You have successfully sent documents"),
          this.translate.instant("Info")
        );
      }
    })
  }

  toggleDropdown(){
    if(this.selectedDocuments.length>0){
      this.dropdownIsOpen = !this.dropdownIsOpen;
      this.isDialogOpen.emit(this.dropdownIsOpen);
    }
  }

    toggleOnEdit(event, i) {
        this.toggleEducationEdit.next(event);
    }

    getAllClientsWhereWorkingThisUser() {
      this.userService.getAllClientsWhereWorkingThisUser(this.userId).then((res:any)=> {
          if(res.status) {
            this.client_workers = res.data;
          }
      });
    }

    clickedThreeDots(event,i){
      this.clickedRow = i;
      this.arr.push(event);
      if(this.arr.every(x => x == false)){
        this.toggleClicked = false;
      }else{
        this.toggleClicked = true;
      }
    }

   @HostListener('document:click' , ['$event'])
       ondocumentClick(event: MouseEvent){
        if(this.arr.length==0) {
          this.toggleClicked=false;
        }
         this.arr = [];
       }

}
