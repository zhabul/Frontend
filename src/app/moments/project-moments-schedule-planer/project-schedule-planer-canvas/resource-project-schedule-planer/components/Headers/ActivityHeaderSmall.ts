import * as moment from "moment";
import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
// import { Line } from "src/app/canvas-ui/Line";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
// import { RoundedRectangle } from "src/app/canvas-ui/RoundedRectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";
import { RoundedRectangle } from "src/app/canvas-ui/RoundedRectangle";
import { Line } from "src/app/canvas-ui/Line";

//import * as moment from "moment";

export class ActivityHeaderSmall extends AContainer {
  public saveButton: GenericRoundedContainer;
  public retButton: GenericRoundedContainer;
  public sendButton: GenericRoundedContainer;
  public lockButton: GenericRoundedContainer;
  public textDropdown: GenericRoundedContainer;

  public dropdownMenu;

  private toggleRev = false;
  private toggleSend = false;
  private textDropdownOpen = false;
  private columnDropdownOpen = false;
  public fontDropdownOpen = false;
  public fontSizeDropdownOpen = false;
  public noteDropdownOpen = false;
  public monsterDropdownOpen = false;
  private dropdownWidth = 150;
  private dropdowns: GenericRoundedContainer[] = [];
  private dropdownContainers: GenericRoundedContainer[] = [];

  private sendDateText;

  private shadow = document.getElementById("shadow");

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.toggleRev = false;
    this.toggleSend = false;
    this.setBackgroundColor("#373B40");
    const w = 0;

    const borderButton = new GenericRoundedContainer(
      w + 10,
      23,
      80,
      30,
      this.canvas,
      this
    );
    borderButton.setBackgroundColor("#373B40");
    borderButton.setBorder("#FCF4EC", 1);
    borderButton.setBorderRoundness(4);

