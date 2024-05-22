import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { LoadingSpinnerService } from "src/app/core/services/loading-spinner.service";
import { TranslateService } from "@ngx-translate/core";
declare var $;

@Component({
  selector: "app-new-file-dialog",
  templateUrl: "./new-file-dialog.component.html",
  styleUrls: ["./new-file-dialog.component.css"],
})
export class NewFileDialogComponent implements OnInit {
  data;
  albums: any[] = [];
  images: any[] = [];
  hasItems: boolean = false;
  private imagesAndPdfs = new BehaviorSubject<any[]>([]);
  imagesAndPdfs$ = this.imagesAndPdfs.asObservable();
  infoObject = {
    content_type: "",
    content_id: null,
    type: "attachment",
    images: this.images,
    type_id: null,
  };
  info = {
    comment: null,
    content_id: "0",
    content_type: "attachment",
    files: [],
    images: [],
    index: 0,
    isDeleted: 0,
    name: "",
    pdfs: [],
  };

  returnedObject = {
    files: [],
    pdf_documents: [],
    removed_files: [],
    description: "",
    date: "",
  };
  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };
  files = [];
  description: string = "";
  date: string = "";
  public type: any = null;
  public language = "en";
  public week = "Week";
  public added_images: any[] = [];
  public added_documents: any[] = [];
  public removed_document: any[] = [];
  public limited: number = -1;
  public allowedDocuments: number = -1;

  constructor(
    private dialogRef: MatDialogRef<NewFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private toastr: ToastrService,
    private loadingSpinnerService: LoadingSpinnerService,
    private translate: TranslateService
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }
        
  ngOnInit(): void {
    if (this.modal_data && this.modal_data.type) {
      this.type = this.modal_data.type;

        if(this.modal_data && this.modal_data.active_education) {

          if(this.modal_data.active_education.images.length > 0) {
              this.date = this.modal_data.active_education.images[0].created_at;
              this.added_images = this.modal_data.active_education.images;
          }
          if(this.modal_data.active_education.pdfs.length > 0) {
              this.date = this.modal_data.active_education.pdfs[0].created_at;
              this.added_documents = this.modal_data.active_education.pdfs;
          }
          this.description = this.modal_data.active_education.name;
      }else {
          this.date = null;
          this.description = null;
      }

      if(this.modal_data.limited) {
        this.limited = this.modal_data.limited;
        this.allowedDocuments = this.modal_data.limited;
        this.initLimit();
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const datepickerOptions = {
        format: "yyyy-mm-dd",
        calendarWeeks: true,
        autoclose: true,
        language: this.language,
        todayHighlight: true,
        currentWeek: true,
        showWeek: true,
        currentWeekTransl: this.translate.instant("Week"),
        currentWeekSplitChar: "-",
        weekStart: 1,
      };
      $("#document-date")
        .datepicker(datepickerOptions)
        .on("changeDate", (ev) => {
          this.date = ev.target.value;
        })
        .on("blur", (e) => {
          this.date = e.target.value;
        });
    }, 500);
  }

  setImagesAndPdfs(item: any) {
    const currentValues = this.imagesAndPdfs.getValue();
    const updatedValues = [...currentValues, item];
    this.imagesAndPdfs.next(updatedValues);
  }

  onClose() {
    this.dialogRef.close();
  }

  updateAlbums(event) {
    this.albums = event;
    let total = 0;

    if (this.limited && this.limited > -1) {
      let image_previously_added = this.added_images.length;
      let document_previously_added = this.added_documents.length;
      let returnedObjectDocuments = 0;
      let retudnedObejctsImages = 0;
      let images_added = 0;
      let documents_added = 0;

      for (const key in this.albums) {
        images_added += this.albums[key].images.length;
        documents_added += this.albums[key].pdfs.length;
      }

      if (this.returnedObject && this.returnedObject.files.length > 0) {
        retudnedObejctsImages = this.returnedObject.files.length;
      }

      if (this.returnedObject && this.returnedObject.pdf_documents.length > 0) {
        returnedObjectDocuments = this.returnedObject.pdf_documents.length;
      }

      total =
        image_previously_added +
        document_previously_added +
        images_added +
        documents_added +
        retudnedObejctsImages +
        returnedObjectDocuments;

      if (total > this.allowedDocuments) {
        return;
      } else {
        this.limited = this.allowedDocuments - total;
      }
    }

    for (const key in this.albums) {
      for (const item of this.albums[key].images) {
        this.returnedObject.files.push(item);
        this.setImagesAndPdfs(item);
      }
      for (const item of this.albums[key].pdfs) {
        this.returnedObject.pdf_documents.push(item);
        this.setImagesAndPdfs(item);
      }
    }

    this.checkIfCanSave();
  }

  initLimit() {
    if (this.limited && this.limited > 0) {
      let image_previously_added = this.added_images.length;
      let document_previously_added = this.added_documents.length;
      let images_added = 0;
      let documents_added = 0;

      for (const key in this.albums) {
        images_added += this.albums[key].images.length;
        documents_added += this.albums[key].pdfs.length;
      }

      let total =
        image_previously_added +
        document_previously_added +
        images_added +
        documents_added;
      if (this.limited > total) {
        this.limited = this.limited - total;
      } else {
        this.limited = 0;
      }
    }
  }

  onRemoveObservable(name) {
    const currentValues = this.imagesAndPdfs.getValue();
    const updatedValues = currentValues.filter((x) => x.Name !== name);
    this.imagesAndPdfs.next(updatedValues);
    this.returnedObject.files = this.returnedObject.files.filter( (x) => x.Name !== name);
    this.returnedObject.pdf_documents = this.returnedObject.pdf_documents.filter((x) => x.Name !== name);
    this.limited += 1;
  }

    removeDocumentsFormDB(document, index, type) {
        this.removed_document.push(document);
        if(type == 'image') {
            this.added_images.splice(index, 1);
        }else {
            this.added_documents.splice(index, 1);
        }
        this.limited += 1;
        this.returnedObject.files = this.returnedObject.files.filter(
          (x) => x.Name !== name
        );
        this.returnedObject.pdf_documents =
          this.returnedObject.pdf_documents.filter((x) => x.Name !== name);
        this.limited += 1;
  }
