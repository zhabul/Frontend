import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-image-modal-small',
    templateUrl: './image-modal-small.component.html',
    styleUrls: ['./image-modal-small.component.css']
})
export class ImageModalSmallComponent implements OnInit {

    @ViewChild("fileDropRef") fileDropRef: ElementRef;
    @Output('setFiles') setFiles: EventEmitter<any> = new EventEmitter();
    @Input('type') type;
    @Input('foldersInRow') foldersInRow = false;
    
    public file_pdfs = [];
    public file_images = [];
    public swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null
    };
    public imageModalSmallStyle = {};

    constructor() { }

    ngOnInit() {

        this.setImageModalSmallStyle();

    }

    setImageModalSmallStyle() {

        const flexDirection = this.setDirectionByType();

        this.imageModalSmallStyle = {
            display: '',
            flexDirection: flexDirection,
            justifyContent: 'space-between'
        };
    }

    setDirectionByType() {
        if (!this.type) return 'row';
        if (this.type.includes('vertical')) {
            return 'column-reverse';
        }
        return 'row';
    }

    onFileDropped($event) {
        this.documentsOnChange({ target: { files: $event } });
    }

    documentsOnChange(event) {
        const files = event.target.files;
        if (files && files.length) {
            Array.from(files).forEach((file: any) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                const fileName = file.name;
                const type = file.type;
                const url = URL.createObjectURL(file);

                reader.onload = () => {
                    const obj = {
                        file: file,
                        name: fileName,
                        previewUrl: url,
                        document_type: type.includes('image') ? 'Image' : 'Pdf',
                        newFile: true,
                        id: null,
                        album: -1,
                        description: ''
                    }
                    if (type.includes('image')) {
                        this.file_images.push(obj);
                        this.emitFiles();
                    } else if (type == 'application/pdf') {
                        this.file_pdfs.push(obj);
                        this.emitFiles();
                    }
                };
            });
        }

        event.target.value = '';
        this.fileDropRef.nativeElement.value = '';
    }


    generateAttachmentImageArray(inputFile) {
      const { file, attachment, image_path, previewUrl, document_type, name } = inputFile;
      return {
        file: file,
        file_path: attachment,
        image_path: image_path,
        previewUrl: previewUrl,
        document_type: document_type,
        name: name
      };
        // return {
        //     file: file.file,
        //     file_path: file.attachment,
        //     image_path: file.image_path,
        //     previewUrl: file.previewUrl,
        //     document_type: file.document_type,
        //     name: file.name
        // };
    }

    openAttachmentSwiper(file) {
        // const images = [this.generateAttachmentImageArray(file)];
        const images = [file];
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

            const fileArray = this.createFileArray(files[index]);
            this.isPDFViewer = true;
            if (!fileArray) { return };
            this.swiper = {
                active: 0,
                images: fileArray,
                album: album,
                index: index,
                parent: files[index]
            }
        }
    }

    createFileArray(file) {
        const id = file.id;
        const comment = file.Description;
        const name = file.Name ? file.Name : file.name;
        //const image_path = image.image_path;
        const file_path = file.previewUrl;

        // if (!file_path) { return; }

        const fileArray = file_path.split(",").map((fileArray) => {
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

    closeSwiper() {
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
            index: -1,
            parent: null
        }
    }

    removeFile($event, type) {
        this[type] = this[type].filter((img, index) => {
            return index != $event;
        })
        this.emitFiles();
    }

    emitFiles() {
        this.setFiles.emit({
            images: this.file_images,
            pdfs: this.file_pdfs
        });
    }
}