    const undoIcon = this.addIcon(w + 15, 0, 23, 19, "undo", "undo", () => {
      if (
        (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
      ) {
        return;
      }
      historySchedulePlaner.undo();
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.setAllDisplayProjectsAndMomentsCoordinates();
    });
    undoIcon.setYAlignment("center");

    const line = new GenericRoundedContainer(
      w + 50,
      25,
      1,
      28,
      this.canvas,
      this
    );
    line.setBackgroundColor("#FCF4EC");

    const redoIcon = this.addIcon(w + 60, 0, 23, 19, "redo", "redo", () => {
      if (
        (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
      ) {
        return;
      }
      historySchedulePlaner.redo();
    });
    redoIcon.setYAlignment("center");
    //editing rows

    // CpspRef.cmp.hideHoursProject();

    const editingRows = new GenericRoundedContainer(
      100,
      23,
      150,
      30,
      this.canvas,
      this
    );
    editingRows.setBorder("", 0);
    this.dropdownContainers.push(editingRows);
    editingRows.setOnMouseWheelHandler(() => {
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns();
    });

    const textdropDown = new GenericRoundedContainer(
      editingRows.getGlobalX(),
      editingRows.getGlobalY() + 29,
      150,
      0,
      this.canvas,
      this.canvas
    );

    textdropDown.setBorder("", 0);

    this.dropdowns.push(textdropDown);
    const textdropDownbtn = this.createDropdownBtn(
      0,
      0,
      150,
      30,
      CpspRef.cmp.getTranslate().instant("TEXT"),
      () => {
        this.openCloseTextDropdown(textdropDown);
        textdropDownbtn.setBackgroundColor("black");
        textdropDown.getChildren().forEach((child) => {
          child.setOnMouseHoverHandler(
            () => (document.body.style.cursor = "pointer")
          );
        });
        this.refreshContainers();
      },
      6,
      "#9A9896",
      "#FF8787",
      "#373B40",
      editingRows
    );

    this.addIcon(
      this.dropdownWidth - 25,
      10,
      15,
      9,
      "arrow-drop-down",
      "arrow-drop-down",
      () => {
        this.openCloseTextDropdown(textdropDown);
      },
      editingRows
    );

    const editingColumns = new GenericRoundedContainer(
      260,
      23,
      150,
      30,
      this.canvas,
      this
    );
    editingColumns.setBackgroundColor("#373B40");
    editingColumns.setBorder("", 0);
    this.dropdownContainers.push(editingColumns);

    const columndropDown = new GenericRoundedContainer(
      editingColumns.getGlobalX(),
      editingColumns.getGlobalY() + 30,
      150,
      0,
      this.canvas,
      this.canvas
    );

    columndropDown.setBorder("", 0);
    this.dropdowns.push(columndropDown);
    const columndropDownbtn = this.createDropdownBtn(
      0,
      0,
      150,
      30,
      CpspRef.cmp.getTranslate().instant("COLUMNS"),
      () => {
        this.openCloseColumnDropdown(columndropDown);
        columndropDownbtn.setBackgroundColor("black");
        columndropDown.getChildren().forEach((child) => {
          child.setOnMouseHoverHandler(
            () => {document.body.style.cursor = "pointer";}
          );
        });
        // this.canvas.resetDrawingContainers();
        this.refreshContainers();
      },
      6,
      "#9A9896",
      "#FF8787",
      "#373B40",
      editingColumns
    );

    this.addIcon(
      this.dropdownWidth - 25,
      10,
      15,
      9,
      "arrow-drop-down",
      "arrow-drop-down",
      () => {
        this.openCloseColumnDropdown(columndropDown);
      },
      editingColumns
    );

    //editing weeks
    const editingWeeks = new GenericRoundedContainer(
      428,
      6,
      207,
      66,
      this.canvas,
      this
    );
    editingWeeks.setBackgroundColor("#373B40");
    editingWeeks.setBorder("#FCF4EC", 1);
    editingWeeks.setBorderRoundness(6);

    const previousIcon = this.addIcon(
      458,
      -25,
      16,
      5,
      "previous-week",
      "previous-week",
      () => {}
    );
    previousIcon.setYAlignment("center");

    const previousWeek4 = this.createButton(
      438,
      0,
      24,
      34,
      "4" + CpspRef.cmp.getTranslate().instant("W."),
      () => {
        CpspRef.cmp.changeMomentsDate(-28);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    previousWeek4.setYAlignment("center");
    previousWeek4.setBorder("#FFFFFF", 1);

    const previousWeek1 = this.createButton(
      468,
      0,
      24,
      34,
      "1" + CpspRef.cmp.getTranslate().instant("W."),
      () => {
        CpspRef.cmp.changeMomentsDate(-7);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    previousWeek1.setYAlignment("center");
    previousWeek1.setBorder("#FFFFFF", 1);

    const previousDay1 = this.createButton(
      498,
      -13,
      24,
      43,
      //"1. " + CpspRef.cmp.getTranslate().instant("Day"),
      "",
      () => {
        CpspRef.cmp.changeMomentsDate(-1);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    previousDay1.setYAlignment("bottom");
    previousDay1.setBorder("#FFFFFF", 1);

    const previousDay1Text = new TextRenderer("1.", this.canvas, previousDay1);
    previousDay1Text.setFontSize(12);
    previousDay1Text.setColor("#FF8787");
    previousDay1Text.setFontFamily("PT-Sans-Pro-Regular");
    previousDay1Text.setX(8);
    previousDay1Text.setY(10);

    const previousDay2Text = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Day"),
      this.canvas,
      previousDay1
    );
    previousDay2Text.setFontSize(12);
    previousDay2Text.setColor("#FF8787");
    previousDay2Text.setFontFamily("PT-Sans-Pro-Regular");
    previousDay2Text.setX(2);
    previousDay2Text.setY(25);

    const weekText1 = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Week"),
      this.canvas,
      this
    );
    weekText1.setFontSize(10);
    weekText1.setColor("#FF8787");
    weekText1.setFontFamily("PT-Sans-Pro-Regular");
    weekText1.setX(842 + 20 - 414);
    weekText1.setY(60);

    const backText = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Behind").toUpperCase(),
      this.canvas,
      this
    );
    backText.setFontSize(10);
    backText.setColor("#FF8787");
    backText.setFontFamily("PT-Sans-Pro-Regular");
    backText.setX(842 + 50 - 414);
    backText.setY(10);

    const calendar = this.addIcon(
      528,
      -22,
      10,
      10,
      "calendar-img",
      "calendar-img",
      () => {}
    );
    calendar.setYAlignment("center");

    const weekSpace = new GenericRoundedContainer(
      533,
      25,
      1,
      45,
      this.canvas,
      this
    );
    weekSpace.setBackgroundColor("#FCF4EC");

    const forwardText = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Forward").toUpperCase(),
      this.canvas,
      this
    );
    forwardText.setFontSize(10);
    forwardText.setColor("#FF8787");
    forwardText.setFontFamily("PT-Sans-Pro-Regular");
    forwardText.setX(548);
    forwardText.setY(10);

    const nextIcon = this.addIcon(
      593,
      -25,
      16,
      5,
      "next-week",
      "next-week",
      () => {}
    );
    nextIcon.setYAlignment("center");

    const nextDay1 = this.createButton(
      543,
      -13,
      24,
      43,
      //"1." + CpspRef.cmp.getTranslate().instant("Day"),
      "",
      () => {
        CpspRef.cmp.changeMomentsDate(1);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    nextDay1.setYAlignment("bottom");
    nextDay1.setBorder("#FFFFFF", 1);

    const nextDay1Text = new TextRenderer("1.", this.canvas, nextDay1);
    nextDay1Text.setFontSize(12);
    nextDay1Text.setColor("#FF8787");
    nextDay1Text.setFontFamily("PT-Sans-Pro-Regular");
    nextDay1Text.setX(8);
    nextDay1Text.setY(10);

    const nextDay2Text = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Day"),
      this.canvas,
      nextDay1
    );
    nextDay2Text.setFontSize(12);
    nextDay2Text.setColor("#FF8787");
    nextDay2Text.setFontFamily("PT-Sans-Pro-Regular");
    nextDay2Text.setX(2);
    nextDay2Text.setY(25);

    const nextWeek1 = this.createButton(
      573,
      0,
      24,
      34,
      "1" + CpspRef.cmp.getTranslate().instant("W."),
      () => {
        CpspRef.cmp.changeMomentsDate(7);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    nextWeek1.setYAlignment("center");
    nextWeek1.setBorder("#FFFFFF", 1);

    const nextWeek4 = this.createButton(
      603,
      0,
      24,
      34,
      "4" + CpspRef.cmp.getTranslate().instant("W."),
      () => {
        CpspRef.cmp.changeMomentsDate(28);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    nextWeek4.setYAlignment("center");
    nextWeek4.setBorder("#FFFFFF", 1);

    const weekText2 = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Week"),
      this.canvas,
      this
    );
    weekText2.setFontSize(10);
    weekText2.setColor("#FF8787");
    weekText2.setFontFamily("PT-Sans-Pro-Regular");
    weekText2.setX(842 + 155 - 414);
    weekText2.setY(60);

    const empty = new GenericRoundedContainer(
      513,
      0,
      36,
      12,
      this.canvas,
      this
    );
    empty.setBackgroundColor("#373B40");
    const textEmpty = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("Move").toUpperCase(),
      this.canvas,
      empty
    );
    textEmpty.setColor("#FFFFFF");
    textEmpty.setFontSize(10);
    textEmpty.setAlignment("center", "center");
    textEmpty.updateTextDimensions();

    let rev =
      CpspRef.cmp.property_index - 1 != CpspRef.cmp.revImages.length &&
      CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1] != undefined
        ? CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1].date_generated
        : ConfigSc.currentDate.format(ConfigSc.dateRevFormat);

    const draftConfition =
      CpspRef.cmp.property_index - 1 != CpspRef.cmp.revImages.length &&
      CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1] != undefined;

    //buttons
    this.retButton = this.createButton(
      1096 - 443,
      -20,
      136,
      33,
      !draftConfition ?
        CpspRef.cmp
          .getTranslate()
          .instant("Draft")
          .toUpperCase() + " " + rev :
          CpspRef.cmp
          .getTranslate()
          .instant("Rev. " + CpspRef.cmp.property_index)
          .toUpperCase() + " " + rev
          ,
      () => {
      },
      6,
      "#FFFFFF",
      "#FF8787"
    );
    this.retButton.setYAlignment("bottom");
    this.retButton.setBorder("#FCF4EC", 1);
    this.retButton.getFirstChild().setX(17);

    this.retButton.setOnClickHandler(() => {
      if (!this.toggleRev) this.showRevisions();
      this.toggleRev = !this.toggleRev;
      if(CpspRef.cmp.buttonToggleSend)
        CpspRef.cmp.buttonToggleSend = !CpspRef.cmp.buttonToggleSend;
      if(CpspRef.cmp.buttonToggleSend)
        CpspRef.cmp.buttonToggleSend = !CpspRef.cmp.buttonToggleSend;
    });

    const retButtonArrow = this.addIcon(
      this.retButton.getWidth() - 27,
      0,
      15,
      8,
      "arrow-drop-down",
      "arrow-drop-down",
      () => {
      },
      this.retButton
    );
    retButtonArrow.setYAlignment("center");
    retButtonArrow.setOnClickHandler(() => {
      if (!this.toggleRev) this.showRevisions();
      this.toggleRev = !this.toggleRev;
    });

    this.sendButton = this.createButton(
      1236 - 437,
      -20,
      136,
      33,
      CpspRef.cmp.getTranslate().instant("Send / Write").toUpperCase(),
      () => {
        if (!this.toggleSend) this.sendRevision();
        this.toggleSend = !this.toggleSend;
      },
      6,
      "#FFFFFF",
      "#FF8787"
    );
    this.sendButton.setYAlignment("bottom");
    this.sendButton.setBorder("#FCF4EC", 1);
    this.sendButton.getFirstChild().setX(17);

    const sendButtonArrow = this.addIcon(
      this.sendButton.getWidth() - 27,
      0,
      15,
      8,
      "arrow-drop-down",
      "arrow-drop-down",
      () => {
        if (!this.toggleSend) this.sendRevision();
        this.toggleSend = !this.toggleSend;
      },
      this.sendButton
    );
    sendButtonArrow.setYAlignment("center");

    let b = document.getElementById(
      "dropdown-div"
    );

    b.style.display = "block";
    b.style.marginLeft = "1153px";
    b.style.marginTop = "15px";
    b.style.width = "136px";
    let b1 = document.getElementById(
      "first-btn-drop"
    );

    b1.style.width = "136px"
    b1.style.height = "33px"

    const saveTextContainer = new GenericContainer(
      0,
      33,
      150,
      this.getHeight(),
      this.canvas,
      this
    );
    saveTextContainer.setXAlignment("right");

    this.sendDateText = new TextRenderer("", this.canvas, saveTextContainer);
    this.sendDateText.setColor("#E17928");
    this.sendDateText.setY(28);

    this.lockButton = this.createButton(
      1456 - 423,
      2,
      70,
      33,
      // CpspRef.cmp.getTranslate().instant("Lock").toUpperCase(),
      CpspRef.cmp.getTranslate().instant(CpspRef.cmp.lockedRevision && CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 ? "Unlock" : "Lock" ).toUpperCase(),
      () => {
        if ( historySchedulePlaner.getNumberOfChanges() > 0 ) return;

        if(CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1){
          CpspRef.cmp.toggleLockedRevision();
          CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
          return;
        }

        if (
          historySchedulePlaner.getNumberOfChanges() > 0 ||
          CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 ||
          CpspRef.cmp.copySelectedProject == null ||
          CpspRef.cmp.loading
        )
          return;
        CpspRef.cmp.setLoadingStatus(true);
        setTimeout(() => {
          CpspRef.cmp.scaleCanvas();
          CpspRef.cmp.showConfirmationModal(
            CpspRef.cmp.getTranslate().instant("Do you want to lock?"),
            (response) => {
              if (response.result) {
                CpspRef.cmp.saveState();
                CpspRef.cmp.setLoadingStatus(false);
                CpspRef.cmp.toastrMessage(
                  "success",
                  CpspRef.cmp.getTranslate().instant("Successfully lock!")
                );
              }
              CpspRef.cmp.scaleCanvas(false);
              CpspRef.cmp.setLoadingStatus(false);
            }
          );
        }, 200);
      },
      6,
      historySchedulePlaner.getNumberOfChanges() == 0 //&&
        // CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 &&
        // CpspRef.cmp.copySelectedProject != null
        ? "#FF8787"
        : "#FCF4EC",
      historySchedulePlaner.getNumberOfChanges() == 0 //&&
        // CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 &&
        // CpspRef.cmp.copySelectedProject != null
        ? "#FF8787"
        : "#FCF4EC"
    );
    this.lockButton.setYAlignment("center");
    this.lockButton.draw();

    this.saveButton = this.createButton(
      1382 - 429,
      2,
      70,
      33,
      CpspRef.cmp.getTranslate().instant("Save").toUpperCase(),
      () => {
        this.clickOnSave();
      },
      6,
      historySchedulePlaner.getNumberOfChanges() > 0
      // && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
        ? "#FF8787"
        : "#FCF4EC",
      historySchedulePlaner.getNumberOfChanges() > 0
      // && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
        ? "#FF8787"
        : "#FCF4EC"
    );
    this.saveButton.setYAlignment("center");
    this.saveButton.draw();
  }

  public clickOnSave() {
    if(CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && historySchedulePlaner.getNumberOfChanges() > 0){

      CpspRef.cmp.setLoadingStatus(true);
        setTimeout(() => {
          CpspRef.cmp.scaleCanvas();
          CpspRef.cmp.showConfirmationModal(
            CpspRef.cmp.getTranslate().instant("Do you want to save?"),
            (response) => {
              if (response.result) {
                historySchedulePlaner.dumpHistory();
                CpspRef.cmp.updateRevision();
                CpspRef.cmp.setLoadingStatus(false);
                CpspRef.cmp.toastrMessage(
                  "success",
                  CpspRef.cmp.getTranslate().instant("Successfully saved changes!")
                );
              }
              CpspRef.cmp.scaleCanvas(false);
              CpspRef.cmp.setLoadingStatus(false);
            }
          );
        }, 200);
    }
    if (
      historySchedulePlaner.getNumberOfChanges() <= 0 ||
      CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 ||
      CpspRef.cmp.copySelectedProject == null
    )
      return;

    CpspRef.cmp.showConfirmationModal(
      CpspRef.cmp.getTranslate().instant("Do you want to save?"),
      async (response) => {
        if (response.result) {
          if (CpspRef.cmp.loading) {
            return;
          }

          CpspRef.cmp.setLoadingStatus(true);
          // const status = await historySchedulePlaner.executeQueue();
          let status1 = await CpspRef.cmp.executeQueueSave();
          if (status1) {
            status1 = await historySchedulePlaner.executeQueue();;
            ConfigSc.currentDate = moment();
            this.sendDateText.setTextContent(
              `Dat. ${ConfigSc.currentDate.format(
                ConfigSc.dateFormat
              )}  ${ConfigSc.currentDate.format(ConfigSc.timeFormat)}`
            );
            this.draw();
            CpspRef.cmp.idParentGroups = [];
            CpspRef.cmp.idMoments = [];
            CpspRef.cmp.activeRevisions = CpspRef.cmp.deepCopy(
              CpspRef.cmp.copySelectedProject
            );
          }
          CpspRef.cmp.setLoadingStatus(false);
          if (historySchedulePlaner.getNumberOfChanges() != 0) {
            historySchedulePlaner.dumpHistory();
            CpspRef.cmp.toastrMessage(
              "success",
              CpspRef.cmp.getTranslate().instant("Successfully saved changes!")
            );
            this.sendDateText.setTextContent(
              `Dat. ${ConfigSc.currentDate.format(
                ConfigSc.dateFormat
              )}  ${ConfigSc.currentDate.format(ConfigSc.timeFormat)}`
            );
            this.draw();
            CpspRef.cmp.idParentGroups = [];
            CpspRef.cmp.idMoments = [];
            CpspRef.cmp.activeRevisions = CpspRef.cmp.deepCopy(
              CpspRef.cmp.copySelectedProject
            );
          }

          CpspRef.cmp.returnAllChangedToDefault();
          CpspRef.cmp.selectedProject.activities = JSON.parse(
            JSON.stringify(CpspRef.cmp.copySelectedProject.activities)
          );
          CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
          this.sendDateText.draw();
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
          CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
        }
      }
    );
  }

  addIcon(
    x: number,
    y: number,
    width: number,
    height: number,
    iconName: string,
    iconPath: string,
    onClickFn: Function,
    parent: any = this
  ) {
    const iconShape = new Rectangle(x, y, width, height, this.canvas, parent);
    iconShape.addBackgroundImagePattern(iconName, iconPath, width, height);
    if(ConfigSc.isInEditMode){
      iconShape.setOnMouseHoverHandler(
        () => (document.body.style.cursor = "pointer")
      );
      iconShape.setOnClickHandler(onClickFn);
    }

    return iconShape;
  }

  createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    textContent: string,
    onClickFn: Function,
    radius: number,
    borderColor: string = "white",
    textColor: string = "#F77E04",
    backgroundColor: string = "#373B40"
  ) {
    const button = new GenericRoundedContainer(
      x,
      y,
      width,
      height,
      this.canvas,
      this
    );
    button.setBackgroundColor(backgroundColor);
    button.setBorder(borderColor, 1.5);
    if (ConfigSc.isInEditMode) {
      let firstMove = true;
      button.setOnClickHandler(onClickFn);
      button.setOnMouseHoverHandler(() => {
        document.body.style.cursor = "pointer";
        button.setBackgroundColor("black");
        // this.draw();
        this.refreshContainers();
        if (firstMove) {
          document.onmousemove = (e) => {
            if (!button.isShapeClicked(e.clientX - 65, e.clientY)) {
              button.setBackgroundColor("#373B40");
              // this.draw();
              this.refreshContainers();
              firstMove = true;
              document.onmousemove = () => {};
            }
          };
        }
        firstMove = false;
        // this.refreshContainers();
      });
    }
    button.setBorderRoundness(radius);
    const buttonText = new TextRenderer(textContent, this.canvas, button);
    buttonText.setColor(textColor);
    buttonText.setFontSize(12);
    buttonText.setAlignment("center", "center");
    buttonText.updateTextDimensions();

    return button;
  }

  createDropdownBtn(
    x: number,
    y: number,
    width: number,
    height: number,
    textContent: string,
    onClickFn: Function,
    radius: number,
    borderColor: string = "white",
    textColor: string = "#F77E04",
    backgroundColor: string = "#373B40",
    parent: any = this
  ) {
    const dropdownButton = new GenericRoundedContainer(
      x,
      y,
      width,
      height,
      this.canvas,
      parent
    );
    dropdownButton.setBackgroundColor(backgroundColor);
    dropdownButton.setBorder(borderColor, 1.5);
    if (ConfigSc.isInEditMode) {
      dropdownButton.setOnClickHandler(() => {
        onClickFn();
        this.setOnMouseHoverHandler(() => {});
      });
      dropdownButton.setOnMouseHoverHandler(() => {
        document.body.style.cursor = "pointer";
      });

      let firstMove = true;
      dropdownButton.setOnMouseHoverHandler(() => {
        document.body.style.cursor = "pointer";
        if(this.fontDropdownOpen || this.fontSizeDropdownOpen || this.noteDropdownOpen || this.monsterDropdownOpen)
          return;
        dropdownButton.setBackgroundColor("black");

        this.setOnMouseHoverHandler(() => {
          dropdownButton.setBackgroundColor("#373B40");
          firstMove = true;
          this.setOnMouseHoverHandler(() => {});
          if (this.textDropdownOpen || this.columnDropdownOpen) {
            this.refreshContainers();
          } else {
            this.draw();
          }
        });

        if ((this.textDropdownOpen || this.columnDropdownOpen) && firstMove) {
          this.refreshContainers();
        } else if (firstMove) {
          this.draw();
        }

        firstMove = false;
        // this.refreshContainers();
      });
    }
    dropdownButton.setBorderRoundness(radius);
    const buttonText = new TextRenderer(
      textContent,
      this.canvas,
      dropdownButton
    );
    buttonText.setColor(textColor);
    buttonText.setFontSize(16);
    buttonText.setFontFamily("PT-Sans-Pro-Regular");
    buttonText.setAlignment("left", "center");
    buttonText.moveX(8);
    buttonText.moveY(1);
    buttonText.updateTextDimensions();
    return dropdownButton;
  }

  sendRevision() {
    if (
      historySchedulePlaner.getNumberOfChanges() > 0 ||
      CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
    )
      return;

    const dropdownMenu = new DropdownMenu(
      this.sendButton.getGlobalX(),
      this.sendButton.getGlobalY() + this.sendButton.getHeight(),
      this.sendButton.getWidth(),
      200,
      this.canvas
    );

    let ind = 1;
    CpspRef.cmp.project.responsiblePeople.forEach((person) => {
      let p = CpspRef.cmp.project.responsiblePeople[ind - 1];
      let image_url =
        CpspRef.cmp.property_index - 1 != CpspRef.cmp.revImages.length &&
        CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1] != undefined
          ? CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1].url
          : null;
      dropdownMenu.addOption(
        CpspRef.cmp.getTranslate().instant(person.Name).toUpperCase(),
        (e) => {
          /*CpspRef.cmp.property_index=prog.prog_number
        CpspRef.cmp.copySelectedProject.activities=p.activities;
        CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)*/

          CpspRef.cmp.generatePfd(image_url, p.user_email);

          CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
          CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
        }
      );
      ind++;
    });
    dropdownMenu.open();
  }

