import { AScrollableContainerSchedule } from "src/app/canvas-ui/AScrollableContainerSchedule";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { IMovable } from "src/app/canvas-ui/interfaces/IMovable";
import { ConfigSc } from "../../Config";
import { CpspRef } from "../../CpspRef";

export class SelectedMomentsContainer
  extends AScrollableContainerSchedule
  implements IMovable
{
  selectedMoments = [];
  allSelectedMoments = [];

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);
    this.createContainer(x, y, this.getWidth(), this.getHeight());
    CpspRef.cmp.selectedContainerHeight = 0;
  }

  move(y: number) {
    this.setY(this.getY() + y);
  }

  getSelectedMoments() {
    return this.selectedMoments;
  }

  getAllSelectedMoments() {
    return this.allSelectedMoments;
  }

  createContainer(x: number, y: number, width: number, height: number) {
    // var k = Math.ceil(height / ConfigSc.cellHeight);
    let numMoments = Math.round(height/ConfigSc.cellHeight);
    let actIndex = CpspRef.cmp.selectedProject.activities.findIndex(activity => activity.y > y);
    let a = CpspRef.cmp.selectedProject.activities.at(actIndex - 1);
    let momIndex = a.moments.findIndex(mom =>
      mom.y == y - a.y - ConfigSc.cellHeight)
    actIndex--;
    let pomActIndex = actIndex;
    let pomMomIndex = momIndex;
    let startId,endId;
    let isEndId = true;
    for(actIndex ; actIndex < CpspRef.cmp.selectedProject.activities.length; actIndex++){
      if(numMoments == 0){
        if(isEndId)
          endId = CpspRef.cmp.selectedProject.activities.at(actIndex).id;
        break;
      }
      let activity = CpspRef.cmp.selectedProject.activities.at(actIndex);
      if(momIndex == -1){
        this.selectedMoments.push(activity);
        startId = activity.id;
        numMoments--;
        momIndex++;
      }
      for(momIndex; momIndex < activity.moments.length; momIndex++){
        if(numMoments == 0){
          endId = activity.moments.at(momIndex).id;
          isEndId = false;
          break;
        }
        // if(activity.moments.at(i).y + activity.y + ConfigSc.cellHeight >= startY){
        if(this.selectedMoments.length == 0) startId =  activity.moments.at(momIndex).id;
          this.selectedMoments.push(activity.moments.at(momIndex));
          numMoments--;
        // }
      }
      momIndex = -1;
    }

    //if group is hiden
    for(pomActIndex ; pomActIndex < CpspRef.cmp.copySelectedProject.activities.length; pomActIndex++){
      if(startId == endId){
        break;
      }
      let activity = CpspRef.cmp.copySelectedProject.activities.at(pomActIndex);
      if(pomMomIndex == -1){
        startId = activity.id;
        if(startId == endId){
          break;
        }
        this.allSelectedMoments.push(activity);
        pomMomIndex++;
      }
      for(pomMomIndex; pomMomIndex < activity.moments.length; pomMomIndex++){
        startId = activity.moments.at(pomMomIndex).id;
        if(startId == endId){
          break;
        }
        this.allSelectedMoments.push(activity.moments.at(pomMomIndex));
      }
      pomMomIndex = -1;
    }


    // return;


    // CpspRef.cmp.selectedProject.activities.forEach((activity,activityIndex) => {
    //   const projectGlobalY =
    //     ConfigSc.toolboxSize +
    //     ConfigSc.topSectionSize +
    //     activity.y +
    //     CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer
    //       .getMomentTableBodyContainer()
    //       .getInnerContainer()
    //       .getY();

    //   if (
    //     y + height < projectGlobalY ||
    //     y >
    //       projectGlobalY +
    //         activity.moments.length * ConfigSc.cellHeight +
    //         ConfigSc.cellHeight
    //   )
    //     return;

    //   //if (y <= projectGlobalY + k * ConfigSc.cellHeight) {
    //   if (
    //     y < projectGlobalY + ConfigSc.cellHeight &&
    //     y + height >= projectGlobalY
    //   ) {
    //     this.selectedMoments.push({
    //       projectId: CpspRef.cmp.selectedProject.id,
    //       activityId: activity.id,
    //       stateType: activity.number != "" ? "ACTIVITY" : null,
    //       planId: null,
    //       userY: i * ConfigSc.cellHeight,
    //       y: projectGlobalY,
    //       moment: activity,
    //       state_number: 0,
    //     });
    //     CpspRef.cmp.selectedContainerHeight++;
    //     // k--;
    //   }

    //   let sh_act = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.show_activity.find(a => a.id == activity.id)

    //   if(sh_act && sh_act.show == "arrow-close"){
    //     let cp_act = CpspRef.cmp.copySelectedProject.activities.at(activityIndex);
    //     cp_act.moments.forEach((moment,i) =>{
    //       this.selectedMoments.push({
    //         projectId: CpspRef.cmp.selectedProject.id,
    //         activityId: activity.id,
    //         stateType: moment.state,
    //         planId: moment.id,
    //         userY: i * ConfigSc.cellHeight,
    //         y: projectGlobalY + i * ConfigSc.cellHeight + ConfigSc.cellHeight,
    //         moment: moment,
    //         state_number: moment.state_number,
    //         parent: moment.parent,
    //       });
    //     })
    //   }

    //   var i = 0;
    //   activity.moments.forEach((moment) => {
    //     if (
    //       y <
    //         projectGlobalY +
    //           i * ConfigSc.cellHeight +
    //           ConfigSc.cellHeight * 2 &&
    //       y + height >
    //         projectGlobalY + i * ConfigSc.cellHeight + ConfigSc.cellHeight
    //     ) {
    //       this.selectedMoments.push({
    //         projectId: CpspRef.cmp.selectedProject.id,
    //         activityId: activity.id,
    //         stateType: moment.state,
    //         planId: moment.id,
    //         userY: i * ConfigSc.cellHeight,
    //         y: projectGlobalY + i * ConfigSc.cellHeight + ConfigSc.cellHeight,
    //         moment: moment,
    //         state_number: moment.state_number,
    //         parent: moment.parent,
    //       });
    //       CpspRef.cmp.selectedContainerHeight++;
    //     }
    //     i++;

    //     let sh_state = CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.show_states.find(mom => mom.id == moment.id && mom.state_number == moment.state_number)

    //   if(sh_state && sh_state.show == "arrow-close"){
    //     let cp_act = CpspRef.cmp.copySelectedProject.activities.at(activityIndex);
    //     const momInd = cp_act.moments.findIndex(mom => mom.id == moment.id);
    //     for(let i = momInd + 1; i < cp_act.moments.length; i++){
    //       if(cp_act.moments.at(i).state_number <= moment.state_number)
    //         break;
    //       this.selectedMoments.push({
    //         projectId: CpspRef.cmp.selectedProject.id,
    //         activityId: activity.id,
    //         stateType: cp_act.moments.at(i).state,
    //         planId: cp_act.moments.at(i).id,
    //         userY: i * ConfigSc.cellHeight,
    //         y: projectGlobalY + i * ConfigSc.cellHeight + ConfigSc.cellHeight,
    //         moment: cp_act.moments.at(i),
    //         state_number: cp_act.moments.at(i).state_number,
    //         parent: cp_act.moments.at(i).parent,
    //       });
    //     }
    //   }

    //   });
    // });
    if (this.selectedMoments.length < 1) return;

    const startY = this.selectedMoments[0].y;
    const endY =
      this.selectedMoments[this.selectedMoments.length - 1].y +
      ConfigSc.cellHeight;
    //this.setX(-ConfigSc.cellHeight);
    this.setX(0);


    // in case of creating new box on existing one
    // let newY =
    //   ConfigSc.firstMomentBoxSelectedPositionDelta +
    //   ConfigSc.deltaMovementBetweenBoxes;
    // newY =
    //   Math.ceil(Math.abs(newY) / ConfigSc.cellHeight) * ConfigSc.cellHeight;
    let newY = 0;

    // if(this.selectedMoments[0].moment.activity_id){
    //   let activityStartY = CpspRef.cmp.selectedProject.activities.find(act => act.id == this.selectedMoments[0].moment.activity_id).y;
    //   newY = activityStartY + this.selectedMoments.at(0).moment.y + ConfigSc.cellHeight;
    // } else {
    //   newY = this.selectedMoments[0].moment.y;
    // }

    if(this.selectedMoments[0].activity_id){
      let activityStartY = CpspRef.cmp.selectedProject.activities.find(act => act.id == this.selectedMoments[0].activity_id).y;
      newY = activityStartY + this.selectedMoments.at(0).y + ConfigSc.cellHeight;
    } else {
      newY = this.selectedMoments[0].y;
    }
    this.setY(newY);

    // this.setHeight(endY - startY);
    this.setHeight(CpspRef.cmp.selectedContainerHeight * ConfigSc.cellHeight);
    this.setHeight(this.selectedMoments.length * ConfigSc.cellHeight);
    ConfigSc.boxHeight = endY - startY;

    CpspRef.cmp.selectedMomentsForStyleChange = this.selectedMoments;
    // this.setBorder("black", 3);
    // this.draw();

    // let font = this.selectedMoments[0].moment.styles.fontFamily;
    // let size = this.selectedMoments[0].moment.styles.fontSize;
    // let color = this.selectedMoments[0].moment.styles.color;
    // let backgroundColor = this.selectedMoments[0].moment.styles.backgroundColor;
    // let decoration = this.selectedMoments[0].moment.styles.fontDecoration;
    // let weight = this.selectedMoments[0].moment.styles.fontWeight;
    // let style = this.selectedMoments[0].moment.styles.fontStyle;

    let font = this.selectedMoments[0].styles.fontFamily;
    let size = this.selectedMoments[0].styles.fontSize;
    let color = this.selectedMoments[0].styles.color;
    let backgroundColor = this.selectedMoments[0].styles.backgroundColor;
    let decoration = this.selectedMoments[0].styles.fontDecoration;
    let weight = this.selectedMoments[0].styles.fontWeight;
    let style = this.selectedMoments[0].styles.fontStyle;

    // this.selectedMoments.forEach((element) => {
    //   if (font != element.moment.styles.fontFamily) font = "";
    //   if (size != element.moment.styles.fontSize) size = "";
    //   if (color != element.moment.styles.color) color = "black";
    //   if (backgroundColor != element.moment.styles.backgroundColor)
    //     backgroundColor = "black";
    //   if (decoration != element.moment.styles.fontDecoration)
    //     decoration = "normal";
    //   if (weight != element.moment.styles.fontWeight) weight = "normal";
    //   if (style != element.moment.styles.fontStyle) style = "normal";
    // });

    this.selectedMoments.forEach((element) => {
      if (font != element.styles.fontFamily) font = "";
      if (size != element.styles.fontSize) size = "";
      if (color != element.styles.color) color = "black";
      if (backgroundColor != element.styles.backgroundColor)
        backgroundColor = "black";
      if (decoration != element.styles.fontDecoration)
        decoration = "normal";
      if (weight != element.styles.fontWeight) weight = "normal";
      if (style != element.styles.fontStyle) style = "normal";
    });

    CpspRef.cmp.changeFontFamilyInputValue = font;
    CpspRef.cmp.changeFontSizeInputValue = size;
    CpspRef.cmp.changeBackgroundColorInputValue = backgroundColor;
    CpspRef.cmp.changeTextColorInputValue = color;
    CpspRef.cmp.changeFontWeightInputValue = weight == "bold" ? true : false;
    CpspRef.cmp.changeFontStyleInputValue = style == "underline" ? true : false;
    CpspRef.cmp.changeFontDecorationInputValue =
      decoration == "underline" ? true : false;
  }
}
