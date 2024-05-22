import { Injectable } from "@angular/core";
import {
  Resolve,
  //ActivatedRouteSnapshot,
  //RouterStateSnapshot,
} from "@angular/router";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { UsersService } from "src/app/core/services/users.service";
import * as moment from "moment";

@Injectable()
export class getUsersWithMomentsService implements Resolve<any> {
  constructor(
    private timeRegService: TimeRegistrationService,
    private usersService: UsersService
  ) {}

  resolve(
   // route: ActivatedRouteSnapshot,
    //state: RouterStateSnapshot
  ): Promise<any> {

    //const queryParams = route.queryParams;
    //const date = queryParams.date ? this.selectDate(new Date(queryParams.date)) : this.selectDate(new Date());
    //const searchValue = queryParams.s ? queryParams.s : '';
    //const projectId_ = Number(queryParams.projectId); 
    //const projectId = isNaN(projectId_) ? 0 : projectId_;
    //const fetched_ = Number(queryParams.fetched);
    //const fetched = isNaN(fetched_) ? moment(date).daysInMonth() : fetched_;
    // { first_date, last_date } = this.resolveCurrentDayProblem(date, fetched);
    //const offset = 0;
/*
    const promise1 = this.timeRegService.getUsersWithMoments({

      first_date, 
      last_date,
      offset,
      searchValue,
      projectId,
      limit: 25

    }).toPromise2();*/
    const promise2 = this.usersService.getUserPermissionTabs().toPromise2();
    const promise3 = this.timeRegService.getAbsenceTypes().toPromise2();
    return Promise.all([promise2, promise3]);
  }

  fetchedMonth(fetched) {
    return (
      fetched != 14 &&
      fetched != 28.1 &&
      fetched != 42 &&
      fetched != 56
    );
  } 

  resolveCurrentDayProblem(date, fetched) {

    const momentDate = moment(date);
    let first_date;
    let last_date;

    if (this.fetchedMonth(fetched)) {
      const monthYear = moment(date).format("MM-YYYY");
      first_date =
        monthYear.split("-")[1] + "-" + monthYear.split("-")[0] + "-01";
        last_date =
        monthYear.split("-")[1] + 
        "-" +
        monthYear.split("-")[0] +
        "-" +
        momentDate.daysInMonth();
      return { first_date, last_date };
    }

    first_date = this.firstDayOfCalendarWeeks(momentDate);
    last_date = this.lastDayOfCalendarWeeks(
      moment(first_date).add(fetched, "days")
    );
    return { first_date, last_date };
  }

  calculateLastWeek(firstDay) {
    let lastWeek = firstDay.isoWeek() - 2;

    if (lastWeek < 1) {
      const firstDay_ = moment(firstDay).subtract(60, "days");
      lastWeek = firstDay_.isoWeeksInYear();
    }
    return lastWeek;
  }

  firstDayOfCalendarWeeks(firstDay) {
    const lastWeek = this.calculateLastWeek(firstDay); 
    const firstDay2 = moment(firstDay.format("YYYY-MM-DD"));
    let numberOfDayToSubtract = -1;
    while (true) {
      if (firstDay2.isoWeek() !== lastWeek) {
        firstDay2.subtract(1, "days");
        numberOfDayToSubtract = numberOfDayToSubtract + 1;
        continue;
      }

      if (numberOfDayToSubtract === -1) {
        numberOfDayToSubtract = 0;
      }
      break;
    }
    firstDay.subtract(numberOfDayToSubtract, "days");
    return firstDay.format("YYYY-MM-DD");
  }

  lastDayOfCalendarWeeks(lastDay) {
    const lastWeek = lastDay.isoWeek();
    const lastDay2 = moment(lastDay.format("YYYY-MM-DD"));
    let numberOfDayToAdd = -1;
    let index = 0;
    while (true) {
      if (lastDay2.isoWeek() === lastWeek) {
        numberOfDayToAdd = numberOfDayToAdd + 1;
        index = index + 1;
        lastDay2.add(1, "days");
        continue;
      }
      if (numberOfDayToAdd === -1) {
        numberOfDayToAdd = 0;
      }
      break;
    }
    lastDay.add(numberOfDayToAdd, "days");
    return lastDay.format("YYYY-MM-DD");
  }

  selectDate(date) {

    const eventDate = moment(date).format('YYYY-MM');
    const currentDate = moment(new Date()).format('YYYY-MM');

    if (eventDate === currentDate) {
      date = new Date();
    }

    return date;
  }
}