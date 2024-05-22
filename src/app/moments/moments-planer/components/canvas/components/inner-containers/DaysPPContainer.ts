import * as moment from "moment";
import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Day } from "src/app/canvas-ui/models/Day";
import { DisplayMonth } from "src/app/canvas-ui/models/DisplayMonth";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { CmpRef } from "src/app/moments/project-moments/resource-planning-app/CmpRef";
import { Configuration } from "../Configuration";
import { CppRef } from "../CppRef";

export class DaysPPContainer extends AScrollableContainer {

    private allDisplayMonths: DisplayMonth[] = [];
    private currentDisplayMonthIndex = 0;

    constructor(x: number, y: number, width: string | number, height: string | number, canvas: Canvas, parent) {
      super(x, y, width, height, canvas, parent);

      this.generateAllDisplayMonths();
      this.innerContainer.setWidth(this.getNumberOfAllDisplayDays() * Configuration.cellWidth);
    }

    getAllDisplayMonths() { return this.allDisplayMonths; }

    getCurrentDisplayMonthIndex() { return this.currentDisplayMonthIndex; }
    setCurrentDisplayMonthIndex(index: number) { this.currentDisplayMonthIndex = index; }

    getCurrentDayContainerX() {
        const currentMonth = this.allDisplayMonths.find(m => m.year === Configuration.currentDate.year() && m.month === Configuration.currentDate.month() + 1);
        if (currentMonth === undefined) return 0;
        return currentMonth.x + currentMonth.days.find(day => day.day === Configuration.currentDate.date()).x;
    }

    getCurrentWeekContainerX() {
        const startOfWeek = moment(Configuration.currentDate).startOf('isoWeek');
        const currentMonth = this.allDisplayMonths.find(m => m.year === startOfWeek.year() && m.month === startOfWeek.month() + 1);
        if (currentMonth === undefined) return 0;
        return currentMonth.x + currentMonth.days.find(day => day.day === startOfWeek.date()).x;
    }

    getListOfPublicHolidayXPositions() {
        const xPositions: number[] = [];
        this.allDisplayMonths.forEach(month => {
            month.days.forEach(day => {
                if (day.isPublicHoliday) xPositions.push(month.x + day.x);
            });
        });
        return xPositions;
    }

    addDisplayMonthToDaysContainer(monthIndex: number) {
        if (monthIndex < 0 || monthIndex > this.allDisplayMonths.length  - 1) return;

        const displayMonth = this.allDisplayMonths[monthIndex];
        const numOfDaysInMonth = displayMonth.days.length;

        let weekX = 0;
        let x = 0;

        const monthContainer = new GenericContainer(displayMonth.x, 0, numOfDaysInMonth * Configuration.cellWidth, this.getHeight(), this.canvas, this.innerContainer);

        const month = new GenericContainer(0, 0, Configuration.cellWidth * numOfDaysInMonth, Configuration.cellWidth, this.canvas, monthContainer);
        month.setBorder('#cccccc', 1);
        month.setBackgroundColor('white');
        const translatedMonth = CppRef.cpp.getTranslate().instant(displayMonth.monthName);
        const monthText = new TextRenderer(`${translatedMonth} - ${displayMonth.year}`, this.canvas, month);
        monthText.setFontSize(14);
        monthText.setFontWeight('bold');
        monthText.setAlignment('center', 'center');
        monthText.updateTextDimensions();

        let numberOfDaysInWeek = 0;
        for (let j = 0; j < numOfDaysInMonth; j++) {
            numberOfDaysInWeek++;

            if (j === numOfDaysInMonth - 1 || displayMonth.days[j].week !== displayMonth.days[j + 1].week) {
                let x = 0;
                let additionalWeeks = 0;

                if (numberOfDaysInWeek < 7) {
                    additionalWeeks = 7 - numberOfDaysInWeek;
                    if (j !== numOfDaysInMonth - 1) x = additionalWeeks * Configuration.cellWidth;
                }

                const weekContainer = new GenericContainer(weekX - x, Configuration.cellWidth, Configuration.cellWidth * (numberOfDaysInWeek + additionalWeeks), Configuration.cellWidth, this.canvas, monthContainer);
                weekContainer.setBorder('#cccccc', 1);
                weekContainer.setBackgroundColor('white');

                if (CppRef.cpp.selectedWeeksToShowWorkers.includes(`${displayMonth.days[j].weekYear}-${displayMonth.days[j].doubleDigitWeek}`)) {
                    weekContainer.setBackgroundColor('#F3CDCD');
                }

                weekContainer.setOnClickHandler(async (e) => {
                    const week = `${displayMonth.days[j].weekYear}-${displayMonth.days[j].doubleDigitWeek}`;
                    if (CppRef.cpp.selectedWeeksToShowWorkers.includes(week)) {
                        weekContainer.setBackgroundColor('white');
                        weekContainer.draw();
                        CppRef.cpp.projectPlanningApp.gridPPContainer.getInnerContainer().removeBackgroundImagePattern(`worker-threshold-cell-${week}`);
                        // CppRef.cpp.projectPlanningApp.usersContainer.removeWeekInSelectedWeeksToShowWorkers(week);
                    } else {
                        let x = 0;
                        if (monthIndex === 0 && j !== displayMonth.days.length - 1) {
                            x = displayMonth.days[j].x - (6 * Configuration.cellWidth);
                        } else {
                            const selectedDate = moment(week, Configuration.dateWeekFormat);
                            const selectedMonth = this.allDisplayMonths.find(m => m.year === selectedDate.year() && m.month === selectedDate.month() + 1);
                            const selectedDay = selectedMonth.days.find(day => day.day === selectedDate.date());
                            x = selectedMonth.x + selectedDay.x;
                        }

                        weekContainer.setBackgroundColor('#F3CDCD');
                        weekContainer.draw();

                        await CppRef.cpp.projectPlanningApp.gridPPContainer.getInnerContainer().addBackgroundImagePattern(`worker-threshold-cell-${week}`, 'worker-threshold-cell', Configuration.cellWidth * 7, Configuration.cellHeight, 'repeat-y', x);
                        // CppRef.cpp.projectPlanningApp.usersContainer.addWeekToSelectedWeeksToShowWorkers(week);
                    }

                    CppRef.cpp.projectPlanningApp.usersContainer.refreshDisplay();
                    CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
                });

                const weekText = new TextRenderer(`V.${displayMonth.days[j].week}`, this.canvas, weekContainer);
                weekText.setAlignment('center', 'center');
                weekText.updateTextDimensions();

                weekX += Configuration.cellWidth * numberOfDaysInWeek;
                numberOfDaysInWeek = 0;
            }

            const day = new GenericContainer(x, Configuration.cellWidth * 2, Configuration.cellWidth, Configuration.cellWidth, this.canvas, monthContainer);
            day.setBorder('#cccccc', 1);
            let color = 'white';
            let textColor = 'black';

            if (displayMonth.days[j].isCurrentDay) {
                color = '#FF6565';
                textColor = 'white';
            } else if (displayMonth.days[j].isPublicHoliday) {
                color = '#cccccc';
            } else  if (displayMonth.days[j].isWeekend) {
                color = '#efefef';
            }  else  if (displayMonth.days[j].isPlanedAbsence) {
                color = '#fbead6';
            }

            day.setBackgroundColor(color);
            const dayText = new TextRenderer(displayMonth.days[j].day.toString(), this.canvas, day);
            dayText.setColor(textColor);
            dayText.setAlignment('center', 'center');
            dayText.updateTextDimensions();

            x += Configuration.cellWidth;
        }
    }

