import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import * as momentM from 'moment';
import { ToastrService } from 'ngx-toastr';
import {Subscription } from 'rxjs';
import { BezierCurve } from 'src/app/canvas-ui/BezierCurve';
import historySchedulePlaner from 'src/app/canvas-ui/history/historySchedulePlaner';
import { GeneralsService } from 'src/app/core/services/generals.service';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { ProjectsService } from "src/app/core/services/projects.service";
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { Column } from './resource-project-schedule-planer/components/ProjectMoments/ProjectMomentsTableHead/Column';
import { ProjectMomentsTableHeadColumn } from './resource-project-schedule-planer/components/ProjectMoments/ProjectMomentsTableHead/ProjectMomentsTableHeadColumn';
import * as printJS from "print-js";
import { ConfigSc } from './resource-project-schedule-planer/Config';
import { CpspRef } from './resource-project-schedule-planer/CpspRef';
import { Activity } from './resource-project-schedule-planer/models/Activity';
import { DateSegmentData } from './resource-project-schedule-planer/models/DateSegmentData';
import { Moment } from './resource-project-schedule-planer/models/Moment';
import { MomentStyles } from './resource-project-schedule-planer/models/MomentStyles';
import { PlannedAbsence } from './resource-project-schedule-planer/models/PlannedAbsence';
import { Project } from './resource-project-schedule-planer/models/Project';
import { ResourceWeekDataForEditing } from './resource-project-schedule-planer/models/ResourecWeekDataForEditing';
import { ProjectSchedulePlanerApp } from './resource-project-schedule-planer/ProjectSchedulePlanerApp';
// import { jsPDF } from "jspdf";
import * as d3 from 'd3';

declare var $;

@Component({
  selector: "app-project-schedule-planer-canvas",
  templateUrl: "./project-schedule-planer-canvas.component.html",
  styleUrls: ["./project-schedule-planer-canvas.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSchedulePlanerCanvasComponent implements OnInit {

//   @HostListener('copy', ['$event'])
//   onCopy(e: ClipboardEvent) {
//   if(CpspRef.cmp.columnValueInput.style.display == "block"){
//         CpspRef.cmp.selectedColumns = [];
//         CpspRef.cmp.selectedColumnsForCopyPaste = [];
//         CpspRef.cmp.selectedMomentsForStyleChange = []
//         this.copyPress = false;
//         return;
//       }
//       e.preventDefault();
//       this.copyPress = true;
//       localStorage.setItem("moments", JSON.stringify([]));
//       if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
//         CpspRef.cmp.selectedMomentsForCopyPaste =
//           CpspRef.cmp.selectedMomentsForStyleChange;
//         localStorage.setItem("moments", JSON.stringify(CpspRef.cmp.selectedMomentsForCopyPaste));
//         CpspRef.cmp.selectedColumns = [];
//         CpspRef.cmp.selectedColumnsForCopyPaste = [];
//       } else if(CpspRef.cmp.selectedColumns.length > 0){
//         CpspRef.cmp.selectedColumnsForCopyPaste = CpspRef.cmp.deepCopy(CpspRef.cmp.selectedColumns);
//         this.selectedMomentsForCopyPaste = this.deepCopy(this.projectSchedulePlanerApp.projectMomentsContainer.selectedMoments());
//       }
//       // if (CpspRef.cmp.planInput.style.display == "block")
//       //   CpspRef.cmp.copyText = CpspRef.cmp.planInput.value;
//       // else if (CpspRef.cmp.columnValueInput.style.display == "block") {
//       //   CpspRef.cmp.copyText = CpspRef.cmp.inputValue;
//       // } else if (CpspRef.cmp.newColumnValueInput.style.display == "block") {
//       //   CpspRef.cmp.copyText = CpspRef.cmp.newColumnValueInput.value;
//       // }
// }

// @HostListener('paste', ['$event'])
// onPaste(e: ClipboardEvent) {
//   let clipboardData = e.clipboardData //|| window.clipboardData;
//   // if(this.copyPress && clipboardData.getData('text') === this.copyText)
//   // let pastedText = clipboardData.getData('text');
//   // this.copyText = pastedText;
//   if(CpspRef.cmp.columnValueInput.style.display == "block" &&
//   (!this.copyPress || (this.copyPress && this.copyText !== "" && clipboardData.getData('text') !== this.copyText))
//       ){
//         this.copyPress = false;
//         this.copyText = clipboardData.getData('text');
//         return;
//       }
//       this.copyText = clipboardData.getData('text');
//       e.preventDefault();
//       if(CpspRef.cmp.selectedColumnsForCopyPaste.length > 0){
//         CpspRef.cmp.hideColumnValueInput();
//         CpspRef.cmp.hideResourceWeekInput();
//         CpspRef.cmp.hidePlanInput();
//         CpspRef.cmp.hideInput = true;
//         CpspRef.cmp.executeCopyPasteColumns();
//       }
//       // else if (
//       //   CpspRef.cmp.selectedMomentsForCopyPaste.length == 1 &&
//       //   (CpspRef.cmp.planInput.style.display == "block" ||
//       //     CpspRef.cmp.columnValueInput.style.display == "block" ||
//       //     CpspRef.cmp.newColumnValueInput.style.display == "block")
//       // )
//       //   CpspRef.cmp.executeCopyPaste(false);
//       // else
//       else if(CpspRef.cmp.selectedMomentsForCopyPaste.length > 0){
//         CpspRef.cmp.constCopy++;
//         CpspRef.cmp.selectedMomentsForStyleChange = JSON.parse(localStorage.getItem("moments"));
//       CpspRef.cmp.selectedMomentsForCopyPaste =
//           CpspRef.cmp.selectedMomentsForStyleChange;
//         CpspRef.cmp.executeCopyPaste(true);
//       }
//   }
  public projectSchedulePlanerApp: ProjectSchedulePlanerApp;

  public idParentGroups = [];
  public idMoments = [];
  public maxResource = 0;
  public tabPress = false;
  public detailsBlurWithEnter = false;
  public colorList = [
    { key: "flame", value: "#000000", friendlyName: "Flame" },
    { key: "orange", value: "#e60000", friendlyName: "Orange" },
    { key: "infrared", value: "#ff9900", friendlyName: "Infrared" },
    { key: "male", value: "#ffff00", friendlyName: "Male Color" },
    { key: "female", value: "#008a00", friendlyName: "Female Color" },
    { key: "paleyellow", value: "#0066cc", friendlyName: "Pale Yellow" },
    { key: "gargoylegas", value: "#9933ff", friendlyName: "Gargoyle Gas" },

    { key: "androidgreen", value: "#ffffff", friendlyName: "Android Green" },
    {
      key: "carribeangreen",
      value: "#facccc",
      friendlyName: "Carribean Green",
    },
    { key: "bluejeans", value: "#ffebcc", friendlyName: "Blue Jeans" },
    {
      key: "cyancornflower",
      value: "#ffffcc",
      friendlyName: "Cyan Cornflower",
    },
    { key: "warmblack", value: "#cce8cc", friendlyName: "Warm Black" },
    { key: "flame1", value: "#cce0f5", friendlyName: "Flame" },
    { key: "orange1", value: "#ebd6ff", friendlyName: "Orange" },

    { key: "infrared1", value: "#bbbbbb", friendlyName: "Infrared" },
    { key: "male1", value: "#f06666", friendlyName: "Male Color" },
    { key: "female1", value: "#ffc266", friendlyName: "Female Color" },
    { key: "paleyellow1", value: "#ffff66", friendlyName: "Pale Yellow" },
    { key: "gargoylegas1", value: "#66b966", friendlyName: "Gargoyle Gas" },
    { key: "androidgreen1", value: "#66a3e0", friendlyName: "Android Green" },
    {
      key: "carribeangreen1",
      value: "#c285ff",
      friendlyName: "Carribean Green",
    },

    { key: "bluejeans1", value: "#888888", friendlyName: "Blue Jeans" },
    {
      key: "cyancornflower1",
      value: "#a10000",
      friendlyName: "Cyan Cornflower",
    },
    { key: "warmblack1", value: "#b26b00", friendlyName: "Warm Black" },
    { key: "flame2", value: "#b2b200", friendlyName: "Flame" },
    { key: "orange2", value: "#006100", friendlyName: "Orange" },
    { key: "infrared2", value: "#0047b2", friendlyName: "Infrared" },
    { key: "male2", value: "#6b24b2", friendlyName: "Male Color" },

    { key: "female2", value: "#444444", friendlyName: "Female Color" },
    { key: "paleyellow2", value: "#5c0000", friendlyName: "Pale Yellow" },
    { key: "gargoylegas2", value: "#663d00", friendlyName: "Gargoyle Gas" },
    { key: "androidgreen2", value: "#666600", friendlyName: "Android Green" },
    {
      key: "carribeangreen2",
      value: "#003700",
      friendlyName: "Carribean Green",
    },
    { key: "bluejeans2", value: "#002966", friendlyName: "Blue Jeans" },
    {
      key: "cyancornflower2",
      value: "#3d1466",
      friendlyName: "Cyan Cornflower",
    },
  ];
  selectedOption;

  public notes = ["flag-yellow", "flag-orange", "flag-reds", "flag-redd", "flag-cyan", "flag-blue", "flag-pink", "flag-purple", "flag-greenl", "flag-greend", "", "" ];
  public monsters = ["monster-1", "monster-2", "monster-3", "monster-4",
                      "monster-5", "monster-6", "monster-7", "monster-8",
                      "monster-9", "monster-10", "monster-11", "monster-12",
                      "monster-13", "monster-14", "monster-15", "monster-16",
                      "monster-17","monster-24","",""];

  public scaled = false;
  public presetValues: string[] = [];
  public copyText: string = "";
  public numberContainer = 0;

  public rowNumber = 0;
  public counterRowNumber = 0;

  public loading = false;
  public hideInput = false;

  public dropdownSettings = {};

  public allColumns: Column[] = [];
  public visibleColumns: Column[] = [];
  public publicHolidayDates: String[] = [];

  public selectedWeeksToShowWorkers = [
    ConfigSc.currentDate.format(ConfigSc.dateWeekFormat),
  ];

  public resourcesWorkers = [];
  public workDays = [];
  public enabledDatesInDatePicker: string[] = [];

  public searchValue = "";
  public inputValue = "";
  public timer;
  public searchInputElement;
  public checked = false;

  public activityIndex;
  public planIndex;
  public dateSegmentIndex;
  public activityY;

  public splitDateSegmentOnClick = false;

  leftColor: string = "749px !imporrtant";

  //public datepicker2: any;

  public changeBackgroundColorInputValue = "#fff";
  public changeBackgroundTapeColorInputValue = "#B6B1B1";
  public changeTextColorInputValue = "#000";
  public changeFontSizeInputValue = 11;
  public changeFontWeightInputValue = false;
  public changeFontStyleInputValue = false;
  public changeFontDecorationInputValue = false;
  public changeFontFamilyInputValue = "Calibri";

  public changeHoursOnProject = 8;

  public project: any;
  public projectWorkingHoursPerDay: any[];
  public workingHours: number;
  public schedulePlanState: any[] = [];
  public moments: any;
  public lines: any[] = [];
  public arbitraryDates: any[] = [];
  public defaultMoments: any[] = [];
  public currentDate: any;
  public Date: any;
  public fullMonths: any;
  public months: any;
  public weekDays: any;
  public daysInMonth: any;
  public daysInMonthArray: any;
  public currentMonthIndex: any;
  public currentMonth: any;
  public fullMonth: any;
  public currentYear: any;
  public currentDay: any;
  public day: any;
  public currentDayNumber: any;
  public calendar: any[] = [];
  public lineConnections = [];
  public moveTape;
  public chainPlus;

  public planedAbsences: PlannedAbsence[] = [];
  public plannedVacationModalShowing = false;
  public addUserModalShowing = false;

  public startDateDatepicker;
  public endDateDatepicker;
  public smallScreen=false;

  public selectedDateSegmentEndDate = ConfigSc.currentDate.format(
    ConfigSc.datepickerFormat
  );
  public selectedDateSegmentStartDate = ConfigSc.currentDate.format(
    ConfigSc.datepickerFormat
  );

  public selectedVacationDateName: string;
  public selectedVacationDateStartDate = ConfigSc.currentDate.format(
    ConfigSc.datepickerFormat
  );
  public selectedVacationDateEndDate = ConfigSc.currentDate.format(
    ConfigSc.datepickerFormat
  );
  public selectedVacationDateChanged = false;

  public allDisplayProjectsOriginal: Project[] = [];
  public allDisplayProjects: Project[] = [];

  public addUserModalBox: HTMLElement;
  public selectedUsers = [];
  public selectedTableHeadColumnForEditing: ProjectMomentsTableHeadColumn;
  public selectedResourceWeekDataForEditing: ResourceWeekDataForEditing;
  public selectedColumnForEditing: Column;
  public resourceWeekInput: HTMLInputElement;
  public plannedVacationModalBox: HTMLElement;
  public columnInput: HTMLInputElement;
  public columnValueInput: HTMLInputElement;
  public newColumnValueInput: HTMLInputElement;
  public noteInput: HTMLInputElement;
  public planInput: HTMLInputElement;
  public columnNumberOfDaysInput: HTMLInputElement;
  public columnStartDateInput: HTMLInputElement;
  public columnEndDateInput: HTMLInputElement;
  public blurByEnterKey = false;

  public selectedMomentsForStyleChange = [];
  public selectedMomentsForCopyPaste = [];

  public selectedProject: Project = null;
  public copySelectedProject: Project = null;
  public baseSelectedProject: Project = null;

  public hidesX = true;
  public hideXSrch = true;
  public splitTape = false;
  public splitTapeArrow;

  public tapeId;

  public showCal = false;
  public deleteDetails = false;

  public revisions: any = [];
  public getting_revisions = false;
  public activeRevisions;
  public activeColumns;
  public activeConnections;
  public property_index;
  public revImages: any = [];

  public listOfChangedFunctions = [];
  public listOfPreviousFunctions = [];
  public type: any;
  public projectid: any;

  public tapeMomActId: number;
  public rowClickedY: number;

  private lastSort: number;

  public needNewApp = false;
  public gridSliderY = 0;
  public gridSliderX = 0;

  public constCopy = 0;
  public newRowCount = 1;
  public newOldIds = [];
  public indexOfVisibleColumn;

  public fontFamilyDiv: HTMLInputElement;
  public fontSizeDiv: HTMLInputElement;
  public textBoldDiv: HTMLInputElement;
  public textItalicDiv: HTMLInputElement;
  public textUnderlineDiv: HTMLInputElement;
  public backgroundColorDiv: HTMLInputElement;
  public backgroundColorInput: HTMLInputElement;
  public textColorDiv: HTMLInputElement;
  public divTapeColor: HTMLInputElement;
  // public hoursDiv: HTMLInputElement;
  public routeChange: Subscription;

  //dropdown for send revisions
  public buttonToggleSend = false;
  public buttonToggleDots = false;
  public rowNumberHover = false;
  public rowNumberSelecting = false;
  public client_workers = [];
  public contacts = [];
  public buttonName = "Project Management";
  public pixelRation = 1;
  public selectedContainerHeight = 0;

  public selectedColumns = [];
  public selectedColumnsForCopyPaste = [];

  private toCopyFun;
  private toPasteFun;

  public isInEditMode;
  public lockedRevision = true;

  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef;

  constructor(
    private router: Router,
    private scheduleService: ScheduleService,
    private generalsService: GeneralsService,
    private projectsService: ProjectsService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    public ref: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.presetValues = this.getColorValues();
    if(localStorage.getItem("copyPress") == null)
      localStorage.setItem("copyPress", "0");
    if(localStorage.getItem("copyText") == null)
      localStorage.setItem("copyText", "");
  //  addEventListener("unload", (event) => {
  //     this.scheduleService.deleteSchedulePlanAndGroup(
  //       this.idMoments,
  //       this.idParentGroups
  //     );
  //   });

  this.toCopyFun = (e : ClipboardEvent) =>{
    if(CpspRef.cmp.columnValueInput.style.display == "block"){
      CpspRef.cmp.selectedColumns = [];
      CpspRef.cmp.selectedColumnsForCopyPaste = [];
      CpspRef.cmp.selectedMomentsForStyleChange = []
      localStorage.setItem("moments", JSON.stringify([]));
      localStorage.setItem("copyText", "");
      localStorage.setItem("copyPress", "0");
      return;
    }
    e.preventDefault();
    e.clipboardData.setData('text', "copyFromAnotherTidsplan");
    // e.clipboardData.items.add(JSON.stringify(CpspRef.cmp.selectedMomentsForCopyPaste),"json")
    localStorage.setItem("copyPress", "1");
    localStorage.setItem("moments", JSON.stringify([]));
    if (CpspRef.cmp.selectedMomentsForStyleChange.length > 0) {
      CpspRef.cmp.selectedColumns = [];
      CpspRef.cmp.selectedColumnsForCopyPaste = [];
      CpspRef.cmp.selectedMomentsForCopyPaste =
        this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getAllSelectedMoments();
      localStorage.setItem("moments", JSON.stringify(CpspRef.cmp.selectedMomentsForCopyPaste));
      CpspRef.cmp.selectedColumns = [];
      CpspRef.cmp.selectedColumnsForCopyPaste = [];
    } else if(CpspRef.cmp.selectedColumns.length > 0){
      CpspRef.cmp.selectedColumnsForCopyPaste = CpspRef.cmp.deepCopy(CpspRef.cmp.selectedColumns);
      // this.selectedMomentsForCopyPaste = this.deepCopy(this.projectSchedulePlanerApp.projectMomentsContainer.selectedMoments());
      CpspRef.cmp.selectedMomentsForCopyPaste =
        this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getAllSelectedMoments();
    }
    // if (CpspRef.cmp.planInput.style.display == "block")
    //   CpspRef.cmp.copyText = CpspRef.cmp.planInput.value;
    // else if (CpspRef.cmp.columnValueInput.style.display == "block") {
    //   CpspRef.cmp.copyText = CpspRef.cmp.inputValue;
    // } else if (CpspRef.cmp.newColumnValueInput.style.display == "block") {
    //   CpspRef.cmp.copyText = CpspRef.cmp.newColumnValueInput.value;
    // }
  }

  this.toPasteFun = (e : ClipboardEvent) => {
    let clipboardData = e.clipboardData //|| window.clipboardData;
// if(this.copyPress && clipboardData.getData('text') === this.copyText)
// let pastedText = clipboardData.getData('text');
// this.copyText = pastedText;
// this.copyPress , this.copyText !== "" , clipboardData.getData('text') !== this.copyText)
if(CpspRef.cmp.columnValueInput.style.display == "block" &&
// (!copyPress || (copyPress && clipboardData.getData('text') !== copyText))
clipboardData.getData('text') !== "copyFromAnotherTidsplan"
    ){
      localStorage.setItem("copyPress", "0");
      localStorage.setItem("copyText", clipboardData.getData('text'));
      return;
    }
    // localStorage.setItem("copyText", clipboardData.getData('text'));
    // localStorage.setItem("copyText", "");
    e.preventDefault();
    CpspRef.cmp.selectedMomentsForCopyPaste = JSON.parse(localStorage.getItem("moments"));
    if(CpspRef.cmp.selectedColumnsForCopyPaste.length > 0){
      CpspRef.cmp.hideColumnValueInput();
      CpspRef.cmp.hideResourceWeekInput();
      CpspRef.cmp.hidePlanInput();
      CpspRef.cmp.hideInput = true;
      this.selectedMomentsForCopyPaste = CpspRef.cmp.selectedMomentsForStyleChange;
      // CpspRef.cmp.executeCopyPasteColumns();
      CpspRef.cmp.executeCopyPaste(true);
    }
    // else if (
    //   CpspRef.cmp.selectedMomentsForCopyPaste.length == 1 &&
    //   (CpspRef.cmp.planInput.style.display == "block" ||
    //     CpspRef.cmp.columnValueInput.style.display == "block" ||
    //     CpspRef.cmp.newColumnValueInput.style.display == "block")
    // )
    //   CpspRef.cmp.executeCopyPaste(false);
    // else
    else if(CpspRef.cmp.selectedMomentsForCopyPaste.length > 0){
      localStorage.setItem("copyText", "");
      CpspRef.cmp.constCopy++;
      CpspRef.cmp.selectedMomentsForStyleChange = JSON.parse(localStorage.getItem("moments"));
    CpspRef.cmp.selectedMomentsForCopyPaste =
        CpspRef.cmp.selectedMomentsForStyleChange;
      CpspRef.cmp.executeCopyPaste(true);
    }
  }

  document.addEventListener("copy", this.toCopyFun)

  document.addEventListener("paste", this.toPasteFun)
  }

  canDeactivate() {
    if (historySchedulePlaner.getRequestQueue().length > 0) {
      return false;
    } else {
      return true;
    }
  }

  getColorValues() {
    return this.colorList.map((c) => c.value);
  }

  async ngOnInit() {
    const allImages = document.getElementsByClassName("canvas-img");
    const lastImage: any = allImages[allImages.length - 1];

    this.route.queryParamMap.subscribe((params) => {
      this.type = params.get("type");
      this.projectid = params.get("projectId");
    });
    const userPermissions = JSON.parse(sessionStorage.getItem("userDetails"));
    ConfigSc.isInEditMode = userPermissions["create_project_Plan"] == 1;
    this.isInEditMode = ConfigSc.isInEditMode;


    this.planedAbsences = this.route.snapshot.data.planedScheduleAbsences.map(
      (x) => {
        x.m_startDate = moment(x.startDate, ConfigSc.dateFormat);
        x.m_endDate = moment(x.endDate, ConfigSc.dateFormat);
        return x;
      }
    );

    this.plannedVacationModalBox = document.getElementById(
      "planned-vacation-modal-box"
    );
    this.plannedVacationModalBox.style.left = `${
      window.innerWidth / 2 - this.plannedVacationModalBox.offsetWidth / 2
    }px`;
    this.plannedVacationModalBox.style.top = `${
      window.innerHeight / 2 - this.plannedVacationModalBox.offsetHeight / 2
    }px`;

    await (async () =>
      new Promise((resolve, _) => {
        lastImage.onload = async () => {
          this.dropdownSettings = {
            singleSelection: false,
            idField: "id",
            textField: "name",
            selectAllText: this.translate.instant("Select All"),
            unSelectAllText: this.translate.instant("Unselect All"),
            itemsShowLimit: 0,
            allowSearchFilter: true,
            noDataAvailablePlaceholderText:
              this.translate.instant("No data available"),
            searchPlaceholderText: this.translate.instant("Search"),
          };
          // removing margin left on parent element because it messes the canvas layouts
          (
            document.getElementsByClassName("ml-50")[0] as HTMLElement
          ).style.marginLeft = "0px";

          this.allColumns = this.route.snapshot.data["columnsScedule"] || [];
          this.allColumns.find((col) => col.key == "finished").isVisible =
            false;

          this.visibleColumns = this.allColumns.filter(
            (column) => column.isVisible
          );

          this.publicHolidayDates = Object.values(
            this.route.snapshot.data.publicHolidayDates.data
          );
          const workDays = await this.generalsService.getWorkWeek();
          this.workDays = workDays;

          this.columnInput = document.getElementById(
            "columnEditInput"
          ) as HTMLInputElement;
          //function for loading data from database
          await this.loadActivitiesAndPlans();
          if(ConfigSc.latestEndDate == null){
            ConfigSc.latestEndDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            // ConfigSc.earlierStartDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
          }

          this.projectSchedulePlanerApp = new ProjectSchedulePlanerApp(this);
          this.selectedProject = this.deepCopy<Project>(
            this.copySelectedProject
          );

          this.lastSort = this.copySelectedProject.activities.length;

          this.columnInput = document.getElementById(
            "columnEditInput"
          ) as HTMLInputElement;
          this.columnValueInput = document.getElementById(
            "columnValueEditInput"
          ) as HTMLInputElement;
          this.newColumnValueInput = document.getElementById(
            "newColumnValueEditInput"
          ) as HTMLInputElement;
          this.noteInput = document.getElementById(
            "noteInput"
          ) as HTMLInputElement;
          this.planInput = document.getElementById(
            "planInput"
          ) as HTMLInputElement;
          this.columnNumberOfDaysInput = document.getElementById(
            "columnNumberOfDaysInput"
          ) as HTMLInputElement;
          this.columnStartDateInput = document.getElementById(
            "columnStartDateInput"
          ) as HTMLInputElement;
          this.columnEndDateInput = document.getElementById(
            "columnEndDateInput"
          ) as HTMLInputElement;
          this.resourceWeekInput = document.getElementById(
            "resourceWeekEditInput"
          ) as HTMLInputElement;


          //this.initializeDatePickers();
          historySchedulePlaner.addToQueue();
          historySchedulePlaner.initializeKeyShortcuts();
          historySchedulePlaner.initializeBeforeunloadEvent();

          this.columnValueInput.onmousedown = (e) => {
            this.columnValueInput.onmousemove = (e) => {
              // historySchedulePlaner.initializeKeyShortcuts();
              this.columnValueInput.onmousemove = (e2 =>{
                document.getElementById("columnValueEditInput").style.pointerEvents = "none"
              })
            };
            //change Mouse

            this.columnValueInput.onmouseup = (e3) => {
              if (e.clientX == e3.clientX) {
                this.deleteDetails = false;
                // document.removeEventListener(
                //   "keydown",
                //   historySchedulePlaner.checkPressedKey
                // );
                document.getElementById(
                  "columnValueEditInput"
                ).style.pointerEvents = "auto";
              }
            };
          };

          this.fontFamilyDiv = document.getElementById(
            "font-family-div"
          ) as HTMLInputElement;
          this.fontSizeDiv = document.getElementById(
            "font-size-div"
          ) as HTMLInputElement;
          this.textBoldDiv = document.getElementById(
            "text-bold-div"
          ) as HTMLInputElement;
          this.textItalicDiv = document.getElementById(
            "text-italic-div"
          ) as HTMLInputElement;
          this.textUnderlineDiv = document.getElementById(
            "text-underline-div"
          ) as HTMLInputElement;
          this.backgroundColorDiv = document.getElementById(
            "background-color-div"
          ) as HTMLInputElement;
          this.textColorDiv = document.getElementById(
            "text-color-div"
          ) as HTMLInputElement;
          this.divTapeColor = document.getElementById(
            "div-tape-color"
          ) as HTMLInputElement;
          // this.hoursDiv = document.getElementById(
          //   "hours-div"
          // ) as HTMLInputElement;

          const language = sessionStorage.getItem("lang");
          /*const datepickerOptions = {
              format: "yyyy-mm-dd",
              calendarWeeks: true,
              autoclose: true,
              language: language,
              currentWeek: true,
              todayHighlight: true,
              currentWeekTransl: language === "en" ? "Week" : "Vecka",
              currentWeekSplitChar: "-",
              weekStart: 1
            };*/
          const datepickerOptions = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: language,
            todayHighlight: true,
            currentWeek: true,
            showWeek: true,
            currentWeekTransl: this.translate.instant("Week"),
            currentWeekSplitChar: "-",
            weekStart: 1,
          };


          $("#columnStartDateInput")
            .datepicker(datepickerOptions)
            .on("changeDate", (e) => {
              //if(!this.showCal) return;
              this.hideColumnValueInput();



              var activity_i = this.selectedProject.activities.findIndex(
                (a) => a.id == this.activityIndex
              );
              var plan_i = this.selectedProject.activities[
                activity_i
              ].moments.findIndex((p) => p.id == this.planIndex);
              const m =
                this.selectedProject.activities[activity_i].moments[plan_i];
              // let first_change = false;

              // this.columnStartDateInput.value = moment(
              //   m!=undefined ? m.dateSegments[0].startDate : this.copySelectedProject.activities[activity_i].startDate,
              //   ConfigSc.dateFormat
              // ).format(ConfigSc.datepickerFormat)
              if (m != undefined && m.dateSegments[0].startDate == null) {
                m.dateSegments[0].startDate = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateFormat
                ).toString();
                m.dateSegments[0].startWeekDate = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateWeekFormat
                ).toString();
                m.dateSegments[0].startWorkDate = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateWeekFormat
                ).toString();
                m.dateSegments[0].endDate = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateFormat
                ).toString();
                m.dateSegments[0].endWeekDate = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateWeekFormat
                ).toString();
                m.start_date = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateFormat
                ).toString();
                m.end_date = moment(
                  ConfigSc.currentDate,
                  ConfigSc.dateFormat
                ).toString();
                m.dateSegments[0].numberOfDays = 0;
              } else if (
                this.selectedProject.activities[activity_i].startDate == null
              ) {
                this.selectedProject.activities[activity_i].startDate =
                  ConfigSc.currentDate.format(ConfigSc.dateFormat);
                this.copySelectedProject.activities[activity_i].startDate =
                  ConfigSc.currentDate.format(ConfigSc.dateFormat);
                this.selectedProject.activities[
                  activity_i
                ].dateSegments[0].startDate = ConfigSc.currentDate.format(
                  ConfigSc.dateFormat
                );
                this.selectedProject.activities[
                  activity_i
                ].dateSegments[0].startWeekDate = ConfigSc.currentDate.format(
                  ConfigSc.dateWeekFormat
                );
                // first_change = true;
                this.selectedProject.activities[activity_i].x =
                  this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                    new Date(ConfigSc.currentDate.format(ConfigSc.dateFormat))
                  );
                this.copySelectedProject.activities[activity_i].x = this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(ConfigSc.currentDate.format(ConfigSc.dateFormat)))
              }

            var newDate = e.target.value.split(" ")[0];

              var difference = moment(newDate, ConfigSc.dateFormat).diff(
                moment(
                  m != undefined
                    ? m.dateSegments[0].startDate
                    : this.copySelectedProject.activities[activity_i].dateSegments.at(0).startDate,
                  ConfigSc.dateFormat
                ),
                "days"
              );

              if(difference != 0)
              this.changeMomentsDate(difference);
              return;

              // if (difference === 0 && !first_change) return;
              // else if (difference < -36000 || difference > 36000) {
              //   newDate = moment(newDate, ConfigSc.dateFormat).add(
              //     100,
              //     "years"
              //   );
              //   difference = moment(newDate, ConfigSc.dateFormat).diff(
              //     moment(
              //       m != undefined
              //         ? m.dateSegments[0].startDate
              //         : this.copySelectedProject.activities[activity_i]
              //             .startDate,
              //       ConfigSc.dateFormat
              //     ),
              //     "days"
              //   );
              // } else if (Number.isNaN(difference)) difference = -1;

              // let needNewApp = false;
              // const dateSegment =
              //   m != undefined
              //     ? m.dateSegments[m.dateSegments.length - 1]
              //     : this.copySelectedProject.activities[activity_i]
              //         .dateSegments[0];
              // const startDateMoment = moment(
              //   m != undefined
              //     ? dateSegment.startDate
              //     : this.copySelectedProject.activities[activity_i].startDate
              // ).add(difference, "days");

              // if (
              //   m != undefined &&
              //   startDateMoment.format(ConfigSc.dateFormat) <
              //     this.selectedProject.activities[activity_i].startDate
              // ) {
              //   CpspRef.cmp.toastrMessage(
              //     "info",
              //     CpspRef.cmp
              //       .getTranslate()
              //       .instant("You can't move moment to start before activity!")
              //   );
              //   return;
              // }
              // if (m != undefined) {
              //   m.changed = true;
              //   const num_days = this.getBusinessDatesCount(
              //     m.start_date,
              //     m.end_date
              //   );
              //   if (startDateMoment.format(ConfigSc.dateFormat) > m.end_date)
              //     m.end_date = startDateMoment.format(ConfigSc.dateFormat);
              //   m.start_date = startDateMoment.format(ConfigSc.dateFormat);
              //   dateSegment.startDate = startDateMoment.format(
              //     ConfigSc.dateFormat
              //   );
              //   dateSegment.startWeekDate = startDateMoment.format(
              //     ConfigSc.dateWeekFormat
              //   );
              //   //dateSegment.numberOfDays += -1*difference;
              //   while (
              //     this.getBusinessDatesCount(m.start_date, m.end_date) !=
              //     num_days
              //   ) {
              //     m.end_date = moment(m.end_date)
              //       .add(difference > 0 ? 1 : -1, "days")
              //       .format(ConfigSc.dateFormat);
              //   }

              //   dateSegment.numberOfDays =
              //     moment(m.end_date).diff(moment(m.start_date), "days") + 1;
              //   dateSegment.endDate = m.end_date;
              //   dateSegment.startWorkDate = dateSegment.startDate;
              //   needNewApp = this.changeLatestEndDate(m.end_date)
              //   this.needNewApp = needNewApp;
              //   if (dateSegment.currentWorkDate < dateSegment.startDate) {
              //     dateSegment.currentWorkDate = dateSegment.startDate;
              //   }
              //   this.updateParent(
              //     this.selectedProject.activities[activity_i],
              //     m
              //   );
              // } else {
              //   this.selectedProject.activities[activity_i].changed = true;
              //   const num_days = this.getBusinessDatesCount(
              //     this.selectedProject.activities[activity_i].startDate,
              //     this.selectedProject.activities[activity_i].endDate
              //   );
              //   if (
              //     startDateMoment.format(ConfigSc.dateFormat) >
              //     this.selectedProject.activities[activity_i].endDate
              //   ) {
              //     this.selectedProject.activities[activity_i].endDate =
              //       startDateMoment.format(ConfigSc.dateFormat);
              //   }
              //   this.selectedProject.activities[activity_i].startDate =
              //     startDateMoment.format(ConfigSc.dateFormat);
              //   while (
              //     this.getBusinessDatesCount(
              //       this.selectedProject.activities[activity_i].startDate,
              //       this.selectedProject.activities[activity_i].endDate
              //     ) != num_days
              //   ) {
              //     this.selectedProject.activities[activity_i].endDate = moment(
              //       this.selectedProject.activities[activity_i].endDate
              //     )
              //       .add(difference > 0 ? 1 : -1, "days")
              //       .format(ConfigSc.dateFormat);
              //     this.copySelectedProject.activities[activity_i].endDate = moment(this.copySelectedProject.activities[activity_i].endDate).add(difference > 0 ? 1 : -1,"days").format(ConfigSc.dateFormat)
              //   }
              //   this.selectedProject.activities[activity_i].numberOfDays =
              //     moment(
              //       this.selectedProject.activities[activity_i].endDate,
              //       ConfigSc.dateFormat
              //     ).diff(
              //       moment(
              //         this.selectedProject.activities[activity_i].startDate,
              //         ConfigSc.dateFormat
              //       ),
              //       "days"
              //     ) + 1;
              //   this.selectedProject.activities[activity_i].x +=
              //     difference * ConfigSc.cellWidth;
              //   this.copySelectedProject.activities[activity_i].startDate=startDateMoment.format(ConfigSc.dateFormat);
              //   this.copySelectedProject.activities[activity_i].numberOfDays=moment(this.copySelectedProject.activities[activity_i].endDate,ConfigSc.dateFormat).diff(moment(this.copySelectedProject.activities[activity_i].startDate, ConfigSc.dateFormat), "days") + 1;
              //   this.selectedProject.activities[
              //     activity_i
              //   ].dateSegments[0].startWorkDate = startDateMoment.format(
              //     ConfigSc.dateFormat
              //   );
              //   this.selectedProject.activities[
              //     activity_i
              //   ].dateSegments[0].startDate = startDateMoment.format(
              //     ConfigSc.dateFormat
              //   );
              //   this.selectedProject.activities[
              //     activity_i
              //   ].dateSegments[0].startWeekDate = startDateMoment.format(
              //     ConfigSc.dateWeekFormat
              //   );
              //   this.selectedProject.activities[
              //     activity_i
              //   ].dateSegments[0].endDate =
              //     this.selectedProject.activities[activity_i].endDate;
              //   this.selectedProject.activities[activity_i].number_of_workers =
              //     Math.ceil(
              //       (10 *
              //         this.copySelectedProject.activities[activity_i].time) /
              //         (CpspRef.cmp.getBusinessDatesCount(
              //           this.copySelectedProject.activities[activity_i]
              //             .startDate,
              //           this.copySelectedProject.activities[activity_i].endDate
              //         ) *
              //           CpspRef.cmp.workingHours)
              //     ) / 10;
              //   this.copySelectedProject.activities[activity_i].dateSegments[0].startDate =startDateMoment.format(ConfigSc.dateFormat);
              //   this.copySelectedProject.activities[activity_i].dateSegments[0].startWeekDate = startDateMoment.format(ConfigSc.dateWeekFormat);
              //   this.copySelectedProject.activities[activity_i].x = this.selectedProject.activities[activity_i].x;

              //   if (
              //     this.selectedProject.activities[activity_i].dateSegments[0]
              //       .currentWorkDate <
              //     this.selectedProject.activities[activity_i].startDate
              //   ) {
              //     this.selectedProject.activities[
              //       activity_i
              //     ].dateSegments[0].currentWorkDate =
              //       this.selectedProject.activities[activity_i].startDate;
              //   }


              //   this.copySelectedProject.activities[activity_i] = this.deepCopy(
              //   this.selectedProject.activities[activity_i]
              //   );
              // }

              // // this.copySelectedProject.activities[activity_i] = this.deepCopy(
              // //   this.selectedProject.activities[activity_i]
              // // );
              // this.showCal = false;

              // historySchedulePlaner.addToQueue(
              //   () => true,
              //   () => true
              // );

              // if(!needNewApp){
              //   this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
              //   this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
              // }
              //this.ref.detectChanges();
            })
            .on(
              "blur",
              (ev) => (ev.target.value = this.columnStartDateInput.value)
            );

        $("#columnEndDateInput")
          .datepicker(datepickerOptions)
          .on("changeDate", (e) => {
            this.hideColumnValueInput();
            //if(!this.showCal) return;
            var activity_i = this.selectedProject.activities.findIndex(
              (a) => a.id == this.activityIndex
            );
            var plan_i = this.selectedProject.activities[
              activity_i
            ].moments.findIndex((p) => p.id == this.planIndex);
            const m =
              this.selectedProject.activities[activity_i].moments[plan_i];
            let first_change = false;

            if (m != undefined && m.dateSegments[0].endDate == null) {
              m.dateSegments[0].startDate = moment(
                ConfigSc.currentDate,
                ConfigSc.dateFormat
              ).toString();
              m.dateSegments[0].startWeekDate = moment(
                ConfigSc.currentDate,
                ConfigSc.dateWeekFormat
              ).toString();
              m.dateSegments[0].startWorkDate = moment(
                ConfigSc.currentDate,
                ConfigSc.dateWeekFormat
              ).toString();
              m.dateSegments[0].endDate = moment(
                ConfigSc.currentDate,
                ConfigSc.dateFormat
              ).toString();
              m.dateSegments[0].endWeekDate = moment(
                ConfigSc.currentDate,
                ConfigSc.dateWeekFormat
              ).toString();
              m.start_date = moment(
                ConfigSc.currentDate,
                ConfigSc.dateFormat
              ).toString();
              m.end_date = moment(
                ConfigSc.currentDate,
                ConfigSc.dateFormat
              ).toString();
              m.dateSegments[0].numberOfDays = 0;
            } else if (
              this.selectedProject.activities[activity_i].endDate == null
            ) {
              this.selectedProject.activities[activity_i].endDate =
                ConfigSc.currentDate.format(ConfigSc.dateFormat);
              this.copySelectedProject.activities[activity_i].endDate =
                ConfigSc.currentDate.format(ConfigSc.dateFormat);

              this.selectedProject.activities[
                activity_i
              ].dateSegments[0].endDate = ConfigSc.currentDate.format(
                ConfigSc.dateFormat
              );
              this.selectedProject.activities[
                activity_i
              ].dateSegments[0].endWeekDate = ConfigSc.currentDate.format(
                ConfigSc.dateWeekFormat
              );

              first_change = true;
            }
            var newDate = e.target.value.split(" ")[0];

              var difference = moment(newDate, ConfigSc.dateFormat).diff(
                moment(
                  m != undefined
                    ? m.dateSegments.at(-1).endDate
                    : this.copySelectedProject.activities[activity_i].dateSegments.at(-1).endDate,
                  ConfigSc.dateFormat
                ),
                "days"
              );

              if (difference === 0 && !first_change) return;
              else if (difference < -36000 || difference > 36000) {
                newDate = moment(newDate, ConfigSc.dateFormat).add(
                  100,
                  "years"
                );
                difference = moment(newDate, ConfigSc.dateFormat).diff(
                  moment(
                    m != undefined
                      ? m.dateSegments.at(-1).endDate
                      : this.copySelectedProject.activities[activity_i].endDate,
                    ConfigSc.dateFormat
                  ),
                  "days"
                );
              } else if (Number.isNaN(difference)) difference = 1;

              let needNewApp = false;
              const dateSegment =
                m != undefined
                  ? m.dateSegments.at(-1)
                  : this.selectedProject.activities[activity_i].dateSegments.at(-1);
              const endDateMoment = moment(
                m != undefined
                  ? dateSegment.endDate
                  : this.copySelectedProject.activities[activity_i].dateSegments.at(-1).endDate
              ).add(difference, "days");

              if (
                (m != undefined &&
                  endDateMoment.format(ConfigSc.dateFormat) < m.start_date) ||
                endDateMoment.format(ConfigSc.dateFormat) <
                  this.selectedProject.activities[activity_i].startDate
              ) {
                CpspRef.cmp.toastrMessage(
                  "info",
                  CpspRef.cmp
                    .getTranslate()
                    .instant("Start date must come before end date!")
                );
                return;
              }
              if (m != undefined) {
                m.changed = true;
                m.end_date = endDateMoment.format(ConfigSc.dateFormat);
                dateSegment.endDate = endDateMoment.format(ConfigSc.dateFormat);
                dateSegment.endWeekDate = endDateMoment.format(
                  ConfigSc.dateWeekFormat
                );
                dateSegment.numberOfDays += difference;
                m.number_of_workers =
                  Math.ceil(
                    (10 * m.time) /
                      (CpspRef.cmp.getBusinessDatesCount(
                        m.start_date,
                        m.end_date
                      ) *
                        CpspRef.cmp.workingHours)
                  ) / 10;
                const percentageWork = dateSegment.currentWorkDate != null ? dateSegment.currentWorkDate.split("%") : [];
                const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
                if (currDay > dateSegment.endDate) {
                  dateSegment.currentWorkDate = percentageWork.length > 1 ? percentageWork[0] + "%"+ dateSegment.endDate : dateSegment.endDate;
                }
                needNewApp = this.changeLatestEndDate(m.end_date);
                this.needNewApp = needNewApp;
                this.updateParent(
                  this.selectedProject.activities[activity_i],
                  m
                );
                this.copySelectedProject.activities[activity_i].changed = true;
                this.copySelectedProject.activities[activity_i].moments[plan_i] = this.deepCopy(
                  m
                );
              } else {
                this.selectedProject.activities[activity_i].changed = true;
                this.selectedProject.activities[activity_i].dateSegments.at(-1).endDate =
                  endDateMoment.format(ConfigSc.dateFormat);
                this.selectedProject.activities[activity_i].numberOfDays =
                  moment(
                    this.selectedProject.activities[activity_i].endDate,
                    ConfigSc.dateFormat
                  ).diff(
                    moment(
                      this.selectedProject.activities[activity_i].startDate,
                      ConfigSc.dateFormat
                    ),
                    "days"
                  ) + 1;
                //this.selectedProject.activities[activity_i].x += difference * ConfigSc.cellWidth;
                this.copySelectedProject.activities[activity_i].dateSegments.at(-1).endDate =
                  endDateMoment.format(ConfigSc.dateFormat);
                this.copySelectedProject.activities[activity_i].numberOfDays =
                  moment(
                    this.copySelectedProject.activities[activity_i].endDate,
                    ConfigSc.dateFormat
                  ).diff(
                    moment(
                      this.copySelectedProject.activities[activity_i].startDate,
                      ConfigSc.dateFormat
                    ),
                    "days"
                  ) + 1;
                //this.copySelectedProject.activities[activity_i].x += difference * ConfigSc.cellWidth;
                this.selectedProject.activities[
                  activity_i
                ].dateSegments.at(-1).endDate = endDateMoment.format(
                  ConfigSc.dateFormat
                );
                this.selectedProject.activities[
                  activity_i
                ].dateSegments.at(-1).endWeekDate = endDateMoment.format(
                  ConfigSc.dateWeekFormat
                );
                this.copySelectedProject.activities[
                  activity_i
                ].dateSegments.at(-1).endDate = endDateMoment.format(
                  ConfigSc.dateFormat
                );
                this.copySelectedProject.activities[
                  activity_i
                ].dateSegments.at(-1).endWeekDate = endDateMoment.format(
                  ConfigSc.dateWeekFormat
                );
                this.selectedProject.activities[activity_i].number_of_workers =
                  Math.ceil(
                    (10 *
                      this.copySelectedProject.activities[activity_i].time) /
                      (CpspRef.cmp.getBusinessDatesCount(
                        this.copySelectedProject.activities[activity_i]
                          .startDate,
                        this.copySelectedProject.activities[activity_i].endDate
                      ) *
                        CpspRef.cmp.workingHours)
                  ) / 10;

              needNewApp = this.changeLatestEndDate(
                this.copySelectedProject.activities[activity_i].endDate
              );
              this.needNewApp = needNewApp;
              const percentageWork = dateSegment.currentWorkDate != null ? dateSegment.currentWorkDate.split("%") : [];
              const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];

              if (
                currDay >
                this.selectedProject.activities[activity_i].endDate
              ) {
                dateSegment.currentWorkDate = percentageWork.length > 1 ? percentageWork[0] + "%" +
                  this.selectedProject.activities[activity_i].endDate : this.selectedProject.activities[activity_i].endDate;
                // this.copySelectedProject.activities[
                //   activity_i
                // ].dateSegments[0].currentWorkDate =
                //   this.selectedProject.activities[activity_i].endDate;
              }

              this.copySelectedProject.activities[activity_i] = this.deepCopy(
              this.selectedProject.activities[activity_i]
              );
            }

            // this.copySelectedProject.activities[activity_i] = this.deepCopy(
            //   this.selectedProject.activities[activity_i]
            // );
            this.showCal = false;
            historySchedulePlaner.addToQueue(
              () => true,
              () => true
            );
            if (!needNewApp) {
              this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
              this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
            }
          })
          .on(
            "blur",
            (ev) => (ev.target.value = this.columnEndDateInput.value)
          );

          $("#startDateVacation")
            .datepicker(datepickerOptions)
            .on("change", (ev) => {
              const startDate = ev.target.value;
              if (startDate > this.selectedVacationDateStartDate){
                this.selectedVacationDateEndDate = startDate;
                $("#endDateVacation").datepicker("setDate",this.selectedVacationDateEndDate.split(" ").at(0))
              }
              this.selectedVacationDateStartDate = startDate;
              //this.filterUsersWhichCanBeAdded();
              this.ref.detectChanges();
            })
            .on(
              "blur",
              (e) => (e.target.value = this.selectedVacationDateStartDate)
            );

          $("#endDateVacation")
            .datepicker(datepickerOptions)
            .on("change", (ev) => {
              const endDate = ev.target.value;
              if (endDate < this.selectedVacationDateStartDate){
                this.selectedVacationDateStartDate = endDate;
                $("#startDateVacation").datepicker("setDate",this.selectedVacationDateStartDate.split(" ").at(0))
              }
              this.selectedVacationDateEndDate = endDate;
              //this.filterUsersWhichCanBeAdded();
              this.ref.detectChanges();
            })
            .on(
              "blur",
              (e) => (e.target.value = this.selectedVacationDateEndDate)
            );

          this.lines = this.route.snapshot.data["lines"] || [];
          this.arbitraryDates =
            this.route.snapshot.data["arbitraryDates"] || [];
          //this.defaultMoments = this.route.snapshot.data['defaultMoments'] || [];

          let today = new Date();
          this.currentDate = moment(today, "YYYY-MM-DD");
          this.Date = this.currentDate.format("YYYY-MM-DD");
          this.fullMonths = this.currentDate["_locale"]["_months"];
          this.months = this.currentDate["_locale"]["_months"];
          this.weekDays = this.currentDate["_locale"]["_weekdaysShort"];

          this.daysInMonth = this.currentDate.daysInMonth();
          let days = this.daysInMonth + 1;
          this.daysInMonthArray = Array.from(Array(days).keys());
          this.daysInMonthArray.splice(0, 1);

          this.currentMonthIndex = this.currentDate.month();
          this.currentMonth = this.months[this.currentMonthIndex];
          this.fullMonth = this.fullMonths[this.currentMonthIndex];
          this.currentYear = today.getFullYear();
          this.currentDay = this.currentDate.day();
          this.day = this.weekDays[this.currentDay];
          this.currentDayNumber = this.currentDate.date();

          this.searchInputElement =
            document.getElementById("user-search-input");
          this.searchInputElement.style.display = "block";
          this.searchInputElement.style.top = `${ConfigSc.toolboxSize}px`;
          //this.searchInputElement.style.height = `${Config.topSectionSize - ProjectUsersTableHead.columnHeight}px`;
          this.searchInputElement.style.height = "18px";
          this.searchInputElement.style.width = "180px";

          window.addEventListener(
            "resize",
            this.debounce(async (e) => {

              await this.drawNewApp();

            })
          );




          resolve(null);


        };
      }))();

    let storage = localStorage.getItem("calendar") || [];
    let calendarParse = null;

    if (storage.length > 0) {
      calendarParse = JSON.parse(storage.toString());
    }

    let version = localStorage.getItem("calendarVersion") || -1;

    if (version && version != 4) {
      this.getDaysInMonts();
    } else if (
      calendarParse.length > 0 &&
      calendarParse[2]["year"] == this.currentYear
    ) {
      this.getDaysInMonts();
    } else {
      this.calendar = calendarParse;
    }

    this.addUserModalBox = document.getElementById("add-user-modal-box");
    const addUserModal = document.getElementById("add-user-modal");
    this.addUserModalBox.style.left = `${
      window.innerWidth / 2 - this.addUserModalBox.offsetWidth / 2
    }px`;
    this.addUserModalBox.style.top = `${
      window.innerHeight / 2 - this.addUserModalBox.offsetHeight / 2
    }px`;

    this.addUserModalBox.onmousedown = (e: any) => {
      if (e.target.nodeName !== "DIV" && e.target.nodeName !== "H4") return;
      addUserModal.onmousemove = (e2: any) => {
        let x = parseInt(this.addUserModalBox.style.left);
        let y = parseInt(this.addUserModalBox.style.top);
        if (isNaN(x)) x = 0;
        if (isNaN(y)) y = 0;

        this.addUserModalBox.style.left = `${x + e2.movementX}px`;
        this.addUserModalBox.style.top = `${y + e2.movementY}px`;
      };
      window.onmouseup = () => {
        addUserModal.onmousemove = null;
        window.onmouseup = null;
      };
    };

  }

  hideEditingRows(hide = true) {
    if (hide == true) {
      this.fontFamilyDiv.style.display = "none";
      this.fontSizeDiv.style.display = "none";
      this.textBoldDiv.style.display = "none";
      this.textItalicDiv.style.display = "none";
      this.textUnderlineDiv.style.display = "none";
      this.backgroundColorDiv.style.display = "none";
      this.textColorDiv.style.display = "none";
      this.divTapeColor.style.display = "none";
    } else {
      this.fontFamilyDiv.style.display = "block";
      this.fontSizeDiv.style.display = "block";
      this.textBoldDiv.style.display = "block";
      this.textItalicDiv.style.display = "block";
      this.textUnderlineDiv.style.display = "block";
      this.backgroundColorDiv.style.display = "block";
      this.textColorDiv.style.display = "block";
      this.divTapeColor.style.display = "block";
    }
  }

  // hideHoursProject(hide = true) {
  //   if (hide == true) {
  //     this.hoursDiv.style.display = "none";
  //   } else {
  //     this.hoursDiv.style.display = "block";
  //   }
  // }

  // getNumberOfAllDisplayActivitiesAndMoments() {
  //   return this.selectedProject.activities.reduce(
  //     (total, activity) => (total += activity.moments.length + 1),
  //     0
  //   );
  // }

  async drawNewApp(){
    if(!this.projectSchedulePlanerApp) return;
    let copy = this.deepCopy(this.copySelectedProject);
    let copy2 = this.deepCopy(this.copySelectedProject);
    let cpSA = this.deepCopy(
      this.projectSchedulePlanerApp.projectMomentsContainer
        .show_activity
    );
    let cpSS = this.deepCopy(
      this.projectSchedulePlanerApp.projectMomentsContainer
        .show_states
    );

    this.projectSchedulePlanerApp =
      await new ProjectSchedulePlanerApp(this);

    this.copySelectedProject = this.deepCopy(copy);
    this.selectedProject = this.deepCopy(copy2);
    this.projectSchedulePlanerApp.projectMomentsContainer.show_activity =
      this.deepCopy(cpSA);
    this.projectSchedulePlanerApp.projectMomentsContainer.show_states =
      this.deepCopy(cpSS);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.columnValueInput = document.getElementById(
      "columnValueEditInput"
    ) as HTMLInputElement;

    this.newColumnValueInput = document.getElementById(
      "newColumnValueEditInput"
    ) as HTMLInputElement;

    this.noteInput = document.getElementById(
      "noteInput"
    ) as HTMLInputElement;
    this.planInput = document.getElementById(
      "planInput"
    ) as HTMLInputElement;
  }

  async loadActivitiesAndPlans() {
    this.project = this.route.snapshot.data["project"] || [];
    this.projectWorkingHoursPerDay =
      this.route.snapshot.data["scheduleProjectHours"] || [];
    this.workingHours =
      this.projectWorkingHoursPerDay.length != 0
        ? this.projectWorkingHoursPerDay[0].workingHoursPerDay
        : 8;
    this.changeHoursOnProject = this.workingHours != null ? this.workingHours : 8;

    this.checked =
      this.projectWorkingHoursPerDay.length != 0 && this.projectWorkingHoursPerDay[0].showMomentsName == 1
        ? true
        : false;

    this.revisions = this.route.snapshot.data["revisionSchedule"] || [];
    this.revImages = this.route.snapshot.data["revisionScheduleImage"] || [];
    this.defaultMoments = this.route.snapshot.data["defaultMoments"].data || [];
    this.property_index = this.revisions.length + 1;
    this.allDisplayProjects.push(this.project);

    this.projectsService
        .getAttestClientWorkers(this.project.id)
        .then((res) => {
          this.client_workers = res;
        });

    this.copySelectedProject = {
      id: this.project.id,
      name: this.project.name,
      activities: [],
    };

    //loading real activities from database, connected to selected project
    var activityList = [];
    var length_real_activity = 0;
    this.project.activities.forEach((activity) => {
      if (activity.activity != "0") {
        var Activity: Activity = {
          id: activity.activity,
          number: activity.activityNumber,
          description: activity.activityDescription,
          styles: {
            backgroundColor: "#DEEDFF",
            color: "#000",
            fontDecoration: "normal",
            fontFamily: "Calibri",
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: "normal",
          },
          moments: [],
          startDate: activity.StartDate,
          endDate: activity.EndDate.slice(0, 10),
          startWeekDate: null,
          endWeekDate: null,
          numberOfDays: this.getDaysBetweenDates(
            moment(activity.StartDate).format(ConfigSc.dateFormat),
            moment(activity.EndDate.slice(0, 10)).format(ConfigSc.dateFormat)
          ),
          y: 0,
          x: 0,
          resourceWeeks: null,
          countAsResources: false,
          percentage_of_realized_activity: 0,
          sort_index: 0,
          tape_color: "blue",
          dateSegments: [
            {
              id: activity.id,
              startDate: null,
              endDate: null,
              startWeekDate: null,
              endWeekDate: null,
              numberOfDays: null,
              x: 0,
              y: 0,
              startWorkDate: null,
              currentWorkDate: null,
              connected: null,
              connectedToPlan: null,
              noted: 0,
              noteText: null,
              finishedTime: null,
            },
          ],
          number_of_workers: 0,
          time: 0,
          default_moment_id: null,
          plan: null,
          part: null,
          changed: false,
        };
        activityList.push(Activity);
        length_real_activity++;
      }
    });

    if (this.copySelectedProject.activities.length >= 0) {
      //loading data connected to selected project, plans and activities for selected project
      this.schedulePlanState = this.route.snapshot.data["planState"] || [];
      var list = [];
      var activityId = null;
      var i = -1;
      length_real_activity = 0;
      var j = length_real_activity != 0 ? activityList.length - 1 : 0;
      var queParent: { parentId: number; moment: Moment }[] = []; //containes id of parents and childred

      var activityStartDate = null;
      var activityEndDate = null;
      // var plan_index = 0;
      for(let k = 0; k < this.schedulePlanState.length; k++){
        const plan = this.schedulePlanState.at(k);
        const index = k;

      // this.schedulePlanState.forEach((plan,index) => {

        //for real activities, from project
        // if (plan.state == "ACTIVITY" && plan.activity_id != null)
        if (plan.state_number == 0 && plan.activity_id != null) {
          i++;
          if (i == 0) j++;
          if (activityEndDate != null && i > 0) {
            this.copySelectedProject.activities[i - 1].endDate = activityEndDate;
            this.copySelectedProject.activities[i - 1].numberOfDays =
              this.getDaysBetweenDates(activityStartDate, activityEndDate);
            activityEndDate = null;
          }

          this.copySelectedProject.activities[i].percentage_of_realized_activity =
            plan.percentage_of_realized_plan_state;
          this.copySelectedProject.activities[i].styles.backgroundColor =
            plan.background_color;
          (this.copySelectedProject.activities[i].styles.color = plan.text_color),
            (this.copySelectedProject.activities[i].styles.fontWeight =
              plan.font_weight),
            (this.copySelectedProject.activities[i].styles.fontStyle =
              plan.font_style);
          this.copySelectedProject.activities[i].styles.fontDecoration =
            plan.font_decoration;
          this.copySelectedProject.activities[i].styles.fontSize = plan.font_size;
          this.copySelectedProject.activities[i].styles.fontFamily =
            plan.font_family;
          this.copySelectedProject.activities[i].sort_index = plan.sort_index;
          activityStartDate = plan.start_date;
          activityEndDate = plan.end_date;

          //for counting latest end date for showing correct number of months in grid
          if (plan.end_date != null) {
            if (ConfigSc.latestEndDate != null)
              ConfigSc.latestEndDate = this.getSomeDate(
                moment(ConfigSc.latestEndDate, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                moment(plan.end_date, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                "after"
              );
            else ConfigSc.latestEndDate = plan.end_date;
            if (ConfigSc.earlierStartDate != null)
              ConfigSc.earlierStartDate = this.getSomeDate(
                moment(ConfigSc.earlierStartDate, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                moment(plan.start_date, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                "before"
              );
            else ConfigSc.earlierStartDate = plan.start_date;
          }
        }

        //for plans that become activities
        else if (plan.state_number == 0 && plan.activity_id == null) {
          if(index > 0 &&
            plan.state_number == this.schedulePlanState.at(index - 1).state_number &&
            plan.parent == this.schedulePlanState.at(index - 1).parent &&
            plan.sort_index == this.schedulePlanState.at(index - 1).sort_index
          ){
            this.copySelectedProject.activities.at(-1).dateSegments.push(
                {
                  id: plan.id,
                  startDate: moment(plan.start_date).format(ConfigSc.dateFormat),
                  endDate: moment(plan.end_date).format(ConfigSc.dateFormat),
                  startWeekDate: moment(plan.start_date).format(
                    ConfigSc.dateFormat
                  ),
                  endWeekDate: moment(plan.end_date).format(ConfigSc.dateFormat),
                  numberOfDays: this.getDaysBetweenDates(
                    startPlanDate,
                    plan.end_date
                  ),
                  x: 0,
                  y: 0,
                  startWorkDate: plan.start_with_work_date,
                  currentWorkDate: plan.end_with_work_date,
                  connected: plan.connected,
                  connectedToPlan: plan.connected_to_plan_id,
                  noted: plan.noted,
                  noteText: plan.note_text,
                  finishedTime: plan.finished_time,
                }
            );
            // return;
            continue;
          }
          j = j + 1;
          if (activityEndDate != null && j >= activityList.length) {
            //if (length_real_activity == 0) j--;
            this.copySelectedProject.activities.at(-1).endDate = activityEndDate;
            this.copySelectedProject.activities.at(-1).numberOfDays = this.getDaysBetweenDates(
              activityStartDate,
              activityEndDate
            );
            activityEndDate = null;
          }

          var Activity: Activity = {
            id: plan.id,
            number: "",
            description: plan.name,
            styles: {
              backgroundColor: plan.background_color,
              color: plan.text_color,
              fontDecoration: plan.font_decoration,
              fontFamily: plan.font_family,
              fontSize: plan.font_size,
              fontStyle: plan.font_style,
              fontWeight: plan.font_weight,
            },
            moments: [],
            startDate:
              plan.start_date != null
                ? moment(plan.start_date).format(ConfigSc.dateFormat)
                : null,
            endDate:
              plan.end_date != null
                ? moment(plan.end_date).format(ConfigSc.dateFormat)
                : null,
            startWeekDate: null,
            endWeekDate: null,
            numberOfDays: this.getDaysBetweenDates(
              moment(plan.start_date).format(ConfigSc.dateFormat),
              moment(plan.end_date).format(ConfigSc.dateFormat)
            ),
            y: 0,
            x: 0,
            resourceWeeks: null,
            countAsResources: false,
            percentage_of_realized_activity:
              plan.percentage_of_realized_plan_state,
            sort_index: plan.sort_index,
            tape_color: plan.tape_color,
            dateSegments: [
              {
                id: plan.id,
                startDate: plan.start_date != null ? moment(plan.start_date).format(ConfigSc.dateFormat) : null,
                endDate: plan.end_date != null ? moment(plan.end_date).format(ConfigSc.dateFormat) : null,
                startWeekDate: plan.start_date != null ? moment(plan.start_date).format(
                  ConfigSc.dateWeekFormat
                ) : null,
                endWeekDate: plan.end_date != null ? moment(plan.end_date).format(ConfigSc.dateWeekFormat) : null,
                numberOfDays: this.getDaysBetweenDates(
                  startPlanDate,
                  plan.end_date
                ),
                x: 0,
                y: 0,
                startWorkDate: plan.start_with_work_date,
                currentWorkDate: plan.end_with_work_date,
                connected: plan.connected,
                connectedToPlan: plan.connected_to_plan_id,
                noted: plan.noted,
                noteText: plan.note_text,
                finishedTime: plan.finished_time,
              },
            ],
            number_of_workers: plan.number_of_workers,
            time: plan.time,
            default_moment_id: plan.default_moment_id,
            plan: plan.plan,
            part: plan.part,
            monster: Number(plan.pattern),
            changed: false,
          };

          if (list.length != 0 && plan.id != activityId) {
            this.copySelectedProject.activities.at(-1).moments = list;
            list = [];
          }

          this.copySelectedProject.activities.push(Activity);
          activityStartDate = plan.start_date;
          //activityEndDate = plan.end_date;

          if (Activity.dateSegments[0].connected == 1) {
            this.lineConnections.push({ m1: Activity, m2: null });
          }



          //for counting latest end date for showing correct number of months in grid
          if (plan.end_date != null) {
            if (ConfigSc.latestEndDate != null)
              ConfigSc.latestEndDate = this.getSomeDate(
                moment(ConfigSc.latestEndDate, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                moment(plan.end_date, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                "after"
              );
            else ConfigSc.latestEndDate = plan.end_date;
            if (ConfigSc.earlierStartDate != null)
              ConfigSc.earlierStartDate = this.getSomeDate(
                moment(ConfigSc.earlierStartDate, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                moment(plan.start_date, ConfigSc.dateFormat).format(
                  ConfigSc.dateFormat
                ),
                "before"
              );
            else ConfigSc.earlierStartDate = plan.start_date;
          }
        }

        //for plans
        else {
          if (plan.parent_type == "ACTIVITY") {
            //we came to next activity
            if (activityId != plan.activity_id && activityId != null) {
              var ind = this.project.activities.findIndex(
                (a) => a.activity == activityId
              );
              if (ind != -1)
                this.copySelectedProject.activities[i - 1].moments = list;
              else {
                // if (plan_index > 0 && this.selectedProject.activities[j].id != activityId) { //this.schedulePlanState[plan_index - this.project.activities.length].id
                //   // this.selectedProject.activities[j - 1].moments = list;
                // }
              }
              list = [];
            }

            activityId = plan.activity_id;
          }

          //if child starts before activity
          var startPlanDate = activityStartDate;
          var moveEndDateForDays = this.getDaysBetweenDates(
            plan.start_date,
            startPlanDate
          );
          if (
            plan.start_date == null ||
            this.getSomeDate(activityStartDate, plan.start_date, "before") ==
              activityStartDate
          ) {
            startPlanDate = plan.start_date;
            moveEndDateForDays = 0;
          }
          if (plan.end_date != null)
            plan.end_date = moment(plan.end_date, ConfigSc.dateFormat)
              .add(moveEndDateForDays, "days")
              .format(ConfigSc.dateFormat);
          activityEndDate = this.getSomeDate(
            activityEndDate,
            plan.end_date,
            "after"
          );

          if(index > 0 &&
            plan.state_number == this.schedulePlanState.at(index - 1).state_number &&
            plan.parent == this.schedulePlanState.at(index - 1).parent &&
            plan.sort_index == this.schedulePlanState.at(index - 1).sort_index
          ){
            list.at(-1).dateSegments.push(
                {
                  id: plan.id,
                  startDate: moment(plan.start_date).format(ConfigSc.dateFormat),
                  endDate: moment(plan.end_date).format(ConfigSc.dateFormat),
                  startWeekDate: moment(plan.start_date).format(
                    ConfigSc.dateFormat
                  ),
                  endWeekDate: moment(plan.end_date).format(ConfigSc.dateFormat),
                  numberOfDays: this.getDaysBetweenDates(
                    startPlanDate,
                    plan.end_date
                  ),
                  x: 0,
                  y: 0,
                  startWorkDate: plan.start_with_work_date,
                  currentWorkDate: plan.end_with_work_date,
                  connected: plan.connected,
                  connectedToPlan: plan.connected_to_plan_id,
                  noted: plan.noted,
                  noteText: plan.note_text,
                  finishedTime: plan.finished_time,
                }
            );
            list.at(-1).dateSegments.sort((a,b) =>{
              if(a.startDate < b.startDate)
                return -1;
              else if(a.startDate > b.startDate)
                return 1;
              return 0;
            });
            // return;
            continue;
          }

          var segment: DateSegmentData[] = [
            {
              id: plan.id,
              startDate: startPlanDate,
              endDate: plan.end_date,
              startWeekDate: startPlanDate,
              endWeekDate: plan.end_date,
              numberOfDays: this.getDaysBetweenDates(
                startPlanDate,
                plan.end_date
              ),
              x: 0,
              y: 0,
              startWorkDate: plan.start_with_work_date,
              currentWorkDate: plan.end_with_work_date,
              connected: plan.connected,
              connectedToPlan: plan.connected_to_plan_id,
              noted: plan.noted,
              noteText: plan.note_text,
              finishedTime: plan.finished_time,
            },
          ];

          var styles: MomentStyles;
          styles = {
            backgroundColor: plan.background_color,
            color: plan.text_color,
            fontWeight: plan.font_weight,
            fontStyle: plan.font_style,
            fontDecoration: plan.font_decoration,
            fontSize: plan.font_size,
            fontFamily: plan.font_family,
          };

          var newState = "STATE";
          //if (plan.group_id > 0) {
          if (plan.state_number > 1) {
            let p = this.getPlanById(plan.parent);
            newState = p.name;
          }

          var m: Moment;
          m = {
            id: plan.id,
            global_activity_id: plan.schedule_activity_id,
            activity_id: plan.activity_id,
            schedule_plan_activity_id: plan.schedule_plan_activity_id,
            moment_id: plan.default_moment_id,
            name: plan.name,
            plan: plan.plan,
            start_date: startPlanDate,
            end_date:
              plan.end_date != null
                ? moment(plan.end_date).format(ConfigSc.dateFormat)
                : null,
            time: plan.time,
            number_of_workers: plan.number_of_workers,
            state: newState,
            state_number: plan.state_number,
            dateSegments: segment,
            styles: styles,
            percentage_of_realized_plan: plan.percentage_of_realized_plan_state,
            y: 0,
            parent: plan.parent,
            parent_type: plan.parent_type,
            tape_color: plan.tape_color,
            moments: [],
            group_id: plan.group_id,
            sort_index: plan.sort_index,
            part: plan.part,
            monster: Number(plan.pattern),
            changed: false,
          };

          if (plan.end_date != null && plan.end_date > ConfigSc.latestEndDate) {
            ConfigSc.latestEndDate = plan.end_date;
          }

          if (plan.start_date != null && plan.start_date < ConfigSc.earlierStartDate) {
            ConfigSc.earlierStartDate = plan.start_date;
          }

          if (plan.group_id != null && plan.group_id > 0) {
            queParent.push({ parentId: plan.parent, moment: m });
          }
          list.push(m);

          if (m.dateSegments[0].connected == 1) {
            this.lineConnections.push({ m1: m, m2: null });
          }

          //if activity is last one in list, i need to put his children in moments
          if (
            this.project.activities.length > 0 &&
            i == this.project.activities.length - 1 &&
            list.length != 0 &&
            activityId == plan.activity_id
          ) {
            this.copySelectedProject.activities[i].moments = list;
            this.copySelectedProject.activities[i].endDate = activityEndDate;
            this.copySelectedProject.activities[i].numberOfDays =
              this.getDaysBetweenDates(
                this.copySelectedProject.activities[i].startDate,
                activityEndDate
              );
          }

          if (
            length_real_activity == 0 &&
            j == activityList.length &&
            j == this.copySelectedProject.activities.length &&
            list.length != 0
          ) {
            this.copySelectedProject.activities[j - 1].moments = list;
            this.copySelectedProject.activities[j - 1].endDate = activityEndDate;
            this.copySelectedProject.activities[j - 1].numberOfDays =
              this.getDaysBetweenDates(
                this.copySelectedProject.activities[j - 1].startDate,
                activityEndDate
              );
          }

          if (
            j == this.copySelectedProject.activities.length - 1 &&
            list.length != 0 &&
            activityId == plan.activity_id
          ) {
            this.copySelectedProject.activities[j].moments = list;
            this.copySelectedProject.activities[j].endDate = activityEndDate;
            this.copySelectedProject.activities[j].numberOfDays =
              this.getDaysBetweenDates(
                this.copySelectedProject.activities[j].startDate,
                activityEndDate
              );
          }
        }
      //});
      }

      var partStartDate = null;
      var partEndDate = null;
      var partHours = 0;
      var partStartWorkDate = null;
      var partEndWorkDate = null;
      this.copySelectedProject.activities.forEach((activity) => {
        this.lineConnections.forEach((connection) => {
          if (connection.m1.dateSegments[0].connectedToPlan == activity.id)
            connection.m2 = activity;
        });

        activity.moments
          .slice()
          .reverse()
          .forEach((plan) => {
            this.lineConnections.forEach((connection) => {
              if (connection.m1.dateSegments[0].connectedToPlan == plan.id)
                connection.m2 = plan;
            });

            queParent.forEach((parent) => {
              if (plan.id == parent["parentId"]) {
                if (
                  parent["moment"].start_date != null &&
                  (parent["moment"].parent_type == plan.state ||
                    (plan.state_number > 1 &&
                      parent["moment"].parent_type == "PLAN"))
                ) {
                  partStartDate = this.getSomeDate(
                    partStartDate,
                    parent["moment"].start_date,
                    "before"
                  );
                  partEndDate = this.getSomeDate(
                    partEndDate,
                    // parent["moment"].end_date,
                    parent["moment"].dateSegments.at(-1).endDate,
                    "after"
                  );
                  partHours = partHours + Number(parent["moment"].time);
                  partStartWorkDate = this.getSomeDate(
                    partStartWorkDate,
                    parent["moment"].dateSegments[0].startWorkDate,
                    "before"
                  );
                  partEndWorkDate = this.getSomeDate(
                    partEndWorkDate,
                    parent["moment"].dateSegments[0].currentWorkDate,
                    "after"
                  );
                  plan.state = "STATE";

                  //for counting latest end date for showing correct number of months in grid
                  // if (partEndDate != null) {
                  //   if (ConfigSc.latestEndDate != null)
                  //     ConfigSc.latestEndDate = this.getSomeDate(moment(ConfigSc.latestEndDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat), moment(partEndDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat), "after");
                  //   else ConfigSc.latestEndDate = partEndDate;
                  // }
                }
              }
            });

            if (partStartDate != null) {
              var segment: DateSegmentData[] = [
                {
                  id: plan.id,
                  startDate: partStartDate,
                  endDate: partEndDate,
                  startWeekDate: partStartDate,
                  endWeekDate: partEndDate,
                  numberOfDays: this.getDaysBetweenDates(
                    partStartDate,
                    partEndDate
                  ),
                  x: 0,
                  y: 0,
                  startWorkDate: partStartWorkDate,
                  currentWorkDate: partEndWorkDate,
                  connected: plan.dateSegments[0].connected,
                  connectedToPlan: plan.dateSegments[0].connectedToPlan,
                  noted: plan.dateSegments[0].noted,
                  noteText: plan.dateSegments[0].noteText,
                  finishedTime: plan.dateSegments[0].finishedTime,
                },
              ];

              plan.dateSegments = segment;
              plan.time = partHours;
              plan.start_date = partStartDate;
              plan.end_date = partEndDate;
              if (plan.percentage_of_realized_plan == null)
                plan.percentage_of_realized_plan = 0;

              partStartDate = null;
              partEndDate = null;
              partHours = null;
              partStartWorkDate = null;
              partEndWorkDate = null;
            }
          });
      });

      this.moments = Object.assign({}, this.copySelectedProject);
      this.activeRevisions = this.copySelectedProject;
      this.activeColumns = this.allColumns;
    }
  }

  calculateResourceWorkers(){
    this.resourcesWorkers = [];
    this.copySelectedProject.activities.forEach((activity, activityIndex) =>{
      if(activity.moments.length == 0){
        activity.dateSegments.forEach((dateSegment, dsIndex) => {
          let weekStart = moment(dateSegment.startDate).format(ConfigSc.dateWeekFormat);
          let weekEnd = moment(dateSegment.endDate).format(ConfigSc.dateWeekFormat);

          const activityBussinesdays = //5
             CpspRef.cmp.getAllDaysOfMoment(
              activity
            );

          while(weekStart <= weekEnd && weekStart != "Invalid date" && weekEnd != "Invalid date"){

            let wI = this.resourcesWorkers.findIndex((w) => w.week == weekStart);
            const splitWeek = weekStart.split("-");
            const startOfWeek = moment()
              .year(Number(splitWeek[0]))
              .week(Number(splitWeek[1]))
              .day(1)
              .startOf("day");
            const endOfWeek = moment()
              .year(Number(splitWeek[0]))
              .week(Number(splitWeek[1]))
              .day(5)
              .startOf("day");

            const st_date = moment(dateSegment.startDate).startOf("day");
            const end_date = moment(dateSegment.endDate).startOf("day");

            //calculating first and last day of activity in a weekend
            const startActivityInWeek =
              startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
            if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for activities
            const endActivityInWeek =
              end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
            const daysOfActivityInWeek =
              endActivityInWeek.diff(startActivityInWeek, "days") + 1;



            let days = (activity.time * daysOfActivityInWeek) /
            (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);

            if(wI != -1){
              this.resourcesWorkers.at(wI).c += days
            } else {
              this.resourcesWorkers.push({
                week : weekStart,
                c : days
              })
            }

            weekStart = moment(weekStart,ConfigSc.dateWeekFormat).add(1,"weeks").format(ConfigSc.dateWeekFormat);
          }




          // if (dateSegment.startDate != null) {
          //   const st_date = moment(dateSegment.startDate).startOf("day");
          //   const end_date = moment(dateSegment.endDate).startOf("day");

          //   if (
          //     st_date.format(ConfigSc.dateWeekFormat) <= week &&
          //     end_date.format(ConfigSc.dateWeekFormat) >= week
          //   ) {
          //     if (
          //       activity.number_of_workers != null &&
          //       activity.moments.length == 0
          //     ) {
          //       //calculating first and last day of activity in a weekend
          //       const startActivityInWeek =
          //         startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
          //       if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for activities
          //       const endActivityInWeek =
          //         end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
          //       const daysOfActivityInWeek =
          //         endActivityInWeek.diff(startActivityInWeek, "days") + 1;

          //       //calculating bussines days in a specific activity in one week
          //       const activityBussinesdays = CpspRef.cmp.getAllDaysOfMoment(
          //         activity
          //       );
          //       r =
          //         r +
          //         (activity.time * daysOfActivityInWeek) /
          //           (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);
          //     }
          //   }
          // }



        })
      }



      activity.moments.forEach((mom,momIndex) => {
        if(mom.percentage_of_realized_plan == null){
          mom.dateSegments.forEach((dateSegment, dsIndex) => {
            let weekStart = moment(dateSegment.startDate).format(ConfigSc.dateWeekFormat);
            let weekEnd = moment(dateSegment.endDate).format(ConfigSc.dateWeekFormat);

            const activityBussinesdays = CpspRef.cmp.getAllDaysOfMoment(
              mom
            );

            while(weekStart <= weekEnd && weekStart != "Invalid date" && weekEnd != "Invalid date"){

              let wI = this.resourcesWorkers.findIndex((w) => w.week == weekStart);
              const splitWeek = weekStart.split("-");
              const startOfWeek = moment()
                .year(Number(splitWeek[0]))
                .week(Number(splitWeek[1]))
                .day(1)
                .startOf("day");
              const endOfWeek = moment()
                .year(Number(splitWeek[0]))
                .week(Number(splitWeek[1]))
                .day(5)
                .startOf("day");

              const st_date = moment(dateSegment.startDate).startOf("day");
              const end_date = moment(dateSegment.endDate).startOf("day");

              //calculating first and last day of activity in a weekend
              const startActivityInWeek =
                startOfWeek.diff(st_date, "days") <= 0 ? st_date : startOfWeek;
              if (startOfWeek.diff(st_date, "days") < -4) return false; //chech if start of activity falls on weekend for activities
              const endActivityInWeek =
                end_date.diff(endOfWeek, "days") <= 0 ? end_date : endOfWeek;
              const daysOfActivityInWeek =
                endActivityInWeek.diff(startActivityInWeek, "days") + 1;



              let days = (Number(mom.time) * daysOfActivityInWeek) /
              (5 * activityBussinesdays * CpspRef.cmp.changeHoursOnProject);

              if(wI != -1){
                this.resourcesWorkers.at(wI).c += days
              } else {
                this.resourcesWorkers.push({
                  week : weekStart,
                  c : days
                })
              }

              weekStart = moment(weekStart,ConfigSc.dateWeekFormat).add(1,"weeks").format(ConfigSc.dateWeekFormat);
            }
          })
        }

      })
    })
  }

  //pravljeno za grupu, prvo prebaci svu djecu selektovanih planova na njihovog roditelja, a onda obrise grupe koje su kreirane da bi se ta djeca vezala za odabrane momente
  // findChildAndSetNewParent(projectId, m, stateType) {
  //   //dodaj parent id za brisanje grupe, da po parentu obrises grupu iz baze, umjesto po id-u, jer su svva djeca izbacena iz tog momenta, pa treba obrisati i grupu
  //   const changes = [];
  //   const previousState = [];

  //   var nextSortIndex = m.sort_index + 1;

  //   if (stateType != "STATE" && stateType != "ACTIVITY") stateType = "PLAN";

  //   this.copySelectedProject.activities.forEach(activity => {
  //     activity.moments.forEach(plan => {
  //       if (plan.parent == m.id) {

  //         previousState.push({
  //           'id': plan.id,
  //           'global_activity_id': plan.global_activity_id == 0 ? null : plan.global_activity_id,
  //           'schedule_plan_activity_id': plan.schedule_plan_activity_id,
  //           'moment_id': plan.moment_id,
  //           'name': plan.name,
  //           'plan' : plan.plan,
  //           'start_date' : plan.start_date,
  //           'end_date' : plan.end_date,
  //           'time' : plan.time,
  //           'number_of_workers' : plan.number_of_workers,
  //           'group_id' : plan.group_id,
  //           'state_number': plan.state_number,
  //           'sort_index': plan.sort_index
  //         });

  //         plan.parent = m.parent;
  //         plan.group_id = m.group_id;
  //         plan.state = m.state;
  //         plan.state_number = m.state_number;
  //         plan.sort_index = nextSortIndex;
  //         nextSortIndex++;

  //         changes.push({
  //           'id': plan.id,
  //           'global_activity_id': plan.global_activity_id == 0 ? null : plan.global_activity_id,
  //           'schedule_plan_activity_id': plan.schedule_plan_activity_id,
  //           'moment_id': plan.moment_id,
  //           'name': plan.name,
  //           'plan' : plan.plan,
  //           'start_date' : plan.start_date,
  //           'end_date' : plan.end_date,
  //           'time' : plan.time,
  //           'number_of_workers' : plan.number_of_workers,
  //           'group_id' : plan.group_id,
  //           'state_number': plan.state_number,
  //           'sort_index': plan.sort_index
  //         });

  //       }
  //     });
  //   });

  //   this.listOfChangedFunctions.push(() => this.scheduleService.changeSchedulePlan(changes));
  //   this.listOfPreviousFunctions.push(() => this.scheduleService.changeSchedulePlan(previousState));

  //   this.listOfChangedFunctions.push(() => this.scheduleService.deleteScheduleGroup(m.id));
  //   this.listOfPreviousFunctions.push(() => this.scheduleService.createScheduleGroup(projectId, m.activity_id, m.id, stateType));

  //   // historySchedulePlaner.addToQueue(
  //   //   () => this.scheduleService.changeSchedulePlan(changes),
  //   //   () => this.scheduleService.changeSchedulePlan(previousState)
  //   // );

  //   // historySchedulePlaner.addToQueue(
  //   //   () => this.scheduleService.deleteScheduleGroup(m.id),
  //   //   () => this.scheduleService.createScheduleGroup(projectId, m.activity_id, m.id, stateType)
  //   // );

  //   // this.scheduleService.changeSchedulePlan(changes);
  //   // this.scheduleService.deleteScheduleGroup(m.id);
  // }

  //finding the one moment with highest place in hierarchy, so we can add new group moment with that level
  findFirstInHierarchy() {
    var positionMoment = null;
    var minStateNumber = null;
    CpspRef.cmp.selectedMomentsForStyleChange.forEach((m) => {
      if (
        minStateNumber == null || m.state_number != undefined
          ? m.state_number
          : 0 < minStateNumber
      ) {
        minStateNumber =
          m.state_number != undefined ? m.state_number : 0;
        positionMoment = m;
      }
    });
    if (minStateNumber != -1) return positionMoment;
    return null;
  }

  changeSchedulePlansAddToHistory(previousValues, changes) {
    var previous = [];
    var change = [];
    for (var i = 0; i < previousValues.length; i++) {
      previous.push({
        id: previousValues[i].id,
        global_activity_id:
          previousValues[i].global_activity_id == 0
            ? null
            : previousValues[i].global_activity_id,
        schedule_plan_activity_id: previousValues[i].schedule_plan_activity_id,
        moment_id: previousValues[i].moment_id,
        name: previousValues[i].name,
        plan: previousValues[i].plan,
        start_date: previousValues[i].start_date,
        end_date: previousValues[i].end_date,
        time: previousValues[i].time,
        number_of_workers: previousValues[i].number_of_workers,
        group_id: previousValues[i].group_id,
        state_number: previousValues[i].state_number,
        sort_index: previousValues[i].sort_index,
      });
      change.push({
        id: changes[i].id,
        global_activity_id:
          changes[i].global_activity_id == 0
            ? null
            : changes[i].global_activity_id,
        schedule_plan_activity_id: changes[i].schedule_plan_activity_id,
        moment_id: changes[i].moment_id,
        name: changes[i].name,
        plan: changes[i].plan,
        start_date: changes[i].start_date,
        end_date: changes[i].end_date,
        time: changes[i].time,
        number_of_workers: changes[i].number_of_workers,
        group_id: changes[i].group_id,
        state_number: changes[i].state_number,
        sort_index: changes[i].sort_index,
      });
    }

    this.listOfChangedFunctions.push(() =>
      this.scheduleService.changeSchedulePlan(change)
    );
    this.listOfPreviousFunctions.push(() =>
      this.scheduleService.changeSchedulePlan(previous)
    );
  }

  changeScheduleActivitiesAddToHistory(previousValues, changes) {
    var previous = [];
    var change = [];
    for (var i = 0; i < previousValues.length; i++) {
      previous.push({
        id: previousValues[i].id,
        global_activity_id: null,
        schedule_plan_activity_id: null,
        moment_id: previousValues[i].default_moment_id,
        name:
          previousValues[i].description != null &&
          previousValues[i].number != null
            ? previousValues[i].description + " " + previousValues[i].number
            : null,
        plan: previousValues[i].plan,
        start_date: previousValues[i].startDate,
        end_date: previousValues[i].endDate,
        time: previousValues[i].time,
        number_of_workers: previousValues[i].number_of_workers,
        group_id: null,
        state_number: 0,
        sort_index: previousValues[i].sort_index,
      });
      change.push({
        id: changes[i].id,
        global_activity_id: null,
        schedule_plan_activity_id: null,
        moment_id: changes[i].default_moment_id,
        name:
          changes[i].description != null && changes[i].number != null
            ? changes[i].description + " " + changes[i].number
            : null,
        plan: changes[i].plan,
        start_date: changes[i].startDate,
        end_date: changes[i].endDate,
        time: changes[i].time,
        number_of_workers: changes[i].number_of_workers,
        group_id: null,
        state_number: 0,
        sort_index: changes[i].sort_index,
      });
    }

    this.listOfChangedFunctions.push(() =>
      this.scheduleService.changeSchedulePlan(change)
    );
    this.listOfPreviousFunctions.push(() =>
      this.scheduleService.changeSchedulePlan(previous)
    );
  }

  //create new and add function to list
  getGroupIdForMoment(activity, parent, child) {
    var i = -1;
    activity.moments.forEach((plan) => {
      if (plan.parent == parent.id) i = plan.group_id;
    });
    // if (i == -1) {

    //   if (parent.number != "") i = null;

    //   //i = await this.scheduleService.createScheduleGroup(this.project.id, activity.id, parent.id, newState);

    //   //ovdje baci error mora se prvo sacekati da ova prva odradi pa onda pozvati da se izmijeni plan
    //   this.listOfPreviousFunctions.push(() => this.scheduleService.deleteScheduleGroup(parent.id).then(() => {
    //     var previous = [];
    //     previous.push({
    //       'id': child.id,
    //       'global_activity_id': child.global_activity_id == 0 ? null : child.global_activity_id,
    //       'schedule_plan_activity_id': child.schedule_plan_activity_id,
    //       'moment_id': child.moment_id,
    //       'name': child.name,
    //       'plan': child.plan,
    //       'start_date': child.start_date,
    //       'end_date': child.end_date,
    //       'time': child.time,
    //       'number_of_workers': child.number_of_workers,
    //       'group_id': child.group_id,
    //       'state_number': child.state_number,
    //       'sort_index': child.sort_index
    //     });
    //     this.scheduleService.changeSchedulePlan(previous);
    //   }));

    //   this.listOfChangedFunctions.push(() => {
    //     this.createAndSetNewGroup(activity, parent, child);
    //   });

    //   return i;

    // }

    let oldChild = child;
    child.group_id = i;
    child.parent = parent.id;
    var newState =
      parent.state != "STATE" && parent.state != "ACTIVITY"
        ? "PLAN"
        : parent.state;
    if (parent.percentage_of_realized_plan == undefined) newState = "ACTIVITY";
    child.parent_type = newState;
    child.sort_index = 1;
    child.state_number =
      parent.state_number != undefined ? Number(parent.state_number) + 1 : 1;
    child.schedule_plan_activity_id = child.schedule_plan_activity_id;
    child.global_activity_id = child.global_activity_id;
    child.state =
      child.percentage_of_realized_plan == null ? parent.name : "STATE";
    this.changeSchedulePlansAddToHistory([oldChild], [child]);

    return i;
  }

  createAndSetNewGroup(activity, parent, child) {
    var newState =
      parent.state != "STATE" && parent.state != "ACTIVITY"
        ? "PLAN"
        : parent.state;
    if (parent.percentage_of_realized_plan == undefined) newState = "ACTIVITY";
    if (parent.number != "") {
      var change = [];
      change.push({
        id: child.id,
        global_activity_id:
          child.global_activity_id == 0 ? null : child.global_activity_id,
        schedule_plan_activity_id: child.schedule_plan_activity_id,
        moment_id: child.moment_id,
        name: child.name,
        plan: child.plan,
        start_date: child.start_date,
        end_date: child.end_date,
        time: child.time,
        number_of_workers: child.number_of_workers,
        group_id: null,
        state_number:
          parent.state_number != undefined
            ? Number(parent.state_number) + 1
            : 1,
        sort_index: 1,
      });
      this.scheduleService.changeSchedulePlan(change);
    } else {
      this.scheduleService
        .createScheduleGroup(this.project.id, activity.id, parent.id, newState)
        .then((obj) => {
          var change = [];
          change.push({
            id: child.id,
            global_activity_id:
              child.global_activity_id == 0 ? null : child.global_activity_id,
            schedule_plan_activity_id: child.schedule_plan_activity_id,
            moment_id: child.moment_id,
            name: child.name,
            plan: child.plan,
            start_date: child.start_date,
            end_date: child.end_date,
            time: child.time,
            number_of_workers: child.number_of_workers,
            group_id: obj,
            state_number:
              parent.state_number != undefined
                ? Number(parent.state_number) + 1
                : 1,
            sort_index: 1,
          });
          this.scheduleService.changeSchedulePlan(change);
        });
    }
  }

  //add function to list
  changeSchedulePlanDetails(previousValue, newValue) {
    this.listOfChangedFunctions.push(() =>
      this.scheduleService.changePlansDetails(
        newValue.id,
        newValue.state != undefined ? newValue.state : "ACTIVITY",
        newValue.styles.backgroundColor,
        newValue.styles.color,
        newValue.styles.fontSize,
        newValue.styles.fontWeight,
        newValue.styles.fontFamily,
        newValue.styles.fontStyle,
        newValue.styles.fontDecoration,
        newValue.tape_color,
        newValue.state != undefined
          ? newValue.percentage_of_realized_plan
          : newValue.percentage_of_realized_activity,
        newValue.dateSegments[0].startWorkDate,
        newValue.dateSegments[0].currentWorkDate,
        newValue.dateSegments[0].connected,
        newValue.dateSegments[0].connectedToPlan,
        newValue.dateSegments[0].noted,
        newValue.dateSegments[0].noteText
      )
    );

    this.listOfPreviousFunctions.push(() =>
      this.scheduleService.changePlansDetails(
        previousValue.id,
        previousValue.state != undefined ? previousValue.state : "ACTIVITY",
        previousValue.styles.backgroundColor,
        previousValue.styles.color,
        previousValue.styles.fontSize,
        previousValue.styles.fontWeight,
        previousValue.styles.fontFamily,
        previousValue.styles.fontStyle,
        previousValue.styles.fontDecoration,
        previousValue.tape_color,
        previousValue.state != undefined
          ? previousValue.percentage_of_realized_plan
          : previousValue.percentage_of_realized_activity,
        previousValue.dateSegments[0].startWorkDate,
        previousValue.dateSegments[0].currentWorkDate,
        previousValue.dateSegments[0].connected,
        previousValue.dateSegments[0].connectedToPlan,
        previousValue.dateSegments[0].noted,
        previousValue.dateSegments[0].noteText
      )
    );
  }

  //add function to list
  deleteScheduleGroup(parent: Moment) {
    var newState =
      parent.state != "STATE" && parent.state != "ACTIVITY"
        ? "PLAN"
        : parent.state;
    this.listOfChangedFunctions.push(() =>
      this.scheduleService.deleteScheduleGroup([parent.id])
    );
    this.listOfPreviousFunctions.push(() =>
      this.scheduleService.createScheduleGroup(
        this.project.id,
        parent.activity_id,
        parent.id,
        newState
      )
    );
  }

  public changeScheduleGroup(oldValues, newValues) {
    historySchedulePlaner.appendToQueueGroup(
      () =>
        this.scheduleService.changeScheduleGroup([
          {
            projectId: this.project.id,
            activityId: newValues.activity_id,
            parent: newValues.parent,
            parentType:
              newValues.activity_id == newValues.parent
                ? "ACTIVITY"
                : newValues.parent_type,
          },
        ]),
      () =>
        this.scheduleService.changeScheduleGroup([
          {
            projectId: this.project.id,
            activityId: oldValues.activity_id,
            parent: oldValues.parent,
            parentType: oldValues.parent_type,
          },
        ])
    );
  }

  addListContentToHistory(addToQueExsists = false) {
    if (
      this.listOfChangedFunctions.length > 0 &&
      this.listOfPreviousFunctions.length > 0
    ) {
      this.listOfChangedFunctions.forEach((change, i) => {
        this.listOfPreviousFunctions.forEach((previous, j) => {
          if (i == j) {
            if (i == 0 && !addToQueExsists) {
              historySchedulePlaner.addToQueue(
                () => change(),
                () => previous()
              );
            } else {
              historySchedulePlaner.appendToQueueGroup(
                () => change(),
                () => previous()
              );
            }
          }
        });
      });
    }
  }

  // for creating group, this will change only moments with highest level
  // going throw already changed moments, so no need to set state_number again
  // private async changeSchedulePlan(newValues: Moment) {
  //   const changes = [];
  //   const previousState = [];

  //   var stateNumberOfNewFirstElement = Number(newValues.state_number);
  //   //var newSortIndex = 1;

  //   CpspRef.cmp.copySelectedProject.activities.forEach(activity => {

  //     // var insideMovedActivity = false;

  //     // // if selected is activity
  //     // if (CpspRef.cmp.selectedMomentsForStyleChange.some(u => u.projectId === this.project.id && u.activityId == activity.id && u.planId === null) && stateNumberOfNewParent == 0) {

  //     //   previousState.push({
  //     //     'id': activity.id,
  //     //     'global_activity_id': null,
  //     //     'schedule_plan_activity_id': null,
  //     //     'moment_id': null,
  //     //     'name': activity.description,
  //     //     'plan' : null,
  //     //     'start_date' : activity.startDate,
  //     //     'end_date' : activity.endDate,
  //     //     'time' : null,
  //     //     'number_of_workers' : null,
  //     //     'group_id' : null,
  //     //     'state_number': 0,
  //     //     'sort_index': activity.sort_index
  //     //   });

  //     //   changes.push({
  //     //     'id': activity.id,
  //     //     'global_activity_id': newValues.parent,
  //     //     'schedule_plan_activity_id': newValues.parent,
  //     //     'moment_id': null,
  //     //     'name': activity.description,
  //     //     'plan' : null,
  //     //     'start_date' : activity.startDate,
  //     //     'end_date' : activity.endDate,
  //     //     'time' : null,
  //     //     'number_of_workers' : null,
  //     //     'group_id' : newValues.group_id,
  //     //     'state_number': 1,
  //     //     'sort_index': newSortIndex
  //     //   });

  //     //   newSortIndex++;
  //     //   insideMovedActivity = true;
  //     // }

  //     var insideParent: Moment = null;
  //     activity.moments.forEach(moment => {

  //       if (insideParent != null && Number(moment.state_number) < Number(insideParent.state_number)) {
  //         insideParent = null;
  //       }
  //       //if (CpspRef.cmp.selectedMomentsForStyleChange.some(u => u.projectId === this.project.id && u.moment.id === moment.id) || insideMovedActivity) {
  //       if (newValues.parent == moment.parent || (insideParent != null && Number(insideParent.state_number) <= Number(moment.state_number))) {

  //         if (newValues.parent == moment.parent) insideParent = moment;

  //         //novi moment je aktivitet i selektovani je bio aktivitet, potrebno je podesiti
  //         if (stateNumberOfNewFirstElement == 1 && moment.state_number == stateNumberOfNewFirstElement) {

  //           previousState.push({
  //             'id': moment.id,
  //             'global_activity_id': moment.global_activity_id == 0 ? null : moment.global_activity_id,
  //             'schedule_plan_activity_id': moment.schedule_plan_activity_id,
  //             'moment_id': moment.moment_id,
  //             'name': moment.name,
  //             'plan': moment.plan,
  //             'start_date': moment.start_date,
  //             'end_date': moment.end_date,
  //             'time': moment.time,
  //             'number_of_workers': moment.number_of_workers,
  //             'group_id': moment.group_id,
  //             'state_number': moment.state_number,
  //             'sort_index': moment.sort_index
  //           });

  //           changes.push({
  //             'id': moment.id,
  //             'global_activity_id': newValues.global_activity_id == 0 ? null : newValues.global_activity_id,
  //             'schedule_plan_activity_id': newValues.parent,
  //             'moment_id': moment.moment_id,
  //             'name': moment.name,
  //             'plan': moment.plan,
  //             'start_date': moment.start_date,
  //             'end_date': moment.end_date,
  //             'time': moment.time,
  //             'number_of_workers': moment.number_of_workers,
  //             'group_id': newValues.group_id,
  //             'state_number': moment.state_number,
  //             'sort_index': moment.sort_index
  //           });

  //         }

  //         // prvi nivo djece, potrebno je podesiti schedule_plan_activity_id i group id
  //         else if (moment.state_number == stateNumberOfNewFirstElement) {

  //           previousState.push({
  //             'id': moment.id,
  //             'global_activity_id': moment.global_activity_id == 0 ? null : moment.global_activity_id,
  //             'schedule_plan_activity_id': moment.schedule_plan_activity_id,
  //             'moment_id': moment.moment_id,
  //             'name': moment.name,
  //             'plan': moment.plan,
  //             'start_date': moment.start_date,
  //             'end_date': moment.end_date,
  //             'time': moment.time,
  //             'number_of_workers': moment.number_of_workers,
  //             'group_id': moment.group_id,
  //             'state_number': moment.state_number,
  //             'sort_index': moment.sort_index
  //           });

  //           changes.push({
  //             'id': moment.id,
  //             'global_activity_id': newValues.global_activity_id == 0 ? null : newValues.global_activity_id,
  //             'schedule_plan_activity_id': newValues.parent,
  //             'moment_id': moment.moment_id,
  //             'name': moment.name,
  //             'plan': moment.plan,
  //             'start_date': moment.start_date,
  //             'end_date': moment.end_date,
  //             'time': moment.time,
  //             'number_of_workers': moment.number_of_workers,
  //             'group_id': newValues.group_id,
  //             'state_number': moment.state_number,
  //             'sort_index': moment.sort_index
  //           });

  //           if (stateNumberOfNewFirstElement == 2) {
  //             this.scheduleService.changeScheduleGroup([{
  //               projectId: this.project.id,
  //               activityId: newValues.parent,
  //               parent: moment.id,
  //               parentType: "PLAN"
  //             }]);
  //           }
  //         }

  //         // elementi unutar nove grupe, koja je aktivitet, ali nisu direktna djeca, vec unuci itd...potrebno izmijeniti scheduleActivityId i stateNumber za njih, i podatke unutar grupe, novi aktivitet i moguce da je novi parentType
  //         else if (stateNumberOfNewFirstElement == 1) {

  //           previousState.push({
  //             'id': moment.id,
  //             'global_activity_id': moment.global_activity_id == 0 ? null : moment.global_activity_id,
  //             'schedule_plan_activity_id': moment.schedule_plan_activity_id,
  //             'moment_id': moment.moment_id,
  //             'name': moment.name,
  //             'plan': moment.plan,
  //             'start_date': moment.start_date,
  //             'end_date': moment.end_date,
  //             'time': moment.time,
  //             'number_of_workers': moment.number_of_workers,
  //             'group_id': moment.group_id,
  //             'state_number': moment.state_number,
  //             'sort_index': moment.sort_index
  //           });

  //           changes.push({
  //             'id': moment.id,
  //             'global_activity_id': newValues.global_activity_id == 0 ? null : newValues.global_activity_id,
  //             'schedule_plan_activity_id': moment.schedule_plan_activity_id,
  //             'moment_id': moment.moment_id,
  //             'name': moment.name,
  //             'plan': moment.plan,
  //             'start_date': moment.start_date,
  //             'end_date': moment.end_date,
  //             'time': moment.time,
  //             'number_of_workers': moment.number_of_workers,
  //             'group_id': moment.group_id,
  //             'state_number': moment.state_number,
  //             'sort_index': moment.sort_index
  //           });

  //           this.scheduleService.updateScheduleActivityIdInSchedulePlan([{
  //             planId: moment.id,
  //             scheduleActivityId: newValues.global_activity_id == 0 ? null : newValues.global_activity_id
  //           }]);

  //           this.scheduleService.updateStateNumberInSchedulePlan([{
  //             planId: moment.id,
  //             stateNumber: moment.state_number
  //           }]);

  //           if (moment.parent_type == "ACTIVITY") {
  //             this.scheduleService.changeScheduleGroup([{
  //               projectId: this.project.id,
  //               activityId: newValues.parent,
  //               parent: moment.parent,
  //               parentType: "STATE"
  //             }]);
  //           }
  //           else {
  //             this.scheduleService.changeScheduleGroup([{
  //               projectId: this.project.id,
  //               activityId: newValues.parent,
  //               parent: moment.parent,
  //               parentType: moment.parent_type
  //             }]);
  //           }

  //         }

  //         // za ostale elemente kojim je promijenjen samo state number, unutar nove grupe su
  //         else {

  //           this.scheduleService.updateStateNumberInSchedulePlan([{
  //             planId: moment.id,
  //             stateNumber: moment.state_number
  //           }]);

  //         }
  //       }
  //     });

  //   });

  //   this.scheduleService.changeSchedulePlan(changes);

  //   // this.listOfChangedFunctions.push(() => this.scheduleService.changeSchedulePlan(changes));
  //   // this.listOfPreviousFunctions.push(() => this.scheduleService.changeSchedulePlan(previousState));

  //   // CpspRef.cmp.addListContentToHistory();
  //   // historySchedulePlaner.addToQueue(
  //   //   ,
  //   //   () => this.scheduleService.changeSchedulePlan(previousState)
  //   // );
  //   // this.scheduleService.changeSchedulePlan(changes);

  // }

  async createNewMomentForGroup() {
    // historySchedulePlaner.addToQueue(() => true, () => true);

    let groupStartDate = null;
    let groupEndDate = null;
    const saveSelectedMoments = this.deepCopy(
      this.selectedMomentsForStyleChange
    );
    // set startDate and endDate of new group
    for(let i = 0; i < saveSelectedMoments.length; i++){
    // CpspRef.cmp.selectedMomentsForStyleChange.forEach((selected) => {


      let mom = this.returnSelectedMoment();
      // if (groupEndDate == null) {
      //   groupEndDate =
      //     selected.moment.endDate != undefined
      //       ? selected.moment.endDate
      //       : selected.moment.end_date;
      //   groupStartDate =
      //     selected.moment.startDate != undefined
      //       ? selected.moment.startDate
      //       : selected.moment.start_date;
      // } else {
      //   if (selected.planId == null) {
      //     groupEndDate = this.getSomeDate(
      //       selected.moment.endDate,
      //       groupEndDate,
      //       "after"
      //     );
      //     groupStartDate = this.getSomeDate(
      //       selected.moment.startDate,
      //       groupStartDate,
      //       "before"
      //     );
      //   } else {
      //     groupEndDate = this.getSomeDate(
      //       selected.moment.end_date,
      //       groupEndDate,
      //       "after"
      //     );
      //     groupStartDate = this.getSomeDate(
      //       selected.moment.start_date,
      //       groupStartDate,
      //       "before"
      //     );
      //   }
      // }

      if (groupEndDate == null) {
        groupEndDate = mom.dateSegments.at(-1).endDate;
        groupStartDate = mom.dateSegments.at(0).startDate
      } else {
        groupEndDate = this.getSomeDate(
          mom.dateSegments.at(-1).endDate,
          groupEndDate,
          "after"
        );
        groupStartDate = this.getSomeDate(
          mom.dateSegments.at(0).startDate,
          groupStartDate,
          "before"
        );
      }

      this.selectedMomentsForStyleChange.splice(0, 1);
    //});
    }
    this.selectedMomentsForStyleChange = this.deepCopy(saveSelectedMoments);

    //creating groupMoment as new one to add in array
    // let groupMoment = this.deepCopy(
    //   CpspRef.cmp.selectedMomentsForStyleChange[0].moment
    // );
    let groupMoment = this.deepCopy(
      CpspRef.cmp.selectedMomentsForStyleChange.at(0)
    );
    let idOfFirstSelected = groupMoment.id;
    //default styles
    groupMoment.styles.backgroundColor = "#fff";
    groupMoment.styles.color = "#000";
    groupMoment.styles.fontDecoration = "normal";
    groupMoment.styles.fontFamily = "Calibri";
    groupMoment.styles.fontSize = "13";
    groupMoment.styles.fontStyle = "normal";
    groupMoment.styles.fontWeight = "normal";
    groupMoment.tape_color = "#B6B1B1";
    groupMoment.time = 0;
    groupMoment.dateSegments.at(0).finishedTime = 0;
    groupMoment.number_of_workers = 0;
    groupMoment.part = null;
    groupMoment.plan = null;
    groupMoment.changed = true;
    groupMoment.dateSegments[0].connected = 0;
    groupMoment.dateSegments[0].connectedToPlan = null;
    groupMoment.dateSegments.length = 1;
    // groupMoment.monster = 0;

    let firstIsActivity = false;
    if (groupMoment.state_number == undefined) firstIsActivity = true;

    //creating new moment group for selected moments
    // var newMomentId = await this.scheduleService.createSchedulePlan(groupMoment.global_activity_id == 0 ? null : groupMoment.global_activity_id, groupMoment.schedule_plan_activity_id, null, "New plan", groupMoment.plan, groupMoment.start_date, groupMoment.end_date, null, null, groupMoment.group_id, groupMoment.state_number, groupMoment.sort_index, this.project.id);

    let newState = "STATE";
    let newNumberOfDays = this.getDaysBetweenDates(
      groupStartDate,
      groupEndDate
    );

    if (firstIsActivity) {
      groupMoment.id = -Math.round(Math.random() * 10000000); // groupMoment.id > 0 ? groupMoment.id * (-1) : groupMoment.id - 100;
      groupMoment.description = CpspRef.cmp.getTranslate().instant("New group");
      groupMoment.moments = [];
      groupMoment.percentage_of_realized_activity = 0;
      newState = "ACTIVITY";
      groupMoment.endDate = groupEndDate;
      groupMoment.startDate = groupStartDate;
      groupMoment.numberOfDays = newNumberOfDays;
      groupMoment.dateSegments[0].id = groupMoment.id;
      groupMoment.dateSegments[0].startDate = groupStartDate;
      groupMoment.dateSegments[0].endDate = groupEndDate;
      groupMoment.dateSegments[0].numberOfDays = newNumberOfDays;
      groupMoment.x =
        CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
          new Date(groupStartDate)
        );
    } else {
      groupMoment.id = -Math.round(Math.random() * 10000000); // groupMoment.id > 0 ? groupMoment.id * (-1) : groupMoment.id;
      groupMoment.default_moment_id = null;
      groupMoment.name = CpspRef.cmp.getTranslate().instant("New group");
      groupMoment.time = null;
      groupMoment.number_of_workers = null;

      groupMoment.percentage_of_realized_plan = 0;
      groupMoment.state = "STATE";
      if (groupMoment.state_number > 1) newState = "PLAN";

      groupMoment.start_date = groupStartDate;
      groupMoment.end_date = groupEndDate;
      groupMoment.dateSegments[0].startDate = groupStartDate;
      groupMoment.dateSegments[0].endDate = groupEndDate;
      groupMoment.dateSegments[0].numberOfDays = newNumberOfDays;
      groupMoment.dateSegments[0].id = groupMoment.id;
    }

    //creating moment with new information, to set existing moments
    let newValuesMoment: Moment = null;
    newValuesMoment = {
      id: groupMoment.id,
      global_activity_id:
        groupMoment.global_activity_id != undefined
          ? groupMoment.global_activity_id == "0"
            ? null
            : groupMoment.global_activity_id
          : null,
      activity_id: groupMoment.activity_id,
      schedule_plan_activity_id: groupMoment.schedule_plan_activity_id,
      moment_id: null,
      name: groupMoment.name,
      plan: groupMoment.plan,
      start_date: null,
      end_date: null,
      time: groupMoment.time,
      number_of_workers: groupMoment.number_of_workers,

      dateSegments: groupMoment.dateSegment,
      y: groupMoment.y,
      state: CpspRef.cmp.getTranslate().instant("New group"),
      state_number:
        Number(
          groupMoment.state_number != undefined ? groupMoment.state_number : 0
        ) + 1,
      parent: groupMoment.id,
      group_id: -1,
      parent_type: newState,
      percentage_of_realized_plan: null,
      sort_index: 1,
      moments: groupMoment.moments,
      tape_color: groupMoment.tape_color,
      styles: groupMoment.styles,
      part: groupMoment.part,
      monster: groupMoment.monster,
      changed: true,
    };

    // creating new moment in DB, creating new group DB, then setting new values on front
    // this.scheduleService.createSchedulePlan(
    //   groupMoment.global_activity_id != undefined ? (groupMoment.global_activity_id == "0" ? null : groupMoment.global_activity_id) : null,
    //   groupMoment.schedule_plan_activity_id != undefined ? groupMoment.schedule_plan_activity_id : null,
    //   null,
    //   "New group",
    //   groupMoment.plan != undefined ? groupMoment.plan : null,
    //   groupStartDate,
    //   groupEndDate,
    //   null,
    //   null,
    //   groupMoment.group_id != undefined ? groupMoment.group_id : null,
    //   groupMoment.state_number != undefined ? groupMoment.state_number : 0,
    //   groupMoment.sort_index,
    //   this.project.id
    // ).then(momentId => {

    //   this.idMoments.push(momentId);
    //   this.scheduleService.createScheduleGroup(
    //     this.project.id,
    //     groupMoment.activity_id != undefined ? groupMoment.activity_id : momentId,
    //     momentId,
    //     newState
    //   ).then(groupId => {
    //     this.idParentGroups.push(momentId);
    //     newValuesMoment.parent = momentId;
    //     newValuesMoment.group_id = groupId;

    //     // setting new moment and adding selected children in it
    //     var indexOfNew = -1;
    //     var positionOfNew = -1;
    //     var sortIndex = 1;
    //     var numOfNewChildren = 0;

    //     var previousValues = [];
    //     var changes = [];

    //     CpspRef.cmp.copySelectedProject.activities.forEach((activity, index) => {

    //       var insideMovedActivity = false;
    //       //dodati ovdje da se pomjere svi aktiviteti ispod, uvecati njihov y za 25, ovaj novi dodani red zbog new group
    //       if (indexOfNew != -1) {
    //         activity.y = activity.y + ConfigSc.cellHeight;
    //       }

    //       //if selected is activity, need to convert it in new moment
    //       if (firstIsActivity) {

    //         if (activity.id == groupMoment.id * (-1) || activity.id -100 == groupMoment.id) {
    //           indexOfNew = index;
    //         }
    //         if (CpspRef.cmp.selectedMomentsForStyleChange.some(u => u.projectId === this.project.id && u.activityId == activity.id && u.planId === null)) {

    //           var newM: Moment = {
    //             id: activity.id,
    //             global_activity_id: groupMoment.global_activity_id != undefined ? (groupMoment.global_activity_id == "0" ? null : groupMoment.global_activity_id) : null,
    //             activity_id: newValuesMoment.parent,
    //             schedule_plan_activity_id: newValuesMoment.parent,
    //             moment_id: activity.default_moment_id,
    //             name: activity.description != null ? activity.description : "",
    //             plan: activity.plan,
    //             start_date: activity.startDate,
    //             end_date: activity.endDate,
    //             time: activity.time,
    //             number_of_workers: activity.number_of_workers,

    //             dateSegments: activity.dateSegments,
    //             y: numOfNewChildren * ConfigSc.cellHeight,
    //             state: "STATE",
    //             state_number: 1,
    //             parent: newValuesMoment.parent,
    //             group_id: newValuesMoment.group_id,
    //             parent_type: newState,
    //             percentage_of_realized_plan: activity.percentage_of_realized_activity != null ? activity.percentage_of_realized_activity : (activity.moments.length > 0 ? 0 : null),
    //             sort_index: sortIndex,
    //             moments: [],
    //             tape_color: activity.tape_color,
    //             styles: activity.styles,
    //             part: activity.part,
    //             changed: false
    //           };

    //           if (activity.id < 0) {
    //             previousValues.push({ "planId": newValuesMoment.parent, "state": "ACTIVITY" });
    //             changes.push({ "planId": newValuesMoment.parent, "state": "STATE" });
    //           }
    //           else {
    //             previousValues.push({ "planId": activity.id, "state": "ACTIVITY" });
    //             changes.push({ "planId": activity.id, "state": "STATE" });
    //           }
    //           groupMoment.moments.push(newM);
    //           sortIndex++;
    //           insideMovedActivity = true;

    //           numOfNewChildren++;
    //         }
    //       }

    //       activity.moments.forEach((moment, position) => {

    //         // finds selected moments, sets new values for them
    //         if (CpspRef.cmp.selectedMomentsForStyleChange.some(u => u.projectId === this.project.id && u.activityId == moment.activity_id && u.planId === moment.id) || insideMovedActivity) {

    //           if (indexOfNew == -1) {
    //             //CpspRef.cmp.copySelectedProject.activities[index].moments.splice(position, 0, groupMoment);
    //             indexOfNew = index;
    //             positionOfNew = position;
    //           }

    //           //if first selected was moment, need to set selected moment in same level
    //           if (moment.state_number == groupMoment.state_number) {
    //             moment.parent = newValuesMoment.parent;
    //             moment.parent_type = newValuesMoment.parent_type;
    //             moment.group_id = newValuesMoment.group_id;
    //             moment.state_number = newValuesMoment.state_number;
    //             moment.state = newValuesMoment.state;
    //             moment.sort_index = newValuesMoment.sort_index;
    //             moment.schedule_plan_activity_id = newValuesMoment.parent;
    //             moment.y = numOfNewChildren * ConfigSc.cellHeight;

    //             newValuesMoment.sort_index++;
    //           }
    //           else {
    //             moment.state_number = Number(moment.state_number) + 1;
    //             moment.parent_type = moment.state_number == 2 ? "STATE" : "PLAN";
    //             moment.y = numOfNewChildren * ConfigSc.cellHeight;
    //           }

    //           numOfNewChildren++;

    //           if (firstIsActivity) {
    //             moment.activity_id = newValuesMoment.parent;
    //             groupMoment.moments.push(moment);
    //           }
    //         }

    //       });
    //     });

    //     historySchedulePlaner.appendToQueueGroup(
    //       () => this.scheduleService.changeSchedulePlanDetailState(changes),
    //       () => this.scheduleService.changeSchedulePlanDetailState(previousValues)
    //     );

    //     groupMoment.id = newValuesMoment.parent;

    //     sortIndex--;

    //     // first selected was activity, then new one is activity too, add to copySelectedProject
    //     if (firstIsActivity) {
    //       CpspRef.cmp.copySelectedProject.activities.splice(indexOfNew, sortIndex, groupMoment);
    //     }
    //     else {
    //       CpspRef.cmp.copySelectedProject.activities[indexOfNew].moments.splice(positionOfNew, 0, groupMoment);
    //     }

    //     // deep copy for opet/close items with children
    //     this.selectedProject = this.deepCopy(this.copySelectedProject)

    //     this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

    //     // adding data in DB, creating new moment and group for that new moment, connecting selected children to new moment
    //     historySchedulePlaner.appendToQueueGroup(
    //       () => { this.changeSchedulePlan(newValuesMoment); }
    //     );

    //   });

    // });

    // setting new moment and adding selected children in it
    let indexOfNew = -1;
    let positionOfNew = -1;
    let sortIndex = 1;
    let numOfNewChildren = 0;

    let previousValues = [];
    let changes = [];

    CpspRef.cmp.copySelectedProject.activities.forEach((activity, index) => {
      let insideMovedActivity = false;
      //dodati ovdje da se pomjere svi aktiviteti ispod, uvecati njihov y za 25, ovaj novi dodani red zbog new group
      if (indexOfNew != -1) {
        activity.y = activity.y + ConfigSc.cellHeight;
      }

      //if selected is activity, need to convert it in new moment
      if (firstIsActivity) {
        if (activity.id == idOfFirstSelected) {
          // if (activity.id == groupMoment.id * (-1) || activity.id -100 == groupMoment.id) {
          indexOfNew = index;
        }
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
          //     u.projectId === this.project.id &&
          //     u.activityId == activity.id &&
          //     u.planId === null
              u.id == activity.id
          )
        ) {
          var newM: Moment = {
            id: activity.id,
            global_activity_id:
              groupMoment.global_activity_id != undefined
                ? groupMoment.global_activity_id == "0"
                  ? null
                  : groupMoment.global_activity_id
                : null,
            activity_id: newValuesMoment.parent,
            schedule_plan_activity_id: newValuesMoment.parent,
            moment_id: activity.default_moment_id,
            name: activity.description != null ? activity.description : "",
            plan: activity.plan,
            start_date: activity.startDate,
            end_date: activity.endDate,
            time: activity.time,
            number_of_workers: activity.number_of_workers,

            dateSegments: activity.dateSegments,
            y: numOfNewChildren * ConfigSc.cellHeight,
            state: "STATE",
            state_number: 1,
            parent: newValuesMoment.parent,
            group_id: newValuesMoment.group_id,
            parent_type: newState,
            percentage_of_realized_plan:
              activity.percentage_of_realized_activity != null &&
              activity.moments.length > 0
                ? activity.percentage_of_realized_activity
                : activity.moments.length > 0
                ? 0
                : null,
            sort_index: sortIndex,
            moments: [],
            tape_color: activity.tape_color,
            styles: activity.styles,
            part: activity.part,
            monster: activity.monster,
            changed: true,
          };
          newM.dateSegments[0].numberOfDays = this.getBusinessDatesCount(
            activity.startDate,
            activity.endDate
          );

          this.updateNewColumnValue(groupMoment.id, newM.id, activity.id);
          if (activity.id < 0) {
            previousValues.push({
              planId: newValuesMoment.parent,
              state: "ACTIVITY",
            });
            changes.push({ planId: newValuesMoment.parent, state: "STATE" });
          } else {
            previousValues.push({ planId: activity.id, state: "ACTIVITY" });
            changes.push({ planId: activity.id, state: "STATE" });
          }
          groupMoment.moments.push(newM);
          sortIndex++;
          insideMovedActivity = true;

          numOfNewChildren++;
        }
      }

      activity.moments.forEach((moment, position) => {

        let parentIsSelected = false;
        let indexOfParents = position;

        while(indexOfParents != -1){
          parentIsSelected = CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) => u.id == activity.moments.at(indexOfParents).id
          );
          if(parentIsSelected) break;
          indexOfParents = activity.moments.findIndex(mom => mom.id == activity.moments.at(indexOfParents).parent);
        }
        // finds selected moments, sets new values for them
        if (
          // CpspRef.cmp.selectedMomentsForStyleChange.some(
          //   (u) =>
          //     // u.projectId === this.project.id &&
          //     // u.activityId == moment.activity_id &&
          //     // u.planId === moment.id
          //     u.id == moment.id //|| u.id == moment.parent
          // ) ||
          parentIsSelected ||
          insideMovedActivity
        ) {
          if (indexOfNew == -1) {
            //CpspRef.cmp.copySelectedProject.activities[index].moments.splice(position, 0, groupMoment);
            indexOfNew = index;
            positionOfNew = position;
          }

          //if first selected was moment, need to set selected moment in same level
          if (moment.state_number == groupMoment.state_number) {
            moment.parent = newValuesMoment.parent;
            moment.parent_type = newValuesMoment.parent_type;
            moment.group_id = newValuesMoment.group_id;
            moment.state_number = newValuesMoment.state_number;
            moment.state = newValuesMoment.state;
            moment.sort_index = newValuesMoment.sort_index;
            moment.schedule_plan_activity_id = newValuesMoment.parent;
            moment.y = numOfNewChildren * ConfigSc.cellHeight;
            moment.changed = true;
            newValuesMoment.sort_index++;
          } else {
            moment.state_number = Number(moment.state_number) + 1;
            moment.parent_type = moment.state_number == 2 ? "STATE" : "PLAN";
            moment.y = numOfNewChildren * ConfigSc.cellHeight;
            moment.changed = true;
          }

          numOfNewChildren++;

          if (firstIsActivity) {
            this.updateNewColumnValue(
              groupMoment.id,
              moment.id,
              moment.activity_id,
              false
            );
            moment.activity_id = newValuesMoment.parent;
            groupMoment.moments.push(moment);
          }
          // let select = this.selectedMomentsForStyleChange.find(u => u.projectId === this.project.id && u.activityId == moment.activity_id && u.planId === moment.id)
          // select.planId = moment.id;
          // select.activityId = moment.activity_id;
          // select.parent = moment.parent;
          // select.stateType = newValuesMoment.name
        }
      });
    });

    // historySchedulePlaner.appendToQueueGroup(
    //   () => this.scheduleService.changeSchedulePlanDetailState(changes),
    //   () => this.scheduleService.changeSchedulePlanDetailState(previousValues)
    // );

    groupMoment.id = newValuesMoment.parent;

    sortIndex--;
    // first selected was activity, then new one is activity too, add to copySelectedProject
    if (firstIsActivity) {
      CpspRef.cmp.copySelectedProject.activities.splice(
        indexOfNew,
        sortIndex,
        groupMoment
      );
    } else {
      CpspRef.cmp.copySelectedProject.activities[indexOfNew].changed = true;
      CpspRef.cmp.copySelectedProject.activities[indexOfNew].moments.splice(
        positionOfNew,
        0,
        groupMoment
      );
    }

    // deep copy for opet/close items with children
    this.selectedProject = this.deepCopy(this.copySelectedProject);

    //selectedContainer must be updated
    if (this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer && this.selectedMomentsForStyleChange.length > 1) {
      this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.setY(
        this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getY() +
          ConfigSc.cellHeight
      );
    } else if(this.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow){
      this.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow += 1;
      this.projectSchedulePlanerApp.projectMomentsContainer.marginTop +=
        ConfigSc.cellHeight;
      this.hideColumnValueInput();
      this.hidePlanInput();
      this.hideResourceWeekInput();
    }

    // this.selectedMomentsForStyleChange.forEach((selected, ind) => {
    //   if (selected.state_number < 1) {
    //     selected.planId = groupMoment.moments[ind].id;
    //     selected.activityId = groupMoment.id;
    //     selected.parent = groupMoment.id;
    //     selected.stateType = "STATE";
    //   } else {
    //     // selected.planId = groupMoment.moments[ind].id;
    //     // selected.parent = groupMoment.moments[ind].parent;
    //   }
    //   selected.state_number = Number(selected.state_number) + 1;
    // });

    this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer =
      null;
    this.selectedMomentsForStyleChange = [];
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
    );

    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

    // adding data in DB, creating new moment and group for that new moment, connecting selected children to new moment
    // historySchedulePlaner.appendToQueueGroup(
    //   () => { this.changeSchedulePlan(newValuesMoment); }
    // );

    // new element added to list, need to expend RowListContainer, so the last one is visible
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .getRowListContainer()
      .addRowNumber(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getLastRowPosition()
      );
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .setHeight(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getHeight() + ConfigSc.cellHeight
      );
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .getRowListContainer()
      .setHeight(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getHeight() + ConfigSc.cellHeight
      );
  }

  // update column values for column added of user
  updateNewColumnValue(
    activityIndex,
    planIndex,
    oldActivityIndex,
    newState = true
  ) {
    this.allColumns.forEach((col) => {
      if (col.key == null) {
        // if(!col.values[this.project.id].activities[oldActivityIndex]) continue;
        if (
          col.values[this.project.id] &&
          col.values[this.project.id].activities[oldActivityIndex]
        ) {
          let newColumnValue = newState
            ? col.values[this.project.id].activities[oldActivityIndex].value
            : col.values[this.project.id].activities[oldActivityIndex].plans[
                planIndex
              ];
          if (!col.values[this.project.id])
            col.values[this.project.id] = { activities: {}, value: "" };
          if (!col.values[this.project.id].activities[activityIndex])
            col.values[this.project.id].activities[activityIndex] = {
              plans: {},
              value: "",
            };
          if (
            planIndex !== 0 &&
            !col.values[this.project.id].activities[activityIndex].plans[
              planIndex
            ]
          )
            col.values[this.project.id].activities[activityIndex].plans[
              planIndex
            ] = "";
          // const oldValue = planIndex === 0 ? col.values[this.project.id].activities[activityIndex].value : col.values[this.project.id].activities[activityIndex].plans[planIndex];
          if (planIndex === 0 || planIndex == null) {
            if (
              col.values[this.project.id].activities[activityIndex].value ==
              newColumnValue
            )
              return;
            col.values[this.project.id].activities[activityIndex].value =
              newColumnValue;
          } else {
            if (
              col.values[this.project.id].activities[activityIndex].plans[
                planIndex
              ] == newColumnValue
            )
              return;
            col.values[this.project.id].activities[activityIndex].plans[
              planIndex
            ] = newColumnValue;
          }
        }
      }
    });
  }

  getScheduleActivity(activity) {
    this.scheduleService
      .getScheduleActivity(this.project.id, activity.id)
      .then((obj) => {
        this.copySelectedProject.activities.find(
          (a) => a.id == activity.id
        ).moments[0].global_activity_id = obj[0]["id"];
        this.copySelectedProject.activities.find(
          (a) => a.id == activity.id
        ).moments[0].schedule_plan_activity_id = obj[0]["id"];
      });
  }

  sortMoments() {
    this.selectedProject.activities.forEach((activity) => {
      activity.moments.sort((a, b) => {
        if (a.parent_type == "ACTIVITY" || a.parent_type == "STATE") return -1;
        if (a.parent < b.parent) return -1;
        else if (a.parent > b.parent) return 1;
        return 0;
      });
    });
  }

  deepCopy<T>(instance: T): T {
    if (instance == null) {
      return instance;
    }

    // handle Dates
    if (instance instanceof Date) {
      return new Date(instance.getTime()) as any;
    }

    // handle Array types
    if (instance instanceof Array) {
      var cloneArr = [] as any[];
      (instance as any[]).forEach((value) => {
        cloneArr.push(value);
      });
      // for nested objects
      return cloneArr.map((value: any) => this.deepCopy<any>(value)) as any;
    }
    // handle objects
    if (instance instanceof Object) {
      var copyInstance = { ...(instance as { [key: string]: any }) } as {
        [key: string]: any;
      };
      for (var attr in instance) {
        if ((instance as Object).hasOwnProperty(attr))
          copyInstance[attr] = this.deepCopy<any>(instance[attr]);
      }
      return copyInstance as T;
    }
    // handling primitive data types
    return instance;
  }

  public getDaysBetweenDates(date_start: string, date_end: string) {
    var days = 0;
    if (date_start && date_end) {
      var date1 = new Date(date_start);
      var date2 = new Date(date_end);
      days = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
      if (days >= 0) days++;
      else days--; // +1 becouse I need to include end date day
    }
    return days;
  }

  public getWorkingDaysBetweenDates(date_start: string, date_end: string) {
    let days = 0;
    let st_day = moment(date_start,ConfigSc.dateFormat).add(1,"days");
    let end_day = moment(date_end,ConfigSc.dateFormat);
    while(this.isWeekend(st_day)){
      st_day.add(1,"days")
    }
    days = end_day.diff(st_day,"days");
    return days;
  }

  getSomeDate(date1: string, date2: string, order: String) {
    if (date1 == null) return date2;
    if (order == "before") {
      if (date1 <= date2) return date1; // if equal returns date1
      return date2;
    } else {
      if (date1 < date2) return date2;
      return date1; // if equal returns date1
    }
  }

  getDaysInMonts() {
    let startYear = this.currentYear - 1;
    let endYear = this.currentYear + 1;
    let years = this.years(startYear, endYear);

    years.forEach((year) => {
      let months = this.getMonts(year);
      let object = { year, months };
      this.calendar.push(object);
    });

    this.calendar[0]["months"].splice(0, 11);
    this.calendar[2]["months"].splice(2, 10);
  }

  private getMonts(year) {
    const objArray = [];
    this.months.forEach((month) => {
      let numberOfMonth = moment().month(month).format("M");
      let date = year + "-" + numberOfMonth + "-" + 1;
      let momentDate = moment(date, "YYYY-MM-DD");
      let days = momentDate.daysInMonth();
      let daysInMonthArray = Array.from(Array(days + 1).keys());
      daysInMonthArray.splice(0, 1);
      let daysObject = this.getDays(daysInMonthArray, year, numberOfMonth);
      let monthIndex = momentDate.month();

      let obj = {
        year: year,
        name: month,
        daysNumber: days,
        daysInMonthArray: daysInMonthArray,
        days: daysObject,
        monthIndex: monthIndex,
      };
      objArray.push(obj);
    });

    return objArray;
  }

  private years(start, end) {
    let years = [];
    for (var i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
  }

  private getDays(daysInMonthArray, year, numberOfMonth) {
    const objArray = [];
    daysInMonthArray.forEach((day) => {
      let arrayOfSingleDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      var dayOfDate;
      var monthOfDate;

      if (arrayOfSingleDigits.includes(day)) dayOfDate = "0" + day;
      else dayOfDate = day;

      if (arrayOfSingleDigits.includes(+numberOfMonth))
        monthOfDate = "0" + numberOfMonth;
      else monthOfDate = numberOfMonth;

      let datum = year + "-" + monthOfDate + "-" + dayOfDate;
      let momentDatum = moment(datum, "YYYY-MM-DD");
      let week = momentDatum.week();
      let isoWeek = momentDatum.isoWeek();
      let dayIndex = momentDatum.day();
      let dayName = this.weekDays[dayIndex];

      let obj = {
        date: datum,
        dateDay: day,
        week: week,
        isoWeek: isoWeek,
        dayIndex: dayIndex,
        dayName: dayName,
      };
      objArray.push(obj);
    });

    return objArray;
  }

  toastrMessage(type: "success" | "error" | "info", message: string) {
    this.toastr[type](
      message,
      this.translate.instant(type.charAt(0).toUpperCase() + type.slice(1))
    );
  }

  getTranslate() {
    return this.translate;
  }

  private async changeMomentsStyleProperty(
    property: string,
    value: string | number
  ) {
    const changes = [];
    const previousState = [];

    CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {

      activity.moments.forEach((moment) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              // u.projectId === this.project.id &&
              // u.stateType === moment.state &&
              // u.planId === moment.id &&
              // u.stateType != null
              u.id == moment.id
          )
        ) {
          if(moment.name == null || moment.name == "") return;
          if (
            property == "fontWeight" ||
            property == "fontStyle" ||
            property == "fontDecoration"
          ) {
            //font decoration can be normal, underline and crossed
            value = moment.styles[property] == value ? "normal" : value;
          }

          changes.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: moment.state,
            planId: moment.id,
            value,
          });

          previousState.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: moment.state,
            planId: moment.id,
            value: moment.styles[property],
          });
          moment.styles[property] = value;
        }
      });

      //if we need to change activity styles
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
            // u.projectId === this.project.id &&
            // u.planId == null &&
            // u.stateType == null &&
            // u.activityId === activity.id
            u.id == activity.id
        )
      ) {
        if(activity.description == null || activity.description == "") return;
        if (
          property == "fontWeight" ||
          property == "fontStyle" ||
          property == "fontDecoration"
        ) {
          value = activity.styles[property] == value ? "normal" : value;
        }

        if (activity.number != "") {
          changes.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: null,
            planId: null,
            value,
          });

          previousState.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: null,
            planId: null,
            value: activity.styles[property],
          });
        } else {
          changes.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: null,
            planId: activity.id,
            value,
          });

          previousState.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: null,
            planId: activity.id,
            value: activity.styles[property],
          });
        }
        activity.styles[property] = value;
      }
    });
    this.selectedProject = this.deepCopy(this.copySelectedProject);

    historySchedulePlaner.addToQueue(
      () => this.scheduleService.changeStatesStyleProperty(property, changes),
      () =>
        this.scheduleService.changeStatesStyleProperty(property, previousState)
    );

  }

  private async changeTapeStyleProperty(property: string, value: string) {
    const changes = [];
    const previousState = [];
    // var activity_index = 0;


    CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
      // var moment_index = 0;
      if(activity.description == null || activity.description == "") return;
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
          // u.projectId === this.project.id &&
          // u.activityId === activity.id
          u.id == activity.id
        )
      ) {
        changes.push({
          projectId: this.project.id,
          activityId: activity.id,
          stateType: null,
          planId: null,
          value,
        });

        previousState.push({
          projectId: this.project.id,
          activityId: activity.id,
          stateType: null,
          planId: null,
          value: activity.tape_color,
        });

        activity.tape_color = value;
        // CpspRef.cmp.copySelectedProject.activities[activity_index].tape_color = value;
      }
      activity.moments.forEach((moment) => {
        if(moment.name == null || moment.name == "") return;
        //if moment is actitivet take schedule_plan_state_id, else take plan id

        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              // u.projectId === this.project.id &&
              // u.planId === moment.id &&
              // u.state_number == moment.state_number &&
              // u.planId != null &&
              // u.stateType != null
              u.id == moment.id
          )
        ) {
          changes.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: moment.state,
            planId: moment.id,
            value,
          });

          previousState.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: moment.state,
            planId: moment.id,
            value: moment.tape_color,
          });

          moment.tape_color = value;
          // CpspRef.cmp.copySelectedProject.activities[activity_index].moments[moment_index].tape_color = value;
        }

        // moment_index++;
      });
      // activity_index++;
    });

    this.selectedProject = this.deepCopy(this.copySelectedProject);

    historySchedulePlaner.addToQueue(
      () => this.scheduleService.changeStatesStyleProperty(property, changes),
      () =>
        this.scheduleService.changeStatesStyleProperty(property, previousState)
    );


  }

  backgroundColorInputValueChanged(value) {
    this.changeMomentsStyleProperty("backgroundColor", value);
    this.changeBackgroundColorInputValue = value;
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    if(window.innerWidth < 1920){
      this.projectSchedulePlanerApp.projectMomentsContainer.getCanvas().getChildren().forEach((child) => {
        child.draw();
      });
      this.hideColorPicker();
    }
    // if (this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null)
    //   this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
  }

  backgroundColorInputValueOpen(value) {
    if(window.innerWidth >= 1920)
      this.projectSchedulePlanerApp.mainHeader.closeDropDowns();
    const slides = document.getElementsByClassName("color-picker");
    for (var i = 0; i < slides.length; i++) {
      const slide = slides[i];

      if (slide instanceof HTMLElement && window.innerWidth >= 1920) {
        slide.style.left = 649 + "px";
        slide.style.top = 49 + 'px';
      } else if(slide instanceof HTMLElement)
      {
        slide.style.left = 478 + "px";
        slide.style.top = CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition + 'px';
        }
    }
  }

  textColorInputValueChanged(value) {
    this.changeMomentsStyleProperty("color", value);
    this.changeTextColorInputValue = value;
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    if(window.innerWidth < 1920){
      this.projectSchedulePlanerApp.projectMomentsContainer.getCanvas().getChildren().forEach((child) => {
        child.draw();
      });
      this.hideColorPicker();
    }
    // if (this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null)
    // 	this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
  }

  hideColorPicker(){
    const slides = document.getElementsByClassName("color-picker");
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (slide instanceof HTMLElement ) {
          slide.style.display = "none"
        }
      }
  }

  backgroundTapeColorInputValueOpen(value: string) {
    if(window.innerWidth >= 1920)
      this.projectSchedulePlanerApp.mainHeader.closeDropDowns();
    const slides = document.getElementsByClassName("color-picker");
    for (var i = 0; i < slides.length; i++) {
      const slide = slides[i];

      if (slide instanceof HTMLElement && window.innerWidth >= 1920) {
        slide.style.left = 1105 + "px";
        slide.style.top = 49 + 'px';
      } else if(slide instanceof HTMLElement)
      {
        slide.style.left = 638 + "px";
        slide.style.top = CpspRef.cmp.projectSchedulePlanerApp.mainHeader.colorPickerTopPosition + 'px';
        }
    }
    // this.backgroundTapeColorInputValueChanged("#B6B1B1");
  }

  backgroundTapeColorInputValueChanged(value: string) {
    this.changeTapeStyleProperty("tapeColor", value);
    this.changeBackgroundTapeColorInputValue = value;
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    if(window.innerWidth < 1920){
      this.projectSchedulePlanerApp.projectMomentsContainer.getCanvas().getChildren().forEach((child) => {
        child.draw();
      });
      this.hideColorPicker();
    }
  }

  fontSizeInputValueChanged(e) {
    const value = +e.target.value;
    this.changeMomentsStyleProperty("fontSize", value);
    this.changeFontSizeInputValue = value;
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    // if (this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null)
    //   this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
  }

  fontWeightInputValueChanged(value) {
    this.changeFontWeightInputValue = !this.changeFontWeightInputValue;
    this.changeMomentsStyleProperty("fontWeight", value);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    // if (this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null)
    //   this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
  }

  fontStyleInputValueChanged(value) {
    this.changeFontStyleInputValue = !this.changeFontStyleInputValue;
    this.changeMomentsStyleProperty("fontStyle", value);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    // if (this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null)
    // 	this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
  }

  fontDecorationInputValueChanged(value) {
    this.changeFontDecorationInputValue = !this.changeFontDecorationInputValue;
    this.changeMomentsStyleProperty("fontDecoration", value);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    // if (this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null)
    // 	this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
  }

  fontFamilyInputValueChanged(e) {
    const value = e.target.value;
    this.changeMomentsStyleProperty("fontFamily", value);
    this.changeFontFamilyInputValue = value;
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  changeProjectWorkingHours(property: string, oldValue, newValue) {
    historySchedulePlaner.addToQueue(
      () =>
        this.scheduleService.changeScheduleProjectWorkingHours(
          this.project.id,
          newValue
        ),
      () =>
        this.scheduleService.changeScheduleProjectWorkingHours(
          this.project.id,
          oldValue
        )
    );
  }

  hoursProjectInputValueChanged(value) {
    // const value = parseInt(e.target.value, 10);
    this.changeProjectWorkingHours(
      "hoursProject",
      this.changeHoursOnProject,
      value
    );
    this.changeHoursOnProject = value;
    this.workingHours = value;
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  }

  private changePercentageOfActivity(activity, newPercentage){
    // let days =
    // moment(activity.endDate, ConfigSc.dateFormat).diff(
    //   activity.startDate,
    //   "days"
    // ) + 1;
    let days = 0;// this.getBusinessDatesCount(activity.startDate, activity.endDate);
    activity.dateSegments.forEach(dateSegment => {
      days += this.getBusinessDatesCount(dateSegment.startDate, dateSegment.endDate);
    })
    days = Math.round(days * (newPercentage / 100));

    // activity.dateSegments[0].startDate = activity.startDate;
    // activity.dateSegments[0].startWeekDate = moment(
    //   activity.startDate,
    //   ConfigSc.dateFormat
    // ).format(ConfigSc.dateWeekFormat);
    // activity.dateSegments[0].endDate = activity.endDate;
    // activity.dateSegments[0].endWeekDate = moment(
    //   activity.endDate,
    //   ConfigSc.dateFormat
    // ).format(ConfigSc.dateWeekFormat);

    const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];

    let currDay = moment(activity.dateSegments.at(0).startDate);

    while (days > 1){
      currDay.add(1,"days");
      if(!this.isWeekend(currDay) && this.inDateSegment(activity,currDay))
        days--;

    }

    activity.dateSegments[0].currentWorkDate = newPercentage + '%' + currDay.format(ConfigSc.dateFormat);

    if(percentageWork.length > 2){
      activity.dateSegments[0].currentWorkDate += "%" + percentageWork.at(2);
    }
    // moment(
    //   activity.startDate,
    //   ConfigSc.dateFormat
    // )
    //   .add(days > 0 ? days - 1 : days, "days")
    //   .format(ConfigSc.dateFormat);
    activity.dateSegments[0].startWorkDate = activity.startDate;

    activity.dateSegments[0].finishedTime = Math.round(
      (activity.time * newPercentage) / 100
    );
    activity.changed = true;
  }

  private changePercentageOfMoment(moment, newPercentage){
    // let days =
    // momentM(moment.end_date, ConfigSc.dateFormat).diff(
    //   moment.start_date,
    //   "days"
    // ) + 1;
    let days = 0;// = this.getBusinessDatesCount(moment.start_date, moment.end_date);
    moment.dateSegments.forEach(dateSegment => {
      days += this.getBusinessDatesCount(dateSegment.startDate, dateSegment.endDate);
    })
    days = Math.round(days * (newPercentage / 100));

    moment.dateSegments[0].startWorkDate = moment.start_date;

    const percentageWork = moment.dateSegments[0].currentWorkDate != null ? moment.dateSegments[0].currentWorkDate.split("%") : [];


    let currDay = momentM(moment.dateSegments.at(0).startDate);

    while (days > 1){
      currDay.add(1,"days");
      if(!this.isWeekend(currDay) && this.inDateSegment(moment,currDay))
        days--;

    }

    moment.dateSegments[0].currentWorkDate = newPercentage + '%' + currDay.format(ConfigSc.dateFormat);

    if(percentageWork.length > 2){
      moment.dateSegments[0].currentWorkDate += "%" + percentageWork.at(2);
    }
    // momentM(
    //   moment.dateSegments[0].startWorkDate != null
    //     ? moment.dateSegments[0].startWorkDate
    //     : moment.start_date,
    //   ConfigSc.dateFormat
    // )
    //   .add(days > 0 ? days - 1 : days, "days")
    //   .format(ConfigSc.dateFormat);

    moment.dateSegments[0].finishedTime = Math.round(
      (moment.time * newPercentage) / 100
    );

    if(moment.state_number)
      this.copySelectedProject.activities.find((a) => a.id == moment.activity_id).changed = true;

    moment.changed = true;
  }

  private inDateSegment(moment,currDay){
    for(let i = 0; i < moment.dateSegments.length; i++){
      if(currDay.format(ConfigSc.dateFormat) >= moment.dateSegments.at(i).startDate &&
      currDay.format(ConfigSc.dateFormat) <= moment.dateSegments.at(i).endDate)
        return true;
    }
    return false;
  }

  private async changePercentageOfRealizedPlanState(newPercentage: number,addToQueFirst = true) {

    CpspRef.cmp.copySelectedProject.activities.forEach((activity) => {
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
          // u.projectId === this.project.id &&
          u.id === activity.id
        )
      ) {
        this.changePercentageOfActivity(activity,newPercentage);

      }

      activity.moments.forEach((moment) => {

        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              u.id === moment.id //&&
              // u.stateType == moment.state
          )
        ) {

          this.changePercentageOfMoment(moment,newPercentage);
        }
      });
    });

    this.selectedProject = this.deepCopy(this.copySelectedProject);
    if (addToQueFirst)
      historySchedulePlaner.addToQueue(
        () => true,
        () => true
      );
  }

  private async changePlansDetails(newValues) {
    var previousValue;

    CpspRef.cmp.selectedProject.activities.forEach((activity) => {
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
            // u.projectId === this.project.id &&
            // u.activityId == activity.id &&
            // u.planId === null &&
            // u.activityId === newValues.id
            u.id == activity.id &&
            u.id === newValues.id
        )
      ) {
        previousValue = activity;
        activity.styles.backgroundColor = newValues.styles.backgroundColor;
        activity.styles.color = newValues.styles.color;
        activity.styles.fontSize = newValues.styles.fontSize;
        activity.styles.fontWeight = newValues.styles.fontWeight;
        activity.styles.fontFamily = newValues.styles.fontFamily;
        activity.styles.fontStyle = newValues.styles.fontStyle;
        activity.styles.fontDecoration = newValues.styles.fontDecoration;
        activity.tape_color = newValues.tape_color;
        activity.percentage_of_realized_activity =
          newValues.percentage_of_realized_activity;
        activity.dateSegments[0].startWorkDate =
          newValues.dateSegments[0].startWorkDate;
        activity.dateSegments[0].currentWorkDate =
          newValues.dateSegments[0].currentWorkDate;
        activity.dateSegments[0].connected =
          newValues.dateSegments[0].connected;
        activity.dateSegments[0].connectedToPlan =
          newValues.dateSegments[0].connectedToPlan;
        activity.dateSegments[0].noted = newValues.dateSegments[0].noted;
        activity.dateSegments[0].noteText = newValues.dateSegments[0].noteText;
      }

      activity.moments.forEach((moment) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              // u.projectId === this.project.id &&
              // u.activityId == moment.activity_id &&
              // u.planId === moment.id &&
              // moment.id == newValues.id
              u.id === moment.id &&
              moment.id == newValues.id
          )
        ) {
          previousValue = moment;
          moment.state = newValues.state;
          moment.styles.backgroundColor = newValues.styles.backgroundColor;
          moment.styles.color = newValues.styles.color;
          moment.styles.fontSize = newValues.styles.fontSize;
          moment.styles.fontWeight = newValues.styles.fontWeight;
          moment.styles.fontFamily = newValues.styles.fontFamily;
          moment.styles.fontStyle = newValues.styles.fontStyle;
          moment.styles.fontDecoration = newValues.styles.fontDecoration;
          moment.tape_color = newValues.tape_color;
          moment.percentage_of_realized_plan =
            newValues.percentage_of_realized_plan;
          moment.dateSegments[0].startWorkDate =
            newValues.dateSegments[0].startWorkDate;
          moment.dateSegments[0].currentWorkDate =
            newValues.dateSegments[0].currentWorkDate;
          moment.dateSegments[0].connected =
            newValues.dateSegments[0].connected;
          moment.dateSegments[0].connectedToPlan =
            newValues.dateSegments[0].connectedToPlan;
          moment.dateSegments[0].noted = newValues.dateSegments[0].noted;
          moment.dateSegments[0].noteText = newValues.dateSegments[0].noteText;
        }
      });
    });

    historySchedulePlaner.appendToQueueGroup(
      () =>
        this.scheduleService.changePlansDetails(
          newValues.id,
          newValues.state != undefined ? newValues.state : "ACTIVITY",
          newValues.styles.backgroundColor,
          newValues.styles.color,
          newValues.styles.fontSize,
          newValues.styles.fontWeight,
          newValues.styles.fontFamily,
          newValues.styles.fontStyle,
          newValues.styles.fontDecoration,
          newValues.tape_color,
          newValues.state != undefined
            ? newValues.percentage_of_realized_plan
            : newValues.percentage_of_realized_activity,
          newValues.dateSegments[0].startWorkDate,
          newValues.dateSegments[0].currentWorkDate,
          newValues.dateSegments[0].connected,
          newValues.dateSegments[0].connectedToPlan,
          newValues.dateSegments[0].noted,
          newValues.dateSegments[0].noteText
        ),
      () =>
        this.scheduleService.changePlansDetails(
          previousValue.id,
          previousValue.state != undefined ? previousValue.state : "ACTIVITY",
          previousValue.styles.backgroundColor,
          previousValue.styles.color,
          previousValue.styles.fontSize,
          previousValue.styles.fontWeight,
          previousValue.styles.fontFamily,
          previousValue.styles.fontStyle,
          previousValue.styles.fontDecoration,
          previousValue.tape_color,
          previousValue.state != undefined
            ? previousValue.percentage_of_realized_plan
            : previousValue.percentage_of_realized_activity,
          previousValue.dateSegments[0].startWorkDate,
          previousValue.dateSegments[0].currentWorkDate,
          previousValue.dateSegments[0].connected,
          previousValue.dateSegments[0].connectedToPlan,
          previousValue.dateSegments[0].noted,
          previousValue.dateSegments[0].noteText
        )
    );
  }

  getPlanById(id) {
    for (let i = 0; i < this.schedulePlanState.length; i++) {
      if (this.schedulePlanState[i].id == id) return this.schedulePlanState[i];
    }
    return null;
  }

  returnSelectedMoment(displayed = false) {
    var m = null;
    var y = 0;
    for (
      let i = 0;
      i < CpspRef.cmp.copySelectedProject.activities.length;
      i++
    ) {
      const activity = displayed ? CpspRef.cmp.selectedProject.activities[i] : CpspRef.cmp.copySelectedProject.activities[i];
      y++;
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
            // u.projectId === this.project.id &&
            // u.activityId === activity.id &&
            // u.planId == null
            u.id == activity.id
        )
      ) {
        m = activity;
        m.y = (y - 1) * ConfigSc.cellHeight;
        return m;
      }

      for (let j = 0; j < activity.moments.length; j++) {
        const moment = activity.moments[j];
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              // u.projectId === this.project.id &&
              // u.activityId == moment.activity_id &&
              // u.planId === moment.id
              u.id == moment.id
          )
        ) {
          m = moment;
          m.y = y * ConfigSc.cellHeight;
          return m;
        }
        y++;
      }
    }
    return m;
  }

  returnAllSelectedMoments() {
    this.copySelectedProject = this.selectedProject;
    const length = this.selectedMomentsForStyleChange.length;
    let selectedMoments = [];

    for (let i = 0; i < length; i++) {
      selectedMoments.push(this.returnSelectedMoment());
      CpspRef.cmp.selectedMomentsForStyleChange.shift();
    }

    return this.deepCopy(selectedMoments);
  }

  getMomentByPosition(positionX: number, positionY: number) {
    var y = 0;
    var m = null;
    for (let j = 0; j < CpspRef.cmp.selectedProject.activities.length; j++) {
      //CpspRef.cmp.selectedProject.activities.forEach(activity => {
      let activity = CpspRef.cmp.selectedProject.activities[j];
      y++;
      if (
        (y - 1) * ConfigSc.cellHeight <= positionY &&
        positionY <= y * ConfigSc.cellHeight
      ) {
        if (
          this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
            new Date(activity.dateSegments.at(-1).endDate)
          ) > positionX &&
          positionX >
            this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
              new Date(activity.dateSegments.at(0).startDate)
            )
        ) {
          m = activity;
          return m;
        }
      }

      for (let i = 0; i < activity.moments.length; i++) {
        const moment = activity.moments[i];
        if (
          y * ConfigSc.cellHeight < positionY &&
          y * ConfigSc.cellHeight + ConfigSc.cellHeight > positionY
        ) {
          if (
            this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
              new Date(moment.dateSegments.at(-1).endDate)
            ) >= positionX &&
            positionX >=
              this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                new Date(moment.dateSegments.at(0).startDate)
              )
          ) {
            m = moment;
            return m;
          }
        }
        y++;
      }

      //});
    }
    return m;
  }

  addNewLineConnection(m1, m2,addToHistory = true) {

    //potrebno je prvo pomjeriti datume, pa onda srediti sve sto treba sa ovim konekcijama, odrediti poziciju linije, pocetak i kraj
    let endDateOfFirst = m1.dateSegments.at(-1).endDate; // m1.end_date != undefined ? m1.end_date : m1.endDate;
    let startDateOfSecond = m2.dateSegments.at(0).startDate
      // m2.start_date != undefined ? m2.start_date : m2.startDate;
    // let daysDiference = this.getDaysBetweenDates(
    //   endDateOfFirst,
    //   startDateOfSecond
    // );

    // if (daysDiference > 0) daysDiference = daysDiference - 2; //need to exclude start and end date from calculation

    let daysDiference = this.getWorkingDaysBetweenDates(
      endDateOfFirst,
      startDateOfSecond
    );

    let temperarySelectedMoments = this.deepCopy(
      CpspRef.cmp.selectedMomentsForStyleChange
    );

    let momentIndexForPush;
    let actIndex;
    if(m2.state_number){
      actIndex = this.copySelectedProject.activities.findIndex(activity => activity.id == m2.activity_id  );
      momentIndexForPush = this.copySelectedProject.activities.at(actIndex).moments.findIndex(mom => mom.id == m2.id);
    } else {
      actIndex = this.copySelectedProject.activities.findIndex(activity => activity.id == m2.id);
    }

    CpspRef.cmp.selectedMomentsForStyleChange = [];
    if (m2.end_date != undefined)
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   projectId: CpspRef.cmp.selectedProject.id,
      //   activityId: m2.activity_id,
      //   moment: m2.state_number ? this.copySelectedProject.activities.at(actIndex).moments.at(momentIndexForPush) : this.copySelectedProject.activities.at(actIndex),
      //   stateType: m2.state,
      //   planId: m2.id,
      //   y: m2.y,
      //   state_number: m2.state_number,
      //   parent: m2.parent,
      // });
      CpspRef.cmp.selectedMomentsForStyleChange.push(
        m2.state_number ? this.copySelectedProject.activities.at(actIndex).moments.at(momentIndexForPush) : this.copySelectedProject.activities.at(actIndex)
      );
    else
      // CpspRef.cmp.selectedMomentsForStyleChange.push({
      //   projectId: CpspRef.cmp.selectedProject.id,
      //   activityId: m2.id,
      //   moment: m2.state_number ? this.copySelectedProject.activities.at(actIndex).moments.at(momentIndexForPush) : this.copySelectedProject.activities.at(actIndex),
      //   stateType: m2.state,
      //   planId: null,
      //   y: m2.y,
      //   state_number: m2.state_number,
      //   parent: m2.parent,
      // });
      CpspRef.cmp.selectedMomentsForStyleChange.push(
        m2.state_number ? this.copySelectedProject.activities.at(actIndex).moments.at(momentIndexForPush) : this.copySelectedProject.activities.at(actIndex)
      );


    this.changeMomentsDate(-1 * daysDiference, false,0,false);

    this.lineConnections.push({ m1, m2 });
    CpspRef.cmp.selectedMomentsForStyleChange = this.deepCopy(
      temperarySelectedMoments
    );

    var oldValueM1 = this.deepCopy(m1);
    oldValueM1.dateSegments[0].connected = 0;
    oldValueM1.dateSegments[0].connectedToPlan = null;
    this.changeSchedulePlanDetails(oldValueM1, m1);
    if(addToHistory)
    this.addListContentToHistory(true);

    return m2.dateSegments.at(-1).endDate;
  }

  removeLineConnection(m) {
    this.lineConnections.splice(
      this.lineConnections.findIndex((obj) => obj.m1.id == m.id),
      1
    );
    this.changePlansDetails(m);
  }

  drawConnections() {
    this.lineConnections.forEach((m) => {
      //if not complete line connection or something other problem
      if(m.m1 == null || m.m2 == null) return;
      let y = 0;
      let bothEndsVisible = 0;
      CpspRef.cmp.selectedProject.activities.forEach((activity) => {
        y++;
        activity.moments.forEach((moment) => {
          if (m.m1.id == moment.id) {
            m.m1.dateSegments[0].x =
              this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                new Date(moment.dateSegments.at(-1).endDate)
              ) + ConfigSc.cellWidth;
            m.m1.dateSegments[0].y =
              y * ConfigSc.cellHeight + ConfigSc.cellHeight / 2;
            m.m1.start_date = moment.dateSegments.at(0).startDate;
            m.m1.end_date = moment.dateSegments.at(-1).endDate;
            bothEndsVisible++;
          }
          if (m.m2.id == moment.id) {
            m.m2.dateSegments[0].x =
              this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                new Date(moment.dateSegments.at(0).startDate)
              );
            m.m2.dateSegments[0].y =
              y * ConfigSc.cellHeight + ConfigSc.cellHeight / 4;
            m.m2.start_date = moment.dateSegments.at(0).startDate;
            m.m2.end_date = moment.dateSegments.at(-1).endDate;
            bothEndsVisible++;
          }
          y++;
        });

        if (m.m1.id == activity.id) {
          m.m1.dateSegments[0].x =
            this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
              new Date(activity.dateSegments.at(-1).endDate)
            ) + ConfigSc.cellWidth;
          m.m1.dateSegments[0].y =
            (y - 1) * ConfigSc.cellHeight + ConfigSc.cellHeight / 2;
          m.m1.start_date = activity.dateSegments.at(0).startDate;
          m.m1.end_date = activity.dateSegments.at(0).endDate;
          bothEndsVisible++;
        }
        if (m.m2.id == activity.id) {
          m.m2.dateSegments[0].x =
            this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
              new Date(activity.dateSegments.at(0).startDate)
            );
          m.m2.dateSegments[0].y =
            (y - 1) * ConfigSc.cellHeight + ConfigSc.cellHeight / 4;
          m.m2.start_date = activity.dateSegments.at(0).startDate;
          m.m2.end_date = activity.dateSegments.at(-1).endDate;
          bothEndsVisible++;
        }
      });

      if (bothEndsVisible == 2) {
        const currentXWidth = m.m1.dateSegments[0].x;

        const x1GDx2 = m.m1.dateSegments[0].x > m.m2.dateSegments[0].x;
        const y1GDy2 = m.m1.dateSegments[0].y > m.m2.dateSegments[0].y;
        const halfY =
          Math.abs(m.m1.dateSegments[0].y - m.m2.dateSegments[0].y) * 0.5;

        const cX = currentXWidth + 50 * (y1GDy2 ? -1 : 1);

        const cY = x1GDx2
          ? m.m1.dateSegments[0].y + halfY * (y1GDy2 ? -1 : 1)
          : m.m1.dateSegments[0].y - halfY * (y1GDy2 ? 1 : -1);

        var newLine = new BezierCurve(
          m.m1.dateSegments[0].x * this.pixelRation,
          m.m1.dateSegments[0].y,
          cX * this.pixelRation,
          cY,
          m.m2.dateSegments[0].x * this.pixelRation,
          m.m2.dateSegments[0].y,
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getCanvas(),
          CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer()
        );
        newLine.setIsScheduleCurve();
        newLine.setFillColor("#000000");
        newLine.setColor("#000000");
        newLine.setLineThickness(2);
        CpspRef.cmp.projectSchedulePlanerApp.gridContainer.addLineConnection(
          newLine
        );
      }
    });
  }

  percentageOfRealizedPlanStateChanged(newPercentage: number) {
    this.changePercentageOfRealizedPlanState(newPercentage);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  }

  createDatePicker(selector: string, beforeShowDay: boolean = true) {
    const language = sessionStorage.getItem("lang");
    const options = {
      format: "yyyy-mm-dd",
      calendarWeeks: true,
      autoclose: true,
      language: language,
      currentWeek: true,
      todayHighlight: true,
      currentWeekTransl: language === "en" ? "Week" : "Vecka",
      currentWeekSplitChar: "-",
      beforeShowDay: (date) => {
        if (!beforeShowDay) {
          return { enabled: true };
        }

        const dateString = moment(date).format(ConfigSc.dateFormat);
        return {
          enabled: this.enabledDatesInDatePicker.indexOf(dateString) !== -1,
        };
      },
    };

    return $(selector).datepicker(options);
  }

  updateDatePicker(selector, beforeShowDay: boolean = true) {
    /*$(selector).datepicker('destroy');
		this.createDatePicker(selector, beforeShowDay);*/
    $(selector).datepicker("refresh");
  }

  debounce(func, time = 500) {
    let timer;
    return (event) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, time, event);
    };
  }

  changeLatestEndDate(newDate) {
    let newLatestEndDate = null;
    if (ConfigSc.latestEndDate != null)
      newLatestEndDate = this.getSomeDate(
        moment(ConfigSc.latestEndDate, ConfigSc.dateFormat).format(
          ConfigSc.dateFormat
        ),
        moment(newDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat),
        "after"
      );
    else ConfigSc.latestEndDate = newDate;

    if (newLatestEndDate != ConfigSc.latestEndDate) {
      this.setLoadingStatus(true);
      let start = String(ConfigSc.latestEndDate).substring(0, 7);
      ConfigSc.latestEndDate = newLatestEndDate;
      if (String(ConfigSc.latestEndDate).startsWith(start)) {
        this.setLoadingStatus(false);
        return false;
      }
      if (this.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar())
        this.gridSliderY = this.projectSchedulePlanerApp.gridContainer
          .getVerticalScrollbar()
          .getSlider()
          .getY();


      this.projectSchedulePlanerApp.mainCanvas.getChildren().forEach(child =>{
        this.projectSchedulePlanerApp.mainCanvas.removeChildById(child.getId())
      })

      // this.projectSchedulePlanerApp.remove()
      // this.projectSchedulePlanerApp = new ProjectSchedulePlanerApp(this);
      this.projectSchedulePlanerApp.createAllCanvasesAndComponents(this,1,1,false);
      this.projectSchedulePlanerApp.sideSection.draw()

      this.setLoadingStatus(false);
      return true;
    }
    return false;
  }

  public isWeekend(date: moment.Moment) {
    const dayName = date.format("dddd");
    const day = this.workDays.find(day => day.name === dayName);
    return day.type === "0" || this.publicHolidayDates.some(holiday => holiday == date.format(ConfigSc.dateFormat));
  }

  // private getPercentage(percentage){
  //   let percentages = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
  //   for(let i = 0; i < percentages.length; i++){
  //     if(percentages[i] <= percentage) continue;
  //     if(Math.abs(percentage - percentages[i-1]) > Math.abs(percentages[i] - percentage))
  //     return percentages[i]
  //     return percentages[i-1]
  //   }
  //   return 1;
  // }

  //editing weeks

  changeMomentsDates(days: number, addToQueFirst = true, dateSegmentIndex = 0) {
    //check active revision
    if (
      this.property_index != this.revisions.length + 1 ||
      CpspRef.cmp.selectedMomentsForStyleChange.length == 0
    ) {
      return;
    }

    // let needUpdateParent = true;
    let needNewApp = false;
    CpspRef.cmp.copySelectedProject.activities.forEach(
      (activity, activityIndex) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              // u.planId == null &&
              // u.projectId === this.project.id &&
              // u.activityId === activity.id
              u.id === activity.id
          )
        ) {
          if (
            CpspRef.cmp.selectedMomentsForStyleChange.length == 1 &&
            activity.moments.length > 0
          ) {
            // needUpdateParent = false;
            activity.moments.forEach((mom) => {
              // CpspRef.cmp.selectedMomentsForStyleChange.push({
              //   projectId: CpspRef.cmp.selectedProject.id,
              //   activityId: activity.id,
              //   stateType: mom.state,
              //   planId: mom.id,
              //   state_number: mom.state_number,
              //   parent: mom.parent,
              //   moment: mom
              // });
              CpspRef.cmp.selectedMomentsForStyleChange.push(mom);
            });
          }
          if (
            activity.moments.length == 0 ||
            CpspRef.cmp.selectedMomentsForStyleChange.length > 1
          ) {
            //   return;
            // }

            //select all children on activity
            if (
              activity.moments.length > 0 &&
              activity.moments.length !=
                CpspRef.cmp.selectedMomentsForStyleChange.length - 1
            ) {
              historySchedulePlaner.undo();
              return;
            }

            activity.changed = true;

            for(let i = 0; i < activity.dateSegments.length; i++){
              let dateSegment = activity.dateSegments.at(i);

            // activity.dateSegments.forEach((dateSegment,dsIndex) => {

              if(i == dateSegmentIndex || dateSegmentIndex == 0){
                let daysBetween = this.getBusinessDatesCount(
                  this.selectedProject.activities.at(activityIndex).dateSegments.at(i-1).endDate,
                  this.selectedProject.activities.at(activityIndex).dateSegments.at(i).startDate);

                let newStartDate;
                if(i == 0 || dateSegmentIndex != 0){
                  newStartDate = moment(
                    dateSegment.startDate,
                    ConfigSc.dateFormat
                  ).add(days, "days");
                  while(this.isWeekend(newStartDate)){
                    newStartDate.add(days > 0 ? 1 : -1,"days");
                  }
                } else {
                  newStartDate = moment(
                    activity.dateSegments.at(i-1).endDate,
                    ConfigSc.dateFormat
                  );
                  while(daysBetween > 1){
                    newStartDate.add(days > 0 ? 1 : 1,"days");
                    if(!this.isWeekend(newStartDate))
                    daysBetween--;
                  }
                }

                let numDays = this.getBusinessDatesCount(dateSegment.startDate,dateSegment.endDate);
                const newEndDate = moment(
                  newStartDate
                );
                while(numDays > 1){
                  newEndDate.add(1,"days");
                  if(!this.isWeekend(newEndDate))
                    numDays--;
                }

                const formattedNewStartDate = newStartDate.format(
                  ConfigSc.dateFormat
                );
                const formattedNewEndDate = newEndDate.format(ConfigSc.dateFormat);

                activity.startDate = formattedNewStartDate;
                activity.endDate = formattedNewEndDate;
                activity.x = this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.startDate))

                dateSegment.startDate = formattedNewStartDate;
                dateSegment.startWeekDate = newStartDate.format(
                  ConfigSc.dateWeekFormat
                );

                dateSegment.endDate = formattedNewEndDate;
                dateSegment.endWeekDate = newEndDate.format(
                  ConfigSc.dateWeekFormat
                );

              }

            //})
          }




            // let oldWhiteDays;
            // if(activity.dateSegments[0].startWorkDate != null && activity.dateSegments[0].startWorkDate > activity.startDate){
            //   oldWhiteDays = this.getBusinessDatesCount(activity.startDate,activity.dateSegments[0].startWorkDate);
            // }



            const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
            if(activity.dateSegments[0].currentWorkDate != null){
              this.changePercentageOfActivity(activity,percentageWork[0])
            }
            else
              activity.dateSegments[0].currentWorkDate = null



            // if(oldWhiteDays){
            //   let newWhiteDays = moment(activity.startDate);
            //   while(oldWhiteDays > 1){
            //     newWhiteDays.add(1,"days");
            //     if(!this.isWeekend(newWhiteDays))
            //     oldWhiteDays--;
            //   }
            //   activity.dateSegments[0].startWorkDate = newWhiteDays.format(ConfigSc.dateFormat);
            //   activity.dateSegments[0].currentWorkDate = activity.endDate;
            // }
            // else if(activity.dateSegments[0].startWorkDate)
            //   activity.dateSegments[0].startWorkDate = activity.startDate;
            // else
            //   activity.dateSegments[0].startWorkDate = null;

            activity.numberOfDays =
              moment(activity.endDate).diff(moment(activity.startDate),"days") + 1;

            this.selectedProject.activities[activityIndex] =
              this.deepCopy(activity);

            this.needNewApp = this.changeLatestEndDate(activity.endDate);
            if (!needNewApp) needNewApp = this.needNewApp;
            else this.needNewApp = needNewApp;
            //activity.dateSegments[0].numberOfDays = newEndDate.diff(moment(m.dateSegments[0].startWorkDate == null ? m.dateSegments[0].startDate : m.dateSegments[0].startWorkDate, ConfigSc.dateFormat), 'days') + 1;
          }
        }
        activity.moments.forEach((m,mIndex) => {
          if (
            CpspRef.cmp.selectedMomentsForStyleChange.some(
              (u) =>
              // u.moment.id === m.id &&
              // u.moment.state_number == m.state_number
              u.id == m.id
            )
          ) {
            // if (
            //   days>-29 && days <29
            // ){
            //when selected parent and child, dont execute function for child because child moved with parent
            if (
              CpspRef.cmp.selectedMomentsForStyleChange.findIndex(
                (selected) =>
                // selected.planId == m.parent
                selected.id == m.parent
              ) != -1
            )
              return;

            let i = activity.moments.findIndex(
              (obj) => obj.id === m.id && obj.state_number == m.state_number
            );

            // const newStartDate = moment(
            //   m.dateSegments[0].startDate,
            //   ConfigSc.dateFormat
            // ).add(days, "days");
            // while(this.isWeekend(newStartDate)){
            //   newStartDate.add(days > 0 ? 1 : -1,"days");
            // }
            // let numDays = this.getBusinessDatesCount(m.start_date,m.end_date);
            // const newEndDate = moment(
            //   newStartDate,
            //   ConfigSc.dateFormat
            // );
            // while(numDays > 1){
            //   newEndDate.add(1,"days");
            //   if(!this.isWeekend(newEndDate))
            //     numDays--;
            // }
            // const formattedNewStartDate = newStartDate.format(
            //   ConfigSc.dateFormat
            // );
            // const formattedNewEndDate = newEndDate.format(ConfigSc.dateFormat);
              let copyAct = this.deepCopy(activity);
            for(let i = 0; i < m.dateSegments.length; i++){
              let dateSegment = m.dateSegments.at(i);

            // activity.dateSegments.forEach((dateSegment,dsIndex) => {

              if(i == dateSegmentIndex || dateSegmentIndex == 0){

                let daysBetween = this.getBusinessDatesCount(
                  copyAct.moments.at(mIndex).dateSegments.at(i-1).endDate,
                  copyAct.moments.at(mIndex).dateSegments.at(i).startDate);

                let newStartDate;
                if(i == 0 || dateSegmentIndex != 0){
                  newStartDate = moment(
                    dateSegment.startDate,
                    ConfigSc.dateFormat
                  ).add(days, "days");
                  while(this.isWeekend(newStartDate)){
                    newStartDate.add(days > 0 ? 1 : -1,"days");
                  }
                } else {
                  newStartDate = moment(
                    m.dateSegments.at(i-1).endDate,
                    ConfigSc.dateFormat
                  );
                  while(daysBetween > 1){
                    newStartDate.add(days > 0 ? 1 : 1,"days");
                    if(!this.isWeekend(newStartDate))
                    daysBetween--;
                  }
                }

                let numDays = this.getBusinessDatesCount(dateSegment.startDate,dateSegment.endDate);
                const newEndDate = moment(
                  newStartDate
                );
                while(numDays > 1){
                  newEndDate.add(1,"days");
                  if(!this.isWeekend(newEndDate))
                    numDays--;
                }

                const formattedNewStartDate = newStartDate.format(
                  ConfigSc.dateFormat
                );
                const formattedNewEndDate = newEndDate.format(ConfigSc.dateFormat);

                // activity.x = this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.startDate))

                dateSegment.startDate = formattedNewStartDate;
                dateSegment.startWeekDate = newStartDate.format(
                  ConfigSc.dateWeekFormat
                );

                dateSegment.endDate = formattedNewEndDate;
                dateSegment.endWeekDate = newEndDate.format(
                  ConfigSc.dateWeekFormat
                );

              }

            //})
            }

            m.start_date = m.dateSegments.at(0).startDate;
            m.end_date = m.dateSegments.at(-1).endDate;

            let oldWhiteDays;
            if(m.dateSegments[0].startWorkDate != null && m.dateSegments[0].startWorkDate > m.start_date){
              oldWhiteDays = this.getBusinessDatesCount(m.start_date,m.dateSegments[0].startWorkDate);
            }
            // if (formattedNewStartDate < activity.startDate) {
            //   if (
            //     needUpdateParent ||
            //     (!needUpdateParent && m.id == activity.moments.at(-1).id)
            //   )
            //     CpspRef.cmp.toastrMessage(
            //       "info",
            //       CpspRef.cmp
            //         .getTranslate()
            //         .instant("You can't move moment to start before activity!")
            //     );
            //   return;
            // }

            activity.changed = true;
            m.changed = true;

            // m.start_date = formattedNewStartDate;
            // m.dateSegments[0].startDate = formattedNewStartDate;
            // m.dateSegments[0].startWeekDate = newStartDate.format(
            //   ConfigSc.dateWeekFormat
            // );
            const percentageWork = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
            // // const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];

            // m.end_date = formattedNewEndDate;
            // m.dateSegments[0].endDate = formattedNewEndDate;
            // m.dateSegments[0].endWeekDate = newEndDate.format(
            //   ConfigSc.dateWeekFormat
            // );

            if(m.dateSegments[0].currentWorkDate != null){
              // let currnentMoment = moment(
              //   // m.dateSegments[0].currentWorkDate,
              //   currDay,
              //   ConfigSc.dateFormat
              // ).add(days, "days");
              // while(this.isWeekend(currnentMoment)){
              //   currnentMoment.add(days > 0 ? 1 : -1,"days");
              // }
              // m.dateSegments[0].currentWorkDate = percentageWork.length > 1 ?
              //   percentageWork[0] + "%" + currnentMoment.format(ConfigSc.dateFormat) :
              //   currnentMoment.format(ConfigSc.dateFormat);
              this.changePercentageOfMoment(m, percentageWork[0]);
            }
            else
              m.dateSegments[0].currentWorkDate = null

            // if(m.dateSegments[0].startWorkDate != null){
            //   let whiteDays = moment(
            //     m.dateSegments[0].startWorkDate,
            //     ConfigSc.dateFormat
            //   )
            //     .add(days, "days");
            //   while(this.isWeekend(whiteDays)){
            //     whiteDays.add(days > 0 ? 1 : -1,"days");
            //   }
            //   m.dateSegments[0].startWorkDate = whiteDays.format(ConfigSc.dateFormat);
            // }
            // else
            //   m.dateSegments[0].startWorkDate = null;




            if(oldWhiteDays){
              let newWhiteDays = moment(m.start_date);
              while(oldWhiteDays > 1){
                newWhiteDays.add(1,"days");
                if(!this.isWeekend(newWhiteDays))
                oldWhiteDays--;
              }
              m.dateSegments[0].startWorkDate = newWhiteDays.format(ConfigSc.dateFormat);
              // m.dateSegments[0].currentWorkDate = m.end_date;
            }
            else if(m.dateSegments[0].startWorkDate)
              m.dateSegments[0].startWorkDate = m.start_date;
            else
              m.dateSegments[0].startWorkDate = null;

            m.dateSegments[0].numberOfDays =
              moment(m.end_date).diff(moment(m.start_date),"days") + 1;

            if (activity.moments[i].percentage_of_realized_plan != null) {
              for (i = i + 1; i < activity.moments.length; i++) {
                if (activity.moments[i].state_number <= m.state_number) break;

                const newStartDateChild = moment(
                  activity.moments[i].dateSegments[0].startDate,
                  ConfigSc.dateFormat
                ).add(days, "days");
                while(this.isWeekend(newStartDateChild)){
                  newStartDateChild.add(days > 0 ? 1 : -1,"days");
                }
                let numDays = this.getBusinessDatesCount(activity.moments[i].start_date,activity.moments[i].end_date);
                const newEndDateChild = moment(
                  newStartDateChild,
                  ConfigSc.dateFormat
                );
                while(numDays > 1){
                  newEndDateChild.add(1,"days");
                  if(!this.isWeekend(newEndDateChild))
                    numDays--;
                }
                const formattedNewStartDateChild = newStartDateChild.format(
                  ConfigSc.dateFormat
                );
                const formattedNewEndDateChild = newEndDateChild.format(
                  ConfigSc.dateFormat
                );

                let oldWhiteDays;
                if(activity.moments[i].dateSegments[0].startWorkDate != null && activity.moments[i].dateSegments[0].startWorkDate > activity.moments[i].start_date){
                  oldWhiteDays = this.getBusinessDatesCount(activity.moments[i].start_date,activity.moments[i].dateSegments[0].startWorkDate);
                }

                activity.moments[i].start_date = formattedNewStartDateChild;
                activity.moments[i].dateSegments[0].startDate =
                  formattedNewStartDateChild;
                activity.moments[i].dateSegments[0].startWeekDate =
                  newStartDateChild.format(ConfigSc.dateWeekFormat);

                  activity.moments[i].end_date = formattedNewEndDateChild;
                  activity.moments[i].dateSegments[0].endDate =
                    formattedNewEndDateChild;
                  activity.moments[i].dateSegments[0].endWeekDate =
                    newEndDateChild.format(ConfigSc.dateWeekFormat);

                  const percentageWork = activity.moments[i].dateSegments[0].currentWorkDate != null ? activity.moments[i].dateSegments[0].currentWorkDate.split("%") : [];

                  if(activity.moments[i].dateSegments[0].currentWorkDate != null){
                    // let currnentMoment = moment(
                    //   activity.moments[i].dateSegments[0].currentWorkDate,
                    //   ConfigSc.dateFormat
                    // ).add(days, "days");
                    // while(this.isWeekend(currnentMoment)){
                    //   currnentMoment.add(days > 0 ? 1 : -1,"days");
                    // }
                    // activity.moments[i].dateSegments[0].currentWorkDate = currnentMoment.format(ConfigSc.dateFormat);
                    this.changePercentageOfMoment(activity.moments[i], percentageWork[0]);
                  }
                  else
                  activity.moments[i].dateSegments[0].currentWorkDate = null
                // activity.moments[i].dateSegments[0].currentWorkDate == null
                //   ? null
                //   : (activity.moments[i].dateSegments[0].currentWorkDate =
                //       moment(
                //         activity.moments[i].dateSegments[0].currentWorkDate,
                //         ConfigSc.dateFormat
                //       )
                //         .add(days, "days")
                //         .format(ConfigSc.dateFormat));
                // activity.moments[i].dateSegments[0].startWorkDate == null
                //   ? null
                //   : (activity.moments[i].dateSegments[0].startWorkDate = moment(
                //       activity.moments[i].dateSegments[0].startWorkDate,
                //       ConfigSc.dateFormat
                //     )
                //       .add(days, "days")
                //       .format(ConfigSc.dateFormat));


                  if(oldWhiteDays){
                    let newWhiteDays = moment(activity.moments[i].start_date);
                    while(oldWhiteDays > 1){
                      newWhiteDays.add(1,"days");
                      if(!this.isWeekend(newWhiteDays))
                      oldWhiteDays--;
                    }
                    activity.moments[i].dateSegments[0].startWorkDate = newWhiteDays.format(ConfigSc.dateFormat);
                    // activity.moments[i].dateSegments[0].currentWorkDate = activity.moments[i].end_date;
                  }
                  else if(activity.moments[i].dateSegments[0].startWorkDate)
                    activity.moments[i].dateSegments[0].startWorkDate = activity.moments[i].start_date;
                  else
                    activity.moments[i].dateSegments[0].startWorkDate = null;

                activity.moments[i].dateSegments[0].numberOfDays =
                  moment(activity.moments[i].end_date).diff(moment(activity.moments[i].start_date),"days") + 1;

                activity.moments[i].changed = true;
                this.updateParent(activity, activity.moments[i]);
              }
            }
            this.updateParent(activity, m);
          }
        });
      }
    );

    this.selectedProject = this.deepCopy(this.copySelectedProject);
    if (addToQueFirst)
      historySchedulePlaner.addToQueue(
        () => true,
        () => true
      );
    if (
      !this.needNewApp &&
      this.projectSchedulePlanerApp.projectMomentsContainer
    ) {
      // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView()
      // this.projectSchedulePlanerApp.gridContainer.draw()
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    }
  }

  getChildrenOfMoment(moment){
    let moments = [];
    let activity;
    if(moment.state_number){
      activity = this.copySelectedProject.activities.find(act => act.id == moment.activity_id);
      for(let i = activity.moments.findIndex(mom => mom.id == moment.id) + 1;
        i < activity.moments.length;
        i++){
          if(activity.moments.at(i).state_number <= moment.state_number)
          break;
          moments.push(activity.moments.at(i));
        }
    } else {
      // activity = this.copySelectedProject.activities.find(act => act.id == moment.id);
      for(let i = 0; i < moment.moments.length; i++){
        if(moment.moments.at(i).percentage_of_realized_plan == null)
          moments.push(moment.moments.at(i));
      }
    }

    return moments;
  }

  changeMomentsDate(days: number, addToQueFirst = true, dateSegmentIndex = 0,needRefresh = true) {
    //check active revision
    if (
      // this.property_index != this.revisions.length + 1
      (this.property_index != this.revisions.length + 1 && this.lockedRevision)
      // ||
      // CpspRef.cmp.selectedMomentsForStyleChange.length == 0
    ) {
      return;
    }

    // let needUpdateParent = true;
    let deleteTapes = [];
    let deleteTape = false;
    let maxEndDate;
    let endDate;
    //part of tape moved
    if(this.selectedMomentsForStyleChange.length === 1 && dateSegmentIndex != 0){
      let moment = this.selectedMomentsForStyleChange.at(0);
      if(
        (days < 0 &&
          momentM(moment.dateSegments.at(dateSegmentIndex).startDate).add(days,"days").add(-1,"days").format(ConfigSc.dateFormat) ==
          moment.dateSegments.at(dateSegmentIndex - 1).endDate
        )
        ){
        let workingDays = this.getBusinessDatesCount(
          moment.dateSegments.at(dateSegmentIndex).startDate,
          moment.dateSegments.at(dateSegmentIndex).endDate);
        const newEndDate = momentM(
          moment.dateSegments.at(dateSegmentIndex - 1).endDate
        );
        while(workingDays > 0){
          newEndDate.add(1,"days");
          if(!this.isWeekend(newEndDate))
            workingDays--;
        }
        moment.dateSegments.at(dateSegmentIndex - 1).endDate = newEndDate.format(ConfigSc.dateFormat);
        deleteTapes.push(moment.dateSegments.at(dateSegmentIndex).id);
        deleteTape = true
        moment.changed = true;
        if(moment.state_number){
          this.copySelectedProject.activities.find((a) => a.id == moment.activity_id).changed = true;
        }
        moment.dateSegments.splice(dateSegmentIndex, 1);



      } else if(
        days > 0 &&
        dateSegmentIndex != moment.dateSegments.length - 1 &&
        momentM(moment.dateSegments.at(dateSegmentIndex).endDate).add(days,"days").add(1,"days").format(ConfigSc.dateFormat) ==
        moment.dateSegments.at(dateSegmentIndex + 1).startDate
      ){

        let workingDays = this.getBusinessDatesCount(
          moment.dateSegments.at(dateSegmentIndex).startDate,
          moment.dateSegments.at(dateSegmentIndex).endDate);
        const newStartDate = momentM(
          moment.dateSegments.at(dateSegmentIndex + 1).startDate
        );
        while(workingDays > 0){
          newStartDate.add(-1,"days");
          if(!this.isWeekend(newStartDate))
            workingDays--;
        }
        moment.dateSegments.at(dateSegmentIndex + 1).startDate = newStartDate.format(ConfigSc.dateFormat);
        deleteTapes.push(moment.dateSegments.at(dateSegmentIndex).id);
        deleteTape = true
        moment.changed = true;
        if(moment.state_number){
          this.copySelectedProject.activities.find((a) => a.id == moment.activity_id).changed = true;
        }
        moment.dateSegments.splice(dateSegmentIndex, 1);

      } else {
        endDate = this.moveeTape(moment,days,addToQueFirst,dateSegmentIndex)
        if(maxEndDate == undefined || maxEndDate < endDate){
          maxEndDate = endDate
        }
      }
    } else {
      for(let i = 0; i < this.selectedMomentsForStyleChange.length; i++){
        let moment = this.selectedMomentsForStyleChange.at(i);
        if(this.selectedMomentsForStyleChange.find(mom => mom.id == moment.parent))
          continue;

        // only for tapes
        if(
          (moment.state_number && moment.percentage_of_realized_plan == null) ||
          (moment.state_number == undefined && moment.moments.length == 0)){
            endDate = this.moveeTape(moment,days,addToQueFirst,dateSegmentIndex)
            if(maxEndDate == undefined || maxEndDate < endDate){
              maxEndDate = endDate
            }
        } else {
          let childrens = this.getChildrenOfMoment(moment)
          childrens.forEach(childMoment => {
            endDate = this.moveeTape(childMoment,days)
            if(maxEndDate == undefined || maxEndDate < endDate){
              maxEndDate = endDate
            }}
            );
        }

      }
      if(needRefresh)
      this.needNewApp = this.changeLatestEndDate(maxEndDate)
    }





    this.selectedProject = this.deepCopy(this.copySelectedProject);
    if (addToQueFirst)
      historySchedulePlaner.addToQueue(
        () => deleteTape ? this.scheduleService.deleteSchedulePlan(deleteTapes) : true,
        () => true
      );
    if ( needRefresh &&
      !this.needNewApp &&
      this.projectSchedulePlanerApp.projectMomentsContainer
    ) {
      // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView()
      // this.projectSchedulePlanerApp.gridContainer.draw()
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    }
  }

  private moveeTape(tape, days: number, addToQueFirst = true, dateSegmentIndex = 0){
    // let needNewApp = false;
    let copyAct;
    let mIndex;
    let activityIndex;
    if(tape.state_number){
      activityIndex = this.copySelectedProject.activities.findIndex(activity => activity.id == tape.activity_id)
      copyAct = this.deepCopy(this.copySelectedProject.activities.at(activityIndex));
      mIndex = copyAct.moments.findIndex(mom => mom.id == tape.id);
      this.copySelectedProject.activities.at(activityIndex).changed = true;
      tape = this.copySelectedProject.activities.at(activityIndex).moments.at(mIndex);
    } else {
      copyAct = this.deepCopy(tape);
      activityIndex = this.copySelectedProject.activities.findIndex(activity => activity.id == tape.id);
      this.copySelectedProject.activities.at(activityIndex).changed = true;
      tape = this.copySelectedProject.activities.at(activityIndex)
    }
    for(let i = 0; i < tape.dateSegments.length; i++){
      let dateSegment = tape.dateSegments.at(i);

      if(i == dateSegmentIndex || dateSegmentIndex == 0){

        let daysBetween;
        if(tape.state_number){
          daysBetween = this.getBusinessDatesCount(
            copyAct.moments.at(mIndex).dateSegments.at(i-1).endDate,
            copyAct.moments.at(mIndex).dateSegments.at(i).startDate);
        } else {
          daysBetween = this.getBusinessDatesCount(
            this.selectedProject.activities.at(activityIndex).dateSegments.at(i-1).endDate,
            this.selectedProject.activities.at(activityIndex).dateSegments.at(i).startDate);
        }

        let newStartDate;
        if(i == 0 || dateSegmentIndex != 0){
          newStartDate = moment(
            dateSegment.startDate,
            ConfigSc.dateFormat
          ).add(days, "days");
          while(this.isWeekend(newStartDate)){
            newStartDate.add(days > 0 ? 1 : -1,"days");
          }
        } else {
          newStartDate = moment(
            tape.dateSegments.at(i-1).endDate,
            ConfigSc.dateFormat
          );
          while(daysBetween > 1){
            newStartDate.add(days > 0 ? 1 : 1,"days");
            if(!this.isWeekend(newStartDate))
            daysBetween--;
          }
        }

        let numDays = this.getBusinessDatesCount(dateSegment.startDate,dateSegment.endDate);
        const newEndDate = moment(
          newStartDate
        );
        while(numDays > 1){
          newEndDate.add(1,"days");
          if(!this.isWeekend(newEndDate))
            numDays--;
        }

        const formattedNewStartDate = newStartDate.format(
          ConfigSc.dateFormat
        );
        const formattedNewEndDate = newEndDate.format(ConfigSc.dateFormat);

        // activity.x = this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.startDate))

        dateSegment.startDate = formattedNewStartDate;
        dateSegment.startWeekDate = newStartDate.format(
          ConfigSc.dateWeekFormat
        );

        dateSegment.endDate = formattedNewEndDate;
        dateSegment.endWeekDate = newEndDate.format(
          ConfigSc.dateWeekFormat
        );

      }

    }

    tape.changed = true;

    const percentageWork = tape.dateSegments[0].currentWorkDate != null ? tape.dateSegments[0].currentWorkDate.split("%") : [];

    if(tape.dateSegments[0].currentWorkDate != null){

      this.changePercentageOfMoment(tape, percentageWork[0]);
    }
    else
      tape.dateSegments[0].currentWorkDate = null

      if(tape.state_number){
        tape.start_date = tape.dateSegments.at(0).startDate;
        tape.end_date = tape.dateSegments.at(-1).endDate;
        this.updateParent(this.copySelectedProject.activities.at(activityIndex), tape,false);
      } else {
        tape.startDate = tape.dateSegments.at(0).startDate;
        tape.endDate = tape.dateSegments.at(-1).endDate;
      }

    return tape.dateSegments.at(-1).endDate;
  }

  //end of editig weeks

  //split tape

  splitTapeF(days: number,endXLeftTape: number,startXRigthTape: number,endXRightTape: number,dateSegmentIndex: number, addToQueFirst = true) {
    //check active revision
    if (
      (this.property_index != this.revisions.length + 1 && this.lockedRevision)
      // ||
      // CpspRef.cmp.selectedMomentsForStyleChange.length == 0
    ) {
      return;
    }


    // let needUpdateParent = true;
    // let needNewApp = false;
    CpspRef.cmp.copySelectedProject.activities.forEach(
      (activity, activityIndex) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
              // u.planId == null &&
              // u.projectId === this.project.id &&
              // u.activityId === activity.id
              u.id === activity.id
          )
        ) {
          activity.changed = true;
          const leftTapeEndDate = moment(this.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(endXLeftTape)).add(-1,"days")
          const rigthTapeStartDate = moment(this.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(startXRigthTape))
          const rightTapeEndDate = moment(this.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(endXRightTape)).add(-1,"days")
          // let daysLeftTape = days/(ConfigSc.cellHeight * ConfigSc.cellWidth)

          while(this.isWeekend(leftTapeEndDate)){
            leftTapeEndDate.add(-1,"days")
          }

          while(this.isWeekend(rigthTapeStartDate)){
            rigthTapeStartDate.add(1,"days")
          }

          while(this.isWeekend(rightTapeEndDate)){
            rightTapeEndDate.add(1,"days")
          }


          activity.dateSegments.at(dateSegmentIndex).endDate = leftTapeEndDate.format(ConfigSc.dateFormat);
          activity.dateSegments.at(dateSegmentIndex).endWeekDate = leftTapeEndDate.format(ConfigSc.dateWeekFormat);

          const newDateSegment = {
            id: -Math.round(Math.random() * 10000000),
            startDate: rigthTapeStartDate.format(ConfigSc.dateFormat),
            endDate: rightTapeEndDate.format(ConfigSc.dateFormat),
            startWeekDate: rigthTapeStartDate.format(ConfigSc.dateWeekFormat),
            endWeekDate: rightTapeEndDate.format(ConfigSc.dateWeekFormat),
            numberOfDays: this.getDaysBetweenDates(
              rigthTapeStartDate.format(ConfigSc.dateFormat),
              rightTapeEndDate.format(ConfigSc.dateFormat)
            ),
            x: 0,
            y: 0,
            startWorkDate: activity.startDate,
            currentWorkDate:
              activity.dateSegments[0].currentWorkDate != null
                ? activity.dateSegments[0].currentWorkDate
                : null,
            connected: 0,
            connectedToPlan: null,
            noted: null,
            noteText: null,
            finishedTime: null,
          }

          this.insertAt(activity.dateSegments,dateSegmentIndex + 1,
              newDateSegment)

          // if(activity.dateSegments.length == dateSegmentIndex + 1){
          //   activity.dateSegments.push(newDateSegment)
          // } else {
          //   // activity.dateSegments.splice(dateSegmentIndex + 1, 0, newDateSegment);

          //   // this.insertAt(activity.dateSegments,dateSegmentIndex + 1,
          //   //   newDateSegment)
          // }


        }
        activity.moments.forEach((m) => {
          if (
            CpspRef.cmp.selectedMomentsForStyleChange.some(
              (u) =>
              // u.moment.id === m.id &&
              // u.moment.state_number == m.state_number
              u.id == m.id
            )
          ) {
            activity.changed = true;
            m.changed = true
          const leftTapeEndDate = moment(this.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(endXLeftTape)).add(-1,"days")
          const rigthTapeStartDate = moment(this.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(startXRigthTape))
          const rightTapeEndDate = moment(this.projectSchedulePlanerApp.daysMonthsContainer.findDateByXPosition(endXRightTape)).add(-1,"days")
          // let daysLeftTape = days/(ConfigSc.cellHeight * ConfigSc.cellWidth)

          while(this.isWeekend(leftTapeEndDate)){
            leftTapeEndDate.add(-1,"days")
          }

          while(this.isWeekend(rigthTapeStartDate)){
            rigthTapeStartDate.add(1,"days")
          }

          while(this.isWeekend(rightTapeEndDate)){
            rightTapeEndDate.add(1,"days")
          }

          m.dateSegments.at(dateSegmentIndex).endDate = leftTapeEndDate.format(ConfigSc.dateFormat);
          m.dateSegments.at(dateSegmentIndex).endWeekDate = leftTapeEndDate.format(ConfigSc.dateWeekFormat);

          const newDateSegment = {
            id: -Math.round(Math.random() * 10000000),
            startDate: rigthTapeStartDate.format(ConfigSc.dateFormat),
            endDate: rightTapeEndDate.format(ConfigSc.dateFormat),
            startWeekDate: rigthTapeStartDate.format(ConfigSc.dateWeekFormat),
            endWeekDate: rightTapeEndDate.format(ConfigSc.dateWeekFormat),
            numberOfDays: this.getDaysBetweenDates(
              rigthTapeStartDate.format(ConfigSc.dateFormat),
              rightTapeEndDate.format(ConfigSc.dateFormat)
            ),
            x: 0,
            y: 0,
            startWorkDate: m.start_date,
            currentWorkDate:
              m.dateSegments[0].currentWorkDate != null
                ? m.dateSegments[0].currentWorkDate
                : null,
            connected: 0,
            connectedToPlan: null,
            noted: null,
            noteText: null,
            finishedTime: null,
          }

          this.insertAt(m.dateSegments,dateSegmentIndex + 1,
              newDateSegment)
          }
        });
      }
    );

    this.selectedProject = this.deepCopy(this.copySelectedProject);
    if (addToQueFirst)
      historySchedulePlaner.addToQueue(
        () => true,
        () => true
      );
    if (
      !this.needNewApp &&
      this.projectSchedulePlanerApp.projectMomentsContainer
    ) {
      // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView()
      // this.projectSchedulePlanerApp.gridContainer.draw()
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    }
  }

  //end of split tape

  saveMoveTape(previousTape, newTape, previousStateDate, changesDate) {
    // historySchedulePlaner.addToQueue(
    //       () =>
    //         this.scheduleService.changeSchedulePlan(
    //           newTape
    //         )

    //       ,
    //       () =>
    //         this.scheduleService.changeSchedulePlan(
    //           previousTape
    //         )

    //     );
    historySchedulePlaner.addToQueue(
      () => this.scheduleService.changeSchedulePlanDate(newTape),
      () => this.scheduleService.changeSchedulePlanDate(previousTape)
    );
    historySchedulePlaner.appendToQueueGroup(
      () => this.scheduleService.changeSchedulePlanWorksDate(changesDate),
      () => this.scheduleService.changeSchedulePlanWorksDate(previousStateDate)
    );
    this.selectedProject = this.deepCopy(this.copySelectedProject);
    if (!this.needNewApp) {
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      // CpspRef.cmp.projectSchedulePlanerApp.gridContainer.getInnerContainer().removeAllChildren();
      // CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView()
      // this.projectSchedulePlanerApp.gridContainer.draw()
    }
  }

  //resize tape

  resizeTape(previousTape, newTape) {
    if (this.property_index != this.revisions.length + 1) {
      return;
    }

    let deleteTapes = [];
    let deleteTape = false;

    for(let i = 1; i < newTape.dateSegments.length; i++){
      const ds = newTape.dateSegments.at(i - 1);
      if(ds.endDate == newTape.dateSegments.at(i).startDate){
        let activity = this.copySelectedProject.activities.find((a) => a.id == newTape.activity_id)
        let moment = activity.moments.find((m) => m.id == newTape.id)
        moment.dateSegments.at(i - 1).endDate = moment.dateSegments.at(i).endDate;
        moment.dateSegments.at(i - 1).endWeekDate = moment.dateSegments.at(i).endWeekDate;
        deleteTapes.push(moment.dateSegments.at(i).id);
        moment.dateSegments.splice(i,1);
        deleteTape = true;
        activity.changed = true;
        moment.changed = true;
      }
    }

    historySchedulePlaner.addToQueue(
      () => deleteTape ? this.scheduleService.deleteSchedulePlan(deleteTapes) : true,
      () => true
    )

    if(deleteTape)
      this.selectedProject = this.deepCopy(this.copySelectedProject);

    if (!this.needNewApp) {
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    }
  }

  //end of resize tape

  //resize tape Activity

  resizeTapeActivity(previousTape, newTape) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }

    let deleteTapes = [];
    let deleteTape = false;

    for(let i = 1; i < newTape.dateSegments.length; i++){
      const ds = newTape.dateSegments.at(i - 1);
      if(ds.endDate == newTape.dateSegments.at(i).startDate){
        let activity = this.copySelectedProject.activities.find((a) => a.id == newTape.id)
        activity.dateSegments.at(i - 1).endDate = activity.dateSegments.at(i).endDate;
        activity.dateSegments.at(i - 1).endWeekDate = activity.dateSegments.at(i).endWeekDate;
        deleteTapes.push(activity.dateSegments.at(i).id);
        activity.dateSegments.splice(i,1);
        deleteTape = true;
        activity.changed = true;
      }
    }

    historySchedulePlaner.addToQueue(
      () => deleteTape ? this.scheduleService.deleteSchedulePlan(deleteTapes) : true,
      () => true
      )
    this.selectedProject = this.deepCopy(this.copySelectedProject);
    if (!this.needNewApp) {
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    }
  }

  //end of resize tape Activity

  findLastSortIndex(a: Activity, m: Moment, momentIsParent = false) {
    var index = 0;
    if (momentIsParent) {
      a.moments.forEach((mom) => {
        if (m.id == mom.parent) index = mom.sort_index;
      });
    } else {
      a.moments.forEach((mom) => {
        if (m.group_id == mom.group_id) index = mom.sort_index;
      });
    }
    return index;
  }

  //change hierarchy

  changeHierarchy(moveLeft: boolean) {
    //check active revision
    if ((this.property_index != this.revisions.length + 1 && this.lockedRevision)) {
      return;
    }


    // if(!moveLeft && this.selectedMomentsForStyleChange.length > 1 )
    if(moveLeft && this.selectedMomentsForStyleChange.length > 1
      && this.selectedMomentsForStyleChange[0].state != "STATE"
      // && this.selectedMomentsForStyleChange[0].stateType != "STATE"
    ){
      if(this.selectedMomentsForStyleChange[0].state_number == undefined) return;
      this.selectedMomentsForStyleChange.reverse();
    }
    for (
      let indSel = 0;
      indSel < this.selectedMomentsForStyleChange.length;
      indSel++
    ) {
      let selectedActivity = this.selectedMomentsForStyleChange.at(indSel);
      if(selectedActivity.state_number && this.selectedMomentsForStyleChange.some((m) => m.id == selectedActivity.parent))
      continue;
      // CpspRef.cmp.selectedMomentsForStyleChange.forEach((selectedActivity, indSel)=>{
      //added to loop through every selected moment because the activities forEach loop use splice method and the loop skips shifted elements
      if ( CpspRef.cmp.selectedMomentsForStyleChange.findIndex(
          (sp) =>
            // sp.state_number > 0 &&
            // ((sp.planId == null && sp.activityId == selectedActivity.parent) ||
            //   sp.planId == selectedActivity.parent)
            sp.state_number > 0 &&
            ((sp.id == selectedActivity.parent) ||
              sp.id == selectedActivity.parent)
        ) != -1
      ) {
        selectedActivity.state_number = moveLeft
          ? selectedActivity.state_number - 1
          : Number(selectedActivity.state_number) + 1;
        continue;
      }
      const ids = selectedActivity.activity_id ? selectedActivity.activity_id : selectedActivity.id

      let activity_index = this.copySelectedProject.activities.findIndex(
        (a) => a.id == ids
      );
      let activity = this.copySelectedProject.activities.find(
        (a) => a.id == ids
      );
      let m;
      if (selectedActivity.activity_id)
        m = activity.moments.find((m) => m.id == selectedActivity.id);
      //CpspRef.cmp.copySelectedProject.activities.forEach(async activity => {

      //added new activity in list of activity, need to increase sort_index of activities after new one
      //if (activityAdded == 1) activity.sort_index = Number(activity.sort_index) + 1;
      //removed one activity from list of activity, need to decrease sort_index of activities after removed one
      //if (activityAdded == -1) activity.sort_index = activity.sort_index - 1;
      //selected activity become child of another activity
      if (
        // (activity.id != null &&
        //   selectedActivity.activityId == activity.id &&
        //   selectedActivity.planId == null) ||
        // (selectedActivity.y == activity.y && selectedActivity.planId == null)
        (activity.id != null &&
          selectedActivity.id == activity.id)
      ) {
        if (!moveLeft && activity_index > 0) {
          if (
            activity.description == null ||
            activity.startDate == null ||
            activity.endDate == null ||
            this.copySelectedProject.activities[activity_index - 1].description == null
          )
            return;
          //condition
          // for(let k = 0; k < this.selectedMomentsForStyleChange.length; k++){
          //   let act = this.selectedMomentsForStyleChange[k].moment;
          //   if(act.startDate < this.copySelectedProject.activities[activity_index - 1].startDate){
          //     CpspRef.cmp.toastrMessage(
          //       "info",
          //       CpspRef.cmp.getTranslate().instant("You can't move moment to start before activity!")
          //     );
          //     return;

          //   }
          // }
          let moment_of_parent_activity;
          if (
            this.copySelectedProject.activities[activity_index - 1].moments
              .length != 0
          ) {
            moment_of_parent_activity =
              this.copySelectedProject.activities[activity_index - 1]
                .moments[0];
          }
          var lastIndex = 0;
          if (moment_of_parent_activity != undefined) {
            lastIndex = this.findLastSortIndex(
              activity,
              moment_of_parent_activity
            );
            // for(let i = 0;
            //   i < this.copySelectedProject.activities[activity_index - 1].moments.length;
            //   i++
            //   )
            // {
            //   if (moment_of_parent_activity.state_number == 1)
            //   lastIndex = Number(this.copySelectedProject.activities[activity_index - 1].moments[i].sort_index);
            // }
            this.copySelectedProject.activities[
              activity_index - 1
            ].moments.forEach((mom) => {
              if (mom.state_number == 1)
                lastIndex = Number(mom.sort_index);
            });
          }

          let changesPlan = [];
          let previousPlan = [];

          let activity_has_been_moment: Moment;
          activity_has_been_moment = {
            id: activity.id,
            global_activity_id:
              moment_of_parent_activity == undefined
                ? null
                : moment_of_parent_activity.global_activity_id,
            activity_id:
              this.copySelectedProject.activities[activity_index - 1].id,
            schedule_plan_activity_id:
              moment_of_parent_activity == undefined
                ? this.copySelectedProject.activities[activity_index - 1].id
                : moment_of_parent_activity.schedule_plan_activity_id,
            moment_id: activity.default_moment_id,
            name: activity.description,
            plan: activity.plan,
            start_date: activity.startDate,
            end_date: activity.endDate,
            time: activity.time,
            number_of_workers: activity.number_of_workers,
            state:
              moment_of_parent_activity == undefined
                ? "STATE"
                : moment_of_parent_activity.state,
            state_number:
              moment_of_parent_activity == undefined
                ? 1
                : moment_of_parent_activity.state_number,
            // dateSegments: [
            //   {
            //     id: activity.id,
            //     startDate: activity.startDate,
            //     endDate: activity.endDate,
            //     startWeekDate: activity.startWeekDate,
            //     endWeekDate: activity.endWeekDate,
            //     numberOfDays: this.getDaysBetweenDates(
            //       activity.startDate,
            //       activity.endDate
            //     ),
            //     x: 0,
            //     y: 0,
            //     startWorkDate: activity.startDate,
            //     currentWorkDate:
            //       activity.dateSegments[0].currentWorkDate != null
            //         ? activity.dateSegments[0].currentWorkDate
            //         : null,
            //     connected: 0,
            //     connectedToPlan: null,
            //     noted: null,
            //     noteText: null,
            //     finishedTime: activity.dateSegments[0].finishedTime,
            //   },
            // ],
            dateSegments: activity.dateSegments,
            styles: activity.styles,
            percentage_of_realized_plan:
              activity.percentage_of_realized_activity,
            y: activity.y,
            parent:
              moment_of_parent_activity == undefined
                ? this.copySelectedProject.activities[activity_index - 1].id
                : moment_of_parent_activity.parent,
            parent_type:
              moment_of_parent_activity == undefined
                ? "ACTIVITY"
                : moment_of_parent_activity.parent_type,
            tape_color: activity.tape_color,
            moments: [],
            group_id:
              moment_of_parent_activity == undefined
                ? -1
                : moment_of_parent_activity.group_id,
            sort_index:
              moment_of_parent_activity == undefined ? 1 : ++lastIndex,
            part: activity.part,
            monster: activity.monster,
            changed: true
          }


          var start_index_of_moments =
            this.copySelectedProject.activities[activity_index - 1].moments
              .length;
          var act_has_children = false;
          this.updateNewColumnValue(
            this.copySelectedProject.activities[activity_index - 1].id,
            activity_has_been_moment.id,
            activity_has_been_moment.id
          );
          this.copySelectedProject.activities[activity_index - 1].moments.push(
            activity_has_been_moment
          );
          this.copySelectedProject.activities[activity_index - 1].changed =
            true;
          // selectedActivity.planId = activity_has_been_moment.id;
          // selectedActivity.activityId = activity_has_been_moment.activity_id;
          // selectedActivity.state_number = activity_has_been_moment.state_number;
          // selectedActivity.moment = activity_has_been_moment;

          this.selectedMomentsForStyleChange.splice(indSel,1);
          this.selectedMomentsForStyleChange.splice(indSel,0,activity_has_been_moment);

          activity.moments.forEach((m) => {
            previousPlan.push({
              projectId: this.project.id,
              planId: m.id,
              value: m.state_number,
            });
            m.state_number = Number(m.state_number) + 1;
            m.state = activity_has_been_moment.name;
            m.activity_id = activity_has_been_moment.activity_id;
            m.changed = true;
            act_has_children = true;
            this.copySelectedProject.activities[
              activity_index - 1
            ].moments.push(m);
            changesPlan.push({
              projectId: this.project.id,
              planId: m.id,
              value: m.state_number,
            });
          });
          if(activity.moments.length > 0){
            const indexOfShowActivity = this.projectSchedulePlanerApp.projectMomentsContainer.show_activity ?
              this.projectSchedulePlanerApp.projectMomentsContainer.show_activity.findIndex(
                (e) => e.id == activity_has_been_moment.id
              ) : -1;
            if(indexOfShowActivity != -1){
              this.projectSchedulePlanerApp.projectMomentsContainer.show_states.push({
                id: activity_has_been_moment.id,
                show: this.projectSchedulePlanerApp.projectMomentsContainer.show_activity.at(indexOfShowActivity).show,
                state_number: activity_has_been_moment.state_number
              })
              this.projectSchedulePlanerApp.projectMomentsContainer.show_activity.splice(indexOfShowActivity,1)
            }

          }
          if (!act_has_children) {
            this.copySelectedProject.activities[activity_index - 1].moments[
              start_index_of_moments
            ].percentage_of_realized_plan = null;
          } else {
            if (
              this.copySelectedProject.activities[activity_index - 1].moments[
                start_index_of_moments
              ].percentage_of_realized_plan == null
            ) {
              this.copySelectedProject.activities[activity_index - 1].moments[
                start_index_of_moments
              ].percentage_of_realized_plan = 0;
            }
          }

          //update parent - activity above
          if (
            this.copySelectedProject.activities[activity_index - 1].moments
              .length == 1
          ) {
              this.copySelectedProject.activities[activity_index - 1].endDate =
                activity_has_been_moment.end_date;
              this.copySelectedProject.activities[
                activity_index - 1
              ].dateSegments[0].endDate = activity_has_been_moment.end_date;
              this.copySelectedProject.activities[activity_index - 1].startDate =
                activity_has_been_moment.start_date;
              this.copySelectedProject.activities[
                activity_index - 1
              ].dateSegments[0].startDate = activity_has_been_moment.start_date;
              //this.copySelectedProject.activities[activity_index-1].startDate = activity_has_been_moment.start_date;
              this.copySelectedProject.activities[
                activity_index - 1
              ].numberOfDays =
                moment(
                  this.copySelectedProject.activities[activity_index - 1]
                    .endDate,
                  ConfigSc.dateFormat
                ).diff(
                  moment(
                    this.copySelectedProject.activities[activity_index - 1]
                      .startDate,
                    ConfigSc.dateFormat
                  ),
                  "days"
                ) + 1;
          } else {
              //update endDate of parent
              if (
              activity_has_been_moment.end_date >
                this.copySelectedProject.activities[activity_index - 1].endDate ||
              this.copySelectedProject.activities[activity_index - 1].endDate ==
                null
            ) {
              this.copySelectedProject.activities[activity_index - 1].endDate =
                activity_has_been_moment.end_date;
              this.copySelectedProject.activities[
                activity_index - 1
              ].dateSegments[0].endDate = activity_has_been_moment.end_date;
            }

            //update startDate of parent
            if(activity_has_been_moment.start_date <
              this.copySelectedProject.activities[activity_index - 1].startDate ||
            this.copySelectedProject.activities[activity_index - 1].startDate ==
              null){
                this.copySelectedProject.activities[activity_index - 1].startDate =
                activity_has_been_moment.start_date;
              this.copySelectedProject.activities[
                activity_index - 1
              ].dateSegments[0].startDate = activity_has_been_moment.start_date;
              }

            this.copySelectedProject.activities[
              activity_index - 1
            ].numberOfDays =
              moment(
                this.copySelectedProject.activities[activity_index - 1].endDate,
                ConfigSc.dateFormat
              ).diff(
                moment(
                  this.copySelectedProject.activities[activity_index - 1]
                    .startDate,
                  ConfigSc.dateFormat
                ),
                "days"
              ) + 1;
          }

          this.copySelectedProject.activities.splice(activity_index, 1);

        }
      }
      //end of selected activity become child of another activity
      else if (m) {
        //activity.moments.forEach(m => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
            // u.planId === m.id &&
            // u.moment.state_number == m.state_number
            u.id == m.id
          )
        ) {
          var parent_index = activity.moments.findIndex(
            (obj) =>
              obj.id == m.parent && obj.state_number == m.state_number - 1
          );

          //click on moveLeft
          if (moveLeft && m.state_number > 0) {
            var moment_has_been_activity: Activity;
            let oldIndex = activity.moments.findIndex((mom) => mom.id == m.id);
            //selected moment state_number!=1
            if (parent_index != -1) {
              m.parent = activity.moments[parent_index].parent;
              m.group_id = activity.moments[parent_index].group_id;
              m.parent_type = activity.moments[parent_index].parent_type;
              m.state_number -= 1;
              selectedActivity.state_number = m.state_number;
              selectedActivity.parent = m.parent;
              m.sort_index =
                Number(activity.moments[parent_index].sort_index) + 1;
              //moment with state_number 1 dont have moment_id
              if (m.state_number == 1) {
                m.parent_type = "ACTIVITY";
                m.moment_id = null;
              }
              m.schedule_plan_activity_id =
                activity.moments[parent_index].schedule_plan_activity_id;
              //CpspRef.cmp.selectedMomentsForStyleChange[0].state_number-=1;
              m.state = activity.moments[parent_index].state;
              if (m.state_number == 1)
                m.plan = activity.moments[parent_index].plan;
              if (activity.moments[parent_index].state_number == 1)
                m.parent_type = "STATE";
              else m.parent_type = "PLAN";

              // if(activity.moments[parent_index].state_number == activity.moments[parent_index + 1].state_number){
              //   activity.moments[parent_index].start_date = activity.moments[parent_index].dateSegments[0].startWorkDate;
              // }
            } else {
              m.parent = null;
              m.group_id = null;
              m.parent_type = null;
              // m.state_number-=1;
              m.state = "ACTIVITY";
              m.sort_index = Number(activity.sort_index) + 1 + indSel; //number of changes is order number of moments when multiselect hierarchy change
              selectedActivity.planId = null;
              selectedActivity.activityId = m.id;
              selectedActivity.state_number = m.state_number - 1;
              selectedActivity.parent = null;
              m.percentage_of_realized_plan = null;
              moment_has_been_activity = {
                id: m.id,
                number: "",
                description: m.name,
                styles: m.styles,
                moments: [],
                startDate: m.start_date,
                endDate: m.end_date,
                startWeekDate: null,
                endWeekDate: null,
                numberOfDays: m.dateSegments[0].numberOfDays,
                y: 0,
                x: this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                  new Date(m.start_date)
                ),
                resourceWeeks: null,
                countAsResources: false,
                percentage_of_realized_activity: 0,
                sort_index: m.sort_index,
                tape_color: m.tape_color,
                dateSegments: m.dateSegments,
                number_of_workers: m.number_of_workers,
                time: m.time,
                default_moment_id: m.moment_id,
                plan: m.plan,
                part: m.part,
                changed: true,
              };
            }

            var show_index = activity.moments.findIndex(
              (obj) => obj.id === m.id && obj.state_number == m.state_number
            );
            activity.changed = true;
            m.changed = true;
            //move all children of selected moment
            // activity.moments[show_index].percentage_of_realized_plan!=null
            if (
              show_index < activity.moments.length - 1 &&
              activity.moments[show_index + 1].parent ==
                activity.moments[show_index].id
            ) {
              for (var i = show_index + 1; i < activity.moments.length; i++) {
                if (Number(activity.moments[i].state_number) - 1 <= Number(m.state_number))
                  break;
                if (parent_index == -1 && Number(activity.moments[i].state_number) <= 1)
                  break;
                activity.moments[i].state_number = Number(activity.moments[i].state_number) - 1;
                activity.moments[i].changed = true;
                if (m.state_number == 1) {
                  activity.moments[i].state = m.name;
                }
                if (activity.moments[i].state_number == 1) {
                  activity.moments[i].parent_type = "ACTIVITY";
                }
                if (parent_index == -1)
                  moment_has_been_activity.moments.push(activity.moments[i]);
              }
            }

            //update sort_index of moments new brothers
            var pr_brother = show_index;
            for (var k = show_index + 1; k < activity.moments.length; k++) {
              if (
                activity.moments[k].state_number ==
                Number(activity.moments[show_index].state_number) - 1
              )
                break;
              if (
                activity.moments[k].state_number ==
                activity.moments[show_index].state_number
              ) {
                activity.moments[k].sort_index =
                  Number(activity.moments[pr_brother].sort_index) + 1;
                activity.moments[k].changed = true;
                pr_brother = k;
              }
              // else if (
              //   activity.moments[k].state_number ==
              //   Number(activity.moments[show_index].state_number) + 1
              // ) {
              //   activity.moments[k].sort_index =
              //     Number(activity.moments[pr_brother].sort_index) - 1;
              //   activity.moments[k].changed = true;
              // }
            }

            //update all row bellow
            for (
              let k = activity_index + 1;
              k < this.copySelectedProject.activities.length;
              k++
            ) {
              if (
                moment_has_been_activity &&
                this.copySelectedProject.activities.at(k).sort_index ==
                  moment_has_been_activity.sort_index
              ) {
                for (
                  let z = k;
                  z < this.copySelectedProject.activities.length;
                  z++
                ) {
                  this.copySelectedProject.activities.at(z).sort_index =
                    Number(
                      this.copySelectedProject.activities.at(z).sort_index
                    ) + 1;
                  this.copySelectedProject.activities.at(z).changed = true;
                }
              }
            }

            var num_childred;
            if (parent_index != -1) {
              num_childred = activity.moments.findIndex(
                (obj) => obj.parent == activity.moments[parent_index].id
              );
            } else num_childred = parent_index;

            //parent has no more children
            if (parent_index != -1 && num_childred == -1) {
              //parent become tape
              activity.moments[parent_index].percentage_of_realized_plan = null;
              if (
                activity.moments[parent_index].dateSegments[0].startWorkDate !=
                  null &&
                activity.moments[parent_index].dateSegments[0].startWorkDate <
                  activity.moments[parent_index].start_date
              ) {
                activity.moments[parent_index].start_date =
                  activity.moments[parent_index].dateSegments[0].startWorkDate;
              }
              if (activity.moments[parent_index].id > 0) {
                historySchedulePlaner.appendToQueueGroup(() =>
                  this.scheduleService.changePlanPercentage(
                    activity.moments[parent_index].id,
                    null
                  )
                );
              }

            }
            else {


              var hashArr = {};
              for (var i = 0; i < activity.moments.length; i++) {
                if (hashArr[activity.moments[i].parent] == null)
                  hashArr[activity.moments[i].parent] = [];
                hashArr[activity.moments[i].parent].push(activity.moments[i]);
              }
              activity.moments = this.hierarhySort(hashArr, activity.id, []);
              if (!activity.moments) activity.moments = [];

              CpspRef.cmp.copySelectedProject.activities[
                activity_index
              ].moments = activity.moments;
              this.updateParent(activity, m);

              if (parent_index == -1) {
                this.copySelectedProject.activities.push(
                  moment_has_been_activity
                );
                this.selectedMomentsForStyleChange.splice(indSel,1);
                this.selectedMomentsForStyleChange.splice(indSel,0,moment_has_been_activity);
                this.copySelectedProject.activities.sort(
                  (a, b) => Number(a.sort_index) - Number(b.sort_index)
                );
                if(moment_has_been_activity.moments.length > 0){
                  const indexOfShowState = this.projectSchedulePlanerApp.projectMomentsContainer.show_states ?
                   this.projectSchedulePlanerApp.projectMomentsContainer.show_states.findIndex(
                    (e) => e.id == m.id
                  ) : -1;
                  if(indexOfShowState != -1){
                    this.projectSchedulePlanerApp.projectMomentsContainer.show_activity.push({
                      id: m.id,
                      show: this.projectSchedulePlanerApp.projectMomentsContainer.show_states.at(indexOfShowState).show,
                    })
                    this.projectSchedulePlanerApp.projectMomentsContainer.show_states.splice(indexOfShowState,1)
                  }

                }

              }
            }

            let newIndex = activity.moments.findIndex((mom) => mom.id == m.id);
            if (newIndex != oldIndex && newIndex != -1) {
              if (this.selectedMomentsForStyleChange.length == 1) {
                this.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow +=
                  newIndex - oldIndex;
                this.projectSchedulePlanerApp.projectMomentsContainer.marginTop +=
                  (newIndex - oldIndex) * ConfigSc.cellHeight;
              } else if (
                indSel == this.selectedMomentsForStyleChange.length - 1 &&
                newIndex != -1
              ) {
                this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.setY(
                  this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getY() +
                    (newIndex - oldIndex) * ConfigSc.cellHeight
                );
              }
            } else if (
              newIndex == -1 &&
              moment_has_been_activity &&
              indSel == this.selectedMomentsForStyleChange.length - 1
            ) {
              if (this.selectedMomentsForStyleChange.length > 1)
                this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.setY(
                  this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getY() +
                    Math.abs(oldIndex - activity.moments.length) *
                      ConfigSc.cellHeight
                );
              else {
                this.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow +=
                  Math.abs(oldIndex - activity.moments.length);
                this.projectSchedulePlanerApp.projectMomentsContainer.marginTop +=
                  Math.abs(oldIndex - activity.moments.length) *
                  ConfigSc.cellHeight;
              }
            }
          }
          //click moveRight
          else {
            var i = parent_index;
            //selected moment has a state_number >1

            //selected moment is first child of parent
            if (activity.moments[i + 1].id == m.id) {
              return;
            } else {
              var selected_index = activity.moments.findIndex(
                (mom) => mom.id == m.id
              );
              var child_index = i + 1;
              //find moment with same state number with selected moment
              for (i = selected_index - 1; i >= 0; i--) {
                child_index = i;
                if (activity.moments[i].state_number == m.state_number) break;
              }
              //change new parent data of selected moment
              activity.moments[child_index].state = "";
              activity.moments[child_index].plan = "";
              m.parent = activity.moments[child_index].id;
              m.changed = true;
              activity.changed = true;
              activity.moments[child_index].changed = true;

              m.state_number = Number(m.state_number) + 1;
              selectedActivity.state_number = m.state_number;
              selectedActivity.parent = m.parent;
              m.state = activity.moments[child_index].name;
              selectedActivity.stateType = m.state;
              m.schedule_plan_activity_id = activity.moments[child_index].id;
              if (
                activity.moments[child_index].percentage_of_realized_plan ==
                null
              )
                activity.moments[child_index].percentage_of_realized_plan = 0;
              if (activity.moments[child_index].state_number == 1)
                m.parent_type = "STATE";
              else m.parent_type = "PLAN";

              var lastIndex = this.findLastSortIndex(
                activity,
                activity.moments[child_index],
                true
              );
              m.sort_index = indSel + 1;
              if (child_index + 1 == selected_index) m.sort_index = 1;
              this.assignSortIndex(activity);

              //selected moment clildren
              //var moment_has_children = false;
              for (i = selected_index + 1; i < activity.moments.length; i++) {
                if (activity.moments[i].state_number < m.state_number) break;
                if (parent_index == -1 && activity.moments[i].state_number <= 1)
                  break;
                //moment_has_children = true;
                activity.moments[i].state_number =
                  Number(activity.moments[i].state_number) + 1;
                activity.moments[i].changed = true;
                activity.moments[i].schedule_plan_activity_id = m.id;
                if (m.state_number == 1) {
                  activity.moments[i].state = m.name;
                }
              }
              this.updateParent(activity, m);
            }
          }
        }
      }
    }
    //sort and update y coordinates for moments
    this.sortMomentsBySortIndex();

    this.selectedProject = this.deepCopy(this.copySelectedProject);

    this.hideColumnValueInput();
    this.hidePlanInput();
    this.hideResourceWeekInput();

    historySchedulePlaner.addToQueue(
      () => true,
      () => true
    );

    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  }

  //use for update bridge of parent moment
  updateParent(activity, m, checkNeedNewApp = true) {
    activity.changed = true;
    m.changed = true;
    let parent_index = activity.moments.findIndex(
      (obj) => obj.id == m.parent && obj.state_number == Number(m.state_number) - 1
    );
    let formattedNewStartDateState = null;
    let formattedNewEndDateState = null;
    if (parent_index != -1) {
      do {
        formattedNewStartDateState = m.dateSegments.at(0).startDate; // moment(activity.moments[parent_index].end_date, ConfigSc.dateFormat).add(activity.moments[parent_index].dateSegments[0].numberOfDays, 'days').format(ConfigSc.dateFormat);
        formattedNewEndDateState = m.dateSegments.at(-1).endDate; // moment(activity.moments[parent_index].start_date, ConfigSc.dateFormat).add(activity.moments[parent_index].dateSegments[0].numberOfDays - 1, 'days').format(ConfigSc.dateFormat);

        let i = parent_index;

        for (i = i + 1; i < activity.moments.length; i++) {
          if (
            activity.moments[i].state_number <=
            activity.moments[parent_index].state_number
          )
            break;

          if (activity.moments[i].dateSegments.at(0).startDate < formattedNewStartDateState) {
            formattedNewStartDateState = activity.moments[i].dateSegments.at(0).startDate;
          }

          if (activity.moments[i].dateSegments.at(-1).endDate > formattedNewEndDateState) {
            formattedNewEndDateState = activity.moments[i].dateSegments.at(-1).endDate;
          }
        }
        activity.moments[parent_index].changed = true;
        activity.moments[parent_index].start_date = formattedNewStartDateState;
        activity.moments[parent_index].dateSegments[0].startDate =
          formattedNewStartDateState;
        activity.moments[parent_index].dateSegments[0].startWorkDate =
          formattedNewStartDateState;

        activity.moments[parent_index].end_date = formattedNewEndDateState;
        activity.moments[parent_index].dateSegments[0].endDate =
          formattedNewEndDateState;

        const newDaysBetween = moment(
          activity.moments[parent_index].dateSegments[0].endDate,
          ConfigSc.dateFormat
        );
        activity.moments[parent_index].dateSegments[0].numberOfDays =
          newDaysBetween.diff(
            moment(
              activity.moments[parent_index].dateSegments[0].startDate,
              ConfigSc.dateFormat
            ),
            "days"
          ) + 1;
        parent_index = activity.moments.findIndex(
          (obj) =>
            obj.id == activity.moments[parent_index].parent &&
            obj.state_number == activity.moments[parent_index].state_number - 1
        );
      } while (parent_index != -1);
    }
    // update activity

    activity.moments.forEach( (mom , momIndex) =>{
      if(momIndex == 0){
        formattedNewStartDateState = moment(activity.moments[0].dateSegments.at(0).startDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat);
        formattedNewEndDateState = moment(activity.moments[0].dateSegments.at(-1).endDate, ConfigSc.dateFormat).format(ConfigSc.dateFormat) ;
      }
      if(mom.dateSegments.at(0).startDate < formattedNewStartDateState)
      formattedNewStartDateState = mom.start_date;
      if(mom.dateSegments.at(-1).endDate > formattedNewEndDateState)
      formattedNewEndDateState = mom.dateSegments.at(-1).endDate;
    })

    if(activity.moments.length > 0){
      activity.startDate = formattedNewStartDateState;
      activity.dateSegments[0].startDate = formattedNewStartDateState;
      activity.x = this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(new Date(activity.startDate))

      if(activity.startDate < ConfigSc.earlierStartDate){
        ConfigSc.earlierStartDate = activity.startDate;
      }

      activity.endDate = formattedNewEndDateState;
      activity.dateSegments[0].endDate = formattedNewEndDateState;
      activity.numberOfDays = moment(activity.endDate,ConfigSc.dateFormat)
                              .diff(moment(activity.startDate, ConfigSc.dateFormat), "days") + 1;
    }

    if(checkNeedNewApp)
      this.needNewApp = this.changeLatestEndDate(activity.endDate);
  }

  //use for assign sortindexes of moment hierarchy depending on parent-child relation
  assignSortIndex(activity) {
    let parentsSortIndex = {};
    for (let i = 0; i < activity.moments.length; i++) {
      if (!(activity.moments[i].parent in parentsSortIndex)) {
        parentsSortIndex[String(activity.moments[i].parent)] = 1;
      }
      activity.moments[i].sort_index =
        parentsSortIndex[String(activity.moments[i].parent)];
      activity.moments[i].changed = true;
      parentsSortIndex[String(activity.moments[i].parent)]++;
    }
  }

  //end of change hierarchy

  //find earlyer start date

  findEarlyerStartDate(){
    const indexOfFirst = this.copySelectedProject.activities.findIndex(act => act.startDate != null);
    if(indexOfFirst == -1)
      return ConfigSc.currentDate.format(ConfigSc.dateFormat);
    let startDate = this.copySelectedProject.activities.at(indexOfFirst).startDate;
    for(let i = indexOfFirst + 1; i < this.copySelectedProject.activities.length; i++){
      if(this.copySelectedProject.activities.at(i).startDate != null &&
          this.copySelectedProject.activities.at(i).startDate < startDate)
      {
        startDate = this.copySelectedProject.activities.at(i).startDate;
      }
    }

    return startDate;
  }

  //end of find earlyer start date

    //find latest start date

  findLatestStartDate(){
    const indexOfFirst = this.copySelectedProject.activities.findIndex(act => act.dateSegments.at(-1).endDate != null);
    if(indexOfFirst == -1)
      return ConfigSc.currentDate.format(ConfigSc.dateFormat);
    let endDate = this.copySelectedProject.activities.at(indexOfFirst).dateSegments.at(-1).endDate;
    for(let i = indexOfFirst + 1; i < this.copySelectedProject.activities.length; i++){
      if(this.copySelectedProject.activities.at(i).dateSegments.at(-1).endDate != null &&
          this.copySelectedProject.activities.at(i).dateSegments.at(-1).endDate > endDate)
      {
        endDate = this.copySelectedProject.activities.at(i).dateSegments.at(-1).endDate;
      }
    }

    return endDate;
  }

  //end of find latest start date

  hierarchySortFunc(a, b) {
    return a.state_number < b.state_number;
  }

  hierarhySort(hashArr, key, result) {
    if (hashArr[key] == null) return;
    var arr = hashArr[key].sort(this.hierarchySortFunc);
    for (var i = 0; i < arr.length; i++) {
      result.push(arr[i]);
      this.hierarhySort(hashArr, arr[i].id, result);
    }
    return result;
  }

  async addScheduleColumn() {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    const res = await this.scheduleService.addScheduleColumn(this.project.id);

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while adding column! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return res["data"];
  }

  //end of add new column

  //remove column

  async removeScheduleColumn(columnId: number) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    if (columnId < 0) {
      columnId = historySchedulePlaner.getRealId(columnId);
    }
    const res = await this.scheduleService.removeScheduleColumn(columnId);

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while removing column! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return true;
  }

  //end of remove column

  //update column name

  async updateColumnFromPlanning(columnId: number, newTextContent: string) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    if (columnId < 0) {
      columnId = historySchedulePlaner.getRealId(columnId);
    }
    const res = await this.scheduleService.updateScheduleColumn(
      columnId,
      newTextContent
    );
    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while updating column text! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return true;
  }

  //end of update column name

  //update column width

  async updateScheduleColumnWidth(columnId: number, width: number) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    if (columnId < 0) {
      columnId = historySchedulePlaner.getRealId(columnId);
    }
    const res = await this.scheduleService.updateScheduleColumnWidth(
      columnId,
      width
    );

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while updating column width! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return true;
  }

  //end of update column width

  //update column sort index

  async updateScheduleColumnSortIndex(columnId: number, newSortIndex: number) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    if (columnId < 0) {
      columnId = historySchedulePlaner.getRealId(columnId);
    }
    const res = await this.scheduleService.updateScheduleColumnSortIndex(
      columnId,
      newSortIndex
    );

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while updating column sort index! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return true;
  }

  //end of update column sort index

  //hide column

  async hideScheduleColumn(columnId: number) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    if (columnId < 0) {
      columnId = historySchedulePlaner.getRealId(columnId);
    }
    const res = await this.scheduleService.hideScheduleColumn(columnId);

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while hiding column! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return true;
  }

  //end of hide column

  //update column values

  async updateScheduleColumnValueColumnIdsWithNewColumnId(
    oldColumnId: number,
    newColumnId: number
  ) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    return await this.scheduleService.updateScheduleColumnValueColumnIdsWithNewColumnId(
      oldColumnId,
      newColumnId
    );
  }

  //end of update column values

  addNewRowNumber() {
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .getRowListContainer()
      .addRowNumber(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getLastRowPosition()
      );
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .setHeight(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getHeight() + ConfigSc.cellHeight
      );
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .getRowListContainer()
      .setHeight(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getHeight() + ConfigSc.cellHeight
      );
  }

  //fill emty row
  async fillEmptyRow(needEmpyRow,needRefreshDisplay = true) {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }
    let lastSort = this.copySelectedProject.activities.at(-1).id;
    let lastIndex = lastSort < 0 ? lastSort : -lastSort;
    for (let i = 0; i < needEmpyRow; i++) {
      //new row number
      this.addNewRowNumber();
      let new_activity: Activity;
      new_activity = {
        //id: activityId,
        id: --lastIndex,
        number: "",
        description: null,
        styles: {
          backgroundColor: "white",
          color: "#000",
          fontDecoration: "normal",
          fontFamily: "Calibri",
          fontSize: 13,
          fontStyle: "normal",
          fontWeight: "normal",
        },
        moments: [],
        startDate: null,
        endDate: null,
        startWeekDate: null,
        endWeekDate: null,
        numberOfDays: 1,
        y: null,
        x: this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
          new Date(ConfigSc.currentDate.format(ConfigSc.dateFormat))
        ),
        resourceWeeks: null,
        countAsResources: false,
        percentage_of_realized_activity: null,
        sort_index: this.selectedProject.activities[
          this.selectedProject.activities.length - 1
        ]
          ? Number(
              this.copySelectedProject.activities[
                this.copySelectedProject.activities.length - 1
              ].sort_index
            ) + 1
          : 1,
        tape_color: "#B6B1B1",
        dateSegments: [
          {
            id: lastIndex,
            startDate: null,
            endDate: null,
            startWeekDate: null,
            endWeekDate: null,
            numberOfDays: null,
            x: 0,
            y: 0,
            startWorkDate: null,
            currentWorkDate: null,
            connected: null,
            connectedToPlan: null,
            noted: 0,
            noteText: null,
            finishedTime: null,
          },
        ],
        number_of_workers: 0,
        time: 0,
        default_moment_id: null,
        plan: null,
        part: null,
        changed: false,
      };

      this.copySelectedProject.activities.push(new_activity);
    }
    this.selectedProject = this.deepCopy(this.copySelectedProject);

    if (
      this.projectSchedulePlanerApp.projectMomentsContainer.getHeight() <
      this.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfAllDisplayActivitiesAndMoments() *
        ConfigSc.cellHeight
    )
      this.projectSchedulePlanerApp.projectMomentsContainer.updateInnerContainerHeight();
    if(needRefreshDisplay)
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  }

  addNewActivityToExistingOne(
    activityIndex: number,
    above: boolean //add new row above(true) or under(false) existing row
  ) {

    this.addNewRowNumber();

    let newSortIndex: number;

    //calculate sort index for the new row, sort index number is between two existing sort indexes
    if (above) {
      newSortIndex = activityIndex > 0 ?
                  Number(this.copySelectedProject.activities.at(activityIndex).sort_index) -
                  ((Number(this.copySelectedProject.activities.at(activityIndex).sort_index) -
                  Number(this.copySelectedProject.activities.at(activityIndex - 1).sort_index)) / 2)
                  :
                  Number(this.copySelectedProject.activities.at(activityIndex).sort_index) / 2

    } else {
      newSortIndex = activityIndex !== this.copySelectedProject.activities.length - 1 ?
                  Number(this.copySelectedProject.activities.at(activityIndex).sort_index) +
                  ((Number(this.copySelectedProject.activities.at(activityIndex + 1).sort_index) -
                  Number(this.copySelectedProject.activities.at(activityIndex).sort_index)) / 2)
                  :
                  Number(this.copySelectedProject.activities.at(activityIndex).sort_index) + 1
    }

    // const lastSort = this.copySelectedProject.activities.at(-1).id;
    // let lastIndex = lastSort < 0 ? lastSort - 1 : -lastSort;
    const idOfNewActivity = -Math.round(Math.random() * 10000000)
    let new_activity: Activity;
    new_activity = {
      id: idOfNewActivity,
      number: "",
      description: "",
      styles: {
        backgroundColor: "white",
        color: "#000",
        fontDecoration: "normal",
        fontFamily: "Calibri",
        fontSize: 13,
        fontStyle: "normal",
        fontWeight: "normal",
      },
      moments: [],
      startDate: null,
      endDate: null,
      startWeekDate: null,
      endWeekDate: null,
      numberOfDays: 1,
      y: null,
      x: this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
        new Date(ConfigSc.currentDate.format(ConfigSc.dateFormat))
      ),
      resourceWeeks: null,
      countAsResources: false,
      percentage_of_realized_activity: null,
      sort_index: newSortIndex,
      tape_color: "#B6B1B1",
      dateSegments: [
        {
          id: idOfNewActivity,
          startDate: null,
          endDate: null,
          startWeekDate: null,
          endWeekDate: null,
          numberOfDays: null,
          x: 0,
          y: 0,
          startWorkDate: null,
          currentWorkDate: null,
          connected: 0,
          connectedToPlan: null,
          noted: 0,
          noteText: null,
          finishedTime: null,
        },
      ],
      number_of_workers: 0,
      time: 0,
      default_moment_id: null,
      plan: null,
      part: null,
      changed: true,
    };

    this.newRowCount++;
    // const indexOfSortIndex = this.copySelectedProject.activities.findIndex(
    //   (activity) => activity.sort_index == activitySortIndex
    // ); //finding array index relative to sort index

    const indexForSortChange = above ? activityIndex : activityIndex + 1;
    this.copySelectedProject.activities.splice(
      indexForSortChange,
      0,
      new_activity
    ); //insert new row into activities array


    if (
      this.projectSchedulePlanerApp.projectMomentsContainer.getHeight() <
      this.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfAllDisplayActivitiesAndMoments() *
        ConfigSc.cellHeight
    )
      this.projectSchedulePlanerApp.projectMomentsContainer.updateInnerContainerHeight();


    this.selectedProject = this.deepCopy(this.copySelectedProject);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
    );
  }

  findBrother(activity,momentIndex,above = true){
    if(above){
      if(momentIndex != null){
        for(let i = momentIndex - 1; i >= 0; i--){
          if(activity.moments.at(i).parent == activity.moments.at(momentIndex).parent &&
            activity.moments.at(i).state_number == activity.moments.at(momentIndex).state_number){
              return i;
            }
        }
      }
    }
    return -1;
  }

  addNewMomentToExistingOne(
    momentIndex: number,
    activityIndex:number,
    above: boolean //add new row above(true) or under(false) existing row
  ) {
    //find moment
    // const activityIndex = this.copySelectedProject.activities.findIndex((a) => a.id == activityId);
    // const momentIndex = this.copySelectedProject.activities[activityIndex].moments.findIndex((m) => m.id == momentId);
    const activity = this.copySelectedProject.activities.at(activityIndex);
    const moment = activity.moments.at(momentIndex);

    let newSortIndex: number;
    // let referenceSortIndex: number;
    let newChild = false;
    //calculate sort index for the new row, sort index number is between two existing sort indexes
    let groupId;
    let stateNumber;
    let parentMoment;
    if (above) {
      newSortIndex = momentIndex > 0 ?
                    activity.moments.at(momentIndex - 1).state_number == moment.state_number ?
                      Number(moment.sort_index) -
                      ((Number(moment.sort_index) -
                      Number(activity.moments.at(momentIndex - 1).sort_index)) / 2)
                      :
                      activity.moments.at(momentIndex - 1).state_number < moment.state_number ?
                        Number(moment.sort_index) / 2
                        :
                        Number(moment.sort_index) -
                        ((Number(moment.sort_index) -
                        Number(activity.moments.at(this.findBrother(activity,momentIndex)).sort_index)) / 2)
                    :
                    Number(moment.sort_index) / 2
      groupId = moment.group_id;
      stateNumber = moment.state_number;
      parentMoment = moment.parent;
    } else {
      newSortIndex = momentIndex < activity.moments.length - 1 && activity.moments.at(momentIndex + 1).state_number == moment.state_number ?
                  Number(moment.sort_index) +
                  ((Number(activity.moments.at(momentIndex + 1).sort_index) -
                  Number(moment.sort_index)) / 2)
                  :
                    activity.moments.at(momentIndex + 1).state_number < moment.state_number ?
                    Number(moment.sort_index) + 1
                    :
                    Number(activity.moments.at(momentIndex + 1).sort_index) / 2
      groupId = momentIndex < activity.moments.length - 1 && activity.moments.at(momentIndex + 1).state_number == moment.state_number ?
                    moment.group_id
                    :
                      activity.moments.at(momentIndex + 1).state_number < moment.state_number ?
                      moment.group_id
                      :
                      activity.moments.at(momentIndex + 1).group_id
      stateNumber = momentIndex < activity.moments.length - 1 && activity.moments.at(momentIndex + 1).state_number == moment.state_number ?
                  moment.state_number
                  :
                    activity.moments.at(momentIndex + 1).state_number < moment.state_number ?
                    moment.state_number
                    :
                    activity.moments.at(momentIndex + 1).state_number
      parentMoment = momentIndex < activity.moments.length - 1 && activity.moments.at(momentIndex + 1).state_number == moment.state_number ?
                  moment.parent
                  :
                    activity.moments.at(momentIndex + 1).state_number < moment.state_number ?
                    moment.parent
                    :
                    activity.moments.at(momentIndex + 1).parent
    }

    this.copySelectedProject.activities[activityIndex].changed = true;

    let newId = -Math.round(Math.random() * 10000000);
    const newMoment = {
      activity_id : moment.activity_id,
      changed: true,
      end_date: null,
      start_date: null,
      global_activity_id: moment.global_activity_id,
      group_id: groupId,
      id: newId,
      moment_id: null,
      moments: [],
      name: "",
      number_of_workers: null,
      parent: parentMoment,
      parent_type: !newChild ? moment.parent_type : this.copySelectedProject.activities.at(activityIndex).moments.at(momentIndex + 1).parent_type,
      part: null,
      percentage_of_realized_plan: null,
      plan: null,
      schedule_plan_activity_id: parentMoment,
      sort_index: newSortIndex,
      state: !newChild ? moment.state : this.copySelectedProject.activities.at(activityIndex).moments.at(momentIndex + 1).state,
      state_number: stateNumber,
      tape_color: "#B6B1B1",
      time: null,
      y: 0,
      dateSegments: [
        {
          id: newId,
          startDate: null,
          endDate: null,
          startWeekDate: null,
          endWeekDate: null,
          numberOfDays: 1,
          x: 0,
          y: 0,
          startWorkDate: null,
          currentWorkDate: null,
          connected: 0,
          connectedToPlan: null,
          noted: 0,
          noteText: null,
          finishedTime: null,
        },
      ],
      styles: {
        backgroundColor: "white",
        color: "#000",
        fontDecoration: "normal",
        fontFamily: "Calibri",
        fontSize: 13,
        fontStyle: "normal",
        fontWeight: "normal",
      }
    }

    const indexForSortChange = above ? momentIndex : momentIndex + 1;
    this.copySelectedProject.activities[activityIndex].moments.splice(
      indexForSortChange,
      0,
      newMoment
    );


    if (
      this.projectSchedulePlanerApp.projectMomentsContainer.getHeight() <
      this.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfAllDisplayActivitiesAndMoments() *
        ConfigSc.cellHeight
    )
      this.projectSchedulePlanerApp.projectMomentsContainer.updateInnerContainerHeight();

      this.sortMomentsBySortIndex()

    this.selectedProject = this.deepCopy(this.copySelectedProject);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
    );


  }

  addNewActivity() {
    //check active revision
    if (this.property_index != this.revisions.length + 1) {
      return;
    }

    // add new row number in row list container
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .getRowListContainer()
      .addRowNumber(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getLastRowPosition()
      );
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .setHeight(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getHeight() + ConfigSc.cellHeight
      );
    this.projectSchedulePlanerApp.projectMomentsContainer
      .getRowNumbersContainer()
      .getRowListContainer()
      .setHeight(
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getRowNumbersContainer()
          .getRowListContainer()
          .getHeight() + ConfigSc.cellHeight
      );

    this.scheduleService
      .createSchedulePlan(
        null,
        null,
        null,
        "",
        null,
        null,
        null,
        null,
        null,
        null,
        0,
        this.copySelectedProject.activities.length == 0 ? 1 : ++this.lastSort,
        this.project.id,
        null
      )
      .then((activityId) => {
        var new_activity: Activity;
        new_activity = {
          id: activityId,
          number: "",
          description: "",
          styles: {
            backgroundColor: "white",
            color: "#000",
            fontDecoration: "normal",
            fontFamily: "Calibri",
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: "normal",
          },
          moments: [],
          startDate: null,
          endDate: null,
          startWeekDate: null,
          endWeekDate: null,
          numberOfDays: 1,
          y:
            this.copySelectedProject.activities[
              this.copySelectedProject.activities.length - 1
            ].y +
            ConfigSc.cellHeight +
            this.copySelectedProject.activities[
              this.copySelectedProject.activities.length - 1
            ].moments.length *
              ConfigSc.cellHeight,
          x: this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
            new Date(ConfigSc.currentDate.format(ConfigSc.dateFormat))
          ),
          resourceWeeks: null,
          countAsResources: false,
          percentage_of_realized_activity: null,
          sort_index: this.selectedProject.activities[
            this.selectedProject.activities.length - 1
          ]
            ? Number(
                this.copySelectedProject.activities[
                  this.copySelectedProject.activities.length - 1
                ].sort_index
              ) + 1
            : 1,
          tape_color: "#B6B1B1",
          dateSegments: [
            {
              id: activityId,
              startDate: null,
              endDate: null,
              startWeekDate: null,
              endWeekDate: null,
              numberOfDays: null,
              x: 0,
              y: 0,
              startWorkDate: null,
              currentWorkDate: null,
              connected: null,
              connectedToPlan: null,
              noted: 0,
              noteText: null,
              finishedTime: null,
            },
          ],
          number_of_workers: 0,
          time: 0,
          default_moment_id: null,
          plan: null,
          part: null,
          changed: false,
        };

        historySchedulePlaner.addToQueue(
          () =>
            this.scheduleService.changeSchedulePlan([
              {
                id: activityId,
                global_activity_id: null,
                schedule_plan_activity_id: null,
                moment_id: null,
                name: "",
                plan: null,
                start_date: ConfigSc.currentDate.format(ConfigSc.dateFormat),
                end_date: ConfigSc.currentDate.format(ConfigSc.dateFormat),
                time: null,
                number_of_workers: null,
                group_id: null,
                state_number: 0,
                sort_index: this.selectedProject.activities[
                  this.selectedProject.activities.length - 1
                ]
                  ? Number(
                      this.copySelectedProject.activities[
                        this.copySelectedProject.activities.length - 1
                      ].sort_index
                    ) + 1
                  : 1,
              },
            ]),
          () => this.scheduleService.deleteSchedulePlan([activityId])
        );

        this.copySelectedProject.activities.push(new_activity);
        this.selectedProject = this.deepCopy(this.copySelectedProject);
        CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        //create new offscreen
        //this.projectSchedulePlanerApp = new ProjectSchedulePlanerApp(this);
      });

    /*historySchedulePlaner.addToQueue(
      () => this.scheduleService.createSchedulePlan(
        null,
        null,
        null,
        new_activity.description,
        null,
        new_activity.startDate,
        new_activity.endDate,
        null,
        null,
        null,
        0,
        new_activity.sort_index
      )
    );*/
  }

  //end of add new activity

  //save state

  saveState() {
    let state = JSON.parse(JSON.stringify(this.copySelectedProject));
    state.columns = this.allColumns;
    state.connections = this.lineConnections;
    state.image = "";
    state.showNames = this.checked;
    const json = {
      id: this.project.id,
      name: this.project.name,
      columns: this.deepCopy(this.allColumns),
      activities: this.copySelectedProject.activities,
      connections: this.deepCopy(this.lineConnections),
      prog_number: this.revisions.length + 1,
      image: "",
      showNames: this.checked
    };

    var newCanvas = document.createElement("canvas");
    newCanvas.width = this.projectSchedulePlanerApp.mainCanvas.getWidth();
    newCanvas.height =
      this.projectSchedulePlanerApp.mainCanvas.getHeight() -
      this.projectSchedulePlanerApp.mainHeader.getHeight();

    var newContext = newCanvas.getContext("2d");
    newContext.drawImage(
      this.projectSchedulePlanerApp.mainCanvas.getCanvasElement(),
      0,
      this.projectSchedulePlanerApp.mainHeader.getHeight(),
      this.projectSchedulePlanerApp.mainCanvas.getWidth() -
        this.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar().getWidth(),
      this.projectSchedulePlanerApp.mainCanvas.getHeight() -
        this.projectSchedulePlanerApp.mainHeader.getHeight() -
        this.projectSchedulePlanerApp.gridContainer.getHorizontalScrollbar().getHeight(),
      0,
      0,
      this.projectSchedulePlanerApp.mainCanvas.getWidth(),
      this.projectSchedulePlanerApp.mainCanvas.getHeight() -
        this.projectSchedulePlanerApp.mainHeader.getHeight()
    );

    //var dataURL = this.projectSchedulePlanerApp.mainCanvas.getCanvasElement().toDataURL("image/png");
    let dataURL = newCanvas.toDataURL("image/png");


      // const doc=new jsPDF(
      //   {
      //     orientation :'landscape',
      //     format: "a4",
      //     unit: 'mm'
      //   }
      //   );
      // doc.addImage(dataURL,'PNG',0, 0, 287, 200);
      // doc.save('sample-file.pdf');



    this.scheduleService
      .generateImage(
        dataURL,
        this.project.id,
        ConfigSc.currentDate.format(ConfigSc.dateRevFormat)
      )
      .then((url) => {
        json.image = url["image_url"];
        state.image = url["image_url"];
        this.revisions.push(json);
        // this.activeRevisions = this.deepCopy(this.copySelectedProject);
        this.activeColumns = this.allColumns;
        this.activeConnections = this.lineConnections;
        this.property_index++;

        this.revImages.push({
          url: url["image_url"],
          date_generated: ConfigSc.currentDate.format(ConfigSc.dateRevFormat),
        });

        this.scheduleService.createNewState(
          state,
          "project_tids_plan",
          this.project.id
        );

        this.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      });
  }

  //end of save state

  //generate PDF

  generatePfd(image_url, email) {
    // console.trace()
    /*const link = document.createElement('a');
    link.download = 'download.png';
    link.href = this.projectSchedulePlanerApp.mainCanvas.getCanvasElement().toDataURL();
    //link.click();
    this.scheduleService.generatePdf(link.href)*/

    /*var newCanvas = document.createElement('canvas');
    newCanvas.width = this.projectSchedulePlanerApp.mainCanvas.getWidth();
    newCanvas.height = this.projectSchedulePlanerApp.mainCanvas.getHeight()- this.projectSchedulePlanerApp.mainHeader.getHeight();

    var newContext = newCanvas.getContext('2d');
    newContext.drawImage(
      this.projectSchedulePlanerApp.mainCanvas.getCanvasElement(),
      0,
      this.projectSchedulePlanerApp.mainHeader.getHeight(),
      this.projectSchedulePlanerApp.mainCanvas.getWidth(),
      this.projectSchedulePlanerApp.mainCanvas.getHeight() - this.projectSchedulePlanerApp.mainHeader.getHeight(),
      0,
      0,
      this.projectSchedulePlanerApp.mainCanvas.getWidth(),
      this.projectSchedulePlanerApp.mainCanvas.getHeight() - this.projectSchedulePlanerApp.mainHeader.getHeight()
      );

    var dataURL = newCanvas.toDataURL("image/png");
    var newTab = window.open('about:blank','image from canvas');*/

    let emails = "";
    for(let i = 0; i < email.length; i++){
      emails += email[i] + " ";
    }

    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    diaolgConfig.data = {
      questionText:
        this.translate.instant("Are you sure you want to send email to:") +
        " " +
        emails +
        "?",
    };

    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.setLoadingStatus(true);

          const svg = this.generateSvg();
          document.getElementById("svgElement").innerHTML = "";

          const lastUser = JSON.parse(localStorage.getItem('lastUser'));

          for(let i = 0; i < email.length; i++){
            this.scheduleService
            .generatePdf(svg, email[i],this.project["name"].split(' ').join('_'), lastUser.firstname + " " + lastUser.lastname, moment().format(ConfigSc.dateFormat), "20"+this.revImages[this.property_index - 1].date_generated)
            // .generatePdf(window.location.protocol +"//"+window.location.host+"/file/"+image_url, email[i])
            // .generatePdf(image_url, email[i])
            // .generatePdf(image_url + ".png", email[i])
            .then((obj) => {
              this.setLoadingStatus(false);
              if (obj["status"]) {
                this.toastr.success(
                  this.translate.instant("You have successfully sent email!"),
                  this.translate.instant("Success")
                );
              } else {
                this.toastr.error(
                  this.translate.instant(
                    "Couldn`t send the email, please try again."
                  ),
                  this.translate.instant("Error")
                );
              }
            });
          }
        }
      });

    //newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
  }

  //end of generate PDF

  //end of information of unsaved changes

  setLoadingStatus(status: boolean) {
    this.loading = status;
    this.ref.detectChanges();
  }

  showAddUserModal(projectIndex: number) {
    this.addUserModalShowing = true;
    this.ref.detectChanges();
  }
  closeAddUserModal() {
    this.addUserModalShowing = false;

    this.addUserModalBox.style.left = `${
      window.innerWidth / 2 - this.addUserModalBox.offsetWidth / 2
    }px`;
    this.addUserModalBox.style.top = `${
      window.innerHeight / 2 - this.addUserModalBox.offsetHeight / 2
    }px`;
  }

  setCloseModalsOnEscKey() {
    document.onkeyup = (e) => {
      if (e.key !== "Escape") return;

      this.addUserModalShowing = false;
      this.selectedDateSegmentStartDate = ConfigSc.currentDate.format(
        ConfigSc.datepickerFormat
      );
      this.selectedDateSegmentEndDate = ConfigSc.currentDate.format(
        ConfigSc.datepickerFormat
      );
      this.ref.detectChanges();
    };
  }

  showPlannedVacationModal() {
    this.selectedVacationDateName = "";
    this.updateDatePicker("#startDateVacation", false);
    this.updateDatePicker("#endDateVacation", false);
    this.plannedVacationModalShowing = true;
    this.ref.detectChanges();
  }

  closePlannedVacationModal() {
    this.plannedVacationModalShowing = false;

    if (this.selectedVacationDateChanged) {
      this.setLoadingStatus(true);
      this.projectSchedulePlanerApp.daysMonthsContainer
        .getInnerContainer()
        .removeAllChildren();
      this.projectSchedulePlanerApp.daysMonthsContainer.addAllDisplayMonthsThatFitContainerView();
      this.projectSchedulePlanerApp.daysMonthsContainer.draw();
      this.projectSchedulePlanerApp.addPlannedAbsences(true);
      this.setLoadingStatus(false);
    }
  }

  closePlannedVacationModalWithBackground(e) {
    if (e.target.className === "modal") this.closePlannedVacationModal();
  }

  closeAddUserModalWithBackground(e) {
    if (e.target.className === "modal") this.closeAddUserModal();
  }

  updatePlannedVacation() {
    if (
      !this.selectedVacationDateName ||
      this.selectedVacationDateName.length === 0
    )
      return;

    const startDate = this.selectedVacationDateStartDate.split(" ")[0];
    const endDate = this.selectedVacationDateEndDate.split(" ")[0];

    const newObject: PlannedAbsence = {
      id: -1,
      name: this.selectedVacationDateName,
      startDate: startDate,
      endDate: endDate,
      projectId: this.project.id,
    };

    this.scheduleService.addPlanedAbsences(newObject).then((response) => {
      if (response["status"]) {
        newObject.id = response["data"]["id"];
        newObject.m_startDate = moment(
          newObject.startDate,
          ConfigSc.dateFormat
        );
        newObject.m_endDate = moment(newObject.endDate, ConfigSc.dateFormat);

        const startDateArray = newObject.startDate
          .split("-")
          .map((n) => parseInt(n));
        const endDateArray = newObject.endDate
          .split("-")
          .map((n) => parseInt(n));

        this.projectSchedulePlanerApp.daysMonthsContainer
          .getAllDisplayMonths()
          .forEach((ym) => {
            if (
              ym.year >= startDateArray[0] &&
              ym.year <= endDateArray[0] &&
              ym.month >= startDateArray[1] &&
              ym.month <= endDateArray[1]
            ) {
              ym.days.forEach((d) => {
                if (d.day >= startDateArray[2] && d.day <= endDateArray[2]) {
                  d.isPlanedAbsence = true;
                }
              });
            }
          });

        this.planedAbsences.push(newObject);
        this.selectedVacationDateChanged = true;
        this.ref.detectChanges();
      }
    });

    this.selectedVacationDateName = "";
    this.updateDatePicker("#startDateVacation", false);
    this.updateDatePicker("#endDateVacation", false);
  }

  deletePlannedVacation(id: number) {
    this.scheduleService.deletePlanedAbsences(id).then((status) => {
      if (status) {
        const index = this.planedAbsences.findIndex((x) => x.id == id);

        const startDateArray = this.planedAbsences[index].startDate
          .split("-")
          .map((n) => parseInt(n));
        const endDateArray = this.planedAbsences[index].endDate
          .split("-")
          .map((n) => parseInt(n));

        this.projectSchedulePlanerApp.daysMonthsContainer
          .getAllDisplayMonths()
          .forEach((ym) => {
            if (
              ym.year >= startDateArray[0] &&
              ym.year <= endDateArray[0] &&
              ym.month >= startDateArray[1] &&
              ym.month <= endDateArray[1]
            ) {
              ym.days.forEach((d) => {
                if (d.day >= startDateArray[2] && d.day <= endDateArray[2]) {
                  d.isPlanedAbsence = false;
                }
              });
            }
          });
        this.planedAbsences.splice(index, 1);
        this.ref.detectChanges();
        this.selectedVacationDateChanged = true;
      }
    });
  }

  searchUsers() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.filterUsersFromProject();
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      clearTimeout(this.timer);
    }, 300);
  }

  filterUsersFromProject() {
    let y = 0;
    let i = 0;
    CpspRef.cmp.selectedProject.activities.forEach((activity) => {
      const activity_index =
        CpspRef.cmp.copySelectedProject.activities.findIndex(
          (obj) => obj.id == activity.id
        );
      activity.moments = CpspRef.cmp.copySelectedProject.activities[
        activity_index
      ].moments.filter((obj) => {
        return (
          obj.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          obj.state.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      });
      CpspRef.cmp.selectedProject.activities[i].y = y;
      y +=
        CpspRef.cmp.selectedProject.activities[i].moments.length *
          ConfigSc.cellHeight +
        ConfigSc.cellHeight;
      i++;
    });
  }

  updateResourceWeek(e) {
    if (!this.tabPress) this.hideColumnValueInput();
    this.hideNoteInput();
    this.hidePlanInput();
    if (e.type === "keyup") this.blurByEnterKey = true;
    if (this.blurByEnterKey && e.type === "blur") return;

    if (e.target.value == "") return;
    // if(e.type === "blur" && this.selectedColumns.length > 0) return;
    const column =
      this.indexOfVisibleColumn == undefined
        ? this.selectedColumnForEditing
        : this.visibleColumns[CpspRef.cmp.indexOfVisibleColumn];
    // const column = this.visibleColumns[CpspRef.cmp.indexOfVisibleColumn];
    const newResourcesNeededValue = Number(e.target.value);
    if (
      typeof newResourcesNeededValue !== "number" ||
      e.target.value.trim() === ""
    ) {
      return this.toastr.error(
        this.translate.instant("Only numeric values are allowed!"),
        this.translate.instant("Error")
      );
    }

    if (newResourcesNeededValue < 0) {
      return this.toastr.error(
        this.translate.instant(
          "Number of resources must be greather than or equals to zero!"
        ),
        this.translate.instant("Error")
      );
    }

    //const resourceWeekData = this.selectedResourceWeekDataForEditing;
    setTimeout(() => {
      this.blurByEnterKey = false;
    }, 200);
    this.hideResourceWeekInput();
    let needNewApp = false;

    var activity = this.copySelectedProject.activities.find(
      (act) => act.id == this.activityIndex
    );
    if (activity == undefined) {
      activity = this.copySelectedProject.activities.find(
        (act) => act.y == this.activityY
      );
    }
    var m = activity.moments.find((mom) => mom.id == this.planIndex);
    // var previousStateM =
    //   m != undefined
    //     ? JSON.parse(JSON.stringify(m))
    //     : JSON.parse(JSON.stringify(activity));

    if (
      column.key === "resource" &&
      m != undefined &&
      m.percentage_of_realized_plan == null
    ) {
      if (
        m.number_of_workers == newResourcesNeededValue ||
        (m.number_of_workers == null && newResourcesNeededValue == 0)
      )
        return;
      m.number_of_workers = newResourcesNeededValue;
      m.time =
        m.number_of_workers *
        this.getAllDaysOfMoment(m) *
        this.workingHours;
      activity.changed = true;
      m.changed = true;
    } else if (column.key === "resource") {
      if (
        activity.number_of_workers == newResourcesNeededValue ||
        (activity.number_of_workers == null && newResourcesNeededValue == 0)
      )
        return;
      activity.number_of_workers = newResourcesNeededValue;
      activity.time =
        activity.number_of_workers *
        this.getAllDaysOfMoment(activity) *
        this.workingHours;
      activity.changed = true;
    } else if (column.key === "days" && m != undefined && m.dateSegments[0]) {
      let allTapeDays = 0;
      for(let i = 0; i < m.dateSegments.length - 1; i++){
        allTapeDays += this.getBusinessDatesCount(m.dateSegments.at(i).startDate, m.dateSegments.at(i).endDate)
      }
      if(
        m.dateSegments.length > 1 &&
        newResourcesNeededValue <= allTapeDays
      )
      {
        CpspRef.cmp.toastrMessage(
          "info",
          CpspRef.cmp.getTranslate().instant("Connect the parts and then edit days!")
        );
        return;
      }
      if (
        newResourcesNeededValue < 1 ||
        this.getAllDaysOfMoment(m) ==
          newResourcesNeededValue
      )
        return;

      needNewApp = this.changeDaysOfTape(
        m,
        newResourcesNeededValue,
        this.getAllDaysOfMoment(m)
      );
      this.updateParent(activity, m);
      activity.changed = true;
      m.changed = true;
    } else if (column.key === "days") {
      let allTapeDays = 0;
      for(let i = 0; i < activity.dateSegments.length - 1; i++){
        allTapeDays += this.getBusinessDatesCount(activity.dateSegments.at(i).startDate, activity.dateSegments.at(i).endDate)
      }
      if(
        activity.dateSegments.length > 1 &&
        newResourcesNeededValue <= allTapeDays
      )
      {
        CpspRef.cmp.toastrMessage(
          "info",
          CpspRef.cmp.getTranslate().instant("Connect the parts and then edit days!")
        );
        return;
      }
      if (
        newResourcesNeededValue < 1 ||
        this.getAllDaysOfMoment(activity) ==
          newResourcesNeededValue
      )
        return;
      if (activity.endDate == null) activity.endDate = activity.startDate;

        needNewApp = this.changeDaysOfTape(
          activity,
          newResourcesNeededValue,
          this.getAllDaysOfMoment(activity)
        );
        this.needNewApp = needNewApp;
        activity.changed = true;
      }
      else if(column.key === "hours" && m != undefined && m.dateSegments[0]){
        if(m.time == newResourcesNeededValue || (m.time == null && newResourcesNeededValue == 0 )) return;
        m.time=newResourcesNeededValue;
        const percentageWork = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
        // const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
        // m.number_of_workers = Math.ceil(10*m.time / (this.getBusinessDatesCount(m.start_date, m.end_date)*this.workingHours))/10;
        m.number_of_workers = Math.ceil(10*m.time / (this.getAllDaysOfMoment(m)*this.workingHours))/10;
        // m.dateSegments[0].finishedTime = m.dateSegments[0].currentWorkDate ?
        //                                     Math.round((moment(currDay,ConfigSc.dateFormat).diff(moment(m.start_date,ConfigSc.dateFormat),"days")/moment(m.end_date,ConfigSc.dateFormat).diff(moment(m.start_date,ConfigSc.dateFormat),"days"))*m.time) :
        //                                     0;
        m.dateSegments[0].finishedTime = percentageWork.length > 1 ?
                                            Number(percentageWork[0]) * newResourcesNeededValue / 100:
                                            0;
        activity.changed = true;
        m.changed = true;
      }
      else if(column.key === "hours"){
        if(activity.time == newResourcesNeededValue || (activity.time == null && newResourcesNeededValue == 0 )) return;
        activity.time=newResourcesNeededValue;
        const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
        // this.getAllDaysOfMoment(activity);
        // activity.number_of_workers = Math.ceil(10*activity.time / (this.getBusinessDatesCount(activity.startDate, activity.endDate)*this.workingHours))/10;
        activity.number_of_workers = Math.ceil(10*activity.time / (this.getAllDaysOfMoment(activity)*this.workingHours))/10;
        // activity.dateSegments[0].finishedTime = activity.dateSegments[0].currentWorkDate ?
        //                                           Math.round((moment(activity.dateSegments[0].currentWorkDate,ConfigSc.dateFormat).diff(moment(activity.startDate,ConfigSc.dateFormat),"days")/moment(activity.endDate,ConfigSc.dateFormat).diff(moment(activity.startDate,ConfigSc.dateFormat),"days"))*activity.time) :
        //                                           0;
        activity.dateSegments[0].finishedTime = percentageWork.length > 1 ?
                                                  Number(percentageWork[0]) * newResourcesNeededValue / 100:
                                                  0;
        activity.changed = true;
      }
      else if(column.key === "finished" && m != undefined && m.dateSegments[0]){
        if(m.dateSegments[0].finishedTime == newResourcesNeededValue || (m.dateSegments[0].finishedTime == null && newResourcesNeededValue == 0 )) return;
        if (newResourcesNeededValue > m.time) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp.getTranslate().instant("Finished moments can't be greater than working Hours!")
          );
          return;
        }
        m.dateSegments[0].finishedTime=newResourcesNeededValue;
        // this.selectedProject = this.deepCopy(this.copySelectedProject);
        // historySchedulePlaner.addToQueue(
        //   () => this.scheduleService.updateFinishedTime(m.id,newResourcesNeededValue)
        // );
        activity.changed = true;
        m.changed = true;
        // this.selectedProject = this.deepCopy(this.copySelectedProject);
		    // this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        // this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
        // return;
      }
      else if(column.key === "finished"){
        if(activity.dateSegments[0].finishedTime == newResourcesNeededValue || (activity.dateSegments[0].finishedTime == null && newResourcesNeededValue == 0 )) return;
        if (newResourcesNeededValue > activity.time) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp.getTranslate().instant("Finished moments can't be greater than working Hours!")
          );
          return;
        }
        activity.dateSegments[0].finishedTime=newResourcesNeededValue;
        activity.changed = true;
        this.selectedProject = this.deepCopy(this.copySelectedProject);
        historySchedulePlaner.addToQueue(
          () => this.scheduleService.updateFinishedTime(activity.id,newResourcesNeededValue)
        );
        this.selectedProject = this.deepCopy(this.copySelectedProject);
		this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    return;
      } else return;

    // if ((!resourceWeekData.activity.resourceWeeks[resourceWeekData.resourceWeek] && newResourcesNeededValue === 0) || Number(resourceWeekData.activity.resourceWeeks[resourceWeekData.resourceWeek]) === newResourcesNeededValue) return;
    // //const oldValue = resourceWeekData.activity.resourceWeeks[resourceWeekData.resourceWeek];

    // //history.addToQueue(() => this.updatePlanningResourceWeek(resourceWeekData.project.id, resourceWeekData.resourceWeek, newResourcesNeededValue), () => this.updatePlanningResourceWeek(resourceWeekData.project.id, resourceWeekData.resourceWeek, oldValue));

    // resourceWeekData.activity.resourceWeeks[resourceWeekData.resourceWeek] = newResourcesNeededValue;
    // resourceWeekData.resourceWeekTextShape.setTextContent(`${newResourcesNeededValue}/${resourceWeekData.activity.moments.length}`);
    // resourceWeekData.resourceWeekTextShape.setAlignment('center', 'center');
    // resourceWeekData.resourceWeekTextShape.updateTextDimensions();
    this.selectedProject = this.deepCopy(this.copySelectedProject);
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
      );
    // historySchedulePlaner.addToQueue(
    //   () =>
    //     this.scheduleService.changeSchedulePlan([
    //       {
    //         id: m != undefined ? m.id : activity.id,
    //         global_activity_id:
    //           m != undefined
    //             ? m.global_activity_id == 0
    //               ? null
    //               : m.global_activity_id
    //             : null,
    //         schedule_plan_activity_id:
    //           m != undefined ? m.schedule_plan_activity_id : null,
    //         moment_id:
    //           m != undefined ? m.moment_id : activity.default_moment_id,
    //         name: m != undefined ? m.name : activity.description,
    //         plan: m != undefined ? m.plan : activity.plan,
    //         start_date: m != undefined ? m.start_date : activity.startDate,
    //         end_date: m != undefined ? m.end_date : activity.endDate,
    //         time: m != undefined ? m.time : activity.time,
    //         number_of_workers:
    //           m != undefined ? m.number_of_workers : activity.number_of_workers,
    //         group_id: m != undefined ? m.group_id : null,
    //         state_number: m != undefined ? m.state_number : 0,
    //         sort_index: m != undefined ? m.sort_index : activity.sort_index,
    //         finished_time : m != undefined ? m.dateSegments.at(0).finishedTime : activity.dateSegments.at(0).finishedTime,
    //       },
    //     ]),
    //   () =>
    //     this.scheduleService.changeSchedulePlan([
    //       {
    //         id: previousStateM.id,
    //         global_activity_id:
    //           m != undefined || previousStateM.global_activity_id == 0
    //             ? null
    //             : previousStateM.global_activity_id,
    //         schedule_plan_activity_id:
    //           m != undefined ? previousStateM.schedule_plan_activity_id : 0,
    //         moment_id:
    //           m != undefined
    //             ? previousStateM.moment_id
    //             : previousStateM.default_moment_id,
    //         name:
    //           m != undefined ? previousStateM.name : previousStateM.description,
    //         plan: previousStateM.plan,
    //         start_date:
    //           m != undefined
    //             ? previousStateM.start_date
    //             : previousStateM.startDate,
    //         end_date:
    //           m != undefined ? previousStateM.end_date : previousStateM.endDate,
    //         time: previousStateM.time,
    //         number_of_workers: previousStateM.number_of_workers,
    //         group_id: m != undefined ? previousStateM.group_id : null,
    //         state_number: m != undefined ? previousStateM.state_number : 0,
    //         sort_index: previousStateM.sort_index,
    //         finished_time : previousStateM.dateSegments.at(0).finishedTime ,
    //       },
    //     ])
    // );
    // trenutno poslije ce se svakako maketi
    // if(column.key === "hours"){
    //   historySchedulePlaner.appendToQueueGroup(
    //     () => this.scheduleService.updateFinishedTime(
    //       m != undefined
    //       ? m.id
    //       : activity.id,
    //       m != undefined
    //       ? m.dateSegments[0].finishedTime
    //       : activity.dateSegments[0].finishedTime
    //       )
    //   );
    // }

    if(!needNewApp){
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      }
  }

  changeDaysOfTape(tape,newValue, oldValue){
    let difference = newValue - oldValue;
    while (difference != 0) {
      tape.dateSegments.at(-1).endDate = moment(tape.dateSegments.at(-1).endDate)
        .add(difference > 0 ? 1 : -1, "days")
        .format(ConfigSc.dateFormat);
      if (
        !this.isWeekend(moment(tape.dateSegments.at(-1).endDate))
      )
        difference > 0 ? difference-- : difference++;
    }
    tape.number_of_workers = Math.ceil(10*tape.time / (this.getAllDaysOfMoment(tape)*this.workingHours))/10;
    return this.changeLatestEndDate(tape.dateSegments.at(-1).endDate);
  }

  async updateColumn(e) {
    if (e.type === "keyup") this.blurByEnterKey = true;
    if (this.blurByEnterKey && e.type === "blur") return;

    const newColumnValue: string = e.target.value;
    if (e.target.value.trim() === "") {
      return this.toastr.error(
        this.translate.instant("Column text must have at least one letter!"),
        this.translate.instant("Error")
      );
    }

    const column = this.selectedTableHeadColumnForEditing;
    setTimeout(() => {
      this.blurByEnterKey = false;
    }, 200);
    this.hideColumnInput();

    if (newColumnValue === column.getColumn().textContent) return;
    const oldValue = column.getColumn().textContent;
    column.getColumn().textContent = newColumnValue;
    historySchedulePlaner.addToQueue(
      () =>
        this.updateColumnFromPlanning(column.getColumn().id, newColumnValue),
      () => this.updateColumnFromPlanning(column.getColumn().id, oldValue)
    );

    column.getParent().getParent().refreshDisplay();
  }

  getAllDaysOfMoment(moment){
    let numDays = 0;
    for(let i = 0; i < moment.dateSegments.length; i++){
      numDays += this.getBusinessDatesCount(moment.dateSegments.at(i).startDate,moment.dateSegments.at(i).endDate)
    }
    return numDays;
  }

  getBusinessDatesCount(startDate, endDate) {
    let count = 0;
    // startDate = new Date(startDate);
    // endDate = new Date(endDate);

    // const curDate = new Date(startDate);
    startDate = moment(startDate);
    endDate = moment(endDate);

    // const curDate = moment(startDate);
    // while (curDate <= endDate) {
    //   //const dayOfWeek = curDate.getDay();
    //   const dayOfWeek = curDate.weekday();
    //   if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    //   //curDate.setDate(curDate.getDate() + 1);
    //   curDate.add(1, "day");
    // }
    // return count;
    const curDate = moment(startDate);
    while (curDate <= endDate) {
      if(!this.isWeekend(curDate))count++;
      curDate.add(1, "day");
    }
    return count;
  }

  calculateHoursOfChildren(actId, momId) {
    var h = 0;
    var a = this.copySelectedProject.activities.find((a) => a.id == actId);
    var indOfMom = a.moments.findIndex((m) => m.id == momId);
    if (momId != 0) {
      for (var i = indOfMom + 1; i < a.moments.length; i++) {
        if (a.moments[i].state_number == a.moments[indOfMom].state_number)
          break;
        if (a.moments[i].percentage_of_realized_plan != null) continue;
        var finish = this.getBusinessDatesCount(
          a.moments[i].start_date,
          a.moments[i].end_date
        );
        if (a.moments[i].time != null) h += Number(a.moments[i].time);
        else
          h +=
            a.moments[i].number_of_workers > 0
              ? a.moments[i].number_of_workers * finish * this.workingHours
              : 0;
      }
    } else {
      for (var i = 0; i < a.moments.length; i++) {
        if (a.moments[i].percentage_of_realized_plan != null) continue;
        var finish = this.getBusinessDatesCount(
          a.moments[i].start_date,
          a.moments[i].end_date
        );
        if (a.moments[i].time != null) h += Number(a.moments[i].time);
        else
          h +=
            a.moments[i].number_of_workers > 0
              ? a.moments[i].number_of_workers * finish * this.workingHours
              : 0;
      }
    }
    return h;
  }

  calculateWorkedHoursOfChildren(actId, momId) {
    let h = 0;
    let a = this.copySelectedProject.activities.find((a) => a.id == actId);
    let indOfMom = a.moments.findIndex((m) => m.id == momId);
    if (momId != 0) {
      for (let i = indOfMom + 1; i < a.moments.length; i++) {
        if (a.moments[i].state_number == a.moments[indOfMom].state_number)
          break;
        // let finish = a.moments[i].dateSegments[0].currentWorkDate != null ? this.getBusinessDatesCount(a.moments[i].dateSegments[0].startWorkDate,a.moments[i].dateSegments[0].currentWorkDate) : 0
        // h += a.moments[i].number_of_workers > 0 && a.moments[i].dateSegments[0].currentWorkDate != null ? a.moments[i].number_of_workers * finish * this.workingHours  : 0 ;
        h +=
          a.moments[i].dateSegments[0].finishedTime != null
            ? Number(a.moments[i].dateSegments[0].finishedTime)
            : 0;
      }
    } else {
      for (let i = 0; i < a.moments.length; i++) {
        if (a.moments[i].percentage_of_realized_plan != null) continue;

        h +=
          a.moments[i].dateSegments[0].finishedTime != null
            ? Number(a.moments[i].dateSegments[0].finishedTime)
            : 0;
      }
    }
    return h;
  }

  getPercentageOfFinished(actId, momId) {
    //var days = 0;
    var a = this.copySelectedProject.activities.find((a) => a.id == actId);
    var indOfMom = a.moments.findIndex((m) => m.id == momId);
    var stDay = moment(
      momId != 0 ? a.moments[indOfMom].start_date : a.startDate
    );
    var curDay = moment(
      momId != 0 ? a.moments[indOfMom].start_date : a.startDate
    );
    var anyStarted = false;
    if (momId != 0) {
      for (var i = indOfMom + 1; i < a.moments.length; i++) {
        if (a.moments[i].state_number == a.moments[indOfMom].state_number)
          break;
        if (a.moments[i].percentage_of_realized_plan != null) continue;
        if (a.moments[i].dateSegments[0].currentWorkDate != null) {
          anyStarted = true;
          const percentageWork = a.moments[i].dateSegments[0].currentWorkDate != null ? a.moments[i].dateSegments[0].currentWorkDate.split("%") : [];
          const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
          if (
            currDay >
            curDay.format(ConfigSc.dateFormat)
          )
            curDay = moment(currDay);
        }
      }
    } else {
      for (var i = 0; i < a.moments.length; i++) {
        if (a.moments[i].percentage_of_realized_plan != null) continue;
        if (a.moments[i].dateSegments[0].currentWorkDate != null) {
          anyStarted = true;
          const percentageWork = a.moments[i].dateSegments[0].currentWorkDate != null ? a.moments[i].dateSegments[0].currentWorkDate.split("%") : [];
          const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
          if (
            currDay >
            curDay.format(ConfigSc.dateFormat)
          )
            curDay = moment(currDay);
        }
      }
    }
    return !anyStarted ? 0 : curDay.diff(stDay, "days") + 1;
  }

  calculateDaysOfChildren(actId, momId) {
    let days = 0;
    let a = this.copySelectedProject.activities.find((a) => a.id == actId);
    let indOfMom = a.moments.findIndex((m) => m.id == momId);
    //let stDay = moment(momId != 0 ? a.moments[indOfMom].start_date : a.startDate);
    //let curDay = moment( momId != 0 ? a.moments[indOfMom].start_date : a.startDate);
    if (momId != 0) {
      for (let i = indOfMom + 1; i < a.moments.length; i++) {
        if (a.moments[i].state_number == a.moments[indOfMom].state_number)
          break;
        if (a.moments[i].percentage_of_realized_plan != null) continue;
        // a.moments.at(i).dateSegments.forEach(dateSegment => {
        //   days += this.getBusinessDatesCount(
        //     dateSegment.startDate,
        //     dateSegment.endDate
        //   );
        // })
        days += this.calculateDaysOfMoment(a.moments.at(i));

      }
    } else {
      for (let i = 0; i < a.moments.length; i++) {
        if (a.moments[i].percentage_of_realized_plan != null) continue;
        // a.moments.at(i).dateSegments.forEach(dateSegment => {
        //   days += this.getBusinessDatesCount(
        //     dateSegment.startDate,
        //     dateSegment.endDate
        //   );
        // })
        days += this.calculateDaysOfMoment(a.moments.at(i));
      }
    }
    return days;
  }

  calculateDaysOfMoment(tape){
    let days = 0;
    tape.dateSegments.forEach(dateSegment => {
      days += this.getBusinessDatesCount(
        dateSegment.startDate,
        dateSegment.endDate
      );
    })
    return days;
  }

  updateColumnValue(e) {
    if (!this.tabPress) {
      this.hideResourceWeekInput();
      this.hideNoteInput();
      this.hidePlanInput();
    }
    if (e.type === "keyup") this.blurByEnterKey = true;
    if (this.blurByEnterKey && e.type === "blur") return;
    if(e.type === "blur" && this.hideInput) {
      this.hideInput = false;
      return;
    }
    const newColumnValue: string = e.target.value;
    const column =
      this.indexOfVisibleColumn == undefined
        ? this.selectedColumnForEditing
        : this.visibleColumns[CpspRef.cmp.indexOfVisibleColumn];
    //const column = this.visibleColumns[CpspRef.cmp.indexOfVisibleColumn];
    setTimeout(() => {
      this.blurByEnterKey = false;
    }, 200);
    if (
      !this.hideInput ||
      (this.hideInput &&
        this.inputValue != "" &&
        (this.inputValue != newColumnValue || this.blurByEnterKey))
    )
      this.hideColumnValueInput();

    //case for noted moment
    if (column == undefined) {
      let m = null;
      if (this.planIndex == null)
        console.log("plan index je null, aktivitet selektovan");
      else
        m = this.copySelectedProject.activities
          .find((act) => act.id == this.activityIndex)
          .moments.find((mom) => mom.id == this.planIndex);
      var previousStateM = JSON.parse(JSON.stringify(m));
      m.dateSegments[0].noted = 1;
      m.dateSegments[0].noteText = newColumnValue;
      historySchedulePlaner.addToQueue(
        () =>
          this.scheduleService.changePlansDetails(
            m.id,
            m.state,
            m.styles.backgroundColor,
            m.styles.color,
            m.styles.fontSize,
            m.styles.fontWeight,
            m.styles.fontFamily,
            m.styles.fontStyle,
            m.styles.fontDecoration,
            m.tape_color,
            m.percentage_of_realized_plan,
            m.dateSegments[0].startWorkDate,
            m.dateSegments[0].currentWorkDate,
            m.dateSegments[0].connected,
            m.dateSegments[0].connectedToPlan,
            m.dateSegments[0].noted,
            m.dateSegments[0].noteText
          ),
        () =>
          this.scheduleService.changePlansDetails(
            previousStateM.id,
            previousStateM.state,
            previousStateM.styles.backgroundColor,
            previousStateM.styles.color,
            previousStateM.styles.fontSize,
            previousStateM.styles.fontWeight,
            previousStateM.styles.fontFamily,
            previousStateM.styles.fontStyle,
            previousStateM.styles.fontDecoration,
            previousStateM.tape_color,
            previousStateM.percentage_of_realized_plan,
            previousStateM.dateSegments[0].startWorkDate,
            previousStateM.dateSegments[0].currentWorkDate,
            previousStateM.dateSegments[0].connected,
            previousStateM.dateSegments[0].connectedToPlan,
            previousStateM.dateSegments[0].noted,
            previousStateM.dateSegments[0].noteText
          )
      );
    }
    //case for new column
    else if (column.key == null) {
      if (!column.values[this.project.id])
        column.values[this.project.id] = { activities: {}, value: "" };
      if (!column.values[this.project.id].activities[this.activityIndex])
        column.values[this.project.id].activities[this.activityIndex] = {
          plans: {},
          value: "",
        };
      if (
        this.planIndex !== 0 &&
        !column.values[this.project.id].activities[this.activityIndex].plans[
          this.planIndex
        ]
      )
        column.values[this.project.id].activities[this.activityIndex].plans[
          this.planIndex
        ] = "";
      const oldValue =
        this.planIndex === 0
          ? column.values[this.project.id].activities[this.activityIndex].value
          : column.values[this.project.id].activities[this.activityIndex].plans[
              this.planIndex
            ];
      if (this.planIndex === 0 || this.planIndex == null) {
        if (
          column.values[this.project.id].activities[this.activityIndex].value ==
          newColumnValue
        )
          return;
        column.values[this.project.id].activities[this.activityIndex].value =
          newColumnValue;
      } else {
        if (
          column.values[this.project.id].activities[this.activityIndex].plans[
            this.planIndex
          ] == newColumnValue
        )
          return;
        column.values[this.project.id].activities[this.activityIndex].plans[
          this.planIndex
        ] = newColumnValue;
      }
      let actId = this.activityIndex;
      let momId = this.planIndex == null ? 0 : this.planIndex;
      historySchedulePlaner.addToQueue(
        () =>
          this.updateColumnValueFromSchedule(
            column.id,
            this.selectedProject.id,
            actId,
            momId,
            newColumnValue
          ),
        () =>
          this.updateColumnValueFromSchedule(
            column.id,
            this.selectedProject.id,
            actId,
            momId,
            oldValue
          )
      );
    }
    //case for default column
    else {
      var activity = this.copySelectedProject.activities.find(
        (act) => act.id == this.activityIndex
      );
      if (activity == undefined) {
        activity = this.copySelectedProject.activities.find(
          (act) => act.y == this.activityY
        );
      }
      var m = activity.moments.find((mom) => mom.id == this.planIndex);
      var previousStateM =
        m != undefined
          ? JSON.parse(JSON.stringify(m))
          : JSON.parse(JSON.stringify(activity));
      if (column.key === "Details") {
        //only when press Enter
        if (
          (!this.tabPress && e.type === "keyup") ||
          (this.tabPress &&
            e.type === "keyup" &&
            this.indexOfVisibleColumn == 0)
        ) {
          // this.projectSchedulePlanerApp.projectMomentsContainer.marginTop += 10;
          // this.projectSchedulePlanerApp.projectMomentsContainer.marginLeft += 25;
          this.detailsBlurWithEnter = true;
        }
        if (m != undefined) {
          if (m.name == newColumnValue || newColumnValue == "") return;
          m.name = newColumnValue;
          activity.changed = true;
          m.changed = true;
          if (m.start_date == null) {
            m.start_date = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            m.dateSegments[0].startDate = ConfigSc.currentDate.format(
              ConfigSc.dateFormat
            );
          }
          if (m.end_date == null) {
            m.end_date = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            m.dateSegments[0].endDate = ConfigSc.currentDate.format(
              ConfigSc.dateFormat
            );
          }
        } else {
          if (
            activity.description == newColumnValue ||
            (activity.description == null && newColumnValue == "")
          )
            return;
          activity.description = newColumnValue;
          activity.changed = true;
          if (activity.startDate == null) {
            activity.startDate = ConfigSc.currentDate.format(
              ConfigSc.dateFormat
            );
            activity.dateSegments[0].startDate = ConfigSc.currentDate.format(
              ConfigSc.dateFormat
            );
            activity.x =
              this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                new Date(activity.startDate)
              );
          }
          if (activity.endDate == null) {
            activity.endDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            activity.dateSegments[0].endDate = ConfigSc.currentDate.format(
              ConfigSc.dateFormat
            );
            activity.numberOfDays = 1;
          }
        }
      } else return;

      this.selectedProject = this.deepCopy(this.copySelectedProject);
      historySchedulePlaner.addToQueue(
        () => true,
        () => true
        );
      // historySchedulePlaner.addToQueue(
      //   () =>
      //     this.scheduleService.changeSchedulePlan([
      //       {
      //         id: m != undefined ? m.id : activity.id,
      //         global_activity_id:
      //           m != undefined
      //             ? m.global_activity_id == 0
      //               ? null
      //               : m.global_activity_id
      //             : null,
      //         schedule_plan_activity_id:
      //           m != undefined ? m.schedule_plan_activity_id : null,
      //         moment_id:
      //           m != undefined ? m.moment_id : activity.default_moment_id,
      //         name: m != undefined ? m.name : activity.description,
      //         plan: m != undefined ? m.plan : activity.plan,
      //         start_date: m != undefined ? m.start_date : activity.startDate,
      //         end_date: m != undefined ? m.end_date : activity.endDate,
      //         time: m != undefined ? m.time : activity.time,
      //         number_of_workers:
      //           m != undefined
      //             ? m.number_of_workers
      //             : activity.number_of_workers,
      //         group_id: m != undefined ? m.group_id : null,
      //         state_number: m != undefined ? m.state_number : 0,
      //         sort_index: m != undefined ? m.sort_index : activity.sort_index,
      //       },
      //     ]),
      //   () =>
      //     this.scheduleService.changeSchedulePlan([
      //       {
      //         id: previousStateM.id,
      //         global_activity_id:
      //           m != undefined || previousStateM.global_activity_id == 0
      //             ? null
      //             : previousStateM.global_activity_id,
      //         schedule_plan_activity_id:
      //           m != undefined ? previousStateM.schedule_plan_activity_id : 0,
      //         moment_id:
      //           m != undefined
      //             ? previousStateM.moment_id
      //             : previousStateM.default_moment_id,
      //         name:
      //           m != undefined
      //             ? previousStateM.name
      //             : previousStateM.description,
      //         plan: previousStateM.plan,
      //         start_date:
      //           m != undefined
      //             ? previousStateM.start_date
      //             : previousStateM.startDate,
      //         end_date:
      //           m != undefined
      //             ? previousStateM.end_date
      //             : previousStateM.endDate,
      //         time: previousStateM.time,
      //         number_of_workers: previousStateM.number_of_workers,
      //         group_id: m != undefined ? previousStateM.group_id : null,
      //         state_number: m != undefined ? previousStateM.state_number : 0,
      //         sort_index: previousStateM.sort_index,
      //       },
      //     ])
      // );
    }
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();

  }

  async updateNote(e) {

    if (e.type === "keyup") this.blurByEnterKey = true;
    if (this.blurByEnterKey && e.type === "blur") return;

    let newColumnValue: string = e.target.value.replace("%","");

    setTimeout(() => {
      this.blurByEnterKey = false;
    }, 200);
    this.hideNoteInput();
    this.hidePlanInput();

    let a = this.copySelectedProject.activities.find(
      (act) => act.id == this.activityIndex
    );

    let m = a.moments.find((mom) => mom.id == this.planIndex);

    let previousStateM =
      m != undefined
        ? JSON.parse(JSON.stringify(m))
        : JSON.parse(JSON.stringify(a));

    if (m != undefined) {
      newColumnValue = m.dateSegments[0].noteText.split("%").length == 1 ?   newColumnValue:m.dateSegments[0].noteText.split("%")[0] + "%" + newColumnValue; //check if there is date in value
      // m.dateSegments[0].noted = 1;
      m.dateSegments[0].noteText = newColumnValue;
    } else {
      newColumnValue = a.dateSegments[0].noteText.split("%").length == 1 ?  newColumnValue:a.dateSegments[0].noteText.split("%")[0] + "%" + newColumnValue;  //check if there is date in value
      // a.dateSegments[0].noted = 1;
      a.dateSegments[0].noteText = newColumnValue;
    }


    this.selectedProject = this.deepCopy(this.copySelectedProject);
    historySchedulePlaner.addToQueue(
      () =>
        this.scheduleService.changePlansDetails(
          m != undefined ? m.id : a.id,
          m != undefined ? m.state : "ACTIVITY",
          m != undefined ? m.styles.backgroundColor : a.styles.backgroundColor,
          m != undefined ? m.styles.color : a.styles.color,
          m != undefined ? m.styles.fontSize : a.styles.fontSize,
          m != undefined ? m.styles.fontWeight : a.styles.fontWeight,
          m != undefined ? m.styles.fontFamily : a.styles.fontFamily,
          m != undefined ? m.styles.fontStyle : a.styles.fontStyle,
          m != undefined ? m.styles.fontDecoration : a.styles.fontDecoration,
          m != undefined ? m.tape_color : a.tape_color,
          m != undefined
            ? m.percentage_of_realized_plan
            : a.percentage_of_realized_activity,
          m != undefined
            ? m.dateSegments[0].startWorkDate
            : a.dateSegments[0].startWorkDate,
          m != undefined
            ? m.dateSegments[0].currentWorkDate
            : a.dateSegments[0].currentWorkDate,
          m != undefined
            ? m.dateSegments[0].connected
            : a.dateSegments[0].connected,
          m != undefined
            ? m.dateSegments[0].connectedToPlan
            : a.dateSegments[0].connectedToPlan,
          m != undefined ? m.dateSegments[0].noted : a.dateSegments[0].noted,
          m != undefined
            ? m.dateSegments[0].noteText
            : a.dateSegments[0].noteText
        ),
      () =>
        this.scheduleService.changePlansDetails(
          previousStateM.id,
          previousStateM.state,
          previousStateM.styles.backgroundColor,
          previousStateM.styles.color,
          previousStateM.styles.fontSize,
          previousStateM.styles.fontWeight,
          previousStateM.styles.fontFamily,
          previousStateM.styles.fontStyle,
          previousStateM.styles.fontDecoration,
          previousStateM.tape_color,
          previousStateM.percentage_of_realized_plan,
          previousStateM.dateSegments[0].startWorkDate,
          previousStateM.dateSegments[0].currentWorkDate,
          previousStateM.dateSegments[0].connected,
          previousStateM.dateSegments[0].connectedToPlan,
          previousStateM.dateSegments[0].noted,
          previousStateM.dateSegments[0].noteText
        )
    );
    //}

    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }


  // async updateNote(e) {
  //   if (e.type === "keyup") this.blurByEnterKey = true;
  //   if (this.blurByEnterKey && e.type === "blur") return;
  //   const newColumnValue: string = e.target.value;
  //   //const column = this.selectedColumnForEditing;
  //   setTimeout(() => {
  //     this.blurByEnterKey = false;
  //   }, 200);
  //   this.hideNoteInput();
  //   this.hidePlanInput();
  //   //if(column == undefined ){
  //   let a = this.copySelectedProject.activities.find(
  //     (act) => act.id == this.activityIndex
  //   );
  //   let m = a.moments.find((mom) => mom.id == this.planIndex);
  //   let previousStateM =
  //     m != undefined
  //       ? JSON.parse(JSON.stringify(m))
  //       : JSON.parse(JSON.stringify(a));
  //   if (m != undefined) {
  //     m.dateSegments[0].noted = 1;
  //     m.dateSegments[0].noteText = newColumnValue;
  //   } else {
  //     a.dateSegments[0].noted = 1;
  //     a.dateSegments[0].noteText = newColumnValue;
  //   }


  //   this.selectedProject = this.deepCopy(this.copySelectedProject);
  //   historySchedulePlaner.addToQueue(
  //     () =>
  //       this.scheduleService.changePlansDetails(
  //         m != undefined ? m.id : a.id,
  //         m != undefined ? m.state : "ACTIVITY",
  //         m != undefined ? m.styles.backgroundColor : a.styles.backgroundColor,
  //         m != undefined ? m.styles.color : a.styles.color,
  //         m != undefined ? m.styles.fontSize : a.styles.fontSize,
  //         m != undefined ? m.styles.fontWeight : a.styles.fontWeight,
  //         m != undefined ? m.styles.fontFamily : a.styles.fontFamily,
  //         m != undefined ? m.styles.fontStyle : a.styles.fontStyle,
  //         m != undefined ? m.styles.fontDecoration : a.styles.fontDecoration,
  //         m != undefined ? m.tape_color : a.tape_color,
  //         m != undefined
  //           ? m.percentage_of_realized_plan
  //           : a.percentage_of_realized_activity,
  //         m != undefined
  //           ? m.dateSegments[0].startWorkDate
  //           : a.dateSegments[0].startWorkDate,
  //         m != undefined
  //           ? m.dateSegments[0].currentWorkDate
  //           : a.dateSegments[0].currentWorkDate,
  //         m != undefined
  //           ? m.dateSegments[0].connected
  //           : a.dateSegments[0].connected,
  //         m != undefined
  //           ? m.dateSegments[0].connectedToPlan
  //           : a.dateSegments[0].connectedToPlan,
  //         m != undefined ? m.dateSegments[0].noted : a.dateSegments[0].noted,
  //         m != undefined
  //           ? m.dateSegments[0].noteText
  //           : a.dateSegments[0].noteText
  //       ),
  //     () =>
  //       this.scheduleService.changePlansDetails(
  //         previousStateM.id,
  //         previousStateM.state,
  //         previousStateM.styles.backgroundColor,
  //         previousStateM.styles.color,
  //         previousStateM.styles.fontSize,
  //         previousStateM.styles.fontWeight,
  //         previousStateM.styles.fontFamily,
  //         previousStateM.styles.fontStyle,
  //         previousStateM.styles.fontDecoration,
  //         previousStateM.tape_color,
  //         previousStateM.percentage_of_realized_plan,
  //         previousStateM.dateSegments[0].startWorkDate,
  //         previousStateM.dateSegments[0].currentWorkDate,
  //         previousStateM.dateSegments[0].connected,
  //         previousStateM.dateSegments[0].connectedToPlan,
  //         previousStateM.dateSegments[0].noted,
  //         previousStateM.dateSegments[0].noteText
  //       )
  //   );
  //   //}

  //   this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  //   this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  // }
  updatePlan(e) {
    if (e.type === "keyup") this.blurByEnterKey = true;
    if (this.blurByEnterKey && e.type === "blur") return;
    if(e.type === "blur" && this.selectedColumns.length > 0) return;
    const newColumnValue: string = e.target.value;
    const column =
      this.indexOfVisibleColumn == undefined
        ? this.selectedColumnForEditing
        : this.visibleColumns[CpspRef.cmp.indexOfVisibleColumn];
    //const column = this.visibleColumns[CpspRef.cmp.indexOfVisibleColumn];
    setTimeout(() => {
      this.blurByEnterKey = false;
    }, 200);
    this.hidePlanInput();
    var activity = this.copySelectedProject.activities.find(
      (act) => act.id == this.activityIndex
    );
    var m = activity.moments.find((mom) => mom.id == this.planIndex);
    var previousStateM =
      m != undefined
        ? JSON.parse(JSON.stringify(m))
        : JSON.parse(JSON.stringify(activity));
    if (column.key === "plan" && m != undefined) {
      if (m.plan == newColumnValue || (newColumnValue == "" && m.plan == null))
        return;
      m.plan = newColumnValue;
    } else if (column.key === "plan") {
      if (
        activity.plan == newColumnValue ||
        (newColumnValue == "" && activity.plan == null)
      )
        return;
      activity.plan = newColumnValue;
    } else if (column.key === "part" && m != undefined) {
      if (m.part == newColumnValue || (newColumnValue == "" && m.plan == null))
        return;

      m.part = newColumnValue;
      m.changed = true;
      this.selectedProject = this.deepCopy(this.copySelectedProject);
      historySchedulePlaner.addToQueue(() =>
        this.scheduleService.updatePart(m.id, newColumnValue)
      );

      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      return;
    } else if (column.key === "part") {
      if (
        activity.part == newColumnValue ||
        (newColumnValue == "" && activity.plan == null)
      )
        return;

      activity.part = newColumnValue;
      activity.changed = true;
      this.selectedProject = this.deepCopy(this.copySelectedProject);
      historySchedulePlaner.addToQueue(() =>
        this.scheduleService.updatePart(activity.id, newColumnValue)
      );

      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      return;
    } else return;
    this.selectedProject = this.deepCopy(this.copySelectedProject);
    historySchedulePlaner.addToQueue(
      () =>
        this.scheduleService.changeSchedulePlan([
          {
            id: m != undefined ? m.id : activity.id,
            global_activity_id:
              m != undefined
                ? m.global_activity_id == 0
                  ? null
                  : m.global_activity_id
                : null,
            schedule_plan_activity_id:
              m != undefined ? m.schedule_plan_activity_id : null,
            moment_id:
              m != undefined ? m.moment_id : activity.default_moment_id,
            name: m != undefined ? m.name : activity.description,
            plan: m != undefined ? m.plan : activity.plan,
            start_date: m != undefined ? m.start_date : activity.startDate,
            end_date: m != undefined ? m.end_date : activity.endDate,
            time: m != undefined ? m.time : activity.time,
            number_of_workers:
              m != undefined ? m.number_of_workers : activity.number_of_workers,
            group_id: m != undefined ? m.group_id : null,
            state_number: m != undefined ? m.state_number : 0,
            sort_index: m != undefined ? m.sort_index : activity.sort_index,
          },
        ]),
      () =>
        this.scheduleService.changeSchedulePlan([
          {
            id: previousStateM.id,
            global_activity_id:
              m != undefined || previousStateM.global_activity_id == 0
                ? null
                : previousStateM.global_activity_id,
            schedule_plan_activity_id:
              m != undefined ? previousStateM.schedule_plan_activity_id : 0,
            moment_id:
              m != undefined
                ? previousStateM.moment_id
                : previousStateM.default_moment_id,
            name:
              m != undefined ? previousStateM.name : previousStateM.description,
            plan: previousStateM.plan,
            start_date:
              m != undefined
                ? previousStateM.start_date
                : previousStateM.startDate,
            end_date:
              m != undefined ? previousStateM.end_date : previousStateM.endDate,
            time: previousStateM.time,
            number_of_workers: previousStateM.number_of_workers,
            group_id: m != undefined ? previousStateM.group_id : null,
            state_number: m != undefined ? previousStateM.state_number : 0,
            sort_index: previousStateM.sort_index,
          },
        ])
    );

    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  updateNumberOfDaysColumnValue(e) {
    if (e.type === "keyup") this.blurByEnterKey = true;
    if (this.blurByEnterKey && e.type === "blur") return;

    const newColumnValue = parseInt(e.target.value, 10);

    if (newColumnValue < 1) {
      return this.toastr.error(
        this.translate.instant(
          "Number of days must be greater than or equal to 1!"
        ),
        this.translate.instant("Error")
      );
    }

    setTimeout(() => {
      this.blurByEnterKey = false;
    }, 200);
    this.hideNumberOfDayColumnInput();

    // const project = this.allDisplayProjects[this.projectIndex];
    // const user = project.users[this.userIndex];

    // const newEndDate = moment(user.dateSegments[0].startDate, ConfigSc.dateFormat).add(newColumnValue - 1, 'days');

    // //history.addToQueue(() => { return true; }, () => {return true; });

    // const formattedNewEndDate = newEndDate.format(ConfigSc.dateFormat);

    // user.dateSegments = user.dateSegments.filter(dateSegment => {
    // 	if (dateSegment.startDate > formattedNewEndDate) {
    // 		//history.appendToQueueGroup(() => CpspRef.cmp.removeDateSegmentFromResourcePlanning(dateSegment.id), () => CmpRef.cmp.addDateSegmentToUserFromPlanning(project.id, user.id, dateSegment.startDate, dateSegment.endDate));
    // 		return false;
    // 	}

    // 	if (dateSegment.endDate > formattedNewEndDate) {
    // 		const previousState = JSON.parse(JSON.stringify(dateSegment));
    // 		dateSegment.endDate = formattedNewEndDate;
    // 		dateSegment.endWeekDate = newEndDate.format(ConfigSc.dateWeekFormat);
    // 		dateSegment.numberOfDays = newEndDate.diff(moment(dateSegment.startDate, ConfigSc.dateFormat), 'days') + 1;

    // 		//history.appendToQueueGroup(() => CpspRef.cmp.updateDateSegment(dateSegment), () => CpspRef.cmp.updateDateSegment(previousState), { type: 'date-change', userId: user.id, message: `Your work date has been updated on project (${project.name})` });
    // 	}

    // 	return true;
    // });
    CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    CpspRef.cmp.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  //update schedule column values

  async updateColumnValueFromSchedule(
    columnId: number,
    projectId: number,
    activityId: number,
    planId: number,
    newTextContent: string
  ) {
    if (columnId < 0) {
      columnId = historySchedulePlaner.getRealId(columnId);
    }
    const res = await this.scheduleService.updateColumnValueFromSchedule(
      columnId,
      projectId,
      activityId,
      planId,
      newTextContent
    );
    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant(
          "There was an error while updating column value! Try again later."
        ),
        this.translate.instant("Error")
      );
      return false;
    }

    return true;
  }

  //end of update schedule column values

  //add new note

  // addNewNote() {
  //   this.copySelectedProject.activities.forEach((activity) => {
  //     if (
  //       CpspRef.cmp.selectedMomentsForStyleChange.some(
  //         (u) => u.planId == null && u.activityId == activity.id
  //       )
  //     ) {
  //       if (activity.dateSegments[0].noted == 1) {
  //         CpspRef.cmp.toastrMessage(
  //           "info",
  //           CpspRef.cmp
  //             .getTranslate()
  //             .instant("Note already created for this moment!")
  //         );
  //         return;
  //       }
  //       activity.dateSegments[0].noted = 1;
  //       activity.dateSegments[0].noteText =moment(activity.dateSegments[0].endDate, ConfigSc.dateFormat).add("d", 1).format(ConfigSc.dateFormat)+"%"+
  //         this.translate.instant("Add note text");
  //     }







  //     activity.moments.forEach((m) => {
  //       if (
  //         CpspRef.cmp.selectedMomentsForStyleChange.some(
  //           (u) => u.planId === m.id && u.state_number == m.state_number
  //         )
  //       ) {
  //         //var previousStateM = JSON.parse(JSON.stringify(m))
  //         if (m.dateSegments[0].noted == 1) {
  //           CpspRef.cmp.toastrMessage(
  //             "info",
  //             CpspRef.cmp
  //               .getTranslate()
  //               .instant("Note already created for this moment!")
  //           );
  //           return;
  //         }
  //         m.dateSegments[0].noted = 1;
  //         m.dateSegments[0].noteText = moment(m.dateSegments[0].endDate, ConfigSc.dateFormat).add("d", 1).format(ConfigSc.dateFormat)+"%"+
  //         this.translate.instant("Add note text");
  //       }
  //     });
  //   });
  //   this.selectedProject = this.deepCopy(this.copySelectedProject);
  //   this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  // }

  addNewNote(index: number) {
    this.copySelectedProject.activities.forEach(activity => {

      if (CpspRef.cmp.selectedMomentsForStyleChange.some(
        u =>
        // u.planId == null &&
        // u.activityId == activity.id
        u.id == activity.id
        )
        ) {
        if (index != 0 && activity.dateSegments[0].noted > 0) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp.getTranslate().instant("Note already created for this moment!")
          );
          return;
        }
        activity.dateSegments[0].noted = index;
        activity.dateSegments[0].noteText = index != 0 ? this.translate.instant(
          "Add note text"
        ) : null;
      }

      activity.moments.forEach(m => {
        if (CpspRef.cmp.selectedMomentsForStyleChange.some(
          u =>
          // u.planId === m.id &&
          // u.state_number==m.state_number
          u.id == m.id
          )
          ){
          //var previousStateM = JSON.parse(JSON.stringify(m))
          if(index != 0 && m.dateSegments[0].noted > 0){
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp.getTranslate().instant("Note already created for this moment!")
            );
            return;
          }
          m.dateSegments[0].noted = index;
          m.dateSegments[0].noteText = index != 0 ? this.translate.instant(
            "Add note text"
          ) : null;
        }
      });
    });
    this.selectedProject = this.deepCopy(this.copySelectedProject)
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

  }





  //end of add new note

  //add monster/pattern

  addNewMonster(index: number){
    this.copySelectedProject.activities.forEach(activity => {

      if (CpspRef.cmp.selectedMomentsForStyleChange.some(
        u =>
        // u.planId == null &&
        // u.activityId == activity.id
        u.id == activity.id
        )
        ) {
        // if (index != 0 && activity.monster > 0) {
        //   CpspRef.cmp.toastrMessage(
        //     "info",
        //     CpspRef.cmp.getTranslate().instant("Pattern already created for this moment!")
        //   );
        //   return;
        // }
        activity.changed = true;
        activity.monster = index;
      }

      activity.moments.forEach(m => {
        if (CpspRef.cmp.selectedMomentsForStyleChange.some(
          u =>
          // u.planId === m.id &&
          // u.state_number==m.state_number
          u.id == m.id
          )
          ){
          //var previousStateM = JSON.parse(JSON.stringify(m))
          // if(index != 0 && m.monster > 0){
          //   CpspRef.cmp.toastrMessage(
          //     "info",
          //     CpspRef.cmp.getTranslate().instant("Pattern already created for this moment!")
          //   );
          //   return;
          // }
          activity.changed = true;
          m.changed = true;
          m.monster = index;
        }
      });
    });
    this.selectedProject = this.deepCopy(this.copySelectedProject);
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
      );
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  }

  //end of monster/pattern

  //move to not completed

  moveToNotCompleted() {
    this.copySelectedProject.activities.forEach((activity) => {
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
            // u.projectId === this.project.id &&
            // u.activityId === activity.id &&
            // u.planId == null
            u.id == activity.id
        )
      ) {
        const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
        const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];


        let daysToCurrent = this.getBusinessDatesCount(
          currDay == null ||
          currDay == activity.startDate
          ? activity.startDate
          : currDay, ConfigSc.currentDate.format(ConfigSc.dateFormat));

        let startDay = moment(activity.startDate,ConfigSc.dateFormat);

        while(daysToCurrent > 1){
          startDay.add(1,"days");
          if(!this.isWeekend(startDay))
            daysToCurrent--;
        }

        let dif = moment(activity.startDate,ConfigSc.dateFormat).diff(startDay,"days");

        var difference = moment(
          currDay == null ||
            currDay == activity.startDate
            ? activity.startDate
            : currDay,
          ConfigSc.dateFormat
        ).diff(moment(ConfigSc.currentDate, ConfigSc.dateFormat), "days");
        if (difference >= 0) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
              .getTranslate()
              .instant("You can't move completed moments!")
          );
          return;
        }
        this.changeMomentsDate(Number(dif) * -1);
        // this.changeMomentsDate(Number(difference) * -1);
      }

      activity.moments.forEach((m) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
            // u.planId === m.id &&
            // u.state_number == m.state_number
            u.id == m.id
          )
        ) {
          const percentageWork = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
          const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
          //var previousStateM = JSON.parse(JSON.stringify(m))
          if (m.percentage_of_realized_plan != null) {
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant("You can not move " + m.name + "!")
            );
            return;
          }


          let daysToCurrent = this.getBusinessDatesCount(
            currDay == null ||
            currDay == m.start_date
            ? m.start_date
            : currDay, ConfigSc.currentDate.format(ConfigSc.dateFormat));

          let startDay = moment(m.start_date,ConfigSc.dateFormat);

          while(daysToCurrent > 1){
            startDay.add(1,"days");
            if(!this.isWeekend(startDay))
              daysToCurrent--;
          }

          let dif = moment(m.start_date,ConfigSc.dateFormat).diff(startDay,"days");

          var difference = moment(
            currDay == null ||
              currDay == m.start_date
              ? m.start_date
              : currDay,
            ConfigSc.dateFormat
          ).diff(moment(ConfigSc.currentDate, ConfigSc.dateFormat), "days");
          if (difference >= 0) {
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant("You can't move completed moments!")
            );
            return;
          }
          this.changeMomentsDate(Number(dif) * -1);
          // this.changeMomentsDate(Number(difference) * -1);
          /*var changes = [];
          var previousState = [];

          previousState.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: m.state,
            planId: m.id,
            startDate:m.dateSegments[0].startWorkDate,
            endDate:m.dateSegments[0].currentWorkDate
          });

          //m.start_date = moment(m.start_date,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          //m.end_date = moment(m.end_date,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          //m.dateSegments[0].startDate = moment(m.dateSegments[0].startDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          //m.dateSegments[0].startWeekDate = moment(m.dateSegments[0].startDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateWeekFormat);
          //m.dateSegments[0].endDate = moment(m.dateSegments[0].endDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          //m.dateSegments[0].endWeekDate = moment(m.dateSegments[0].endWeekDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateWeekFormat);
          if(m.dateSegments[0].currentWorkDate == null || m.dateSegments[0].currentWorkDate == m.start_date){
            m.dateSegments[0].currentWorkDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            m.dateSegments[0].startWorkDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
          }
          else{
            m.dateSegments[0].currentWorkDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            m.dateSegments[0].startWorkDate = moment(m.dateSegments[0].startWorkDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);;
          }

          changes.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: m.state,
            planId: m.id,
            startDate:m.dateSegments[0].startWorkDate,
            endDate:m.dateSegments[0].currentWorkDate
          });

          historySchedulePlaner.addToQueue(
            () => this.scheduleService.changeSchedulePlanWorksDate(
                changes
              ),
            () => this.scheduleService.changeSchedulePlanWorksDate(
                previousState
              )
          );*/
        }
      });
    });
    //this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    //this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  //end of move to not completed

  //move to  completed

  moveToCompleted() {
    this.copySelectedProject.activities.forEach((activity) => {
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
            // u.projectId === this.project.id &&
            // u.activityId === activity.id &&
            // u.planId == null
            u.id == activity.id
        )
      ) {
        const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
        const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
        if (currDay == null) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
              .getTranslate()
              .instant(
                "You can't move a moment you haven't started working on!"
              )
          );
          return;
        }

        let finisedDays = this.getBusinessDatesCount(activity.startDate, currDay);

        let daysMoved = moment(ConfigSc.currentDate);

        while(finisedDays > 0){
          if(!this.isWeekend(daysMoved))
            finisedDays--;
          daysMoved.add(-1, "days");
        }

        let diff = daysMoved.diff(moment(activity.startDate),"days")

        let difference = moment(
          currDay,
          ConfigSc.dateFormat
        ).diff(moment(ConfigSc.currentDate, ConfigSc.dateFormat), "days");
        if (difference < 0) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
              .getTranslate()
              .instant("You can't reschedule a moment that is late!")
          );
          return;
        }
        // difference += 1;
        this.changeMomentsDate(diff);
        // this.changeMomentsDate(Number(difference) * -1);
      }

      activity.moments.forEach((m) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
            // u.planId === m.id &&
            // u.state_number == m.state_number
            u.id == m.id
          )
        ) {
          const percentageWork = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
          const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
          //var previousStateM = JSON.parse(JSON.stringify(m))
          if (m.percentage_of_realized_plan != null) {
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant("You can not move" + m.name + "!")
            );
            return;
          } else if (currDay == null) {
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant(
                  "You can't move a moment you haven't started working on!"
                )
            );
            return;
          }

          let finisedDays = this.getBusinessDatesCount(m.start_date, currDay);

          let daysMoved = moment(ConfigSc.currentDate);

          while(finisedDays > 0){
            if(!this.isWeekend(daysMoved))
              finisedDays--;
            daysMoved.add(-1, "days");
          }

          let diff = daysMoved.diff(moment(m.start_date),"days")

          var difference = moment(
            currDay,
            ConfigSc.dateFormat
          ).diff(moment(ConfigSc.currentDate, ConfigSc.dateFormat), "days");
          if (difference < 0) {
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant("You can't reschedule a moment that is late!")
            );
            return;
          }
          // difference += 1;
          this.changeMomentsDate(diff);
          // this.changeMomentsDate(Number(diff) * -1);
          /*
          var changes = [];
          var previousState = [];

          previousState.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: m.state,
            planId: m.id,
            startDate:m.dateSegments[0].startWorkDate,
            endDate:m.dateSegments[0].currentWorkDate
          });
          //m.start_date = moment(m.start_date,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          //m.end_date = moment(m.end_date,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          m.dateSegments[0].startDate = moment(m.dateSegments[0].startDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          m.dateSegments[0].startWeekDate = moment(m.dateSegments[0].startDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateWeekFormat);
          m.dateSegments[0].endDate = moment(m.dateSegments[0].endDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);
          m.dateSegments[0].endWeekDate = moment(m.dateSegments[0].endWeekDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateWeekFormat);
          if(m.dateSegments[0].currentWorkDate == null || m.dateSegments[0].currentWorkDate == m.start_date){
            m.dateSegments[0].currentWorkDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            m.dateSegments[0].startWorkDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
          }
          else{
            m.dateSegments[0].currentWorkDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            m.dateSegments[0].startWorkDate = moment(m.dateSegments[0].startWorkDate,ConfigSc.dateFormat).add(difference*-1,"days").format(ConfigSc.dateFormat);;
          }
          changes.push({
            projectId: this.project.id,
            activityId: activity.id,
            stateType: m.state,
            planId: m.id,
            startDate:m.dateSegments[0].startWorkDate,
            endDate:m.dateSegments[0].currentWorkDate
          });

          historySchedulePlaner.addToQueue(
            () =>

              this.scheduleService.changeSchedulePlanWorksDate(
                changes
              )
            ,
            () =>

              this.scheduleService.changeSchedulePlanWorksDate(
                previousState
              )
          );*/
        }
      });
    });
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  //end of move to  completed

  //mark according to plan

  markAccordingToPlan() {
    this.copySelectedProject.activities.forEach((activity) => {
      if (
        CpspRef.cmp.selectedMomentsForStyleChange.some(
          (u) =>
          // u.projectId === this.project.id &&
          // u.activityId === activity.id &&
          // u.planId == null
          u.id == activity.id
        )
      ) {
        const percentageWork = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
        const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
        if (currDay == activity.endDate) {
          CpspRef.cmp.toastrMessage(
            "info",
            CpspRef.cmp
              .getTranslate()
              .instant("You can't move finished moments!")
          );
          return;
        }
        const percentageWork2 = activity.dateSegments[0].currentWorkDate != null ? activity.dateSegments[0].currentWorkDate.split("%") : [];
        if(percentageWork2.length == 0){
          activity.dateSegments.at(0).currentWorkDate = "0" + "%" + ConfigSc.currentDate.format(ConfigSc.dateFormat) + "%" + "0";
        }
        else if(percentageWork2.length == 2){
          activity.dateSegments.at(0).currentWorkDate += "%" + "0";
        }
        else{
          activity.dateSegments.at(0).currentWorkDate = percentageWork2.at(0) + "%" + percentageWork2.at(1) + "%" + (Number(percentageWork2.at(2)) + 1);
        }
        this.moveToNotCompleted();
        return;



        // let changesDate = [];
        // let previousStateDate = [];

        // previousStateDate.push({
        //   projectId: CpspRef.cmp.project.id,
        //   activityId: activity.id,
        //   stateType: null,
        //   planId: null,
        //   startDate: activity.dateSegments[0].startWorkDate,
        //   endDate: activity.dateSegments[0].currentWorkDate,
        // });

        // if (
        //   currDay == null ||
        //   currDay == activity.startDate
        // ) {
        //   activity.dateSegments[0].startWorkDate = activity.startDate;
        //   // currDay = activity.endDate;
        //   activity.dateSegments[0].currentWorkDate =
        //         // percentageWork.length > 1 ?
        //           "100" + "%" + activity.endDate
        //           // activity.endDate;
        // } else {
        //   activity.dateSegments[0].startWorkDate =
        //     currDay;
        //   activity.dateSegments[0].currentWorkDate =
        //     // percentageWork.length > 1 ?
        //       "100" + "%" + activity.endDate
        //       // activity.endDate;;
        // }
        // changesDate.push({
        //   projectId: CpspRef.cmp.project.id,
        //   activityId: activity.id,
        //   stateType: null,
        //   planId: null,
        //   startDate: activity.dateSegments[0].startWorkDate,
        //   endDate: activity.dateSegments[0].currentWorkDate,
        // });

        // historySchedulePlaner.addToQueue(
        //   () => this.scheduleService.changeSchedulePlanWorksDate(changesDate),
        //   () =>
        //     this.scheduleService.changeSchedulePlanWorksDate(previousStateDate)
        // );
      }

      activity.moments.forEach((m) => {
        if (
          CpspRef.cmp.selectedMomentsForStyleChange.some(
            (u) =>
            // u.planId === m.id &&
            // u.state_number == m.state_number
            u.id == m.id
          )
        ) {
          const percentageWork = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
          const currDay = percentageWork.length > 1 ? percentageWork[1] : percentageWork[0];
          //var previousStateM = JSON.parse(JSON.stringify(m))
          if (m.percentage_of_realized_plan != null) {
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant("You can not move" + m.name + "!")
            );
            return;
          } else if (currDay == m.dateSegments.at(-1).endDate) {
          /*else if(m.dateSegments[0].currentWorkDate == null){
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp.getTranslate().instant("You dont have move moment who dont start with work!")
            );
            return;
          }*/
            CpspRef.cmp.toastrMessage(
              "info",
              CpspRef.cmp
                .getTranslate()
                .instant("You can't move finished moments!")
            );
            return;
          }

          // let changes = [];
          // let previousState = [];

          // previousState.push({
          //   projectId: this.project.id,
          //   activityId: activity.id,
          //   stateType: m.state,
          //   planId: m.id,
          //   startDate: m.dateSegments[0].startWorkDate,
          //   endDate: m.dateSegments[0].currentWorkDate,
          // });

          const percentageWork2 = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
        if(percentageWork2.length == 0){
          // m.dateSegments.at(0).currentWorkDate = "0" + "%" + ConfigSc.currentDate.format(ConfigSc.dateFormat) + "%" + "0";
          m.dateSegments.at(0).currentWorkDate = "0" + "%" + m.dateSegments.at(0).startDate + "%" + "0";
        }
        else if(percentageWork2.length == 2){
          m.dateSegments.at(0).currentWorkDate += "%" + "0";
        }
        else{
          m.dateSegments.at(0).currentWorkDate = percentageWork2.at(0) + "%" + percentageWork2.at(1) + "%" + (Number(percentageWork2.at(2)) + 1);
        }
        this.moveToNotCompleted();
        return;

        }
      });
    });

    this.selectedProject = this.deepCopy(this.copySelectedProject);
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
    this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
  }

  //end of mark according to plan

  //delete schedule plan

  deleteSchedulePlan(actId, momId,multiselect) {
    let a = this.copySelectedProject.activities.find((a) => a.id == actId);
    let indOfMom = a.moments.findIndex((m) => m.id == momId);

    let idOfMom = [];
    let idOfGroups = [];
    if (momId != null) {

    //check if moment are chained and if then update connected information and lineconnections
      this.lineConnections.forEach((connection, i) => {
      if (connection.m2?.id == momId) {
        this.copySelectedProject.activities.forEach((a) => {
          let changeMoment:any[] = a.moments.filter((m) => m.id == connection.m1.id);
          if (changeMoment.length == 0) {
            changeMoment = this.copySelectedProject.activities.filter((a) => a.id == connection.m1.id);
          }
          if (changeMoment.length > 0) {
              changeMoment[0].dateSegments[0].connected = 0;
              changeMoment[0].dateSegments[0].connectedToPlan = null;
              changeMoment[0].changed = true;
            a.changed = true;
            this.lineConnections.splice(i, 1);
            }
          }
        )
      }
    })


      let stNum = a.moments[indOfMom].state_number;
      let has_a_children = false;
      let idMom = a.moments[indOfMom].id;
      if (a.moments[indOfMom].percentage_of_realized_plan != null)
        has_a_children = true;

      if (!multiselect) {
        a.moments.at(indOfMom).dateSegments.forEach( dateSegment =>{
          idOfMom.push(dateSegment.id);
        })
      }
      a.moments.splice(indOfMom, 1);


      if (has_a_children) idOfGroups.push(idMom); //historySchedulePlaner.appendToQueueGroup(() => this.scheduleService.deleteScheduleGroup(idMom))

      for (let i = indOfMom; i < a.moments.length; i++) {
        if (a.moments[i].state_number <= stNum) break;
        let has_a_children = false;
        //var idMom = a.moments[i].id
        if (a.moments[i].percentage_of_realized_plan != null)
          has_a_children = true;
        //historySchedulePlaner.appendToQueueGroup(() => this.scheduleService.deleteSchedulePlan(idMom))
        a.moments.at(i).dateSegments.forEach( dateSegment =>{
          idOfMom.push(dateSegment.id);
        })
        // idOfMom.push(a.moments[i].id);
        if (has_a_children) idOfGroups.push(a.moments[i].id); //historySchedulePlaner.appendToQueueGroup(() => this.scheduleService.deleteScheduleGroup(idMom))
        a.moments.splice(indOfMom, 1);
        i--;
      }
    } else {

         //check if activities are chained and if then update connected information and lineconnections
      this.lineConnections.forEach((connection, i) => {
        if (connection.m2?.id == actId) {
          let changeActivity:any[] = this.copySelectedProject.activities.filter((a) => a.id == connection.m1.id);
          if (changeActivity.length == 0) {
            this.copySelectedProject.activities.forEach((a) => {
              let findMoment = a.moments.filter((m) => m.id == connection.m1.id);
              if (findMoment.length > 0) {
                changeActivity.push(...findMoment);
                a.changed = true;
              }
            })
          }
          changeActivity[0].dateSegments[0].connected = 0;
          changeActivity[0].dateSegments[0].connectedToPlan = null;
          changeActivity[0].changed = true;
          this.lineConnections.splice(i, 1);
      }
      }
      );



      this.copySelectedProject.activities.splice(
        this.copySelectedProject.activities.findIndex((a) => a.id == actId),
        1)
        this.selectedProject.activities=this.deepCopy(this.copySelectedProject.activities)
      if (!multiselect) {
        a.dateSegments.forEach( dateSegment => {
          idOfMom.push(dateSegment.id);
        })
      }
      for (let i = 0; i < a.moments.length; i++) {
        // idOfMom.push(a.moments[i].id);
        a.moments.at(i).dateSegments.forEach( dateSegment =>{
          idOfMom.push(dateSegment.id);
        })
        if (a.moments[i].percentage_of_realized_plan != null)
          idOfGroups.push(a.moments[i].id);
      }
      if (a.moments.length > 0) idOfGroups.push(a.id);

    }

    this.selectedProject.activities=this.deepCopy(this.copySelectedProject.activities);

    if(!multiselect){
      historySchedulePlaner.addToQueue(() =>
        this.scheduleService.deleteSchedulePlan(idOfMom)
      );
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    } else {
      return idOfMom;
    }

  }

  //end of delete schedule plan

  trimWeek(date: string) {
    return date.split(" ")[0];
  }

  hideResourceWeekInput() {
    this.resourceWeekInput.style.display = "none";
  }

  hideColumnInput() {
    this.columnInput.style.display = "none";
  }

  hideColumnValueInput() {
    this.columnValueInput.style.display = "none";
    this.newColumnValueInput.style.display = "none";
    this.hideInput = false;
  }

  hideNoteInput() {
    this.noteInput.style.display = "none";
  }

  hidePlanInput() {
    this.planInput.style.display = "none";
  }

  hideNumberOfDayColumnInput() {
    this.columnNumberOfDaysInput.style.display = "none";
  }

  showConfirmationModal(message, callback) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.panelClass = "mat-dialog-confirmation";
    dialogConfig.data = {
      questionText:
        message /*this.translate.instant('Are you sure you want to send email to: ') + emails + ' ?'*/,
    };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(callback);
  }

  returnHome() {
    if (this.type == "project-view") {
      this.router.navigate(["/projects/view", this.projectid]);
    } else {
      this.router.navigate(["/moments/planner"]);
    }
  }

  public hideX(h: boolean) {
    this.hideXSrch = h;
    var l = this.searchValue.length;
    this.searchValue = "";
    this.searchUsers();
    if (l != 0) {
      //this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      //this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
    }
  }

  public hideXSrc(h: boolean) {
    this.hideXSrch = h;
  }

  ngOnDestroy() {

    // resetting margin left on parent element
    (
      document.getElementsByClassName("ml-50")[0] as HTMLElement
    ).style.marginLeft = "50px";
    let shadow = document.getElementsByClassName(
      "cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing"
    )[0] as HTMLElement;
    if (shadow) shadow.style.display = "none";
    historySchedulePlaner.dumpHistory();
    document.removeEventListener(
      "keydown",
      historySchedulePlaner.checkPressedKey
    );
    document.removeEventListener("copy", this.toCopyFun)
    document.removeEventListener("paste", this.toPasteFun)
    this.projectSchedulePlanerApp = undefined;
    ConfigSc.timePlanHeader = "Activity"
    // CpspRef.cmp.projectSchedulePlanerApp.sideSection.removeAllChildren();
    // this.projectSchedulePlanerApp.projectMomentsContainer.momentTableBodyContainer.getInnerContainer().removeAllChildren();
    // this.projectSchedulePlanerApp.gridContainer
    //   .getInnerContainer()
    //   .removeAllChildren();
    window.onmousemove = null;
    document.getElementsByTagName("body")[0].classList.remove("noselect");
    window.localStorage.removeItem("resource_planning_side_menu_width");
  }

  openDropDown(e) {
    //   var dataList = $("#df")
    //   if (document.getElementById("df").style.display === '') {
    //     document.getElementById("df").style.display = 'block';
    //     //BTN.textContent = "close list";
    //     //let val = input.value;
    //     //dataList.append("<select>")
    //     var select = "<select>"
    //     this.defaultMoments.forEach(element => {
    //       element.childrens.forEach(e => {
    //         select+="<option>"+e.Name+"</option>"
    //       });
    //     });
    //     select+="</select>"
    //     dataList.append(select)
    // } //else HideSelectBox();
    //   // this.defaultMoments.forEach(element => {
    //   //   element.childrens.forEach(e => {
    //   //     dataList.append("<option>"+e.Name+"</option>")
    //   //   });
    //   // });
    this.inputValue = e;
    this.selectedOption = "";
    $("select#selectValue option:first").prop("selected", true);
    document.getElementById("columnValueEditInput1").focus();
    //document.getElementById("columnValueEditInput1").select()
  }

  changeInput() {
    var dataList = $("#df");
    dataList.empty();

    this.defaultMoments.forEach((element) => {
      element.childrens.forEach((e) => {
        dataList.append("<option>" + e.Name + "</option>");
        //dataList.append("<option>Some Option</option>")
      });
    });
    document.getElementById("columnValueEditInput1").focus();
  }

  changeCheck(){
    historySchedulePlaner.addToQueue(
      () =>
        this.scheduleService.changeScheduleProjectShowNames(
          this.project.id,
          this.checked ? 1 : 0
        ),
      () => true
    );
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
  }

  emtyClick(e1) {
    var dataList = $("#df");
    dataList.empty();
  }

  emtyClickSelect(e1) {
    this.hideInput = true;
  }

  async executeCopyPaste(container) {
    if (container) {
      let pomSelected = this.deepCopy(this.selectedMomentsForCopyPaste);
      let a_i = this.copySelectedProject.activities.findIndex(
        (a) => a.id == this.activityIndex
      );
      let m_i = this.copySelectedProject.activities[a_i].moments.findIndex(
        (m) => m.id == this.planIndex
      );
      let selectedWhereToCopy =
        this.copySelectedProject.activities[a_i].moments[m_i];
      let y = this.copySelectedProject.activities[a_i].y;
      let sort =
        m_i == -1
          ? Number(this.copySelectedProject.activities[a_i].sort_index)
          : Number(selectedWhereToCopy.sort_index);
      let changesPlan = [];
      CpspRef.cmp.setLoadingStatus(true);
      let newGroup: Activity[] = [];
      let newMoments: Moment[] = [];
      let newActIndex = -1;
      let newMomIndex = -1;
      let newColumns = this.allColumns.filter((col) => col.key == null);
      if (this.planIndex == null) {
        for (let k = 0; k < this.selectedMomentsForCopyPaste.length; k++) {
          let mom = this.selectedMomentsForCopyPaste[k];
          let moment_has_been_activity: Activity;
          this.addNewRowNumber();

          if (mom.activity_id) {
            // let m = this.deepCopy(this.copySelectedProject.activities.find(a => a.id == mom.activityId).moments.find(m => m.id == mom.planId))
            let m = this.deepCopy(mom.moment ? mom.moment : mom);

            //selected moments have selected parent
            if (
              this.selectedMomentsForCopyPaste.findIndex(
                (cp) => cp.id == m.parent && m.state_number > 1
              ) != -1
            ) {
              let newMoment = this.deepCopy(m);
              newMoment.dateSegments[0].connected = 0;
              newMoment.dateSegments[0].connectedToPlan = null;

              newMoment.id = -Math.round(Math.random() * 10000000);
              newMoment.activity_id = newGroup[newActIndex].id;
              newMoment.parent = newGroup[newActIndex].id;
              newMoment.state_number = Number(newMoment.state_number) -
                                      Number(this.selectedMomentsForCopyPaste.at(0).state_number ? this.selectedMomentsForCopyPaste.at(0).state_number : 0)
                                      // Number(this.selectedMomentsForCopyPaste.find((cp) =>
                                      //         cp.id == m.parent && m.state_number > 1).state_number)
              // newMoment.state_number = //1
              //  mom.state_number;

              newMoment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
                if(dateSegmentIndex == 0){
                  dateSegment.id = newMoment.id;
                } else {
                  dateSegment.id = -Math.round(Math.random() * 10000000);
                }
              });

              for (
                let i = newGroup[newActIndex].moments.length - 1;
                i >= 0;
                i--
              ) {
                if (
                  Number(newGroup[newActIndex].moments.at(i).state_number) ==
                  Number(newMoment.state_number) - 1
                ) {
                  newMoment.parent = newGroup[newActIndex].moments.at(i).id;
                  newMoment.schedule_plan_activity_id =
                    newGroup[newActIndex].moments.at(i).id;
                  break;
                }
              }

              newMoment.group_id = null;
              newMoment.changed = true;

              newColumns.forEach((col) => {
                if (
                  col.values[this.project.id] &&
                  col.values[this.project.id].activities[mom.activityId]
                )
                  col.values[this.project.id].activities[
                    newGroup[newActIndex].id
                  ].plans[newMoment.id] = col.values[this.project.id]
                    .activities[mom.activityId].plans[mom.planId]
                    ? col.values[this.project.id].activities[mom.activityId]
                        .plans[mom.planId]
                    : "";
              });

              //this.idMoments.push(newMomentId)
              this.selectedMomentsForCopyPaste.forEach((mom1) => {
                if (mom1.parent == mom.planId) {
                  //mom1.parent = newMomentId;
                  mom1.parent = newMoment.id;
                  mom1.state_number = Number(mom.state_number) + 1;
                }
              });
              newGroup[newActIndex].moments.push(newMoment);
            } else {
              //selected moment is state
              if (
                mom.state_number == 1 &&
                this.selectedMomentsForCopyPaste.findIndex(
                  (cp) => cp.id == m.parent
                ) != -1
              ) {
                let newMoment = this.deepCopy(m);

                newMoment.id = -Math.round(Math.random() * 10000000);
                newMoment.dateSegments[0].connected = 0;
                newMoment.dateSegments[0].connectedToPlan = 0;
                newMoment.changed = true;
                newMoment.group_id = null;
                newMoment.activity_id = newGroup[newActIndex].id;
                newMoment.schedule_plan_activity_id = newGroup[newActIndex].id;
                newMoment.parent = newGroup[newActIndex].id;

                newMoment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
                  if(dateSegmentIndex == 0){
                    dateSegment.id = newMoment.id;
                  } else {
                    dateSegment.id = -Math.round(Math.random() * 10000000);
                  }
                });

                //paste value of new columns from copy state
                newColumns.forEach((col) => {
                  if (
                    col.values[this.project.id] &&
                    col.values[this.project.id].activities[mom.activityId]
                  )
                    col.values[this.project.id].activities[
                      newGroup[newActIndex].id
                    ].plans[newMoment.id] = col.values[this.project.id]
                      .activities[mom.activityId].plans[mom.planId]
                      ? col.values[this.project.id].activities[mom.activityId]
                          .plans[mom.planId]
                      : "";
                });

                this.selectedMomentsForCopyPaste.forEach((mom1) => {
                  if (mom1.parent == mom.planId) {
                    mom1.parent = newMoment.id;
                    mom1.state_number = Number(mom.state_number) + 1;
                  }
                });
                newGroup[newActIndex].moments.push(newMoment);
              }
              // not selected parent
              else {
                moment_has_been_activity = {
                  id: -Math.round(Math.random() * 10000000),
                  number: "",
                  description: m.name,
                  styles: m.styles,
                  moments: [],
                  startDate: m.start_date,
                  endDate: m.end_date,
                  startWeekDate: null,
                  endWeekDate: null,
                  numberOfDays: m.dateSegments[0].numberOfDays,
                  y: 0,
                  x: this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                    new Date(m.start_date)
                  ),
                  resourceWeeks: null,
                  countAsResources: false,
                  percentage_of_realized_activity: null,
                  sort_index: m.sort_index,
                  tape_color: m.tape_color,
                  dateSegments: m.dateSegments,
                  number_of_workers: m.number_of_workers,
                  time: m.time,
                  default_moment_id: m.moment_id,
                  plan: m.plan,
                  part: m.part,
                  monster: m.monster,
                  changed: true
                }
                moment_has_been_activity.dateSegments[0].connected = 0;
                moment_has_been_activity.dateSegments[0].connectedToPlan = null;
                moment_has_been_activity.sort_index = sort;

                moment_has_been_activity.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
                  if(dateSegmentIndex == 0){
                    dateSegment.id = moment_has_been_activity.id;
                  } else {
                    dateSegment.id = -Math.round(Math.random() * 10000000);
                  }
                });


                newColumns.forEach((col) => {
                  if (
                    col.values[this.project.id] &&
                    col.values[this.project.id].activities[m.activity_id]
                  )
                    col.values[this.project.id].activities[
                      moment_has_been_activity.id
                    ] = {
                      plans: {},
                      value:
                        col.values[this.project.id].activities[m.activity_id] &&
                        col.values[this.project.id].activities[m.activity_id]
                          .plans[m.id]
                          ? col.values[this.project.id].activities[
                              m.activity_id
                            ].plans[m.id]
                          : "",
                    };
                });

                this.selectedMomentsForCopyPaste.forEach((mom1) => {
                  if (mom1.parent == mom.planId) {
                    //mom1.parent = activityId;
                    mom1.parent = moment_has_been_activity.id;
                    mom1.state_number = 1;
                  }
                });
                // mom.activityId = activityId
                // mom.planId != null ? mom.planId = activityId : null
                mom.activityId = moment_has_been_activity.id;
                mom.planId != null
                  ? (mom.planId = moment_has_been_activity.id)
                  : null;
                if (mom.planId < 0) mom.planId = Number(mom.planId) * -1;
                //moment_has_been_activity.id = activityId
                //this.idMoments.push(activityId)
                newGroup.push(moment_has_been_activity);
                sort++;
                newActIndex++;
              }
            }
          }
          // activity selected
          else {
            let a = this.deepCopy(
              this.copySelectedProject.activities.find(
                (a) => a.id == mom.activityId
              )
            );

            //if copy moments from another project
            if(a == undefined){
              a = this.deepCopy(
                mom.moment ? mom.moment : mom
              );
            }
            //because same id
            // mom.id

            moment_has_been_activity = {
              id: -Math.round(Math.random() * 10000000),
              number: a.number,
              description: a.description,
              styles: a.styles,
              moments: [],
              startDate: a.startDate,
              endDate: a.endDate,
              startWeekDate: a.startWeekDate,
              endWeekDate: a.endWeekDate,
              numberOfDays: a.numberOfDays,
              y: 0,
              x: this.projectSchedulePlanerApp.daysMonthsContainer.findXPositionOfDay(
                new Date(a.startDate)
              ),
              resourceWeeks: null,
              countAsResources: false,
              percentage_of_realized_activity:
                a.percentage_of_realized_activity,
              sort_index: a.sort_index,
              tape_color: a.tape_color,
              dateSegments: a.dateSegments,
              number_of_workers: a.number_of_workers,
              time: a.time,
              default_moment_id: a.default_moment_id,
              plan: a.plan,
              part: a.part,
              monster: a.monster,
              changed: true,
            };
            moment_has_been_activity.sort_index = sort;
            moment_has_been_activity.dateSegments[0].connected = 0;
            moment_has_been_activity.dateSegments[0].connectedToPlan = null;

            moment_has_been_activity.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
              if(dateSegmentIndex == 0){
                dateSegment.id = moment_has_been_activity.id;
              } else {
                dateSegment.id = -Math.round(Math.random() * 10000000);
              }
            });

            newColumns.forEach((col) => {
              if (
                col.values[this.project.id] &&
                col.values[this.project.id].activities[mom.activityId]
              )
                col.values[this.project.id].activities[
                  moment_has_been_activity.id
                ] = {
                  plans: {},
                  value:
                    col.values[this.project.id].activities[mom.activityId]
                      .value,
                };
            });

            // const activityId = await this.scheduleService.createSchedulePlan(
            //   null,
            //   null,
            //   null,
            //   moment_has_been_activity.description,
            //   moment_has_been_activity.plan,
            //   moment_has_been_activity.startDate,
            //   moment_has_been_activity.endDate,
            //   moment_has_been_activity.time,
            //   moment_has_been_activity.number_of_workers,
            //   null,
            //   0,
            //   moment_has_been_activity.sort_index,
            //   this.project.id
            // )
            // this.scheduleService.updatePart(activityId,moment_has_been_activity.part)
            //can optimaze
            this.selectedMomentsForCopyPaste.forEach((mom1) => {
              if (mom1.parent == mom.activityId) {
                //mom1.parent = activityId;
                mom1.parent = a.id;
              }
            });
            //mom.activityId = activityId
            mom.activityId = a.id;
            //moment_has_been_activity.id = activityId
            //this.idMoments.push(activityId)
            newGroup.push(moment_has_been_activity);
            sort++;
            newActIndex++;
          }
        }
      } else {
        //paste somewhere in activity
        for (let k = 0; k < this.selectedMomentsForCopyPaste.length; k++) {
          this.addNewRowNumber();
          let mom = this.selectedMomentsForCopyPaste[k];
          if (mom.activity_id != null) {
            let newMoment = this.deepCopy(mom.moment ? mom.moment : mom);
            //for plans
            if (
              this.selectedMomentsForCopyPaste.findIndex(
                (cp) =>
                  cp.id == newMoment.parent && newMoment.state_number > 1
              ) != -1
            ) {
              let oldIdOfCopyMoment = newMoment.id;
              newMoment.id = -Math.round(Math.random() * 10000000);
              newMoment.dateSegments[0].connected = 0;
              newMoment.dateSegments[0].connectedToPlan = null;

              newMoment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
                if(dateSegmentIndex == 0){
                  dateSegment.id = newMoment.id;
                } else {
                  dateSegment.id = -Math.round(Math.random() * 10000000);
                }
              });

              newColumns.forEach((col) => {
                if (
                  col.values[this.project.id] &&
                  col.values[this.project.id].activities[newMoment.activity_id]
                )
                  col.values[this.project.id].activities[
                    selectedWhereToCopy.activity_id
                  ].plans[newMoment.id] = col.values[this.project.id]
                    .activities[newMoment.activity_id].plans[oldIdOfCopyMoment]
                    ? col.values[this.project.id].activities[
                        newMoment.activity_id
                      ].plans[oldIdOfCopyMoment]
                    : "";
              });

              newMoment.global_activity_id =
                selectedWhereToCopy.global_activity_id;
              newMoment.activity_id = selectedWhereToCopy.activity_id;
              //newMoment.schedule_plan_activity_id = selectedWhereToCopy.schedule_plan_activity_id;
              //newMoment.state = newMoments[1].name;
              newMoment.parent_type = "PLAN";
              newMoment.percentage_of_realized_plan = null;
              // newMoment.group_id = selectedWhereToCopy.group_id;
              // newMoment.sort_index = sort;
              newMoment.state_number = Number(newMoment.state_number) -
                                      Number(this.selectedMomentsForCopyPaste.at(0).state_number ? this.selectedMomentsForCopyPaste.at(0).state_number : 0) +
                                      // Number(this.selectedMomentsForCopyPaste.find((cp) =>
                                      //         cp.id == newMoment.parent && newMoment.state_number > 1).state_number) +
                                      Number(selectedWhereToCopy.state_number)
              // newMoment.state_number =
              //   Number(
              //     newMoments.find((m) => m.id == mom.parent).state_number
              //   ) + 1;
              // newMoments.find(
              //   (mom1) => mom1.id == mom.parent
              // ).percentage_of_realized_plan = 0;
              newMoment.activity_id = selectedWhereToCopy.activity_id;
              // newMoment.schedule_plan_activity_id = selectedWhereToCopy.activity_id
              // newMoment.parent = mom.parent

              for (let i = newMoments.length - 1; i >= 0; i--) {
                if (
                  Number(newMoments.at(i).state_number) ==
                  Number(newMoment.state_number) - 1
                ) {
                  newMoments.at(i).percentage_of_realized_plan = 0;
                  newMoment.parent = newMoments.at(i).id;
                  newMoment.schedule_plan_activity_id = newMoments.at(i).id;
                  break;
                }
              }

              newMoment.changed = true;
              newMoment.group_id = null;

              newColumns.forEach((col) => {
                if (
                  col.values[this.project.id] &&
                  col.values[this.project.id].activities[mom.activityId]
                )
                  col.values[this.project.id].activities[
                    newGroup[newActIndex].id
                  ].plans[newMoment.id] = col.values[this.project.id]
                    .activities[mom.activityId].plans[mom.planId]
                    ? col.values[this.project.id].activities[mom.activityId]
                        .plans[mom.planId]
                    : "";
              });
              //this.idMoments.push(newMomentId)
              this.selectedMomentsForCopyPaste.forEach((mom1) => {
                if (mom1.parent == mom.planId) {
                  mom1.parent = newMoment.id;
                }
              });
              // mom.planId = -newMoment.id
              newMoments.push(newMoment);
            } else {
              //for state
              if (
                newMoment.state_number == 1 &&
                this.selectedMomentsForCopyPaste.findIndex(
                  (cp) => cp.id == newMoment.parent
                ) != -1
              ) {
                let oldIdOfCopyMoment = newMoment.id;
                newMoment.changed = true;
                newMoment.id = -Math.round(Math.random() * 10000000);
                newMoment.dateSegments[0].connected = 0;
                newMoment.dateSegments[0].connectedToPlan = null;

                newMoment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
                  if(dateSegmentIndex == 0){
                    dateSegment.id = newMoment.id;
                  } else {
                    dateSegment.id = -Math.round(Math.random() * 10000000);
                  }
                });

                newColumns.forEach((col) => {
                  if (
                    col.values[this.project.id] &&
                    col.values[this.project.id].activities[
                      newMoment.activity_id
                    ]
                  )
                    col.values[this.project.id].activities[
                      selectedWhereToCopy.activity_id
                    ].plans[newMoment.id] = col.values[this.project.id]
                      .activities[newMoment.activity_id].plans[
                      oldIdOfCopyMoment
                    ]
                      ? col.values[this.project.id].activities[
                          newMoment.activity_id
                        ].plans[oldIdOfCopyMoment]
                      : "";
                });

                newMoments[newMomIndex].percentage_of_realized_plan = 0;
                newMoment.global_activity_id =
                  selectedWhereToCopy.global_activity_id;
                newMoment.activity_id = selectedWhereToCopy.activity_id;
                newMoment.schedule_plan_activity_id =
                newMoments[newMomIndex].id;
                newMoment.state =
                  selectedWhereToCopy.state_number == 1
                    ? "STATE"
                    : selectedWhereToCopy.state;
                newMoment.parent = newMoments[newMomIndex].id;
                newMoment.parent_type =
                  selectedWhereToCopy.state_number == 1 ? "STATE" : "PLAN";
                newMoment.percentage_of_realized_plan = null;
                // newMoment.group_id = selectedWhereToCopy.group_id;
                // newMoment.sort_index = sort;
                newMoment.state_number =
                  Number(newMoment.state_number) +
                  Number(selectedWhereToCopy.state_number);

                newMoment.group_id = null;

                this.selectedMomentsForCopyPaste.forEach((mom1) => {
                  if (mom1.parent == mom.planId) {
                    //mom1.parent = newMomentId

                    mom1.parent = newMoment.id;
                  }
                });
                newMoments.push(newMoment);
              } else {
                //plans who parent not selected
                let oldIdOfCopyMoment = newMoment.id;
                newMoment.id = -Math.round(Math.random() * 10000000);
                newMoment.changed = true;
                newMoment.dateSegments[0].connected = 0;
                newMoment.dateSegments[0].connectedToPlan = null;

                newMoment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
                  if(dateSegmentIndex == 0){
                    dateSegment.id = newMoment.id;
                  } else {
                    dateSegment.id = -Math.round(Math.random() * 10000000);
                  }
                });

                newColumns.forEach((col) => {
                  if (
                    col.values[this.project.id] &&
                    col.values[this.project.id].activities[
                      newMoment.activity_id
                    ]
                  )
                    col.values[this.project.id].activities[
                      selectedWhereToCopy.activity_id
                    ].plans[newMoment.id] =
                      col.values[this.project.id].activities[
                        newMoment.activity_id
                      ] &&
                      col.values[this.project.id].activities[
                        newMoment.activity_id
                      ].plans[oldIdOfCopyMoment]
                        ? col.values[this.project.id].activities[
                            newMoment.activity_id
                          ].plans[oldIdOfCopyMoment]
                        : "";
                });

                newMoment.global_activity_id =
                  selectedWhereToCopy.global_activity_id;
                newMoment.activity_id = selectedWhereToCopy.activity_id;
                newMoment.schedule_plan_activity_id =
                  selectedWhereToCopy.schedule_plan_activity_id;
                newMoment.state =
                  selectedWhereToCopy.state_number == 1
                    ? "STATE"
                    : selectedWhereToCopy.state;
                newMoment.state_number = selectedWhereToCopy.state_number;
                newMoment.parent = selectedWhereToCopy.parent;
                newMoment.parent_type =
                  selectedWhereToCopy.state_number == 1
                    ? "ACTIVITY"
                    : selectedWhereToCopy.parent_type;
                newMoment.group_id = selectedWhereToCopy.group_id;
                newMoment.sort_index = sort;
                newMoment.percentage_of_realized_plan = null;

                this.selectedMomentsForCopyPaste.forEach((mom1) => {
                  if (mom1.parent == mom.planId) {
                    //mom1.parent = newMomentId
                    mom1.parent = newMoment.id;
                  }
                });
                // mom.activityId = selectedWhereToCopy.activity_id;
                // mom.planId = -newMoment.id;
                newMoments.push(newMoment);
                sort++;
                newMomIndex++;
              }
            }
          } else {
            //for activity
            let newMoment = this.deepCopy(
              this.copySelectedProject.activities.find(
                (a) => a.id == mom.activityId
              )
            );

            if(newMoment == undefined){
              newMoment = this.deepCopy(
                mom
              );
            }

            let activity_has_been_moment: Moment;
            activity_has_been_moment = {
              //id: newMomentId.id,
              id: -Math.round(Math.random() * 10000000),
              global_activity_id: selectedWhereToCopy.activity_id,
              activity_id: selectedWhereToCopy.activity_id,
              schedule_plan_activity_id:
                selectedWhereToCopy.schedule_plan_activity_id,
              moment_id: newMoment.default_moment_id,
              name: newMoment.description,
              plan: newMoment.plan,
              start_date: newMoment.startDate,
              end_date: newMoment.endDate,
              time: newMoment.time,
              number_of_workers: newMoment.number_of_workers,
              state:
                selectedWhereToCopy.state_number == 1
                  ? "STATE"
                  : selectedWhereToCopy.state,
              state_number: selectedWhereToCopy.state_number,
              dateSegments: newMoment.dateSegments,
              styles: newMoment.styles,
              percentage_of_realized_plan:
                newMoment.moments.length == 0
                  ? null
                  : newMoment.percentage_of_realized_activity,
              y: newMoment.y,
              parent: selectedWhereToCopy.parent,
              parent_type:
                selectedWhereToCopy.state_number == 1
                  ? "ACTIVITY"
                  : selectedWhereToCopy.parent_type,
              tape_color: newMoment.tape_color,
              moments: [],
              group_id: selectedWhereToCopy.group_id,
              sort_index: sort,
              part: newMoment.part,
              changed: true,
            };

            activity_has_been_moment.dateSegments[0].connected = 0;
            activity_has_been_moment.dateSegments[0].connectedToPlan = null;

            activity_has_been_moment.dateSegments.forEach((dateSegment, dateSegmentIndex) => {
              if(dateSegmentIndex == 0){
                dateSegment.id = activity_has_been_moment.id;
              } else {
                dateSegment.id = -Math.round(Math.random() * 10000000);
              }
            });

            newColumns.forEach((col) => {
              if (
                col.values[this.project.id] &&
                col.values[this.project.id].activities[newMoment.id]
              )
                col.values[this.project.id].activities[
                  selectedWhereToCopy.activity_id
                ].plans[activity_has_been_moment.id] =
                  col.values[this.project.id].activities[newMoment.id].value;
            });

            // const newMomentId = await this.scheduleService.createSchedulePlan(
            //   null,
            //   null,
            //   null,
            //   activity_has_been_moment.name,
            //   activity_has_been_moment.plan,
            //   activity_has_been_moment.start_date,
            //   activity_has_been_moment.end_date,
            //   activity_has_been_moment.time,
            //   activity_has_been_moment.number_of_workers,
            //   selectedWhereToCopy.group_id,
            //   activity_has_been_moment.state_number,
            //   activity_has_been_moment.sort_index,
            //   this.project.id
            // )
            // this.scheduleService.updatePart(newMomentId,activity_has_been_moment.part)
            // this.idMoments.push(newMomentId)
            this.selectedMomentsForCopyPaste.forEach((mom1) => {
              if (mom1.parent == mom.activity_id) {
                //mom1.parent = newMomentId;
                mom1.parent = activity_has_been_moment.id;
              }
            });
            // mom.planId = -activity_has_been_moment.id;
            newMoments.push(activity_has_been_moment);
            sort++;
            newMomIndex++;
          }
        }
      }

      if(this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer){
        this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.setY(
          this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getY() + this.selectedMomentsForCopyPaste.length * ConfigSc.cellHeight
        );
      }

      let maxEndDate;
      //insert copy moments in activity
      for (let j = 0; j < newMoments.length; j++) {
        if(!maxEndDate || newMoments[j].dateSegments.at(-1).endDate > maxEndDate) maxEndDate = newMoments[j].dateSegments.at(-1).endDate;
        this.copySelectedProject.activities[a_i].changed = true;
        this.insertAt(
          this.copySelectedProject.activities[a_i].moments,
          m_i + j,
          newMoments[j]
        );
      }

      if(newMoments.length > 0){
        this.updateParent(this.copySelectedProject.activities[a_i],this.copySelectedProject.activities[a_i].moments[m_i])
      }
      //update sortIndex of moments bellow
      if (m_i != -1) {
        for (
          let i = m_i + newMoments.length;
          i < this.copySelectedProject.activities[a_i].moments.length;
          i++
        ) {
          if (
            this.copySelectedProject.activities[a_i].moments[i].state_number <
            selectedWhereToCopy.state_number
          )
            break;
          if (
            this.copySelectedProject.activities[a_i].moments[i].state_number ==
            selectedWhereToCopy.state_number
          ) {
            this.copySelectedProject.activities[a_i].moments[i].changed = true;
            this.copySelectedProject.activities[a_i].moments[i].sort_index =
              sort;
            sort++;
            changesPlan.push({
              projectId: this.project.id,
              planId: this.copySelectedProject.activities[a_i].moments[i].id,
              value:
                this.copySelectedProject.activities[a_i].moments[i].sort_index,
            });
          }
        }
      } else {
        //add copy to array
        for (let j = 0; j < newGroup.length; j++) {
          this.insertAt(
            this.copySelectedProject.activities,
            a_i + j,
            newGroup[j]
          );
          CpspRef.cmp.copySelectedProject.activities[a_i + j].y = y;
          y +=
            CpspRef.cmp.copySelectedProject.activities[a_i + j].moments.length *
              ConfigSc.cellHeight +
            ConfigSc.cellHeight;
        }

        //update sortIndex of emptyRow bellow
        for (
          let i = a_i + newGroup.length;
          i < this.copySelectedProject.activities.length;
          i++
        ) {
          this.copySelectedProject.activities[i].changed = true;
          this.copySelectedProject.activities[i].sort_index = sort;
          sort++;
          CpspRef.cmp.copySelectedProject.activities[i].y = y;
          y +=
            CpspRef.cmp.copySelectedProject.activities[i].moments.length *
              ConfigSc.cellHeight +
            ConfigSc.cellHeight;
          changesPlan.push({
            projectId: this.project.id,
            planId: this.copySelectedProject.activities[i].id,
            value: this.copySelectedProject.activities[i].sort_index,
          });
        }
      }

      // historySchedulePlaner.appendToQueueGroup(() =>
      //   this.scheduleService.changePlanProperty("sortIndex", changesPlan)
      // );

      this.selectedProject = this.deepCopy(this.copySelectedProject);
      this.selectedMomentsForCopyPaste = this.deepCopy(pomSelected);
      this.hideColumnValueInput();
      CpspRef.cmp.setLoadingStatus(false);
      if (
        this.projectSchedulePlanerApp.projectMomentsContainer &&
        this.projectSchedulePlanerApp.projectMomentsContainer.getHeight() <
        this.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfAllDisplayActivitiesAndMoments() *
          ConfigSc.cellHeight
      )
        this.projectSchedulePlanerApp.projectMomentsContainer.updateInnerContainerHeight();

    } else {
      if (CpspRef.cmp.planInput.style.display == "block")
        CpspRef.cmp.planInput.value = this.copyText;
      else if (CpspRef.cmp.columnValueInput.style.display == "block") {
        this.inputValue = this.copyText;
        const inp = document.getElementById(
          "columnValueEditInput1"
        ) as HTMLInputElement;
        inp.value = this.copyText;
      } else if (CpspRef.cmp.newColumnValueInput.style.display == "block") {
        CpspRef.cmp.newColumnValueInput.value = this.copyText;
      }
    }
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
    );
    if(!this.needNewApp)
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

      document.removeEventListener("paste", (e : ClipboardEvent) =>{
      })
  }

  executeCopyPasteColumns(){
    const condition = this.selectedMomentsForStyleChange.at(0).activity_id ?
    this.selectedMomentsForStyleChange.at(0).activity_id :
    this.selectedMomentsForStyleChange.at(0).id
    let actIndex = this.copySelectedProject.activities.findIndex(activity =>
      activity.id == condition);
    let momIndex = this.copySelectedProject.activities.at(actIndex).moments.findIndex(mom => mom.id == this.selectedMomentsForStyleChange.at(0).id)
    // let moments = this.projectSchedulePlanerApp.projectMomentsContainer.selectedMoments();
    let moments = this.selectedMomentsForCopyPaste;
    let numMoments = moments.length;
    let pasteCounter = 0;

    for(actIndex ; actIndex < this.copySelectedProject.activities.length; actIndex++){
      if(numMoments == 0) break;
      let activity = this.copySelectedProject.activities.at(actIndex);
      activity.changed = true;
      if(momIndex == -1){
        for(let k = 0; k < this.selectedColumnsForCopyPaste.length; k++){
          let column = this.selectedColumnsForCopyPaste.at(k);
          if(column.key == "Details"){
            activity.description = moments.at(pasteCounter).name ? moments.at(pasteCounter).name : moments.at(pasteCounter).description;
            // start date is not selected, automatic add today
            if(!this.selectedColumnsForCopyPaste.some((column) => column.key === "start_date" || column.key === "days" )){
              if(activity.dateSegments.at(0).startDate == null){
                activity.dateSegments.at(0).startDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
                activity.dateSegments.at(-1).endDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
              }
            }
          }
          else if(column.key == "start_date"){
            activity.dateSegments = moments.at(pasteCounter).dateSegments;
          }
          else if(column.key == "end_date"){

          }
          else if(column.key == "days"){
            if(activity.description == null) activity.description = "Ny moment"
            if(activity.dateSegments.at(0).startDate == null){
              activity.dateSegments.at(0).startDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
              activity.dateSegments.at(-1).endDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
            }
            let newValue = moments.at(pasteCounter).activity_id &&
            moments.at(pasteCounter).percentage_of_realized_plan &&
            moments.at(pasteCounter).percentage_of_realized_plan != null ?
            this.calculateDaysOfChildren(
              moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).activity_id : moments.at(pasteCounter).id,
              moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).id : 0
            ) :
            this.calculateDaysOfMoment(moments.at(pasteCounter));
            let oldValue = activity.moments.length > 0 ?
            this.calculateDaysOfChildren(activity.id,0) :
            this.calculateDaysOfMoment(activity);

            this.changeDaysOfTape(
              activity,
              newValue,
              oldValue
            );
          }
          else if(column.key == "hours"){
            let newTime = moments.at(pasteCounter).activity_id &&
            moments.at(pasteCounter).percentage_of_realized_plan &&
            moments.at(pasteCounter).percentage_of_realized_plan != null ?
              moments.at(pasteCounter).time :
              this.calculateHoursOfChildren(
                moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).activity_id : moments.at(pasteCounter).id,
                moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).id : 0
              )
            activity.time = Number(newTime);
            activity.number_of_workers = Math.ceil(10*activity.time / (this.getAllDaysOfMoment(activity)*this.workingHours))/10;
          }
          else if(column.key == "resource"){
            if(this.selectedColumns.some(col => col.key == "hours")) continue;
            activity.number_of_workers = moments.at(pasteCounter).number_of_workers;
            activity.time =
              activity.number_of_workers *
              this.getAllDaysOfMoment(activity) *
              this.workingHours;
          }
          else {
            if(activity.description == null) activity.description = "Ny moment"
            activity[column.key] = moments.at(pasteCounter)[column.key]
          }
        }
        if(activity.dateSegments.at(0).startDate != null)
          activity.startDate = activity.dateSegments.at(0).startDate
        pasteCounter++;
        numMoments--;
        momIndex = 0;
      }
      for(let i = momIndex; i < activity.moments.length; i++){
        if(numMoments == 0) break;
        activity.moments.at(i).changed = true;
        // if(moments.some(mom => mom.id == activity.moments.at(i).id)){
          for(let k = 0; k < this.selectedColumnsForCopyPaste.length; k++){
            let column = this.selectedColumnsForCopyPaste.at(k);
            if(column.key == "Details"){
              activity.moments.at(i).name = moments.at(pasteCounter).name ? moments.at(pasteCounter).name : moments.at(pasteCounter).description;
              // start date is not selected, automatic add today
              if(!this.selectedColumnsForCopyPaste.some((column) => column.key === "start_date" || column.key === "days" )){
                if(activity.dateSegments.at(0).startDate == null){
                  activity.dateSegments.at(0).startDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
                  activity.dateSegments.at(-1).endDate = ConfigSc.currentDate.format(ConfigSc.dateFormat);
                }
              }
            }
            else if(column.key == "start_date"){
              activity.moments.at(i).dateSegments = moments.at(pasteCounter).dateSegments;
            }
            else if(column.key == "end_date"){

            }
            else if(column.key == "days"){
              let newValue = moments.at(pasteCounter).activity_id &&
              moments.at(pasteCounter).percentage_of_realized_plan &&
              moments.at(pasteCounter).percentage_of_realized_plan != null ?
              this.calculateDaysOfChildren(
                moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).activity_id : moments.at(pasteCounter).id,
                moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).id : 0
              ) :
              this.calculateDaysOfMoment(moments.at(pasteCounter));
              let oldValue = activity.moments.at(i).percentage_of_realized_plan != null ?
              this.calculateDaysOfChildren(activity.id,activity.moments.at(i).id) :
              this.calculateDaysOfMoment(activity.moments.at(i));

              this.changeDaysOfTape(
                activity.moments.at(i),
                newValue,
                oldValue
              );
+              this.updateParent(activity, activity.moments.at(i));
            }
            else if(column.key == "hours"){
              let newTime = moments.at(pasteCounter).activity_id &&
              moments.at(pasteCounter).percentage_of_realized_plan &&
              moments.at(pasteCounter).percentage_of_realized_plan != null ?
              moments.at(pasteCounter).time :
              this.calculateHoursOfChildren(
                moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).activity_id : moments.at(pasteCounter).id,
                moments.at(pasteCounter).activity_id ? moments.at(pasteCounter).id : 0
              );
              activity.moments.at(i).time = newTime;
              activity.moments.at(i).number_of_workers = Math.ceil(10*activity.moments.at(i).time / (this.getAllDaysOfMoment(activity.moments.at(i))*this.workingHours))/10;
            }
            else if(column.key == "resource"){
              if(this.selectedColumnsForCopyPaste.some(col => col.key == "hours")) continue;

              activity.moments.at(i).number_of_workers = moments.at(pasteCounter).number_of_workers;
              activity.moments.at(i).time =
              activity.moments.at(i).number_of_workers *
              this.getAllDaysOfMoment(activity.moments.at(i)) *
              this.workingHours;
            }
            else {
              activity.moments.at(i)[column.key] = moments.at(pasteCounter)[column.key]
            }
          }
          pasteCounter++;
          numMoments--;
        //}
      }
      momIndex = -1;
    }
    this.selectedProject = this.deepCopy(this.copySelectedProject);
    historySchedulePlaner.addToQueue(
      () => true,
      () => true
      );
    // this.hideColumnValueInput();
    this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();

  }

  insertAt(array, index, ...elementsArray) {
    array.splice(index, 0, ...elementsArray);
  }

  addNewActivityWithChildren() {
    for (let i = this.copySelectedProject.activities.length - 1; i > 0; i--) {
      // && this.copySelectedProject.activities.at(i).id < 0
      if (
        this.copySelectedProject.activities.at(i).changed &&
        this.copySelectedProject.activities.at(i).moments.length > 0
      ) {
        // this.copySelectedProject.activities.at(i + 1).description = " "
        this.copySelectedProject.activities.at(i + 1).changed = true;
        return;
      }
    }
  }

  //save after all changes
  async executeQueueSave() {

    let a1 = CpspRef.cmp.copySelectedProject;
    this.addNewActivityWithChildren();
    //let a2 = CpspRef.cmp.baseSelectedProject;
    let changesPlans = [];
    let changesPlansDates = [];
    let changesPlansConnected = [];
    let changesPlansGroups = [];
    let changesPlansStates = [];
    let changesColumnValues = [];
    // let col = this.visibleColumns.at(1)
    let newColumns = this.allColumns.filter((col) => col.key == null);
    //if(a1.activities.length != a2.activities.length) return false;
    //else{
    for (let act of a1.activities) {

      //a1.activities.forEach(async (act,ind) => {
      let newActId;
      let groupId;
      let oldActId;
      let hasNewValues = false;
      //if(act.moments.length != a2.activities[ind].moments.length) return false;
      //if(JSON.stringify(act) != JSON.stringify(a2.activities[ind])){
      if (act.changed) {
        //case for activity
        //if(act.moments.length == 0){
        //need create new activity in db
        //&& act.description != null && act.description!=""

        for(let h = 0; h < act.dateSegments.length; h++){
          let dateSegment = act.dateSegments.at(h);

          //case if activity has been split tape
          if(act.moments.length > 0 && h != 0){
            let ids = [];
            for(let m = h; m < act.dateSegments.length; m++){
              ids.push(act.dateSegments.at(m).id);
            }
            this.scheduleService.deleteSchedulePlan(ids);
            break;
          }

          if (dateSegment.id < 0) {
            newActId = await this.scheduleService.createSchedulePlan(
              null,
              null,
              null,
              act.description != " " ? act.description : null,
              act.plan,
              dateSegment.startDate,
              dateSegment.endDate,
              act.time,
              act.number_of_workers,
              null,
              0,
              act.sort_index,
              this.project.id,
              act.monster ? act.monster : 0
            );

            dateSegment.id = newActId;

            this.newOldIds.push({
              newId: newActId,
              oldId: act.id,
            });

            newColumns.forEach((col) => {
              if (
                col.values[this.project.id] &&
                col.values[this.project.id].activities[act.id]
              ) {
                oldActId = act.id;
                hasNewValues = true;
                changesColumnValues = changesColumnValues.concat(
                  this.addToChangeScheduleColumnValues(col, oldActId, newActId, 0)
                );
              }
            });



                if(act.part != null && act.part != ""){
                  this.scheduleService.updatePart(newActId,act.part)
                }
                await this.scheduleService.changePlansDetails(
                  newActId,
                  "ACTIVITY",
                  act.styles.backgroundColor,
                  act.styles.color,
                  act.styles.fontSize,
                  act.styles.fontWeight,
                  act.styles.fontFamily,
                  act.styles.fontStyle,
                  act.styles.fontDecoration,
                  act.tape_color,
                  act.percentage_of_realized_activity,
                  act.dateSegments[0].startWorkDate,
                  act.dateSegments[0].currentWorkDate,
                  act.dateSegments[0].connected,
                  act.dateSegments[0].connectedToPlan,
                  act.dateSegments[0].noted,
                  act.dateSegments[0].noteText
                )

                  let indexConn = changesPlansConnected.findIndex(conMom => conMom.connectedToPlan  == act.id)
                  if(indexConn != -1){
                    changesPlansConnected.at(indexConn).connectedToPlan = newActId
                  }

                if(act.dateSegments[0].connected == 1){
                  changesPlansConnected.push({
                    projectId: CpspRef.cmp.project.id,
                    planId: newActId,
                    connected: act.dateSegments[0].connected,
                    connectedToPlan: act.dateSegments[0].connectedToPlan
                  });
                }


                act.moments.forEach(m => {
                  if(m.schedule_plan_activity_id == act.id)
                    m.schedule_plan_activity_id = newActId;
                  if(m.parent == act.id)
                    m.parent = newActId;
                  if(m.activity_id == act.id){
                    m.activity_id = newActId;
                  }
                })
                act.id = newActId;
                //schedule gruop for activity
                if(act.moments.length>0 && (act.moments.at(0).group_id == null || act.moments.at(0).group_id == -1)){
                  groupId = await this.scheduleService.createScheduleGroup(
                    this.project.id,
                    newActId,
                    newActId,
                    "ACTIVITY"
                  )
                  act.moments.forEach(mom =>{
                    if(mom.state_number == 1)
                    mom.group_id = -groupId;
                  })
                }
              } else{
                changesPlans.push({
                  "id": dateSegment.id,
                  "global_activity_id": null,
                  "schedule_plan_activity_id": null,
                  "moment_id": act.default_moment_id,
                  "name": act.description,
                  "plan" : act.plan,
                  "start_date" : dateSegment.startDate,
                  "end_date" : dateSegment.endDate,
                  "time" : act.time,
                  "number_of_workers" : act.number_of_workers,
                  "group_id" : null,
                  "state_number": 0,
                  "sort_index": act.sort_index,
                  "finished_time" : act.dateSegments[0].finishedTime,
                  "pattern": act.monster ? act.monster : 0
                });
                changesPlansDates.push({
                  projectId: CpspRef.cmp.project.id,
                  activityId: act.id,
                  stateType: null,
                  planId: null,
                  startDate: act.dateSegments[0].startWorkDate,
                  endDate: act.dateSegments[0].currentWorkDate
                });
                changesPlansStates.push({
                  "planId": act.id,
                  "state": "ACTIVITY"
                });
                changesPlansConnected.push({
                  projectId: CpspRef.cmp.project.id,
                  planId: act.id,
                  connected: act.dateSegments[0].connected,
                  connectedToPlan: act.dateSegments[0].connectedToPlan
                });

            if (act.moments.length > 0) {
              if (
                act.moments.at(0).group_id == null ||
                act.moments.at(0).group_id == -1
              ) {
                groupId = await this.scheduleService.createScheduleGroup(
                  this.project.id,
                  act.id,
                  act.id,
                  "ACTIVITY"
                );
                act.moments.forEach(mom =>{
                  if(mom.state_number == 1)
                  mom.group_id = -groupId;
                })
              } else {
                changesPlansGroups.push({
                  projectId: this.project.id,
                  activityId: act.id,
                  parent: act.id,
                  parentType: "ACTIVITY",
                });
              }
            }
          }
        }


        //}
        let indm = 0;
        for (let j = 0; j < act.moments.length; j++) {
          let mom = act.moments[j];
          //act.moments.forEach( async (mom,indm) =>{
          //if(JSON.stringify(mom) != JSON.stringify(a2.activities[ind].moments[indm])){
          if (mom.changed) {
            let newMomId;

            for(let h = 0; h < mom.dateSegments.length; h++){
              let dateSegment = mom.dateSegments.at(h);


              if(mom.percentage_of_realized_plan != null && h != 0){
                let ids = [];
                for(let m = h; m < mom.dateSegments.length; m++){
                  ids.push(mom.dateSegments.at(m).id);
                }
                this.scheduleService.deleteSchedulePlan(ids);
                break;
              }


              if (dateSegment.id < 0) {
                newMomId = await this.scheduleService.createSchedulePlan(
                  null,
                  mom.schedule_plan_activity_id,
                  null,
                  mom.name,
                  mom.plan,
                  dateSegment.startDate,
                  dateSegment.endDate,
                  mom.time,
                  mom.number_of_workers,
                  mom.group_id < -1
                    ? Number(mom.group_id) * -1
                    : groupId != undefined
                    ? groupId
                    : mom.group_id,
                  mom.state_number,
                  mom.sort_index,
                  this.project.id,
                  mom.monster ? mom.monster : 0
                );

                dateSegment.id = newMomId;

                this.newOldIds.push({
                  newId: newMomId,
                  oldId: mom.id,
                });

                if (mom.part != null && mom.part != "") {
                  this.scheduleService.updatePart(newMomId, mom.part);
                }

                this.scheduleService.changePlansDetails(
                  newMomId,
                  mom.state != undefined ? mom.state : "ACTIVITY",
                  mom.styles.backgroundColor,
                  mom.styles.color,
                  mom.styles.fontSize,
                  mom.styles.fontWeight,
                  mom.styles.fontFamily,
                  mom.styles.fontStyle,
                  mom.styles.fontDecoration,
                  mom.tape_color,
                  mom.percentage_of_realized_plan,
                  mom.dateSegments[0].startWorkDate,
                  mom.dateSegments[0].currentWorkDate,
                  mom.dateSegments[0].connected,
                  mom.dateSegments[0].connectedToPlan,
                  mom.dateSegments[0].noted,
                  mom.dateSegments[0].noteText
                );

                let i = indm + 1;

                while (act.moments[i]) {
                  if (
                    act.moments[i].state_number - 1 == mom.state_number &&
                    act.moments[i].parent == mom.id
                  ) {
                    act.moments[i].schedule_plan_activity_id = newMomId;
                    act.moments[i].parent = newMomId;
                    act.moments[i].activity_id = act.id;
                  }
                  if (j == 0 && act.moments[i].state_number == mom.state_number && Number(act.moments[i].group_id) < 0) {
                    act.moments[i].group_id = Number(groupId) * -1;
                  }

                  i++;
                }

                if (!oldActId) {
                  oldActId = mom.activity_id;
                }

                  newColumns.forEach(col =>{
                    if(col.values[this.project.id] &&
                      col.values[this.project.id].activities[oldActId] &&
                      col.values[this.project.id].activities[oldActId].plans[mom.id]){
                        changesColumnValues = changesColumnValues.concat(this.addToChangeScheduleColumnValues(col,oldActId,newActId,mom.id,newMomId))
                        col.values[this.project.id].activities[oldActId].plans[newMomId] = col.values[this.project.id].activities[oldActId].plans[mom.id]
                        delete col.values[this.project.id].activities[oldActId].plans[mom.id];
                      }

                  })
                  if(mom.dateSegments.length == 1)
                  mom.id = newMomId;
                  if(mom.group_id < -1)
                    mom.group_id = Number(mom.group_id) * -1;
                } else{
                  changesPlans.push({
                    "id": dateSegment.id,
                    "global_activity_id": null,
                    "schedule_plan_activity_id": mom.parent,
                    "moment_id": mom.moment_id,
                    "name": mom.name,
                    "plan" : mom.plan,
                    "start_date" : dateSegment.startDate,
                    "end_date" : dateSegment.endDate,
                    "time" : mom.time,
                    "number_of_workers" : mom.number_of_workers,
                    "group_id" : mom.group_id == null || mom.group_id == -1 ? groupId : mom.group_id < 0 ? Number(mom.group_id) * (-1) : mom.group_id,
                    "state_number": mom.state_number,
                    "sort_index": mom.sort_index,
                    "finished_time" : mom.dateSegments[0].finishedTime,
                    "pattern": mom.monster ? mom.monster : 0
                  });
                  //update other state group id
                  if(mom.group_id == null || mom.group_id == -1){
                    let indOtherState = indm + 1;
                    while(act.moments.at(indOtherState) && act.moments.at(indOtherState).state_number >= act.moments.at(indm).state_number){
                      if(act.moments.at(indOtherState).state_number == act.moments.at(indm).state_number)
                        act.moments.at(indOtherState).group_id = groupId;
                      indOtherState++;
                    }
                  }
                  changesPlansDates.push({
                    projectId: this.project.id,
                    activityId: act.id,
                    stateType: mom.state,
                    planId: mom.id,
                    startDate: mom.dateSegments[0].startWorkDate,
                    endDate: mom.dateSegments[0].currentWorkDate
                  });
                  changesPlansStates.push({
                    "planId": mom.id,
                    "state": mom.state_number == 1 ? "STATE" : "PLAN"
                  });
                  changesPlansConnected.push({
                    projectId: CpspRef.cmp.project.id,
                    planId: mom.id,
                    connected: +mom.dateSegments[0].connected,
                    connectedToPlan: mom.dateSegments[0].connectedToPlan,
                  });
                  // newColumns.forEach(col =>{
                  //   if(col.values[this.project.id] &&
                  //     col.values[this.project.id].activities[oldActId < -100 ? newActId : oldActId] &&
                  //     col.values[this.project.id].activities[oldActId < -100 ? newActId : oldActId].plans[mom.id]){
                  //       changesColumnValues = changesColumnValues.concat(this.addToChangeScheduleColumnValues(col,oldActId,newActId,mom.id))
                  //     }

                // })

                if (!oldActId) oldActId = mom.activity_id;

                newColumns.forEach((col) => {
                  if (
                    col.values[this.project.id] &&
                    col.values[this.project.id].activities[oldActId] &&
                    col.values[this.project.id].activities[oldActId].plans[mom.id]
                  ) {
                    changesColumnValues = changesColumnValues.concat(
                      this.addToChangeScheduleColumnValues(
                        col,
                        oldActId,
                        newActId,
                        mom.id,
                        newMomId
                      )
                    );
                    if (newMomId) {
                      col.values[this.project.id].activities[oldActId].plans[
                        newMomId
                      ] =
                        col.values[this.project.id].activities[oldActId].plans[
                          mom.id
                        ];
                      delete col.values[this.project.id].activities[oldActId]
                        .plans[mom.id];
                    }
                  }
                });
                if(mom.group_id < -1)
                  mom.group_id = Number(mom.group_id) * -1;
              }
            }

            if (
              act.moments.at(indm + 1) &&
              act.moments.at(indm + 1).parent == mom.id
            ) {
              // && (act.moments.at(indm + 1).group_id == mom.group_id || act.moments.at(indm + 1).group_id == -1)
              if (
                act.moments.at(indm + 1).state_number - 1 ==
                mom.state_number
              ) {
                groupId = await this.scheduleService.createScheduleGroup(
                  this.project.id,
                  act.id,
                  act.moments.at(indm).id,
                  act.moments.at(indm).state_number == 1 ? "STATE" : "PLAN"
                );
                //act.moments.at(indm + 1).group_id = groupId;
                let i = indm + 1;
                while (act.moments[i]) {
                  if (act.moments[i].parent == mom.id)
                    act.moments[i].group_id = -groupId;
                  i++;
                }
              } else {
                changesPlansGroups.push({
                  projectId: this.project.id,
                  activityId: act.id,
                  parent: act.moments.at(indm).id,
                  parentType:
                    act.moments.at(indm).state_number == 1 ? "STATE" : "PLAN",
                });
              }
            }
          }
          indm++;
        } //)
      }

      if (hasNewValues) {
        // for (let i = 0;i < this.visibleColumns.length; i++){
        //   let col = this.visibleColumns[i];
        //   if(col.key != null) continue;
        //   if(col.values[this.project.id].activities[oldActId]){
        //     col.values[this.project.id].activities[newActId] = col.values[this.project.id].activities[oldActId];
        //     delete col.values[this.project.id].activities[oldActId]
        //   }
        // }
        this.allColumns.forEach((col) => {
          // if(col.key != null) continue;
          if (
            col.key == null &&
            col.values[this.project.id] &&
            col.values[this.project.id].activities[oldActId]
          ) {
            col.values[this.project.id].activities[newActId] =
              col.values[this.project.id].activities[oldActId];
            delete col.values[this.project.id].activities[oldActId];
          }
        });
      }
    } //);
    //}

    if (changesPlans.length > 0) {
      this.scheduleService.changeSchedulePlan(changesPlans);
      this.scheduleService.changeSchedulePlanWorksDate(changesPlansDates);
      this.scheduleService.changeSchedulePlanDetailState(changesPlansStates);
    }
    if (changesPlansGroups.length > 0) {
      this.scheduleService.changeScheduleGroup(changesPlansGroups);
    }
    if (changesColumnValues.length > 0) {
      this.scheduleService.changeScheduleColumnValues(changesColumnValues);
    }
    if(changesPlansConnected.length > 0){
      this.scheduleService.changeSchedulePlanConnected(changesPlansConnected);
    }




    this.copySelectedProject.activities.forEach((activity)=>{
      if (activity.dateSegments[0].connectedToPlan < 0) {
        const oldConnectedToPlanId = activity.dateSegments[0].connectedToPlan;
        const newConnectedToPlanId = this.newOldIds.filter((ids) => ids.oldId == oldConnectedToPlanId)[0].newId;
        activity.dateSegments[0].connectedToPlan = newConnectedToPlanId;
        this.scheduleService.changePlansDetails(
          activity.id,
          "ACTIVITY",
          activity.styles.backgroundColor,
          activity.styles.color,
          activity.styles.fontSize,
          activity.styles.fontWeight,
          activity.styles.fontFamily,
          activity.styles.fontStyle,
          activity.styles.fontDecoration,
          activity.tape_color,
          activity.percentage_of_realized_activity,
          activity.dateSegments[0].startWorkDate,
          activity.dateSegments[0].currentWorkDate,
          activity.dateSegments[0].connected,
          activity.dateSegments[0].connectedToPlan,
          activity.dateSegments[0].noted,
          activity.dateSegments[0].noteText
        );

      }

      if (activity.moments.length > 0) {
        activity.moments.forEach((moment) => {
          if (moment.dateSegments[0].connectedToPlan < 0) {
            const oldConnectedToPlanId = moment.dateSegments[0].connectedToPlan;
            const newConnectedToPlanId = this.newOldIds.filter((ids) => ids.oldId == oldConnectedToPlanId)[0].newId;
            moment.dateSegments[0].connectedToPlan = newConnectedToPlanId
           this.scheduleService.changePlansDetails(
              moment.id,
              moment.state != undefined ? moment.state : "ACTIVITY",
              moment.styles.backgroundColor,
              moment.styles.color,
              moment.styles.fontSize,
              moment.styles.fontWeight,
              moment.styles.fontFamily,
              moment.styles.fontStyle,
              moment.styles.fontDecoration,
              moment.tape_color,
              moment.percentage_of_realized_plan,
              moment.dateSegments[0].startWorkDate,
              moment.dateSegments[0].currentWorkDate,
              moment.dateSegments[0].connected,
              moment.dateSegments[0].connectedToPlan,
              moment.dateSegments[0].noted,
              moment.dateSegments[0].noteText
            );
          }
        })

      }

    })
    CpspRef.cmp.lineConnections.forEach((connection) =>
    {
      if (connection.m1?.id < 0) {
        connection.m1.id = this.newOldIds.filter((ids) => ids.oldId == connection.m1.id)[0].newId;
      }
      if (connection.m2?.id < 0) {
        connection.m2.id = this.newOldIds.filter((ids) => ids.oldId == connection.m2.id)[0].newId;
      }
    }
    )

    return true;

  }

  addToChangeScheduleColumnValues(
    column,
    actId,
    newActId,
    planId,
    newPlanId = 0
  ) {
    let changesColumnValues = [];
    //for(let i = 0; i < this.allColumns.length; i++){
    let col = this.allColumns.find((c) => c.id == column.id);
    // if(col.key != null) continue;

    if (col.key == null) {
      if (
        col.values[this.project.id] &&
        col.values[this.project.id].activities[actId]
      ) {
        if (col.values[this.project.id].activities[actId].value != "")
          changesColumnValues.push({
            columnId: col.id,
            projectId: this.project.id,
            activityId: !newActId ? actId : newActId,
            planId: planId,
            value: col.values[this.project.id].activities[actId].value,
          });

        if (col.values[this.project.id].activities[actId].plans[planId])
          changesColumnValues.push({
            columnId: col.id,
            projectId: this.project.id,
            activityId: !newActId ? actId : newActId,
            planId: planId < 0 ? newPlanId : planId,
            value: col.values[this.project.id].activities[actId].plans[planId],
          });
      }
    }
    //}
    return changesColumnValues;
  }

  returnAllChangedToDefault(){
    this.copySelectedProject.activities.forEach(activity => {
      activity.changed = false;
      activity.moments.forEach(moment =>{
        moment.changed = false;
      });
    });
  }

  deleteSchedulePlanOnKeyDown() {
    let selectedMoments = this.projectSchedulePlanerApp.projectMomentsContainer.selectedMoments();
    // no select moments, but press Del key
    if(this.selectedMomentsForStyleChange.length == 0 &&
      selectedMoments.length == 0){
        return;
      }
    this.setLoadingStatus(true);
    let idOfMom = [];
    //settimeout se koristi iz razloga što je nekada pri više selektovanih momenata potrebno vremena da se procesuira
    //posljedica toga je da cjeli canvas zakoči i ne može prikazadi loading
    //koristeći settimeout se daje vrijeme da se spinner prikaže
    setTimeout(() => {
      let selectedActivitiesAndMomentsForDelete =
        CpspRef.cmp.selectedMomentsForStyleChange.length > 0 ?
          CpspRef.cmp.selectedMomentsForStyleChange :
          selectedMoments;
      selectedActivitiesAndMomentsForDelete.reverse();

      selectedActivitiesAndMomentsForDelete.forEach((selectedMoment, i) => {
        selectedMoment.dateSegments.forEach(dateSegment => {
          idOfMom.push(dateSegment.id);
        });
        if (selectedMoment.state_number == 0 || !selectedMoment.state_number) {
          idOfMom.push(...CpspRef.cmp.deleteSchedulePlan(selectedMoment.id, null, true));
          CpspRef.cmp.fillEmptyRow(
            selectedMoment.moments.length === 0
              ? 1
              : selectedMoment.moments.length + 1,
              false
          );
        } else {
          idOfMom.push(...CpspRef.cmp.deleteSchedulePlan(
            selectedMoment.activity_id,
            selectedMoment.id,
            true
          ));
          CpspRef.cmp.fillEmptyRow(1,false);
        }
      });
      //remove selectedmomentscontainer

      if (this.selectedMomentsForStyleChange.length > 1) {
        this.projectSchedulePlanerApp.projectMomentsContainer
          .getCanvas()
          .removeChildById(
            this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer.getId()
          );
        this.projectSchedulePlanerApp.projectMomentsContainer.selectedMomentsContainer =
          null;
      } else {
        this.projectSchedulePlanerApp.projectMomentsContainer.highlightedRow =
          null;
        CpspRef.cmp.hideColumnValueInput();
      }
      CpspRef.cmp.selectedMomentsForStyleChange = [];
      historySchedulePlaner.addToQueue(
        () => this.scheduleService.deleteSchedulePlan(idOfMom),
        () => true
        );
      this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
      this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      this.setLoadingStatus(false);
    }, 200);
  }

  async scaleCanvas(scale = true) {
    if (scale) {
      this.scaled = true;
      ConfigSc.earlierStartDate = this.findEarlyerStartDate();
      const lastDay = this.findLatestStartDate();
      let numDayss = moment(lastDay, ConfigSc.dateFormat).diff(moment(ConfigSc.earlierStartDate, ConfigSc.dateFormat), "days")

      let newGridWidth = numDayss * ConfigSc.cellWidth + ConfigSc.sideCanvasSize + 15 * ConfigSc.cellWidth ;

      // if(newGridWidth < window.innerWidth){
      //   newGridWidth = window.innerWidth;
      // }

      // const numRows = this.projectSchedulePlanerApp.projectMomentsContainer.getNumberOfAllDisplayActivitiesAndMoments();
      const numRows = this.getNumberOfAllDisplayActivitiesAndMoments() + 2;

      let newGridHeight = numRows
         *
          ConfigSc.cellHeight +
        ConfigSc.toolboxSize;
      // this.projectSchedulePlanerApp.projectMomentsContainer.show_activity.forEach(act => act.show = "arrow-open")
      // this.projectSchedulePlanerApp.projectMomentsContainer.show_states.forEach(mom => mom.show = "arrow-open")
      // this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay()
      this.selectedProject = this.deepCopy(this.copySelectedProject);
      this.projectSchedulePlanerApp = await new ProjectSchedulePlanerApp(
        this,
        newGridWidth,
        newGridHeight
      );


    //   let startDay = moment(ConfigSc.earlierStartDate).add(-7,"days");
    //   let startDay1 = moment(ConfigSc.earlierStartDate).add(-7,"days");
    //   let endDate = moment(lastDay);



    //   let startX = 0;

    //   this.allColumns.forEach((column) => {
    //     if(column.key === "Details" || column.key === "days" || column.key === "start_date" || column.key === "end_date"){
    //       startX += column.width;
    //     }
    //   })

    //   const svg = d3.select(this.chartContainer.nativeElement)
    //     .append('svg')
    //     .attr('width', ((numDayss + 15) * ConfigSc.cellWidth) + startX)
    //     .attr('height', 25 * numRows );

    //   this.applyMonstersToSvg(svg);





    //     let i = 0;
    //   while(startDay.isSameOrBefore(endDate)){

    //     //monts
    //     if(i === 0){
    //       const days = Number(startDay.format("DD")) + 1 -  startDay.daysInMonth();
    //       svg.append('rect')
    //       .attr('width',ConfigSc.cellWidth * days)
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('fill','white')
    //       .attr('stroke','gray')
    //       .attr('x',(i * ConfigSc.cellWidth) + startX)
    //       .attr('y',0)
    //     } else if( Number(startDay.format("DD")) === 1){
    //       svg.append('rect')
    //       .attr('width',ConfigSc.cellWidth * startDay.daysInMonth())
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('fill','white')
    //       .attr('stroke','gray')
    //       .attr('x',(i * ConfigSc.cellWidth) + startX)
    //       .attr('y',0)
    //     svg.append('text')
    //       .text(startDay.format("MMMM-YYYY"))
    //       .attr('fill','black')
    //       .attr('width',ConfigSc.cellWidth * startDay.daysInMonth())
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('x',(i * ConfigSc.cellWidth + (ConfigSc.cellWidth * startDay.daysInMonth())/2) + startX)
    //       .attr('y',9)
    //       .attr('dominant-baseline',"middle")
    //       .attr('text-anchor',"middle");
    //     }

    //     //weeks
    //     if(i%7 == 0){
    //       svg.append('rect')
    //       .attr('width',ConfigSc.cellWidth * 7)
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('fill','white')
    //       .attr('stroke','gray')
    //       .attr('x',(i * ConfigSc.cellWidth) + startX)
    //       .attr('y',ConfigSc.cellWidth)
    //     svg.append('text')
    //       .text("V."+Number(startDay.format("WW")))
    //       .attr('fill','black')
    //       .attr('width',ConfigSc.cellWidth * 7)
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('x',(i * ConfigSc.cellWidth + (ConfigSc.cellWidth * 7)/2) + startX)
    //       .attr('y',ConfigSc.cellWidth + 9)
    //       .attr('dominant-baseline',"middle")
    //       .attr('text-anchor',"middle");
    //     }

    //     //days
    //     svg.append('rect')
    //       .attr('width',ConfigSc.cellWidth)
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('fill',this.isWeekend(startDay) ? '#EBEBEB' : 'white')
    //       .attr('stroke','gray')
    //       .attr('x',(i * ConfigSc.cellWidth) + startX)
    //       .attr('y',ConfigSc.cellWidth * 2)
    //     svg.append('text')
    //       .text(Number(startDay.format("DD")))
    //       .attr('fill','black')
    //       .attr('width',ConfigSc.cellWidth)
    //       .attr('height',ConfigSc.cellWidth)
    //       .attr('x',(i * ConfigSc.cellWidth + 8) + startX)
    //       .attr('y',ConfigSc.cellWidth * 2 + 9)
    //       .attr('font-size',"12px")
    //       .attr('dominant-baseline',"middle")
    //       .attr('text-anchor',"middle");

    //     for(let k = 1; k <= numRows; k++){
    //       svg.append('rect')
    //       .attr('width',ConfigSc.cellWidth)
    //       .attr('height',ConfigSc.cellHeight)
    //       .attr('fill',this.isWeekend(startDay) ? '#EBEBEB' : 'white')
    //       .attr('stroke','gray')
    //       .attr('x',(i * ConfigSc.cellWidth) + startX)
    //       .attr('y',(ConfigSc.cellWidth * 2) + (k * ConfigSc.cellHeight))
    //     }


    //     i++;
    //     startDay.add(1,"days")
    //   }

    //   const lastActIndex = this.findLastActivityIndex();


    //   let tapeIndex = 0;

    //   for(let actIndex = 0; actIndex <= lastActIndex; actIndex++){
    //     const activity = this.copySelectedProject.activities.at(actIndex)
    //     tapeIndex++;

    //     if(this.copySelectedProject.activities.at(actIndex).description != null &&
    //       this.copySelectedProject.activities.at(actIndex).description != ""
    //       ) {
    //         const activityDuration = moment(activity.dateSegments.at(-1).endDate).
    //                                   diff(moment(activity.dateSegments.at(0).startDate),"days") + 1;

    //         const actX = (moment(activity.dateSegments.at(0).startDate).diff(startDay1,"days") * ConfigSc.cellWidth) + startX
    //         const actY = (ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7;
    //         const actX2 = (actX) + (ConfigSc.cellWidth * activityDuration);

    //       if(activity.moments.length > 0){
    //         svg.append('rect')
    //         .attr('width',ConfigSc.cellWidth * activityDuration)
    //         .attr('height',ConfigSc.cellWidth - 10)
    //         .attr('fill','black')
    //         .attr('stroke','gray')
    //         .attr('x',actX)
    //         .attr('y',actY);

    //         svg.append('polygon')
    //         .attr('points', actX + ","+ actY + " "
    //                         + actX + ","+ (actY + 20) + " "
    //                         + (actX + 7) + ","+(actY));

    //         svg.append('polygon')
    //         .attr('points', (actX2 - 7) + ","+ actY + " "
    //                          + (actX2) + ","+ (actY + 20) + " "
    //                         + (actX2) + ","+(actY))
    //       } else {
    //         svg.append('rect')
    //         .attr('width',ConfigSc.cellWidth * activityDuration)
    //         .attr('height',ConfigSc.cellWidth - 2)
    //         .attr('fill',activity.tape_color)
    //         .attr('stroke','gray')
    //         .attr('x',actX)
    //         .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7)
    //         .attr('rx',"10");

    //         if(activity.monster > 0){
    //           svg.append('rect')
    //         .attr('width',ConfigSc.cellWidth * activityDuration)
    //         .attr('height',ConfigSc.cellWidth - 2)
    //         .attr('fill',"url(#monster"+activity.monster+")")
    //         .attr('stroke','gray')
    //         .attr('x',0)
    //         .attr('y',0)
    //         .attr('rx',"10")
    //         .attr('transform',"translate("+(actX)+","+((ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7)+")");
    //         }
    //       }

    //     } else {
    //       let colX = 0;
    //       this.allColumns.forEach((column) => {
    //         if(column.key === "Details" || column.key === "days" || column.key === "start_date" || column.key === "end_date"){
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text("prazno")
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"12px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         }
    //       });
    //     }

    //     let colX = 0;
    //       this.allColumns.forEach((column) => {
    //         if(column.key === "Details"){
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(activity.description)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"12px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         } else if (column.key === "days") {
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(activity.numberOfDays)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"12px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         } else if (column.key === "start_date") {
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(activity.dateSegments.at(0).startDate)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"10px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         } else if (column.key === "end_date") {
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(activity.dateSegments.at(-1).endDate)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"10px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         }
    //       });

    //     for(let momIndex = 0; momIndex < activity.moments.length; momIndex++){
    //       tapeIndex++;
    //       const mom = activity.moments.at(momIndex);

    //       const momentDuration = moment(mom.dateSegments.at(-1).endDate).
    //                                   diff(moment(mom.dateSegments.at(0).startDate),"days") + 1;

    //       const momX = (moment(mom.dateSegments.at(0).startDate).diff(startDay1,"days") * ConfigSc.cellWidth) + startX
    //       const momY = (ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7
    //       const momX2 = (momX) + (ConfigSc.cellWidth * momentDuration);


    //       if(mom.percentage_of_realized_plan != null){
    //         svg.append('rect')
    //         .attr('width',ConfigSc.cellWidth * momentDuration)
    //         .attr('height',ConfigSc.cellWidth - 10)
    //         .attr('fill','black')
    //         .attr('stroke','gray')
    //         .attr('x',momX)
    //         .attr('y',momY);

    //         svg.append('polygon')
    //         .attr('points', (momX) + ","+ momY + " "
    //                         + (momX) + ","+ (momY + 20) + " "
    //                         + (momX + 7) + ","+(momY));

    //         svg.append('polygon')
    //         .attr('points', (momX2 - 7) + ","+ momY + " "
    //                         + (momX2) + ","+ (momY + 20) + " "
    //                         + (momX2) + ","+(momY));
    //       } else {
    //         svg.append('rect')
    //         .attr('width',ConfigSc.cellWidth * momentDuration)
    //         .attr('height',ConfigSc.cellWidth - 2)
    //         .attr('fill',mom.tape_color)
    //         .attr('stroke','gray')
    //         .attr('x',momX)
    //         .attr('y',momY)
    //         .attr('rx',"10");

    //         if(mom.monster > 0){
    //           svg.append('rect')
    //             .attr('width',ConfigSc.cellWidth * momentDuration)
    //             .attr('height',ConfigSc.cellWidth - 2)
    //             .attr('fill',"url(#monster"+mom.monster+")")
    //             .attr('stroke','gray')
    //             .attr('x',0)
    //             .attr('y',0)
    //             .attr('rx',"10")
    //             .attr('transform',"translate("+(momX)+","+((ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7)+")");
    //         }
    //       }

    //       let colX = 0;
    //       this.allColumns.forEach((column) => {
    //         if(column.key === "Details"){
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(mom.name)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + (12 * Number(mom.state_number)) )
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"12px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         } else if (column.key === "days") {
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(mom.percentage_of_realized_plan != null ?
    //                                           this.calculateDaysOfChildren(activity.id, mom.id).toString()
    //                                           :
    //                                           this.calculateDaysOfMoment(mom).toString())
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"12px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         } else if (column.key === "start_date") {
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(mom.dateSegments.at(0).startDate)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"10px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         } else if (column.key === "end_date") {
    //           svg.append('rect')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('fill', 'white')
    //             .attr('stroke','gray')
    //             .attr('x',colX)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
    //           svg.append('text')
    //             .text(mom.dateSegments.at(-1).endDate)
    //             .attr('fill','black')
    //             .attr('width',column.width)
    //             .attr('height',ConfigSc.cellHeight)
    //             .attr('x',colX + 5)
    //             .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
    //             .attr('font-size',"10px")
    //             // .attr('dominant-baseline',"middle")
    //             // .attr('text-anchor',"middle");

    //           colX += column.width;
    //         }
    //       });

    //     }

    //   }


      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView();
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      this.drawConnections();
    } else {
      this.scaled = false;
      this.projectSchedulePlanerApp = await new ProjectSchedulePlanerApp(
        this,
        1,
        1
      );
      CpspRef.cmp.projectSchedulePlanerApp.projectMomentsContainer.addAllDisplayProjectsThatFitContainerView();
      CpspRef.cmp.projectSchedulePlanerApp.daysMonthsContainer.draw();
      CpspRef.cmp.projectSchedulePlanerApp.mainHeader.draw();
      this.drawConnections();
    }
  }

  generateSvg(){

    const lastDay = this.findLatestStartDate();
    // let numDayss = moment(lastDay, ConfigSc.dateFormat).diff(moment(ConfigSc.earlierStartDate, ConfigSc.dateFormat), "days")
    const numRows = this.getNumberOfAllDisplayActivitiesAndMoments() + 2;

    let startDay = moment(ConfigSc.earlierStartDate).add(-7,"days");
    let startDay1 = moment(ConfigSc.earlierStartDate).add(-7,"days");
    startDay1.day(1);
    startDay.day(1);
    // let endDate = moment(lastDay);
    let endDate1 = moment(lastDay).add(7,"days");
    endDate1.day(7);
    let numDayss = endDate1.diff(startDay, "days");

    let startX = 0;

    this.allColumns.forEach((column) => {
      if(column.key === "Details" || column.key === "days" || column.key === "start_date" || column.key === "end_date"){
        startX += column.width;
      }
    });

    const svg = d3.select(this.chartContainer.nativeElement)
        .append('svg')
        .attr('width', ((numDayss + 15) * ConfigSc.cellWidth) + startX)
        .attr('height', 25 * numRows );

      this.applyMonstersToSvg(svg);


        let i = 0;
      while(startDay.isSameOrBefore(endDate1)){

        //monts
        if(i === 0){
          const days =  startDay.daysInMonth() - Number(startDay.format("DD")) + 1;
          svg.append('rect')
          .attr('width',ConfigSc.cellWidth * days)
          .attr('height',ConfigSc.cellWidth)
          .attr('fill','white')
          .attr('stroke','gray')
          .attr('x',(i * ConfigSc.cellWidth) + startX)
          .attr('y',0)
        } else if( Number(startDay.format("DD")) === 1){
          svg.append('rect')
          .attr('width',ConfigSc.cellWidth * startDay.daysInMonth())
          .attr('height',ConfigSc.cellWidth)
          .attr('fill','white')
          .attr('stroke','gray')
          .attr('x',(i * ConfigSc.cellWidth) + startX)
          .attr('y',0)
        svg.append('text')
          .text(startDay.format("MMMM-YYYY"))
          .attr('fill','black')
          .attr('width',ConfigSc.cellWidth * startDay.daysInMonth())
          .attr('height',ConfigSc.cellWidth)
          .attr('x',(i * ConfigSc.cellWidth + (ConfigSc.cellWidth * startDay.daysInMonth())/2) + startX)
          .attr('y',12)
          .attr('dominant-baseline',"middle")
          .attr('text-anchor',"middle");
        }

        //weeks
        if(i%7 == 0){
          svg.append('rect')
          .attr('width',ConfigSc.cellWidth * 7)
          .attr('height',ConfigSc.cellWidth)
          .attr('fill','white')
          .attr('stroke','gray')
          .attr('x',(i * ConfigSc.cellWidth) + startX)
          .attr('y',ConfigSc.cellWidth)
        svg.append('text')
          .text("V."+Number(startDay.format("WW")))
          .attr('fill','black')
          .attr('width',ConfigSc.cellWidth * 7)
          .attr('height',ConfigSc.cellWidth)
          .attr('x',(i * ConfigSc.cellWidth + (ConfigSc.cellWidth * 7)/2) + startX)
          .attr('y',ConfigSc.cellWidth + 12)
          .attr('dominant-baseline',"middle")
          .attr('text-anchor',"middle");
        }

        //days
        svg.append('rect')
          .attr('width',ConfigSc.cellWidth)
          .attr('height',ConfigSc.cellWidth)
          .attr('fill',this.isWeekend(startDay) ? '#EBEBEB' : 'white')
          .attr('stroke','gray')
          .attr('x',(i * ConfigSc.cellWidth) + startX)
          .attr('y',ConfigSc.cellWidth * 2)
        svg.append('text')
          .text(Number(startDay.format("DD")))
          .attr('fill','black')
          .attr('width',ConfigSc.cellWidth)
          .attr('height',ConfigSc.cellWidth)
          .attr('x',(i * ConfigSc.cellWidth + 8) + startX)
          .attr('y',ConfigSc.cellWidth * 2 + 12)
          .attr('font-size',"12px")
          .attr('dominant-baseline',"middle")
          .attr('text-anchor',"middle");

        for(let k = 1; k <= numRows; k++){
          svg.append('rect')
          .attr('width',ConfigSc.cellWidth)
          .attr('height',ConfigSc.cellHeight)
          .attr('fill',this.isWeekend(startDay) ? '#EBEBEB' : 'white')
          .attr('stroke','gray')
          .attr('stroke-width','.5')
          .attr('x',(i * ConfigSc.cellWidth) + startX)
          .attr('y',(ConfigSc.cellWidth * 2) + (k * ConfigSc.cellHeight))
        }


        i++;
        startDay.add(1,"days")
      }

      const lastActIndex = this.findLastActivityIndex();

      let tapeIndex = 0;

      for(let actIndex = 0; actIndex <= lastActIndex; actIndex++){
        const activity = this.copySelectedProject.activities.at(actIndex)
        tapeIndex++;

        if(this.copySelectedProject.activities.at(actIndex).description != null &&
          this.copySelectedProject.activities.at(actIndex).description != ""
          ) {
            const activityDuration = moment(activity.dateSegments.at(-1).endDate).
                                      diff(moment(activity.dateSegments.at(0).startDate),"days") + 1;

            const actX = (moment(activity.dateSegments.at(0).startDate).diff(startDay1,"days") * ConfigSc.cellWidth) + startX
            const actY = (ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7;
            const actX2 = (actX) + (ConfigSc.cellWidth * activityDuration);

          if(activity.moments.length > 0){
            svg.append('rect')
            .attr('width',ConfigSc.cellWidth * activityDuration)
            .attr('height',ConfigSc.cellWidth - 10)
            .attr('fill','black')
            .attr('stroke','gray')
            .attr('x',actX)
            .attr('y',actY);

            svg.append('polygon')
            .attr('points', actX + ","+ actY + " "
                            + actX + ","+ (actY + 20) + " "
                            + (actX + 7) + ","+(actY));

            svg.append('polygon')
            .attr('points', (actX2 - 7) + ","+ actY + " "
                             + (actX2) + ","+ (actY + 20) + " "
                            + (actX2) + ","+(actY))
          } else {

            activity.dateSegments.forEach(dateSegment => {

              const segmentDuration = moment(dateSegment.endDate).
                                      diff(moment(dateSegment.startDate),"days") + 1;
              const segmentX = (moment(dateSegment.startDate).diff(startDay1,"days") * ConfigSc.cellWidth) + startX

              svg.append('rect')
                .attr('width',ConfigSc.cellWidth * segmentDuration)
                .attr('height',ConfigSc.cellWidth - 2)
                .attr('fill',activity.tape_color)
                .attr('stroke','gray')
                .attr('x',segmentX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7)
                .attr('rx',"10");

              if(activity.monster > 0){
                svg.append('rect')
                  .attr('width',ConfigSc.cellWidth * segmentDuration)
                  .attr('height',ConfigSc.cellWidth - 2)
                  .attr('fill',"url(#monster"+activity.monster+")")
                  .attr('stroke','gray')
                  .attr('x',0)
                  .attr('y',0)
                  .attr('rx',"10")
                  .attr('transform',"translate("+(segmentX)+","+((ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7)+")");
              }
            });

          }

          if(this.checked){
            svg.append('text')
            .text(activity.description)
            .attr('fill','black')
            // .attr('width',ConfigSc.cellWidth * 7)
            // .attr('height',ConfigSc.cellWidth)
            .attr('x', actX2 + ConfigSc.cellWidth)
            .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
            // .attr('dominant-baseline',"middle")
            // .attr('text-anchor',"middle");
          }

        } else {
          let colX = 0;
          this.allColumns.forEach((column) => {
            if(column.key === "Details" || column.key === "days" || column.key === "start_date" || column.key === "end_date"){
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text("prazno")
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"12px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            }
          });
        }

        let colX = 0;
          this.allColumns.forEach((column) => {
            if(column.key === "Details"){
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(activity.description)
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"12px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            } else if (column.key === "days") {
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))

              svg.append('text')
                .text(activity.moments.length > 0 ?
                                              this.calculateDaysOfChildren(activity.id, 0).toString()
                                              :
                                              this.calculateDaysOfMoment(activity).toString())
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"12px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            } else if (column.key === "start_date") {
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(activity.dateSegments.at(0).startDate)
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"10px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            } else if (column.key === "end_date") {
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(activity.dateSegments.at(-1).endDate)
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"10px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            }
          });

        for(let momIndex = 0; momIndex < activity.moments.length; momIndex++){
          tapeIndex++;
          const mom = activity.moments.at(momIndex);

          const momentDuration = moment(mom.dateSegments.at(-1).endDate).
                                      diff(moment(mom.dateSegments.at(0).startDate),"days") + 1;

          const momX = (moment(mom.dateSegments.at(0).startDate).diff(startDay1,"days") * ConfigSc.cellWidth) + startX
          const momY = (ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7
          const momX2 = (momX) + (ConfigSc.cellWidth * momentDuration);


          if(mom.percentage_of_realized_plan != null){
            svg.append('rect')
            .attr('width',ConfigSc.cellWidth * momentDuration)
            .attr('height',ConfigSc.cellWidth - 10)
            .attr('fill','black')
            .attr('stroke','gray')
            .attr('x',momX)
            .attr('y',momY);

            svg.append('polygon')
            .attr('points', (momX) + ","+ momY + " "
                            + (momX) + ","+ (momY + 20) + " "
                            + (momX + 7) + ","+(momY));

            svg.append('polygon')
            .attr('points', (momX2 - 7) + ","+ momY + " "
                            + (momX2) + ","+ (momY + 20) + " "
                            + (momX2) + ","+(momY));
          } else {

            mom.dateSegments.forEach( dateSegment => {

              const segmentDuration = moment(dateSegment.endDate).
                                      diff(moment(dateSegment.startDate),"days") + 1;

              const segmentX = (moment(dateSegment.startDate).diff(startDay1,"days") * ConfigSc.cellWidth) + startX

              svg.append('rect')
                .attr('width',ConfigSc.cellWidth * segmentDuration)
                .attr('height',ConfigSc.cellWidth - 2)
                .attr('fill',mom.tape_color)
                .attr('stroke','gray')
                .attr('x',segmentX)
                .attr('y',momY)
                .attr('rx',"10");

            if(mom.monster > 0){
              svg.append('rect')
                .attr('width',ConfigSc.cellWidth * segmentDuration)
                .attr('height',ConfigSc.cellWidth - 2)
                .attr('fill',"url(#monster"+mom.monster+")")
                .attr('stroke','gray')
                .attr('x',0)
                .attr('y',0)
                .attr('rx',"10")
                .attr('transform',"translate("+(segmentX)+","+((ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 7)+")");
            }

            })


          }

          if(this.checked){
            svg.append('text')
            .text(mom.name)
            .attr('fill','black')
            // .attr('width',ConfigSc.cellWidth * 7)
            // .attr('height',ConfigSc.cellWidth)
            .attr('x', momX2 + ConfigSc.cellWidth)
            .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
            // .attr('dominant-baseline',"middle")
            // .attr('text-anchor',"middle");
          }

          let colX = 0;
          this.allColumns.forEach((column) => {
            if(column.key === "Details"){
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(mom.name)
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + (12 * Number(mom.state_number)) )
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"12px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            } else if (column.key === "days") {
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(mom.percentage_of_realized_plan != null ?
                                              this.calculateDaysOfChildren(activity.id, mom.id).toString()
                                              :
                                              this.calculateDaysOfMoment(mom).toString())
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"12px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            } else if (column.key === "start_date") {
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(mom.dateSegments.at(0).startDate)
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"10px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            } else if (column.key === "end_date") {
              svg.append('rect')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('fill', 'white')
                .attr('stroke','gray')
                .attr('x',colX)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight))
              svg.append('text')
                .text(mom.dateSegments.at(-1).endDate)
                .attr('fill','black')
                .attr('width',column.width)
                .attr('height',ConfigSc.cellHeight)
                .attr('x',colX + 5)
                .attr('y',(ConfigSc.cellWidth * 2) + (tapeIndex * ConfigSc.cellHeight) + 17)
                .attr('font-size',"10px")
                // .attr('dominant-baseline',"middle")
                // .attr('text-anchor',"middle");

              colX += column.width;
            }
          });

        }

      }


    return document.getElementById("svgElement").innerHTML;
  }

  applyMonstersToSvg(svg){
    const defs = svg.append('defs');

    const monster1 = defs.append('pattern')
      .attr('id',"monster1")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster1.append('polygon')
      .attr('points','3.5,2.75 3.5,5.75 -0.25,7.5 -4,5.75 -4,2.75 -0.25,1')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1');
      monster1.append('polygon')
      .attr('points','11.25,2.75 11.25,5.75 7.5,7.5 3.75,5.75 3.75,2.75 7.5,1')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1');
      monster1.append('polygon')
      .attr('points','18.75,2.75 18.75,5.75 15,7.5 11.25,5.75 11.25,2.75 15,1')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1');
      monster1.append('polygon')
      .attr('points','7.5,7.75 7.5,10.75 3.75,12.5 0,10.75 0,7.75 3.75,6')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1');
      monster1.append('polygon')
      .attr('points','15,7.75 15,10.75 11.25,12.5 7.5,10.75 7.5,7.75 11.25,6')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1');

    const monster2 = defs.append('pattern')
      .attr('id',"monster2")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      // monster2.append('path')
      // .attr('d','M1.325,7.034V3.364L4.511,1.528,7.686,3.365V7.036L4.5,8.87ZM4.512,0,3.848.382.663,2.218,0,2.6V7.8l.661.382,3.177,1.836L4.5,10.4l.663-.382L8.348,8.182,9.011,7.8V2.6L8.35,2.22,5.174.383Z')
      // .attr('transform','translate(0 1)')
      // .attr('fill',"#fff");
      // monster2.append('path')
      // .attr('d','M1.325,7.034V3.364L4.511,1.528,7.686,3.365V7.036L4.5,8.87ZM4.512,0,3.848.382.663,2.218,0,2.6V7.8l.661.382,3.177,1.836L4.5,10.4l.663-.382L8.348,8.182,9.011,7.8V2.6L8.35,2.22,5.174.383Z')
      // .attr('transform','translate(7.524 1)')
      // .attr('fill',"#fff");
      monster2.append('polygon')
      .attr('points','7.5,3.75 7.5,8.75 3.75,10.5 0,8.75 0,3.75 3.75,2')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1.5');
      monster2.append('polygon')
      .attr('points','15,3.75 15,8.75 11.25,10.5 7.5,8.75 7.5,3.75 11.25,2')
      .attr('stroke',"#fff")
      .attr('fill',"none")
      .attr('stroke-width','1.5');

    const monster3 = defs.append('pattern')
      .attr('id',"monster3")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      // monster3.append('path')
      // .attr('d','M5.064,0,0,2.917V8.751L5.051,11.67l5.061-2.915V2.919Z')
      // .attr('transform','translate(10 1)')
      // .attr('fill',"#fff");
      // monster3.append('path')
      // .attr('d','M5.064,0,0,2.917V8.751L5.051,11.67l5.061-2.915V2.919Z')
      // .attr('transform','translate(-5 1)')
      // .attr('fill',"#fff");
      monster3.append('polygon')
      .attr('points','11.25,3.75 11.25,8.75 7.5,10.5 3.75,8.75 3.75,3.75 7.5,2')
      .attr('fill',"#fff");

    const monster4 = defs.append('pattern')
      .attr('id',"monster4")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      // monster4.append('path')
      // .attr('d','M.683,4.954V2.178L3.078.789,5.466,2.178V4.956L3.072,6.343Z')
      // .attr('transform','translate(1 0)')
      // .attr('fill',"#fff");
      // monster4.append('path')
      // .attr('d','M.683,4.954V2.178L3.078.789,5.466,2.178V4.956L3.072,6.343Z')
      // .attr('transform','translate(9 0)')
      // .attr('fill',"#fff");
      // monster4.append('path')
      // .attr('d','M.683,4.954V2.178L3.078.789,5.466,2.178V4.956L3.072,6.343Z')
      // .attr('transform','translate(4.5 6)')
      // .attr('fill',"#fff");
      // monster4.append('path')
      // .attr('d','M.683,4.954V2.178L3.078.789,5.466,2.178V4.956L3.072,6.343Z')
      // .attr('transform','translate(-3 6)')
      // .attr('fill',"#fff");
      // monster4.append('path')
      // .attr('d','M.683,4.954V2.178L3.078.789,5.466,2.178V4.956L3.072,6.343Z')
      // .attr('transform','translate(12 6)')
      // .attr('fill',"#fff");
      monster4.append('polygon')
      .attr('points','6,2.75 6,5.75 3.75,7.25 1.5,5.75 1.5,2.75 3.75,1.25')
      .attr('fill',"#fff");
      monster4.append('polygon')
      .attr('points','13.5,2.75 13.5,5.75 11.25,7.25 9,5.75 9,2.75 11.25,1.25')
      .attr('fill',"#fff");
      monster4.append('polygon')
      .attr('points','2,7.75 2,10.75 -0.25,12.25 -2.5,10.75 -2.5,7.75 -0.25,6.25')
      .attr('fill',"#fff");
      monster4.append('polygon')
      .attr('points','9.75,7.75 9.75,10.75 7.5,12.25 5.25,10.75 5.25,7.75 7.5,6.25')
      .attr('fill',"#fff");
      monster4.append('polygon')
      .attr('points','17.25,7.75 17.25,10.75 15,12.25 12.75,10.75 12.75,7.75 15,6.25')
      .attr('fill',"#fff");

    const monster5 = defs.append('pattern')
      .attr('id',"monster5")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster5.append('path')
      .attr('d','M7.508,0,0,13.006H15.018Z')
      // .attr('transform','translate(10 1)')
      .attr('fill',"#fff");

    const monster6 = defs.append('pattern')
      .attr('id',"monster6")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      // monster6.append('path')
      // .attr('d','M49.607,61.54l-4.325-5,4.325-5,4.325,5Z')
      // .attr('transform','translate(-38.282 -50.535)')
      // .attr('fill',"#fff");
      // monster6.append('path')
      // .attr('d','M49.607,61.54l-4.325-5,4.325-5,4.325,5Z')
      // .attr('transform','translate(-45.882 -50.535)')
      // .attr('fill',"#fff");
      monster6.append('polygon')
      .attr('points','7.5,0 15,6.5 7.5,13 0,6.5')
      .attr('fill',"#fff");

    const monster7 = defs.append('pattern')
      .attr('id',"monster7")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster7.append('rect')
      .attr('width','7.5')
      .attr('height','7')
      .attr('x','7.5')
      .attr('y','-0.25')
      .attr('fill',"#fff");
      monster7.append('rect')
      .attr('width','7.5')
      .attr('height','7')
      .attr('x','0')
      .attr('y','6.75')
      .attr('fill',"#fff");

    const monster8 = defs.append('pattern')
      .attr('id',"monster8")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster8.append('g')
      .attr('transform','translate(15 0) rotate(90)')
      .append('path')
      .attr('d','M7.185,15,0,0H13Z')
      .attr('fill',"#fff");

    const monster9 = defs.append('pattern')
      .attr('id',"monster9")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster9.append('g')
      .attr('transform','translate(0 13) rotate(-90)')
      .append('path')
      .attr('d','M7.185,15,0,0H13Z')
      .attr('fill',"#fff");

    const monster10 = defs.append('pattern')
      .attr('id',"monster10")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster10.append('circle')
      .attr('cx','2.827')
      .attr('cy','2.827')
      .attr('r','2.827')
      .attr('transform','translate(0 1)')
      .attr('fill',"#fff");
      monster10.append('circle')
      .attr('cx','2.827')
      .attr('cy','2.827')
      .attr('r','2.827')
      .attr('transform','translate(7.4 6)')
      .attr('fill',"#fff");

    const monster11 = defs.append('pattern')
      .attr('id',"monster11")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster11.append('ellipse')
      .attr('cx','5.5')
      .attr('cy','4')
      .attr('rx','4')
      .attr('ry','4')
      .attr('transform','translate(2 2)')
      .attr('fill',"#fff");

    const monster12 = defs.append('pattern')
      .attr('id',"monster12")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster12.append('path')
      .attr('d','M.458,12.116-.884,10.953,12.774-.884,14.116.279Z')
      .attr('transform','translate(0.884 0.884)')
      .attr('fill',"#fff");

    const monster13 = defs.append('pattern')
      .attr('id',"monster13")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster13.append('path')
      .attr('d','M.458-.884-.884.279,12.774,12.116l1.342-1.163Z')
      .attr('transform','translate(0.884 0.884)')
      .attr('fill',"#fff");

    const monster14 = defs.append('pattern')
      .attr('id',"monster14")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster14.append('path')
      .attr('d','M2.692,13.3.136,10.742,10.742.136,13.3,2.692Z')
      .attr('transform','translate(-1.5 7.308) rotate(-45)')
      .attr('fill',"#fff");

    const monster15 = defs.append('pattern')
      .attr('id',"monster15")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster15.append('path')
      .attr('d','M3.188,13.794-1.237,9.369,9.369-1.237,13.8,3.188Z')
      .attr('transform','translate(1.749 7.629) rotate(-45)')
      .attr('fill',"#fff");

    const monster16 = defs.append('pattern')
      .attr('id',"monster16")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster16.append('path')
      .attr('d','M6.827,5.978a6.042,6.042,0,0,1,5.132,5.979A6.042,6.042,0,0,1,5.979,6.826,6.042,6.042,0,0,1,0,11.958,6.042,6.042,0,0,1,5.132,5.978,6.042,6.042,0,0,1,0,0,6.042,6.042,0,0,1,5.979,5.131,6.042,6.042,0,0,1,11.959,0,6.042,6.042,0,0,1,6.827,5.978')
      .attr('transform','translate(2 1)')
      .attr('fill',"#fff");

    const monster17 = defs.append('pattern')
      .attr('id',"monster17")
      .attr('patternUnits','userSpaceOnUse')
      .attr('width', ConfigSc.cellWidth)
      .attr('height', ConfigSc.cellWidth - 2)
      .attr('x',"0")
      .attr('y',"0");
      monster17.append('path')
      .attr('d','M3.318,5.168A2.734,2.734,0,0,1,6.1,2.481,2.734,2.734,0,0,1,8.876,5.168,2.734,2.734,0,0,1,6.1,7.855,2.734,2.734,0,0,1,3.318,5.168M3.292,0a.494.494,0,0,0-.245.063A.464.464,0,0,0,2.87.235l-2.8,4.7A.453.453,0,0,0,0,5.167.445.445,0,0,0,.065,5.4l2.8,4.7a.472.472,0,0,0,.179.173.484.484,0,0,0,.242.063H8.9a.492.492,0,0,0,.245-.063.464.464,0,0,0,.178-.171l2.8-4.7a.451.451,0,0,0,.066-.237.442.442,0,0,0-.065-.234l-2.8-4.7A.472.472,0,0,0,9.143.063.486.486,0,0,0,8.9,0Z')
      .attr('transform','translate(1.5 1.5)')
      .attr('fill',"#fff");
  }

  getNumberOfAllDisplayActivitiesAndMoments(){
    let numRows = 0;
    for(let i = 0; i <= this.findLastActivityIndex(); i++){
      let activity = this.copySelectedProject.activities.at(i);
      numRows++;
      activity.moments.forEach((mom) => {
        numRows++;
      })
    }

    return numRows;
  }

  findLastActivityIndex(){
    let i = this.copySelectedProject.activities.length - 1
    for(; i > 0; i--){
      if(this.copySelectedProject.activities.at(i).description != null && this.copySelectedProject.activities.at(i).description != "") return i;
    }

    return i;
  }

  showRevision(callback) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "auto";
    dialogConfig.height = "0px";
    dialogConfig.panelClass = "mat-dialog-confirmation";
    // let blaker = document.getElementsByClassName('cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing') as HTMLElement;
    // blaker.style.pointerEvents = "none";
    // dialogConfig.data = {
    //   questionText:
    //     "Dziko",
    // };
    this.dialog
      .open(ConfirmationModalComponent, dialogConfig)
      .afterOpened()
      // .afterClosed()
      .subscribe(callback);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  //in refreshdisplay, only activities are updated, use this method for updating y coordinates of moments of copyselectedprojects
  sortMomentsBySortIndex() {
    let sortedMoments = [];
    CpspRef.cmp.copySelectedProject.activities.forEach((activity, i) => {
      sortedMoments = [];

      //loop through every activity, find moments, sort and push them to the sortedmoments array

      if (activity.moments.length > 0) {
        let stateNumbers = [];
        activity.moments.forEach((m) => {
          stateNumbers.push(m.state_number);
        });

        let minStateNumber = Math.min(
          ...stateNumbers.map((i) => {
            return +i;
          })
        );
        const maxStateNumber = Math.max(
          ...stateNumbers.map((i) => {
            return +i;
          })
        );

        //loop through moments in statenumber order
        for (
          let stateNumber = minStateNumber;
          stateNumber <= maxStateNumber;
          stateNumber++
        ) {
          if (stateNumber == 1) {
            let momentsToPush = activity.moments.filter(
              (m) => m.state_number == stateNumber
            );
            momentsToPush.sort(
              (a, b) => Number(a.sort_index) - Number(b.sort_index)
            );
            sortedMoments.push(...momentsToPush);
          } else {
            let momentsToPush = activity.moments.filter(
              (m) => m.state_number == stateNumber
            );
            momentsToPush.sort(
              (a, b) => Number(b.sort_index) - Number(a.sort_index)
            );
            momentsToPush.forEach((m) => {
              sortedMoments.splice(
                sortedMoments.findIndex((mom) => m.parent == mom.id) + 1,
                0,
                m
              );
            });
          }
        }

        //change y coordinates

        let yAcumulator = 0;
        sortedMoments.forEach((m) => {
          m.y = yAcumulator;
          yAcumulator += ConfigSc.cellHeight;
        });
      }

      CpspRef.cmp.copySelectedProject.activities[i].moments = sortedMoments;
    });
  }



  //in refreshdisplay, only activities are updated, use this method for updating y coordinates of moments of selected project
  // sortMomentsBySortIndexSelected(){

  //   let sortedMoments=[];

  //   CpspRef.cmp.selectedProject.activities.forEach((activity,i) => {

  //    sortedMoments=[];

  //     //loop through every activity, find moments, sort and push them to the sortedmoments array

  //     if(activity.moments.length>0){
  //       let stateNumbers=[];
  //       activity.moments.forEach((m)=>{stateNumbers.push(m.state_number)})

  //       let minStateNumber=Math.min(...stateNumbers.map((i)=>{return +i}));
  //       const maxStateNumber=Math.max(...stateNumbers.map((i)=>{return +i}));

  //       //loop though moments in statenumber order
  //       for(let stateNumber=minStateNumber;stateNumber<=maxStateNumber;stateNumber++)
  //       {
  //         if(stateNumber==1){
  //             let momentsToPush=activity.moments.filter((m)=>m.state_number==stateNumber);
  //             momentsToPush.sort((a, b) => Number(a.sort_index) - Number(b.sort_index));
  //             sortedMoments.push(...momentsToPush)
  //         }
  //         else {
  //             let momentsToPush=activity.moments.filter((m)=>m.state_number==stateNumber);
  //             momentsToPush.sort((a, b) => Number(b.sort_index) - Number(a.sort_index));
  //             momentsToPush.forEach((m)=>{
  //             sortedMoments.splice(sortedMoments.findIndex((mom)=>m.parent==mom.id)+1,0,m);

  //           })

  //         }

  //       }

  //         //change y coordinates

  //         let yAcumulator=0;
  //         sortedMoments.forEach((m)=>{
  //           m.y=yAcumulator
  //           yAcumulator+=ConfigSc.cellHeight;
  //           })
  //     }

  //         CpspRef.cmp.selectedProject.activities[i].moments=sortedMoments;

  //    });
  // }

  dropSend() {
    if (
      CpspRef.cmp.property_index == CpspRef.cmp.revisions.length + 1
    )
      return;
    this.buttonToggleSend = !this.buttonToggleSend;

    this.projectSchedulePlanerApp.mainHeader.closeDropDowns();
  }
  async printAta() {
    this.buttonToggleSend = !this.buttonToggleSend;
    // let image_url =
    //     CpspRef.cmp.property_index - 1 != CpspRef.cmp.revImages.length &&
    //     CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1] != undefined
    //       ? CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1].url
    //       : null;
    // var newCanvas = document.createElement("canvas");
    // newCanvas.width = this.projectSchedulePlanerApp.mainCanvas.getWidth();
    // newCanvas.height =
    //   this.projectSchedulePlanerApp.mainCanvas.getHeight() -
    //   this.projectSchedulePlanerApp.mainHeader.getHeight();

    // var newContext = newCanvas.getContext("2d");
    // newContext.drawImage(
    //   this.projectSchedulePlanerApp.mainCanvas.getCanvasElement(),
    //   0,
    //   this.projectSchedulePlanerApp.mainHeader.getHeight(),
    //   this.projectSchedulePlanerApp.mainCanvas.getWidth(),
    //   this.projectSchedulePlanerApp.mainCanvas.getHeight() -
    //     this.projectSchedulePlanerApp.mainHeader.getHeight(),
    //   0,
    //   0,
    //   this.projectSchedulePlanerApp.mainCanvas.getWidth(),
    //   this.projectSchedulePlanerApp.mainCanvas.getHeight() -
    //     this.projectSchedulePlanerApp.mainHeader.getHeight()
    // );
    // let res = await this.scheduleService.getImageUrl(image_url.substr(5));


      // printJS({
      //         printable: res,
      //         type: 'image',
      //         style: '@page { size: Letter landscape; }',
      //         imageStyle: 'height: 100%;'
      //       })

      this.setLoadingStatus(true);

          const svg = this.generateSvg();
          document.getElementById("svgElement").innerHTML = "";

          const lastUser = JSON.parse(localStorage.getItem('lastUser'));

            this.scheduleService
            .generatePdf(svg, "",this.project["name"].split(' ').join('_'), lastUser.firstname + " " + lastUser.lastname, moment().format(ConfigSc.dateFormat), "20"+this.revImages[this.property_index - 1].date_generated)
            // .generatePdf(window.location.protocol +"//"+window.location.host+"/file/"+image_url, email[i])
            // .generatePdf(image_url, email[i])
            // .generatePdf(image_url + ".png", email[i])
            .then((obj) => {
              this.setLoadingStatus(false);
              if (obj["status"]) {
                printJS({
                  printable: obj['pdf_url'],// res,
                  // type: 'image',
                  // style: '@page { size: Letter landscape; } img { max-height: 720px;}'
                  // header: 'PrintJS Images Test', // Optional
                  // showModal: true, // Optional
                  // modalMessage: 'Printing Images...', // Optional
                  // style: 'img { max-height: 400px;}' // Optional
                  })

              }
            });



      // .then((res) =>{

      //   setTimeout(() => {
      //     printJS({
      //       printable: res,
      //       type: 'image',
      //       style: '@page { size: Letter landscape; }'
      //     })
      //   }, 2800);


      // })

  }
  checkIfContactSelected(contact) {
    if (
      this.contacts.some((selectedWorker) => selectedWorker.Id == contact.Id)
    ) {
      return true;
    } else return false;
  }
  buttonNameSummary(event, worker) {

    event.stopPropagation();

    if (worker) {
      this.buttonToggleSend = true;
      if (
        this.contacts.some((selectedWorker) => selectedWorker.Id == worker.Id)
      ) {
        this.contacts.splice(this.contacts.indexOf(worker), 1);
      }else{
        this.contacts.push(worker);
      }
    } else {
      this.buttonToggleSend = !this.buttonToggleSend;
      if (this.buttonToggleSend == true) {
        this.buttonName = "Hide";
      } else {
        this.buttonName = "";
      }
    }
  }
  closeToggle(num){
      if(num == 1){
          this.buttonToggleSend = !this.buttonToggleSend;
      }else if(num == 2){
          this.buttonToggleDots = !this.buttonToggleDots;
      }
  }
  shutDown() {
      this.buttonToggleSend = false;
      // this.spinner = false;
    }
    createAta(param, action=null) {
      const image_url =
      CpspRef.cmp.property_index - 1 != CpspRef.cmp.revImages.length &&
      CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1] != undefined
        ? CpspRef.cmp.revImages[CpspRef.cmp.property_index - 1].url
        : null;
      let emails_for_send = [];
      if(param){
        if (this.contacts.length < 1) {
          return this.toastr.info(
            this.translate.instant(
              "You first need to select an email where to send ata"
              ) + ".",
              this.translate.instant("Info")
              );
            }
            this.client_workers.forEach((cw, index) => {
              for (let i = 0; i < this.contacts.length; i++) {
                const contact = this.contacts[i];
                if (contact.Id == cw.Id) {
                  // emails_for_send.push(cw);
                  emails_for_send.push(cw.email);
                  break;
                }
              }
            });
          }

          this.generatePfd(image_url,emails_for_send);



      // const valid = this.validateForm();
      // let emails_for_send = [];

      // if (valid && this.createForm.valid) {

      //     if(param){
      //       if (this.contacts.length < 1) {
      //         return this.toastr.info(
      //           this.translate.instant(
      //             "You first need to select an email where to send ata"
      //           ) + ".",
      //           this.translate.instant("Info")
      //         );
      //       }

      //       this.client_workers.forEach((cw, index) => {
      //         for (let i = 0; i < this.contacts.length; i++) {
      //           const contact = this.contacts[i];
      //           if (contact.Id == cw.Id) {
      //             emails_for_send.push(cw);
      //             break;
      //           }
      //         }
      //       });
      //     }

      //     this.spinner = true;
      //     const data = this.createForm.value;

      //     data.contacts = this.clientContacts;
      //     data.Ata = "1";
      //     data.project = this.project;
      //     data.generalImage = this.generalImage;
      //     data.Deviation = "0";
      //     data.nextAtaNumber = this.nextAtaNumber;
      //     data.fullname =
      //         this.userDetails.firstname + " " + this.userDetails.lastname;
      //     data.Status = 0;
      //     data.wrId = 0;
      //     data.Url = this.files;
      //     data.createWithSend = param;
      //     data.contacts = param ? emails_for_send : [];
      //     data.sendCopy = false;
      //     data.sendReminder = false;
      //     data.Documents = [];
      //     data.action = action ? action : '';

      //     data.articlesAdditionalWork = data.articlesAdditionalWork.filter(
      //         function (row) {
      //             return row.Name != "";
      //         }
      //     );

      //     data.articlesAdditionalWork = data.articlesAdditionalWork.map(function (
      //         article
      //     ) {
      //         article.Quantity = Number(
      //             article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
      //         );
      //         article.Price = Number(
      //             article.Price.toString().replace(/\s/g, "").replace(",", ".")
      //         );
      //         return article;
      //     });
      //     data.articlesMaterial = data.articlesMaterial.filter(function (row) {
      //         return row.Name != "";
      //     });
      //     data.articlesMaterial = data.articlesMaterial.map(function (article) {
      //         article.Quantity = Number(
      //             article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
      //         );
      //         article.Price = Number(
      //             article.Price.toString().replace(/\s/g, "").replace(",", ".")
      //         );
      //         return article;
      //     });

      //     data.articlesOther = data.articlesOther.filter(function (row) {
      //         return row.Name != "";
      //     });
      //     data.articlesOther = data.articlesOther.map(function (article) {
      //         article.Quantity = Number(
      //             article.Quantity.toString().replace(/\s/g, "").replace(",", ".")
      //         );
      //         article.Price = Number(
      //             article.Price.toString().replace(/\s/g, "").replace(",", ".")
      //         );
      //         return article;
      //     });

      //     this.progress = 0;
      //     const albumFiles = this.imageModalUtility.getAlbumFiles(this.albums);

      //     this.fsService.mergeFilesAndAlbums(albumFiles).then((response: any) => {
      //         data.images = [];
      //         data.documents = [];

      //         if(response != null) {
      //             data.images = response.images;
      //             data.documents = response.pdfs;
      //         }

      //         this.sendAtaReqeust(data);

      //     });
      // }else{
      //   return this.toastr.info(
      //     this.translate.instant(
      //       "You first need to fill required fields!"
      //     ) ,
      //     this.translate.instant("Info")
      //   );
      // }
  }

  //mom is true for moments, false for activity
  findWhiteTape(actId,momId = 0,mom = false){
    let returned = [];
    for (let i = 0; i < this.revisions.length; i++){
      let activities = this.revisions.at(i).activities;
      let act = activities.find(ac => ac.id == actId);
      if(act && mom){
        let m = act.moments.find(mom => mom.id == momId);
        if(m && m.dateSegments[0].currentWorkDate != null){
          //const percentageWork = m.dateSegments[0].currentWorkDate != null ? m.dateSegments[0].currentWorkDate.split("%") : [];
          //if(percentageWork.length > 2){
            returned.push(m);
          //}
        }
      }
      else{
        if(act && act.dateSegments[0].currentWorkDate != null){
          //const percentageWork = act.dateSegments[0].currentWorkDate != null ? act.dateSegments[0].currentWorkDate.split("%") : [];
          //if(percentageWork.length > 2){
            returned.push(act);
          //}
        }
      }
    }
    return returned;
  }

  toggleLockedRevision(){
    this.lockedRevision = !this.lockedRevision;
  }

  updateRevision(){
    let state = JSON.parse(JSON.stringify(this.copySelectedProject));
    state.columns = this.allColumns;
    state.connections = this.lineConnections;
    state.image = "";
    state.showNames = this.checked;
    state.prog_number = Number(CpspRef.cmp.property_index)
    const json = {
      //id: this.project.id,
      name: this.project.name,
      columns: this.deepCopy(this.allColumns),
      activities: this.copySelectedProject.activities,
      connections: this.deepCopy(this.lineConnections),
      prog_number: Number(CpspRef.cmp.property_index),
      image: "",
      showNames: this.checked,
      id: ""
    };

    var newCanvas = document.createElement("canvas");
    newCanvas.width = this.projectSchedulePlanerApp.mainCanvas.getWidth();
    newCanvas.height =
      this.projectSchedulePlanerApp.mainCanvas.getHeight() -
      this.projectSchedulePlanerApp.mainHeader.getHeight();

    var newContext = newCanvas.getContext("2d");
    newContext.drawImage(
      this.projectSchedulePlanerApp.mainCanvas.getCanvasElement(),
      0,
      this.projectSchedulePlanerApp.mainHeader.getHeight(),
      this.projectSchedulePlanerApp.mainCanvas.getWidth() -
        this.projectSchedulePlanerApp.gridContainer.getVerticalScrollbar().getWidth(),
      this.projectSchedulePlanerApp.mainCanvas.getHeight() -
        this.projectSchedulePlanerApp.mainHeader.getHeight() -
        this.projectSchedulePlanerApp.gridContainer.getHorizontalScrollbar().getHeight(),
      0,
      0,
      this.projectSchedulePlanerApp.mainCanvas.getWidth(),
      this.projectSchedulePlanerApp.mainCanvas.getHeight() -
        this.projectSchedulePlanerApp.mainHeader.getHeight()
    );

    //var dataURL = this.projectSchedulePlanerApp.mainCanvas.getCanvasElement().toDataURL("image/png");
    let dataURL = newCanvas.toDataURL("image/png");

      // const doc=new jsPDF(
      //   {
      //     orientation :'landscape',
      //     format: "a4",
      //     unit: 'mm'
      //   }
      //   );
      // doc.addImage(dataURL,'PNG',0, 0, 287, 200);
      // doc.save('sample-file.pdf');



    this.scheduleService
      .updateImage(
        dataURL,
        this.project.id,
        ConfigSc.currentDate.format(ConfigSc.dateRevFormat)
      )
      .then((url) => {
        json.image = url["image_url"];
        state.image = url["image_url"];


        let index = this.revisions.findIndex((rev) => rev.prog_number == this.property_index)
        json.id = this.revisions[index].id
        state.id = this.revisions[index].id
        this.revisions[index] = json;
        // this.revisions.push(json);
        // this.activeRevisions = this.deepCopy(this.copySelectedProject);

        this.activeColumns = this.allColumns;
        this.activeConnections = this.lineConnections;
        // this.property_index++;
        this.revImages[index] = {
          url: url["image_url"],
          date_generated: ConfigSc.currentDate.format(ConfigSc.dateRevFormat),
        }
        // this.revImages.push({
        //   url: url["image_url"],
        //   date_generated: ConfigSc.currentDate.format(ConfigSc.dateRevFormat),
        // });

        this.scheduleService.updateRevision(
          state,
          "project_tids_plan",
          this.project.id
        );

        this.projectSchedulePlanerApp.mainHeader.onHeaderChange();
        this.projectSchedulePlanerApp.projectMomentsContainer.refreshDisplay();
        this.projectSchedulePlanerApp.resourcePlanningContainer.refreshDisplay();
      });
  }

}
