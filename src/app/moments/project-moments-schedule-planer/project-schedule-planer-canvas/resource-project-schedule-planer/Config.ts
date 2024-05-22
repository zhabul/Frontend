import * as moment from "moment";

const weekTranslation = sessionStorage.getItem('lang') == 'sw' ? 'Vecka' : 'Week';

export class ConfigSc {
  static dateFormat = 'YYYY-MM-DD';
  static timeFormat = 'HH:mm';
  static datepickerFormat = `YYYY-MM-DD [${weekTranslation}] W`;
  static dateWeekFormat = 'GGGG-WW'; // <week year>-<double digit week>
  static dateRevFormat = 'GG-MM-DD';
  static currentDate = moment();
  static cellHeight = 25;
  static cellWidth = 15;
  static appSidePadding=25;

  static scrollbarSize = 15;
  static wheelScrollSensitivity = 20; // lower is faster
  static scrollbarScrollingThreshold = 25 // higher is faster;

  static numberOfPreviousMonthsToShow = 3; // if you change this you also need to change $startDateOfCalendar in ProjectsModel -> getProjectsForPlanning

  static latestEndDate = null;
  static earlierStartDate = null;

  static sidebarSize = 65;
  static readonly toolboxSize = 77;
  static readonly topSectionSize = ConfigSc.cellWidth * 3;
  static sideCanvasSize = parseFloat(window.localStorage.getItem('resource_planning_side_menu_width')) || 645;
  static sideSectionRightBorderWidth = 3;
  static bottomSectionSize = 107;

  static isInEditMode = false;
  static firstMomentBoxSelectedPositionDelta = 0;
  static boxHeight = 0;
  static deltaMovementBetweenBoxes = 0;

  static timePlanHeader = "Activity";
}
