import * as moment from "moment";

const weekTranslation = sessionStorage.getItem('lang') == 'sw' ? 'Vecka' : 'Week';

export class Configuration {
    static cellHeight = 25;
    static cellWidth = 15;

    static dateFormat = 'YYYY-MM-DD';
    static timeFormat = 'HH:mm';
    static datepickerFormat = `YYYY-MM-DD [${weekTranslation}] W`;
    static dateWeekFormat = 'GGGG-WW'; // <week year>-<double digit week>
    static currentDate = moment();

    static scrollbarSize = 15;

    static numberOfPreviousMonthsToShow = 3;

    static sidebarSize = 67;
    static readonly toolboxSize = 100;
    static readonly topSectionSize = Configuration.cellWidth * 3;
    static sideCanvasSize = parseFloat(window.localStorage.getItem('resource_planning_side_menu_width')) || 400;
    static sideSectionRightBorderWidth = 3;
    static bottomSectionSize = 80;

    static isInEditMode = false;
}
