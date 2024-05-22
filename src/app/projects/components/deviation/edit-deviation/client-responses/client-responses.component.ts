import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-client-responses',
  templateUrl: './client-responses.component.html',
  styleUrls: ['./client-responses.component.css', '../edit-deviation.component.css']
})
export class ClientResponsesComponent implements OnInit {

  @Input('responses') responses;
  @Input('deviationStatus') deviationStatus;
  @Input('isDev') isDev = false;
  @Input('isAta') isAta = false;


  public swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null
  };

  constructor() { }

  ngOnInit() {
    this.checkClientResponses();
    this.responses.forEach(res => {
      if(res.client_message != null || res.client_message != undefined){
        if(this.responses.length>0){
          setTimeout(()=>{
          if(!this.isAta&&!this.isDev){
              this.autogrow();
            }
          }, 1000);
        }
      }
    });
  }


  autogrow(){
    let  textArea = document.getElementById("clientResponse")
    textArea.style.overflow = 'hidden';
    textArea.style.minHeight  = '55px';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  filterClientResponses() {

  }

  checkClientResponses() {

    const len = this.responses.length;

    if (this.deviationStatus == 2) {
      this.responses[len - 1].accepted = 1;
    }
  }

  // generateAttachmentImageArray(answer) {

  //   return {
  //     file_path: answer.Url,
  //     image_path: answer.image_path,
  //     document_type: answer.image_path ? "Pdf" : "Image",
  //     Url: answer.Url,
  //     name: answer.name
  //   };
  // }

  generateAttachmentFileArray(answer) {

    if (answer.document_type === "Pdf") {
      return {
        file_path: answer.file_path,
        document_type: "Pdf",
        Url: answer.Url,
      };
    } else if (answer.document_type === "Image") {
      return {
        file_path: answer.file_path,
        document_type: "Image",
        Url: answer.Url,
      };
    }
  }


  openAttachmentSwiper2(file, files, index) {

    if (file.document_type == "Pdf") {
      this.openSwiper(index, files, 0);
      return;
    }
    let images = files.filter((file_) => {
      return file_.document_type != "Pdf";
    });

    images = images.map((image, i) => {
      if (image.url == file.url) {
        index = i;
      }
      return this.generateAttachmentFileArray(image);
    });
    this.openSwiper(index, images, 0);
  }

  openAttachmentSwiper(answer) {

    const images = [this.generateAttachmentFileArray(answer)];
    this.openSwiper(0, images, 0);
  }

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {

    if (files[index].document_type === 'Image') {
      this.isPDFViewer = false;
      this.swiper = {
        active: index,
        images: files,
        album: album,
        index: -1,
        parent: null
      }

    } else {
      this.isPDFViewer = true;
      const fileArray = this.createFileArray(files[index]);
      this.swiper = {
        active: 0,
        images: fileArray,
        album: album,
        index: index,
        parent: files[index]
      };
    }
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null
    }
  }

  createFileArray(file) {

    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
    //const image_path = file.image_path;
    const file_path = file.file_path;

    const fileArray = file_path.split(",").map((fileArray)=>{
      return {
        image_path: fileArray,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path
      };
    });
    return fileArray;
  }

  setStatus(answer, key) {
    let obj = {};

    if (answer.Status == 2) {
      // Löpande arbete
      const text = answer.accepted ? 'Accepted' : 'Ongoing work';
      obj = { color: '#BFE29C', text: text };
    }
    if (answer.Status == 4) {
      // Beställer åtgärd
      const text = answer.accepted ? 'Accepted' : 'Ordering action';
      obj = { color: '#BFE29C', text: text };
    }
    if (answer.Status == 1 || answer.Status == 0) {
      // Fraga
      obj = { color: '#FD9A44', text: 'Question'};
    }
    if (answer.Status == 3) {
      // Ingen åtgärd
      obj = { color: '#FD4444', text: 'Declined'};
    }

    if (answer.Status == 6) {
      // Ingen åtgärd
      obj = { color: '#92eb34', text: 'Respond'};
    }

    if (answer.Status == 9) {
      // Svar
      obj = { color: '#bfe29c', text: 'Client Answer'};
    }
    return obj[key];
  }

  setBorder(len, index) {
    if (len > 0 && index < len && this.deviationStatus == 3) {
      return '3px solid red'
    }
    return '';
  }



}
