import * as moment from "moment";
import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
// import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
//import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";

export class ProjectHeader extends AContainer{

  public saveButton: GenericRoundedContainer;
  public retButton: GenericRoundedContainer;
  public lockButton: GenericRoundedContainer;

  private absenceButton;
  private hoursButtonLeft;
  private hoursButton;

  // private toggleAbbsence = false;
  private moveButton =0;

  private sendDateText;


  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    // this.toggleAbbsence = false;
    this.moveButton = window.innerWidth >= 1920 ? 0 : -408;
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

    const undoIcon = this.addIcon(
      w + 15,
      0,
      23,
      19,
      "undo",
      "undo",
      () => {
        if (
          (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
          ) {
          return;
        }
        historySchedulePlaner.undo();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.setAllDisplayProjectsAndMomentsCoordinates()
      }
    );
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

    const redoIcon = this.addIcon(
      w + 60,
      0,
      23,
      19,
      "redo",
      "redo",
      () => {
        if (
          (CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.lockedRevision)
          ) {
          return;
        }
        historySchedulePlaner.redo();
      }
    );
    redoIcon.setYAlignment("center");

    //editing rows
    CpspRef.cmp.hideEditingRows();
    // CpspRef.cmp.hideHoursProject(false);

//editing hours
    // const editingHours = new GenericRoundedContainer(
    //   w + 100,
    //   23,
    //   200,
    //   30,
    //   this.canvas,
    //   this
    // );
    // editingHours.setBackgroundColor("#373B40");
    // editingHours.setBorder("#FCF4EC", 1);
    // editingHours.setBorderRoundness(4);

    this.createButtonDropdownHours(this);

    const showNames = new GenericRoundedContainer(
      w + 317,
      23,
      120,
      30,
      this.canvas,
      this
    );
    showNames.setBackgroundColor("#373B40");
    showNames.setBorder("#FCF4EC", 1);
    showNames.setBorderRoundness(4);

    const showNamesText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Moments name"), this.canvas, this);
    showNamesText.setFontSize(13);
    showNamesText.setColor("#FFFFFF");
    showNamesText.setFontFamily("PT-Sans-Pro-Regular");
    showNamesText.setX(w + 337);
    showNamesText.setY(33);


    let b = document.getElementById(
      "dropdown-div"
    );

    b.style.display = "none";

//buttons
    // this.retButton = this.createButton(
    //   1096 + this.moveButton,
    //   -20,
    //   156,
    //   33,
    //   CpspRef.cmp.getTranslate().instant("Absence").toUpperCase(),
    //   ()=>{
    //     if(!this.toggleAbbsence)
    //     this.addAbsence();
    //     this.toggleAbbsence = !this.toggleAbbsence;
    //   },
    //   6,
    //   "#FFFFFF",
    //   "#FF8787"
    // );
    // this.retButton.setYAlignment("bottom");
    // this.retButton.setBorder("#FCF4EC", 1);
    // this.retButton.getFirstChild().setX(17);

    // const retButtonArrow = this.addIcon(
    //   this.retButton.getWidth() - 27,
    //   0,
    //   15,
    //   8,
    //   "arrow-drop-down",
    //   "arrow-drop-down",
    //   () => {
    //     if(!this.toggleAbbsence)
    //     this.addAbsence();
    //     this.toggleAbbsence = !this.toggleAbbsence;
    //   },
    //   this.retButton
    //   );
    // retButtonArrow.setYAlignment("center");

    this.createButtonDropdownAbsence(this);

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
      1456 + this.moveButton,
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

        if(
          historySchedulePlaner.getNumberOfChanges() > 0 ||
          CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 ||
          CpspRef.cmp.copySelectedProject == null
          )
          return;

        CpspRef.cmp.scaleCanvas();

        CpspRef.cmp.showConfirmationModal(
          CpspRef.cmp.getTranslate().instant("Do you want to lock?"),
          (response) => {
            if (response.result) {
              if (CpspRef.cmp.loading) {
                return;
              }
              CpspRef.cmp.setLoadingStatus(true);
              CpspRef.cmp.saveState();
              CpspRef.cmp.setLoadingStatus(false);
              CpspRef.cmp.toastrMessage(
                "success",
                CpspRef.cmp.getTranslate().instant("Successfully lock!")
              );
            }
            CpspRef.cmp.scaleCanvas(false);
          }
        );
      },
      6,
      historySchedulePlaner.getNumberOfChanges() == 0
      // && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
      // && CpspRef.cmp.copySelectedProject != null
      ? "#FF8787" : "#FCF4EC",
      historySchedulePlaner.getNumberOfChanges() == 0
      // && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
      // && CpspRef.cmp.copySelectedProject != null
      ? "#FF8787" : "#FCF4EC"
    );
    this.lockButton.setYAlignment("center");
    this.lockButton.draw();

    this.saveButton = this.createButton(
      1382 + this.moveButton,
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
      ? "#FF8787" : "#FCF4EC",
      historySchedulePlaner.getNumberOfChanges() > 0
      // && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
      ? "#FF8787" : "#FCF4EC"
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
      iconShape.setOnClickHandler(onClickFn);
      iconShape.setOnMouseHoverHandler(() => document.body.style.cursor = "pointer");
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
    const button = new GenericRoundedContainer(x, y, width, height, this.canvas, this);
    button.setBackgroundColor(backgroundColor);
    button.setBorder(borderColor, 1.5);
    if(ConfigSc.isInEditMode) {
        button.setOnClickHandler(onClickFn);
        button.setOnMouseHoverHandler(() => {
            document.body.style.cursor = "pointer";
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

  private isButtonHoursHoverd = false;

  createButtonDropdownHours(parent) {
    this.hoursButtonLeft = new GenericRoundedContainer(
      100,
      23,
      105,
      30,
      this.canvas,
      parent
    );
    this.hoursButtonLeft.setBackgroundColor("#373B40");
    this.hoursButtonLeft.setBorder("#FFFFFF", 1.5);
    this.hoursButtonLeft.setBorderRoundness(6,true,false,true,false);

    this.hoursButton = new GenericRoundedContainer(
      205,
      23,
      80,
      30,
      this.canvas,
      parent
    );
    this.hoursButton.setBackgroundColor("#373B40");
    this.hoursButton.setBorder("#FFFFFF", 1.5);
    this.hoursButton.setBorderRoundness(6,false,true,false,true);

    this.hoursButton.setOnClickHandler(() => {
      this.isButtonHoursHoverd = false;
      this.canvas.removeChildById(this.hoursButton.getId());
      this.showHoursMenu(this);
    });

    const daysHoursText =
    CpspRef.cmp.changeHoursOnProject + " " + CpspRef.cmp.getTranslate().instant("hour");

    const daysHours = new TextRenderer(daysHoursText, this.canvas, this);
    daysHours.setFontSize(13);
    daysHours.setColor("#FF8787");
    daysHours.setFontFamily("PT-Sans-Pro-Regular");
    daysHours.setX(215);
    daysHours.setY(33);

    const workDayText = new TextRenderer("1 " +CpspRef.cmp.getTranslate().instant("working day") + " =   ", this.canvas, this);
    workDayText.setFontSize(13);
    workDayText.setColor("#FF8787");
    workDayText.setFontFamily("PT-Sans-Pro-Regular");
    workDayText.setX(110);
    workDayText.setY(33);

    const icon = new Rectangle(-10, 0, 15, 8, this.canvas, this.hoursButton);
    icon.addBackgroundImagePattern("arrow-drop-down", "arrow-drop-down", 15, 8);
    icon.setXAlignment("right");
    icon.setYAlignment("center");

    this.hoursButton.setOnMouseHoverHandler((e) => {
      document.body.style.cursor = "pointer";
      if (!this.isButtonHoursHoverd) {
        this.hoursButton.setBorder("#FF8787", 1.5);
        this.hoursButton.draw();
        this.hoursButtonLeft.setBorder("#FF8787", 1.5);
        this.hoursButtonLeft.draw();
        daysHours.draw();
        workDayText.draw();
        icon.draw();

        this.isButtonHoursHoverd = true;
      }
    });

    this.hoursButtonLeft.setOnMouseHoverHandler((e) => {
      if (!this.isButtonHoursHoverd) {
        this.hoursButton.setBorder("#FF8787", 1.5);
        this.hoursButton.draw();
        this.hoursButtonLeft.setBorder("#FF8787", 1.5);
        this.hoursButtonLeft.draw();
        daysHours.draw();
        workDayText.draw();
        icon.draw();

        this.isButtonHoursHoverd = true;
      }
    });

    this.hoursButton.getParent().setOnMouseHoverHandler((e) => {
      if (this.isButtonHoursHoverd) {
        this.hoursButton.setBorder("#FFFFFF", 1.5);
        this.hoursButton.draw();
        this.hoursButtonLeft.setBorder("#FFFFFF", 1.5);
        this.hoursButtonLeft.draw();
        daysHours.draw();
        workDayText.draw();
        icon.draw();
        this.isButtonHoursHoverd = false;
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      }
    });
  }

  showHoursMenu(parent) {
    const container = new GenericRoundedContainer(
      205,
      23,
      80,
      513,
      this.canvas,
      parent
    );
    container.setBackgroundColor("#373B40");
    container.setBorder("#FF8787", 1.5);
    container.setBorderRoundness(6);
    this.canvas.setForeground(container);


    const button = new GenericRoundedContainer(
      0,
      0,
      container.getWidth(),
      33,
      this.canvas,
      container
    );

    button.setOnClickHandler(() => {
      this.canvas.setForeground(null);
      this.removeChildById(container.getId());
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.draw();
    });

    const daysHoursText =
    CpspRef.cmp.changeHoursOnProject + " " + CpspRef.cmp.getTranslate().instant("hour");

    const daysHours = new TextRenderer(daysHoursText, this.canvas, button);
    daysHours.setFontSize(13);
    daysHours.setColor("#FF8787");
    daysHours.setFontFamily("PT-Sans-Pro-Regular");
    daysHours.setX(10);
    daysHours.setY(10);

    daysHours.draw();

    const workDayText = new TextRenderer("1 " +CpspRef.cmp.getTranslate().instant("working day") + " =   ", this.canvas, this);
    workDayText.setFontSize(13);
    workDayText.setColor("#FF8787");
    workDayText.setFontFamily("PT-Sans-Pro-Regular");
    workDayText.setX(110);
    workDayText.setY(33);

    workDayText.draw();

    const icon = new Rectangle(-10, 10, 15, 8, this.canvas, container);
    icon.addBackgroundImagePattern("arrow-drop-down-close", "arrow-drop-down-close", 15, 8);
    icon.setXAlignment("right");

    for(let i = 0; i < 24; i++){
      const menuBtn = new GenericRoundedContainer(
        1.5,
        32 + (i * 20),
        container.getWidth() - 3,
        20,
        this.canvas,
        container
      );
      if(i + 1 == CpspRef.cmp.changeHoursOnProject){
        menuBtn.setBackgroundColor("#F3CDCD");
        const iconCheck = this.addIcon(
          -7,
          0,
          14,
          14,
          "check",
          "check",
          () => {

          },
          menuBtn
        );
        iconCheck.setXAlignment("right")
        iconCheck.setYAlignment("center")
        iconCheck.draw();
      } else {
        menuBtn.setBackgroundColor("#FFFFFF");
      }

      if(i == 23){
        menuBtn.setBorderRoundness(6,false,false,true,true)
      }

      const menuBtnText = new TextRenderer(
        (i + 1).toString(),
        this.canvas,
        menuBtn
      );
      menuBtnText.setColor("#373B40");
      menuBtnText.setFontSize(13);
      menuBtnText.setYAlignment("center");
      menuBtnText.setX(10);
      menuBtnText.updateTextDimensions();

      menuBtn.setOnClickHandler(() => {
        this.canvas.setForeground(null);
        CpspRef.cmp.hoursProjectInputValueChanged(i + 1)
        this.removeChildById(container.getId());
        this.createButtonDropdownHours(this);
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.draw();
      });
    }



    CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();


  }

  private isButtonHoverd = false;

  createButtonDropdownAbsence(parent) {
    this.absenceButton = new GenericRoundedContainer(
      1096 + this.moveButton,
      23,
      156,
      33,
      this.canvas,
      parent
    );
    this.absenceButton.setBackgroundColor("#373B40");
    this.absenceButton.setBorder("#FFFFFF", 1.5);
    this.absenceButton.setBorderRoundness(6);

    this.absenceButton.setOnClickHandler(() => {
      this.canvas.removeChildById(this.absenceButton.getId());
      this.showMenu(this);
    });

    const buttonText = new TextRenderer(
      "  " + CpspRef.cmp.getTranslate().instant("RPC_Absence").toUpperCase(),
      this.canvas,
      this.absenceButton
    );
    buttonText.setColor("#FF8787");
    buttonText.setFontSize(13);
    buttonText.setAlignment("left", "center");
    buttonText.updateTextDimensions();

    const icon = new Rectangle(-10, 0, 15, 8, this.canvas, this.absenceButton);
    icon.addBackgroundImagePattern("arrow-drop-down", "arrow-drop-down", 15, 8);
    icon.setXAlignment("right");
    icon.setYAlignment("center");

    this.absenceButton.setOnMouseHoverHandler((e) => {
      document.body.style.cursor = "pointer";
      if (!this.isButtonHoverd) {
        this.absenceButton.setBorder("#FF8787", 1.5);
        this.absenceButton.draw();
        buttonText.draw();
        icon.draw();

        this.isButtonHoverd = true;
      }
    });

    this.absenceButton.getParent().setOnMouseHoverHandler((e) => {
      if (this.isButtonHoverd) {
        this.absenceButton.setBorder("#FFFFFF", 1.5);
        this.absenceButton.draw();
        buttonText.draw();
        icon.draw();
        this.isButtonHoverd = false;
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      }
    });
  }

  showMenu(parent) {
    const container = new GenericRoundedContainer(
      1096 + this.moveButton,
      23,
      156,
      62,
      this.canvas,
      parent
    );
    container.setBackgroundColor("#373B40");
    container.setBorder("#FF8787", 1.5);
    container.setBorderRoundness(6);

    this.canvas.setForeground(container);

    const button = new GenericRoundedContainer(
      0,
      0,
      container.getWidth(),
      33,
      this.canvas,
      container
    );

    button.setOnClickHandler(() => {
      this.canvas.setForeground(null);
      this.removeChildById(container.getId());
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
    });

    const buttonText = new TextRenderer(
      "  " + CpspRef.cmp.getTranslate().instant("RPC_Absence").toUpperCase(),
      this.canvas,
      button
    );
    buttonText.setColor("#FF8787");
    buttonText.setFontSize(13);
    buttonText.setAlignment("left", "center");
    buttonText.updateTextDimensions();

    const icon = new Rectangle(-10, 10, 15, 8, this.canvas, container);
    icon.addBackgroundImagePattern("arrow-drop-down-close", "arrow-drop-down-close", 15, 8);
    icon.setXAlignment("right");

    const menuBtn = new GenericRoundedContainer(
      0,
      32,
      container.getWidth(),
      29,
      this.canvas,
      container
    );
    menuBtn.setBorderRoundness(6,false,false,true,true);
    menuBtn.setBorder("#FF8787",1.5)
    menuBtn.setBackgroundColor("#FFFFFF");

    const menuBtnText = new TextRenderer(
      CpspRef.cmp.getTranslate().instant("RPC_Absenc_add_update"),
      this.canvas,
      menuBtn
    );
    menuBtnText.setColor("#373B40");
    menuBtnText.setFontSize(13);
    menuBtnText.setAlignment("center", "center");
    menuBtnText.updateTextDimensions();

    CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();

    menuBtn.setOnClickHandler(() => {
      this.canvas.setForeground(null);
      CpspRef.cmp.showPlannedVacationModal();
      this.removeChildById(container.getId());
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
    });
  }
}
