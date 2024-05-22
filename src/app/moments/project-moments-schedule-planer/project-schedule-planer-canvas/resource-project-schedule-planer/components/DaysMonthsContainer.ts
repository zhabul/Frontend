import * as moment from "moment";
import { AScrollableContainer } from "src/app/canvas-ui/AScrollableContainer";
import { Canvas } from "src/app/canvas-ui/Canvas";
import { GenericContainer } from "src/app/canvas-ui/GenericContainer";
import { Day } from "src/app/canvas-ui/models/Day";
import { DisplayMonth } from "src/app/canvas-ui/models/DisplayMonth";
import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { ConfigSc } from "../Config";
import { CpspRef } from "../CpspRef";

export class DaysMonthsContainer extends AScrollableContainer {

  private allDisplayMonths: DisplayMonth[] = [];
  private currentDisplayMonthIndex = 0;

  constructor(
    x: number,
    y: number,
    width: string | number,
    height: string | number,
    canvas: Canvas,
    parent
  ) {
    super(x, y, width, height, canvas, parent);

    this.generateAllDisplayMonths();
    this.innerContainer.setWidth(this.getNumberOfAllDisplayDays() * ConfigSc.cellWidth);
    this.addAllDisplayMonthsThatFitContainerView();

  }

  getAllDisplayMonths() {
    return this.allDisplayMonths;
  }

  getNumberOfAllDays(){
    let br = 0;
    this.allDisplayMonths.forEach(month =>{
      br += month.days.length;
    })
    return br;
  }

  getCurrentDisplayMonthIndex() {
    return this.currentDisplayMonthIndex;
  }
  setCurrentDisplayMonthIndex(index: number) {
    this.currentDisplayMonthIndex = index;
  }

  getCurrentDayContainerX() {
    const currentMonth = this.allDisplayMonths.find(m => m.year === ConfigSc.currentDate.year() && m.month === ConfigSc.currentDate.month() + 1);
    if (currentMonth === undefined) return 0;
    return currentMonth.x + currentMonth.days.find(day => day.day === ConfigSc.currentDate.date()).x;
  }

  getCurrentWeekContainerX() {
    const startOfWeek = moment(ConfigSc.currentDate).startOf("isoWeek");
    const currentMonth = this.allDisplayMonths.find(m => m.year === startOfWeek.year() && m.month === startOfWeek.month() + 1);
    if (currentMonth === undefined) return 0;
    return currentMonth.x + currentMonth.days.find(day => day.day === startOfWeek.date()).x;
  }

