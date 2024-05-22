import { Canvas } from "src/app/canvas-ui/Canvas";
import { Rectangle } from "src/app/canvas-ui/Rectangle";

export class ProjectPlanningCanvas extends Canvas {

    private selectionBorder: Rectangle;

    constructor(x: number, y: number, width: number, height: number, canvasElementId: string) {
        super(x, y, width, height, canvasElementId);
        this.setInstanceClass(ProjectPlanningCanvas);
    }

    getSelectedBorder() { return this.selectionBorder; }

    onSelectionEnd(x: number, y: number, width: number, height: number) {

    }

    findUsersInsideSelection(x: number, y: number, width: number, height: number) {

    }

    startSelection(x: number, y: number) {

    }
}
