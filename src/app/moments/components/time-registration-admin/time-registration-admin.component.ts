import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as _ from "underscore";
import { defaultStyle } from "./styles";
import { ColumnStateStore } from "./column-state-store.service";
import { Observable, of } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ChatService } from "./calendar-user-row/week-modal/chat.service";
import * as moment from "moment";
import { Router } from '@angular/router';

@Component({
  selector: "app-time-registration-admin",
  templateUrl: "./time-registration-admin.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./time-registration-admin.component.css"]
})
export class TimeRegistrationAdminComponent implements OnInit {

  @ViewChild("momentsWrapper") momentsWrapper;
  @ViewChild("rowsContainer") rowsContainer;
  @ViewChild("clickDiv") clickDiv;
  @ViewChild('translateContainer') translateContainer;
  @ViewChild('hoverLayerContainer') hoverLayerContainer;
  @ViewChild('hoverLayer') hoverLayer;
  @ViewChild('adminCalendar') adminCalendar;

  public hideScreen = false;
  public hideScreenZIndex = -10;
  public day: any;
  public users$: Observable<any[]> = of([]);
  public searchText: string = "";
  public calendar: any[] = [];
  public newWeekNUmberBorder: number = 0;
  public positionTopOfHeaderCalendar: number = 0;
  public positionHeaderBackground = "transparent";
  public spinner = false;
  public lastWeekCount = 2;
  public thisWeek = -1;
  public WeekNUmber: any;
  public timlineBodyWrapperWidth: number = 10340;
  public showFooterAnalitic: boolean = false;
  public projectStatus: any = "0";
  public numberOfWeeks = 0;
  public calendarRange = 4;
  public nextMonthFetched = false;
  public highlightedUser = -1;
  public lastScrollX = -1;
  public lastScrollY = -1;
  public userBoundaries = { start: 0, end: 20 };
  public calendarBoundaries = {
    start: 0,
    end: 20,
    nrOfWeeks: 34,
  };
  public scrollTop = '0px';
  public scrollLeft = 0;
  public calendarStyle = defaultStyle;
  public userRowGrid = `${this.calendarStyle} auto`;
  public throttledScrollFunction: any;
  public throttledRowsFunction: any;
  public throttledResizeFunction: any;
  public userBoundaryConditions: any = {};
  public calendar_set = false;
  public wholeCalendar = [];
  public directionY = 0;
  public firstUserSlice = 0;
  public translateY = {};
  public project_id = "";
  public momentsWrapperClientWidth = 0;
  public momentsWrapperClientHeight = 0;
  public translateX = {};
  public wrapperStyle = {};
  public firstLoad = false;
  public selectedTabs = {};
  public absenceTypes = [];
  public modalMaxHeight = 0;
  public opacity = 0;
  public absenceTypesFilter = {
    all: false,
  };
  public lastOffsetX = 0;
  public allUsers = [];
  public filteredUsers = [];
  public fetchUsers = {
    position: -1,
    offset: 0,
    allFetched: false,
    userCount: 0
  };
  public computedStyle: any = {
    mainWrapperStyle: {},
    calendarGrid: {},
    bodyWrapperStyle: {},
    calendarHeaderStyle: {},
    rowContainerDimensions: {},
    innerPlaceholderWidth: {},
    calendarWrapperStyle: {},
    stickyWeeksStyle: {},
    horizontalScroll: {},
    displacmentDiv: {},
    userPlaceholder: {},
    horizontalScrollGrid: {},
    horizontalScrollWidth: {},
    placeholderIneerUser: {},
    rowsContainerDimensions: {},
    userRowStyle: {},
    usersHeight: '0px'
  };
  public activeUser = false;
  public activeDay = false;
  public firstDayIndex = -1;
  public modalPosition = "bottom";
  public openGallerySub;
  public filterChatMessagesSub;
  public currentDate;
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private columnStateStore: ColumnStateStore,
    private chatService: ChatService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit() {

    if(!this.userDetails.show_timesheets_time_report_management) {
         this.router.navigate(["/home"]);
    }
    this.subToGallery();
    this.subToFilterChatMessages();
    const resolver = this.route.snapshot.data["users"];
    this.selectedTabs = resolver[0].data["TimeRegAdminCalendar"] || {};
    this.absenceTypes = resolver[1].data;
    this.setTranslateX(0);
  }

