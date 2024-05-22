import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from "@ngx-translate/core";
//import { TimeRegistrationService } from 'src/app/core/services/time-registration.service';
import { UsersService } from "src/app/core/services/users.service";

@Component({
  selector: 'app-payroll-user-list',
  templateUrl: './payroll-user-list.component.html',
  styleUrls: [
    './payroll-user-list.component.css',
    '../../../time-registration-admin/user-details-admin/user-details-admin.component.css'
  ]
})
export class PayrollUserListComponent implements OnInit {

  public date;
  @Input('date') set setDate(value) {
    if (this.date !== value) {
      this.date = value;
      this.getUserData();
    }
  };
  public selectedType;
  @Input('selectedType') set setSelectedType(value) {
    if (this.selectedType !== value) {
      this.selectedType = value;
      this.filterByType();
    }
  };
  @ViewChild('wrapper') wrapper;
  @Output('checkedUsersListener') checkedUsersListener: EventEmitter<any[]> = new EventEmitter();

  constructor(
   // private timeRegistrationService: TimeRegistrationService,
    private translate: TranslateService,
    private usersService: UsersService,
    ) { }

  ngOnInit(): void {
    this.toggleBodyScroll("hidden");
    this.setResize();
  }

  toggleBodyScroll(scroll) {
    document.getElementsByTagName("body")[0].style.overflow = scroll;
  }

  public numberWithLine = '';
  setNumberWithLine() {
    let nr = this.translate.instant('CUD_Nr');
    nr = nr.length > 12 ? this.insertLine(nr) : nr;
    this.numberWithLine = nr;
  }

  insertLine(nr) {
    return [nr.slice(0, 12), '-', nr.slice(12)].join('')
  }

  ngOnChanges() {

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.toggleBodyScroll("auto");
    this.removeResizeEvent();
  }

  /* users */

  public spinner= false;
  public allUsers = [];
  public users = [];

  async getUserData() {
    if (this.spinner) return;
    const startDate = moment(this.date).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
  /*  const object = {
      first_date: startDate,
      last_date: endDate,
      offset: 0,
      searchValue: '',
      projectId: 0,
      fetched: 0,
      limit: 999999
    };
  */
    this.spinner = true;
    this.allUsers = [];
    this.users = [];
    //const res:any = await this.timeRegistrationService.getUsersWithMoments(object).toPromise2();
    const res:any = await this.usersService.getAllUsersWIthoutLimit(startDate, endDate).toPromise2();
    this.users = res['data'];
    this.allUsers = this.users;
    this.spinner = false;
    this.filterUsersBySearchValue();
    this.emitCheckedUsers();
    setTimeout(()=>{
      this.setNumberWithLine();
    }, 500);
  }

  public allSelected = true;
  toggleSelectedUsers(value) {
    this.allSelected = value;
    this.checkUsersBasedOnAllSelected();
    this.emitCheckedUsers();
  }

  checkUsersBasedOnAllSelected() {
    this.allUsers = this.allUsers.map((user)=>{
      return { ...user, checked: this.allSelected };
    });
    this.users = this.users.map((user)=>{
      return { ...user, checked: this.allSelected };
    });
  }

  filterByType() {
    this.filterUsersBySearchValue();
    if (!this.selectedType.length) {
      return;
    }
    this.filterUserByTypename();
  }

  filterUserByTypename() {
    this.users = this.users.filter((user)=>{
      return this.selectedType.find((type) => type.value.toLowerCase().trim() == user.type.toLowerCase().trim());
    });
    this.emitCheckedUsers();
  }

  public personalStatsSub;
  public headerGrid = {};

  setTranslateXForHeader(scrollLeft) {
    this.headerGrid = {
      ...this.headerGrid,
      transform: `translate3d(-${scrollLeft}px, 0px, 0px)`,
      position: 'relative'
    };
  }

  /* users */
  /* searchValue */

  public searchValue = '';
  setSearchValue(value) {
    this.searchValue = value;
    this.filterUsersBySearchValue();
  }

  filterUsersBySearchValue() {
    this.users = this.allUsers.filter((user)=>{
      const name = `${user.firstName} ${user.lastName}`.toLowerCase();
      return name.includes(this.searchValue);
    });
    this.emitCheckedUsers();
  }

  /* searchValue */

    /* right line styling */

  public rightLineStyles = {}
  setRightLineHeight() {
    const el = this.wrapper.nativeElement;
    const rect = el.getBoundingClientRect();
    const height = `${rect.height}px`;
    this.rightLineStyles = { height: height, bottom: '7px' };
  }

  /* right line styling */
  public resizeEvent;

  setResize() {
    this.resizeEvent = this.setRightLineHeight.bind(this);
    window.addEventListener('resize', this.resizeEvent);
  }

  removeResizeEvent() {
    window.removeEventListener('resize', this.resizeEvent);
  }

  setUserChecked(value, user) {
    this.updateCheckedUser(user, value);
    this.emitCheckedUsers();
  }

  updateCheckedUser(user, value) {
    this.allUsers = this.allUsers.map( user_ => this.checkUser(user, user_, value));
    this.users = this.users.map(user_ => this.checkUser(user, user_, value));
  }

  checkUser(user, user_, value) {
    if (user.id == user_.id) {
      return { ...user_, checked: value };
    }
    return user_;
  }

  emitCheckedUsers() {
    this.checkedUsersListener.emit(this.users.filter(user => user.checked))
  }

}
