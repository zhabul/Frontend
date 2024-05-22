import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
} from "@angular/core";
import * as printJS from "print-js";


@Component({
    selector: "app-gallery",
    templateUrl: "./gallery.component.html",
    styleUrls: ["./gallery.component.css"],
    animations: [],
})


export class GalleryComponent implements OnInit {

    @Input("canRemove") canRemove: boolean = false;
    @Input("updateComment") updateComment: boolean = false;
    @Input("server") server: boolean = false;
    @Input('position') position = 'fixed';


    @ViewChild("imageContainer") imageContainer: ElementRef;
    @Output() closeSwiperEvent = new EventEmitter<any>();
    @Output() removeImageEvent = new EventEmitter<any>();
    @Output() updateCommentEvent = new EventEmitter<any>();
    @Output() setActive = new EventEmitter<any>();

    active: number = 0;
    translateX = "0px";
    zoomTranslate = "translate(0px, 0px) scale(0px)";
    keydownbind;
    file_path;
    containerClass = 'g-container';

    zoom = {
        scale: 1,
        panning: false,
        pointX: 0,
        pointY: 0,
        start: { x: 0, y: 0 },
    };

    swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    deg = 0;
    public rotation: number = 0;
    public zoomButton: any = 0;
    public cursormove: boolean = true;
    public hovered = {
        download: false,
        pdf: false
    };
    public styleMousClicked: any;
    public LeftArrow:any;
    public RightArrow: any;
    @Input("swiper") set setSwiper(value) {
        if (value !== this.swiper) {
            this.swiper = value;
            this.initSwiper();
        }
    };

    public marginL: any = {}

    constructor() { }

    ngOnInit() {
        this.marginL = this.swiper["margin"];
    }

    zoomBy(scale) {
        this.zoomButton = this.zoomButton + scale;
    }

    resetZoom() {
        this.zoomButton = 0;
        setTimeout(()=>{
            this.zoomButton = 0.00001;
        }, 0);
    }


    rotateBy(deg) {
        this.rotation = this.rotation + deg;
    }

    initSwiper() {
        this.keydownbind = this.keydownNext.bind(this);
        document.addEventListener("keydown", this.keydownbind, true);
        this.active = this.swiper.active;
        this.file_path = this.swiper.images[0].file_path;
        document.body.style.overflow = "hidden";
        if (this.position === 'relative') {
            this.containerClass = 'g-container-relative';
        }
    }

    ngOnDestroy() {
        document.body.style.overflow = "auto";
        if (this.keydownbind) {
            document.removeEventListener("keydown", this.keydownbind, true);
        }
    }

    next(coefficient) {
        this.active = this.active + coefficient;
        if (this.swiper.images[0].document_type) {
            this.setActive.emit(this.active);
        }
    }

    keydownNext(e) {
        const key = e.key;
        if (this.rightArrowCondition() && key === "ArrowRight") {
            this.active = this.active + 1;
        } else if (this.leftArrowCondition() && key === "ArrowLeft") {
            this.active = this.active - 1;
        } else if (key === "Escape") {
            this.closeSwiper();
        }
    }

    leftArrowCondition() {
        return this.active > 0;
    }

    rightArrowCondition() {
        const images = this.swiper.images;
        return this.active < images.length - 1;
    }

    getActiveAttribute(names) {

        const active = this.active;
        const images = this.swiper.images;
        let name: any = "";
        for (let i = 0; i < names.length; i++) {
            const key = names[i];
            if (images[active][key]) {
                name = images[active][key];
                break;
            }
        }

        return name;
    }

    activeUrl() {
        return this.getActiveAttribute(["Url", "url", "image_path", "file"]);
    }

    activeName() {
        return this.getActiveAttribute(["Name", "name"]);
    }

    activeDeleted() {
        let deleted = false;
        if (this.swiper.parent) {
            deleted = this.swiper.parent.deleted;
        } else {
            deleted = this.getActiveAttribute(["deleted", "Deleted"]);
        }

        return deleted;
    }

    activeFilePath() {

        return this.getActiveAttribute(["file_path", "url"]);
    }

    downloadActive() {
        let download_url = "";

        if (this.file_path) {
            const file_path = this.activeFilePath();
            download_url = file_path;
        } else {
            download_url = this.activeUrl();
        }
        return download_url;
    }

    fetchDocumentType(url) {
        return fetch(`/${url}`, { mode: "cors" })
            .then((response) => response.headers.get("content-disposition"))
            .then((data) => data);
    }

    printFile(ext, file_path, name) {

        if (ext === "pdf") {
            printJS({ printable: `${file_path}`, type: "pdf", documentTitle: name });
        } else {
            printJS({
                printable: `${file_path}`,
                type: "image",
                documentTitle: name,
            });
        }
    }

    printActive() {
        const name = this.activeName();

        if (this.file_path) {
            const file_path = this.activeFilePath();
            const index = file_path.indexOf("file");
            const realUrl = file_path.slice(index, file_path.length);

            const ext = name.split(".").pop();

            if (ext === "") {
                this.fetchDocumentType(realUrl).then((res) => {
                    const index = res.indexOf("filename");
                    const queryStrings = res.slice(index, res.length);

                    const urlParams = new URLSearchParams(queryStrings);
                    const fileName = urlParams.get("filename").replace(/(['"])/g, "");

                    const ext_ = fileName.split(".").pop();

                    this.printFile(ext_, `/${realUrl}`, name);
                });
            } else {
                this.printFile(ext, file_path, name);
            }
        } else {
            printJS({
                printable: `${this.activeUrl()}`,
                type: "image",
                documentTitle: name,
            });
        }
    }

    closeSwiper() {

        this.closeSwiperEvent.emit("close");
    }

    removeImage() {
        let active = this.active;
        let type = "images";
        const album = this.swiper.album;
        const index = this.swiper.index;
        if (this.active === this.swiper.images.length - 1 && !this.server) {
            this.active = this.active - 1;
        }

        if (index !== -1) {
            active = index;
            type = "pdfs";
        }

        this.removeImageEvent.emit({
            index: active,
            album: album,
            type: type,
        });
    }

    saveComment(e) {
        this.updateCommentEvent.emit(e);
    }
}