  unsubFromGallery() {
    if (this.openGallerySub) {
      this.openGallerySub.unsubscribe();
    }
  }

  public prevTop = -1;
  public prevLeft = -1;

  ngAfterViewInit() {

    this.setMomentsWrapperHeight();
    this.throttledScrollFunction = (e) => {

      const element = e.target;
      const scrollLeft = element.scrollLeft;
      const scrollTop = element.scrollTop;

      if (scrollLeft !== this.prevLeft) {
        this.sliceCalendarOnScroll(e, 'from_event');
      }

      if (scrollTop !== this.prevTop) {
        this.sliceUsersOnScroll(e, 'from_event');
      }

      this.prevLeft = scrollLeft;
      this.prevTop = scrollTop;

    };
    this.momentsWrapper.nativeElement.addEventListener("scroll", this.throttledScrollFunction);
    this.throttledResizeFunction = _.throttle(
      (e) => {
        this.refreshCalendar();
      },
      150,
      {}
    );
    window.addEventListener("resize", this.throttledResizeFunction);
    this.toggleBodyScroll("hidden");

  }

  checkIfHasScrollbar() {
    const el = this.momentsWrapper.nativeElement;
    const hasScrollbar = el.clientHeight == el.scrollHeight;

    if (hasScrollbar) {
      setTimeout(()=>{
        this.updateVisibleItems();
      }, 250);
    }
  }

  ngOnDestroy() {
    if (this.throttledScrollFunction) {
      this.momentsWrapper.nativeElement.removeEventListener(
        "scroll",
        this.throttledScrollFunction
      );
    }
    if (this.throttledRowsFunction) {
      this.rowsContainer.nativeElement.removeEventListener(
        "scroll",
        this.throttledRowsFunction
      );
    }
    if (this.throttledResizeFunction) {
      window.removeEventListener("resize", this.throttledResizeFunction);
    }
    if (this.filterChatMessagesSub) {
      this.filterChatMessagesSub.unsubscribe();
    }
    this.toggleBodyScroll("auto");
    this.unsubFromGallery();
  }

  toggleBodyScroll(scroll) {
    document.getElementsByTagName("body")[0].style.overflow = scroll;
  }

  refreshCalendar() {
    if (this.firstLoad === false) {
      this.firstLoad = true;
      return;
    }
    setTimeout(() => {
      this.setMomentsWrapperHeight();
      this.setStyles();
      this.updateVisibleItems();
      this.detectChanges();
    }, 100);
  }

  setMomentsWrapperHeight() {
    const momentsWrapper = this.momentsWrapper.nativeElement;
    this.momentsWrapperClientWidth = momentsWrapper.clientWidth;
    this.momentsWrapperClientHeight = momentsWrapper.clientHeight;
    this.modalMaxHeight = this.momentsWrapperClientHeight - 2 * this.calendarStyle.rowHeight;
    this.setStyles();
    this.detectChanges();
  }

	calculateCalendarZoom(fetched) {

		if (fetched == 14) {
			this.calendarStyle = defaultStyle;
			this.fitWeeksIntoContainer();
			return;
		}
		this.calendarStyle = {
			...defaultStyle
		};
	}

	fitWeeksIntoContainer() {
		this.calendarStyle = {
			...this.calendarStyle,
			calendarColumnWidth: 110,
			calendarColumnWidthHalf: 110/2,
			fontSizeXS: "12px",
			fontSizeSmall: "12px",
			fontSizeMedium: "14px",
			fontSizeLarge: '17px',
			rowHeight: 60,
			rowHeightHalf: 60/2,
			headerHeight: 57,
			opacity: 1,
			circleHeight: 50,
			circleWidth: 50,
		};
		this.setMomentsWrapperHeight();
		this.setStyles();
		//this.detectChanges();
	}

