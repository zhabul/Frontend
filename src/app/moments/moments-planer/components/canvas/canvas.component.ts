import {
  Component, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { fromEvent, switchMap, takeUntil, pairwise } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import history from 'src/app/canvas-ui/history/history';
import { GeneralsService } from 'src/app/core/services/generals.service';
import { Column } from 'src/app/moments/project-moments/resource-planning-app/containers/ProjectUsersContainer/ProjectUsersTableHead/Column';
import { Project } from 'src/app/moments/project-moments/resource-planning-app/models/Project';
import { User } from 'src/app/moments/project-moments/resource-planning-app/models/User';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { Configuration } from './components/Configuration';
import { ProjectPlanningApp } from './components/ProjectPlanningApp';

declare var $;

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"],
})
export class CanvasComponent implements AfterViewInit {

 @ViewChild("canvas") public canvas: ElementRef;

  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;

  public projectPlanningApp: ProjectPlanningApp;
  public loading = false;
  public dropdownSettings = {};

  public addUserModalShowing = false;
	public addResourceWeeksModalShowing = false;

  public allDisplayProjectsOriginal: Project[] = [];
  public allDisplayProjects: Project[] = [];
  // public allUsers: User[] = [];

  public resourceWeeksToAdd = 0;

  public allColumns: Column[] = [];
  public visibleColumns: Column[] = [];
  public publicHolidayDates: String[] = [];
  public workDays = [];

  public startDateDatepicker;
	public endDateDatepicker;

 	public startDateVacationDatepicker;
	public endDateVacationDatepicker;

  public selectedDateSegmentStartDate = Configuration.currentDate.format(Configuration.datepickerFormat);
  public selectedDateSegmentEndDate = Configuration.currentDate.format(Configuration.datepickerFormat);

  public selectedWeeksToShowWorkers = [Configuration.currentDate.format(Configuration.dateWeekFormat)];

  public enabledDatesInDatePicker: string[] = [];

  public whichOfUsersToShow: 'resource' | 'all' = 'resource';
  public whichOfProjectsToShow: 'offer' | 'project' | 'all' = 'project';

  public searchValue = '';
  public timer;

  public resourceWeekInput: HTMLInputElement;
	public columnInput: HTMLInputElement;
	public columnValueInput: HTMLInputElement;
	public columnNumberOfDaysInput: HTMLInputElement;
	public columnStartDateInput: HTMLInputElement;
	public columnEndDateInput: HTMLInputElement;

  public searchInputElement;

  public selectedVacationDateStartDate = Configuration.currentDate.format(Configuration.datepickerFormat);
	public selectedVacationDateEndDate = Configuration.currentDate.format(Configuration.datepickerFormat);