    // private isWeekend(date: moment.Moment) {
    //   const dayName = date.format('dddd');
    //   console.log("work days " + dayName);
    //   console.log(CppRef.cpp.workDays);
    //   const day = CppRef.cpp.workDays.find(day => day.name === dayName);
    //     return day.type === '0';
    // }

    private generateAllDisplayMonths() {
        let date = moment(`${Configuration.currentDate.year()}-${Configuration.currentDate.month() + 1}-01`, Configuration.dateFormat);

        for (let i = 0; i < Configuration.numberOfPreviousMonthsToShow; i++) {
            date.subtract(1, 'month');
            this.allDisplayMonths.unshift({
                year: date.year(),
                monthName: date.format('MMMM'),
                month: date.month() + 1,
                days: this.getDaysOfMonth(date.year(), date.month() + 1),
                x: 0
            });
        }

        date = moment(`${Configuration.currentDate.year()}-${Configuration.currentDate.month() + 1}-01`, Configuration.dateFormat);

        const numberOfNextMonthsToShow = this.findNumberOfNextMonthsToShow();

        for (let i = 0; i < numberOfNextMonthsToShow + 1; i++) {
            this.allDisplayMonths.push({
                year: date.year(),
                monthName: date.format('MMMM'),
                month: date.month() + 1,
                days: this.getDaysOfMonth(date.year(), date.month() + 1),
                x: 0
            });
            date.add(1, 'month');
        }

        this.setXPositionForAllDisplayMonths();
    }

    private setXPositionForAllDisplayMonths() {
        let days = 0;
        this.allDisplayMonths.forEach(m => {
            m.x = days * Configuration.cellWidth;
            days += m.days.length;
        });
    }

    private getDaysOfMonth(year: number, month: number) {
        const days: Day[] = [];
        let x = 0;

        let date = moment(`${year}-${month}-01`, Configuration.dateFormat).locale('en');
      console.log("ovdje je");
      console.log(date);
        while (true) {
            days.push({
                week: date.isoWeek(),
                doubleDigitWeek: date.format('WW'),
                weekYear: date.isoWeekYear(),
                //isWeekend: this.isWeekend(date),
                isWeekend: false,
                isSunday: date.format('ddd') === 'Sun',
                isCurrentDay: date.format(Configuration.dateFormat) === Configuration.currentDate.format(Configuration.dateFormat),
                day: date.date(),
                x,
                // isPublicHoliday: CppRef.cpp.publicHolidayDates.includes(date.format(Configuration.dateFormat))
                isPublicHoliday: false,
                isPlanedAbsence: false
            });

            x += Configuration.cellWidth;
            date.add(1, 'days');
            // + 1 because date.month() is month index
            if (month !== (date.month() + 1)) break;
        }

        return days;
    }

    findNumberOfNextMonthsToShow() {
        // let maxEndDate = '';
        // CppRef.cpp.allDisplayProjects.forEach(project => {
        //     if (project.endDate > maxEndDate) maxEndDate = project.endDate;
        // });
        // const diff = moment(maxEndDate, Configuration.dateFormat).diff(Configuration.currentDate, 'months', true);

        // return Math.max(Math.ceil(diff), 1);
        return 1;
    }


    getNumberOfAllDisplayDays() {
        return this.allDisplayMonths.reduce((total, month) => total += month.days.length, 0);
    }


    getXOffsetPositionsOfWeekends() {
        const positions = [];
        const secondWeekOfMonth = this.allDisplayMonths[0].days[7].week;
        this.allDisplayMonths[0].days.forEach(day => {
            if (day.week !== secondWeekOfMonth) return;
            if (day.isWeekend) positions.push(this.allDisplayMonths[0].x + day.x - (Configuration.cellWidth * 7));
        });
        return positions;
    }
}