  getHalfXOfVisible(){
    let half = moment(CpspRef.cmp.findEarlyerStartDate());
    const currentMonth = this.allDisplayMonths.find(m => m.year === half.year() && m.month === half.month() + 1);
    if (currentMonth === undefined) return 0;
    return currentMonth.x + currentMonth.days.find(day => day.day === half.date()).x;
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

    const monthContainer = new GenericContainer(
      displayMonth.x * CpspRef.cmp.pixelRation,
      0,
      numOfDaysInMonth * ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
      this.getHeight(),
      this.canvas,
      this.innerContainer
    );

    const month = new GenericContainer(
      0,
      0,
      ConfigSc.cellWidth * numOfDaysInMonth * CpspRef.cmp.pixelRation,
      ConfigSc.cellWidth,
      this.canvas,
      monthContainer
    );
    month.setBorder("#cccccc", 1);
    month.setBackgroundColor("white");
    const translatedMonth = CpspRef.cmp.getTranslate().instant(displayMonth.monthName);

    const monthText = new TextRenderer(
      `${translatedMonth} - ${displayMonth.year}`,
      this.canvas,
      month
    );
    monthText.setFontSize(11);
    monthText.setFontWeight("bold");
    monthText.setAlignment("center", "center");
    monthText.updateTextDimensions();

    let numberOfDaysInWeek = 0;
    for (let j = 0; j < numOfDaysInMonth; j++) {
      numberOfDaysInWeek++;

      if (j === numOfDaysInMonth - 1 || displayMonth.days[j].week !== displayMonth.days[j + 1].week) {
        let x = 0;
        let additionalWeeks = 0;

        if (numberOfDaysInWeek < 7) {
          additionalWeeks = 7 - numberOfDaysInWeek;
          if (j !== numOfDaysInMonth - 1) x = additionalWeeks * ConfigSc.cellWidth;
        }


        const weekContainer = new GenericContainer(
          (weekX - x) * CpspRef.cmp.pixelRation,
          ConfigSc.cellWidth,
          monthIndex == this.allDisplayMonths.length - 1 && j == numOfDaysInMonth - 1 ? ConfigSc.cellWidth * numberOfDaysInWeek * CpspRef.cmp.pixelRation : ConfigSc.cellWidth * (numberOfDaysInWeek + additionalWeeks) * CpspRef.cmp.pixelRation,
          ConfigSc.cellWidth,
          this.canvas,
          monthContainer
        );
        weekContainer.setBorder("#cccccc", 1);
        weekContainer.setBackgroundColor("white");

        if (CpspRef.cmp.selectedWeeksToShowWorkers.includes(`${displayMonth.days[j].weekYear}-${displayMonth.days[j].doubleDigitWeek}`)) {
            weekContainer.setBackgroundColor("#F3CDCD");
        }

        weekContainer.setOnClickHandler(async (e) => {
          const week = `${displayMonth.days[j].weekYear}-${displayMonth.days[j].doubleDigitWeek}`;
          if (CpspRef.cmp.selectedWeeksToShowWorkers.includes(week)) {
            weekContainer.setBackgroundColor("white");
            weekContainer.draw();
            CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeBackgroundImagePattern(`worker-threshold-cell-${week}`);
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.removeWeekInSelectedWeeksToShowWorkers(week);
          } else {
            //let x = 0;
            if (monthIndex === 0 && j !== displayMonth.days.length - 1) {
              x = displayMonth.days[j].x - (6 * ConfigSc.cellWidth);
            } else {
              const selectedDate = moment(week, ConfigSc.dateWeekFormat);
              const selectedMonth = this.allDisplayMonths.find(m => m.year === selectedDate.year() && m.month === selectedDate.month() + 1);
              const selectedDay = selectedMonth.days.find(day => day.day === selectedDate.date());
              x = selectedMonth.x + selectedDay.x;
            }

            weekContainer.setBackgroundColor("#F3CDCD");
            weekContainer.draw();

            //await CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().addBackgroundImagePattern(`worker-threshold-cell-${week}`, "worker-threshold-cell", ConfigSc.cellWidth * 7, ConfigSc.cellHeight, "repeat-y", x);
            CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addWeekToSelectedWeeksToShowWorkers(week);
          }
          CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
          CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();


        });

          const weekText = new TextRenderer(`V.${displayMonth.days[j].week}`, this.canvas, weekContainer);
          weekText.setAlignment("center", "center");
          weekText.updateTextDimensions();

          weekX += ConfigSc.cellWidth * numberOfDaysInWeek;
          numberOfDaysInWeek = 0;
      }

      const day = new GenericContainer(
        x * CpspRef.cmp.pixelRation,
        ConfigSc.cellWidth * 2,
        ConfigSc.cellWidth * CpspRef.cmp.pixelRation,
        ConfigSc.cellWidth,
        this.canvas,
        monthContainer
      );

      day.setBorder("#cccccc", 1);
      let color = "white";
      let textColor = "black";

      if (displayMonth.days[j].isCurrentDay) {
          color = "#FF0000";
          textColor = "white";
      } else if (displayMonth.days[j].isPublicHoliday) {
          color = "#cccccc";
      } else  if (displayMonth.days[j].isWeekend) {
          color = "#efefef";
      }  else  if (displayMonth.days[j].isPlanedAbsence) {
          color = "#fbead6";
      }

      day.setBackgroundColor(color);
      const dayText = new TextRenderer(displayMonth.days[j].day.toString(), this.canvas, day);
      dayText.setColor(textColor);
      dayText.setAlignment("center", "center");
      dayText.updateTextDimensions();

      if(CpspRef.cmp.pixelRation < 1)
        dayText.setFontSize(13 * CpspRef.cmp.pixelRation);
      else
        dayText.setFontSize(13);

      x += ConfigSc.cellWidth;
    }
  }