/*
  removeDocumentsFormDB(document, index, type) {
    this.removed_document.push(document);
    if (type == "image") {
      this.added_images.splice(index, 1);
    } else {
      this.added_documents.splice(index, 1);
    }
    this.limited += 1;
  }
*/
  onSave() {
    this.returnedObject.removed_files = this.removed_document;
    this.returnedObject.description = this.description;
    this.returnedObject.date = this.date;
    if (
      this.returnedObject.files.length <= 0 &&
      this.returnedObject.pdf_documents.length <= 0 &&
      this.returnedObject.removed_files.length <= 0
    ) {
      this.toastr.error("Please select file to upload");
      return;
    }

    this.loadingSpinnerService.setLoading(true);
    this.dialogRef.close(this.returnedObject);
  }

  checkIfCanSave() {
    if (
      this.returnedObject.files.length <= 0 &&
      this.returnedObject.pdf_documents.length <= 0
    ) {
      this.hasItems = false;
    } else {
      this.hasItems = true;
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

  isPDFViewer: boolean = false;
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
  }

  OpenPreviewPdf(index, files, album){
    this.isPDFViewer = true;
    this.swiper = {
      active: 0,
      images: files,
      album: album,
      index: index,
      parent: files[index],
    };

  }

  createFileArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    // const image_path = file.image_path;
    const file_path = file.file_path;
    const previewUrl = file.Url;

    const fileArray = file_path.split(",").map((fileString) => {
      return {
        image_path: fileString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
        previewUrl: previewUrl,
      };
    });
    return fileArray;
  }

  getAlbumImagesClient() {
    return this.returnedObject.files;
  }

  isMouseEnterDragZone: boolean = false;
  isMouseEnterDragZoneFun(event: boolean) {
    this.isMouseEnterDragZone = event;
  }
}