  public userSpan = {};
  public scrollingTimeout;
  public hoverDisplay = {
    display: 'block'
  };

  sliceUsersOnScroll(event, type) {
      const element = event.target;
      const scrollTop = element.scrollTop;
      const clientHeight = element.clientHeight;
      const rowHeight = this.calendarStyle.rowHeight;
      const slice = Math.floor(scrollTop / rowHeight);
      let firstSlice = slice;
          firstSlice = firstSlice < 0 ? 0 : firstSlice;
      const secondSlice = firstSlice + Math.floor(clientHeight / rowHeight) + 3;
      const usersLength = this.allUsers.length;
      this.users$ = of(this.allUsers.slice(firstSlice, secondSlice));

      this.scrollTop = (firstSlice * rowHeight) + 'px';

      if (type === 'from_event') {
        this.setTranslateY();
        this.detectChanges();
      }


      if (secondSlice > (usersLength - 3) && this.fetchUsers.allFetched === false && this.spinner === false) {
        this.fetchUsers = { ...this.fetchUsers, position: this.fetchUsers.position + 1 };
        this.detectChanges();
    }

  }

  setUserCount(userInfo) {
    if (userInfo.userCount != -1) {
      this.fetchUsers.userCount = userInfo.userCount;
    }
    if (this.fetchUsers.allFetched === false) {
      this.fetchUsers.allFetched = this.allUsers.length === this.fetchUsers.userCount;
    }
  }

  addAdditionalUsers(userInfo) {
    const users = userInfo.users;
    this.allUsers = this.allUsers.concat(users);
    if (users.length === 0) {
      this.fetchUsers.allFetched = true;
    }
    this.setUserCount(userInfo);
    this.updateVisibleItems();

    if (this.fetchUsers.allFetched === false) {
      setTimeout(()=>{
        this.checkIfHasScrollbar();
      }, 1000);
    }
  }

  transparentClick(event) {
    const clientX = event.clientX;
    const clientY = event.clientY;
    this.hoverDisplay = { ...this.hoverDisplay, display: 'none' };
    this.detectChanges();
    const element: any = document.elementFromPoint(clientX, clientY);
    if (element &&  typeof element.click === 'function') {
      element.click();
    }
    this.hoverDisplay = { ...this.hoverDisplay, display: 'block' };
    this.detectChanges();
  }

  setUserSpan(firstSlice, secondSlice) {
    const userSpan = {};
    for (let i = firstSlice; i < secondSlice; i++) {
      userSpan[i] = true;
    }
    return userSpan;
  }

  sliceCalendarOnScroll(event, type) {
    const element = event.target;
    const scrollLeft = element.scrollLeft;
    const clientWidth = element.clientWidth;
    const slice = Math.floor(
      scrollLeft / this.calendarStyle.calendarColumnWidth
    );
    const firstSlice = slice;
    const secondSlice =
      firstSlice + clientWidth / this.calendarStyle.calendarColumnWidth + 2;

    if (type === 'from_event') {
      this.setTranslateX(scrollLeft);
      this.setTranslateY();
    }
    this.detectChanges();
    const calendarSpan = this.setCalendarSpan(firstSlice, secondSlice);
    this.columnStateStore.setState({
      boundaries: this.calendarBoundaries,
      calendar: [],
      calendarSpan: calendarSpan
    });
  }

  setCalendarSpan(firstSlice, secondSlice) {
    const calendarSpan = {};
    for (let i = firstSlice; i < secondSlice; i++) {
      calendarSpan[i] = true;
    }
    return calendarSpan;
  }

