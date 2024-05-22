import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CpspRef } from "../../CpspRef";
import historySchedulePlaner from "src/app/canvas-ui/history/historySchedulePlaner";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { ConfigSc } from "../../Config";



export class HelpHeader extends AContainer{

  public saveButton: GenericRoundedContainer;
  public retButton: GenericRoundedContainer;
  public sendButton: GenericRoundedContainer;
  public lockButton: GenericRoundedContainer;

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

    this.setBackgroundColor("#373B40");

    CpspRef.cmp.hideEditingRows();
    // CpspRef.cmp.hideHoursProject();

    const text = new TextRenderer("Help header", this.canvas, this);
    text.setFontSize(10);
    text.setColor("#FFFFFF");
    text.setFontFamily("PT-Sans-Pro-Regular");
    text.setX(910);
    text.setY(60);

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

    let b = document.getElementById(
      "dropdown-div"
    );

    b.style.display = "none";

  }

  public clickOnSave(){
    if(historySchedulePlaner.getNumberOfChanges() <= 0 || CpspRef.cmp.property_index != CpspRef.cmp.revisions.length + 1 || CpspRef.cmp.copySelectedProject == null)
    return;

  CpspRef.cmp.showConfirmationModal(
    CpspRef.cmp.getTranslate().instant("Do you want to save?"),
    async (response) => {
      if (response.result) {
        if (CpspRef.cmp.loading) {
          return;
        }
        CpspRef.cmp.setLoadingStatus(true);
        const status = await historySchedulePlaner.executeQueue();
        const status1 =  await CpspRef.cmp.executeQueueSave();
        if (status && status1) {
          this.sendDateText.setTextContent(
            `Dat. ${ConfigSc.currentDate.format(
              ConfigSc.dateFormat
            )}  ${ConfigSc.currentDate.format(ConfigSc.timeFormat)}`
          );
          this.draw();
          CpspRef.cmp.idParentGroups = [];
          CpspRef.cmp.idMoments = [];
          CpspRef.cmp.activeRevisions = CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject);
        }
        CpspRef.cmp.setLoadingStatus(false);
        if(historySchedulePlaner.getNumberOfChanges() != 0){
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
          CpspRef.cmp.activeRevisions = CpspRef.cmp.deepCopy(CpspRef.cmp.copySelectedProject);
        }
        CpspRef.cmp.selectedProject.activities=JSON.parse(JSON.stringify(CpspRef.cmp.copySelectedProject.activities));
        CpspRef.cmp.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        this.sendDateText.draw();
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      }
    }
  );
  }

}
