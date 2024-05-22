import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css', '../../../../utility/image-preview.css', '../image-modal.component.css'],
})
export class FilePreviewComponent implements OnInit {

	@Input("type") type;
	@Input("file") file;
	@Input("index") index;
	@Input("imageModal") imageModal;
	@Input("active") active;
	@Input('canRemove') set setCanRemove(value: boolean) {
		this.canRemove = value;
	}
	canRemove = true;
	@Output() removeFile = new EventEmitter<number>();
	@Output() openSwiper = new EventEmitter<number>();
  @Input("modalType") modalType = "default";
	@Input("showDate") showDate = true;
	@Input("width") rowWidth = 969; //in pixels
  @Input("offerEmail") offerEmail = false;

	public currentAttachmentPdf = null;
	public showPdf: boolean = false;
	public wrapper: any;
	public viewer: any;
	public currentAttachmentImage = null;
	public showAttachmentImage = false;
	public showLargePdfPreview = false;
	loaded = false;
	error = false;

	public pdfViewerStyle = {

	};

	constructor(public sanitizer: DomSanitizer) {}

	ngOnInit() {
		this.decideOnUrl();
	}

  private imageUrl: string = null;
	decideOnUrl() {
		// let image_path = "";
		// if (this.file['image_path']) {
		// 	image_path = this.file['image_path'].split(',')[0];
		// }

		// if (!image_path) {
		// 	image_path = this.file['previewUrl'] ? this.file['previewUrl'] :  this.file['Url']
		// }
    // console.log(image_path)
		// return image_path;
    // //   let image_path = this.file['image_path']?.split(',')[0];
    // // if (!image_path) {
    // //   image_path = this.file['previewUrl'] || this.file['Url'];
    // // }
    // // console.log(image_path);
    // // return image_path;
    if (this.imageUrl) {
      return this.imageUrl;
    }

    const image_path =
      this.file['image_path']?.split(',')[0] ||
      this.file['previewUrl'] ||
      this.file['Url'] ||
      this.file['file_path'] ||
      this.file['file'];

    this.imageUrl = image_path || '';

    return this.imageUrl;
	}

  @ViewChild('pdfContainer') pdfContainer: ElementRef;
  @ViewChild('folderElement', { static: false }) folderElement: ElementRef;
  @ViewChild('pdfPreview', { static: false }) pdfPreview: ElementRef;

  ngAfterViewInit() {
    const pdfContainer = this.pdfContainer?.nativeElement;

    const iframe = document.createElement('iframe');
    iframe.src = this.decideOnUrl();
    //iframe.type = 'application/pdf';
    iframe.classList.add('pdf-preview');
    iframe.style.width = '150%';
    iframe.style.height = '100%';
    iframe.style.overflow = 'hidden';
    iframe.style.border = 'none';
    iframe.style.position = 'relative !important';
    iframe.style.cursor = 'pointer';
    iframe.style.marginLeft = '1px';
    iframe.style.marginTop = '2px';
    iframe.style.marginRight = '1px';
    iframe.style.marginBottom = '2px';

    pdfContainer?.appendChild(iframe);

    this.toggleHoverState(false);

  }

  isHovered: boolean = false;

  toggleHoverState(hovered: boolean) {
    this.isHovered = hovered;

    const folderElement = this.folderElement?.nativeElement as HTMLElement;
    const pdfPreviewElement = this.pdfPreview?.nativeElement as HTMLElement;

    if (!pdfPreviewElement || !folderElement) {
      return;
    }

    const folderRect = folderElement.getBoundingClientRect();

    pdfPreviewElement.style.top = `${folderRect.top - pdfPreviewElement.offsetHeight / 4}px`;
    pdfPreviewElement.style.left = `${folderRect.right}px`;
  }

	setError() {
		this.error = true;
	}

	setLoaded() {
		if (this.file.document_type === 'Pdf' && !this.file.id) {
			return;
		}
		this.loaded = true;
	}

	decideOnDescription() {
		return this.file['description'] ? this.file['description'] : this.file['Description'] ? this.file['Description'] : '';
	}

	decideOnName() {
		if (this.file.name) {
			return this.file.name;
		}
		if ( this.file.Name) {
			return  this.file.Name;
		}
		return '';
	}


	@Output('openImage') openImage = new EventEmitter<null>();
  	openDocumentModal(event, type) {
		this.openImage.emit(null);
		const datasetDel = event.target.dataset.delete;
		event.stopPropagation();

		if (!datasetDel && type === 'preview_pdf') {
			// this.showLargePdfPreview = true;
      	this.openSwiper.emit(this.index);
		} else if (!datasetDel && type === 'image') {
			//if (this.error) {return;}
			this.openSwiper.emit(this.index);
		}else{
			if (this.error) {return;}
      		this.openSwiper.emit(this.index);
   		}
	}

	closeLargePreview() {
		this.showLargePdfPreview = false;
	}

	closeAttachmentImage() {
		this.currentAttachmentPdf = "";
	}

    emitRemoveFile(event) {
	  event.stopPropagation();
      this.removeFile.emit(this.index);
    }

}