  constructor(
    private route: ActivatedRoute,
    private generalsService: GeneralsService,
    private translate: TranslateService,
    public ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {

    }

  public ngOnInit(): void {
      const userPermissions = JSON.parse(sessionStorage.getItem('userDetails'));
      Configuration.isInEditMode = userPermissions['show_planning_resource_planning'] == 1;

      const allImages = document.getElementsByClassName('canvas-img');
	    const lastImage: any = allImages[allImages.length - 1];

      lastImage.onload = async () => {
			this.dropdownSettings = {
				singleSelection: false,
				idField: 'id',
				textField: 'name',
				selectAllText: this.translate.instant('Select All'),
				unSelectAllText: this.translate.instant('Unselect All'),
				itemsShowLimit: 0,
				allowSearchFilter: true,
				noDataAvailablePlaceholderText: this.translate.instant('No data available'),
				searchPlaceholderText: this.translate.instant('Search')
			};
			// removing margin left on parent element because it messes the canvas layouts
			(document.getElementsByClassName('ml-50')[0] as HTMLElement).style.marginLeft = '0px';
			this.allDisplayProjectsOriginal = this.route.snapshot.data.projects.data;

			const largestSpan = this.getLargestSpanBetweenProjects(this.allDisplayProjectsOriginal);
			if (this.allDisplayProjectsOriginal.length > 0) {
				const resourceProject: Project = {
					id: 0,
					name: this.translate.instant('Resources'),
					color: '#111',
					startDate: largestSpan.startDate,
					startWeekDate: largestSpan.startWeekDate,
					endDate: largestSpan.endDate,
					endWeekDate: largestSpan.endWeekDate,
					numberOfDays: largestSpan.numberOfDays,
					users: [],
					resourceWeeks: [],
					x: 0,
					y: 0,
					countAsResources: true
				};
				this.allDisplayProjectsOriginal.push(resourceProject);
			}

			this.allDisplayProjects = this.allDisplayProjectsOriginal;
			//this.allUsers = this.route.snapshot.data.users.data;

			// this.allUsers = this.allUsers.map(user => {
			// 	if (user.dateSegments[0].endDate === null) {
			// 		user.dateSegments[0].endDate = largestSpan.endDate;
			// 		user.dateSegments[0].endWeekDate = largestSpan.endWeekDate;
			// 		user.dateSegments[0].numberOfDays = moment(largestSpan.endDate, Configuration.dateFormat)
			// 		.diff(moment(user.dateSegments[0].startDate, Configuration.dateFormat), 'days') + 1;
			// 	}

			// 	return user;
			// });

			this.allColumns = this.route.snapshot.data.columns.data;
			this.visibleColumns = this.allColumns.filter(column => column.isVisible);
			//this.unassignedUsers = this.route.snapshot.data.unassignedUsers.data;
			this.publicHolidayDates = Object.values(this.route.snapshot.data.publicHolidayDates.data);
			const workDays = await this.generalsService.getWorkWeek();
			this.workDays = workDays;

      await this.getPlannedVacationDates();

			this.projectPlanningApp = new ProjectPlanningApp(this);

			this.resourceWeekInput = document.getElementById('resourceWeekEditInput') as HTMLInputElement;
			this.columnInput = document.getElementById('columnEditInput') as HTMLInputElement;
			this.columnValueInput = document.getElementById('columnValueEditInput') as HTMLInputElement;
			this.columnNumberOfDaysInput = document.getElementById('columnNumberOfDaysInput') as HTMLInputElement;
			this.columnStartDateInput = document.getElementById('columnStartDateInput') as HTMLInputElement;
			this.columnEndDateInput = document.getElementById('columnEndDateInput') as HTMLInputElement;
			this.initializeDatePickers();
			this.setCloseModalsOnEscKey();
			//history.addToQueue();
			history.initializeKeyShortcuts();
			history.initializeBeforeunloadEvent();

			this.searchInputElement = document.getElementById('project-search-input');
			this.searchInputElement.style.display = 'block';
			this.searchInputElement.style.top = `${Configuration.toolboxSize}px`;
			//this.searchInputElement.style.height = `${Configuration.topSectionSize - ProjectUsersTableHead.columnHeight}px`;
      this.searchInputElement.style.height = '18px';
			this.searchInputElement.style.width = '180px';

			window.addEventListener('resize', this.debounce((e) => {
        this.projectPlanningApp = new ProjectPlanningApp(this);
			}));
		};


  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  initializeDatePickers() {
		this.startDateDatepicker = this.createDatePicker('#startDate');
		this.startDateDatepicker.on('change', (ev) => {
			const startDate = ev.target.value;
			if (startDate > this.selectedDateSegmentEndDate) this.selectedDateSegmentEndDate = startDate;
			this.selectedDateSegmentStartDate = startDate;
			//this.filterUsersWhichCanBeAdded();
			this.ref.detectChanges();
		}).on('blur', e => e.target.value = this.selectedDateSegmentStartDate);

		this.endDateDatepicker = this.createDatePicker('#endDate')
		this.endDateDatepicker.on('change', (ev) => {
			const endDate = ev.target.value;
			if (endDate < this.selectedDateSegmentStartDate) this.selectedDateSegmentStartDate = endDate;
			this.selectedDateSegmentEndDate = endDate;
			//this.filterUsersWhichCanBeAdded();
			this.ref.detectChanges();
		}).on('blur', e => e.target.value = this.selectedDateSegmentEndDate);


		this.startDateVacationDatepicker = this.createDatePicker('#startDateVacation', false);
		this.startDateVacationDatepicker.on('change', (ev) => {
			const startDate = ev.target.value;
			if (startDate > this.selectedVacationDateEndDate) this.selectedVacationDateEndDate = startDate;
			this.selectedVacationDateStartDate = startDate;
			this.ref.detectChanges();
		}).on('blur', e => e.target.value = this.selectedVacationDateStartDate);

		this.endDateVacationDatepicker = this.createDatePicker('#endDateVacation', false)
		this.endDateVacationDatepicker.on('change', (ev) => {
			const endDate = ev.target.value;
			if (endDate < this.selectedVacationDateStartDate) this.selectedVacationDateStartDate = endDate;
			this.selectedVacationDateEndDate = endDate;
			this.ref.detectChanges();
		}).on('blur', e => e.target.value = this.selectedVacationDateEndDate);
  }

  createDatePicker(selector: string, beforeShowDay: boolean = true) {
		const language = sessionStorage.getItem('lang');
		const options = {
			format: 'yyyy-mm-dd',
			calendarWeeks: true,
			autoclose: true,
			language: language,
			currentWeek: true,
			todayHighlight: true,
			currentWeekTransl: language === 'en' ? 'Week' : 'Vecka',
			currentWeekSplitChar: '-',
			beforeShowDay: (date) => {
                if(!beforeShowDay) {
                    return { enabled: true };
                }
				const dateString = moment(date).format(Configuration.dateFormat);
				return { enabled: this.enabledDatesInDatePicker.indexOf(dateString) !== -1 };
			}
		};
		return $(selector).datepicker(options);
  }

  toastrMessage(type: 'success'|'error'|'info', message: string) {
    this.toastr[type](message, this.translate.instant(type.charAt(0).toUpperCase() + type.slice(1)));
  }

  setCloseModalsOnEscKey() {
		document.onkeyup = (e) => {
			if (e.key !== 'Escape') return;

			this.addUserModalShowing = false;
			this.addResourceWeeksModalShowing = false;
			this.selectedDateSegmentStartDate = Configuration.currentDate.format(Configuration.datepickerFormat);
			this.selectedDateSegmentEndDate = Configuration.currentDate.format(Configuration.datepickerFormat);
			this.resourceWeeksToAdd = 0;
			this.ref.detectChanges();
		}
  }

  getLargestSpanBetweenProjects(projects: Project[]) {
		let projectWithLargestEndDate = projects[0];
		let projectWithSmallestStartDate = JSON.parse(JSON.stringify(projectWithLargestEndDate));

		projects.forEach(p => {
			if (p.endDate > projectWithLargestEndDate.endDate) projectWithLargestEndDate = p;
			if (p.startDate < projectWithSmallestStartDate.startDate) projectWithSmallestStartDate = p;
		});

		return {
			startDate: projectWithSmallestStartDate.startDate,
			startWeekDate: projectWithSmallestStartDate.startWeekDate,
			endDate: projectWithLargestEndDate.endDate,
			endWeekDate: projectWithLargestEndDate.endWeekDate,
			numberOfDays: moment(projectWithLargestEndDate.endDate, Configuration.dateFormat).diff(moment(projectWithSmallestStartDate.startDate, Configuration.dateFormat), 'days') + 1
		};
  }

  async getPlannedVacationDates() {
      const startDateGeneral = await this.generalsService.getGeneral(21);
      const endDateGeneral = await this.generalsService.getGeneral(22);

      if (startDateGeneral) this.selectedVacationDateStartDate = startDateGeneral['value'];
      if (endDateGeneral) this.selectedVacationDateEndDate = endDateGeneral['value'];
  }

  debounce(func, time = 500) {
		let timer;
		return (event) => {
		  if (timer) clearTimeout(timer);
		  timer = setTimeout(func, time, event);
		};
	}

  public getTranslate() { return this.translate; }


  setLoadingStatus(status: boolean) {
		this.loading = status;
		this.ref.detectChanges();
  }

  sortUsersByName(users: User[]) {
      users.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
      });
  }

  showConfirmationModal(message, callback) {
      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = false;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "";
      diaolgConfig.panelClass = "mat-dialog-confirmation";
      diaolgConfig.data = { questionText: message /*this.translate.instant('Are you sure you want to send email to: ') + emails + ' ?'*/ }
      this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().toPromise().then(callback);
  }

  searchUsers() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // this.filterUsersFromProject();
        // this.projectPlanningApp.projectUsersContainer.refreshDisplay();
        // this.projectPlanningApp.resourcePlanningContainer.refreshDisplay();
        clearTimeout(this.timer);
      }, 300);
  }

  returnHome() {
    this.router.navigate(['/home']);
  }

  public ngOnDestroy(): void {

  }
}
