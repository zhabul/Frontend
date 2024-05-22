import * as moment from "moment";

const weekTranslation =
  sessionStorage.getItem("lang") == "sw" ? "Vecka" : "Week";

export class Config {
  static dateFormat = "YYYY-MM-DD";
  static timeFormat = "HH:mm";
  static datepickerFormat = `YYYY-MM-DD [${weekTranslation}] W`;
  static dateWeekFormat = "GGGG-WW"; // <week year>-<double digit week>
  static currentDate = moment();
  static cellHeight = 25;
  static cellWidth = 20;

  static scrollbarSize = 15;
  static wheelScrollSensitivity = 20; // lower is faster
  static scrollbarScrollingThreshold = 25; // higher is faster;

  static numberOfPreviousMonthsToShow = 3; // if you change this you also need to change $startDateOfCalendar in ProjectsModel -> getProjectsForPlanning

  static sidebarSize = 67;
  static readonly toolboxSize = 100;
  static readonly topSectionSize = Config.cellWidth * 3;
  static sideCanvasSize =
    parseFloat(
      window.localStorage.getItem("resource_planning_side_menu_width")
    ) || 400;
  static sideSectionRightBorderWidth = 3;
  static bottomSectionSize = 80;

  static isInEditMode = false;
  static firstUserBoxSelectedPositionDelta = 0;
  static boxHeight = 0;
  static deltaMovementBetweenBoxes = 0;
}
