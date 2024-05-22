import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { DropdownMenu } from "src/app/canvas-ui/DropdownMenu";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";

export class ReconsilationHeader extends AContainer{

  public saveButton: GenericRoundedContainer;
  public retButton: GenericRoundedContainer;
  public sendButton: GenericRoundedContainer;
  public lockButton: GenericRoundedContainer;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

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
        historySchedulePlaner.redo();
      }
    );
    redoIcon.setYAlignment("center");

//editing rows
    const editingRows = new GenericRoundedContainer(
      100,
      23,
      325,
      30,
      this.canvas,
      this
    );
    editingRows.setBackgroundColor("#373B40");
    editingRows.setBorder("#FCF4EC", 1);
    editingRows.setBorderRoundness(6);

    const space = new GenericRoundedContainer(
      335,
      26,
      1,
      20,
      this.canvas,
      this
    );
    space.setBackgroundColor("#FCF4EC");

    const bucketWhite = this.addIcon(
      335 + 12,
      -5,
      14,
      13,
      "bucket-white",
      "bucket-white",
      () => { }
    );
    bucketWhite.setYAlignment("center");

    const arrowOpen = this.addIcon(
      335 + 24,
      -5,
      15,
      9,
      "arrow-white",
      "arrow-white",
      () => { }
    );
    arrowOpen.setYAlignment("center");

    const arrowOpen2 = this.addIcon(
      335 + 64,
      -5,
      15,
      9,
      "arrow-white",
      "arrow-white",
      () => { }
    );
    arrowOpen2.setYAlignment("center");

//editing columns
    const editingColumns = new GenericRoundedContainer(440, 23, 72, 30, this.canvas, this);
    editingColumns.setBackgroundColor("#373B40");
    editingColumns.setBorder("#FCF4EC", 1);
    editingColumns.setBorderRoundness(6);

    const flag = this.addIcon(
      440 + 10, 
      0, 
      12, 
      14, 
      "flag", 
      "flag", 
      () => {
        CpspRef.cmp.addNewNote();
      }
    );
    flag.setYAlignment("center");

    const columnSpace8 = new GenericRoundedContainer(440 + 30, 27, 1, 20, this.canvas, this);
    columnSpace8.setBackgroundColor("#FCF4EC");

    const bucketWhiteColumn = this.addIcon(
      440 + 30 + 10,
      -5,
      14,
      13,
      "bucket-white",
      "bucket-white",
      () => { }
      );
    bucketWhiteColumn.setYAlignment("center");
    const arrowOpen4 = this.addIcon(
      440 + 30 + 24,
      -5,
      15,
      9,
      "arrow-white",
      "arrow-white",
      () => { }
      );
    arrowOpen4.setYAlignment("center");
    const noteText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Listing"), this.canvas, this);
    noteText.setFontSize(10);
    noteText.setColor("#FFFFFF");
    noteText.setFontFamily("PT-Sans-Pro-Regular");
    noteText.setX(440 + 20);
    noteText.setY(60);


