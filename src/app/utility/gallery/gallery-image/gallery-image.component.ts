import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef

} from "@angular/core";
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: "app-gallery-image",
    templateUrl: "./gallery-image.component.html",
    styleUrls: ["./gallery-image.component.css"],
})
export class GalleryImageComponent implements OnInit {

    public image = {
        id: -1
    };
    public spinner = true;
    @Input("image") set setImage(value) {
        this.loadingScale = 0;
        if (this.image !== value) {
            this.image = value;
            this.svgState = -1;
            this.refreshImage();
        }
    };
    @Input("index") index: any;
    @Input("updateComment") updateComment: boolean;


    comment = new FormControl("");
    active: number = -1;
    @ViewChild("imageContainer") imageContainer!: ElementRef;
    @Output() updateCommentEvent = new EventEmitter<any>();
    @Output() numberOfData = new EventEmitter<any>();

    @Input("active") set setActive(value) {
        if (this.active !== value) {
            this.spinner = true;
            this.active = value;
            this.setXTranslation();
        }
    };

    @Input() set rotation(value: any) {
        this.rotateBy(value)
    }

    @Input() set cursormove(value: any) {
        if (value) {
            this.move = value
        } else {
            this.move = false;
        }
    }

    @Input() set zoomButton(value: any) {
        if (value !== null || value !== undefined) {
            this.zoomFromParent = value
        }
        this.zoomButtons(value)
    }

    name: any;

    tObj: {
        scale: number;
        panning: boolean;
        pointX: number;
        pointY: number;
        start: { x: number; y: number };
    } = {
            scale: 1,
            panning: false,
            pointX: 0,
            pointY: 0,
            start: { x: 0, y: 0 },
        };
    zoomTtranslate = "translate(0px, 0px) scale(1)";
    translateX = "translate(0px, 0px) scale(1)";
    rotate = 0;
    move = false;
    zoomFromParent = 0;
    loadingScale = 0;
    commentOpen = false;
    commentEdit = false;

    imageUrl: any = '';

    svgCode: SafeHtml = '';
    svgState: number = -1;

    constructor(public sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.refreshImage();
    }

    refreshImage() {
        this.imageUrl = this.getUrl();
        this.comment.patchValue(this.getDescription());
    }

    ngAfterViewInit() {
        this.setXTranslation();
    }

    getDescription() {
        return this.getActiveAttribute(["description", "Description"]);
    }

    getUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.getActiveAttribute(["Url", "url", "image_path", "file"]));
    }

    setPreviewUrl() {
        this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getActiveAttribute(["previewUrl"]));
        this.loadingScale = 1;
    }

    getActiveAttribute(names) {
        const image = this.image;
        let name = "";
        for (let i = 0; i < names.length; i++) {
            const key = names[i];
            if (image[key]) {
                name = image[key];
                break;
            }
        }
        return name;
    }

    async setTransform() {
        this.zoomTtranslate = `translate( ${this.tObj.pointX}px, ${this.tObj.pointY}px) scale(${this.tObj.scale})`;
    }


    zoomButtons(s) {
        this.tObj.pointX = -18 * s;
        this.tObj.pointY = -9.5 * s;
        this.tObj.scale = 1 + (2 * s / 100);

        this.setTransform();
    }

    onMouseDown(e) {
        e.preventDefault();
        this.tObj.start = {
            x: e.clientX - this.tObj.pointX,
            y: e.clientY - this.tObj.pointY,
        };
        this.tObj.panning = true;
    }

    onMouseUp(e) {
        this.tObj.panning = false;
    }

    leaveWindow() {
        this.tObj.panning = false
    }

    onMouseMove(e) {

        if (this.move === false) return;
        e.preventDefault();
        if (!this.tObj.panning) {
            return;
        }
        this.tObj.pointX = e.clientX - this.tObj.start.x;
        this.tObj.pointY = e.clientY - this.tObj.start.y;
        this.setTransform();
    }

    onWheel(e) {
        e.preventDefault();

        const xs = (e.clientX - this.tObj.pointX) / this.tObj.scale,
            ys = (e.clientY - this.tObj.pointY) / this.tObj.scale,

            delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;

        delta > 0 ? (this.tObj.scale *= 1.2) : (this.tObj.scale /= 1.2);

        this.tObj.pointX = e.clientX - xs * this.tObj.scale;
        this.tObj.pointY = e.clientY - ys * this.tObj.scale;

        this.setTransform();
    }

    setXTranslation() {
        if (!this.imageContainer) { return; }

        const container = this.imageContainer.nativeElement.getBoundingClientRect();
        const containerWidth = container.width;

        this.translateX = `translate( ${-this.active * containerWidth}px, 0px)`;
        this.rotate = 0;
        this.tObj = {
            scale: 1,
            panning: false,
            pointX: 0,
            pointY: 0,
            start: { x: 0, y: 0 },
        };
        this.setTransform();
    }

    rotateBy(deg) {
        this.rotate = + deg;
    }

    loadingImage(event) {
        if (event && event.target)
            this.spinner = false;
    }

    scaleImage() {
        this.loadingScale = 1;
    }

    toggleCommentOpen() {
        this.commentEdit = false;
        this.commentOpen = !this.commentOpen;
    }

    toggleCommentEdit() {
        this.commentOpen = false;
        this.commentEdit = !this.commentEdit;
    }

    saveComment() {
        if (
            this.comment.value !==
            this.getActiveAttribute(["description", "Description"])
        ) {
            this.updateCommentEvent.emit({
                id: this.image.id,
                comment: this.comment.value,
            });
        }
    }

    isPdf(): boolean {
        return false;
        if(this.image['name'].endsWith('pdf')) {
            if(this.svgState == -1) {
                this.loadSvg();
                this.svgState = 0;
            }
            return true;
        }
        return false;
    }

    loadSvg() {

        fetch(`/${this.image['image_path'].trim()}`, { mode: "cors" })
        .then((response) => response.text())
        .then(svg =>  {
            this.svgCode = this.sanitizer.bypassSecurityTrustHtml(svg);
            this.svgState = 1;

            this.scaleImage();
        })
    }

}
