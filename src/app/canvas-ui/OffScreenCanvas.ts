import { Config } from "../moments/project-moments/resource-planning-app/Config";
import { IOffscreenCanvas } from "./interfaces/IOffscreenCanvas";
import { BackgroundImagePattern } from "./models/BackgroundImagePattern";

export class OffScreenCanvas implements IOffscreenCanvas {
    private canvasElement: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    protected offScreenRenderItems: BackgroundImagePattern[] = [];

    protected matrix = [];

    protected matrixOfSize = [];

    protected isRendered = false;

    private maxSize: any = null;

    private tempCanvas: HTMLCanvasElement;
    private tempContext: CanvasRenderingContext2D;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        canvasElementId: string
    ) {
        this.canvasElement = document.getElementById(
            canvasElementId
        ) as HTMLCanvasElement;

        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.canvasElement.style.left = `${x}px`;
        this.canvasElement.style.top = `${y}px`;
        this.canvasElement.style.display = "none";
        this.context = this.canvasElement.getContext("2d");
        this.context.imageSmoothingEnabled = true;

        this.tempCanvas = document.createElement('canvas');
        this.tempContext = this.tempCanvas.getContext("2d");
        this.tempContext.imageSmoothingEnabled = true;
    }

    destruct() {
        this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempCanvas.width = 0;
        this.tempCanvas.height = 0;
        this.tempCanvas.remove();

        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasElement.width = 0;
        this.canvasElement.height = 0;
        this.canvasElement.parentNode.removeChild(this.canvasElement);

        this.offScreenRenderItems = [];
    }

    setCanvasSize(width: number, height: number) { }

    setCanvasMaxSize(width: number, height: number) {
        this.canvasElement.width = width;
        this.canvasElement.height = height;

        this.tempCanvas.width = width;
        this.tempCanvas.height = Config.cellHeight;

        this.maxSize = {
            width: width,
            height: height
        };
    }

    render(
        width: number,
        height: number,
        xOffset: number = 1,
        yOffset: number = 1
    ) {
        this.tempContext.beginPath();
        this.tempContext.clearRect(0, 0, width, Config.cellHeight);

        this.offScreenRenderItems.forEach((p) => {
            const matrix = new DOMMatrixReadOnly([
                p.width / p.image.width,
                0,
                0,
                p.height / p.image.height,
                p.offsetX * xOffset,
                p.offsetY * yOffset,
            ]);
            p.pattern.setTransform(matrix);
            this.tempContext.fillStyle = p.pattern;
            this.tempContext.fillRect(0, 0, width, Config.cellHeight);
        });
        this.tempContext.closePath();

        this.context.beginPath();
        this.context.clearRect(0, 0, width, height);

        const pattern = this.context.createPattern(this.tempCanvas, "repeat-y");

        this.context.fillStyle = pattern;
        this.context.fillRect(0, 0, width, height);

        this.context.closePath();
    }

    reRender() {
        this.isRendered = false;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvasElement;
    }

    round(num: number): number {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    drawImage(
        context: CanvasRenderingContext2D,
        sx: number,
        sy: number,
        sWidth: number,
        sHeight: number,
        dx: number,
        dy: number,
        dWidth: number,
        dHeight: number
    ) {
        if (this.maxSize == null) return;

        if (!this.isRendered) {
            this.render(this.canvasElement.width, this.canvasElement.height);
            this.isRendered = true;
        }

        const cellHeight = 25;

        const offsetY = sy / cellHeight % 1;
        const numOf = Math.floor(dHeight / cellHeight);
        const _offset = Math.round(((cellHeight * offsetY) + Number.EPSILON) * 100) / 100;

        if (offsetY > 0) {
            context.drawImage(
                this.canvasElement,
                sx,
                _offset,
                sWidth,
                cellHeight - _offset,
                dx,
                dy,
                dWidth,
                _offset
            );

            dy = dy - _offset;
        }

        for (let i = 0; i <= numOf; i++) {
            context.drawImage(
                this.canvasElement,
                sx,
                0,
                sWidth,
                cellHeight,
                dx,
                dy + (i * cellHeight),
                dWidth,
                cellHeight
            );
        }
    }

    async addBackgroundImagePattern(
        name: string,
        imageId: string,
        width: number,
        height: number,
        repetition: string = "no-repeat",
        offsetX: number = 0,
        offsetY: number = 0,
        order: number = 0
    ) {
        const backgroundImage = document.getElementById(
            imageId
        ) as HTMLImageElement;

        this.offScreenRenderItems.push({
            image: backgroundImage,
            width,
            height,
            name,
            pattern: this.context.createPattern(backgroundImage, repetition),
            offsetX,
            offsetY,
            order,
        });

        this.offScreenRenderItems = this.offScreenRenderItems.sort(
            (a: BackgroundImagePattern, b: BackgroundImagePattern) =>
                a.order - b.order
        );
    }

    removeBackgroundImagePattern(name: string) {
        this.offScreenRenderItems = this.offScreenRenderItems.filter(
            (img) => img.name != name
        );
    }
}
