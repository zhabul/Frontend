import { CmpRef } from "../moments/project-moments/resource-planning-app/CmpRef";
import { Config } from "../moments/project-moments/resource-planning-app/Config";
import { AContainer } from "./AContainer";
import { Canvas } from "./Canvas";
import { GenericContainer } from "./GenericContainer";
import { GenericRoundedContainer } from "./GenericRoundedContainer";
import { Rectangle } from "./Rectangle";
import { TextRenderer } from "./TextRenderer";

export class DropdownContainer extends AContainer {
  private isButtonHoverd: boolean = false;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent = null
  ) {
    super(x, y, width, height, canvas, parent);
  }

  createButton() {
    const button = new GenericRoundedContainer(
      0,
      0,
      this.getWidth(),
      this.getHeight(),
      this.canvas,
      this
    );
    button.setBackgroundColor("#373B40");
    button.setBorder("#858585", 1.5);
    button.setBorderRoundness(6);

    button.setOnClickHandler(() => {
      if(!Config.isInEditMode) return;
      this.showMenu();
    });

    const buttonText = new TextRenderer(
      "  " + CmpRef.cmp.getTranslate().instant("RPC_Absence"),
      this.canvas,
      button
    );
    buttonText.setColor("#858585");
    buttonText.setFontSize(13);
    buttonText.setAlignment("left", "center");
    buttonText.updateTextDimensions();

    const icon = new Rectangle(0, 0, 30, 30, this.canvas, button);
    icon.addBackgroundImagePattern("indicator-icon", "expand-more", 30, 30);
    icon.setXAlignment("right");

    button.setOnMouseHoverHandler((e) => {
      if(!Config.isInEditMode) return;
      document.body.style.cursor = "pointer";
      if (!this.isButtonHoverd) {
        icon.removeBackgroundImagePattern("indicator-icon");
        icon.addBackgroundImagePattern(
          "indicator-icon",
          "expand-more-hover",
          30,
          30
        );
        button.setBorder("#F77E04", 1.5);
        buttonText.setColor("#F77E04");

        button.draw();
        buttonText.draw();
        icon.draw();

        this.isButtonHoverd = true;
      }
    });

    this.getParent().setOnMouseHoverHandler((e) => {
      if(!Config.isInEditMode) return;
      if (this.isButtonHoverd) {
        icon.removeBackgroundImagePattern("indicator-icon");
        icon.addBackgroundImagePattern("indicator-icon", "expand-more", 30, 30);
        button.setBorder("#858585", 1.5);
        buttonText.setColor("#858585");

        button.draw();
        buttonText.draw();
        icon.draw();

        this.isButtonHoverd = false;

        CmpRef.cmp.planningApp.toolboxContainer.draw();
      }
    });
  }

  showMenu() {
    const container = new GenericRoundedContainer(
      0,
      0,
      this.getWidth(),
      70,
      this.canvas,
      this
    );
    container.setBackgroundColor("#373B40");
    container.setBorder("#858585", 1.5);
    container.setBorderRoundness(6);

    this.canvas.setForeground(container);

    const button = new GenericRoundedContainer(
      0,
      0,
      this.getWidth(),
      this.getHeight(),
      this.canvas,
      container
    );

    button.setOnClickHandler(() => {
      this.canvas.setForeground(null);
      this.removeChildById(container.getId());
      CmpRef.cmp.planningApp.toolboxContainer.draw();
    });

    const buttonText = new TextRenderer(
      "  " + CmpRef.cmp.getTranslate().instant("RPC_Absence"),
      this.canvas,
      button
    );
    buttonText.setColor("#F77E04");
    buttonText.setFontSize(13);
    buttonText.setAlignment("left", "center");
    buttonText.updateTextDimensions();

    const icon = new Rectangle(0, 0, 30, 30, this.canvas, button);
    icon.addBackgroundImagePattern("indicator-icon", "expand-less", 30, 30);
    icon.setXAlignment("right");

    const menuBtn = new GenericContainer(
      6,
      32,
      this.getWidth() - 12,
      this.getHeight(),
      this.canvas,
      container
    );
    menuBtn.setBackgroundColor("#fcba5e");

    const menuBtnText = new TextRenderer(
      CmpRef.cmp.getTranslate().instant("RPC_Absenc_add_update"),
      this.canvas,
      menuBtn
    );
    menuBtnText.setColor("#373B40");
    menuBtnText.setFontSize(13);
    menuBtnText.setAlignment("center", "center");
    menuBtnText.updateTextDimensions();

    CmpRef.cmp.planningApp.toolboxContainer.draw();

    menuBtn.setOnClickHandler(() => {
      this.canvas.setForeground(null);
      CmpRef.cmp.showPlannedVacationModal();
      this.removeChildById(container.getId());
      CmpRef.cmp.planningApp.toolboxContainer.draw();
    });
  }
}
