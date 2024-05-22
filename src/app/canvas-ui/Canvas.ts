import { CpspRef } from "../moments/project-moments-schedule-planer/project-schedule-planer-canvas/resource-project-schedule-planer/CpspRef";
import { CmpRef } from "../moments/project-moments/resource-planning-app/CmpRef";
import { Config } from "../moments/project-moments/resource-planning-app/Config";
import { AEntity } from "./AEntity";
import { Rectangle } from "./Rectangle";

export abstract class Canvas {
  private children: AEntity[] = [];

  private canvasElement: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  protected borderColor: string;
  protected borderSize = 0;
  protected selectionBox: Rectangle;
  protected drawingContainers = [];
  private foreground: AEntity = null;
  private canvasInstanceClass = Canvas;

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

    this.context = this.canvasElement.getContext("2d");
    this.context.imageSmoothingEnabled = true;
    this.update();
  }

  setCanvasElementPosition(position: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  }) {
    if (position.top) {
      this.canvasElement.style.top = `${position.top}px`;
    } else {
      this.canvasElement.style.removeProperty("top");
    }

    if (position.left) {
      this.canvasElement.style.left = `${position.left}px`;
    } else {
      this.canvasElement.style.removeProperty("left");
    }

    if (position.bottom) {
      this.canvasElement.style.bottom = `${position.bottom}px`;
    } else {
      this.canvasElement.style.removeProperty("bottom");
    }

    if (position.right) {
      this.canvasElement.style.right = `${position.right}px`;
    } else {
      this.canvasElement.style.removeProperty("right");
    }
  }

  getX() {
    return 0;
  }
  getY() {
    return 0;
  }

  getGlobalX() {
    return 0;
  }
  getGlobalY() {
    return 0;
  }

  getCanvasX() {
    return parseFloat(this.canvasElement.style.left);
  }
  setCanvasX(x: number) {
    this.canvasElement.style.left = `${x}px`;
  }

  getCanvasY() {
    return parseFloat(this.canvasElement.style.top);
  }
  setCanvasY(y: number) {
    this.canvasElement.style.top = `${y}px`;
  }

  getWidth() {
    return this.canvasElement.width;
  }
  setWidth(width: number) {
    this.canvasElement.width = width;
  }

  getHeight() {
    return this.canvasElement.height;
  }
  setHeight(height: number) {
    this.canvasElement.height = height;
  }

  getChildren() {
    return this.children;
  }
  addChild(child) {
    this.children.push(child);
  }

  getCanvasElement() {
    return this.canvasElement;
  }

  getContext() {
    return this.context;
  }

  addDrawingContainer(container) {
    this.drawingContainers.push(container);
  }
  resetDrawingContainers() {
    this.drawingContainers.length = 0;
    this.children.forEach((container) => container.draw());
  }

  removeChildById(id: number) {
    const index = this.children.findIndex((child) => child.getId() === id);
    if (index < 0) return;
    this.children.splice(index, 1);
  }
  removeLastChild() {
    return this.children.pop();
  }

  setForeground(foreground: AEntity) {
    this.foreground = foreground;
  }

  getInstanceClass() {
    return this.canvasInstanceClass;
  }
  setInstanceClass(instanceClass: any) {
    this.canvasInstanceClass = instanceClass;
  }

  createMouseDownEvent() {
    this.canvasElement.onmousedown = (e) => {
      let listener = this.getForegroundShapeClicked(this.foreground, e);
      if (this.foreground && !listener) {
        this.foreground = null;
        this.children.forEach((child) => child.draw());
      }
      if (!listener) listener = this.getClickedShape(this, e);
      if (!listener || listener.constructor === this.canvasInstanceClass)
        return;

      if (e.button === 2) {
        listener.onMouseRightClickHandler(e);
      } else {
        listener.onMouseDownHandler(e);
      }
    };
  }

  protected removeDrawnContainers() {
    if (CmpRef.cmp == undefined) {
      if (
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getSelectedMomentsContainer()
      ) {
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
          .getSelectedMomentsContainer()
          .getInnerContainer()
          .removeChildById(
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
              .getSelectedMomentsContainer()
              .getId()
          );
        this.removeChildById(
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
            .getSelectedMomentsContainer()
            .getId()
        );
      }
      if (CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getMovingLineIndicator()) {
        this.removeChildById(
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
            .getMovingLineIndicator()
            .getId()
        );
      }
      return;
    }
    if (
      CmpRef.cmp.planningApp.projectUsersContainer.getSelectedUsersContainer()
    ) {
      CmpRef.cmp.planningApp.projectUsersContainer
        .getSelectedUsersContainer()
        .getInnerContainer()
        .removeChildById(
          CmpRef.cmp.planningApp.projectUsersContainer
            .getSelectedUsersContainer()
            .getId()
        );
      this.removeChildById(
        CmpRef.cmp.planningApp.projectUsersContainer
          .getSelectedUsersContainer()
          .getId()
      );
    }
    if (CmpRef.cmp.planningApp.projectUsersContainer.getMovingLineIndicator()) {
      this.removeChildById(
        CmpRef.cmp.planningApp.projectUsersContainer
          .getMovingLineIndicator()
          .getId()
      );
    }
  }

  createEvents() {
    this.canvasElement.onmousedown = (e) => {
      let listener = this.getForegroundShapeClicked(this.foreground, e);
      if (this.foreground && !listener) {
        this.foreground = null;
        this.children.forEach((child) => child.draw());
      }
      if (!listener) listener = this.getClickedShape(this, e);
      if (!listener || listener.constructor === this.canvasInstanceClass)
        return;

      if (e.button === 2) {
        listener.onMouseRightClickHandler(e);
      } else {
        if (e.shiftKey) {
          this.removeDrawnContainers();
          listener.onMouseDownHandler(e);
          if (CmpRef.cmp == undefined) {}
            // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.createSelectedMomentsContainer(
            //   e.offsetX,
            //   e.offsetY - ConfigSc.toolboxSize
            // );

          else {
            CmpRef.cmp.planningApp.projectUsersContainer.createSelectedUsersContainer(
              e.offsetX,
              e.offsetY - Config.toolboxSize
            );
          }
        } else {
          this.removeDrawnContainers();
          listener.onMouseDownHandler(e);
        }
      }
    };

    this.canvasElement.ondblclick = (e) => {
      const listener = this.getClickedShape(this, e);
      if (!listener || listener.constructor === this.canvasInstanceClass)
        return;

      listener.onDoubleClickHandler(e);
    };

    this.canvasElement.onwheel = (e) => {
      let listener = this.getForegroundShapeClicked(this.foreground, e);
      if (this.foreground && !listener) {
        this.foreground = null;
        this.children.forEach((child) => child.draw());
      }
      listener = this.getMouseWheeledShape(this, e);
      if (!listener || listener.constructor === this.canvasInstanceClass)
        return;
      listener.onMouseWheel(e);
    };

    this.canvasElement.oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.onmousemove = (e) => {
      const listener = this.getClickedShape(this, e);
      if (!listener || listener.constructor === this.canvasInstanceClass){
        document.body.style.cursor =  "auto";
        return;
      }
      listener.onMouseHoverHandler(e);
    };
  }

  getClickedShape(shape, e) {
    if (!shape.getChildren) return shape;
    const children = shape.getChildren();

    for (let i = children.length - 1; i >= 0; --i) {
      if (
        !children[i].isShapeClicked ||
        !children[i].isShapeClicked(e.layerX, e.layerY)
      )
        continue;
      return this.getClickedShape(children[i], e);
    }

    return shape;
  }

  getForegroundShapeClicked(foreground, e) {
    if (!foreground) return false;
    if (foreground.isShapeClicked(e.layerX, e.layerY)) {
      return this.getClickedShape(foreground, e);
    }

    return false;
  }

  getMouseWheeledShape(shape, e) {
    if (!shape.getChildren) return shape;
    const children = shape.getChildren();

    for (let i = children.length - 1; i >= 0; --i) {
      if (
        !children[i].getIsMouseWheelable() ||
        !children[i].isShapeClicked(e.layerX, e.layerY)
      )
        continue;
      return this.getMouseWheeledShape(children[i], e);
    }

    return shape;
  }

  setElementPointerEvents(value: string) {
    this.canvasElement.style.pointerEvents = value;
  }

  abstract startSelection(x: number, y: number);

  endSelection() {
    this.drawingContainers = [];
    this.getChildren().forEach((child) => child.draw());
  }

  abstract onSelectionEnd(x: number, y: number, width: number, height: number);

  update() {
    window.requestAnimationFrame(() => {
      this.update();
    });

    this.drawingContainers.forEach((child) => {
      child.draw();
    });

    if (this.foreground !== null) this.foreground.draw();
  }

  destruct() {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.canvasElement.width = 0;
    this.canvasElement.height = 0;
    this.canvasElement.parentNode.removeChild(this.canvasElement);
  }
}
