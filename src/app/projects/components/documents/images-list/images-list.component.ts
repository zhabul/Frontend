import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css']
})
export class ImagesListComponent implements OnInit {

    public swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    public offDiv:boolean = false;
    @Input() documents;

    constructor() { }

    ngOnInit(): void {
    }

    downloadActive(data) {

        let url = data.url;
        const link = document.createElement("a");
        link.setAttribute("download", 'download');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    createFileArray(file) {
        const id = file.id;
        const comment = file.Description;
        const name = file.Name ? file.Name : file.name;
        //const image_path = file.image_path;
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

    openSwiper(index, files, album) {

        if (files[index].row_type !== "pdf" && files[index].row_type !== "Pdf") {
            this.swiper = {
                active: index,
                images: files,
                album: album,
                index: -1,
                parent: null,
            };
        }
        this.offDiv = true;
    }

    closeSwiper() {
        this.swiper = {
            images: [],
            active: -1,
            album: -2,
            index: -1,
            parent: null,
        };
        this.offDiv = false;
    }
}