  hideUnnecessary() {
    CpspRef.cmp.selectedMomentsForStyleChange = [];
    CpspRef.cmp.tapeMomActId = null;
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
      null;
    CpspRef.cmp.hideColumnInput();
    CpspRef.cmp.hideColumnValueInput();
    CpspRef.cmp.hideNoteInput();
    CpspRef.cmp.hidePlanInput();
    CpspRef.cmp.hideResourceWeekInput();
  }

  showRevisions() {
    this.dropdownMenu = new DropdownMenu(
      this.retButton.getGlobalX(),
      this.retButton.getGlobalY() + this.retButton.getHeight(),
      this.retButton.getWidth(),
      200,
      this.canvas
    );

    let ind = 1;
    CpspRef.cmp.revisions.forEach((prog) => {
      let p = CpspRef.cmp.revisions[ind - 1];
      this.dropdownMenu.addOption(
        CpspRef.cmp
          .getTranslate()
          .instant("Rev. " + prog.prog_number)
          .toUpperCase(),
        async (e) => {
          CpspRef.cmp.selectedMomentsForStyleChange = [];
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
            null;
          if (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1) {
            CpspRef.cmp.activeConnections = CpspRef.cmp.deepCopy(
              CpspRef.cmp.lineConnections
            );
            CpspRef.cmp.activeRevisions = CpspRef.cmp.deepCopy(
              CpspRef.cmp.copySelectedProject
            );
          }
          CpspRef.cmp.property_index = prog.prog_number;
          CpspRef.cmp.copySelectedProject.activities = p.activities;
          CpspRef.cmp.allColumns = p.columns;
          CpspRef.cmp.lineConnections = p.connections;
          CpspRef.cmp.selectedProject = CpspRef.cmp.deepCopy(
            CpspRef.cmp.copySelectedProject
          );
          CpspRef.cmp.checked = p.showNames;
          CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
          // this.getCanvas().getContext().save()
          // this.getCanvas().getContext().globalAlpha = 0.6
          // // this.getCanvas().getContext().restore()

          this.shadow.style.pointerEvents = "none";
          this.shadow.style.marginTop = ConfigSc.toolboxSize + "px";
          this.shadow.style.marginLeft = ConfigSc.sidebarSize + "px";
          this.shadow.style.backgroundColor = "#434343";
          this.shadow.style.opacity = "0.1";
          this.shadow.style.width = ConfigSc.sideCanvasSize + "px";
          this.shadow.style.height = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getHeight() + "px";

          document.getElementById("checkBox").style.pointerEvents = "none";



          // CpspRef.cmp.closeDialog();
          // CpspRef.cmp.showRevision(() => {
          //   let shadow = document.getElementsByClassName(
          //     "cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing"
          //   )[0] as HTMLElement;
          //   shadow.style.pointerEvents = "none";
          //   shadow.style.marginTop = ConfigSc.toolboxSize + "px";
          //   shadow.style.marginLeft = ConfigSc.sidebarSize + "px";
          //   shadow.style.backgroundColor = "#434343";
          //   shadow.style.opacity = "0.1";
          //   shadow.style.width = ConfigSc.sideCanvasSize + "px";
          // });
          this.hideUnnecessary();
          await CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
          CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
            .getTableHeadContainer()
            .refreshDisplay();
          // this.getCanvas().getContext().save()
          // this.getCanvas().getContext().globalAlpha = 0.1;
          // this.getCanvas().getContext().fillStyle = "#434343";
          // this.getCanvas().getContext().fillRect(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getX(), CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getGlobalY(), CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getWidth(), CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getHeight());
          // this.getCanvas().getContext().restore()
        }
      );
      ind++;
    });

    this.dropdownMenu.addOption(
      CpspRef.cmp
        .getTranslate()
        .instant("Draft")
        .toUpperCase(),
      (e) => {
        CpspRef.cmp.selectedMomentsForStyleChange = [];
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
          null;

        this.shadow.style.height = 0 + "px";
        document.getElementById("checkBox").style.pointerEvents = "auto";


        CpspRef.cmp.property_index = Number(CpspRef.cmp.revisions.length + 1);
        CpspRef.cmp.copySelectedProject.activities = CpspRef.cmp.deepCopy(
          CpspRef.cmp.activeRevisions.activities
        );
        CpspRef.cmp.allColumns = CpspRef.cmp.activeColumns;
        CpspRef.cmp.lineConnections = CpspRef.cmp.deepCopy(
          CpspRef.cmp.activeConnections
        );
        CpspRef.cmp.selectedProject = CpspRef.cmp.deepCopy(
          CpspRef.cmp.copySelectedProject
        );
        CpspRef.cmp.closeDialog();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
          .getTableHeadContainer()
          .refreshDisplay();
      }
    );

    this.dropdownMenu.open();
  }

