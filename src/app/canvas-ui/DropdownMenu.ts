import { AContainer } from "./AContainer";
import { Canvas } from "./Canvas";
import { GenericContainer } from "./GenericContainer";
import { DropdownOption } from "./models/DropdownOption";
import { TextRenderer } from "./TextRenderer";

export class DropdownMenu extends AContainer {
  private optionHeight = 20;
  private dropdownOptions: DropdownOption[] = [];

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent = null
  ) {
    super(x, y, width, height, canvas, parent);
    this.setParent(this.canvas);
    this.setBackgroundColor("#555");
  }

  addOption(textContent: string, eventHandler: Function) {
    this.dropdownOptions.push({ textContent, eventHandler });
  }

  createOptions() {
    this.setHeight(this.dropdownOptions.length * this.optionHeight);
    this.dropdownOptions.forEach((option, i) => {
      this.createOption(i);
    });
  }

  createOption(index: number) {
    const option = this.dropdownOptions[index];

    const container = new GenericContainer(
      0,
      index * 20,
      this.getWidth(),
      20,
      this.canvas,
      this
    );
    container.setBackgroundColor("#ddd");
    container.setBorder("#aaa", 1);
    container.setOnClickHandler((e) => {
      option.eventHandler(e);
      this.close();
    });

    const text = new TextRenderer(option.textContent, this.canvas, container);
    text.setAlignment("left", "center");
    text.setX(5);
    text.updateTextDimensions();
  }

  open() {
    this.children.length = 0;
    this.createOptions();
    this.canvas.setForeground(this);
  }

  close() {
    this.canvas.setForeground(null);
    this.canvas.getChildren().forEach((child) => child.draw());
  }
}
