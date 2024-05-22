import * as moment from "moment";
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

export class BalancingHeader extends AContainer{

  public saveButton: GenericRoundedContainer;
  public retButton: GenericRoundedContainer;
  public sendButton: GenericRoundedContainer;
  public lockButton: GenericRoundedContainer;

  private toggleRev = false;
  private toggleSend = false;
  private moveButton =0;

  private completed_x = 400;
  private move_x = 400;

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
    // CpspRef.cmp.hideHoursProject();

    // const editingRows = new GenericRoundedContainer(
    //   100,
    //   23,
    //   325,
    //   30,
    //   this.canvas,
    //   this
    // );
    // editingRows.setBackgroundColor("#373B40");
    // editingRows.setBorder("#FCF4EC", 1);
    // editingRows.setBorderRoundness(6);

    // const space = new GenericRoundedContainer(
    //   335,
    //   26,
    //   1,
    //   20,
    //   this.canvas,
    //   this
    // );
    // space.setBackgroundColor("#FCF4EC");

    // const bucketWhite = this.addIcon(
    //   335 + 12,
    //   -5,
    //   14,
    //   13,
    //   "bucket-white",
    //   "bucket-white",
    //   () => { }
    // );
    // bucketWhite.setYAlignment("center");

    // const arrowOpen = this.addIcon(
    //   335 + 24,
    //   -5,
    //   15,
    //   9,
    //   "arrow-white",
    //   "arrow-white",
    //   () => { }
    // );
    // arrowOpen.setYAlignment("center");

    // const arrowOpen2 = this.addIcon(
    //   335 + 64,
    //   -5,
    //   15,
    //   9,
    //   "arrow-white",
    //   "arrow-white",
    //   () => { }
    // );
    // arrowOpen2.setYAlignment("center");

//editing columns
    // const editingColumns = new GenericRoundedContainer(
    //   440,
    //   23,
    //   72,
    //   30,
    //   this.canvas,
    //   this
    // );
    // editingColumns.setBackgroundColor("#373B40");
    // editingColumns.setBorder("#FCF4EC", 1);
    // editingColumns.setBorderRoundness(6);

    // const flag = this.addIcon(
    //   440 + 10,
    //   0,
    //   12,
    //   14,
    //   "flag",
    //   "flag",
    //   () => {
    //     CpspRef.cmp.addNewNote();
    //   }
    // );
    // flag.setYAlignment("center");

    // const columnSpace8 = new GenericRoundedContainer(
    //   440 + 30,
    //   27,
    //   1,
    //   20,
    //   this.canvas,
    //   this
    // );
    // columnSpace8.setBackgroundColor("#FCF4EC");

    // const bucketWhiteColumn = this.addIcon(
    //   440 + 30 + 10,
    //   -5,
    //   14,
    //   13,
    //   "bucket-white",
    //   "bucket-white",
    //   () => { }
    //   );
    // bucketWhiteColumn.setYAlignment("center");
    // const arrowOpen4 = this.addIcon(
    //   440 + 30 + 24,
    //   -5,
    //   15,
    //   9,
    //   "arrow-white",
    //   "arrow-white",
    //   () => { }
    //   );
    // arrowOpen4.setYAlignment("center");
    // const noteText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Listing"), this.canvas, this);
    // noteText.setFontSize(10);
    // noteText.setColor("#FFFFFF");
    // noteText.setFontFamily("PT-Sans-Pro-Regular");
    // noteText.setX(440 + 20);
    // noteText.setY(60);


//percentage of events

    const editingPercents = new GenericRoundedContainer(
      526 - this.completed_x,
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
      526 + 11 - this.completed_x,
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
      526 + 40 - this.completed_x,
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
      526 + 69 - this.completed_x,
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
      526 + 98 - this.completed_x,
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
      526 + 127 - this.completed_x,
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
      526 + 156 - this.completed_x,
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
      526 + 184 - this.completed_x,
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
      526 + 11 - this.completed_x,
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
      526 + 11 + 1 - this.completed_x,
      42 + 2,
      32,
      8,
      this.canvas,
      this
    );
    markAccordingToPlanRect.setBackgroundColor("#FF8787");
    if(ConfigSc.isInEditMode){
      markAccordingToPlanRect.setOnMouseHoverHandler(() => {
        document.body.style.cursor = "pointer";
      });
      markAccordingToPlanRect.setOnClickHandler(
        () => {
        CpspRef.cmp.markAccordingToPlan();
        }
      );
    }