  returnFilteredUsersOnAbsence(users) {
    return users.filter((user) => {
      const absenceKeys = user.absences.absenceKeys;
      let keepUser = false;

      if (absenceKeys) {
        for (let key of absenceKeys) {
          for (let absence of user.absences[key]) {
            if (
              this.absenceTypesFilter[absence.AbsenceType] &&
              keepUser === false
            ) {
              keepUser = true;
            }
          }
        }
      } else {
        keepUser = true;
      }
      return keepUser;
    });
  }

  setDisplacementDivWidth() {
    this.computedStyle.displacmentDiv = {
      width: `${
        this.calendarStyle.calendarColumnWidth * this.calendar.length
      }px`,
      height: "1px",
      position: "relative",
    };
    this.computedStyle.userPlaceholder = {
      width: `${this.calendarStyle.userWrapperWidth}px`,
      height: "15px",
    };
  }

  public queryParams = {
    fetched: 0,
    projectId: 0,
    date: '',
    s: ''
  };

  initiallyGenerateCalendar(event) {

    const projectId = event.projectId === '' ? 0 : event.projectId;

    this.setActiveHook(true);
    this.firstDayIndex = event.firstDayIndex;
    this.currentDate = event.currentDate;
    this.queryParams = {
      fetched: event.fetched,
      projectId: projectId,
      date: moment(event.currentDate).format('YYYY-MM-DD'),
      s: event.s.trim()
    };

    this.opacity = 0;
    this.setSpinner(true);
    this.ref.detectChanges();

    if (event.absenceTypesFilter) {
      this.absenceTypesFilter = event.absenceTypesFilter;
    }

    if (event.calendar) {
      this.calendar_set === false;
      this.calendar = event.calendar;
    }

    if (event.users) {
      this.allUsers = event.users.users;
      if (this.allUsers.length === 0) {
        this.fetchUsers.allFetched = true;
      }
    }

    if (event.nrOfWeeks) {
      this.calendarBoundaries = {
        ...this.calendarBoundaries,
        nrOfWeeks: event.nrOfWeeks,
        start: event.start,
      };
    }

    if (this.calendar_set === false) {
      this.updateVisibleItems();
      this.calendar_set = true;
      this.ref.detectChanges();
    }

    setTimeout(() => {
      this.calculateCalendarZoom(event.fetched);
      this.updateVisibleItems();
      this.setSpinner(false);
      this.opacity = 1;
      this.scrollIndexColumnIntoView(this.firstDayIndex);
      this.ref.detectChanges();
    }, 50);

    if (this.fetchUsers.allFetched === false) {
      setTimeout(()=>{
        this.checkIfHasScrollbar();
      }, 1000);
    }

  }

  updateVisibleItems() {
    if (this.momentsWrapper) {
      this.sliceUsersOnScroll({ target: this.momentsWrapper.nativeElement }, 'from_function');
      this.sliceCalendarOnScroll({ target: this.momentsWrapper.nativeElement }, 'from_function');
    }
    this.setStyles();
    this.detectChanges();
  }

  detectChanges() {
    if (!this.ref["destroyed"]) {
      this.ref.detectChanges();
    }
  }

  setCalendarHeaderStyle() {
    this.computedStyle.calendarHeaderStyle = {
      height: this.calendarStyle.headerHeight + "px",
      gridTemplateColumns: this.calendarStyle.userColumnGrid,
      fontSize: this.calendarStyle.fontSizeLarge,
    };
  }

  setTranslateY() {
    this.translateY = {
      transform: `translate3d(0px, ${this.scrollTop}, 0px)`,
      minHeight: '75px'
    };
  }

  public spinnerX = {};

  setTranslateX(x) {
    this.translateX = {
      transform: `translate3d(-${x}px, 0px, 0px)`,
      position: 'relative'
    };
    this.spinnerX = {
      transform: `translate3d(${x}px, 0px, 0px) scale(1.5)`
    };
  }

  setCalendarGrid() {
    this.computedStyle.calendarGrid = {
      "grid-template-columns":
        this.calendarStyle.userWrapperWidth + "px " + "auto",
      "grid-template-rows": "auto",
      height: this.allUsers.length * this.calendarStyle.rowHeight + "px",
      opacity: 1,
    };
  }