  openCloseTextDropdown(parent: GenericRoundedContainer) {
    const container = this.dropdownContainers[0].getChildren()[0];
    if (this.textDropdownOpen) {
      this.hideChildElements(parent);
      parent.setHeight(0);
      parent.setBorder("", 0);
      this.closeAllDropdowns();
      container.setBorderRoundness(6);
      container.setBorder("#9A9896", 2);
    } else {
      this.closeAllDropdowns();
      container.setBorderRoundness(6, true, true, false, false);
      container.setBorder("#EC8182", 2);
      this.showTextChildElements(parent);
      parent.setHeight(240);
      this.textDropdownOpen = true;
      parent.setBorder("#EC8182", 2);
    }
    this.refreshContainers();
  }

  openCloseColumnDropdown(parent: GenericRoundedContainer) {
    const container = this.dropdownContainers[1].getChildren()[0];
    if (this.columnDropdownOpen) {
      this.hideChildElements(parent);
      parent.setHeight(0);
      parent.setBorder("", 0);
      this.closeAllDropdowns();
      container.setBorderRoundness(6).setBorder("#9A9896", 2);
    } else {
      this.closeAllDropdowns();
      this.showColumnChildElements(parent);
      parent.setHeight(300);
      this.columnDropdownOpen = true;
      container
        .setBorderRoundness(6, true, true, false, false)
        .setBorder("#EC8182", 2);
      parent.setBorder("#EC8182", 2);
    }
    this.canvas.resetDrawingContainers();
    // this.refreshContainers();
  }

