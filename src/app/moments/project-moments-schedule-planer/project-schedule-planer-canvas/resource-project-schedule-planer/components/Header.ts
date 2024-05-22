import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../Config";
import { CpspRef } from "../CpspRef";
import { ActivityHeader } from "./Headers/ActivityHeader";
import { ActivityHeaderSmall } from "./Headers/ActivityHeaderSmall";
import { BalancingHeader } from "./Headers/BalancingHeader";
import { HelpHeader } from "./Headers/HelpHeader";
import { ProjectHeader } from "./Headers/ProjectHeader";

export class Header extends AContainer {

  private headerMenu: ActivityHeader |ActivityHeaderSmall| BalancingHeader | ProjectHeader | HelpHeader;
  private activityButton: GenericRoundedContainer;
  private balancingButton: GenericRoundedContainer;
  private projectButton: GenericRoundedContainer;
  private helpButton: GenericRoundedContainer;
  private oldHeaderState = ConfigSc.timePlanHeader;
  private bottom_border: GenericRoundedContainer;


  private breakPoints = {
    xxl: 1450,
    xl: 1060,
    l: 710,
    m: 540,
    s: 430,
  };

  private bucketTape;
  public posColPicker = false;
  public colorPickerTopPosition = 0;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.bucketTape=document.getElementById("div-tape-color");


    const mainBorder = new GenericRoundedContainer(-30, -1, "100%", "100%", this.canvas, this);
    mainBorder.setBackgroundColor("#373B40");
    mainBorder.setBorder("#858585", 1.5);


    const overLine = new GenericRoundedContainer(0, 37, 313, 1.5, this.canvas, this);
    overLine.setBackgroundColor("#858585");

    overLine.setShadowBlur(6);
    overLine.setShadowOffsetY(-5);
    overLine.setShadowColor("#000000");
    overLine.setDropShadow(true);


    const backButton = this.addIcon(35, 20, 28, 25, "go-back", "go-back", async () => {
      CpspRef.cmp.returnHome();
    });
    backButton.setYAlignment("center");



    const header = new TextRenderer(CpspRef.cmp.getTranslate().instant("Time Plan").toUpperCase(), this.canvas, this);
    header.setFontSize(20);
    header.setColor("#FF8787");
    header.setFontFamily("PT-Sans-Pro-Regular");
    header.setX(75);
    header.setY(50);

    const barrier = new Rectangle(313, 0, 1.5, "100%", this.canvas, this);
    barrier.setBackgroundColor("#858585");

    this.helpButton = this.createButton(
      230,
      -10,
      70,
      17,
      CpspRef.cmp.getTranslate().instant("Help"),
      () => {
        ConfigSc.timePlanHeader = "Help";
        this.onHeaderChange();
      },
      6,
      "#858585",
      "#FFFFFF",
      "#858585"
    );
    this.helpButton.setYAlignment("center");
    this.helpButton.setBorderRoundness(6, true, true, false, false);

    const zoomX = Math.round((1 - CpspRef.cmp.pixelRation) * 10) * (-1/2);

    const zoomText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Zoom").toUpperCase(), this.canvas, this);
    zoomText.setFontSize(10);
    zoomText.setColor("#FFFFFF");
    zoomText.setFontFamily("PT-Sans-Pro-Regular");
    zoomText.setX(215);
    zoomText.setY(50);

    const zoomxText = new TextRenderer( zoomX + " x", this.canvas, this);
    zoomxText.setFontSize(10);
    zoomxText.setColor("#FFFFFF");
    zoomxText.setFontFamily("PT-Sans-Pro-Regular");
    zoomxText.setX(222);
    zoomxText.setY(60);

    // const zoomText = new TextRenderer(CpspRef.cmp.getTranslate().instant("Zoom").toUpperCase(), this.canvas, this);
    // zoomText.setFontSize(10);
    // zoomText.setColor("#FFFFFF");
    // zoomText.setFontFamily("PT-Sans-Pro-Regular");
    // zoomText.setX(262);
    // zoomText.setY(45);

    const zoomPl = this.createButton(
      250,
      10 + 10,
      25,
      22,
      "+",
      () => {
        CpspRef.cmp.setLoadingStatus(true);
        setTimeout(async () => {
        CpspRef.cmp.pixelRation += 0.2;
        await CpspRef.cmp.drawNewApp();
        CpspRef.cmp.setLoadingStatus(false);
        }, 200);
      },
      6,
      "#858585",
      "#FFFFFF",
      "#373B40",
      15
    );
    zoomPl.setYAlignment("center");
    zoomPl.setBorderRoundness(4, true, false, true, false);
    zoomPl.setBorder("white",1);

    const zoomMn = this.createButton(
      230 + 45 + 1,
      10 + 10,
      25,
      22,
      //"–",
      "–",
      () => {
        if(zoomX == -4) return;
        CpspRef.cmp.setLoadingStatus(true);
        setTimeout(async () => {
        CpspRef.cmp.pixelRation -= 0.2;
        await CpspRef.cmp.drawNewApp();
        CpspRef.cmp.setLoadingStatus(false);
        }, 200);
      },
      6,
      "#858585",
      "#FFFFFF",
      "#373B40",
      15
    );
    zoomMn.setYAlignment("center");
    zoomMn.setBorderRoundness(4, false, true, false, true);
    zoomMn.setBorder("white",1);