  setUsersHeight() {
    this.computedStyle.usersHeight = this.allUsers.length * this.calendarStyle.rowHeight + "px";
  }

  setBodyWrapperStyle() {
    this.computedStyle.bodyWrapperStyle = {
      opacity: 1,
    };
  }

  setRowsContainerDimensions() {
    const height = this.momentsWrapperClientHeight + "px";
    this.computedStyle.rowsContainerDimension = {
      gridTemplateColumns:
        this.computedStyle.calendarGrid["grid-template-columns"],
      height: height
    };
  }

  setMainWrapperStyle() {
    this.computedStyle.mainWrapperStyle = {
      overflowY: this.hideScreen ? "hidden" : "scroll",
    };
  }

  setCalendarWrapperStyle() {
    this.computedStyle.calendarWrapperStyle = {
      visibility: "visible",
      display: "grid",
      gridTemplateColumns: this.computedStyle.calendarGrid["grid-template-columns"],
      gridTemplateRows: "auto",
      position: 'relative'
    };
  }

  bottomLineStyle() {
    this.computedStyle.bottomLineStyle = {
      width: this.calendarStyle.userWrapperWidth + "px",
      height: "15px",
      left: 0,
      bottom: 0,
    };
  }

  setInnerPlaceholderWidth() {
    this.computedStyle.innerPlaceholderWidth = {
      width:
        this.calendar.length * this.calendarStyle.calendarColumnWidth + "px",
      top: -this.calendarStyle.headerHeight + "px",
    };
  }

  hideScreenFunc(data) {

    if (data.status) return;

    this.active = { user: false, day: false, RowNumber: -1, index: -1 };
    this.hoverDisplay = { ...this.hoverDisplay, display: 'block' };
    this.resetScrollOnMomentsWrapper();
    this.overlay = false;
    this.detectChanges();
  }

  scrollBackToLastOffset() {
    const rowsContainer = this.rowsContainer.nativeElement;
    rowsContainer.scrollTo(/* x */ this.lastOffsetX, /* y*/ 0);
    this.lastOffsetX = 0;
  }

  setUserRowStyle() {

    this.computedStyle.userRowStyle = {
      height: this.calendarStyle.rowHeight
    };
  }

  setStyles() {
    this.setUsersHeight();
    this.setDisplacementDivWidth();
    this.setPlaceholderIneerUserStyle();
    this.setCalendarHeaderStyle();
    this.setBodyWrapperStyle();
    this.setMainWrapperStyle();
    this.setInnerPlaceholderWidth();
    this.setStickyWeeksStyle();
    this.setTranslateY();
    this.bottomLineStyle();
    this.setHorizontalScrollGridStyle();
    this.setCalendarWrapperStyle();
    this.setHorizontalScrollStyle();
    this.setRowsContainerDimensions();
    this.setCalendarGrid();
    this.setUserRowStyle();
  }

  setStickyWeeksStyle() {
    this.computedStyle.stickyWeeksStyle = {
      height: this.calendarStyle.headerHeight + "px",
      opacity: 1,
    };
  }

  setHorizontalScrollStyle() {
    const clientWidth = this.momentsWrapperClientWidth;
    this.computedStyle.horizontalScrollStyle = {
      width: clientWidth + "px",
    };
  }

  setHorizontalScrollGridStyle() {
    const userWrapperWidth = this.calendarStyle.userWrapperWidth;
    const clientWidth = this.momentsWrapperClientWidth;

    this.computedStyle.horizontalScrollGridStyle = {
      gridTemplateColumns: `${userWrapperWidth}px ${
        clientWidth - userWrapperWidth
      }px`,
    };
  }

  setPlaceholderIneerUserStyle() {
    this.computedStyle.placeholderIneerUser = {
      width: this.calendarStyle.userWrapperWidth + "px",
    };
  }