  private setXPositionForAllDisplayMonths() {
    let days = 0;
    this.allDisplayMonths.forEach(
      m => {
        m.x = days * ConfigSc.cellWidth;
        days += m.days.length;
      }
    );
  }

  private getDaysOfMonth(year: number, month: number) {
    const days: Day[] = [];
    let x = 0;

    let date = moment(`${year}-${month}-01`, ConfigSc.dateFormat).locale("en");

    while (true) {
      days.push({
        week: date.isoWeek(),
        doubleDigitWeek: date.format("WW"),
        weekYear: date.isoWeekYear(),
        isWeekend: this.isWeekend(date),
        isSunday: date.format("ddd") === "Sun",
        isCurrentDay: date.format(ConfigSc.dateFormat) === ConfigSc.currentDate.format(ConfigSc.dateFormat),
        day: date.date(),
        x,
        isPublicHoliday: CpspRef.cmp.publicHolidayDates.includes(date.format(ConfigSc.dateFormat)),
        isPlanedAbsence: CpspRef.cmp.planedAbsences.some(pa =>date.isBetween(pa.m_startDate, pa.m_endDate, undefined, "[]"))
      });

      x += ConfigSc.cellWidth;
      date.add(1, "days");
      // + 1 because date.month() is month index
      if (month !== (date.month() + 1)) break;
    }
    return days;
  }

  private isWeekend(date: moment.Moment) {
    const dayName = date.format("dddd");
    const day = CpspRef.cmp.workDays.find(day => day.name === dayName);
    return day.type === "0";
  }

  private generateAllDisplayMonths() {
    let startDate = moment(CpspRef.cmp.project.StartDate, ConfigSc.dateFormat);
    let date = moment(`${ConfigSc.currentDate.year()}-${ConfigSc.currentDate.month() + 1}-01`, ConfigSc.dateFormat);
    let numberOfProjectMonths = ConfigSc.currentDate.diff(startDate, "months");

    for (let i = 0; i < ConfigSc.numberOfPreviousMonthsToShow + numberOfProjectMonths; i++) {
      date.subtract(1, "month");
      this.allDisplayMonths.unshift({
        year: date.year(),
        monthName: date.format("MMMM"),
        month: date.month() + 1,
        days: this.getDaysOfMonth(date.year(), date.month() + 1),
        x: 0
      });
    }

    // if project start in future
    if(startDate.diff(ConfigSc.currentDate,"months") > ConfigSc.numberOfPreviousMonthsToShow){
      date = moment(startDate.add(ConfigSc.numberOfPreviousMonthsToShow * -1,"months"));
    } else {
      date = moment(`${ConfigSc.currentDate.year()}-${ConfigSc.currentDate.month() + 1}-01`, ConfigSc.dateFormat);
    }

    // date = moment(`${ConfigSc.currentDate.year()}-${ConfigSc.currentDate.month() + 1}-01`, ConfigSc.dateFormat);


    const numberOfNextMonthsToShow = this.findNumberOfNextMonthsToShow();

    for (let i = 0; i < numberOfNextMonthsToShow + 1; i++) {
      this.allDisplayMonths.push({
        year: date.year(),
        monthName: date.format("MMMM"),
        month: date.month() + 1,
        days: this.getDaysOfMonth(date.year(), date.month() + 1),
        x: 0
      });
      date.add(1, "month");
    }

    this.setXPositionForAllDisplayMonths();
  }