    if(ConfigSc.timePlanHeader != "Help"){
      this.helpButton.setShadowBlur(10);
      this.helpButton.setShadowOffsetX(4);
      this.helpButton.setShadowOffsetY(-2);
      this.helpButton.setShadowColor("#000000");
      this.helpButton.setInnerShadow(true);
    }

    this.projectButton = this.createButton(
      160,
      -10,
      70,
      17,
      CpspRef.cmp.getTranslate().instant("Project"),
      () => {
        ConfigSc.timePlanHeader = "Project";
        this.onHeaderChange();
        if(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer())
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer().refreshDisplay();
      },
      6,
      "#858585",
      "#FFFFFF",
      "#858585"
    );
    this.projectButton.setYAlignment("center");
    this.projectButton.setBorderRoundness(6, true, true, false, false);
    if(ConfigSc.timePlanHeader != "Project"){
      this.projectButton.setShadowBlur(10);
      this.projectButton.setShadowOffsetX(4);
      this.projectButton.setShadowOffsetY(-2);
      this.projectButton.setShadowColor("#000000");
      this.projectButton.setInnerShadow(true);
    }

    this.balancingButton = this.createButton(
      90,
      -10,
      70,
      17,
      CpspRef.cmp.getTranslate().instant("Balancing"),
      () => {
        ConfigSc.timePlanHeader = "Balancing";
        this.onHeaderChange();
        if(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer())
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer().refreshDisplay();
      },
      6,
      "#858585",
      "#FFFFFF",
      "#858585"
    );
    this.balancingButton.setYAlignment("center");
    this.balancingButton.setBorderRoundness(4, true, true, false, false);
    if(ConfigSc.timePlanHeader != "Balancing"){
      this.balancingButton.setShadowBlur(10);
      this.balancingButton.setShadowOffsetX(4);
      this.balancingButton.setShadowOffsetY(-2);
      this.balancingButton.setShadowColor("#000000");
      this.balancingButton.setInnerShadow(true);
    }


    this.activityButton = this.createButton(
      20,
      -10,
      70,
      17,
      CpspRef.cmp.getTranslate().instant("Activity"),
      async () => {
        ConfigSc.timePlanHeader = "Activity";
        this.onHeaderChange();
        if(CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer())
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.getTableHeadContainer().refreshDisplay();
      },
      6,
      "#858585",
      "#FFFFFF",
      "#858585"
    );
    this.activityButton.setYAlignment("center");
    this.activityButton.setBorderRoundness(6, true, true, false, false);
    //if(ConfigSc.timePlanHeader != "Activity" ){
      this.activityButton.setShadowBlur(10);
      this.activityButton.setShadowOffsetX(4);
      this.activityButton.setShadowOffsetY(-2);
      this.activityButton.setShadowColor("#000000");
      this.activityButton.setInnerShadow(false);
    //}

    this.bottom_border=new GenericRoundedContainer(this.activityButton.getX()+1,this.activityButton.getY()+this.projectButton.getHeight(),this.activityButton.getWidth()+5,5,this.canvas,this);