  returnFilteredUsersOnProjectId(users) {
    if (this.project_id === "") {
      return users;
    }

    return users.filter((user) => {
      const projects = user.projects;
      let keepUser = false;
      if (projects.length) {
        keepUser = projects.includes(this.project_id);
      }
      return keepUser;
    }).map((user, index)=>{
      user.RowNumber = index + 1;
      return user;
    });
  }

  refreshCalendarOnSearch() {
    this.refreshCalendar();
    this.ref.detectChanges();
  }

  resetModals() {
    this.columnStateStore.closeModals(this.highlightedUser);
    this.highlightedUser = -1;
  }

  setSpinner(value:boolean) {
    this.spinner = value;
    this.detectChanges();
  }

  resetUsers() {
    this.fetchUsers.offset = 50;
    this.fetchUsers.position = -1;
    this.fetchUsers.allFetched = false;
    this.allUsers = [];
    this.filteredUsers = [];
    this.users$ = of([]);
    this.detectChanges();
    this.sliceUsersOnScroll({ target: this.momentsWrapper.nativeElement }, 'from_function');
    this.detectChanges();
  }


  public active = { user: false, day: false, RowNumber: -1, index: -1 };
  public overlay = false;

  public lastIndexScrolled = 0;

  public openModalHook = true;

  setActiveHook(event) {
    this.openModalHook = event;
  }






  setActiveUser({ index, day }) {
    if (this.active.user !== false) {
      this.active = { user: false, day: false, RowNumber: -1, index: -1 };
      return;
    }

    this.users$.subscribe((users)=>{

      const user = users[index];
      this.active = { index: index, user: users[index], day: day, RowNumber: user.RowNumber - 1 };
      this.overlay = true;

      let day_ = day.day === 0 ? 7 : day.day;
      let index_ = day.index;
      let view = index_ - day_;

      this.scrollIndexColumnIntoView(view);
      this.detectChanges();
      setTimeout(()=>{
        this.hoverDisplay = { ...this.hoverDisplay, display: 'none' };
        this.detectChanges();
      }, 1);
    });
  }

  scrollIndexColumnIntoView(index) {

    const target = this.momentsWrapper.nativeElement;
    const left = index * this.calendarStyle.calendarColumnWidth;
    this.scrollLeft = target.scrollLeft;
    target.scrollTo({ left: left, behavior: 'smooth' });
  }

  resetScrollOnMomentsWrapper() {
    this.momentsWrapper.nativeElement.scrollTo({ left: this.scrollLeft, behavior: 'smooth' });
  }

  updateDayStatus(event) {

    const status = event.status;
    const date = event.date;

    const sub = this.users$.subscribe((users)=>{

      const activeUser_:any = this.active.user;
      const userIndex = activeUser_.RowNumber - 1;
      const activeUser = this.allUsers[userIndex];

      if (activeUser) {

        const index = this.findActiveUserIndex(users, activeUser);
        let absences;

        if (activeUser.absences[date]) {
          absences = activeUser.absences[date].map((abs_) => {
            return {
              ...abs_,
              raportedDayHaveMomentsAndLocked: status,
            };
          });
        }

        const absencesInfo = {
          ...activeUser.absences[date + "-info"],
          week_locked: status,
          approved: true,
          attested: true,
        };
        activeUser.absences[date] = absences;
        activeUser.absences[date + '-info'] = absencesInfo;

        if (users[index] && users[index].absences[date]) {

          users[index] = {
            ...users[index],
            absences: {
              ...users[index].absences,
              [date]: absences,
              [date + "-info"]: absencesInfo,
            },
          };

        }

        const moments = {
          ...activeUser.moments[date],
          raportedDayHaveMomentsAndLocked: status,
        };
        activeUser.moments[date] = moments;

        if (users[index] && users[index].moments[date]) {

          users[index] = {
            ...users[index],
            moments: {
              ...users[index].moments,
              [date]: moments,
            },
          };

          /* if (users[index].moments[date].time_qty == 0) {
            delete users[index].moments[date];
            delete activeUser.moments[date];
          } */
        }

        this.ref.detectChanges();

      }

    });
    sub.unsubscribe();
  }

