import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "../../CmpRef";
import { GenericRoundedContainer } from "src/app/canvas-ui/GenericRoundedContainer";

export class ResourcePlanningContainer extends AScrollableContainer {
    private resourceListContainer: GenericContainer;

    constructor(
        x: number,
        y: number,
        width: string | number,
        height: string | number,
        canvas: Canvas,
        parent
    ) {
        super(x, y, width, height, canvas, parent);

        this.addResourceListContainer();
    }

    addAllDisplayResourcesThatFitContainer() {
        const index =
            CmpRef.cmp.planningApp.daysContainer.getCurrentDisplayMonthIndex();
        for (
            let i = index,
            n =
                CmpRef.cmp.planningApp.daysContainer.getLastMonthIndexToFitInContainerView();
            i < n;
            i++
        ) {
            this.addResourceWeeksOfMonth(i);
        }
    }

    getResourceListContainer() {
        return this.resourceListContainer;
    }

    addResourceListContainer() {
        this.resourceListContainer = new GenericContainer(
            0,
            0,
            "100%",
            this.getHeight(),
            this.canvas,
            this.innerContainer
        );
        this.resourceListContainer.setBackgroundColor("white");
    }

    addResourceWeeksOfMonth(monthIndex: number) {
        const allDisplayMonths =
            CmpRef.cmp.planningApp.daysContainer.getAllDisplayMonths();

        if (monthIndex < 0 || monthIndex > allDisplayMonths.length - 1) {
            return;
        }
        const displayMonth = allDisplayMonths[monthIndex];

        const resourceMonthContainer = new GenericContainer(
            displayMonth.x,
            0,
            displayMonth.days.length * Config.cellWidth,
            this.resourceListContainer.getHeight(),
            this.canvas,
            this.resourceListContainer
        );

        let numberOfDaysInWeek = 0;
        let weekX = 0;

        for (let i = 0, n = displayMonth.days.length; i < n; i++) {
            numberOfDaysInWeek++;

            if (
                i !== n - 1 &&
                displayMonth.days[i].week === displayMonth.days[i + 1].week
            ) {
                continue;
            }

            let x = 0;
            let additionalWeeks = 0;

            if (numberOfDaysInWeek < 7) {
                additionalWeeks = 7 - numberOfDaysInWeek;
                if (i !== n - 1) {
                    x = additionalWeeks * Config.cellWidth;
                }
            }
            const numberOfWorkersWorking =
                CmpRef.cmp.planningApp.projectUsersContainer.getNumberOfWorkersWorkingForAllProjectsForWeek(
                    `${displayMonth.days[i].weekYear}-${displayMonth.days[i].doubleDigitWeek}`
                );
            const numberOfWorkersNeeded =
                CmpRef.cmp.planningApp.projectUsersContainer.getNumberOfWorkersNeededForAllProjectsForWeek(
                    `${displayMonth.days[i].weekYear}-${displayMonth.days[i].doubleDigitWeek}`
                );

            const resourceContainer = new GenericContainer(
                weekX - x,
                0,
                (numberOfDaysInWeek + additionalWeeks) * Config.cellWidth,
                resourceMonthContainer.getHeight(),
                this.canvas,
                resourceMonthContainer
            );
            resourceContainer.setBackgroundColor("#201F1F");

            const numberOfWorkersNeededContainer = new GenericRoundedContainer(
                0,
                0 + this.getHeight() / 12,
                resourceContainer.getWidth(),
                resourceContainer.getHeight() / 4,
                this.canvas,
                resourceContainer
            );
            numberOfWorkersNeededContainer.setBackgroundColor("white");
            numberOfWorkersNeededContainer.setBorder("#201F1F", 2);
            numberOfWorkersNeededContainer.setBorderRoundness(3);

            const numberOfWorkersNeededText = new TextRenderer(
                numberOfWorkersNeeded.toString(),
                this.canvas,
                numberOfWorkersNeededContainer
            );
            numberOfWorkersNeededText.setAlignment("center", "center");
            numberOfWorkersNeededText.updateTextDimensions();

            const numberOfWorkersWorkingContainer = new GenericRoundedContainer(
                0,
                resourceContainer.getHeight() / 3,
                resourceContainer.getWidth(),
                resourceContainer.getHeight() / 4,
                this.canvas,
                resourceContainer
            );
            numberOfWorkersWorkingContainer.setBackgroundColor("white");
            numberOfWorkersWorkingContainer.setBorder("#201F1F", 2);
            numberOfWorkersWorkingContainer.setBorderRoundness(3);

            const numberOfWorkersWorkingText = new TextRenderer(
                numberOfWorkersWorking.toString(),
                this.canvas,
                numberOfWorkersWorkingContainer
            );
            numberOfWorkersWorkingText.setAlignment("center", "center");
            numberOfWorkersWorkingText.updateTextDimensions();

            const result = numberOfWorkersWorking - numberOfWorkersNeeded;
            let resultAsText = result.toString();
            let color = "#00ff33";

            if (result > 0) {
                resultAsText = `+${resultAsText}`;
            }
            if (result < -2) {
                color = "#ff0000";
            }
            if (result > 2) {
                color = "#201ABF";
            }

            const resultsContainer = new GenericRoundedContainer(
                2,
                (resourceContainer.getHeight() / 3) * 2,
                resourceContainer.getWidth() - 3,
                resourceContainer.getHeight() / 4,
                this.canvas,
                resourceContainer
            );
            resultsContainer.setBackgroundColor("white");
            resultsContainer.setBorder(color, 3);
            resultsContainer.setBorderRoundness(3);

            const resultsText = new TextRenderer(
                resultAsText,
                this.canvas,
                resultsContainer
            );

            resultsText.setAlignment("center", "center");
            resultsText.updateTextDimensions();

            weekX += Config.cellWidth * numberOfDaysInWeek;
            numberOfDaysInWeek = 0;
        }
    }

    refreshDisplay() {
        this.getResourceListContainer().removeAllChildren();
        this.addAllDisplayResourcesThatFitContainer();
        this.draw();
    }
}