    const redLine = new GenericContainer(526 + 11 + 31 - this.completed_x, 42, 3, 24, this.canvas, this);
    redLine.setBackgroundColor("#FF0000");

    const nextIconMarkAccordingToPlan = this.addIcon(
      526 + 11 + 8 - this.completed_x,
      42 + 14,
      16,
      5,
      "next-week",
      "next-week",
      () => {
        CpspRef.cmp.markAccordingToPlan();
      }
      );
    nextIconMarkAccordingToPlan.getHeight();

    const emptyMarkAccordingToPlan = new GenericRoundedContainer(526 + 11 + 53 + 7 - this.completed_x, 51, 69, 12, this.canvas, this);
    emptyMarkAccordingToPlan.setBackgroundColor("#373B40");
    const textMarkAccordingToPlan = new TextRenderer(CpspRef.cmp.getTranslate().instant("Mark according to plan"), this.canvas, emptyMarkAccordingToPlan);
    textMarkAccordingToPlan.setColor("#FFFFFF");
    textMarkAccordingToPlan.setFontSize(10);
    textMarkAccordingToPlan.setAlignment("left", "center");
    textMarkAccordingToPlan.updateTextDimensions();

    const moveToCompleted = this.addIcon(
      526 + 265 - this.completed_x,
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
      526 + 265 + 1 - this.completed_x,
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
    const emptyMoveToCompleted = new GenericRoundedContainer(526 + 222 - this.completed_x, 13 , 40, 20, this.canvas, this);
    emptyMoveToCompleted.setBackgroundColor("#373B40");
    const textMoveToCompleted = new TextRenderer(CpspRef.cmp.getTranslate().instant("Move to not completed"), this.canvas, emptyMoveToCompleted);
    textMoveToCompleted.setColor("#FFFFFF");
    textMoveToCompleted.setFontSize(10);
    textMoveToCompleted.setAlignment("left", "center");
    textMoveToCompleted.updateTextDimensions();



    const moveToNotCompleted = this.addIcon(
      526 + 252 - this.completed_x,
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

    const previousIconMoveToNotCompleted = this.addIcon(
      526 + 276 - this.completed_x,
      56 ,
      24,
      5,
      "previous-week",
      "previous-week",
      () => {
        CpspRef.cmp.moveToCompleted();
      });
    previousIconMoveToNotCompleted.getHeight();

    const emptyMoveToNotCompleted = new GenericRoundedContainer(526 + 212 - this.completed_x, 44, 32, 20, this.canvas, this);
    emptyMoveToNotCompleted.setBackgroundColor("#373B40");
    const textMoveToNotCompleted = new TextRenderer(CpspRef.cmp.getTranslate().instant("Move to completed"), this.canvas, emptyMoveToNotCompleted);
    textMoveToNotCompleted.setColor("#FFFFFF");
    textMoveToNotCompleted.setFontSize(10);
    textMoveToNotCompleted.setAlignment("left", "center");
    textMoveToNotCompleted.updateTextDimensions();

    const redLine2 = new GenericContainer(526+285 - this.completed_x, 11, 3, 54, this.canvas, this);
    redLine2.setBackgroundColor("#FF0000");

    const emptyCompleted = new GenericRoundedContainer(526 + 85 - this.completed_x, 0, 62, 12, this.canvas, this);
    emptyCompleted.setBackgroundColor("#373B40");
    const textEmptyCompleted = new TextRenderer(CpspRef.cmp.getTranslate().instant("Completed").toUpperCase(), this.canvas, emptyCompleted);
    textEmptyCompleted.setColor("#FFFFFF");
    textEmptyCompleted.setFontSize(10);
    textEmptyCompleted.setAlignment("center", "center");
    textEmptyCompleted.updateTextDimensions();

//editing weeks
    const editingWeeks = new GenericRoundedContainer(867 - this.move_x, 6, 207, 66, this.canvas, this);
    editingWeeks.setBackgroundColor("#373B40");
    editingWeeks.setBorder("#FCF4EC", 1);
    editingWeeks.setBorderRoundness(6);

    const previousIcon = this.addIcon(867 + 30 - this.move_x, -25, 16, 5, "previous-week", "previous-week", () => { });
    previousIcon.setYAlignment("center");

    const previousWeek4 = this.createButton(
      867 + 10 - this.move_x,
      0,
      24,
      34,
      "4" + CpspRef.cmp.getTranslate().instant("W."),
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
      867 + 40 - this.move_x,
      0,
      24,
      34,
      "1" + CpspRef.cmp.getTranslate().instant("W."),
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
      867 + 70 - this.move_x,
      -13,
      24,
      43,
      //"1." + CpspRef.cmp.getTranslate().instant("Day"),
      "",
      ()=>{
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

    const previousDay2Text = new TextRenderer(CpspRef.cmp.getTranslate().instant("Day"), this.canvas, previousDay1);
    previousDay2Text.setFontSize(12);
    previousDay2Text.setColor("#FF8787");
    previousDay2Text.setFontFamily("PT-Sans-Pro-Regular");
    previousDay2Text.setX(2);
    previousDay2Text.setY(25);

    const weekText1 = new TextRenderer(CpspRef.cmp.getTranslate().instant("Week"), this.canvas, this);
    weekText1.setFontSize(10);
    weekText1.setColor("#FF8787");
    weekText1.setFontFamily("PT-Sans-Pro-Regular");
    weekText1.setX(867 + 20 - this.move_x);
    weekText1.setY(60);

    const backText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Behind").toUpperCase(), this.canvas, this);
    backText.setFontSize(10);
    backText.setColor("#FF8787");
    backText.setFontFamily("PT-Sans-Pro-Regular");
    backText.setX(867 + 50 - this.move_x);
    backText.setY(10);

    const calendar = this.addIcon(867 + 100 - this.move_x, -22, 10, 10, "calendar-img", "calendar-img", () => { });
    calendar.setYAlignment("center");

    const weekSpace = new GenericRoundedContainer(867 + 105 - this.move_x, 25, 1, 45, this.canvas, this);
    weekSpace.setBackgroundColor("#FCF4EC");

    const forwardText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Forward").toUpperCase(), this.canvas, this);
    forwardText.setFontSize(10);
    forwardText.setColor("#FF8787");
    forwardText.setFontFamily("PT-Sans-Pro-Regular");
    forwardText.setX(867 + 120 - this.move_x);
    forwardText.setY(10);

    const nextIcon = this.addIcon(867 + 165 - this.move_x, -25, 16, 5, "next-week", "next-week", () => { });
    nextIcon.setYAlignment("center");

    const nextDay1 = this.createButton(
      867 + 115 - this.move_x,
      -13,
      24,
      43,
      //"1." + CpspRef.cmp.getTranslate().instant("Day"),
      "",
      ()=>{
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

    const nextDay2Text = new TextRenderer(CpspRef.cmp.getTranslate().instant("Day"), this.canvas, nextDay1);
    nextDay2Text.setFontSize(12);
    nextDay2Text.setColor("#FF8787");
    nextDay2Text.setFontFamily("PT-Sans-Pro-Regular");
    nextDay2Text.setX(2);
    nextDay2Text.setY(25);

    const nextWeek1 = this.createButton(
      867 + 145 - this.move_x,
      0,
      24,
      34,
      "1" + CpspRef.cmp.getTranslate().instant("W."),
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
      867 + 175 - this.move_x,
      0,
      24,
      34,
      "4" + CpspRef.cmp.getTranslate().instant("W."),
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
    weekText2.setX(867 + 155 - this.move_x);
    weekText2.setY(60);

    const empty = new GenericRoundedContainer(867 + 85 - this.move_x, 0, 36, 12, this.canvas, this);
    empty.setBackgroundColor("#373B40");
    const textEmpty = new TextRenderer(CpspRef.cmp.getTranslate().instant("Move").toUpperCase(), this.canvas, empty);
    textEmpty.setColor("#FFFFFF");
    textEmpty.setFontSize(10);
    textEmpty.setAlignment("center", "center");
    textEmpty.updateTextDimensions();

    let rev=CpspRef.cmp.property_index-1 != CpspRef.cmp.revImages.length && CpspRef.cmp.revImages[CpspRef.cmp.property_index-1] != undefined ?
    CpspRef.cmp.revImages[CpspRef.cmp.property_index-1].date_generated : ConfigSc.currentDate.format(ConfigSc.dateRevFormat);

    const draftConfition =
      CpspRef.cmp.property_index - 1 != CpspRef.cmp.revImages.length &&
        CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1] != undefined;

//buttons
    this.retButton = this.createButton(
      1096+this.moveButton,
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
      if(!this.toggleRev)
      this.showRevisions();
      this.toggleRev = !this.toggleRev;
    })


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
      if(!this.toggleRev)
      this.showRevisions();
      this.toggleRev = !this.toggleRev;
    })

    this.sendButton = this.createButton(
      1236+this.moveButton,
      -20,
      136,
      33,
      CpspRef.cmp.getTranslate().instant("Send / Write").toUpperCase(),
      () => {
        if(!this.toggleSend)
        this.sendRevision();
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
        if(!this.toggleSend)
        this.sendRevision();
        this.toggleSend = !this.toggleSend;
        },
       this.sendButton
      );
      sendButtonArrow.setYAlignment("center");

      let b = document.getElementById(
        "dropdown-div"
      );

      b.style.display = "block";
      //for display width < 1920px
    if(this.moveButton != 0){

      b.style.marginLeft = "1183px";
    }


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
      1456+this.moveButton,
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
      1382+this.moveButton,
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

  hideUnnecessary(){
    CpspRef.cmp.selectedMomentsForStyleChange = [];
    CpspRef.cmp.tapeMomActId = null;
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = null;
    CpspRef.cmp.hideColumnInput();
    CpspRef.cmp.hideColumnValueInput();
    CpspRef.cmp.hideNoteInput();
    CpspRef.cmp.hidePlanInput();
    CpspRef.cmp.hideResourceWeekInput();
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
      dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant("Rev. "+prog.prog_number).toUpperCase(), async (e) => {
        CpspRef.cmp.selectedMomentsForStyleChange = [];
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = null;
        if (CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1) {
          CpspRef.cmp.activeConnections = CpspRef.cmp.deepCopy(CpspRef.cmp.lineConnections)
          CpspRef.cmp.activeRevisions = CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)
        }
        CpspRef.cmp.property_index=prog.prog_number
        CpspRef.cmp.copySelectedProject.activities=p.activities;
        CpspRef.cmp.allColumns = p.columns;
        CpspRef.cmp.lineConnections = p.connections;
        CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)
        CpspRef.cmp.checked = p.showNames;

        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();

        this.shadow.style.pointerEvents = "none";
        this.shadow.style.marginTop = ConfigSc.toolboxSize + "px";
        this.shadow.style.marginLeft = ConfigSc.sidebarSize + "px";
        this.shadow.style.backgroundColor = "#434343";
        this.shadow.style.opacity = "0.1";
        this.shadow.style.width = ConfigSc.sideCanvasSize + "px";
        this.shadow.style.height = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getHeight() + "px";

        document.getElementById("checkBox").style.pointerEvents = "none";


        // CpspRef.cmp.closeDialog()
        // CpspRef.cmp.showRevision(() => {
        //   let shadow = document.getElementsByClassName("cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing")[0] as HTMLElement;
        //   shadow.style.pointerEvents = "none";
        //   shadow.style.marginTop = ConfigSc.toolboxSize+"px";
        //   shadow.style.marginLeft = ConfigSc.sidebarSize+"px";
        //   shadow.style.backgroundColor = "#434343";
        //   shadow.style.opacity = "0.1";
        //   shadow.style.width = ConfigSc.sideCanvasSize +"px"
        // });
        this.hideUnnecessary();
        await CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer().refreshDisplay();
        // this.getCanvas().getContext().save()
        // this.getCanvas().getContext().globalAlpha = 0.1;
        // this.getCanvas().getContext().fillStyle = "#434343";
        // this.getCanvas().getContext().fillRect(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getX(), CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getGlobalY(), CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getWidth(), CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getHeight());
        // this.getCanvas().getContext().restore()
    });
    ind++;
    });


    dropdownMenu.addOption(CpspRef.cmp.getTranslate().instant("Draft").toUpperCase(), (e) => {
      CpspRef.cmp.selectedMomentsForStyleChange = [];
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow = null;

      this.shadow.style.height = 0 + "px";
      document.getElementById("checkBox").style.pointerEvents = "auto";

      CpspRef.cmp.property_index=Number(CpspRef.cmp.revisions.length+1)
      CpspRef.cmp.copySelectedProject.activities= CpspRef.cmp.deepCopy(CpspRef.cmp.activeRevisions.activities);
      CpspRef.cmp.selectedProject=CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject)
      CpspRef.cmp.lineConnections = CpspRef.cmp.deepCopy(CpspRef.cmp.activeConnections);
      CpspRef.cmp.allColumns = CpspRef.cmp.activeColumns;

      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
      CpspRef.cmp.closeDialog()
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer().refreshDisplay();
    });


    dropdownMenu.open();
  }

  sendRevision(){
    if(historySchedulePlaner.getNumberOfChanges() > 0 || CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1 )
      return;

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

        CpspRef.cmp.generatePfd(image_url, p.user_email);

        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      });
    ind++;
    });
  dropdownMenu.open();
  }
}
