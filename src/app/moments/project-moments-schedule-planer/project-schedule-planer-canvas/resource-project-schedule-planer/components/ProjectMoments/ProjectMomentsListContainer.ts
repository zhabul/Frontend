import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";
import { Canvas } from "src/app/canvas-ui/Canvas";

export class ProjectMomentsListContainer extends AScrollableContainerSchedule {
    constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
        super(x, y, width, height, canvas, parent);
        
    }
}