//percentage of events

    const editingPercents = new GenericRoundedContainer(
      526,
      6,
      328,
      66,
      this.canvas,
      this
    );
    editingPercents.setBackgroundColor("#373B40");
    editingPercents.setBorder("#FCF4EC", 1);
    editingPercents.setBorderRoundness(6);

    const nullPercents = this.addIcon(
      526 + 11,
      16,
      24,
      24,
      "null-percents",
      "null-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(0);
      }
    );
    nullPercents.getHeight();

    const tenPercents = this.addIcon(
      526 + 40,
      16,
      24,
      24,
      "ten-percents",
      "ten-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(10);
      }
    );
    tenPercents.getHeight();

    const twfivePercents = this.addIcon(
      526 + 69,
      16,
      24,
      24,
      "twfive-percents",
      "twfive-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(25);
      }
    );
    twfivePercents.getHeight();

    const fiftyPercents = this.addIcon(
      526 + 98,
      16,
      24,
      24,
      "fifty-percents",
      "fifty-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(50);
      }
    );
    fiftyPercents.getHeight();

    const svfivePercents = this.addIcon(
      526 + 127,
      16,
      24,
      24,
      "svfive-percents",
      "svfive-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(75);
      }
    );
    svfivePercents.getHeight();

    const nintyPercents = this.addIcon(
      526 + 156,
      16,
      24,
      24,
      "ninty-percents",
      "ninty-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(90);
      }
    );
    nintyPercents.getHeight();

    const hundredPercents = this.addIcon(
      526 + 184,
      16,
      24,
      24,
      "hundred-percents",
      "hundred-percents",
      () => {
        CpspRef.cmp.percentageOfRealizedPlanStateChanged(100);
      }
    );
    hundredPercents.getHeight();

    const markAccordingToPlan = this.addIcon(
      526 + 11,
       42, 
       53, 
       24, 
       "mark-according-to-plan", 
       "mark-according-to-plan", 
       () => { 
        CpspRef.cmp.markAccordingToPlan();
       }
      );
    markAccordingToPlan.getHeight();
    const markAccordingToPlanRect = new GenericContainer(
      526 + 11 + 1, 
      42 + 2, 
      32, 
      8, 
      this.canvas, 
      this
    );
    markAccordingToPlanRect.setBackgroundColor("#FF8787");
    markAccordingToPlanRect.setOnMouseHoverHandler(() => {
      document.body.style.cursor = "pointer";
    });
    markAccordingToPlanRect.setOnClickHandler(
      () => {
      CpspRef.cmp.markAccordingToPlan();
      }
    ); 
    
    const redLine = new GenericContainer(526 + 11 + 31, 42, 3, 24, this.canvas, this);
    redLine.setBackgroundColor("#FF0000");

    const nextIconMarkAccordingToPlan = this.addIcon(526 + 11 + 8, 42 + 14, 16, 5, "next-week", "next-week", () => { });
    nextIconMarkAccordingToPlan.getHeight();

    const emptyMarkAccordingToPlan = new GenericRoundedContainer(526 + 11 + 53 + 7, 51, 69, 12, this.canvas, this);
    emptyMarkAccordingToPlan.setBackgroundColor("#373B40");
    const textMarkAccordingToPlan = new TextRenderer(CpspRef.cmp.getTranslate().instant("Mark according to plan"), this.canvas, emptyMarkAccordingToPlan);
    textMarkAccordingToPlan.setColor("#FFFFFF");
    textMarkAccordingToPlan.setFontSize(10);
    textMarkAccordingToPlan.setAlignment("left", "center");
    textMarkAccordingToPlan.updateTextDimensions();

    const moveToCompleted = this.addIcon(
      526 + 265, 
      11, 
      53, 
      24, 
      "move-to-completed", 
      "move-to-completed", 
      () => { 
        CpspRef.cmp.moveToNotCompleted();
      }
      );
    moveToCompleted.getHeight();

    const nextIconMoveToCompleted = this.addIcon(
      526 + 265 + 1, 
      26, 
      27, 
      5, 
      "next-week", 
      "next-week", 
      () => {
        CpspRef.cmp.moveToNotCompleted();
       }
      );
    nextIconMoveToCompleted.getHeight();
    const emptyMoveToCompleted = new GenericRoundedContainer(526 + 222, 13, 40, 20, this.canvas, this);
    emptyMoveToCompleted.setBackgroundColor("#373B40");
    const textMoveToCompleted = new TextRenderer(CpspRef.cmp.getTranslate().instant("Move to not completed"), this.canvas, emptyMoveToCompleted);
    textMoveToCompleted.setColor("#FFFFFF");
    textMoveToCompleted.setFontSize(10);
    textMoveToCompleted.setAlignment("left", "center");
    textMoveToCompleted.updateTextDimensions();



    const moveToNotCompleted = this.addIcon(
      526 + 252, 
      42, 
      53, 
      24, 
      "move-to-not-completed", 
      "move-to-not-completed", 
      () => { 
        CpspRef.cmp.moveToCompleted();
      }
    );
    moveToNotCompleted.getHeight();

    const previousIconMoveToNotCompleted = this.addIcon(526 + 276, 56 , 24, 5, "previous-week", "previous-week", () => { });
    previousIconMoveToNotCompleted.getHeight();

    const emptyMoveToNotCompleted = new GenericRoundedContainer(526 + 212, 44, 32, 20, this.canvas, this);
    emptyMoveToNotCompleted.setBackgroundColor("#373B40");
    const textMoveToNotCompleted = new TextRenderer(CpspRef.cmp.getTranslate().instant("Move to completed"), this.canvas, emptyMoveToNotCompleted);
    textMoveToNotCompleted.setColor("#FFFFFF");
    textMoveToNotCompleted.setFontSize(10);
    textMoveToNotCompleted.setAlignment("left", "center");
    textMoveToNotCompleted.updateTextDimensions();

    const redLine2 = new GenericContainer(526+285, 11, 3, 54, this.canvas, this);
    redLine2.setBackgroundColor("#FF0000");

    const emptyCompleted = new GenericRoundedContainer(526 + 85, 0, 62, 12, this.canvas, this);
    emptyCompleted.setBackgroundColor("#373B40");
    const textEmptyCompleted = new TextRenderer(CpspRef.cmp.getTranslate().instant("Completed").toUpperCase(), this.canvas, emptyCompleted);
    textEmptyCompleted.setColor("#FFFFFF");
    textEmptyCompleted.setFontSize(10);
    textEmptyCompleted.setAlignment("center", "center");
    textEmptyCompleted.updateTextDimensions();

