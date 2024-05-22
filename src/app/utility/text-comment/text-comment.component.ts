import { Component, Input, OnInit, Output, EventEmitter, HostBinding, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { CanDeactivateComp } from "src/app/projects/components/project/components/payment-plan/can-deactivate";
import { Com } from "../comment-section/com";
import Quill from 'quill';
import { Subject } from 'rxjs';
import { ImageModalUtility } from "src/app/projects/components/image-modal/image-modal-utility.service";
import { FileStorageService } from 'src/app/core/services/file-storage.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

const Embed = Quill.import('blots/embed');

export class SmartBreakBlot extends Embed
{
	static create()
	{
		const node: HTMLElement = super.create();
		return node
	}
}

SmartBreakBlot.blotName = 'smartbreak';
SmartBreakBlot.tagName = 'br';

Quill.register(SmartBreakBlot);

@Component({
  selector: "app-text-comment",
  templateUrl: "./text-comment.component.html",
  styleUrls: ['./text-comment.component.css'],
  host: {'class': 'quill-editor'},
  providers: [ ImageModalUtility ]
})
export class TextCommentComponent implements OnInit, CanDeactivateComp {
  canDeactivate(): boolean {
    return !this.isDirty;
  }
  @HostBinding('class') class = 'quill-editor';
  @ViewChild('quillEditorElement') quillEditorElement;
  @ViewChild('imageWrapper') imageWrapper: ElementRef;
  @ViewChild('quill-editor') qlEditor: ElementRef;
  isDirty: boolean = false;
  icon: boolean = false;
  fontfamilys: any;
  getName: any;
  defaultfont: string;
  fWeight: boolean = false;
  name = "Angular 6";
  htmlContent = "";
  commentForm: FormGroup;
  textAlign: any;
  defaultAlign: string;
  sparaShow: boolean = false;
  comInfo: Com = new Com();
  commentsData: any;
  fill = 'rgb(68, 68, 68)';
  @Input() rows;
  @Input() index;
  @Input() info;
  @Input("canAttachFiles") canAttachFiles = true;
  @Input('canUploadFiles') canUploadFiles = true;
  @Input('canRemoveFiles') canRemoveFiles = true;
  @Input('content_type') content_type = 'PaymentPlan';
  @Input("infoStatus") set setInfoStatus(value) {
    if (value !== this.infoStatus) {
      this.infoStatus = value;
    }
  }
  @Input() visible;
  @Input() disabledDeleteIcon = false;
public stopWriting: boolean = false
  albums: any[] = [];
  $_clearFiles: Subject<void> = new Subject<void>();
  public images: any[] = [];
  public infoObjectComment = {
    content_type: "",
    content_id: null,
    type: "Comment",
    images: this.images,
    type_id: null
  };


  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

public lengthAlpha: number;
height: number;

  infoStatus = false;
  @Output() deleteChild: EventEmitter<any> = new EventEmitter();
  @Output() postChild: EventEmitter<any> = new EventEmitter();
  @Output() buttonDisabled: EventEmitter<any> = new EventEmitter();

  public modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'header': [false] }],
      [{ 'background': [] }],
      [{ 'align': [] }],
      [{ 'color': [] }],
    ],
    keyboard: {
      bindings: {
          linebreak: {
              key: 13,
              shiftKey: true,
              handler: function(range) {
                  this.quill.insertEmbed(range.index, 'smartbreak', true, '');
                  this.quill.setSelection(range.index + 1, '');
                  return false;
              }
          }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: PaymentPlanService,
    private imageModalUtility: ImageModalUtility,
    private fsService: FileStorageService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.setStartCharNumber();
    this.commentForm = this.fb.group({
      body: [ this.info.comment,  Validators.maxLength(4000)],
      name: [ this.info.name ],
    });
    this.info.index = this.index;
    this.infoObjectComment = { ...this.infoObjectComment, content_type: this.content_type };
  }

  ngAfterViewInit() {
    this.isQuillDisabled();
  }
  // ngAfterViewChecked(){
  //   this.checkHeight();
  // }

  public disabled = false;
  isQuillDisabled() {
    if (this.info.disabled === undefined) return;
    this.disabled = this.info.disabled;

    if (this.disabled) {
      this.quillEditorElement.disabled = true;
    }
  }


  checkHeight() {

    const wrapper = this.imageWrapper;
    if (wrapper) {
      const el = this.imageWrapper.nativeElement;
      return {
           height: el.offsetHeight - 80  + 'px'
         };
    }

    return {};
  }

  setStartCharNumber(){
   const len =  this.stripTags(this.info.comment)
    this.lengthAlpha = len.length;
  }

  updateAlbumsComment(event) {
    if (this.disabled) return;
    this.albums = event;
    const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);
    this.fsService.mergeFilesAndAlbums(albumFiles).then((response: any) => {

      if(response != null) {
        this.info.images = this.info.images.concat(response.images);
        this.info.pdfs = this.info.pdfs.concat(response.pdfs);
      }

    });

    this.isDirty = true;
    this.postChild.emit(this.info);
    this.buttonDisabled.emit(this.info);

  }

  getAlbumImagesClient() {
    return this.info["images"];
  }

  getAlbumPdfsClient() {
    return this.info["pdfs"];
  }

  getAlbumKeys() {
    let keys = [];
      if (this.info["files"]) {
        const files = this.info["files"];
        keys = Object.keys(files).sort(function (a, b) {
          return Number(b) - Number(a);
        });
      };

    return keys;
  }

  getAlbumFiles(albumKey, type) {
    if(this.info["files"]){
      const files = this.info["files"][albumKey][type];

      return files;
    }
  }

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {

    const firstElement = files[0];
    const name = firstElement.name;

    if (name.endsWith('pdf')) {
      this.isPDFViewer = true;
    }else{
      this.isPDFViewer = false;
    }

    if (files[index].document_type === "Image") {
      this.swiper = {
        active: index,
        images: files,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const fileArray = this.createFileArray(files[index]);
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

  toggleAttachment(albumKey, index, type) {
    const file = this.info["files"][albumKey][type][index];

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
          this.http
            .removeSelectedFile(file)
            .subscribe((res: any) => {
              if (res.status) {
                this.info["files"][albumKey][type] =
                this.info["files"][albumKey][type].filter((file_: any) => {
                    return file_.id != file.id;
                  });
              } else {
                this.toastr.error(this.translate.instant("Error"));
              }
            });
        }
      });
  }

  removeFileClient(index, type) {
    if(type == 'pdfs'){
      this.info["pdfs"].splice(index, 1)
    }else{
      this.info["images"].splice(index, 1)
    }

    // this.albums[type].splice(index, 1);
  }

  addOrRemoveFilesFromDeleteArray(file, status, type) {
    if (status) {
      file.deleteType = type;
      this.info.removed_images.push(file);
    } else {
      this.info.removed_images = this.info.removed_images.filter((file_)=>{
          return file.id != file_.id;
      });
    }

  }

  createFileArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    //const image_path = image.image_path;
    const file_path = file.file_path;

    const fileArray = file_path.split(",").map((fileString) => {
      return {
        image_path: fileString,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });
    return fileArray;
  }

  created(event: any) {
    event.root.innerHTML = this.info.comment;
  }

  iconRotate() {
    this.icon = !this.icon;
    this.toggleSpara();
  }

  onChange(fon) {
    this.defaultfont = fon;
  }

  changeAlignment(ali) {
    this.textAlign = ali;
  }

  boldTrue() {
    this.fWeight = !this.fWeight;
  }

  toggleSpara() {
    this.sparaShow = !this.sparaShow;
  }

  postCommment() {
    this.isDirty = false;
    this.postChild.emit(this.info);
  }

  deleteComment() {
    // console.log("delete",$event)
    // $event.preventDefault();
    // $event.stopPropagation();
    this.deleteChild.emit(this.info);
  }

  commentOnChange(value) {
    // const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);
    // console.log(albumFiles);

    // const newFiles = albumFiles.images.concat(albumFiles.pdfs);

    // const attachments = newFiles;
    // const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);
    // this.fsService.mergeFilesAndAlbums(albumFiles).then((response: any) => {
    //   this.info.images = [];

    //   if(response != null) {
    //     this.info.images = response.images;
    //   }
    // });

    this.isDirty = true;
    this.info.comment = value;
    this.postChild.emit(this.info);
    this.buttonDisabled.emit(this.info);
    //this.$_clearFiles.next();
    // this.albums = [];
    // this.images = [];
    // this.info.removed_images = [];
  }

  textChanged($event) {
    const MAX_LENGTH = 4000;
    const lent =  this.stripTags($event.html)


    this.lengthAlpha = lent.length

    var difference = ($event.editor.getLength() - this.lengthAlpha) + MAX_LENGTH -1;

    if (this.lengthAlpha > MAX_LENGTH) {
      $event.editor.deleteText(difference, this.lengthAlpha);
    }
  }

  stripTags(html) {
    var uname = new String(html)
    var result = "";
    var add = true, c;
    for (var i = 0; i < uname.length; i++) {
      c = uname[i];
      if (c == '<') add = false;
      else if (c == '>') add = true;
      else if (add) result += c;
    }
    return result;
  };



  getNameOfCom() {
    this.http.getName(this.route.snapshot.params["id"]).subscribe({
      next: (res) => {
        this.getName = res["data"];
      },
      error: (err) => {
        alert(err);
      },
    });
  }

  getPickerOptions() {
    return this.quillEditorElement.elementRef.nativeElement.getElementsByClassName('ql-picker-options')[1];
  }

  clickOnColorPicker() {
    const pickerOptions = this.getPickerOptions();
    const styles = window.getComputedStyle(pickerOptions);
    const display = styles.display;
    if (display == 'none') {
      pickerOptions.style.display = 'block';
      return;
    }
    pickerOptions.style.display = 'none';
  }

  catchBubbleClick() {
    const coloredSvg = this.quillEditorElement.elementRef.nativeElement.getElementsByClassName('ql-color-label')[0];
    const styles = window.getComputedStyle(coloredSvg);
    this.fill = styles.fill;
    const pickerOptions = this.getPickerOptions();
    pickerOptions.style.display = 'none';
  }

  changePropertyMarginLeft(margin_left){

    const style = {
        'margin-left': margin_left + "px"
    };

    return style;
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

  removeSwiperImage(event) {
    const index = event.index;
    const album = event.album;
    const type = event.type;
    this.toggleAttachment(album, index, type);
  }

  removeSelectedDocuments(event) {
    event.stopPropagation();

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
          const data = {
            documents:
              this.info.removed_images,
          };
          this.http
            .removeSelectedImages(data)
            .subscribe((res: any) => {
              if (res.status) {
                this.removeSelectedDocumentsOnClientSide();
              } else {
                this.toastr.error(this.translate.instant("Error"));
              }
            });
        }
      });
  }

  removeSelectedDocumentsOnClientSide() {
    this.info.removed_images.forEach((doc) => {
      const albumKey = doc.album;
      this.info["files"][albumKey]["images"] =
      this.info["files"][albumKey][
          "images"
        ].filter((file: any) => {
          return file.id != doc.id;
        });
      this.info.images = this.info.images.filter(
        (_file) => {
          return doc.id != _file.id;
        }
      );
        this.clearAlbum(albumKey);
    });

    this.info.removed_images = [];
  }

  clearAlbum(albumKey) {
    const album = this.info["files"][albumKey];
    const imagesLength = album.images ? album.images.length : 0;

    if (imagesLength === 0) {
      delete this.info["files"][albumKey];
    }
  }
}
