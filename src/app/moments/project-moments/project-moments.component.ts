import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AbsenceSegmentData } from "./resource-planning-app/models/AbsenceSegmentData";
import { DateSegmentData } from "./resource-planning-app/models/DateSegmentData";
import { Project } from "./resource-planning-app/models/Project";
import { ResourceWeekDataForEditing } from "./resource-planning-app/models/ResourceWeekDataForEditing";
import { User } from "./resource-planning-app/models/User";
import { UsersService } from "src/app/core/services/users.service";
import { PlanningApp } from "./resource-planning-app/ResourcePlanningApp";
import { ProjectSegment } from "./resource-planning-app/containers/GridContainer/ProjectSegment";
import { Config } from "src/app/moments/project-moments/resource-planning-app/Config";
import { CmpRef } from "./resource-planning-app/CmpRef";
import { TableHeadColumn } from "./resource-planning-app/containers/ProjectUsersContainer/ProjectUsersTableHead/TableHeadColumn";
import { Column } from "./resource-planning-app/containers/ProjectUsersContainer/ProjectUsersTableHead/Column";
import history from "src/app/canvas-ui/history/history";
import { SendData } from "src/app/canvas-ui/models/SendData";
import { GeneralsService } from "src/app/core/services/generals.service";
import * as moment from "moment";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { PlannedAbsence } from "./resource-planning-app/models/PlannedAbsence";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

declare var $;

