import { Canvas } from "src/app/canvas-ui/Canvas";
import { VerticalScrollbar } from "src/app/canvas-ui/scrollbarSchedule/VerticalScrollbar/VerticalScrollbar";

import { ConfigSc } from "../../../Config";
import { GridVerticalScrollbarSlider } from "./GridVerticalScrollbarSlider";

export class GridVerticalScrollbar extends VerticalScrollbar {
    constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
        super(x, y, width, height, canvas, parent);

        this.setOnClickHandler((e) => {
            (this.slider as GridVerticalScrollbarSlider).moveYWithClick(e.layerY - this.slider.getY() - this.getGlobalY());
        });
    }

    override createSlider() {
        this.slider = new GridVerticalScrollbarSlider(0, 0, ConfigSc.scrollbarSize, this.getHeight(), this.canvas, this);
    }
}
