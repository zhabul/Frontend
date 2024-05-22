import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";

import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";

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

@Component({
  selector: "app-image-modal-comment",
  templateUrl: "./image-modal-comment.component.html",
  styleUrls: [
    "./image-modal-comment.component.css",
    "../../../utility/image-preview.css",
  ],
})
export class ImageModalCommentComponent implements OnInit {
  public spinner = false;
  public chooseFile = false;
  public uploadImages = [];
  public uploadPdfs = [];
  public images: IFile[] = [];
  public documents: IFile[] = [];
  public removed_files: any[] = [];
  public modalForm: FormGroup;
  public data: any;
  public showAttachmentImage = false;
  public currentAttachmentPdf = null;
  public showPdf: boolean = false;
  public wrapper: any;
  public viewer: any;
  public currentAttachmentImage = null;
  public fileOver: boolean = false;
  @Input("inFileUploadDialog") inFileUploadDialog: boolean = false;
  @ViewChild("fileDropRef") fileDropEl: ElementRef;
  @Output() updateAlbums = new EventEmitter<any>();
  @Output("isMouseEnterDragZone") isMouseEnterDragZone =
    new EventEmitter<boolean>(false);
  @Input("infoObject") infoObject: any;
  @Input("fileType") fileType: any;
  @Input("type") type: any;
  @Input("limit") limit: any = Infinity;
  @Input("allowedDocuments") allowedDocuments: any = Infinity;
  @Input("key") key: any;
  @Input("clearFiles") clearFiles: any;
  @Input("info") info;
  @Input("widthAndHeight") widthAndHeight: any = {};

  public clearFilesSubscription: any;
  isInDragZone: boolean = false;

  public swiper = {
    images: [],
    active: -1,
    album: -2,
  };

