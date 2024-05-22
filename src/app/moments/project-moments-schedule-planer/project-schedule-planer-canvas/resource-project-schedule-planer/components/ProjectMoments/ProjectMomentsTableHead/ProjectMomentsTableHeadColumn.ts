import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../../Config";
import { CpspRef } from "../../../CpspRef";
import { Column } from "./Column";

export class ProjectMomentsTableHeadColumn extends AContainer {
    private column: Column;
    private columnIndex: number;
    private mouseAction: 'move'|'resize';
    private columnText: TextRenderer;
    private minWidth = 15;

    private leftColumn: ProjectMomentsTableHeadColumn;

    constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent, column: Column) {
        super(x, y, width, height, canvas, parent);

        this.column = column;

        this.createColumnText();
        if(ConfigSc.isInEditMode) {
            this.setOnMouseHoverHandler((e) => {
                document.body.style.cursor = 'e-resize';
                if ((e.layerX <= this.getGlobalX() + 5) || (e.layerX >= this.getGlobalX() + this.getWidth() - 5)) document.body.style.cursor = 'col-resize';
            });

            this.setOnMouseDownHandler((e) => {
                const startingWidth = this.column.width;
                const children = this.parent.getChildren();
                const index = children.findIndex(child => child == this);
                const startingX = this.getX();
                children.push(children.splice(index, 1)[0]);
                this.canvas.addDrawingContainer(this.parent.getParent());
                this.setMoveAndResizeEvents(e);
                this.canvas.getCanvasElement().onmousemove = ev => { this.mouseMoveHandler(ev); }

                this.addRemoveEventsForMouseDownEvent(() => {
                    this.canvas.resetDrawingContainers();
                    document.body.style.cursor = 'default';

                    children.splice(index, 0, children.pop());
                    const condition = this.getX() > startingX + this.getWidth() || this.getX() < startingX
                    if (this.mouseAction === 'move') {
                      if(condition){
                        const newIndex = this.parent.getParent().findColumnByXPosition(this.getX(), this.getX() < startingX);
                        const newColumn = CpspRef.cmp.visibleColumns[newIndex];

                        let newSortIndex = 0;
                        switch (newIndex) {
                            case 0:
                                newSortIndex = newColumn.sortIndex - 1;
                                break;
                            case CpspRef.cmp.visibleColumns.length - 1:
                                newSortIndex = newColumn.sortIndex + 1;
                                break;
                            default:
                                // newSortIndex = (CpspRef.cmp.visibleColumns[newIndex - 1].sortIndex / 2) + (newColumn.sortIndex / 2);
                                newSortIndex = this.column.sortIndex > newColumn.sortIndex ?
                                (CpspRef.cmp.visibleColumns[newIndex - 1].sortIndex + newColumn.sortIndex) / 2 :
                                (CpspRef.cmp.visibleColumns[newIndex + 1].sortIndex + newColumn.sortIndex) / 2;
                        }
                        const oldSortIndex = this.column.sortIndex;
                        this.column.sortIndex = newSortIndex;
                        this.parent.getParent().sortColumns();
                        historySchedulePlaner.addToQueue(
                            () => CpspRef.cmp.updateScheduleColumnSortIndex(this.column.id, newSortIndex),
                            () => CpspRef.cmp.updateScheduleColumnSortIndex(this.column.id, oldSortIndex)
                        );
                      }

                    } else {
                        let column = this.column;
                        if (this.leftColumn) column = this.leftColumn.getColumn();
                        historySchedulePlaner.addToQueue(
                            () => CpspRef.cmp.updateScheduleColumnWidth(column.id, column.width),
                            () => CpspRef.cmp.updateScheduleColumnWidth(column.id, startingWidth)
                        );
                    }CpspRef

                    this.parent.getParent().refreshDisplay();
                });
            });

            this.setOnMouseRightClickHandler((e) => {
                const dropdownMenu = new DropdownMenu(e.layerX, e.layerY, 200, 200, this.canvas);
                /*dropdownMenu.addOption(`${CpspRef.cmp.getTranslate().instant('Hide')} "${CpspRef.cmp.getTranslate().instant(this.column.textContent)}"`, (e) => {
                    this.column.isVisible = false;
                    historySchedulePlaner.addToQueue(
                        () => CpspRef.cmp.hideScheduleColumn(this.column.id),
                        () => CpspRef.cmp.hideScheduleColumn(this.column.id)
                    );
                    this.parent.getParent().refreshDisplay();
                });*/
                if (!this.column.key) {
                    dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant('Edit'), (e) => {
                        CpspRef.cmp.columnInput.style.display = 'block';
                        CpspRef.cmp.columnInput.style.width = `${this.column.width}px`;
                        CpspRef.cmp.columnInput.style.height = `${this.columnText.getHeight() + 10}px`;
                        CpspRef.cmp.columnInput.value = this.columnText.getTextContent();
                        CpspRef.cmp.columnInput.style.top = `${this.columnText.getGlobalY() - (this.columnText.getHeight() / 2)}px`;
                        const x = this.columnText.getGlobalX() + this.column.width/2 - 18;
                        CpspRef.cmp.columnInput.style.left = `${x}px`;
                        CpspRef.cmp.columnInput.focus();
                        CpspRef.cmp.columnInput.select();
                        CpspRef.cmp.selectedTableHeadColumnForEditing = this;
                    });
                    dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant('Remove'), (e) => {
                        if (!confirm(CpspRef.cmp.getTranslate().instant('Are you sure?'))) return;
                        CpspRef.cmp.allColumns.splice(this.columnIndex, 1);
                        historySchedulePlaner.addToQueue(() => CpspRef.cmp.removeScheduleColumn(this.column.id), async () => {
                            const createdColumnId = await CpspRef.cmp.addScheduleColumn();
                            if (this.column.id < 0) this.column.id = historySchedulePlaner.getRealId(this.column.id);
                            const oldColumnId = this.column.id;
                            historySchedulePlaner.setTempId(this.column.id, createdColumnId);
                            CpspRef.cmp.updateColumnFromPlanning(createdColumnId, this.column.textContent);
                            CpspRef.cmp.updateScheduleColumnValueColumnIdsWithNewColumnId(oldColumnId, createdColumnId);
                            return true;
                        });
                        this.parent.getParent().refreshDisplay();
                    });
                }
                dropdownMenu.open();
            });

          }
    }

    createColumnText() {
        this.columnText = new TextRenderer(CpspRef.cmp.getTranslate().instant(this.column.textContent.toString()), this.canvas, this);
        this.columnText.updateTextDimensions();
        this.columnText.setFontSize(11);
        this.columnText.setColor('white');
        this.columnText.setAlignment('center', 'center');
    }

    getColumn() { return this.column; }
    setColumnIndex(index: number) { this.columnIndex = index; }

    move(x: number): void { this.setX(this.getX() + x); }

    override setX(x: number) {
        super.setX(x);
        if (this.column) this.column.x = x;
    }

    override setWidth(width: number) {
        super.setWidth(width);
        if (this.column) this.column.width = width;
    }

    resize(amountResized: number, anchor: 'left'|'up'|'right'|'down'): void {
        switch (anchor) {
            case 'left':
                if (this.leftColumn.getWidth() + amountResized < this.minWidth) {
                    this.leftColumn.setWidth(this.minWidth);
                    return;
                }

                this.parent.removeAllChildren();
                this.parent.getParent().renderAllHeadColumns();

                this.leftColumn.setWidth(this.leftColumn.getWidth() + amountResized);
                return;
            case 'right':
                if (this.getWidth() + amountResized < this.minWidth) {
                    this.setWidth(this.minWidth);
                    return;
                }

                this.parent.removeAllChildren();
                this.parent.getParent().renderAllHeadColumns();

                this.setWidth(this.getWidth() + amountResized);
                return;
            case 'up':
                throw Error('Not Implemented');
            case 'down':
                throw Error('Not Implemented');
        }
    }

    setMoveAndResizeEvents(e) {
        document.body.style.cursor = 'e-resize';

        this.mouseMoveHandler = (e) => {
            this.mouseAction = 'move';
            this.move(e.movementX);
        }

        if (e.layerX <= this.getGlobalX() + 5 && this.columnIndex !== 0) {
            this.mouseAction = 'resize';
            document.body.style.cursor = 'col-resize';

            this.leftColumn = this.parent.getChildren()[this.columnIndex];
            this.mouseMoveHandler = (e) => {
                this.resize(e.movementX, 'left');
            }
        }

        if (e.layerX >= this.getGlobalX() + this.getWidth() - 5) {
            this.mouseAction = 'resize';
            document.body.style.cursor = 'col-resize';

            this.leftColumn = null;
            this.mouseMoveHandler = (e) => {
                this.resize(e.movementX, 'right');
            }
        }
    }

    private mouseMoveHandler(e) {} // used in setMoveAndResizeEvents

    override draw() {
        this.canvas.getContext().save();

        this.drawShape(this.canvas.getContext());
        this.canvas.getContext().clip();
        this.children.forEach(child => child.draw());

        this.canvas.getContext().restore();
    }










}