@Component({
    selector: "app-project-moments",
    templateUrl: "./project-moments.component.html",
    styleUrls: ["./project-moments.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMomentsComponent implements OnInit, OnDestroy {
    public planningApp: PlanningApp;

    public loading = false;

    public dropdownSettings = {};

    public allColumns: Column[] = [];
    public visibleColumns: Column[] = [];
    public publicHolidayDates: String[] = [];

    public selectedWeeksToShowWorkers = [
        Config.currentDate.format(Config.dateWeekFormat),
    ];
    public workDays;

    public plannedVacationModalShowing = false;

    public addUserModalShowing = false;
    public addResourceWeeksModalShowing = false;

    public selectedUsers = [];
    public resourceWeeksToAdd = 0;

    public startDateDatepicker;
    public endDateDatepicker;

    public startDateVacationDatepicker;
    public endDateVacationDatepicker;

    public selectedDateSegmentStartDate = Config.currentDate.format(
        Config.datepickerFormat
    );
    public selectedDateSegmentEndDate = Config.currentDate.format(
        Config.datepickerFormat
    );

    public selectedVacationDateName: string;
    public selectedVacationDateStartDate = Config.currentDate.format(
        Config.datepickerFormat
    );
    public selectedVacationDateEndDate = Config.currentDate.format(
        Config.datepickerFormat
    );
    public selectedVacationDateChanged = false;

    public enabledDatesInDatePicker: string[] = [];

    public projectIndex;
    public userIndex;
    public dateSegmentIndex;

    public allDisplayProjectsOriginal: Project[] = [];
    public allDisplayProjects: Project[] = [];
    public allUsers: User[] = [];
    public filteredAllUsers: User[] = [];
    public unassignedUsers: User[] = [];

    public planedAbsences: PlannedAbsence[] = [];

    public addUserModalBox: HTMLElement;
    public addResourceWeeksModalBox: HTMLElement;
    public plannedVacationModalBox: HTMLElement;
    public selectedResourceWeekDataForEditing: ResourceWeekDataForEditing;
    public selectedTableHeadColumnForEditing: TableHeadColumn;
    public selectedColumnForEditing: Column;
    public resourceWeekInput: HTMLInputElement;
    public columnInput: HTMLInputElement;
    public columnValueInput: HTMLInputElement;
    public columnNumberOfDaysInput: HTMLInputElement;
    public columnStartDateInput: HTMLInputElement;
    public columnEndDateInput: HTMLInputElement;
    public blurByEnterKey = false;

    public whichOfUsersToShow: "resource" | "all" = "resource";

    public searchValue = "";
    public timer;
    public searchInputElement;

    public splitDateSegmentOnClick = false;

    public selectedUsersForStyleChange = [];

    public changeBackgroundColorInputValue = "#000";
    public changeTextColorInputValue = "#000";
    public changeFontSizeInputValue = 13;
    public changeFontWeightInputValue = false;
    public changeFontStyleInputValue = false;
    public changeFontDecorationInputValue = false;
    public changeFontFamilyInputValue = "Calibri";

    private onWindowResize = this.debounce((e) => { this.planningApp = new PlanningApp(this); });

    public isInEditMode;

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectsService,
        private generalsService: GeneralsService,
        private userService: UsersService,
        private toastr: ToastrService,
        private translate: TranslateService,
        public ref: ChangeDetectorRef,
        private dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit() {
        const userPermissions = JSON.parse(sessionStorage.getItem("userDetails"));

        Config.isInEditMode = userPermissions["create_planning_resource_planning"] == 1;
          //  userPermissions["show_planning_resource_planning"] == 1;
        this.isInEditMode = Config.isInEditMode;

        const allImages = document.getElementsByClassName("canvas-img");
        const lastImage: any = allImages[allImages.length - 1];

        this.planedAbsences = this.route.snapshot.data.planedAbsences.map((x) => {
            x.m_startDate = moment(x.startDate, Config.dateFormat);
            x.m_endDate = moment(x.endDate, Config.dateFormat);
            return x;
        });

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
            this.allDisplayProjectsOriginal = this.route.snapshot.data.projects.data;

            const largestSpan = this.getLargestSpanBetweenProjects(
                this.allDisplayProjectsOriginal
            );

            if (this.allDisplayProjectsOriginal.length > 0 && largestSpan !== false) {
                const resourceProject: Project = {
                    id: 0,
                    name: this.translate.instant("Resources"),
                    color: "#111",
                    startDate: largestSpan.startDate,
                    startWeekDate: largestSpan.startWeekDate,
                    endDate: largestSpan.endDate,
                    endWeekDate: largestSpan.endWeekDate,
                    numberOfDays: largestSpan.numberOfDays,
                    users: [],
                    resourceWeeks: [],
                    x: 0,
                    y: 0,
                    countAsResources: true,
                };
                this.allDisplayProjectsOriginal.push(resourceProject);
            }

            this.allDisplayProjects = this.allDisplayProjectsOriginal;
            this.allUsers = this.route.snapshot.data.users.data;

            if(largestSpan !== false) {
                this.allUsers = this.allUsers.map((user) => {
                    if (user.dateSegments[0].endDate === null) {
                        user.dateSegments[0].endDate = largestSpan.endDate;
                        user.dateSegments[0].endWeekDate = largestSpan.endWeekDate;
                        user.dateSegments[0].numberOfDays =
                            moment(largestSpan.endDate, Config.dateFormat).diff(
                                moment(user.dateSegments[0].startDate, Config.dateFormat),
                                "days"
                            ) + 1;
                    }

                    return user;
                });

            }

            this.allColumns = this.route.snapshot.data.columns.data;
            this.visibleColumns = this.allColumns.filter(
                (column) => column.isVisible
            );
            this.unassignedUsers = this.route.snapshot.data.unassignedUsers.data;
            this.publicHolidayDates = Object.values(
                this.route.snapshot.data.publicHolidayDates.data
            );
            const workDays = await this.generalsService.getWorkWeek();
            this.workDays = workDays;

            this.planningApp = new PlanningApp(this);

            this.resourceWeekInput = document.getElementById(
                "resourceWeekEditInput"
            ) as HTMLInputElement;
            this.columnInput = document.getElementById(
                "columnEditInput"
            ) as HTMLInputElement;
            this.columnValueInput = document.getElementById(
                "columnValueEditInput"
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
            this.initializeDatePickers();
            this.setCloseModalsOnEscKey();
            history.addToQueue();
            history.initializeKeyShortcuts();
            history.initializeBeforeunloadEvent();

            this.searchInputElement = document.getElementById("user-search-input");
            this.searchInputElement.style.display = "block";
            this.searchInputElement.style.top = `${Config.toolboxSize}px`;
            this.searchInputElement.style.height = "18px";
            this.searchInputElement.style.width = "180px";

            window.addEventListener(
                "resize",
                this.onWindowResize
            );
        };

        const language = sessionStorage.getItem("lang");
        const datepickerOptions = {
            format: "yyyy-mm-dd",
            calendarWeeks: true,
            autoclose: true,
            language: language,
            currentWeek: true,
            todayHighlight: true,
            currentWeekTransl: language === "en" ? "Week" : "Vecka",
            currentWeekSplitChar: "-",
        };

        $("#columnStartDateInput")
            .datepicker(datepickerOptions)
            .on("changeDate", (e) => {
                const project = this.allDisplayProjects[this.projectIndex];
                const user = project.users[this.userIndex];

                const newDate = e.target.value.split(" ")[0];
                const difference = moment(newDate, Config.dateFormat).diff(
                    moment(user.dateSegments[0].startDate, Config.dateFormat),
                    "days"
                );

                if (difference === 0) return;

                history.addToQueue(
                    () => {
                        return true;
                    },
                    () => {
                        return true;
                    }
                );

                const dateSegment = user.dateSegments[user.dateSegments.length - 1];
                const previousState = JSON.parse(JSON.stringify(dateSegment));
                const startDateMoment = moment(dateSegment.startDate).add(
                    difference,
                    "days"
                );

                dateSegment.startDate = startDateMoment.format(Config.dateFormat);
                dateSegment.startWeekDate = startDateMoment.format(
                    Config.dateWeekFormat
                );
                dateSegment.numberOfDays += difference;

                history.appendToQueueGroup(
                    () => CmpRef.cmp.updateDateSegment(dateSegment),
                    () => CmpRef.cmp.updateDateSegment(previousState),
                    {
                        type: "date-change",
                        userId: user.id,
                        message: `Your work date has been updated on project (${project.name})`,
                    }
                );

                this.planningApp.projectUsersContainer.refreshDisplay();
                this.planningApp.resourcePlanningContainer.refreshDisplay();
            });

        $("#columnEndDateInput")
            .datepicker(datepickerOptions)
            .on("changeDate", (e) => {
                const project = this.allDisplayProjects[this.projectIndex];
                const user = project.users[this.userIndex];

                const newDate = e.target.value.split(" ")[0];
                const difference = moment(newDate, Config.dateFormat).diff(
                    moment(
                        user.dateSegments[user.dateSegments.length - 1].endDate,
                        Config.dateFormat
                    ),
                    "days"
                );
                if (difference === 0) return;

                history.addToQueue(
                    () => {
                        return true;
                    },
                    () => {
                        return true;
                    }
                );

                const dateSegment = user.dateSegments[user.dateSegments.length - 1];
                const previousState = JSON.parse(JSON.stringify(dateSegment));
                const endDateMoment = moment(dateSegment.endDate).add(
                    difference,
                    "days"
                );
                dateSegment.endDate = endDateMoment.format(Config.dateFormat);
                dateSegment.endWeekDate = endDateMoment.format(Config.dateWeekFormat);
                dateSegment.numberOfDays += difference;

                history.appendToQueueGroup(
                    () => CmpRef.cmp.updateDateSegment(dateSegment),
                    () => CmpRef.cmp.updateDateSegment(previousState),
                    {
                        type: "date-change",
                        userId: user.id,
                        message: `Your work date has been updated on project (${project.name})`,
                    }
                );

                this.planningApp.projectUsersContainer.refreshDisplay();
                this.planningApp.resourcePlanningContainer.refreshDisplay();
            });

        this.addUserModalBox = document.getElementById("add-user-modal-box");
        const addUserModal = document.getElementById("add-user-modal");
        this.addUserModalBox.style.left = `${window.innerWidth / 2 - this.addUserModalBox.offsetWidth / 2
            }px`;
        this.addUserModalBox.style.top = `${window.innerHeight / 2 - this.addUserModalBox.offsetHeight / 2
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

        this.plannedVacationModalBox = document.getElementById(
            "planned-vacation-modal-box"
        );
        this.plannedVacationModalBox.style.left = `${window.innerWidth / 2 - this.plannedVacationModalBox.offsetWidth / 2
            }px`;
        this.plannedVacationModalBox.style.top = `${window.innerHeight / 2 - this.plannedVacationModalBox.offsetHeight / 2
            }px`;

        this.addResourceWeeksModalBox = document.getElementById(
            "add-resource-weeks-modal-box"
        );
        const addResourceWeekModal = document.getElementById(
            "add-resource-weeks-modal"
        );
        this.addResourceWeeksModalBox.style.left = `${window.innerWidth / 2 - this.addResourceWeeksModalBox.offsetWidth / 2
            }px`;
        this.addResourceWeeksModalBox.style.top = `${window.innerHeight / 2 - this.addResourceWeeksModalBox.offsetHeight / 2
            }px`;

        this.addResourceWeeksModalBox.onmousedown = (e: any) => {
            if (e.target.nodeName !== "DIV" && e.target.nodeName !== "H4") return;
            addResourceWeekModal.onmousemove = (e2: any) => {
                let x = parseInt(this.addResourceWeeksModalBox.style.left);
                let y = parseInt(this.addResourceWeeksModalBox.style.top);
                if (isNaN(x)) x = 0;
                if (isNaN(y)) y = 0;

                this.addResourceWeeksModalBox.style.left = `${x + e2.movementX}px`;
                this.addResourceWeeksModalBox.style.top = `${y + e2.movementY}px`;
            };
            window.onmouseup = () => {
                addResourceWeekModal.onmousemove = null;
                window.onmouseup = null;
            };
        };

        document.getElementsByTagName("body")[0].classList.add("noselect");
    }

    debounce(func, time = 500) {
        let timer;
        return (event) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, time, event);
        };
    }

    ngOnDestroy() {
        // resetting margin left on parent element
        (
            document.getElementsByClassName("ml-50")[0] as HTMLElement
        ).style.marginLeft = "50px";
        history.dumpHistory();
        window.onmousemove = null;
        document.getElementsByTagName("body")[0].classList.remove("noselect");
        this.planningApp.destruct();
        this.planningApp = null;
        window.removeEventListener(
            "resize",
            this.onWindowResize
        );
    }

    setLoadingStatus(status: boolean) {
        this.loading = status;
        this.ref.detectChanges();
    }

    initializeDatePickers() {
        this.startDateDatepicker = this.createDatePicker("#startDate");
        this.startDateDatepicker
            .on("change", (ev) => {
                const startDate = ev.target.value;
                if (startDate > this.selectedDateSegmentEndDate)
                    this.selectedDateSegmentEndDate = startDate;
                this.selectedDateSegmentStartDate = startDate;
                this.filterUsersWhichCanBeAdded();
                this.ref.detectChanges();
            })
            .on("blur", (e) => (e.target.value = this.selectedDateSegmentStartDate));

        this.endDateDatepicker = this.createDatePicker("#endDate");
        this.endDateDatepicker
            .on("change", (ev) => {
                const endDate = ev.target.value;
                if (endDate < this.selectedDateSegmentStartDate)
                    this.selectedDateSegmentStartDate = endDate;
                this.selectedDateSegmentEndDate = endDate;
                this.filterUsersWhichCanBeAdded();
                this.ref.detectChanges();
            })
            .on("blur", (e) => (e.target.value = this.selectedDateSegmentEndDate));

        this.startDateVacationDatepicker = this.createDatePicker(
            "#startDateVacation",
            false
        );
        this.startDateVacationDatepicker
            .on("change", (ev) => {
                const startDate = ev.target.value;
                if (startDate > this.selectedVacationDateEndDate)
                    this.selectedVacationDateEndDate = startDate;
                this.selectedVacationDateStartDate = startDate;
                this.ref.detectChanges();
                setTimeout(() => {
                    $("#endDateVacation").datepicker(
                        "setStartDate",
                        this.trimWeek(startDate)
                    );
                }, 0);
            })
            .on("blur", (e) => (e.target.value = this.selectedVacationDateStartDate));

        this.endDateVacationDatepicker = this.createDatePicker(
            "#endDateVacation",
            false
        );
        this.endDateVacationDatepicker
            .on("change", (ev) => {
                this.ref.detectChanges();
                const endDate = ev.target.value;
                if (endDate < this.selectedVacationDateStartDate)
                    this.selectedVacationDateStartDate = endDate;
                this.selectedVacationDateEndDate = endDate;
                this.ref.detectChanges();
            })
            .on("blur", (e) => (e.target.value = this.selectedVacationDateEndDate));
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

                const dateString = moment(date).format(Config.dateFormat);
                return {
                    enabled: this.enabledDatesInDatePicker.indexOf(dateString) !== -1,
                };
            },
        };

        return $(selector).datepicker(options);
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

    filterUsersWhichCanBeAdded() {
        if (this.whichOfUsersToShow === "all") {
            const currentDate = moment().format('YYYY-MM-DD');
            this.filteredAllUsers = this.allUsers.filter((user) => {
              // if(user.dateSegments.at(-1).endDate == null || user.dateSegments.at(-1).endDate >= currentDate )
              if(user.dateSegments.at(-1).endDate >= currentDate )
                return true;
              return false;
            });
            return;
        }

        const startDate = this.selectedDateSegmentStartDate.split(" ")[0];
        const endDate = this.selectedDateSegmentEndDate.split(" ")[0];

        this.filteredAllUsers = [];
        const busyUsers: number[] = [];

        this.allDisplayProjectsOriginal.forEach((p) => {
            if (p.id === 0) return;
            p.users.forEach((user) => {
                if (!this.filteredAllUsers.some((fu) => fu.id === user.id)) {
                    this.filteredAllUsers.push(user);
                }
                if (
                    user.dateSegments.some(
                        (ds) => ds.startDate <= endDate && startDate <= ds.endDate
                    )
                ) {
                    busyUsers.push(user.id);
                }
            });
        });

        this.allDisplayProjects
            .find((p) => p.id === 0)
            .users.forEach((user) => {
                if (!this.filteredAllUsers.some((fu) => fu.id === user.id)) {
                    this.filteredAllUsers.push(user);
                }
            });

        this.filteredAllUsers = this.filteredAllUsers.filter(
            (user) => !busyUsers.includes(user.id)
        );

        this.sortUsersByName(this.filteredAllUsers);
    }

    setDisabledDates(startDate: string, endDate: string) {
        this.enabledDatesInDatePicker = [];

        let date = moment(startDate, Config.dateFormat);
        let formattedDate = date.format(Config.dateFormat);

        while (formattedDate <= endDate) {
            this.enabledDatesInDatePicker.push(formattedDate);
            date.add(1, "days");
            formattedDate = date.format(Config.dateFormat);
        }
    }

    updateDatePicker(selector, beforeShowDay: boolean = true) {
        $(selector).datepicker("destroy");
        this.createDatePicker(selector, beforeShowDay);
        $(selector).datepicker("refresh");
    }

    async updatePlannedVacation() {
        console.log("Kliknuo si na save");
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
        };

        this.projectService.addPlanedAbsences(newObject).then((response) => {
            if (response["status"]) {
                newObject.id = response["data"]["id"];
                newObject.m_startDate = moment(newObject.startDate, Config.dateFormat);
                newObject.m_endDate = moment(newObject.endDate, Config.dateFormat);

                const startDateArray = newObject.startDate
                    .split("-")
                    .map((n) => parseInt(n));
                const endDateArray = newObject.endDate
                    .split("-")
                    .map((n) => parseInt(n));

                this.planningApp.daysContainer.getAllDisplayMonths().forEach((ym) => {
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
        this.projectService.deletePlanedAbsences(id).then((status) => {
            if (status) {
                const index = this.planedAbsences.findIndex((x) => x.id == id);

                const startDateArray = this.planedAbsences[index].startDate
                    .split("-")
                    .map((n) => parseInt(n));
                const endDateArray = this.planedAbsences[index].endDate
                    .split("-")
                    .map((n) => parseInt(n));

                this.planningApp.daysContainer.getAllDisplayMonths().forEach((ym) => {
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

    showAddUserModal(projectIndex: number) {
        this.updateDatePicker("#startDate");
        this.updateDatePicker("#endDate");
        this.projectIndex = projectIndex;
        this.addUserModalShowing = true;
        this.whichOfUsersToShow = "resource";
        this.filterUsersWhichCanBeAdded();
        this.selectedUsers = [];
        this.ref.detectChanges();
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
            this.planningApp.daysContainer.getInnerContainer().removeAllChildren();
            this.planningApp.daysContainer.addAllDisplayMonthsThatFitContainerView();
            this.planningApp.resourcePlanningContainer.refreshDisplay();
            this.planningApp.daysContainer.draw();
            this.planningApp.addPlannedAbsences(true);
            this.setLoadingStatus(false);
        }
    }

    closeAddUserModal() {
        this.addUserModalShowing = false;
        this.selectedDateSegmentStartDate = Config.currentDate.format(
            Config.datepickerFormat
        );
        this.selectedDateSegmentEndDate = Config.currentDate.format(
            Config.datepickerFormat
        );
        this.addUserModalBox.style.left = `${window.innerWidth / 2 - this.addUserModalBox.offsetWidth / 2
            }px`;
        this.addUserModalBox.style.top = `${window.innerHeight / 2 - this.addUserModalBox.offsetHeight / 2
            }px`;
    }

    showAddResourceWeeksModal(projectIndex: number) {
        this.projectIndex = projectIndex;
        this.addResourceWeeksModalShowing = true;
        this.ref.detectChanges();
    }

    closeAddResourceWeeksModal() {
        this.addResourceWeeksModalShowing = false;
        this.resourceWeeksToAdd = 0;
        this.ref.detectChanges();
    }

    addResourceWeeksToProject() {
        this.planningApp.projectUsersContainer.addResourceWeeksToProject(
            this.projectIndex,
            this.resourceWeeksToAdd
        );
        this.resourceWeeksToAdd = 0;
        this.closeAddResourceWeeksModal();
    }

    closePlannedVacationModalWithBackground(e) {
        if (e.target.className === "modal") this.closePlannedVacationModal();
    }

    closeAddUserModalWithBackground(e) {
        if (e.target.className === "modal") this.closeAddUserModal();
    }

    closeAddResourceWeeksModalWithBackground(e) {
        if (e.target.className === "modal") this.closeAddResourceWeeksModal();
    }

    async updateResourceWeek(e) {
        if (e.type === "keyup") this.blurByEnterKey = true;
        if (this.blurByEnterKey && e.type === "blur") return;

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

        const resourceWeekData = this.selectedResourceWeekDataForEditing;
        setTimeout(() => {
            this.blurByEnterKey = false;
        }, 200);
        this.hideResourceWeekInput();

        if (
            (!resourceWeekData.project.resourceWeeks[resourceWeekData.resourceWeek] &&
                newResourcesNeededValue === 0) ||
            Number(
                resourceWeekData.project.resourceWeeks[resourceWeekData.resourceWeek]
            ) === newResourcesNeededValue
        )
            return;
        const oldValue =
            resourceWeekData.project.resourceWeeks[resourceWeekData.resourceWeek];

        history.addToQueue(
            () =>
                this.updatePlanningResourceWeek(
                    resourceWeekData.project.id,
                    resourceWeekData.resourceWeek,
                    newResourcesNeededValue
                ),
            () =>
                this.updatePlanningResourceWeek(
                    resourceWeekData.project.id,
                    resourceWeekData.resourceWeek,
                    oldValue
                )
        );

        resourceWeekData.project.resourceWeeks[resourceWeekData.resourceWeek] =
            newResourcesNeededValue;
        resourceWeekData.resourceWeekTextShape.setTextContent(
            `${newResourcesNeededValue}/${resourceWeekData.project.users.length}`
        );
        resourceWeekData.resourceWeekTextShape.setAlignment("center", "center");
        resourceWeekData.resourceWeekTextShape.updateTextDimensions();

        this.planningApp.projectUsersContainer.refreshDisplay();
        this.planningApp.resourcePlanningContainer.refreshDisplay();
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
        history.addToQueue(
            () =>
                this.updateColumnFromPlanning(column.getColumn().id, newColumnValue),
            () => this.updateColumnFromPlanning(column.getColumn().id, oldValue)
        );

        column.getParent().getParent().refreshDisplay();
    }

    async updateColumnValue(e) {
        if (e.type === "keyup") this.blurByEnterKey = true;
        if (this.blurByEnterKey && e.type === "blur") return;

        const newColumnValue: string = e.target.value;
        const column = this.selectedColumnForEditing;
        setTimeout(() => {
            this.blurByEnterKey = false;
        }, 200);
        this.hideColumnValueInput();

        const project = this.allDisplayProjects[this.projectIndex];
        const userId =
            typeof this.userIndex === "number" ? project.users[this.userIndex].id : 0;
        if (!column.values[project.id])
            column.values[project.id] = { users: {}, value: "" };
        if (userId !== 0 && !column.values[project.id].users[userId])
            column.values[project.id].users[userId] = "";
        const oldValue =
            userId === 0
                ? column.values[project.id].value
                : column.values[project.id].users[userId];
        if (userId === 0) {
            column.values[project.id].value = newColumnValue;
        } else {
            column.values[project.id].users[userId] = newColumnValue;
        }
        history.addToQueue(
            () =>
                this.updateColumnValueFromResourcePlanning(
                    column.id,
                    project.id,
                    userId,
                    newColumnValue
                ),
            () =>
                this.updateColumnValueFromResourcePlanning(
                    column.id,
                    project.id,
                    userId,
                    oldValue
                )
        );

        this.planningApp.projectUsersContainer.refreshDisplay();
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

        const project = this.allDisplayProjects[this.projectIndex];
        const user = project.users[this.userIndex];

        const newEndDate = moment(
            user.dateSegments[0].startDate,
            Config.dateFormat
        ).add(newColumnValue - 1, "days");

        history.addToQueue(
            () => {
                return true;
            },
            () => {
                return true;
            }
        );

        const formattedNewEndDate = newEndDate.format(Config.dateFormat);

        user.dateSegments = user.dateSegments.filter((dateSegment) => {
            if (dateSegment.startDate > formattedNewEndDate) {
                history.appendToQueueGroup(
                    () =>
                        CmpRef.cmp.removeDateSegmentFromResourcePlanning(dateSegment.id),
                    () =>
                        CmpRef.cmp.addDateSegmentToUserFromPlanning(
                            project.id,
                            user.id,
                            dateSegment.startDate,
                            dateSegment.endDate
                        )
                );
                return false;
            }

            if (dateSegment.endDate > formattedNewEndDate) {
                const previousState = JSON.parse(JSON.stringify(dateSegment));
                dateSegment.endDate = formattedNewEndDate;
                dateSegment.endWeekDate = newEndDate.format(Config.dateWeekFormat);
                dateSegment.numberOfDays =
                    newEndDate.diff(
                        moment(dateSegment.startDate, Config.dateFormat),
                        "days"
                    ) + 1;

                history.appendToQueueGroup(
                    () => CmpRef.cmp.updateDateSegment(dateSegment),
                    () => CmpRef.cmp.updateDateSegment(previousState),
                    {
                        type: "date-change",
                        userId: user.id,
                        message: `Your work date has been updated on project (${project.name})`,
                    }
                );
            }

            return true;
        });

        CmpRef.cmp.planningApp.projectUsersContainer.refreshDisplay();
        CmpRef.cmp.planningApp.resourcePlanningContainer.refreshDisplay();
    }

    hideResourceWeekInput() {
        this.resourceWeekInput.style.display = "none";
    }

    hideColumnInput() {
        this.columnInput.style.display = "none";
    }

    hideColumnValueInput() {
        this.columnValueInput.style.display = "none";
    }

    hideNumberOfDayColumnInput() {
        this.columnNumberOfDaysInput.style.display = "none";
    }

    setCloseModalsOnEscKey() {
        document.onkeyup = (e) => {
            if (e.key !== "Escape") return;

            this.addUserModalShowing = false;
            this.addResourceWeeksModalShowing = false;
            this.selectedDateSegmentStartDate = Config.currentDate.format(
                Config.datepickerFormat
            );
            this.selectedDateSegmentEndDate = Config.currentDate.format(
                Config.datepickerFormat
            );
            this.resourceWeeksToAdd = 0;
            this.ref.detectChanges();
        };
    }

    searchUsers() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.filterUsersFromProject();
            this.planningApp.projectUsersContainer.refreshDisplay();
            this.planningApp.resourcePlanningContainer.refreshDisplay();
            clearTimeout(this.timer);
        }, 300);
    }

    openAddResourceWeeksModal(projectSegment: ProjectSegment) {
        const project =
            CmpRef.cmp.allDisplayProjects[projectSegment.getProjectRefIndex()];
        if (Object.keys(project.resourceWeeks).length === 0) {
            CmpRef.cmp.showAddResourceWeeksModal(projectSegment.getProjectRefIndex());
        }
    }

    addUserToProject(projectIndex: number) {
        if (this.selectedUsers.length < 1) {
            this.toastr.info(
                this.translate.instant("No selected workers to add!"),
                this.translate.instant("Info")
            );
            return;
        }

        const startDate = moment(this.selectedDateSegmentStartDate.split(" ")[0], Config.dateFormat);
        const endDate = moment(this.selectedDateSegmentEndDate.split(" ")[0], Config.dateFormat);
        const users = this.allDisplayProjects[projectIndex].users;

        const dateSegment = {
            id: -Math.round(Math.random() * 10000000), // placeholder id
            startDate: startDate.format(Config.dateFormat),
            endDate: endDate.format(Config.dateFormat),

            startWeekDate: startDate.format(Config.dateWeekFormat),
            endWeekDate: endDate.format(Config.dateWeekFormat),
            numberOfDays:
                endDate.diff(
                    startDate,
                    "days"
                ) + 1,
            x: 0,
            y: 0,
        };

        this.selectedUsers.forEach((u) => {
            dateSegment.id = -Math.round(Math.random() * 10000000); // placeholder id
            const userContractEndDate = this.allUsers.find(usr => usr.id == u.id)?.dateSegments[0].endDate;

            if (userContractEndDate != null) {
                if (endDate.isAfter(moment(userContractEndDate, Config.dateFormat)) || startDate.isAfter(moment(userContractEndDate, Config.dateFormat))) {
                    this.toastrMessage(
                        "info",
                        this.getTranslate()
                            .instant("RPC_WORKER_DATE", { worker: u.name })
                    );
                    return;
                }
            }

            if (users.some((us) => us.id === u.id)) {
                const userIndex = this.allDisplayProjects[projectIndex].users.findIndex(
                    (us) => us.id === u.id
                );
                const user = this.allDisplayProjects[projectIndex].users[userIndex];

                const hasDS = user.dateSegments.some((ds) => {
                    // return (
                    //     parseInt(dateSegment.startWeekDate.replace('-', '')) >= parseInt(ds.startWeekDate.replace('-', '')) &&
                    //     parseInt(dateSegment.startWeekDate.replace('-', '')) <= parseInt(ds.endWeekDate.replace('-', ''))
                    // ) ||
                    //     (
                    //         parseInt(dateSegment.endWeekDate.replace('-', '')) <= parseInt(ds.endWeekDate.replace('-', '')) &&
                    //         parseInt(dateSegment.endWeekDate.replace('-', '')) >= parseInt(ds.startDate.replace('-', ''))
                    //     );
                    return ds.startDate <= startDate.format(Config.dateFormat) && endDate.format(Config.dateFormat) <= ds.endDate
                });

                if (hasDS) {
                    this.toastr.info(
                        this.translate.instant(
                            "User is already on the projects during these dates"
                        ),
                        this.translate.instant("Info")
                    );
                    return;
                }

                let pomStartDate = moment(startDate).add(-1,"days");

                //if Zlatko want skip weekend
                // while(this.isWeekend(pomStartDate)){
                //   pomStartDate.add(-1,"days");
                // }

                const indexOfDateSegment = user.dateSegments.findIndex(ds =>
                  ds.endDate >= pomStartDate.format(Config.dateFormat) &&
                  ds.startDate <= pomStartDate.format(Config.dateFormat));
                if(indexOfDateSegment != -1){
                  user.dateSegments.at(indexOfDateSegment).endDate = endDate.format(Config.dateFormat);
                  user.dateSegments.at(indexOfDateSegment).endWeekDate = endDate.format(Config.dateWeekFormat);
                  user.dateSegments.at(indexOfDateSegment).numberOfDays = endDate.diff(moment(user.dateSegments.at(indexOfDateSegment).startDate),"days") + 1;
                  history.addToQueue(
                    () => this.updateDateSegment(user.dateSegments.at(indexOfDateSegment))
                    );
                  ;
                } else {
                  user.dateSegments.push(dateSegment);
                  this.planningApp.projectUsersContainer.addDateSegmentToUser(
                      projectIndex,
                      userIndex,
                      dateSegment
                  );
                }

            } else {
                const user = JSON.parse(JSON.stringify(this.filteredAllUsers.find((fu) => fu.id === u.id)));

                user.sortIndex =
                    users.length > 0 ? users[users.length - 1].sortIndex + 1 : 1;
                user.dateSegments = [dateSegment];

                this.planningApp.projectUsersContainer.addUserToProject(
                    projectIndex,
                    user
                );
            }
        });


        this.selectedUsers = [];
        this.selectedDateSegmentStartDate = Config.currentDate.format(
            Config.datepickerFormat
        );
        this.selectedDateSegmentEndDate = Config.currentDate.format(
            Config.datepickerFormat
        );

        this.closeAddUserModal();
        this.planningApp.projectUsersContainer.refreshDisplay();
        this.planningApp.resourcePlanningContainer.refreshDisplay();
    }

    filterUsersFromProject() {
        if(this.allDisplayProjectsOriginal.length == 0) return;

        let tempProjects: Project[] = JSON.parse(
            JSON.stringify(this.allDisplayProjectsOriginal)
        );

        const searchValue = this.searchValue.toLowerCase();
        let searchValueCopy = this.searchValue.toLowerCase();

        if (
            searchValue.length >= 2 &&
            searchValue[0] == "p" &&
            !isNaN(parseInt(searchValue[1]))
        ) {
            tempProjects = tempProjects.filter((project) => {
                if (project.id <= 0) return true;

                if (!project.name.toLowerCase().startsWith(searchValue)) {
                    return false;
                }
                return true;
            });

            searchValueCopy = "";
        }

        if (this.selectedWeeksToShowWorkers.length > 0) {
            this.allDisplayProjects = tempProjects.filter((project) => {
                if (
                    this.selectedWeeksToShowWorkers.every(
                        (week) => project.endWeekDate < week
                    )
                )
                    return false;

                project.users = project.users.filter((user) => {
                    return (
                        (user.hasOwnProperty("showInResourcePlanning")
                            ? user.showInResourcePlanning
                            : true) &&
                        user.name.toLowerCase().includes(searchValueCopy) &&
                        this.selectedWeeksToShowWorkers.some((week) =>
                            user.dateSegments.some((ds) => ds.endWeekDate >= week)
                        )
                    );
                });

                if (
                    searchValueCopy != "" &&
                    project.users.length < 1 &&
                    project.id !== 0
                )
                    return false;

                this.sortUsersBySortIndex(project.users);

                return true;
            });
        } else {
            this.allDisplayProjects = tempProjects;
        }

        const resourceProject = this.allDisplayProjects.find(
            (project) => project.id === 0
        );
        resourceProject.users.length = 0;

        const usersWithFullSchedule: number[] = [];
        this.allDisplayProjectsOriginal.forEach((project) => {
            if (project.id <= 0) return;

            project.users.forEach((user) => {
                if (
                    !user.name.toLowerCase().includes(searchValueCopy) ||
                    usersWithFullSchedule.some((id) => id === user.id)
                )
                    return;

                if(!this.selectedWeeksToShowWorkers.some((week) =>
                moment(user.dateSegments.at(-1).endDate).format(Config.dateWeekFormat) >= week)
                )
                return;

                const userInsideResources = resourceProject.users.find(
                    (u) => u.id === user.id
                );

                if (userInsideResources !== undefined) {
                    if (
                        user.dateSegments.some(
                            (ds) => ds.endDate > userInsideResources.dateSegments[0].startDate
                        )
                    ) {

                        if (user.dateSegments[user.dateSegments.length - 1].numberOfDays == 1) {
                            return;
                        }

                        let newStartDate = moment(
                            user.dateSegments[user.dateSegments.length - 1].endDate,
                            Config.dateFormat
                        );

                        const userEndDate = moment(user.endDateContract, Config.dateFormat);

                        if (
                            newStartDate.format(Config.dateWeekFormat) ==
                            userEndDate.format(Config.dateWeekFormat)
                        ) {
                            resourceProject.users.splice(
                                resourceProject.users.findIndex(
                                    (ru) => ru.id == userInsideResources.id
                                ),
                                1
                            );
                            return;
                        }

                        if (newStartDate.isoWeekday() == 7) {
                            newStartDate = newStartDate.add(1, "day");
                        } else if (newStartDate.isoWeekday() == 1) {
                            newStartDate = newStartDate.add(1, "day");
                        } else {
                            newStartDate = newStartDate.weekday(7).add(1, "day");
                        }

                        let breakCon1 = true;
                        while(breakCon1){
                          breakCon1 = false;
                          if(user.absences)
                          user.absences.forEach( absence => {
                            if(newStartDate.format(Config.dateFormat) >= absence.startDate && newStartDate.format(Config.dateFormat) <= absence.endDate ){
                              newStartDate = moment(absence.endDate);
                              newStartDate.add(1,"days");
                              breakCon1 = true;
                            }
                          })
                          if(this.isWeekend(newStartDate)){
                            newStartDate.add(1,"days");
                            breakCon1 = true;
                          }
                        }


                        userInsideResources.dateSegments[0].startDate = newStartDate.format(
                            Config.dateFormat
                        );
                        userInsideResources.dateSegments[0].startWeekDate =
                            newStartDate.format(Config.dateWeekFormat);

                        userInsideResources.dateSegments[0].numberOfDays =
                            moment(
                                userInsideResources.dateSegments[0].endDate,
                                Config.dateFormat
                            ).diff(newStartDate, "days") + 1;
                        userInsideResources.dateSegments.push(...(this.findUserResourceDays(newStartDate, userInsideResources.id)));
                        if (
                          userInsideResources.dateSegments.length > 0
                      ) {
                        userInsideResources.dateSegments.forEach((dateSegment,index )=> {
                          if(dateSegment.startDate > dateSegment.endDate)
                            userInsideResources.dateSegments.splice(index,1);
                        });
                        }

                        if (
                          userInsideResources.dateSegments.length == 0
                      ) {
                        const userIndex = resourceProject.users.findIndex(user => user.id == userInsideResources.id);
                        resourceProject.users.splice(userIndex,1);
                      }

                    }
                } else {
                    let removeFromResource = false;

                    const userToAddToResources: User = JSON.parse(JSON.stringify(user));

                    let newStartDate = moment(
                        user.dateSegments[user.dateSegments.length - 1].endDate,
                        Config.dateFormat
                    );

                    if (user.dateSegments[user.dateSegments.length - 1].numberOfDays == 1) {
                        return;
                    }

                    if (newStartDate.isoWeekday() == 7) {
                        newStartDate = newStartDate.add(1, "day");
                    } else if (newStartDate.isoWeekday() == 1) {
                        newStartDate = newStartDate.add(1, "day");
                    } else {
                        newStartDate = newStartDate.weekday(7).add(1, "day");
                    }

                    let endDate = moment(resourceProject.endDate, Config.dateFormat).add(
                        1,
                        "month"
                    );

                    const userFromAll = this.allUsers.find(
                        (u) => u.id == userToAddToResources.id
                    );

                    if (userFromAll) {
                        endDate = moment(
                            userFromAll.dateSegments[userFromAll.dateSegments.length - 1]
                                .endDate,
                            Config.dateFormat
                        );
                    }

                    if (user.endDateContract != null) {

                        const userEndDate = moment(user.endDateContract, Config.dateFormat);

                        if (newStartDate.isAfter(userEndDate)) {
                            newStartDate = moment(
                                user.dateSegments[user.dateSegments.length - 1].endDate,
                                Config.dateFormat
                            );
                            if (
                                newStartDate.format(Config.dateWeekFormat) ==
                                userEndDate.format(Config.dateWeekFormat)
                            ) {
                                removeFromResource = true;
                            }
                        }

                        if (userEndDate.isBefore(endDate)) {
                            endDate = userEndDate;
                        }
                    }
                    userToAddToResources.dateSegments = [
                        {
                            id: -Math.round(Math.random() * 10000000),

                            startDate: newStartDate.format(Config.dateFormat),
                            startWeekDate: newStartDate.format(Config.dateWeekFormat),

                            endDate: endDate.format(Config.dateFormat),
                            endWeekDate: endDate.format(Config.dateWeekFormat),

                            numberOfDays: endDate.diff(newStartDate, "days") + 1,

                            x: 0,
                            y: 0,
                        },
                    ];

                    if (
                        userToAddToResources.dateSegments[0].numberOfDays <= 0 || removeFromResource
                    ) {
                        userToAddToResources.dateSegments = [];

                        if (removeFromResource) {
                            resourceProject.users = resourceProject.users.filter(usr => usr.id != user.id);
                        }
                    }
                    userToAddToResources.dateSegments.push(...(this.findUserResourceDays(moment(endDate, Config.dateFormat).add(1, 'month'), user.id)));
                    if (
                        userToAddToResources.dateSegments.length > 0
                    ) {
                      const currentDay = parseInt(moment(Config.currentDate).weekday(1).add(-7, 'days').format('YYYYMMDD'));

                      let userDS = this.allDisplayProjects
                                .flatMap(p => {
                                    if (p.id == 0) return undefined;
                                    return p.users.find(u => u.id == user.id)?.dateSegments
                                })
                                .filter(x => x != undefined)
                                .filter(x => parseInt(moment(x.endDate, Config.dateFormat).format('YYYYMMDD')) > currentDay)
                                .sort((a, b) => parseInt(a.startWeekDate.replace('-', '')) - parseInt(b.startWeekDate.replace('-', '')));
                        for(let j = 0; j < userToAddToResources.dateSegments.length; j++){
                          for(let i = 0; i < userDS.length; i++){
                            if(
                              userToAddToResources.dateSegments.at(j) != undefined &&
                              (userToAddToResources.dateSegments.at(j).startDate >= userDS.at(i).startDate &&
                              userToAddToResources.dateSegments.at(j).startDate <= userDS.at(i).endDate)  ||
                              (userToAddToResources.dateSegments.at(j).endDate >= userDS.at(i).startDate &&
                              userToAddToResources.dateSegments.at(j).endDate <= userDS.at(i).endDate)
                              )
                              {
                                userToAddToResources.dateSegments.splice(j,1);
                                j--;
                                break;
                              }
                          }
                        }

                        if(userToAddToResources.dateSegments.length > 0){
                          resourceProject.users.push(userToAddToResources);
                        }
                    }
                }
            });
        });

        this.allUsers.forEach((user) => {
            if (resourceProject.users.find((xu) => xu.id == user.id) != undefined)
                return;

            if (
                !user.name.toLowerCase().includes(searchValueCopy) ||
                usersWithFullSchedule.some((id) => id === user.id)
            )
                return;

            if(!this.selectedWeeksToShowWorkers.some((week) =>
            moment(user.dateSegments.at(-1).endDate).format(Config.dateWeekFormat) >= week &&
            user.dateSegments.at(-1).endDate >= Config.currentDate.format(Config.dateFormat))
            )
            return;

            const userToAddToResources: User = JSON.parse(JSON.stringify(user));

            const userProjects = this.allDisplayProjects.filter((p) =>
                p.users.some((u) => u.id == user.id)
            );

            if (userProjects.length > 0) {
                let maxEndDate = "0";

                userProjects.forEach((up) => {
                    up.users.forEach((u) => {
                        if (u.id == user.id) {
                            u.dateSegments.forEach((ds) => {
                                if (ds.endDate > maxEndDate) {
                                    maxEndDate = ds.endDate;
                                }
                            });
                        }
                    });
                });

                let newStartDate = moment(maxEndDate, Config.dateFormat);
                if (newStartDate.isoWeekday() == 7) {
                    newStartDate = newStartDate.add(1, "day");
                } else if (newStartDate.isoWeekday() == 1) {
                    newStartDate = newStartDate.add(1, "day");
                } else {
                    newStartDate = newStartDate.weekday(7).add(1, "day");
                }

                if (userToAddToResources.dateSegments[0].endDate != null) {
                    const _date = moment(
                        userToAddToResources.dateSegments[0].endDate,
                        Config.dateFormat
                    );
                    const maxDate = moment(maxEndDate, Config.dateFormat);

                    if (
                        _date.format(Config.dateWeekFormat) ==
                        maxDate.format(Config.dateWeekFormat) ||
                        _date.isSame(maxDate)
                    ) {
                        return;
                    }
                }

                userToAddToResources.dateSegments[0].startDate = newStartDate.format(
                    Config.dateFormat
                );
                userToAddToResources.dateSegments[0].startWeekDate =
                    newStartDate.format(Config.dateWeekFormat);

                if (userToAddToResources.endDateContract == null) {
                    const endDate = moment(
                        resourceProject.endDate,
                        Config.dateFormat
                    ).add(1, "month");
                    userToAddToResources.dateSegments[0].endDate = endDate.format(
                        Config.dateFormat
                    );
                    userToAddToResources.dateSegments[0].endWeekDate = endDate.format(
                        Config.dateWeekFormat
                    );
                } else {
                    const endDate = moment(
                        userToAddToResources.endDateContract,
                        Config.dateFormat
                    );
                    userToAddToResources.dateSegments[0].endDate = endDate.format(
                        Config.dateFormat
                    );
                    userToAddToResources.dateSegments[0].endWeekDate = endDate.format(
                        Config.dateWeekFormat
                    );
                }
            }

            userToAddToResources.dateSegments[0].id = -Math.round(
                Math.random() * 10000000
            );

            let breakCon1 = true;
            let d1 = moment(userToAddToResources.dateSegments[0].startDate);
            let d2 = moment(userToAddToResources.dateSegments[0].endDate)
                while(breakCon1){
                  breakCon1 = false;
                  if(userToAddToResources.absences)
                  userToAddToResources.absences.forEach( absence => {
                    if(d1.format(Config.dateFormat) >= absence.startDate && d1.format(Config.dateFormat) <= absence.endDate ){
                      d1 = moment(absence.endDate);
                      d1.add(1,"days");
                      breakCon1 = true;
                    }
                  })
                  if(this.isWeekend(d1)){
                    d1.add(1,"days");
                    breakCon1 = true;
                  }
                }

                let breakCon = true;
                while(breakCon){
                  breakCon = false;
                  if(userToAddToResources.absences)
                  userToAddToResources.absences.forEach( absence => {
                    if(d2.format(Config.dateFormat) >= absence.startDate && d2.format(Config.dateFormat) <= absence.endDate ){
                      d2 = moment(absence.startDate);
                      d2.add(-1,"days");
                      breakCon = true;
                    }
                  })
                  if(this.isWeekend(d2)){
                    d2.add(-1,"days");
                    breakCon = true;
                  }
                }
                userToAddToResources.dateSegments[0].startDate = d1.format(Config.dateFormat);
                userToAddToResources.dateSegments[0].startWeekDate = d1.format(Config.dateWeekFormat)
                userToAddToResources.dateSegments[0].endDate = d2.format(Config.dateFormat)
                userToAddToResources.dateSegments[0].endWeekDate = d2.format(Config.dateWeekFormat)
                userToAddToResources.dateSegments[0].numberOfDays = d2.diff(d1,"days") + 1;
            resourceProject.users.push(userToAddToResources);
        });

        // resourceProject.users.sort((a,b) => {
        //   let daysA = this.calculateDays(a);
        //   let daysB = this.calculateDays(b);

        //   if(daysA - daysB == 0){
        //     if(a.dateSegments.at(0).startDate < b.dateSegments.at(0).startDate)
        //     return -1;
        //     return 1;
        //   }
        //   return daysA - daysB;

        // })
        this.sortResourceUsersByStartDate2(resourceProject.users);
    }

    calculateDays(user){
      let days = 0;
      let ds = user.dateSegments.findIndex(ds =>
        ds.startDate <= Config.currentDate.format(Config.dateFormat) &&
        ds.endDate >= Config.currentDate.format(Config.dateFormat)
        )
      if(ds != -1){
        let currDay = moment(Config.currentDate);
        while(this.isAbsence(currDay,user) || this.isWeekend(currDay)){
          currDay.add(1,"days");
          days++;
        }
      }
      else{
        ds = user.dateSegments.findIndex(ds =>
          ds.startDate > Config.currentDate.format(Config.dateFormat))
        if(ds != -1){
          return moment(user.dateSegments.at(ds).startDate).diff(Config.currentDate,"days")
        }
        return 100000000;
      }
      return days;
    }

    isAbsence(date: moment.Moment, user){
      let indAbs = user.absences.findIndex(abs => abs.startWeekDate == date.format(Config.dateWeekFormat));
      if(indAbs == -1) return false;
      while(indAbs < user.absences.length && user.absences.at(indAbs).startWeekDate == date.format(Config.dateWeekFormat) ){
        if(date.format(Config.dateFormat) >= user.absences.at(indAbs).startDate &&
        date.format(Config.dateFormat) <= user.absences.at(indAbs).endDate)
        return true;
        indAbs++;
      }
      return false;
    }

    findUserResourceDays(resourceStartDate: moment.Moment, userId) {
        const dateSegments = [];
        const resourceProject = this.allDisplayProjects.find(p => p.id == 0);
        // const currentDay = parseInt(moment(Config.currentDate).weekday(1).add(-7, 'days').format('YYYYMMDD'));
        let userDs = [];
        let userAbsc = this.allUsers.find(u => u.id == userId)?.absences;
        this.allDisplayProjects
            .flatMap(p => {
                if (p.id == 0) return undefined;
                // userAbsc = p.users.find(u => u.id == userId)?.absences
                return p.users.find(u => u.id == userId)?.dateSegments
            })
            .filter(x => x != undefined)
            // .filter(x => parseInt(moment(x.endDate, Config.dateFormat).format('YYYYMMDD')) > currentDay)
            .sort((a, b) => parseInt(a.startWeekDate.replace('-', '')) - parseInt(b.startWeekDate.replace('-', '')))
            .filter(ds => {
                const diff = resourceStartDate.diff(moment(ds.endDate, Config.dateFormat), 'days');
                const diff2 = moment(ds.endDate, Config.dateFormat).diff(moment(ds.startDate, Config.dateFormat), 'days') + 1;
                if (diff >= 1 && diff2 >= 1) {
                    return ds;
                }
            })
            .map((dateSegment, index, array) => {
                const next = array[index + 1];
                userDs.push(dateSegment)
                if (next == undefined) return undefined;
                if (dateSegment.endDate > next.endDate) return undefined;
                if(next.startDate>=dateSegment.startDate && next.endDate <= dateSegment.endDate) return undefined;
                return [dateSegment.endDate, next.startDate];
            })
            .filter(x => x != undefined)
            .forEach(dd => {
                const do1 = moment(dd[0], Config.dateFormat);
                const do2 = moment(dd[1], Config.dateFormat);
                let d1 = moment(dd[0], Config.dateFormat).add(1, 'day');
                let d2 = moment(dd[1], Config.dateFormat).add(-1, 'day');

                if (do1.isoWeek() == d1.isoWeek()) {
                    if (do1.isoWeekday() > 1) {
                        d1.add((8 - d1.isoWeekday()), 'days');
                    }
                }

                if (do2.isoWeek() == d2.isoWeek()) {
                    if (do2.isoWeekday() >= 5) {
                    } else {
                        d2.add(-(d2.isoWeekday() + 2), 'days');
                    }
                }
                else if (d2.isoWeekday() == 6 || d2.isoWeekday() == 7) {
                    d2 = d2.add(5 - d2.isoWeekday(), 'days');
                }
                if (d1.isoWeek() != d2.isoWeek() && d2.diff(d1, 'days') + 1 < 5) return;

                const dSegments = resourceProject.users.find(u => u.id == userId)?.dateSegments;
                let breakCon1 = true;
                while(breakCon1){
                  breakCon1 = false;
                  if(userAbsc)
                  userAbsc.forEach( absence => {
                    if(d1.format(Config.dateFormat) >= absence.startDate && d1.format(Config.dateFormat) <= absence.endDate ){
                      d1 = moment(absence.endDate);
                      d1.add(1,"days");
                      breakCon1 = true;
                    }
                  })
                  if(this.isWeekend(d1)){
                    d1.add(1,"days");
                    breakCon1 = true;
                  }
                }

                let breakCon = true;
                while(breakCon){
                  breakCon = false;
                  if(userAbsc)
                  userAbsc.forEach( absence => {
                    if(d2.format(Config.dateFormat) >= absence.startDate && d2.format(Config.dateFormat) <= absence.endDate ){
                      d2 = moment(absence.startDate);
                      d2.add(-1,"days");
                      breakCon = true;
                    }
                  })
                  if(this.isWeekend(d2)){
                    d2.add(-1,"days");
                    breakCon = true;
                  }
                }

                if(dSegments != undefined){
                  for(let i = 0; i < dSegments.length; i++){
                    if( d1.format(Config.dateFormat) >= dSegments.at(i).startDate &&
                        d2.format(Config.dateFormat) <= dSegments.at(i).endDate)
                        return;
                  }
                }
                if (resourceProject.users.find(u => u.id == userId)?.dateSegments.find(ds => ds.startDate == d1.format(Config.dateFormat)) != undefined) return;




                let notOverrlapedDs = true;
                for(let i = 0; i < userDs.length; i++){
                  if(
                    (d1.format(Config.dateFormat) >= userDs.at(i).startDate &&
                    d1.format(Config.dateFormat) <= userDs.at(i).endDate)  ||
                    (d2.format(Config.dateFormat) >= userDs.at(i).startDate &&
                    d2.format(Config.dateFormat) <= userDs.at(i).endDate)
                    )
                    {
                      notOverrlapedDs = false;
                    }
                }

                if(notOverrlapedDs){
                  dateSegments.push({
                    id: -Math.round(Math.random() * 10000000),

                    startDate: d1.format(Config.dateFormat),
                    startWeekDate: d1.format(Config.dateWeekFormat),

                    endDate: d2.format(Config.dateFormat),
                    endWeekDate: d2.format(Config.dateWeekFormat),

                    numberOfDays: d2.diff(d1, "days") + 1,

                    x: 0,
                    y: 0,
                });
                }

            });
        return dateSegments;
    }


    findUserResourceDays2(resourceStartDate: moment.Moment, userId) {
      const dateSegments = [];
      const resourceProject = this.allDisplayProjects.find(p => p.id == 0);
      // const currentDay = parseInt(moment(Config.currentDate).weekday(1).add(-7, 'days').format('YYYYMMDD'));
      let userDs = [];
      let userAbsc;// = resourceProject.users.find(u => u.id == userId)?.absences;
      let projectWhereUserWorks = this.allDisplayProjects
      .filter(p => {
          return p.id != 0 && p.users.find((user) => user.id == userId);
      });




      projectWhereUserWorks.filter(x => x != undefined)
          // .filter(x => parseInt(moment(x.endDate, Config.dateFormat).format('YYYYMMDD')) > currentDay)
          .sort((a, b) => parseInt(a.startWeekDate.replace('-', '')) - parseInt(b.startWeekDate.replace('-', '')))
          .filter(ds => {
              const diff = resourceStartDate.diff(moment(ds.endDate, Config.dateFormat), 'days');
              const diff2 = moment(ds.endDate, Config.dateFormat).diff(moment(ds.startDate, Config.dateFormat), 'days') + 1;
              if (diff >= 1 && diff2 >= 1) {
                  return ds;
              }
          })
          .map((dateSegment, index, array) => {
              const next = array[index + 1];
              userDs.push(dateSegment)
              if (next == undefined) return undefined;
              if (dateSegment.endDate > next.endDate) return undefined;
              if(next.startDate>=dateSegment.startDate && next.endDate <= dateSegment.endDate) return undefined;
              return [dateSegment.endDate, next.startDate];
          })
          .filter(x => x != undefined)
          .forEach(dd => {
              const do1 = moment(dd[0], Config.dateFormat);
              const do2 = moment(dd[1], Config.dateFormat);
              let d1 = moment(dd[0], Config.dateFormat).add(1, 'day');
              let d2 = moment(dd[1], Config.dateFormat).add(-1, 'day');

              if (do1.isoWeek() == d1.isoWeek()) {
                  if (do1.isoWeekday() > 1) {
                      d1.add((8 - d1.isoWeekday()), 'days');
                  }
              }

              if (do2.isoWeek() == d2.isoWeek()) {
                  if (do2.isoWeekday() >= 5) {
                  } else {
                      d2.add(-(d2.isoWeekday() + 2), 'days');
                  }
              }
              else if (d2.isoWeekday() == 6 || d2.isoWeekday() == 7) {
                  d2 = d2.add(5 - d2.isoWeekday(), 'days');
              }
              if (d1.isoWeek() != d2.isoWeek() && d2.diff(d1, 'days') + 1 < 5) return;

              const dSegments = resourceProject.users.find(u => u.id == userId)?.dateSegments;
              let breakCon1 = true;
              while(breakCon1){
                breakCon1 = false;
                if(userAbsc)
                userAbsc.forEach( absence => {
                  if(d1.format(Config.dateFormat) >= absence.startDate && d1.format(Config.dateFormat) <= absence.endDate ){
                    d1 = moment(absence.endDate);
                    d1.add(1,"days");
                    breakCon1 = true;
                  }
                })
                if(this.isWeekend(d1)){
                  d1.add(1,"days");
                  breakCon1 = true;
                }
              }

              let breakCon = true;
              while(breakCon){
                breakCon = false;
                if(userAbsc)
                userAbsc.forEach( absence => {
                  if(d2.format(Config.dateFormat) >= absence.startDate && d2.format(Config.dateFormat) <= absence.endDate ){
                    d2 = moment(absence.startDate);
                    d2.add(-1,"days");
                    breakCon = true;
                  }
                })
                if(this.isWeekend(d2)){
                  d2.add(-1,"days");
                  breakCon = true;
                }
              }

              if(dSegments != undefined){
                for(let i = 0; i < dSegments.length; i++){
                  if( d1.format(Config.dateFormat) >= dSegments.at(i).startDate &&
                      d2.format(Config.dateFormat) <= dSegments.at(i).endDate)
                      return;
                }
              }
              if (resourceProject.users.find(u => u.id == userId)?.dateSegments.find(ds => ds.startDate == d1.format(Config.dateFormat)) != undefined) return;




              let notOverrlapedDs = true;
              for(let i = 0; i < userDs.length; i++){
                if(
                  (d1.format(Config.dateFormat) >= userDs.at(i).startDate &&
                  d1.format(Config.dateFormat) <= userDs.at(i).endDate)  ||
                  (d2.format(Config.dateFormat) >= userDs.at(i).startDate &&
                  d2.format(Config.dateFormat) <= userDs.at(i).endDate)
                  )
                  {
                    notOverrlapedDs = false;
                  }
              }

              if(notOverrlapedDs){
                dateSegments.push({
                  id: -Math.round(Math.random() * 10000000),

                  startDate: d1.format(Config.dateFormat),
                  startWeekDate: d1.format(Config.dateWeekFormat),

                  endDate: d2.format(Config.dateFormat),
                  endWeekDate: d2.format(Config.dateWeekFormat),

                  numberOfDays: d2.diff(d1, "days") + 1,

                  x: 0,
                  y: 0,
              });
              }

          });
      return dateSegments;
  }

    public isWeekend(date: moment.Moment) {
      const dayName = date.format("dddd");
      const day = this.workDays.find(day => day.name === dayName);
      return day.type === "0" || this.publicHolidayDates.some(holiday => holiday == date.format(Config.dateFormat));
    }

    sortUsersBySortIndex(users: User[]) {
        users.sort((a, b) => {
            if (a.sortIndex < b.sortIndex) return -1;
            if (a.sortIndex > b.sortIndex) return 1;
            return 0;
        });
    }

    sortUsersByName(users: User[]) {
        users.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }

    sortUsersByStartDate(users: User[]) {
        users.sort((a, b) => {
            if (a.dateSegments[0].startDate < b.dateSegments[0].startDate) return -1;
            if (a.dateSegments[0].startDate > b.dateSegments[0].startDate) return 1;
            return 0;
        });
    }

    sortResourceUsersByStartDate(users: User[]) {
        const currentDay = parseInt(Config.currentDate.format('YYYYMMDD'));

        const mmToI = (date: string) => {
            return parseInt(moment(date, Config.dateFormat).format('YYYYMMDD'));
        }

        const mmToIAdd = (date: any, add: any = 3, what: any = 'months') => {
            return parseInt(moment(date, 'YYYYMMDD').add(add, what).format('YYYYMMDD'));
        }

        const sortArray: { [key: number]: number } = {};

        users.forEach(user => {
            let _userDs = mmToI(user.dateSegments.sort((a, b) => { return mmToI(a.startDate) - mmToI(b.startDate) })[0].startDate);

            if(_userDs <= currentDay) {
                _userDs = currentDay
            }

            const abs = user.absences.filter(ab => {
                if(ab.numberOfDays == 1) return false;

                const absInDs = mmToI(ab.startDate) >= _userDs && mmToI(ab.startDate) <= mmToIAdd(_userDs) || mmToI(ab.endDate) >= _userDs && mmToI(ab.endDate) <= mmToIAdd(_userDs);

                if(mmToI(ab.startDate) <= currentDay && mmToI(ab.endDate) >= currentDay && absInDs) {
                    return true;
                }

                if(mmToI(ab.startDate) >= currentDay && mmToI(ab.endDate) <= mmToIAdd(currentDay) && absInDs) {
                    return true;
                }

                return false;
            })

            if(abs.length > 0) {
                _userDs = parseInt(moment(abs[abs.length-1].endDate, Config.dateFormat).add(1, 'day').format('YYYYMMDD'));
            }

            sortArray[user.id] = _userDs;
        });

        const sorted = Object.keys(sortArray).sort((a, b) => { return sortArray[a] - sortArray[b]});
        users.sort((a, b) => sorted.indexOf(a.id.toString()) - sorted.indexOf(b.id.toString()));
    }

    sortResourceUsersByStartDate2(users: User[]) {
      // const currentDay = parseInt(Config.currentDate.format('YYYYMMDD'));

      const mmToI = (date: string) => {
          return parseInt(moment(date, Config.dateFormat).format('YYYYMMDD'));
      }

      // const mmToIAdd = (date: any, add: any = 3, what: any = 'months') => {
      //     return parseInt(moment(date, 'YYYYMMDD').add(add, what).format('YYYYMMDD'));
      // }

      const sortArray: { [key: number]: number } = {};

      users.forEach(user => {
        user.dateSegments.sort((a,b) => { return mmToI(a.startDate) - mmToI(b.startDate)} );
          let _userDss;
          let _userDs;
          _userDss = user.dateSegments.find((ds) => (ds.startDate <= Config.currentDate.format(Config.dateFormat) && Config.currentDate.format(Config.dateFormat) <= ds.endDate) || ds.startDate > Config.currentDate.format(Config.dateFormat))

          if(_userDss){
            _userDs = mmToI(_userDss.startDate);

            const abs = user.absences.filter(ab => {
              return (ab.startDate >= Config.currentDate.format(Config.dateFormat) ||
                      (ab.startDate < Config.currentDate.format(Config.dateFormat) &&
                        ab.endDate >= Config.currentDate.format(Config.dateFormat)) ) &&
                      _userDss.startDate <= ab.startDate && _userDss.endDate >= ab.endDate;
            })
            abs.sort((a,b) => { return mmToI(a.startDate) - mmToI(b.startDate)})
            // let day = _userDss.startDate > Config.currentDate.format(Config.dateFormat) ?
            //                 moment(_userDss.startDate) :
            //                 moment(Config.currentDate.format(Config.dateFormat))
            if(abs.length > 0
              &&
              ( // user is not free today
                (
                  (_userDss.startDate <= Config.currentDate.format(Config.dateFormat) && Config.currentDate.format(Config.dateFormat) <= _userDss.endDate) &&
                  abs.at(0).startDate <= Config.currentDate.format(Config.dateFormat) &&
              Config.currentDate.format(Config.dateFormat) <= abs.at(0).endDate ) ||
              //first day of free is on absence
              (_userDss.startDate > Config.currentDate.format(Config.dateFormat) &&
              _userDss.startDate == abs.at(0).startDate)
              )
              ) {
              let index = 0;
              let day = moment(abs.at(index).startDate);
              // let condition = true;
              while(this.isWeekend(day) || (index < abs.length && abs.at(index).startDate == day.format(Config.dateFormat)) ){
                if(this.isWeekend(day))
                  day.add(1,"days");
                else{
                  day = moment(abs.at(index).endDate).add(1,"day")
                  index++;
                }
              }
              _userDs = parseInt(day.format('YYYYMMDD'));



            }

          }
          else{
            let addToEnd = moment(Config.currentDate).add(10,"years");
            _userDs = parseInt(addToEnd.format('YYYYMMDD'));
          }

          // if(_userDs <= currentDay) {
          //     _userDs = currentDay
          // }


          sortArray[user.id] = _userDs;
      });

      const sorted = Object.keys(sortArray).sort((a, b) => { return sortArray[a] - sortArray[b]});
      users.sort((a, b) => sorted.indexOf(a.id.toString()) - sorted.indexOf(b.id.toString()));
  }

    private async changeUserStyleProperty(
        property: string,
        value: string | number
    ) {
        const changes = [];
        const previousState = [];

        CmpRef.cmp.allDisplayProjects.forEach((project) => {
            project.users.forEach((user) => {
                if (
                    CmpRef.cmp.selectedUsersForStyleChange.some(
                        (u) => u.projectId === project.id && u.userId === user.id
                    )
                ) {
                    if (
                        property == "fontWeight" ||
                        property == "fontStyle" ||
                        property == "fontDecoration"
                    ) {
                        value = user.styles[property] == "normal" ? value : "normal";
                    }

                    changes.push({
                        projectId: project.id,
                        userId: user.id,
                        value,
                    });

                    previousState.push({
                        projectId: project.id,
                        userId: user.id,
                        value: user.styles[property],
                    });
                    user.styles[property] = value;
                }
            });
        });
        history.addToQueue(
            () => this.projectService.changeUserStyleProperty(property, changes),
            () => this.projectService.changeUserStyleProperty(property, previousState)
        );
    }

    backgroundColorInputValueChanged(value) {
        this.changeUserStyleProperty("backgroundColor", value);
        this.changeBackgroundColorInputValue = value;

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    textColorInputValueChanged(value) {
        this.changeUserStyleProperty("color", value);
        this.changeTextColorInputValue = value;

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    fontSizeInputValueChanged(e) {
        const value = parseInt(e.target.value, 10);
        this.changeUserStyleProperty("fontSize", value);
        this.changeFontSizeInputValue = value;

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    fontWeightInputValueChanged(value) {
        this.changeFontWeightInputValue = !this.changeFontWeightInputValue;
        this.changeUserStyleProperty("fontWeight", value);

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    fontStyleInputValueChanged(value) {
        this.changeFontStyleInputValue = !this.changeFontStyleInputValue;
        this.changeUserStyleProperty("fontStyle", value);

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    fontDecorationInputValueChanged(value) {
        this.changeFontDecorationInputValue = !this.changeFontDecorationInputValue;
        this.changeUserStyleProperty("fontDecoration", value);

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    fontFamilyInputValueChanged(e) {
        const value = e.target.value;
        this.changeUserStyleProperty("fontFamily", value);
        this.changeFontFamilyInputValue = value;

        this.planningApp.projectUsersContainer.refreshDisplay();
        if (
            this.planningApp.projectUsersContainer.getSelectedUsersContainer() != null
        )
            this.planningApp.projectUsersContainer.getSelectedUsersContainer().draw();
    }

    getLargestSpanBetweenProjects(projects: Project[]) {
        if(projects.length == 0) return false;

        let projectWithLargestEndDate = projects[0];
        let projectWithSmallestStartDate = JSON.parse(
            JSON.stringify(projectWithLargestEndDate)
        );

        projects.forEach((p) => {
            if (p.endDate > projectWithLargestEndDate.endDate)
                projectWithLargestEndDate = p;
            if (p.startDate < projectWithSmallestStartDate.startDate)
                projectWithSmallestStartDate = p;
        });

        return {
            startDate: projectWithSmallestStartDate.startDate,
            startWeekDate: projectWithSmallestStartDate.startWeekDate,
            endDate: projectWithLargestEndDate.endDate,
            endWeekDate: projectWithLargestEndDate.endWeekDate,
            numberOfDays:
                moment(projectWithLargestEndDate.endDate, Config.dateFormat).diff(
                    moment(projectWithSmallestStartDate.startDate, Config.dateFormat),
                    "days"
                ) + 1,
        };
    }

    async updateProjectSegment(project: Project) {
        if (project.id < 0) {
            project.id = history.getRealId(project.id);
        }
        const res = await this.projectService.updateProjectSegment(
            project.id,
            project.startDate,
            project.endDate
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while updating project date! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async updateDateSegment(dateSegment: DateSegmentData) {
        let dateSegmentId = dateSegment.id;
        if (dateSegmentId === 0) return true;
        if (dateSegmentId < 0) {
            dateSegmentId = history.getRealId(dateSegmentId);
        }

        const res = await this.projectService.updateDateSegment(
            dateSegmentId,
            dateSegment.startDate,
            dateSegment.endDate,
            dateSegment.hasMultiple
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while updating user date! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async createAbsenceSegment(
        parentAbsenceSegmentId: number,
        absenceSegment: AbsenceSegmentData
    ) {
        const res = await this.projectService.createAbsenceSegment(
            parentAbsenceSegmentId,
            absenceSegment.startDate,
            absenceSegment.endDate
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while creating absence date! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }
    }

    async updateAbsenceSegment(absenceSegment: AbsenceSegmentData) {
        let absenceSegmentId = absenceSegment.id;
        if (absenceSegmentId < 0) {
            absenceSegmentId = history.getRealId(absenceSegmentId);
        }
        const res = await this.projectService.updateAbsenceSegment(
            absenceSegmentId,
            absenceSegment.startDate,
            absenceSegment.endDate
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while updating absence date! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async addUserToProjectFromPlanning(
        projectId: number,
        userId: number,
        sortIndex = -1,
        isResponsiblePerson: boolean
    ) {
        const res = await this.projectService.addUserToProjectFromPlanning(
            projectId,
            userId,
            sortIndex,
            isResponsiblePerson
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while adding user to project! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async addDateSegmentToUserFromPlanning(
        projectId: number,
        userId: number,
        startDate: string,
        endDate: string
    ) {
        const res = await this.projectService.addDateSegmentToUserFromPlanning(
            projectId,
            userId,
            startDate,
            endDate
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while adding date to user! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return res["data"];
    }

    async addPlanningResourceWeeksToProject(
        projectId: number,
        resourceWeeks: any
    ) {
        const res = await this.projectService.addPlanningResourceWeeksToProject(
            projectId,
            resourceWeeks
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while adding number of resources per week! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async removePlanningResourceWeeksToProject(projectId: number) {
        const res = await this.projectService.removePlanningResourceWeeksToProject(
            projectId
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while deleting number of resources per week! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async updatePlanningResourceWeek(
        projectId: number,
        resourceWeek: string,
        numberOfWorkersNeeded: number
    ) {
        const res = await this.projectService.updatePlanningResourceWeek(
            projectId,
            resourceWeek,
            numberOfWorkersNeeded
        );
        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while updating number of resources per week! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async updateColumnFromPlanning(columnId: number, newTextContent: string) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.updateColumnFromPlanning(
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

    async updateColumnValueFromResourcePlanning(
        columnId: number,
        projectId: number,
        userId: number,
        newTextContent: string
    ) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.updateColumnValueFromResourcePlanning(
            columnId,
            projectId,
            userId,
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

    async updateResourcePlanningUserSortIndexAndProjectId(user) {
        const res =
            await this.projectService.updateResourcePlanningUserSortIndexAndProjectId(
                user
            );

        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while updating user sort index! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async unassignUserFromProject(
        projectId: number,
        userId: number,
        isResponsiblePerson: boolean
    ) {
        const res = await this.userService.removeUserFromProjectByType({
            project_id: projectId,
            user_id: userId,
            type: isResponsiblePerson ? "ResponsiblePerons" : "Worker",
        });

        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while unassigning user! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async addResourcePlanningColumn() {
        const res = await this.projectService.addResourcePlanningColumn();

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

    async updateResourcePlanningColumnValueColumnIdsWithNewColumnId(
        oldColumnId: number,
        newColumnId: number
    ) {
        return await this.projectService.updateResourcePlanningColumnValueColumnIdsWithNewColumnId(
            oldColumnId,
            newColumnId
        );
    }

    async hideResourcePlanningColumn(columnId: number) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.hideResourcePlanningColumn(columnId);

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

    async showResourcePlanningColumn(columnId: number) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.showResourcePlanningColumn(columnId);

        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while toggling column visibility to show! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        return true;
    }

    async removeResourcePlanningColumn(columnId: number) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.removeResourcePlanningColumn(
            columnId
        );

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

    async updateResourcePlanningColumnWidth(columnId: number, width: number) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.updateResourcePlanningColumnWidth(
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

    async updateResourcePlanningColumnSortIndex(
        columnId: number,
        newSortIndex: number
    ) {
        if (columnId < 0) {
            columnId = history.getRealId(columnId);
        }
        const res = await this.projectService.updateResourcePlanningColumnSortIndex(
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

    async addResourcePlanningSendMessage(saveMessage: SendData) {
        const res = await this.projectService.addResourcePlanningSendMessage(
            saveMessage
        );
        return res["status"];
    }

    async sendResourcePlanningChangeMessagesToUsers() {
        const res =
            await this.projectService.sendResourcePlanningChangeMessagesToUsers();

        if (!res["status"]) {
            this.toastr.error(
                this.translate.instant(
                    "There was an error while sending changes to workers! Try again later."
                ),
                this.translate.instant("Error")
            );
            return false;
        }

        if (res["data"] === -1) {
            this.toastr.info(
                this.translate.instant("No messages to send to workers!"),
                this.translate.instant("Info")
            );
            return false;
        }

        this.toastr.success(
            this.translate.instant("Successfully sent saved changes to workers!"),
            this.translate.instant("Success")
        );

        return res["status"];
    }

    async getResourcePlanningSaveAndSendDatetime() {
        const res =
            await this.projectService.getResourcePlanningSaveAndSendDatetime();
        if (!res["status"]) return false;
        return res["data"];
    }

    async removeDateSegmentFromResourcePlanning(dateSegmentId: number) {
        if (dateSegmentId < 0) {
            dateSegmentId = history.getRealId(dateSegmentId);
        }
        const res = await this.projectService.removeDateSegmentFromResourcePlanning(
            dateSegmentId
        );
        if (!res["status"]) return false;
        return true;
    }

    async setProjectCountAsResources(
        projectId: number,
        countAsResources: boolean
    ) {
        const res = await this.projectService.setProjectCountAsResources(
            projectId,
            countAsResources
        );
        if (!res["status"]) return false;
        return true;
    }

    async setUserCountAsResources(
        userId: number,
        projectId: number,
        isResponsiblePerson: boolean,
        countAsResources: boolean
    ) {
        const res = await this.userService.setUserCountAsResources(
            userId,
            projectId,
            isResponsiblePerson,
            countAsResources
        );
        if (!res["status"]) return false;
        return true;
    }

    showConfirmationModal(message, callback) {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = false;
        diaolgConfig.disableClose = true;
        diaolgConfig.width = "";
        diaolgConfig.panelClass = "mat-dialog-confirmation";
        diaolgConfig.data = {
            questionText:
                message /*this.translate.instant('Are you sure you want to send email to: ') + emails + ' ?'*/,
        };
        this.dialog
            .open(ConfirmationModalComponent, diaolgConfig)
            .afterClosed()
            .subscribe(callback);
    }

    returnHome() {
        this.router.navigate(["/planning"]);
    }

    trimWeek(date: string) {
        return date.split(" ")[0];
    }
}