//editing weeks
    const editingWeeks = new GenericRoundedContainer(867, 6, 207, 66, this.canvas, this);
    editingWeeks.setBackgroundColor("#373B40");
    editingWeeks.setBorder("#FCF4EC", 1);
    editingWeeks.setBorderRoundness(6);

    const previousIcon = this.addIcon(867 + 30, -25, 16, 5, "previous-week", "previous-week", () => { });
    previousIcon.setYAlignment("center");

    const previousWeek4 = this.createButton(
      867 + 10,
      0,
      24,
      34,
      "4V.",
      ()=>{
        CpspRef.cmp.changeMomentsDate(-28);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    previousWeek4.setYAlignment("center");
    previousWeek4.setBorder("#FFFFFF", 1);

    const previousWeek1 = this.createButton(
      867 + 40,
      0,
      24,
      34,
      "1V.",
      ()=>{
        CpspRef.cmp.changeMomentsDate(-7);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    previousWeek1.setYAlignment("center");
    previousWeek1.setBorder("#FFFFFF", 1);

    const previousDay1 = this.createButton(
      867 + 70,
      -13,
      24,
      43,
      "1.\nDag",
      ()=>{
        CpspRef.cmp.changeMomentsDate(-1);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    previousDay1.setYAlignment("bottom");
    previousDay1.setBorder("#FFFFFF", 1);

    const weekText1 = new TextRenderer(CpspRef.cmp.getTranslate().instant("Week"), this.canvas, this);
    weekText1.setFontSize(10);
    weekText1.setColor("#FF8787");
    weekText1.setFontFamily("PT-Sans-Pro-Regular");
    weekText1.setX(867 + 20);
    weekText1.setY(60);

    const backText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Back").toUpperCase(), this.canvas, this);
    backText.setFontSize(10);
    backText.setColor("#FF8787");
    backText.setFontFamily("PT-Sans-Pro-Regular");
    backText.setX(867 + 50);
    backText.setY(10);

    const calendar = this.addIcon(867 + 100, -22, 10, 10, "calendar-img", "calendar-img", () => { });
    calendar.setYAlignment("center");

    const weekSpace = new GenericRoundedContainer(867 + 105, 25, 1, 45, this.canvas, this);
    weekSpace.setBackgroundColor("#FCF4EC");

    const forwardText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Forward").toUpperCase(), this.canvas, this);
    forwardText.setFontSize(10);
    forwardText.setColor("#FF8787");
    forwardText.setFontFamily("PT-Sans-Pro-Regular");
    forwardText.setX(867 + 120);
    forwardText.setY(10);

    const nextIcon = this.addIcon(867 + 165, -25, 16, 5, "next-week", "next-week", () => { });
    nextIcon.setYAlignment("center");

    const nextDay1 = this.createButton(
      867 + 115,
      -13,
      24,
      43,
      "1.\nDag",
      ()=>{
        CpspRef.cmp.changeMomentsDate(1);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    nextDay1.setYAlignment("bottom");
    nextDay1.setBorder("#FFFFFF", 1);

    const nextWeek1 = this.createButton(
      867 + 145,
      0,
      24,
      34,
      "1V.",
      ()=>{
        CpspRef.cmp.changeMomentsDate(7);
      },
      2,
      "#FFFFFF",
      "#FF8787")
    ;
    nextWeek1.setYAlignment("center");
    nextWeek1.setBorder("#FFFFFF", 1);

    const nextWeek4 = this.createButton(
      867 + 175,
      0,
      24,
      34,
      "4V.",
      ()=>{
        CpspRef.cmp.changeMomentsDate(28);
      },
      2,
      "#FFFFFF",
      "#FF8787"
    );
    nextWeek4.setYAlignment("center");
    nextWeek4.setBorder("#FFFFFF", 1);

    const weekText2 = new TextRenderer(CpspRef.cmp.getTranslate().instant("Week"), this.canvas, this);
    weekText2.setFontSize(10);
    weekText2.setColor("#FF8787");
    weekText2.setFontFamily("PT-Sans-Pro-Regular");
    weekText2.setX(867 + 155);
    weekText2.setY(60);

    const empty = new GenericRoundedContainer(867 + 85, 0, 36, 12, this.canvas, this);
    empty.setBackgroundColor("#373B40");
    const textEmpty = new TextRenderer(CpspRef.cmp.getTranslate().instant("Move").toUpperCase(), this.canvas, empty);
    textEmpty.setColor("#FFFFFF");
    textEmpty.setFontSize(10);
    textEmpty.setAlignment("center", "center");
    textEmpty.updateTextDimensions();

    var rev=CpspRef.cmp.property_index-1 != CpspRef.cmp.revImages.length && CpspRef.cmp.revImages[CpspRef.cmp.property_index-1] != undefined ?  
    CpspRef.cmp.revImages[CpspRef.cmp.property_index-1].date_generated : ConfigSc.currentDate.format(ConfigSc.dateRevFormat);


//buttons
    this.retButton = this.createButton(
      1096,
      -20,
      136,
      33,
      CpspRef.cmp.getTranslate().instant("Rev. "+CpspRef.cmp.property_index+" "+ rev).toUpperCase(),
      () => { 
        this.showRevisions();
      },
      6,
      "#FFFFFF",
      "#FF8787"
    );
    this.retButton.setYAlignment("bottom");
    this.retButton.setBorder("#FCF4EC", 1);
    this.retButton.getFirstChild().setX(17);


    const retButtonArrow = this.addIcon(
      this.retButton.getWidth() - 27,
      0, 
      15, 
      8, 
      "arrow-drop-down", 
      "arrow-drop-down", 
      () => {
        this.showRevisions();
      },
       this.retButton
      );
    retButtonArrow.setYAlignment("center");

    this.sendButton = this.createButton(
      1236,
      -20,
      136,
      33,
      CpspRef.cmp.getTranslate().instant("Send / write").toUpperCase(),
      () => { 
        this.sendRevision();
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
        this.sendRevision();        
      },
      this.sendButton
      );
      sendButtonArrow.setYAlignment("center");


    const saveTextContainer = new GenericContainer(
      0,
      33,
      150,
      this.getHeight(),
      this.canvas,
      this
    );
    saveTextContainer.setXAlignment("right");

    const sendDateText = new TextRenderer("", this.canvas, saveTextContainer);
    sendDateText.setColor("#E17928");
    sendDateText.setY(28);

    this.lockButton = this.createButton(
      1456,
      2,
      70,
      33,
      CpspRef.cmp.getTranslate().instant("Lock").toUpperCase(),
      () => {
        if(historySchedulePlaner.getNumberOfChanges() > 0 || CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 || CpspRef.cmp.copySelectedProject == null)
          return;

        CpspRef.cmp.showConfirmationModal(
          CpspRef.cmp.getTranslate().instant("Do you want to lock?"),
          async (response) => {
            if (response.result) {
              if (CpspRef.cmp.loading) {
                return;
              }
              CpspRef.cmp.setLoadingStatus(true);
              CpspRef.cmp.saveState();
              CpspRef.cmp.setLoadingStatus(false);
            }
          }
        );
      },
      6,
      historySchedulePlaner.getNumberOfChanges() == 0 && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.copySelectedProject != null ? "#FF8787" : "#FCF4EC",
      historySchedulePlaner.getNumberOfChanges() == 0 && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 && CpspRef.cmp.copySelectedProject != null ? "#FF8787" : "#FCF4EC"
    );
    this.lockButton.setYAlignment("center");
    this.lockButton.draw();

    this.saveButton = this.createButton(
      1382,
      2,
      70,
      33,
      CpspRef.cmp.getTranslate().instant("Save").toUpperCase(),
      () => {
        CpspRef.cmp.showConfirmationModal(
          CpspRef.cmp.getTranslate().instant("Do you want to save?"),
          async (response) => {
            if (response.result) {
              if (CpspRef.cmp.loading) {
                return;
              }
              CpspRef.cmp.setLoadingStatus(true);
              const status = await historySchedulePlaner.executeQueue();
              if (status) {
                sendDateText.setTextContent(
                  `Dat. ${ConfigSc.currentDate.format(
                    ConfigSc.dateFormat
                  )}  ${ConfigSc.currentDate.format(ConfigSc.timeFormat)}`
                );
                this.draw();
                CpspRef.cmp.idParentGroups=[];
              }
              CpspRef.cmp.setLoadingStatus(false);
              if(historySchedulePlaner.getNumberOfChanges() != 0){
                historySchedulePlaner.dumpHistory();
                CpspRef.cmp.toastrMessage(
                  "success",
                  CpspRef.cmp.getTranslate().instant("Successfully saved changes!")
                );
                sendDateText.setTextContent(
                  `Dat. ${ConfigSc.currentDate.format(
                    ConfigSc.dateFormat
                  )}  ${ConfigSc.currentDate.format(ConfigSc.timeFormat)}`
                );
                this.draw();
                CpspRef.cmp.idParentGroups=[];
              }
              CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
              sendDateText.draw();
            }
          }
        );
      },
      6,
      historySchedulePlaner.getNumberOfChanges() > 0 && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 ? "#FF8787" : "#FCF4EC",
      historySchedulePlaner.getNumberOfChanges() > 0 && CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 ? "#FF8787" : "#FCF4EC"
    );
    this.saveButton.setYAlignment("center");
    this.saveButton.draw();
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
    iconShape.setOnClickHandler(onClickFn);
    iconShape.setOnMouseHoverHandler(() => document.body.style.cursor = "pointer");

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

  sendRevision(){
    if(historySchedulePlaner.getNumberOfChanges() > 0 || CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 )
      return;

    //console.log("tg",CpspRef.cmp.project.responsiblePeople)
    const dropdownMenu = new DropdownMenu(
      this.sendButton.getGlobalX(),
      this.sendButton.getGlobalY()+this.sendButton.getHeight(),
      this.sendButton.getWidth(),
      200,
      this.canvas
    );

    var ind=1;
    CpspRef.cmp.project.responsiblePeople.forEach(person => {
      var p=CpspRef.cmp.project.responsiblePeople[ind-1];
      var image_url=CpspRef.cmp.property_index-1 != CpspRef.cmp.revImages.length && CpspRef.cmp.revImages[CpspRef.cmp.property_index-1] != undefined ?
                    CpspRef.cmp.revImages[CpspRef.cmp.property_index-1].url : null;
      dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant(person.Name).toUpperCase(), (e) => {

        /*CpspRef.cmp.property_index=prog.prog_number
        CpspRef.cmp.copySelectedProject.activities=p.activities;
        CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)*/

        //console.log("selected person ",p)
        //console.log("selected image ",image_url)
        CpspRef.cmp.generatePfd(image_url, p.user_email);

        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      });
    ind++;
    });
  dropdownMenu.open();
  }

  showRevisions(){
    const dropdownMenu = new DropdownMenu(
      this.retButton.getGlobalX(),
      this.retButton.getGlobalY()+this.retButton.getHeight(),
      this.retButton.getWidth(),
      200,
      this.canvas
    );

    var ind=1;
    CpspRef.cmp.revisions.forEach(prog => {
      var p=CpspRef.cmp.revisions[ind-1]
      dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant("Rev. "+prog.prog_number).toUpperCase(), (e) => {

        CpspRef.cmp.property_index=prog.prog_number
        CpspRef.cmp.copySelectedProject.activities=p.activities;
        CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)

        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    });
    ind++;
    });


    dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant("Rev. "+Number(CpspRef.cmp.revisions.length+1)).toUpperCase(), (e) => {


      CpspRef.cmp.property_index=Number(CpspRef.cmp.revisions.length+1)
      CpspRef.cmp.copySelectedProject.activities=CpspRef.cmp.activeRevisions.activities;
      CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)

      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    });


    dropdownMenu.open();
  }
}
