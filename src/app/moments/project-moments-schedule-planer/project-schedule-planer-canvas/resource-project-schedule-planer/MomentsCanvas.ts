import { Canvas } from "src/app/canvas-ui/Canvas";

export class MomentsCanvas extends Canvas {
    constructor(x: number, y: number, width: number, height: number, canvasElementId: string) {
        super(x, y, width, height, canvasElementId);
        this.setInstanceClass(MomentsCanvas);
    }

    startSelection(x: number, y: number) {
        return;
    }
    onSelectionEnd(x: number, y: number, width: number, height: number) {
        return;
    }
}