  findActiveUserIndex(users, activeUser) {
    const isActiveUser = (user) => user.id == activeUser.id;
    return users.findIndex(isActiveUser);
  }


  updateAbsences(event) {

    const absences = event.absences;
    const status = event.status;

    const sub = this.users$.subscribe((users)=>{

        const activeUser_:any = this.active.user;

        const userIndex = activeUser_.RowNumber - 1;
        const activeUser = this.allUsers[userIndex];

        if (activeUser) {

          const index = this.findActiveUserIndex(users, activeUser);

          for (let i = 0; i < absences.length; i++) {

            const absence = absences[i];
            const date = absence.date;
            let newUserAbsences: any = [];

            if (status === 3 && activeUser.absences[date]) {
              newUserAbsences = activeUser.absences[date].filter((abs_) => {
                const condition = !absences.some(e => e.uta_id ===  abs_.uta_id);
                return condition;
              });
            }

            if (status === 2) {
              newUserAbsences = activeUser.absences[date].map((abs_) => {
                if (absence.uta_id == abs_.uta_id) {
                  return { ...abs_, status: status, Approved: 0, showMenu: false,
                    raportedDayHaveMomentsAndLocked: true, };
                }
                return abs_;
              });
            }

            const newUserAbsencesObj = {
              ...activeUser.absences,
              [date]: newUserAbsences,
              [`${date}-info`]: {
                ...activeUser.absences[`${date}-info`],
                absence_hour_sum:
                  this.recalculateUserAbsenceHourTotal(newUserAbsences),
                attested_text: "",
              },
            };

            if (newUserAbsences.length === 0) {
              delete newUserAbsencesObj[date];
              delete newUserAbsencesObj[`${date}-info`];
            }

            if (users[index]) {
              users[index] = { ...users[index], absences: newUserAbsencesObj };
            }
            activeUser.absences = newUserAbsencesObj;
            this.detectChanges();
          }
        }



    });
    sub.unsubscribe();
  }

  recalculateUserAbsenceHourTotal(absences) {
    const reducer = (acc, obj) => Number(acc) + Number(obj.absenceHours_decimal);
    const result = absences.reduce(reducer, 0);
    return result;
  }

  public swiper = {
    images: [],
    active: 0,
    album: -2,
  };

  subToGallery() {
    this.openGallerySub = this.chatService.openGallery$.subscribe(({ index, images })=>{
      this.openSwiper(index, images);
    });
  }

  openSwiper(index, images) {
    this.swiper = {
      active: index,
      images: images,
      album: -1,
    };
  }

  async closeSwiper() {
    this.swiper = {
      active: 0,
      images: [],
      album: 1,
    };
    setTimeout(()=>{
      document.body.style.overflow = 'hidden';
    }, 1);
  }

  subToFilterChatMessages() {
    this.filterChatMessagesSub = this.chatService.filterChatMessages$.subscribe((weekId)=>{
      this.filterUserMessages(weekId);
    });
  }

  filterUserMessages(weekId) {

    const sub = this.users$.subscribe((users)=>{
      const activeUser_:any = this.active.user;
      const userIndex = activeUser_.RowNumber - 1;
      const activeUser = this.allUsers[userIndex];

      if (activeUser) {

        const index = this.findActiveUserIndex(users, activeUser);
        if (!activeUser.notSeenWeeks) return;
        const notSeenWeeksFiltered = activeUser.notSeenWeeks.filter((msg)=>{
          return msg.weekId != weekId;
        });
        const len = notSeenWeeksFiltered.length;

        if (users[index]) {
          users[index] = {
            ...users[index],
            notSeenWeeks: notSeenWeeksFiltered,
            messageCount: len
          };
        }

        activeUser.notSeenWeeks = notSeenWeeksFiltered;
        activeUser.messageCount = len;
        this.detectChanges();

      }

    });
    sub.unsubscribe();
  }

}