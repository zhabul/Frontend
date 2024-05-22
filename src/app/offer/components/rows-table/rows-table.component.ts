import { Component, OnInit, Input, Output, EventEmitter, HostBinding, ViewChild  } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PaymentPlanService } from "src/app/core/services/payment-plan.service";
import { Com } from "src/app/utility/comment-section/com";
import { Subject } from 'rxjs';
import { OffersService } from "src/app/core/services/offers.service";


@Component({
  selector: 'app-rows-table',
  templateUrl: './rows-table.component.html',
  styleUrls: ['./rows-table.component.css']
})
export class RowsTableComponent implements OnInit {
  @HostBinding('class') class = 'quill-editor';
  @ViewChild('quillEditorElement') quillEditorElement;
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
  @Input("infoStatus") set setInfoStatus(value) {
    if (value !== this.infoStatus) {
      this.infoStatus = value;
    }
  }
  public units: any[];

  @Input() articles: any[];
  public stopWriting: boolean = false
  albums: any[] = [];
  $_clearFiles: Subject<void> = new Subject<void>();
  public images: any[] = [];
  infoObjectComment = {
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

@Input() modalInfo;
@Output() addEmptyGroup = new EventEmitter();
@Output() triggerRowError = new EventEmitter();
public emptyArticleIndex = -1;
public modalPosition = {
  top: 0,
  left: 0,
};

dotsDiv: boolean = false;

  infoStatus = false;
  @Output() deleteChild: EventEmitter<any> = new EventEmitter();
  @Output() postChild: EventEmitter<any> = new EventEmitter();
  @Output() buttonDisabled: EventEmitter<any> = new EventEmitter();


  constructor(
    // private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: PaymentPlanService,
    offersService: OffersService
  ) {
    offersService.makeOffer.subscribe(() => {
    offersService.articles.next(this.articles);
  });}

  ngOnInit() {

    // this.commentForm = this.fb.group({
    //   body: [ this.info.comment,  Validators.maxLength(4000)],
    //   name: [ this.info.name ],
    // });
    //this.info.index = this.index;

    this.units = this.route.snapshot.data["units"];

    if (!this.articles) {
      this.articles = [
        {
          name: "",
          desc: "",
          unit: this.units[0],
          qty: 0,
          price: 0,
          sum: 0,
        },
      ];
    }

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


  changePropertyMarginLeft(margin_left){
    const style = {
        'margin-left': margin_left + "px"
    };
    return style;
  }

  createRowAbove() {
    if (this.emptyArticleExists()) {
      this.addEmptyGroup.emit({ ...this.modalInfo });
      this.modalInfo.keyIndex = this.modalInfo.keyIndex + 1;
    } else {
      this.triggerRowError.emit({
        ...this.modalInfo,
        emptyArticleIndex: this.emptyArticleIndex,
      });
    }
  }

  createRowBelow() {
     if (this.emptyArticleExists()) {
      this.addEmptyGroup.emit({
        ...this.modalInfo,
        keyIndex: this.modalInfo.keyIndex + 1,
      });
    } else {
      this.triggerRowError.emit({
        ...this.modalInfo,
        emptyArticleIndex: this.emptyArticleIndex,
      });
    }
  }

  emptyArticleExists() {
    const articleKeys = this.modalInfo.articleKeys;
    let flag = true;
    this.emptyArticleIndex = -1;
    for (let i = 0; i < articleKeys.length; i++) {
      const articles = this.modalInfo.articles;
      for (let j = 0; j < articles[articleKeys[i]].length; j++) {
        const valid = this.checkObjValidity(articles[articleKeys[i]]);
        if (!valid) {
          this.emptyArticleIndex = i;
          flag = valid;
          break;
        }
      }
    }


    return flag;
  }

  checkObjValidity(elem) {
    const valid = elem["Name"] !== "";
    return valid;
  }

   //Close popup
   closeP() {
    this.dotsDiv = false;
  }

popUp(index, article, event) {

  event.stopPropagation();
  this.dotsDiv = !this.dotsDiv;

  const elem = document.getElementById(
      "rad-table-" + index
  );

  const position = elem.getBoundingClientRect();

  this.modalPosition.top = position.top ;
  this.modalPosition.left = position.left + position.width;

  this.modalInfo = {
      index: index,
      article: article
  };
}

}