  findNumberOfNextMonthsToShow() {
    let maxEndDate = "";
    // CpspRef.cmp.allDisplayProjects.forEach(project => {
    //     if (project.endDate > maxEndDate) maxEndDate = project.endDate;
    // });
    //for counting latest end date for showing correct number of months in grid
    if (CpspRef.cmp.project) {
      if (ConfigSc.latestEndDate != null)
        maxEndDate = CpspRef.cmp.getSomeDate(moment(ConfigSc.latestEndDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat), moment(CpspRef.cmp.project.EndDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat), "after");
      else maxEndDate = CpspRef.cmp.project.EndDate;
      ConfigSc.latestEndDate = maxEndDate;
    }
    const diff = moment(maxEndDate, ConfigSc.dateFormat).diff(ConfigSc.currentDate, "months", true);
    let numberMonths = Math.max(Math.ceil(diff), 1);
    //|| CpspRef.cmp.scaled
    if (diff < -0.04) return numberMonths;
    return numberMonths + 2;
  }

  addAllDisplayMonthsThatFitContainerView() {
    for (let i = this.currentDisplayMonthIndex, n = this.getLastMonthIndexToFitInContainerView(); i <= n; i++) {
      this.addDisplayMonthToDaysContainer(i);
    }
  }

  getLastMonthIndexToFitInContainerView() {
    if (this.allDisplayMonths.length < 1) return 0;
    const maxMonthsToDisplayThatFitContainer = Math.ceil((this.getWidth() / (ConfigSc.cellWidth * CpspRef.cmp.pixelRation)));
    const n = this.allDisplayMonths.length;

    let monthsDisplayed = 0;

    for (let i = this.currentDisplayMonthIndex; i < n; i++) {
      if (monthsDisplayed >= maxMonthsToDisplayThatFitContainer) return i;
      monthsDisplayed += this.allDisplayMonths[i].days.length ;
    }
    return n;
  }

  getNumberOfAllDisplayDays() {
    return this.allDisplayMonths.reduce((total, month) => total += month.days.length, 0);
  }

  getXOffsetPositionsOfWeekends() {
    const positions = [];
    const secondWeekOfMonth = this.allDisplayMonths[0].days[7].week;
    this.allDisplayMonths[0].days.forEach(day => {
      if (day.week !== secondWeekOfMonth) return;
      if (day.isWeekend) positions.push(this.allDisplayMonths[0].x + day.x - (ConfigSc.cellWidth * 7));
    });
    return positions;
  }

  findMonthIndexByXPosition(x: number) {
    const index = this.allDisplayMonths.findIndex(m => (m.x * CpspRef.cmp.pixelRation) > x);
    return index >= 1 ? index - 1 : 0;
  }

  findDateByXPosition(x: number) {
    const indexMonth = this.findMonthIndexByXPosition(x);
    const xMonth = this.allDisplayMonths.at(indexMonth).x;
    let day = this.allDisplayMonths.at(indexMonth).days.find( day => (day.x + xMonth) * CpspRef.cmp.pixelRation > x);
    let lastday = false;
    if(day == undefined){
      day = this.allDisplayMonths.at(indexMonth).days.at(-1)
      lastday = true;
    }
    return new Date(this.allDisplayMonths.at(indexMonth).year, this.allDisplayMonths.at(indexMonth).month - 1, lastday ? day.day : day.day - 1)
  }

  findXPositionOfDay(date: Date) {
    const monthOfDate = this.allDisplayMonths.find(m => m.year === date.getFullYear() && m.month === date.getMonth() + 1);
    if (monthOfDate === undefined) return 0;
    return monthOfDate.x + monthOfDate.days.find(day => day.day === date.getDate()).x;
  }

}
