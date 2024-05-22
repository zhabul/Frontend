import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import history from "src/app/canvas-ui/history/history";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { Configuration } from "../Configuration";
import { CppRef } from "../CppRef";

export class MainHeaderContainer extends AContainer {

  public saveButton: GenericRoundedContainer;
    public draftButton: GenericRoundedContainer;
    public sentButton: GenericRoundedContainer;
    public acceptedButton: GenericRoundedContainer;
    public draftCheck: Rectangle;
    public sentCheck: Rectangle;
    public acceptedCheck: Rectangle;

    constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent) {
      super(x, y, width, height, canvas, parent);

      const mainBorder = new GenericRoundedContainer(45, -1,'100%', '73%', this.canvas, this);
        mainBorder.setBackgroundColor('#373B40');
        mainBorder.setBorder('#858585', 1.5);

        this.saveButton = this.createButton(-260, -15, 70, 30, ('Save').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.saveButton.setBorder('#858585', 1.5);
                        this.saveButton.getFirstChild().setColor('#858585');
                        this.saveButton.getFirstChild().draw();
                        this.saveButton.draw();

                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585');
        this.saveButton.setYAlignment('center');
        this.saveButton.setXAlignment('right');

        const backButton = this.addIcon(75, -12, 35, 30, 'go-back', 'go-back', async () => {
          CppRef.cpp.returnHome();
        }); //potrebno podesiti da ide na /home link
        backButton.setYAlignment('center');

        const header = new TextRenderer('Project planning'.toUpperCase(), this.canvas, this);
        header.setFontSize(25);
        header.setColor('#FF8787');
        header.setFontFamily('PT-Sans-Pro-Regular');
        header.setX(135);
        header.setY(25);

        const barrier = new Rectangle(415, 0, 1.5, '73%', this.canvas, this);
        barrier.setBackgroundColor('#858585');

        const borderButton = new GenericRoundedContainer(465, 20, 80, 31, this.canvas, this);
        borderButton.setBackgroundColor('#373B40');
        borderButton.setBorder('#858585', 1);
        borderButton.setBorderRoundness(4);

        const undoIcon = this.addIcon(470, -15, 23, 19, 'undo', 'undo', () => { history.undo(); });
        undoIcon.setYAlignment('center');

        const line = new GenericRoundedContainer(505, 22, 1, 28, this.canvas, this);
        line.setBackgroundColor('#858585');

        const redoIcon = this.addIcon(515, -15, 23, 19, 'redo', 'redo', () => { history.redo(); });
        redoIcon.setYAlignment('center');

      //offer
        const borderOffer = new GenericRoundedContainer(565, 20, 450, 30, this.canvas, this);
        borderOffer.setBackgroundColor('#373B40');
        borderOffer.setBorder('#FF8787', 2);
        borderOffer.setBorderRoundness(6);


        const offerCheck = this.addIcon(577, -15, 17, 17, 'pink-circle', 'pink-circle', () => { offerCheck.addBackgroundImagePattern('pink-circle', 'pink-circle', 17, 17); });
        offerCheck.setYAlignment('center');

        const offer = new TextRenderer('Offer'.toUpperCase(), this.canvas, this);
        offer.setFontSize(14);
        offer.setColor('#FF8787');
        offer.setFontFamily('PT-Sans-Pro-Regular');
        offer.setX(605);
        offer.setY(29);

        const spaceOffer = new GenericRoundedContainer(655, 21, 2, 30, this.canvas, this);
        spaceOffer.setBackgroundColor('#FF8787');

        this.draftButton = this.createButton(675, 25, 100, 20, ('Draft').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.draftButton.setBorder('#F7F771', 1.5);
                        this.draftButton.getFirstChild().setColor('#F7F771');
                        this.draftButton.getFirstChild().draw();
                        this.draftButton.draw();
                        this.draftCheck.addBackgroundImagePattern('yellow-circle', 'yellow-circle', 15, 15);
                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585', 12);
        this.draftCheck = this.addIcon(685, 28, 15, 15, 'x-circle', 'x-circle', () => {});

        this.sentButton = this.createButton(785, 25, 100, 20, ('Sent').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.sentButton.setBorder('#858585', 1.5);
                        this.sentButton.getFirstChild().setColor('#858585');
                        this.sentButton.getFirstChild().draw();
                        this.sentButton.draw();
                        this.sentCheck.addBackgroundImagePattern('orange-circle', 'orange-circle', 15, 15);
                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585', 12);
        this.sentCheck = this.addIcon(795, 28, 15, 15, 'x-circle', 'x-circle', () => {});

        this.acceptedButton = this.createButton(895, 25, 110, 20, ('Accepted').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.acceptedButton.setBorder('#858585', 1.5);
                        this.acceptedButton.getFirstChild().setColor('#858585');
                        this.acceptedButton.getFirstChild().draw();
                        this.acceptedButton.draw();
                        this.acceptedCheck.addBackgroundImagePattern('white-circle', 'white-circle', 15, 15);
                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585', 12)
        this.acceptedCheck = this.addIcon(905, 28, 15, 15, 'x-circle', 'x-circle', () => {});

      //project
        const borderProject = new GenericRoundedContainer(1030, 20, 470, 30, this.canvas, this);
        borderProject.setBackgroundColor('#373B40');
        borderProject.setBorder('#FF8787', 2);
        borderProject.setBorderRoundness(6);

        const projectCheck = this.addIcon(1040, -15, 17, 17, 'pink-circle', 'pink-circle', () => {});
        projectCheck.setYAlignment('center');

        const project = new TextRenderer('Project'.toUpperCase(), this.canvas, this);
        project.setFontSize(14);
        project.setColor('#FF8787');
        project.setFontFamily('PT-Sans-Pro-Regular');
        project.setX(1060);
        project.setY(29);

        const spaceProject = new GenericRoundedContainer(1120, 21, 2, 30, this.canvas, this);
        spaceProject.setBackgroundColor('#FF8787');

        this.draftButton = this.createButton(1140, 25, 100, 20, ('Coming').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.draftButton.setBorder('#F7F771', 1.5);
                        this.draftButton.getFirstChild().setColor('#F7F771');
                        this.draftButton.getFirstChild().draw();
                        this.draftButton.draw();
                        this.draftCheck.addBackgroundImagePattern('yellow-circle', 'yellow-circle', 15, 15);
                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585', 12);
        this.draftCheck = this.addIcon(1150, 28, 15, 15, 'x-circle', 'x-circle', () => {});

        this.sentButton = this.createButton(1250, 25, 120, 20, ('In progress').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.sentButton.setBorder('#858585', 1.5);
                        this.sentButton.getFirstChild().setColor('#858585');
                        this.sentButton.getFirstChild().draw();
                        this.sentButton.draw();
                        this.sentCheck.addBackgroundImagePattern('green-circle', 'green-circle', 15, 15);
                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585', 12);
        this.sentCheck = this.addIcon(1260, 28, 15, 15, 'x-circle', 'x-circle', () => {});

        this.acceptedButton = this.createButton(1380, 25, 100, 20, ('Decline').toUpperCase(), () => {

            CppRef.cpp.showConfirmationModal('Do you want to save?', async (response) => {
                if(response.result) {
                    if (CppRef.cpp.loading) return;
                    CppRef.cpp.setLoadingStatus(true);
                    const status = await history.executeQueue();
                    if (status) {
                        this.draw();
                        //data is saved and there is data that can be published
                        this.acceptedButton.setBorder('#858585', 1.5);
                        this.acceptedButton.getFirstChild().setColor('#858585');
                        this.acceptedButton.getFirstChild().draw();
                        this.acceptedButton.draw();
                        this.acceptedCheck.addBackgroundImagePattern('white-circle', 'white-circle', 15, 15);
                    }
                    CppRef.cpp.setLoadingStatus(false);

                }
            })

        }, 6, '#858585', '#858585', 12)
        this.acceptedCheck = this.addIcon(1390, 28, 15, 15, 'x-circle', 'x-circle', () => {});
    }


    addIcon(x: number, y: number, width: number, height: number, iconName: string, iconPath: string, onClickFn: Function) {
        const iconShape = new Rectangle(x, y, width, height, this.canvas, this);
        iconShape.addBackgroundImagePattern(iconName, iconPath, width, height);
        iconShape.setOnClickHandler(onClickFn);
        iconShape.setOnMouseHoverHandler(() => document.body.style.cursor = 'pointer');

        return iconShape;
    }

    createButton(x: number, y: number, width: number, height: number, textContent: string, onClickFn: Function, radius: number, borderColor: string = 'white', textColor: string = '#F77E04', fontSize: number = 13) {
        const button = new GenericRoundedContainer(x, y, width, height, this.canvas, this);
        button.setBackgroundColor('#373B40');
        button.setBorder(borderColor, 1.5);
        if(Configuration.isInEditMode) {
            button.setOnClickHandler(onClickFn);
            button.setOnMouseHoverHandler(() => {
                document.body.style.cursor = 'pointer';
            });
        }
        button.setBorderRoundness(radius);
        const buttonText = new TextRenderer(textContent, this.canvas, button);
        buttonText.setColor(textColor);
        buttonText.setFontSize(fontSize);
        buttonText.setAlignment('center', 'center');
        buttonText.updateTextDimensions();

        return button;
    }

}
