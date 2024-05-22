import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-dots-popup",
  templateUrl: "./dots-popup.component.html",
  styleUrls: ["./dots-popup.component.css"],
})
export class DotsPopupComponent implements OnInit {
  @Input() modalInfo;
  @Output() addEmptyGroup = new EventEmitter();
  @Output() triggerRowError = new EventEmitter();
  public emptyArticleIndex = -1;
  constructor() {}

  ngOnInit() {}

  //Create table row
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
}
