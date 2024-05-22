import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

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
  previewUrl: any;
  album: any;
}

@Component({
  selector: "app-image-modal-old",
  templateUrl: "./image-modal-old.component.html",
  styleUrls: ["./image-modal-old.component.css"],
})
export class ImageModalOldComponent implements OnInit {
  public spinner = false;
  public chooseFile = false;
  public uploadImage = "";
  public uploadPdf = "";
  public files: IFile[] = [];
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
  public limit = Infinity;
  public fileType = "application/pdf, image/*";
  public fileNames = [];
  @ViewChild("fileDropRef") fileDropEl: ElementRef;

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private toastr: ToastrService, 
    public dialogRef: MatDialogRef<ImageModalOldComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    let data = this.modal_data.data;

    if (this.modal_data.type) {
      this.fileType = this.modal_data.type;
    }

    if (this.modal_data.limit) {
      this.limit = this.modal_data.limit;
    }

    if (data.images && data.images.length > 0) this.files = data.images;

    if (data.documents && data.documents.length > 0)
      this.documents = data.documents;

    this.modalForm = this.fb.group({
      content_type: [data.content_type, [Validators.required]],
      content_id: [data.content_id, [Validators.required]],
      name: ["", [Validators.required]],
      type: [data.type, [Validators.required]],
      type_id: [data.type_id, [Validators.required]],
      description: ["", [Validators.required]],
      image: ["", [Validators.required]],
      pdf_documents: ["", [Validators.required]],
    });
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.documentsOnChange({ target: { files: [$event[0]] } });
  }

  documentsOnChange(event) {
    this.chooseFile = true;
    this.uploadImage = "";

    const user_id = "";

    if (event.target.files && event.target.files.length) {
      Array.from(event.target.files).forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        let fileName = `${user_id}_${file.name}`;
        let type = file.type;
        let url = '';

        if (
          type == "application/pdf" &&
          this.fileType === "application/pdf, image/*"
        ) {
          this.uploadPdf = fileName;
        } else if (type.includes("image")) {
          url = URL.createObjectURL(file);
          this.uploadImage = fileName;
        } else if (this.fileType === ".xlsx, .docx, .png, .jpg, .jpeg, .pdf") {
          this.uploadPdf = fileName;
        }

        reader.onload = () => {
          let obj = {
            file: file,
            previewUrl: url,
            name: `${user_id}_${file.name}`,
          };
          ("this.uuidv4()");

          if (
            type == "application/pdf" &&
            this.fileType === "application/pdf, image/*"
          ) {
            this.modalForm.get("name").patchValue(this.uploadPdf);
            this.modalForm.get("pdf_documents").patchValue(obj);
            this.modalForm.get("image").patchValue({ file: null });
          } else if (type.includes("image")) {
            this.modalForm.get("name").patchValue(this.uploadImage);
            this.modalForm.get("image").patchValue(obj); 
            this.modalForm.get("pdf_documents").patchValue({ file: null });
          } else if (
            this.fileType === ".xlsx, .docx, .png, .jpg, .jpeg, .pdf"
          ) {
            this.modalForm.get("name").patchValue(this.uploadPdf);
            this.modalForm.get("pdf_documents").patchValue(obj);
            this.modalForm.get("image").patchValue({ file: null });
          }
        };
      });
      event.target.value = "";
    } else {
      this.chooseFile = false;
    }
    this.uploadImage = this.uploadImage.slice(0, -2);
  }

  removeImages(index, type = "Images") {
    if (type == "Images") { 
      this.removed_files.push(this.files[index].id);
      this.files.splice(index, 1);
    } else {
      this.removed_files.push(this.documents[index].id);
      this.documents.splice(index, 1);
    }
  }

  addToArray() {
    this.data = this.modalForm.value;

    const currentCount = this.files.length + this.documents.length;

    if (this.data.image.file && currentCount < this.limit) {

      this.files.unshift({
        id: null,
        file: this.data.image.file,
        previewUrl: this.data.image.previewUrl,
        Url: this.data.image.file.file,
        name: this.data.image.name,
        Name: this.data.image.name,
        description: this.data.description,
        content_id: this.data.content_id,
        content_type: this.data.content_type,
        type: this.data.type,
        type_id: this.data.type_id,
        created: true,
        document_type: "Image",
        album: 1,
      });

      this.modalForm.get("name").patchValue("");
      this.modalForm.get("image").patchValue("");
      this.modalForm.get("pdf_documents").patchValue("");
      this.modalForm.get("description").patchValue("");
      this.uploadImage = null;
      this.uploadPdf = null;
      this.toastr.success(
        this.translate.instant("You have successfully added item."),
        this.translate.instant("Success")
      );
    } else if (this.data.pdf_documents.file && currentCount < this.limit) {
      this.documents.unshift({
        id: null,
        file: this.data.pdf_documents.file,
        Url: this.data.pdf_documents.file,
        name: this.data.pdf_documents.name,
        previewUrl: this.data.image.previewUrl,
        Name: this.data.pdf_documents.name,
        description: this.data.description,
        content_id: this.data.content_id,
        content_type: this.data.content_type,
        type: this.data.type,
        type_id: this.data.type_id,
        created: true,
        document_type: "Pdf",
        album: 1,
      });

      this.modalForm.get("name").patchValue("");
      this.modalForm.get("image").patchValue("");
      this.modalForm.get("pdf_documents").patchValue("");
      this.modalForm.get("description").patchValue("");
      this.uploadImage = null;
      this.uploadPdf = null;
      this.toastr.success(
        this.translate.instant("You have successfully added item."),
        this.translate.instant("Success")
      );
    } else {
      this.toastr.error(this.translate.instant('No more files allowed.'));
    }
  }

  addImages() {
    let obj = {
      files: this.files,
      pdf_documents: this.documents,
      removed_files: this.removed_files,
    };
    this.dialogRef.close(obj);
  }

  openDocumentModal(doc) {
    let formatPath = doc.slice(-3);

    if (formatPath == "pdf") {
      this.showPdf = true;
      this.currentAttachmentPdf =
        this.sanitizer.bypassSecurityTrustResourceUrl(doc);
    } else {
      this.currentAttachmentImage = doc;
      this.showPdf = false;
    }
    this.toggleAttachmentImage();
  }

  toggleAttachmentImage(e = null) {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showAttachmentImage = !this.showAttachmentImage;
  }
}