  showTextChildElements(parent: GenericRoundedContainer) {
    const currentFontFamily = this.createDropdownBtn(
      1,
      0,
      148,
      30,
      CpspRef.cmp.changeFontFamilyInputValue,
      () => {
        this.toggleFontFamily(currentFontFamily);
      },
      0,
      "white",
      "white",
      "black",
      parent
    );

    currentFontFamily.setBorder("#FCF4EC", 1);

    this.addIcon(
      this.dropdownWidth - 31,
      7,
      20,
      12,
      "arrow-white",
      "arrow-white",
      () => {
        this.toggleFontFamily(currentFontFamily);
      },
      parent
    );

    const currentFontSize = this.createDropdownBtn(
      1,
      30,
      148,
      30,
      CpspRef.cmp.changeFontSizeInputValue + " pt",
      () => {
        this.toggleFontSizes(currentFontSize);
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    currentFontSize.setBorder("#FCF4EC", 1);

    this.addIcon(
      this.dropdownWidth - 31,
      7 + 30,
      20,
      12,
      "arrow-white",
      "arrow-white",
      () => {
        this.toggleFontSizes(currentFontSize);
      },
      parent
    );

    const boldText = this.createDropdownBtn(
      1,
      60,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Bold"),
      () => {
        CpspRef.cmp.fontWeightInputValueChanged("bold");
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    boldText.getChildren()[0].setX(30);
    boldText.setBorder("#FCF4EC", 1);

    this.addIcon(
      8,
      1,
      10,
      24,
      "bold-text-image",
      "bold-text-image",
      () => {
        CpspRef.cmp.fontWeightInputValueChanged("bold");
        this.closeAllDropdowns();
      },
      boldText
    );

    const italicText = this.createDropdownBtn(
      1,
      90,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Italic"),
      () => {
        CpspRef.cmp.fontStyleInputValueChanged("italic");
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    italicText.getChildren()[0].setX(30);
    italicText.setBorder("#FCF4EC", 1);

    this.addIcon(
      11,
      1,
      10,
      24,
      "italic-text-image",
      "italic-text-image",
      () => {
        CpspRef.cmp.fontStyleInputValueChanged("italic");
        this.closeAllDropdowns();
      },
      italicText
    );

    const underlineText = this.createDropdownBtn(
      1,
      120,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Underline"),
      () => {
        CpspRef.cmp.fontDecorationInputValueChanged("underline");
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    underlineText.getChildren()[0].setX(30);
    underlineText.setBorder("#FCF4EC", 0);

    this.addIcon(
      8,
      1,
      13,
      24,
      "underline-text-image",
      "underline-text-image",
      () => {
        CpspRef.cmp.fontDecorationInputValueChanged("underline");
        this.closeAllDropdowns();
      },
      underlineText
    );

    const lineThroughText = this.createDropdownBtn(
      1,
      150,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Line through"),
      () => {
        CpspRef.cmp.fontDecorationInputValueChanged("crossed");
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    lineThroughText.getChildren()[0].setX(30);
    lineThroughText.setBorder("#FCF4EC", 1);

    this.addIcon(
      8,
      1,
      13,
      24,
      "linethrough-text-image",
      "linethrough-text-image",
      () => {
        CpspRef.cmp.fontDecorationInputValueChanged("crossed");
        this.closeAllDropdowns();
      },
      lineThroughText
    );

    const backgroundColor = this.createDropdownBtn(
      1,
      210,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Background color"),
      () => {
        CpspRef.cmp.backgroundColorDiv.click();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition =
          backgroundColor.getGlobalY() + 30;
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    backgroundColor.getChildren()[0].setX(30);
    backgroundColor.setBorder("#FCF4EC", 1);

    this.addIcon(
      7,
      5,
      14,
      13,
      "bucket-white",
      "bucket-white",
      () => {
        CpspRef.cmp.backgroundColorDiv.click();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition =
          backgroundColor.getGlobalY() + 30;
      },
      backgroundColor
    );

    const selectedColor = new GenericRoundedContainer(
      7,
      18,
      14,
      5,
      this.canvas,
      backgroundColor
    );

    selectedColor.setBackgroundColor(
      CpspRef.cmp.changeBackgroundColorInputValue
    );
    selectedColor.setBorderRoundness(3);

    const textColor = this.createDropdownBtn(
      1,
      180,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Text color"),
      () => {
        CpspRef.cmp.textColorDiv.click();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition =
          textColor.getGlobalY() + 60;
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    textColor.getChildren()[0].setX(30);
    textColor.setBorder("#FCF4EC", 1);

    this.addIcon(
      7,
      3,
      13,
      19,
      "text-color",
      "text-color",
      () => {
        CpspRef.cmp.textColorDiv.click();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition =
          textColor.getGlobalY() + 60;
      },
      textColor
    );

    const selectedTextColor = new GenericRoundedContainer(
      7,
      18,
      14,
      5,
      this.canvas,
      textColor
    );

    selectedTextColor.setBackgroundColor(CpspRef.cmp.changeTextColorInputValue);
    selectedTextColor.setBorderRoundness(3);
  }

  showColumnChildElements(parent: GenericRoundedContainer) {
    const splitTape = this.createDropdownBtn(
      1,
      0,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Bryt stapel"),
      () => {},
      0,
      "white",
      "white",
      "black",
      parent
    );

    splitTape.setOnClickHandler(
      (e) => {
        //if click more times
        if(CpspRef.cmp.splitTapeArrow) return;
        CpspRef.cmp.splitTape = true;
        this.closeAllDropdowns();
        CpspRef.cmp.splitTapeArrow = this.addIcon(
          // posX * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
          e.layerX,
          e.layerY - ConfigSc.cellHeight/2,
          ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
          ConfigSc.cellHeight,
          "arrow-split",
          "arrow-split",
          () => {},
          this.getCanvas()
        );
          this.canvas.addDrawingContainer(CpspRef.cmp.splitTapeArrow);
          this.canvas.getCanvasElement().onmousemove = (ev) => {
            // CpspRef.cmp.splitTapeArrow.setX(CpspRef.cmp.splitTapeArrow.getX() + ev.movementX)
            // CpspRef.cmp.splitTapeArrow.setY(CpspRef.cmp.splitTapeArrow.getY() + ev.movementY)

            if(CpspRef.cmp.splitTapeArrow){
              CpspRef.cmp.splitTapeArrow.setX(ev.clientX - ConfigSc.toolboxSize + ConfigSc.cellWidth * CpspRef.cmp.pixelRation)
              CpspRef.cmp.splitTapeArrow.setY(ev.clientY - ConfigSc.cellHeight/2)
            }
            this.canvas.resetDrawingContainers()
          }
      }
    )

    splitTape.setOnMouseRightClickHandler(() => {
      if(CpspRef.cmp.splitTapeArrow){
        this.getCanvas().removeChildById(CpspRef.cmp.splitTapeArrow.getId());
        CpspRef.cmp.splitTapeArrow = undefined;
        CpspRef.cmp.splitTape = false;
        this.canvas.resetDrawingContainers();
      }
    });
    splitTape.getChildren()[0].setX(40);
    splitTape.setBorder("#FCF4EC", 1);

    this.addIcon(
      8,
      11,
      17,
      7,
      "split-tape",
      "split-tape",
      () => {
        CpspRef.cmp.splitTape = true;
        this.closeAllDropdowns();
      },
      splitTape
    );

    const chain = this.createDropdownBtn(
      1,
      30,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Link"),
      () => {
        this.chain();
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    chain.getChildren()[0].setX(40);
    chain.setBorder("#FCF4EC", 1);

    this.addIcon(
      8,
      11,
      17,
      7,
      "chain-plus",
      "chain-plus",
      () => {
        this.chain();
        this.closeAllDropdowns();
      },
      chain
    );

    const unchain = this.createDropdownBtn(
      1,
      60,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Break"),
      () => {
        this.unchain();
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    unchain.getChildren()[0].setX(40);
    unchain.setBorder("#FCF4EC", 1);

    this.addIcon(
      8,
      8,
      17,
      15,
      "chain-remove",
      "chain-remove",
      () => {
        this.unchain();
        this.closeAllDropdowns();
      },
      unchain
    );

    const indent = this.createDropdownBtn(
      1,
      90,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Indent"),
      () => {
        CpspRef.cmp.changeHierarchy(false);
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    indent.getChildren()[0].setX(40);
    indent.setBorder("#FCF4EC", 1);

    this.addIcon(
      7,
      8,
      17,
      15,
      "indent",
      "indent",
      () => {
        CpspRef.cmp.changeHierarchy(false);
        this.closeAllDropdowns();
      },
      indent
    );

    const unindent = this.createDropdownBtn(
      1,
      120,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Unindent"),
      () => {
        CpspRef.cmp.changeHierarchy(true);
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    unindent.getChildren()[0].setX(40);

    unindent.setBorder("#FCF4EC", 1);
    this.addIcon(
      12,
      8,
      17,
      15,
      "unindent",
      "unindent",
      () => {
        CpspRef.cmp.changeHierarchy(true);
        this.closeAllDropdowns();
      },
      unindent
    );

    const activity = this.createDropdownBtn(
      1,
      150,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Activity"),
      () => {
        CpspRef.cmp.addNewActivity();
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    activity.getChildren()[0].setX(40);

    activity.setBorder("#FCF4EC", 1);
    this.addIcon(
      8,
      7,
      20,
      13,
      "activitet",
      "activitet",
      () => {
        CpspRef.cmp.addNewActivity();
        this.closeAllDropdowns();
      },
      activity
    );

    const group = this.createDropdownBtn(
      1,
      180,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Group"),
      () => {
        this.group();
        this.closeAllDropdowns();
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    group.getChildren()[0].setX(40);

    group.setBorder("#FCF4EC", 1);
    this.addIcon(
      8,
      7,
      21,
      14,
      "group",
      "group",
      () => {
        this.group();
        this.closeAllDropdowns();
      },
      group
    );

    const monster = this.createDropdownBtn(
      1,
      // 210,
      210,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Pattern"),
      () => {
        this.toggleMonster(monster);
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    monster.getChildren()[0].setX(40);

    monster.setBorder("#FCF4EC", 1);
    this.addIcon(
      12,
      7,
      16,
      15,
      "monster-drop",
      "monster-drop",
      () => {
        this.toggleMonster(monster);
      },
      monster
    );

    this.addIcon(
      this.dropdownWidth - 31,
      //217,
      217,
      20,
      12,
      "arrow-white",
      "arrow-white",
      () => {
        this.toggleMonster(monster);
      },
      parent
    );

    const note = this.createDropdownBtn(
      1,
      // 240,
      240,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Note"),
      () => {
        this.toggleNote(note);
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    note.getChildren()[0].setX(40);

    note.setBorder("#FCF4EC", 1);
    this.addIcon(
      14,
      7,
      12,
      14,
      "flag",
      "flag",
      () => {
      },
      note
    );

    this.addIcon(
      this.dropdownWidth - 31,
      // 247,
      247,
      20,
      12,
      "arrow-white",
      "arrow-white",
      () => {
        this.toggleNote(note);
      },
      parent
    );

    const color = this.createDropdownBtn(
      1,
      // 180,
      270,
      148,
      30,
      CpspRef.cmp.getTranslate().instant("Color"),
      () => {
        CpspRef.cmp.divTapeColor.click();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition =
          color.getGlobalY() + 30;
      },
      0,
      "white",
      "white",
      "black",
      parent
    );
    color.getChildren()[0].setX(40);

    color.setBorder("#FCF4EC", 1);

    this.addIcon(
      13,
      5,
      14,
      13,
      "bucket-white",
      "bucket-white",
      () => {
        CpspRef.cmp.backgroundColorDiv.click();
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition =
          color.getGlobalY() + 30;
      },
      color
    );

    const selectedColor = new GenericRoundedContainer(
      13,
      18,
      14,
      5,
      this.canvas,
      color
    );

    selectedColor.setBackgroundColor(
      CpspRef.cmp.changeBackgroundTapeColorInputValue
    );
    selectedColor.setBorderRoundness(3);
  }
  toggleFontFamily(parent: GenericRoundedContainer) {
    let fontFamilies = ["Arial", "Calibri", "Geneva", "Verdana"];
    const parentSiblings = parent.getParent().getChildren();
    const ind = fontFamilies.findIndex(ffm => ffm == CpspRef.cmp.changeFontFamilyInputValue);
    if (this.fontDropdownOpen == false) {
      parent.setHeight((fontFamilies.length + 1) * 30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() + parent.getHeight() - 30);
      fontFamilies.forEach((fontFamily, i) => {
        const family = this.createDropdownBtn(
          // 10,
          1,
          30 * (i + 1),
          // this.dropdownWidth - 10,
          this.dropdownWidth - 4,
          30,
          fontFamily,
          () => {
            CpspRef.cmp.fontFamilyInputValueChanged({
              target: { value: fontFamily },
            });
            this.closeAllDropdowns();

          },
          0,
          "black",
          "black",
          i == ind ? "#F3CDCD" :"white",
          parent
        );
        if(i == ind){
          const iconCheck = this.addIcon(
            127,
            8,
            14,
            14,
            "check",
            "check",
            () => {

            },
            family
          );
          iconCheck.draw();
        }

        family.setBorder("", 0);
      });

      for (let i = 2; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() + fontFamilies.length * 30
        );
      }
      this.fontDropdownOpen = true;
    } else {
      this.fontDropdownOpen = false;

      for (let i = 2; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() - fontFamilies.length * 30
        );
      }
      fontFamilies.forEach(() => parent.removeLastChild());
      parent.setHeight(30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() - fontFamilies.length * 30);
    }
    this.refreshContainers();
  }

  toggleFontSizes(parent: GenericRoundedContainer) {
    let fontSizes = ["10", "12", "13", "14", "16", "18", "20"];
    const parentSiblings = parent.getParent().getChildren();
    const ind = fontSizes.findIndex(fsz => fsz == CpspRef.cmp.changeFontSizeInputValue.toString());
    if (this.fontSizeDropdownOpen == false) {
      parent.setHeight((fontSizes.length + 1) * 30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() + parent.getHeight() - 30);
      fontSizes.forEach((fontSize, i) => {
        const size = this.createDropdownBtn(
          1,
          30 * (i + 1),
          this.dropdownWidth - 4,
          30,
          fontSize,
          () => {
            CpspRef.cmp.fontSizeInputValueChanged({
              target: { value: fontSize },
            });
            this.closeAllDropdowns();
          },
          0,
          "black",
          "black",
          i == ind ? "#F3CDCD" :"white",
          parent
        );
        size.setBorder("", 0);
        if(i == ind){
          const iconCheck = this.addIcon(
            127,
            8,
            14,
            14,
            "check",
            "check",
            () => {

            },
            size
          );
          iconCheck.draw();
        }
      });

      for (let i = 4; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() + fontSizes.length * 30
        );
      }
      this.fontSizeDropdownOpen = true;
    } else {
      this.fontSizeDropdownOpen = false;

      for (let i = 4; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() - fontSizes.length * 30
        );
      }

      fontSizes.forEach(() => parent.removeLastChild());
      parent.setHeight(30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() - fontSizes.length * 30);
    }
    this.refreshContainers();
  }

  toggleNote(parent: GenericRoundedContainer){
    // let fontSizes = ["10", "12", "13", "14", "16", "18", "20"];
    let notes = ["flag-yellow", "flag-orange", "flag-reds", "flag-redd", "flag-cyan", "flag-blue", "flag-pink", "flag-purple", "flag-greenl", "flag-greend", "", "" ];
    const parentSiblings = parent.getParent().getChildren();
    if (this.noteDropdownOpen == false) {
      parent.setHeight(3 * 25 + 30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() + parent.getHeight());
      let j = 1;
      notes.forEach((note, i) => {
        let xPos = (i % 4);

        if(j == 1)
          j = 30;
        else if(i % 4 == 0)
          j += 25;
        const size = this.createDropdownBtn(
          xPos * 37,
          j,
          // this.dropdownWidth - 2,
          37,
          25,
          "",
          () => {
            CpspRef.cmp.addNewNote(i+1);
            this.toggleNote(parent);
            this.closeAllDropdowns();
          },
          0,
          "black",
          "black",
          "white",
          parent
        );
        size.setBorder("", 0);

        if(note != ""){
          const noteIcon = this.addIcon(
            10,
            4,
            15,
            17,
            note,
            note,
            () => {
              CpspRef.cmp.addNewNote(i+1);
              this.toggleNote(parent);
              this.closeAllDropdowns();
            },
            size
          );
          noteIcon.draw();
        }

        });


        for(let i = 1; i < 4; i++){
          const vertical = new Line(
            i * 37,
            30,
            i * 37 + 10,
            25 * 3 + 30,
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
            parent
          );
          vertical.setLineThickness(0.5);
          vertical.setColor("#B8B8B8");
          vertical.setFillColor("#B8B8B8");

          const horizontal = new Line(
            0,
            i * 25 + 30,
            158,
            i * 25 + 30,
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
            parent
          );
          horizontal.setLineThickness(0.5);
          horizontal.setColor("#B8B8B8");
          horizontal.setFillColor("#B8B8B8");
        }

      for (let i = 11; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() + 3 * 25
        );
      }
      this.noteDropdownOpen = true;
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() - 30);
    } else {
      this.noteDropdownOpen = false;

      for (let i = 11; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() - 3 * 25
        );
      }
      // parent.removeLastChild()
      notes.forEach(() => parent.removeLastChild());
      for(let i = 0; i < 6; i++){
        parent.removeLastChild();
      }
      parent.setHeight(30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() - 3 * 25);
    }
    this.refreshContainers();
  }

  toggleMonster(parent: GenericRoundedContainer){
    // let fontSizes = ["10", "12", "13", "14", "16", "18", "20"];
    // let monsters = ["monster-1", "monster-2", "monster-3", "monster-4", "monster-5", "monster-6", "monster-7", "monster-8", "monster-9", "monster-10", "monster-11", "monster-12" ];
    const parentSiblings = parent.getParent().getChildren();
    if (this.monsterDropdownOpen == false) {
      parent.setHeight(5 * 25 + 30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() + parent.getHeight());
      let j = 1;
      CpspRef.cmp.monsters.forEach((note, i) => {
        let xPos = (i % 4);

        if(j == 1)
          j = 30;
        else if(i % 4 == 0)
          j += 25;
        const size = this.createDropdownBtn(
          xPos * 37,
          j,
          // this.dropdownWidth - 2,
          37,
          25,
          "",
          () => {
            if(note != ""){
              CpspRef.cmp.addNewMonster(i+1);
              this.toggleMonster(parent);
              this.closeAllDropdowns();
            }

          },
          0,
          "black",
          "black",
          "white",
          parent
        );
        size.setBorder("", 0);
        size.setBackgroundColor("#373B40");

        if(note != ""){
          const noteIcon = this.addIcon(
            10,
            4,
            15,
            17,
            note,
            note,
            () => {
              CpspRef.cmp.addNewMonster(i+1);
              this.toggleMonster(parent);
              this.closeAllDropdowns();
            },
            size
          );
          noteIcon.setBorder("black", 0.5);
          noteIcon.draw();
        }

        });


        for(let i = 1; i < 5; i++){
          if(i < 4){
            const vertical = new Line(
              i * 37,
              30,
              i * 37 + 10,
              25 * 5 + 30,
              CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
              parent
            );
            vertical.setLineThickness(0.5);
            vertical.setColor("#B8B8B8");
            vertical.setFillColor("#B8B8B8");
          }

          const horizontal = new Line(
            0,
            i * 25 + 30,
            158,
            i * 25 + 30,
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
            parent
          );
          horizontal.setLineThickness(0.5);
          horizontal.setColor("#B8B8B8");
          horizontal.setFillColor("#B8B8B8");
        }

      for (let i = 9; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() + 5 * 25
        );
      }
      this.monsterDropdownOpen = true;
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() - 30);
    } else {
      this.monsterDropdownOpen = false;

      for (let i = 9; i < parentSiblings.length; i++) {
        parentSiblings[i].setY(
          parentSiblings[i].getY() - 6 * 25
        );
      }
      // parent.removeLastChild()
      CpspRef.cmp.monsters.forEach(() => parent.removeLastChild());
      for(let i = 0; i < 8; i++){
        parent.removeLastChild();
      }
      parent.setHeight(30);
      parent
        .getParent()
        .setHeight(parent.getParent().getHeight() - 6 * 25);
    }
    this.refreshContainers();
  }

  hideChildElements(parent: GenericRoundedContainer) {
    parent.removeAllChildren();
  }

  chain() {
    if(CpspRef.cmp.selectedMomentsForStyleChange.length == 0) return;
    CpspRef.cmp.setLoadingStatus(true);
        //settimeout se koristi iz razloga što je nekada pri više selektovanih momenata potrebno vremena da se procesuira
        //posljedica toga je da cjeli canvas zakoči i ne može prikazadi loading
        //koristeći settimeout se daje vrijeme da se spinner prikaže
        setTimeout(() => {

          //save selected moments for select after executing block
          const saveSelectedMoments = CpspRef.cmp.deepCopy(
            CpspRef.cmp.selectedMomentsForStyleChange
          );
          let maxEndDate;

          if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
            // multiselect, vise elemenata je potrebno povezati odmah bez nosanja kuglice
            if (CpspRef.cmp.selectedMomentsForStyleChange.length > 1) {
              let momentAlreadyConnected = false;
              for (
                let i = 0;
                i < CpspRef.cmp.selectedMomentsForStyleChange.length - 1;
                i++
              ) {
                const momentSelected =
                  CpspRef.cmp.selectedMomentsForStyleChange[i];
                if (momentSelected.dateSegments[0].connected != 0)
                  momentAlreadyConnected = true;
              }
              if (!momentAlreadyConnected) {
                let firstMomentSelected = CpspRef.cmp.returnSelectedMoment();
                CpspRef.cmp.selectedMomentsForStyleChange.splice(0, 1);
                let firstIs = 0; //first is moment = 0, is parent moment = 1 , is parent activity = 2
                if (firstMomentSelected.moments.length > 0) {
                  if (firstMomentSelected.description != undefined) firstIs = 2;
                  else firstIs = 1;
                }

                // ovo ako Zlatko bude htio mijenjati logiku, da se pomijeri i aktivitet i njegova djeca koja nisu selektovana za multiselect na novi startDate
                // var endDateOfLastStructure = null;

                historySchedulePlaner.addToQueue(
                  () => true,
                  () => true
                );

                while (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
                  let endMomentSelected = CpspRef.cmp.returnSelectedMoment();

                  if (
                    (firstMomentSelected.moments.length == 0 &&
                      firstMomentSelected.description != undefined) ||
                    (firstMomentSelected.name != undefined &&
                      firstMomentSelected.percentage_of_realized_plan == null)
                  ) {
                    if (
                      (endMomentSelected.moments.length == 0 &&
                        endMomentSelected.description != undefined) ||
                      (endMomentSelected.name != undefined &&
                        endMomentSelected.percentage_of_realized_plan == null)
                    ) {
                      firstMomentSelected.dateSegments[0].connected = 1;
                      firstMomentSelected.dateSegments[0].connectedToPlan =
                        endMomentSelected.id;
                      firstMomentSelected.changed = true;
                      const endDate =
                      CpspRef.cmp.addNewLineConnection(
                        firstMomentSelected,
                        endMomentSelected
                      );
                      firstMomentSelected = endMomentSelected;

                      if(maxEndDate == undefined || endDate > maxEndDate){
                        maxEndDate = endDate;
                      }
                      // endDateOfLastStructure = endMomentSelected.end_date != undefined ? endMomentSelected.end_date : endMomentSelected.endDate;
                    }

                    // i aktiviteti selektovani
                    else if (
                      endMomentSelected.moments.length > 0 &&
                      endMomentSelected.description != undefined &&
                      firstIs == 2
                    ) {
                      // const selectedMoments = CpspRef.cmp.deepCopy(CpspRef.cmp.selectedMomentsForStyleChange);
                      // CpspRef.cmp.selectedMomentsForStyleChange = [];
                      // CpspRef.cmp.selectedMomentsForStyleChange.push({
                      //   projectId: CpspRef.cmp.selectedProject.id,
                      //   activityId: endMomentSelected.id,
                      //   stateType: endMomentSelected.number != "" ? "ACTIVITY" : null,
                      //   planId: null,
                      //   userY: null,
                      //   y: endMomentSelected.y,
                      //   moment: endMomentSelected,
                      //   state_number: 0
                      // });
                      // endMomentSelected.moments.forEach(m => {
                      //   CpspRef.cmp.selectedMomentsForStyleChange.push({
                      //     projectId: CpspRef.cmp.selectedProject.id,
                      //     activityId: endMomentSelected.id,
                      //     stateType: m.state,
                      //     planId: m.id,
                      //     userY: m.y,
                      //     y: endMomentSelected.y + m.y,
                      //     moment: m,
                      //     state_number: m.state_number,
                      //     parent: m.parent
                      //   });
                      // });
                      // let daysDiference = CpspRef.cmp.getDaysBetweenDates(endDateOfLastStructure, endMomentSelected.startDate);
                      // CpspRef.cmp.changeMomentsDate(daysDiference, false);
                      // CpspRef.cmp.selectedMomentsForStyleChange = [];
                      // CpspRef.cmp.selectedMomentsForStyleChange = CpspRef.cmp.deepCopy(selectedMoments);
                      // // return
                    }
                    // i paremt momenti selektovani
                    else if (
                      endMomentSelected.name != undefined &&
                      endMomentSelected.percentage_of_realized_plan != null &&
                      firstIs == 1
                    ) {
                    }
                  } else {
                    firstMomentSelected = endMomentSelected;
                  }

                  CpspRef.cmp.selectedMomentsForStyleChange.splice(0, 1);
                }

                CpspRef.cmp.selectedProject.activities = CpspRef.cmp.deepCopy(
                  CpspRef.cmp.copySelectedProject.activities
                );

                //check if elements are from the same activity
                // var acId = CpspRef.cmp.selectedMomentsForStyleChange[0].activityId;
                // CpspRef.cmp.selectedMomentsForStyleChange.forEach(m => {
                //   if (acId != m.activityId) acId = -1;

                // });
                // if (acId != -1) {
                //   //set new parents for childrens, delete group of this parent
                //   CpspRef.cmp.selectedMomentsForStyleChange.slice().reverse().forEach(object => {
                //     CpspRef.cmp.findChildAndSetNewParent(object.projectId, object.moment, object.stateType);
                //   });

                //   CpspRef.cmp.createNewMomentForGroup();
                // }
                // else {
                //   CpspRef.cmp.toastrMessage(
                //     "info",
                //     CpspRef.cmp.getTranslate().instant("You need to select moments from one activity!")
                //   );
                // }
              } else {
                CpspRef.cmp.toastrMessage(
                  "info",
                  CpspRef.cmp
                    .getTranslate()
                    .instant("One or more moments already connected!")
                );
              }
            }
            // selected one element, need to move
            else {
              let m = CpspRef.cmp.returnSelectedMoment(true);
              if (m != null && m.dateSegments[0].connected != 1) {
                if (
                  (m != null &&
                    m.percentage_of_realized_plan == null &&
                    m.start_date != null) ||
                  (m != null &&
                    m.moments.length == 0 &&
                    m.percentage_of_realized_activity == null &&
                    m.startDate != null)
                ) {
                  let eDate = m.dateSegments.at(-1).endDate;
                  const chainIcon = this.addIcon(
                    CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                      new Date(eDate)
                    ) * CpspRef.cmp.pixelRation,
                    m.y + ConfigSc.cellHeight / 4,
                    16,
                    16,
                    "chain-icon-create",
                    "chain-icon-create",
                    () => { },
                    CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                  );
                  chainIcon.draw();
                  chainIcon.setOnMouseDownHandler(() => {

                    const circle = new RoundedRectangle(
                      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                        new Date(eDate)
                      ) * CpspRef.cmp.pixelRation,
                      m.y + ConfigSc.cellHeight / 3,
                      10,
                      10,
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                    );
                    circle.setBackgroundColor("red");
                    circle.setBorderRoundness(5);
                    circle.setBorder("black", 1);
                    circle.draw();
                    let line = new Line(
                      chainIcon.getX() + ConfigSc.cellWidth / 2,
                      chainIcon.getY() + ConfigSc.cellHeight / 2,
                      chainIcon.getX() + ConfigSc.cellWidth / 2,
                      chainIcon.getY() + ConfigSc.cellHeight / 2,
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                    );
                    line.setLineDash([5, 5]);
                    line.draw();

                    this.getCanvas().getCanvasElement().onmousemove = (ev) => {
                      if (
                        (Math.abs(
                          ev.offsetX - chainIcon.getParent().getGlobalX()
                        ) > ConfigSc.cellWidth ||
                          Math.abs(
                            ev.offsetY - chainIcon.getParent().getGlobalY()
                          ) > ConfigSc.cellHeight) &&
                        ev.offsetX >
                        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getWidth() &&
                        ev.offsetY >
                        ConfigSc.toolboxSize + ConfigSc.topSectionSize
                      ) {
                        line.setX(
                          ev.offsetX - chainIcon.getParent().getGlobalX()
                        );
                        line.setY(
                          ev.offsetY - chainIcon.getParent().getGlobalY()
                        );
                        chainIcon.setX(
                          ev.offsetX - chainIcon.getParent().getGlobalX()
                        );
                        chainIcon.setY(
                          ev.offsetY - chainIcon.getParent().getGlobalY()
                        );
                        CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                          .getInnerContainer()
                          .removeChildById(line.getId());
                        CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                          .getInnerContainer()
                          .removeChildById(chainIcon.getId());
                        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

                        circle.draw();
                        line.draw();
                        chainIcon.draw();
                      }
                    };

                    chainIcon.addRemoveEventsForMouseDownEvent(() => {
                      let greenChainIcon;

                      let momentEnd = CpspRef.cmp.getMomentByPosition(
                        chainIcon.getX() / CpspRef.cmp.pixelRation,
                        chainIcon.getY()
                      );
                      if (
                        momentEnd != null &&
                        m.dateSegments[0].connected == 0 &&
                        m.id != momentEnd.id
                      ) {
                        greenChainIcon = this.addIcon(
                          chainIcon.getX(),
                          chainIcon.getY(),
                          16,
                          16,
                          "chain-icon-create-green",
                          "chain-icon-create-green",
                          () => { },
                          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
                        );

                        greenChainIcon.draw();
                        m.dateSegments[0].connected = 1;
                        m.dateSegments[0].connectedToPlan = momentEnd.id;
                        m.changed = true;
                        CpspRef.cmp.addNewLineConnection(m, momentEnd,false);
                        CpspRef.cmp.selectedMomentsForStyleChange = [];

                        historySchedulePlaner.addToQueue(
                          () => true,
                          () => true
                        );
                      }

                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                        .getInnerContainer()
                        .removeChildById(circle.getId());
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                        .getInnerContainer()
                        .removeChildById(line.getId());
                      CpspRef.cmp.projectSchedulePlanerApp.gridContainer
                        .getInnerContainer()
                        .removeChildById(chainIcon.getId());
                      // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeChildById(greenChainIcon.getId());
                      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
                    });
                  });
                }
              } else {
                CpspRef.cmp.toastrMessage(
                  "info",
                  CpspRef.cmp
                    .getTranslate()
                    .instant("Selected moments already connected!")
                );
              }
            }
            CpspRef.cmp.setLoadingStatus(false);
          }

          //restore selected moments from beginning of the method
          CpspRef.cmp.selectedMomentsForStyleChange =
            CpspRef.cmp.deepCopy(saveSelectedMoments);
          if (CpspRef.cmp.selectedMomentsForStyleChange.length > 1 && !CpspRef.cmp.changeLatestEndDate(maxEndDate))
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        }, 200);
  }

  unchain() {

    //copy selected moments for saving after execution of the method
    const saveSelectedMoments = CpspRef.cmp.deepCopy(
      CpspRef.cmp.selectedMomentsForStyleChange
    );
    let selectCount = 0;
    if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
      CpspRef.cmp.setLoadingStatus(true);

      historySchedulePlaner.addToQueue(
        () => true,
        () => true
      );

      while (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
        let m = CpspRef.cmp.returnSelectedMoment();

        if (Number(m.dateSegments[0].connected) != 0) {
          m.dateSegments[0].connected = 0;
          m.dateSegments[0].connectedToPlan = null;
          saveSelectedMoments[
            selectCount
          ].dateSegments[0].connected = 0;
          saveSelectedMoments[
            selectCount
          ].dateSegments[0].connectedToPlan = null;
          CpspRef.cmp.removeLineConnection(m);
        }
        selectCount++;
        CpspRef.cmp.selectedMomentsForStyleChange.splice(0, 1);
      }

      //restore selected moments from beginning of the method
      CpspRef.cmp.selectedMomentsForStyleChange =
        CpspRef.cmp.deepCopy(saveSelectedMoments);

      CpspRef.cmp.setLoadingStatus(false);
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    }
}

  group() {
    if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
      //check if elements are from the same activity
      let acStateNum =
        CpspRef.cmp.selectedMomentsForStyleChange[0].state_number !=
        undefined
          ? CpspRef.cmp.selectedMomentsForStyleChange[0].state_number
          : 0;
      for (
        let i = 0;
        i < CpspRef.cmp.selectedMomentsForStyleChange.length;
        i++
      ) {
        const m = CpspRef.cmp.selectedMomentsForStyleChange[i];

        let sN = m.state_number != undefined ? m.state_number : 0;
        let StartDate =
          m.startDate != undefined
            ? m.startDate
            : m.start_date;
        let EndDate =
          m.endDate != undefined ? m.endDate : m.end_date;
        if (acStateNum > sN) {
          acStateNum = -1;
          break;
        }
        if (StartDate == null || EndDate == null) {
          acStateNum = -2;
          break;
        }
      }

      if (acStateNum != -1 && acStateNum != -2) {
        //set new parents for childrens, delete group of this parent -------------ovo sad za sad ne treba, djeca planova ostaju djeca samo plan prebacim u novu grupu, odnosno dodijelim mu novog roditelja
        // CpspRef.cmp.selectedMomentsForStyleChange.slice().reverse().forEach(object => {
        //   CpspRef.cmp.findChildAndSetNewParent(object.projectId, object.moment, object.stateType);
        // });
        //create new parent for grouped plans

        CpspRef.cmp.createNewMomentForGroup();
        //CpspRef.cmp.addListContentToHistory();
      } else {
        if (acStateNum == -1)
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
              .getTranslate()
              .instant("You need to select moments with same level!")
          );
        else
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
              .getTranslate()
              .instant("Moments start and final date must be defined!")
          );
      }
      //CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer = null;
    } else {
      CpspRef.cmp.toastrMessage(
        "info",
        CpspRef.cmp.getTranslate().instant("There is no moments selected!")
      );
    }
  }

  refreshContainers() {
    this.canvas.getChildren().forEach((child) => {
      child.draw();
    });
    if(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer){
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.drawSelectedContainer();
    }
  }

  closeAllDropdowns() {
    this.dropdowns.forEach((dropdown) => {
      dropdown.setHeight(0);
      dropdown.removeAllChildren();
      dropdown.setBorder("", 0);
      dropdown.getChildren();
    });
    this.dropdownContainers.forEach((container) => {
      container.getChildren()[0].setBorderRoundness(6).setBorder("#9A9896", 2);
      container.getChildren()[0].setBackgroundColor("#373B40");
    });
    this.fontDropdownOpen = false;
    this.textDropdownOpen = false;
    this.columnDropdownOpen = false;
    this.noteDropdownOpen = false;
    this.monsterDropdownOpen = false;
    if(this.dropdownMenu)
      this.dropdownMenu.close();
    this.refreshContainers();
  }
}
