import { AContainer } from "./AContainer";
import { Canvas } from "./Canvas";
import { Config } from "../moments/project-moments/resource-planning-app/Config";
import { GenericContainer } from "./GenericContainer";
import { Rectangle } from "./Rectangle";
import { HorizontalScrollbar } from "./scrollbar/HorizontalScrollbar/HorizontalScrollbar";
import { VerticalScrollbar } from "./scrollbar/VerticalScrollbar/VerticalScrollbar";

export abstract class AScrollableContainer extends AContainer {
  protected innerContainer: GenericContainer;

  protected horizontalScrollbar: HorizontalScrollbar = null;
  protected verticalScrollbar: VerticalScrollbar = null;
  protected overlayGapBox: Rectangle;
  protected arrowUp: Rectangle;
  protected arrowDown: Rectangle;
  protected arrowLeft: Rectangle;
  protected arrowRight: Rectangle;
  protected backgroundRight: Rectangle;
  protected backgroundLeft: Rectangle;
  protected backgroundDown: Rectangle;
  protected backgroundUp: Rectangle;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.innerContainer = new GenericContainer(
      0,
      0,
      width,
      height,
      canvas,
      this
    );
    this.setOnMouseWheelHandler((e) => {
      if (this.verticalScrollbar !== null) {
        this.getVerticalScrollbar()
          .getSlider()
          .move(e.deltaY / Config.wheelScrollSensitivity);
      }
    });
  }

  getInnerContainer() {
    return this.innerContainer;
  }

  getHorizontalScrollbar() {
    return this.horizontalScrollbar;
  }
  getVerticalScrollbar() {
    return this.verticalScrollbar;
  }

  addHorizontalScrollbar() {
    this.horizontalScrollbar = new HorizontalScrollbar(
      Config.scrollbarSize,
      0,
      "100%",
      Config.scrollbarSize,
      this.canvas,
      this
    );
    this.horizontalScrollbar.setYAlignment("bottom");

    this.backgroundLeft = new Rectangle(
      0,
      0,
      Config.scrollbarSize,
      Config.scrollbarSize,
      this.canvas,
      this
    );
    this.backgroundLeft.setYAlignment("bottom");
    this.backgroundLeft.setBackgroundColor("#373B40");
    this.arrowLeft = new Rectangle(0, 0, 10, 10, this.canvas, this);
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
      0,
      0,
      Config.scrollbarSize,
      Config.scrollbarSize,
      this.canvas,
      this
    );
    this.backgroundRight.setXAlignment("right");
    this.backgroundRight.setYAlignment("bottom");
    this.backgroundRight.setBackgroundColor("#373B40");
    this.arrowRight = new Rectangle(0, 0, 10, 10, this.canvas, this);
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

    this.setupHorizontalScrollbar();

    this.arrowLeft.setOnClickHandler(() => {
      this.horizontalScrollbar
        .getSlider()
        .move(-this.horizontalScrollbar.getSlider().getWidth() / 2);
    });

    this.arrowRight.setOnClickHandler(() => {
      this.getHorizontalScrollbar()
        .getSlider()
        .move(this.horizontalScrollbar.getSlider().getWidth() / 2);
    });
  }

  protected setupHorizontalScrollbar() {
    this.innerContainer.setHeight(
      this.innerContainer.getHeight() - Config.scrollbarSize
    );
    if (this.horizontalScrollbar && this.verticalScrollbar) {
      this.createScrollOverlap();
      this.addOnClickHandler();
    } else if (this.horizontalScrollbar) {
      this.horizontalScrollbar.setWidthOffset(Config.scrollbarSize * 2);
      this.addOnClickHandler();
    }
  }

  addVerticalScrollbar() {
    this.verticalScrollbar = new VerticalScrollbar(
      0,
      Config.scrollbarSize,
      Config.scrollbarSize,
      "100%",
      this.canvas,
      this
    );
    this.verticalScrollbar.setXAlignment("right");

    this.arrowUp = new Rectangle(
      0,
      -Config.scrollbarSize,
      10,
      10,
      this.canvas,
      this
    );
    this.arrowUp.setXAlignment("right");
    this.arrowUp.addBackgroundImagePattern(
      "scroll-arrow-up",
      "scroll-arrow-up",
      10,
      6,
      "no-repeat"
    );
    this.arrowUp._renderOnce = true;

    this.arrowDown = new Rectangle(
      0,
      Config.scrollbarSize,
      10,
      10,
      this.canvas,
      this
    );
    this.arrowDown.setXAlignment("right");
    this.arrowDown.setYAlignment("bottom");
    this.arrowDown.setY(-3);
    this.arrowDown.addBackgroundImagePattern(
      "scroll-arrow-down",
      "scroll-arrow-down",
      10,
      6,
      "no-repeat"
    );
    this.arrowDown._renderOnce = true;

    this.setupVerticalScrollbar();

    this.arrowUp.setOnClickHandler(() => {
      this.verticalScrollbar
        .getSlider()
        .move(-this.verticalScrollbar.getSlider().getHeight() / 2);
    });

    this.arrowDown.setOnClickHandler(() => {
      this.verticalScrollbar
        .getSlider()
        .move(this.verticalScrollbar.getSlider().getHeight() / 2);
    });
  }

  protected setupVerticalScrollbar() {
    this.innerContainer.setWidth(
      this.innerContainer.getWidth() - Config.scrollbarSize
    );
    if (this.horizontalScrollbar && this.verticalScrollbar) {
      this.createScrollOverlap();
      this.addOnClickHandler();
    }
  }

  protected createScrollOverlap() {
    this.horizontalScrollbar.setWidthOffset(Config.scrollbarSize * 3);
    this.verticalScrollbar.setHeightOffset(Config.scrollbarSize * 3);
    this.overlayGapBox = new Rectangle(
      0,
      0,
      Config.scrollbarSize,
      Config.scrollbarSize,
      this.canvas,
      this
    );
    this.overlayGapBox.setXAlignment("right");
    this.overlayGapBox.setYAlignment("bottom");
    this.overlayGapBox.addBackgroundImagePattern(
      "logo",
      "logo",
      Config.scrollbarSize,
      Config.scrollbarSize,
      "no-repeat"
    );
  }

  protected addOnClickHandler() {
    if (this.horizontalScrollbar) {
      this.arrowLeft.setOnClickHandler(() => {
        this.getHorizontalScrollbar()
          .getSlider()
          .move(-this.getHorizontalScrollbar().getSlider().getWidth() / 2);
      });
      this.arrowRight.setOnClickHandler(() => {
        this.getHorizontalScrollbar()
          .getSlider()
          .move(this.getHorizontalScrollbar().getSlider().getWidth() / 2);
      });
    }
    if (this.verticalScrollbar) {
      this.arrowUp.setOnClickHandler(() => {
        this.getVerticalScrollbar()
          .getSlider()
          .move(-this.getVerticalScrollbar().getSlider().getHeight() / 2);
      });
      this.arrowDown.setOnClickHandler(() => {
        this.getVerticalScrollbar()
          .getSlider()
          .move(this.getVerticalScrollbar().getSlider().getHeight() / 2);
      });
    }
  }

  override draw() {
    if (!this.isVisible) return;
    this.canvas.getContext().save();

    this.drawShape(this.canvas.getContext());
    this.canvas.getContext().clip();
    this.children.forEach((child) => child.draw());

    this.canvas.getContext().restore();
  }
}
