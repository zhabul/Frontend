import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";
import { BezierCurve } from "src/app/canvas-ui/BezierCurve";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Line } from "src/app/canvas-ui/Line";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";
import { GridHorizontalScrollbar } from "./HorizontalScrollbar/GridHorizontalScrollbar";
import { GridVerticalScrollbar } from "./VerticalScrollbar/GridVerticalScrollbar";

export class GridContainer extends AScrollableContainerSchedule {

  private lineConnections: any[] = [];

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.innerContainer.setWidth(2265);
    this.setOnMouseWheelHandler((e) => {
        if (e.deltaY !== 0) {
          this.getVerticalScrollbar()
            .getSlider()
            .move(e.deltaY / ConfigSc.wheelScrollSensitivity);
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
            .getMomentTableBodyContainer()
            .draw();
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
            .getRowNumbersContainer()
            .draw();

        }

        if (e.deltaX !== 0) {
          this.getHorizontalScrollbar()
            .getSlider()
            .move(e.deltaX / ConfigSc.wheelScrollSensitivity);
          CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
        }

        this.draw();
    });
  }

  getLineConnections() {
    return this.lineConnections;
  }
  addLineConnection(line: Line | BezierCurve) {
    this.lineConnections.push(line);
  }
  removeAllLineConnections() {
    this.lineConnections.length = 0;
  }

  override addHorizontalScrollbar() {
    this.horizontalScrollbar = new GridHorizontalScrollbar(
      ConfigSc.scrollbarSize,
      0,
      "100%",
      ConfigSc.scrollbarSize,
      this.canvas,
      this
    );
    this.horizontalScrollbar.setYAlignment("bottom");

    this.horizontalScrollbar.setWidth(this.horizontalScrollbar.getWidth() * CpspRef.cmp.pixelRation)

    this.backgroundLeft = new Rectangle(
      -ConfigSc.scrollbarSize,
      0,
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      this.canvas,
      this.horizontalScrollbar
    );
    this.backgroundLeft.setYAlignment("bottom");
    this.backgroundLeft.setBackgroundColor("#373B40");
    this.arrowLeft = new Rectangle(
      -ConfigSc.scrollbarSize,
      0,
      10,
      10,
      this.canvas,
      this.horizontalScrollbar
    );
    this.arrowLeft.setYAlignment("bottom");
    this.arrowLeft.setY(-3);
    this.arrowLeft.addBackgroundImagePattern(
      "scroll-arrow-left",
      "scroll-arrow-left",
      10,
      15,
      "no-repeat"
    );

    this.backgroundRight = new Rectangle(
      -ConfigSc.scrollbarSize,
      0,
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      this.canvas,
      this.horizontalScrollbar
    );
    this.backgroundRight.setXAlignment("right");
    this.backgroundRight.setYAlignment("bottom");
    this.backgroundRight.setBackgroundColor("#373B40");
    this.arrowRight = new Rectangle(
      -ConfigSc.scrollbarSize,
      0,
      10,
      10,
      this.canvas,
      this.horizontalScrollbar
    );
    this.arrowRight.setXAlignment("right");
    this.arrowRight.setYAlignment("bottom");
    this.arrowRight.setY(-3);
    this.arrowRight.addBackgroundImagePattern(
      "scroll-arrow-right",
      "scroll-arrow-right",
      10,
      15,
      "no-repeat"
    );
    this.getHorizontalScrollbar().setWidth(this.getWidth() - 1* ConfigSc.scrollbarSize);
    this.setupHorizontalScrollbar();

    this.arrowLeft.setOnClickHandler(() => {
          this.horizontalScrollbar.getSlider().move(-this.horizontalScrollbar.getSlider().getWidth() / 2);
      });

      this.arrowRight.setOnClickHandler(() => {
          this.getHorizontalScrollbar().getSlider().move(this.horizontalScrollbar.getSlider().getWidth() / 2);
      });
  }

  override addVerticalScrollbar() {
    this.verticalScrollbar = new GridVerticalScrollbar(
      0,
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      "100%",
      this.canvas,
      this
    );
    this.verticalScrollbar.setXAlignment("right");

    this.backgroundUp = new Rectangle(
      0,
      -ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      this.canvas,
      this.verticalScrollbar
    );
    this.backgroundUp.setBackgroundColor("#373B40");
    this.arrowUp = new Rectangle(
      3,
      -ConfigSc.scrollbarSize,
      10,
      10,
      this.canvas,
      this.verticalScrollbar
    );
    this.arrowUp.setHeightOffset(10);
    this.arrowUp.addBackgroundImagePattern(
      "scroll-arrow-up",
      "scroll-arrow-up",
      10,
      6,
      "no-repeat"
    );

    this.backgroundDown = new Rectangle(
      0,
      -ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      ConfigSc.scrollbarSize,
      this.canvas,
      this.verticalScrollbar
    );
    this.backgroundDown.setYAlignment("bottom");
    this.backgroundDown.setBackgroundColor("#373B40");
    this.arrowDown = new Rectangle(
      3,
      -ConfigSc.scrollbarSize,
      10,
      10,
      this.canvas,
      this.verticalScrollbar
    );
    this.arrowDown.setYAlignment("bottom");
    this.arrowDown.addBackgroundImagePattern(
      "scroll-arrow-down",
      "scroll-arrow-down",
      10,
      6,
      "no-repeat"
    );

    this.getVerticalScrollbar().setHeight(this.getHeight() - 1* ConfigSc.scrollbarSize)
    this.setupVerticalScrollbar();

    this.arrowUp.setOnClickHandler(() => {
        this.verticalScrollbar.getSlider().move(-this.verticalScrollbar.getSlider().getHeight() / 2);
    });

    this.arrowDown.setOnClickHandler(() => {
        this.verticalScrollbar.getSlider().move(this.verticalScrollbar.getSlider().getHeight() / 2);
    });
  }

  override getGridContainerBoundaries() : any {
    return {
      x: this.getGlobalX(),
      y: this.getGlobalY(),
      width: this.getWidth(),
      height: this.getHeight(),
    };
  }

  override draw() {
    this.canvas.getContext().save();

    super.drawShape(this.canvas.getContext());
    this.canvas.getContext().clip();

    this.innerContainer.draw();
    this.lineConnections.forEach((line) => line.draw());

    this.horizontalScrollbar.draw();
    this.backgroundLeft.draw();
    this.arrowLeft.draw();
    this.backgroundRight.draw();
    this.arrowRight.draw();
    this.verticalScrollbar.draw();
    this.backgroundUp.draw();
    this.arrowUp.draw();
    this.backgroundDown.draw();
    this.arrowDown.draw();
    this.overlayGapBox.draw();

    this.canvas.getContext().restore();

  }
}