  public albums: any = {};
  public countImages = [];
  public countImagesFromInfo = [];
  constructor(
    public sanitizer: DomSanitizer,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.limit == -1) {
      this.limit = Infinity;
    }
    if (this.clearFiles) {
      this.clearFilesSubscription = this.clearFiles.subscribe(() => {
        this.albums = {};
      });
    }
  }

  ngOnDestroy() {
    if (this.clearFilesSubscription) {
      this.clearFilesSubscription.unsubscribe();
    }
  }

  onFileDropped($event) {
    this.documentsOnChange({ target: { files: $event } });
    this.isMouseEnterDragZone.emit(false);
    this.isInDragZone = false;
  }

  getAlbumKeys() {
    return Object.keys(this.albums).sort(function (a, b) {
      return Number(b) - Number(a);
    });
  }

  getAlbumImages(albumKey) {
    return this.albums[albumKey].images;
  }

  getAlbumPdfs(albumKey) {
    return this.albums[albumKey].pdfs;
  }

  documentsOnChange(event) {
    this.chooseFile = true;
    const files = event.target.files;
    const image_formates = [
      "png",
      "jpeg",
      "jpg",
      "tiff",
      "psd",
      "eps",
      "ai",
      "indd",
      "raw",
      "heic",
      "webp",
      "bmp",
      "gif",
      "cr2",
      "nef",
      "orf",
      "sr2",
      "hdr",
      "heif",
      "avif",
      "ppm",
      "pgm",
      "pbm",
      "pnm",
    ];

    if (files && files.length) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        const fileName = file.name;
        let type = image_formates.includes(fileName.split(".").pop())
          ? "image"
          : file.type;

        if (!type) {
          type = fileName.split(/[#?]/)[0].split(".").pop().trim();
        }

        const url = URL.createObjectURL(file);
        reader.onload = () => {
          let obj = {
            file: file,
            name: fileName,
            previewUrl: url,
          };

          if (
            type == "application/pdf" &&
            this.fileType === "application/pdf, image/*"
          ) {
            this.uploadPdfs.push(obj);
          } else if (type.includes("image") || type.includes("heic")) {
            this.uploadImages.push(obj);
          } else if (type.includes("application")) {
            this.uploadPdfs.push(obj);
          }

          if (
            this.uploadPdfs.length + this.uploadImages.length ===
            files.length
          ) {
            this.addToArray();
          }
        };
      });
    } else {
      this.chooseFile = false;
    }
  }

  addImagesToArray(currentCount, description) {
    let flag = false;
    const images = [];

    for (let i = 0; i < this.uploadImages.length; i++) {
      const image = this.uploadImages[i];
      if (currentCount < this.limit) {
        images.push({
          id: null,
          file: image.file,
          //Url: image.file,
          name: image.name,
          Name: image.name,
          description: description,
          previewUrl: image.previewUrl,
          content_id: this.infoObject.content_id,
          content_type: this.infoObject.content_type,
          type: this.infoObject.type,
          type_id: this.infoObject.type_id,
          created: true,
          document_type: "Image",
          deleted: false,
        });
        currentCount = currentCount + 1;
      } else {
        this.toastr.error(
          this.translate.instant(
            "Number of allowed documents: " + this.allowedDocuments + " !"
          )
        );
        flag = true;
        break;
      }
    }

    return { flag: flag, files: images };
  }

  addPdfsToArray(currentCount, description) {
    let flag = false;
    const documents = [];

    for (let i = 0; i < this.uploadPdfs.length; i++) {
      const pdfs = this.uploadPdfs[i];
      if (currentCount < this.limit) {
        documents.push({
          id: null,
          file: pdfs.file,
          Url: pdfs.previewUrl,
          name: pdfs.name,
          Name: pdfs.name,
          description: description,
          content_id: this.infoObject.content_id,
          content_type: this.infoObject.content_type,
          type: this.infoObject.type,
          type_id: this.infoObject.type_id,
          created: true,
          document_type: "Pdf",
          deleted: false,
        });
        currentCount = currentCount + 1;
      } else {
        this.toastr.error(this.translate.instant("Only 2 files allowed."));
        flag = true;
        break;
      }
    }

    return { flag: flag, files: documents };
  }

  addToArray() {
    const currentCount = this.images.length + this.documents.length;
    const description = "";

    const images = this.addImagesToArray(currentCount, description);
    let pdfs = { flag: true, files: [] };
    if (images.flag === false) {
      pdfs = this.addPdfsToArray(currentCount, description);
    }

    const index = this.decideOnAlbumIndex();

    this.albums[index] = {
      images: images.files,
      pdfs: pdfs.files,
      description: "",
    };

    this.updateAlbums.emit(this.albums);
    this.uploadImages = [];
    this.uploadPdfs = [];
    this.fileDropEl.nativeElement.value = "";
    this.albums = {};

    this.toastr.success(
      this.translate.instant("TSC_SUCCESSFULLY_ADDED_ITEMS"),
      this.translate.instant("Success")
    );
  }

  removeFile(albumKey, index, type) {
    this.albums[albumKey][type].splice(index, 1);

    if (
      this.albums[albumKey]["pdfs"].length === 0 &&
      this.albums[albumKey]["images"].length === 0
    ) {
      delete this.albums[albumKey];
    }
    this.updateAlbums.emit(this.albums);
  }

  decideOnAlbumIndex() {
    const keys = this.getAlbumKeys();
    let index = 1;

    if (keys.length > 0) {
      index = Number(keys[0]) + 2;
    } else if (this.key) {
      index = Number(this.key) + 2;
    }

    return index;
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

  onMouseEnterDragZone(e = null) {
    this.isInDragZone = true;
    this.isMouseEnterDragZone.emit(true);
  }

  onMouseLeaveDragZone(event = null) {
    this.isInDragZone = false;
    this.isMouseEnterDragZone.emit(false);
  }

  removeSwiperImage(event) {
    const index = event.index;
    const album = event.album;
    this.removeFile(album, index, "images");
  }
}