    this.onHeaderChange();

  }

  onHeaderChange() {

    if (this.headerMenu) {
      this.closeDropDowns();
    };
    if (this.oldHeaderState != ConfigSc.timePlanHeader) this.resetButtonView();
    var button;
    document.getElementById("checkBox").style.display = "none";
    if (ConfigSc.timePlanHeader == "Activity") {
      button = this.activityButton;
      if (window.innerWidth >= 1920) {
        this.headerMenu = new ActivityHeader(314, 0, this.getWidth() - 313, this.getHeight(), this.canvas, this);
      } else {
        this.headerMenu = new ActivityHeaderSmall(314, 0, this.getWidth() - 313, this.getHeight(), this.canvas, this);
      }
      this.bucketTape.style.left=0+'px';
      this.bucketTape.style.visibility='visible';
      CpspRef.cmp.allColumns.find((obj)=>obj.key=="resource").isVisible=true;
      CpspRef.cmp.allColumns.find((obj)=>obj.key=="finished").isVisible=false;
      this.posColPicker = false;
    }
    else if (ConfigSc.timePlanHeader == "Balancing") {
      button = this.balancingButton;
      this.headerMenu = new BalancingHeader(314, 0, this.getWidth() - 313, this.getHeight(), this.canvas, this);
      this.bucketTape.style.left=-320+'px';
      this.bucketTape.style.visibility='visible';
      CpspRef.cmp.allColumns.find((obj)=>obj.key=="resource").isVisible=false;
      CpspRef.cmp.allColumns.find((obj)=>obj.key=="finished").isVisible=true;
      this.posColPicker = true;
    }
    else if (ConfigSc.timePlanHeader == "Project") {
      button = this.projectButton;
      this.headerMenu = new ProjectHeader(314, 0, this.getWidth() - 313, this.getHeight(), this.canvas, this);
      this.bucketTape.style.left=-320+'px';
      this.bucketTape.style.visibility='visible';
      CpspRef.cmp.allColumns.find((obj)=>obj.key=="resource").isVisible=false;
      CpspRef.cmp.allColumns.find((obj)=>obj.key=="finished").isVisible=true;
      this.posColPicker = true;
      document.getElementById("checkBox").style.display = "block";
    }
    else if (ConfigSc.timePlanHeader == "Help") {
      button = this.helpButton;
      this.headerMenu = new HelpHeader(314, 0, this.getWidth() - 313, this.getHeight(), this.canvas, this);
      this.bucketTape.style.visibility='hidden';
      this.posColPicker = false;
    }

    button.setBackgroundColor("#373B40");
    button.getFirstChild().setColor("#E67314");
    button.getFirstChild().setFontSize(14);
    button.setHeight(20);
    button.setWidth(77);
    //button.removeBottomBorder();
    //this.bottom_border=new GenericRoundedContainer(button.getX()+1,button.getY()+button.getHeight()-1.5,button.getWidth()-2,5,this.canvas,this);
    this.bottom_border.setBackgroundColor("#373B40");
    this.bottom_border.setX(button.getX()+1);
    this.bottom_border.setY(button.getY()+button.getHeight()-1.5);
    this.draw();

    this.headerMenu.draw();

    this.headerMenu.setOnMouseDownHandler(()=>CpspRef.cmp.projectSchedulePlanerApp.mainHeader.closeDropDowns())



  }

  resetButtonView() {
    var button;
    if (this.oldHeaderState == "Activity") {
      button = this.activityButton;
    }
    else if (this.oldHeaderState == "Balancing") {
      button = this.balancingButton;
    }
    else if (this.oldHeaderState == "Project") {
      button = this.projectButton;
    }
    else if (this.oldHeaderState == "Help") {
      button = this.helpButton;
    }

    //shadow
    if (ConfigSc.timePlanHeader == "Activity") {
      this.activityButton.setInnerShadow(false);
      this.balancingButton.setInnerShadow(true);
      this.projectButton.setInnerShadow(true);
      this.helpButton.setInnerShadow(true);
    }
    else if (ConfigSc.timePlanHeader == "Balancing") {
      this.balancingButton.setInnerShadow(false);
      this.activityButton.setInnerShadow(true);
      this.projectButton.setInnerShadow(true);
      this.helpButton.setInnerShadow(true);
    }
    else if (ConfigSc.timePlanHeader == "Project") {
      this.projectButton.setInnerShadow(false);
      this.activityButton.setInnerShadow(true);
      this.balancingButton.setInnerShadow(true);
      this.helpButton.setInnerShadow(true);
    }
    else if (ConfigSc.timePlanHeader == "Help") {
      this.helpButton.setInnerShadow(false);
      this.activityButton.setInnerShadow(true);
      this.projectButton.setInnerShadow(true);
      this.activityButton.setInnerShadow(true);
    }

    button.setBackgroundColor("#858585");
    button.getFirstChild().setColor("#FFFFFF");
    button.getFirstChild().setFontSize(12);
    button.setHeight(17);
    button.setWidth(70);
    this.bottom_border.setY(-3);
    this.bottom_border.setBackgroundColor("#373B40");
    this.oldHeaderState = ConfigSc.timePlanHeader;
  }

  getHeaderMenu(){
    return this.headerMenu;
  }

  addIcon(
    x: number,
    y: number,
    width: number,
    height: number,
    iconName: string,
    iconPath: string,
    onClickFn: Function
  ) {
    const iconShape = new Rectangle(x, y, width, height, this.canvas, this);
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
    backgroundColor: string = "#373B40",
    textSize: number = 12
  ) {
    const button = new GenericRoundedContainer(x, y, width, height, this.canvas, this);
    button.setBackgroundColor(backgroundColor);
    button.setBorder(borderColor, 1.5);
    //if(ConfigSc.isInEditMode) {
        button.setOnClickHandler(onClickFn);
        button.setOnMouseHoverHandler(() => {
            document.body.style.cursor = "pointer";
        });
    //}
    button.setBorderRoundness(radius);
    const buttonText = new TextRenderer(textContent, this.canvas, button);
    buttonText.setColor(textColor);
    buttonText.setFontSize(textSize);
    buttonText.setAlignment("center", "center");
    buttonText.updateTextDimensions();

    return button;
  }

  closeDropDowns() {
    if (CpspRef.cmp.projectSchedulePlanerApp.mainHeader.headerMenu instanceof ActivityHeaderSmall ||
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.headerMenu instanceof ActivityHeader) {
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.headerMenu.closeAllDropdowns();
  }
  }


  getSizeByBreakPoint(sizes: { xxl: number; xl: number }): number {
    const keys = Object.keys(this.breakPoints);

    for (let i = 0; i < keys.length; i++) {
      if (!sizes[keys[i]]) {
        break;
      }
      if (window.innerWidth >= this.breakPoints[keys[i]]) {
        return sizes[keys[i]];
      }
    }

    return sizes.xl;
  }

}
