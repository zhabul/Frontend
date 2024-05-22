import { AContainer } from "src/app/canvas-ui/AContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import history from "src/app/canvas-ui/history/history";
import { Rectangle } from "src/app/canvas-ui/Rectangle";
import { CmpRef } from "../CmpRef";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { DropdownContainer } from "src/app/canvas-ui/DropdownContainer";

export class ToolboxContainer extends AContainer {
    private breakPoints = {
        xxl: 1450,
        xl: 1060,
        l: 710,
        m: 540,
        s: 430,
    };

    public publishButton: any = {
        button: null,
        buttonText: null,
    };

    constructor(
        x: number,
        y: number,
        width: string | number,
        height: string | number,
        canvas: Canvas,
        parent
    ) {
        super(x, y, width, height, canvas, parent);

        if (!this.isVisibleByBreakPoint("s")) {
            return;
        }

        const mainBorder = new GenericRoundedContainer(
            45,
            -1,
            "100%",
            "73%",
            this.canvas,
            this
        );
        mainBorder.setBackgroundColor("#373B40");
        mainBorder.setBorder("#858585", 1.5);

        const saveButton = this.createButton(
            this.getSizeByBreakPoint({ xxl: -160, xl: -130 }),
            -15,
            70,
            30,
            CmpRef.cmp.getTranslate().instant("Save").toUpperCase(),
            () => {
                CmpRef.cmp.showConfirmationModal(
                    CmpRef.cmp.getTranslate().instant("Do you want to save?"),
                    async (response) => {
                        if (response.result) {
                            if (CmpRef.cmp.loading) {
                                return;
                            }
                            CmpRef.cmp.setLoadingStatus(true);
                            const status = await history.executeQueue();
                            if (status) {
                                this.draw();
                            }
                            CmpRef.cmp.setLoadingStatus(false);

                            this.publishButton.button.setBorder("#F77E04", 1.5);
                            this.publishButton.buttonText.setColor("#F77E04");
                            this.publishButton.buttonText.draw();
                            this.publishButton.button.draw();
                        }
                    }
                );
            },
            6,
            "#858585",
            "#858585",
            (button, buttonText) => {
                history.setQueueChangeNotification((size) => {
                    if (size > 0) {
                        button.setBorder("#F77E04", 1.5);
                        buttonText.setColor("#F77E04");
                        buttonText.draw();
                        button.draw();

                        this.publishButton.button.setBorder("#858585", 1.5);
                        this.publishButton.buttonText.setColor("#858585");
                        this.publishButton.buttonText.draw();
                        this.publishButton.button.draw();

                    } else {
                        button.setBorder("#858585", 1.5);
                        buttonText.setColor("#858585");
                        buttonText.draw();
                        button.draw();
                    }
                });
            }
        );
        saveButton.setYAlignment("center");
        saveButton.setXAlignment("right");

        const sendTextContainer = new GenericContainer(
            0,
            0,
            150,
            this.getHeight(),
            this.canvas,
            this
        );
        sendTextContainer.setXAlignment("right");

        const sendDateText = new TextRenderer("", this.canvas, sendTextContainer);
        sendDateText.setColor("#E17928");
        sendDateText.setY(55);

        const sendButton = this.createButton(
            this.getSizeByBreakPoint({ xxl: -40, xl: -10 }),
            -15,
            100,
            30,
            CmpRef.cmp.getTranslate().instant("Publish").toUpperCase(),
            async () => {
                CmpRef.cmp.showConfirmationModal(
                    CmpRef.cmp.getTranslate().instant("Do you want to publish?"),
                    async (response) => {
                        if (response.result) {
                            if (CmpRef.cmp.loading) {
                                return;
                            }
                            CmpRef.cmp.setLoadingStatus(true);
                            const status =
                                await CmpRef.cmp.sendResourcePlanningChangeMessagesToUsers();
                            if (status) {
                                sendDateText.setTextContent(
                                    `Dat. ${Config.currentDate.format(
                                        Config.dateFormat
                                    )} Kl. ${Config.currentDate.format(Config.timeFormat)}`
                                );
                                this.draw();
                            }
                            CmpRef.cmp.setLoadingStatus(false);

                            this.publishButton.button.setBorder("#858585", 1.5);
                            this.publishButton.buttonText.setColor("#858585");
                            this.publishButton.buttonText.draw();
                            this.publishButton.button.draw();
                        }
                    }
                );
            },
            6,
            "#858585",
            "#858585"
        );
        sendButton.setYAlignment("center");
        sendButton.setXAlignment("right");

        if (this.isVisibleByBreakPoint("l")) {
            const pvN = new DropdownContainer(
                this.getSizeByBreakPoint({ xxl: -260, xl: -220 }),
                -15,
                this.getSizeByBreakPoint({ xxl: 200, xl: 150 }),
                30,
                this.canvas,
                this
            );
            pvN.createButton();
            pvN.setYAlignment("center");
            pvN.setXAlignment("right");
        }

        const backButton = this.addIcon(
            75,
            -12,
            35,
            30,
            "go-back",
            "go-back",
            async () => {
                CmpRef.cmp.returnHome();
            }
        ); // potrebno podesiti da ide na /home link
        backButton.setYAlignment("center");

        if (this.isVisibleByBreakPoint("xxl")) {
            const header = new TextRenderer(
                CmpRef.cmp.getTranslate().instant("Resource planning").toUpperCase(),
                this.canvas,
                this
            );
            header.setFontSize(25);
            header.setColor("#FF8787");
            header.setFontFamily("PT-Sans-Pro-Regular");
            header.setX(135);
            header.setY(25);
        }

        const barrier = new Rectangle(
            this.getSizeByBreakPoint({ xxl: 415, xl: 140 }),
            0,
            1.5,
            "73%",
            this.canvas,
            this
        );
        barrier.setBackgroundColor("#858585");

        if (this.isVisibleByBreakPoint("m")) {
            const borderButton = new GenericRoundedContainer(
                this.getSizeByBreakPoint({ xxl: 465, xl: 170 }),
                20,
                80,
                31,
                this.canvas,
                this
            );
            borderButton.setBackgroundColor("#373B40");
            borderButton.setBorder("#858585", 1);
            borderButton.setBorderRoundness(4);

            const undoIcon = this.addIcon(
                this.getSizeByBreakPoint({ xxl: 470, xl: 175 }),
                -15,
                23,
                19,
                "undo",
                "undo",
                () => {
                    history.undo();
                }
            );
            undoIcon.setYAlignment("center");

            const line = new GenericRoundedContainer(
                this.getSizeByBreakPoint({ xxl: 505, xl: 210 }),
                22,
                1,
                28,
                this.canvas,
                this
            );
            line.setBackgroundColor("#858585");

            const redoIcon = this.addIcon(
                this.getSizeByBreakPoint({ xxl: 515, xl: 220 }),
                -15,
                23,
                19,
                "redo",
                "redo",
                () => {
                    history.redo();
                }
            );
            redoIcon.setYAlignment("center");


        }
        if (this.isVisibleByBreakPoint("xl")) {
            const editingRows = new GenericRoundedContainer(
                this.getSizeByBreakPoint({ xxl: 595, xl: 280 }),
                20,
                325,
                30,
                this.canvas,
                this
            );
            editingRows.setBackgroundColor("#373B40");
            editingRows.setBorder("#858585", 1.5);
            editingRows.setBorderRoundness(6);

            const space = new GenericRoundedContainer(
                this.getSizeByBreakPoint({ xxl: 820, xl: 500 }),
                26,
                1,
                20,
                this.canvas,
                this
            );
            space.setBackgroundColor("#858585");

            const bucketWhite = this.addIcon(
                this.getSizeByBreakPoint({ xxl: 832, xl: 512 }),
                -18,
                14,
                13,
                "bucket-white",
                "bucket-white",
                () => { }
            );
            bucketWhite.setYAlignment("center");

            const arrowOpen = this.addIcon(
                this.getSizeByBreakPoint({ xxl: 847, xl: 527 }),
                -16,
                15,
                9,
                "arrow-white",
                "arrow-white",
                () => { }
            );
            arrowOpen.setYAlignment("center");

            const arrowOpen2 = this.addIcon(
                this.getSizeByBreakPoint({ xxl: 884, xl: 564 }),
                -16,
                15,
                9,
                "arrow-white",
                "arrow-white",
                () => { }
            );
            arrowOpen2.setYAlignment("center");
        }
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
        iconShape.setOnMouseHoverHandler(
            () => (document.body.style.cursor = "pointer")
        );

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
        onChangeFn?: Function
    ) {
        const button = new GenericRoundedContainer(
            x,
            y,
            width,
            height,
            this.canvas,
            this
        );
        button.setBackgroundColor("#373B40");
        button.setBorder(borderColor, 1.5);
        if (Config.isInEditMode) {
            button.setOnClickHandler(onClickFn);
            button.setOnMouseHoverHandler(() => {
                document.body.style.cursor = "pointer";
            });
        }
        button.setBorderRoundness(radius);
        const buttonText = new TextRenderer(textContent, this.canvas, button);
        buttonText.setColor(textColor);
        buttonText.setFontSize(13);
        buttonText.setAlignment("center", "center");
        buttonText.updateTextDimensions();

        if (
            document.body.style.cursor == "default" &&
            button.getBorderColor() == "#F77E04"
        ) {
            button.setBorder("#858585", 1.5);
            buttonText.setColor("#858585");
            buttonText.draw();
            button.draw();
        }

        if (onChangeFn) {
            onChangeFn(button, buttonText);
        }
        this.publishButton.button = button;
        this.publishButton.buttonText = buttonText;
        return button;
    }

    getSize(min: number, max: number) {
        return window.innerWidth <= 1450 ? min : max;
    }

    isVisibleByBreakPoint(breakPoint: string) {
        return window.innerWidth >= this.breakPoints[breakPoint];
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
