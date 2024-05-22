import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ImageModalUtility } from "../../image-modal/image-modal-utility.service";

@Component({
  selector: "app-email-log-attachments-modal",
  templateUrl: "./email-log-attachments-modal.component.html",
  styleUrls: ["./email-log-attachments-modal.component.css"],
  providers: [ImageModalUtility],
})
export class EmailLogAttachmentsModalComponent implements OnInit {
  public attachments = [];
  images = [];
  pdfs = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.attachments = this.data.attachments;
    this.sortFileTypes();
  }

  sortFileTypes() {
    const uniqueFiles = {};

    this.attachments.forEach((file) => {
      if (file && file.document_type == "Image") {
        if (!uniqueFiles[file.name] || !uniqueFiles[file.url]) {
          if (this.images.findIndex((image) => image.url == file.url) == -1) {
            this.images.push(file);
          }
          uniqueFiles[file.url] = true;
        }
      } else if (file) {
        if (!uniqueFiles[file.name] || !uniqueFiles[file.url]) {
          if (this.pdfs.findIndex((pdf) => pdf.url == file.url) == -1) {
            this.pdfs.push(file);
          }
          uniqueFiles[file.url] = true;
        }
      }
    });
  }

  public swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

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
      const imageArray = this.createFileArray(files[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: imageArray,
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

  createFileArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    // const image_path = image.image_path;
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
}
