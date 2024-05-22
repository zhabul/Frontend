import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../Config";
import { ProjectMomentsTableHead } from "./ProjectMomentsTableHead/ProjectMomentsTableHead";
import { RowListContainer } from "./RowListContainer";

export class ProjectMomentsRowContainer extends AScrollableContainerSchedule {

    private bottomOverlay: Rectangle;
    private rowList: RowListContainer;

    constructor(x: number, y: number, width: string|number, height: string|number, canvas: Canvas, parent) {
        super(x, y, width, height, canvas, parent);
        this.setBackgroundColor('#1A1A1A');
        this.setBorder('#1A1A1A', 1);
        this.setup();
    }

    getRowListContainer() { return this.rowList; }
    getBottomOverlay() { return this.bottomOverlay; }

    setup() {
        const rowNumberHead = new GenericContainer(0, ConfigSc.topSectionSize - ProjectMomentsTableHead.columnHeight, this.getWidth(), ProjectMomentsTableHead.columnHeight, this.canvas, this.innerContainer);
        rowNumberHead.setBackgroundColor('#1A1A1A');
        rowNumberHead.setBorder('#373B40', 1);

        const rowColumnText = new TextRenderer('Nr', this.canvas, rowNumberHead);
        rowColumnText.setColor('white');
        rowColumnText.setFontSize(11);
        rowColumnText.setAlignment('center', 'center');
        rowColumnText.updateTextDimensions();

        this.rowList = new RowListContainer(0, ConfigSc.topSectionSize, this.getWidth(), this.getHeight() - ConfigSc.topSectionSize, this.canvas, this);

        this.bottomOverlay = new Rectangle(0, this.getHeight() - ConfigSc.scrollbarSize, ConfigSc.cellHeight, ConfigSc.scrollbarSize, this.canvas, this);
        this.bottomOverlay.setBackgroundColor('#1A1A1A');
    }

    refreshDisplay() {
        this.rowList.refreshDisplay();
        this.bottomOverlay.draw();
    }

}
