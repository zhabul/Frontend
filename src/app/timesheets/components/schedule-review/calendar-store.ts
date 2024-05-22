import { Injectable } from "@angular/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import * as moment from "moment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CalendarStore {
  private _dates: BehaviorSubject<any> = new BehaviorSubject([]);

  projects: any = [];
  dataBase: any[] = [];

  constructor(private timesheetService: TimeRegistrationService) {}

  get dates() {
    return this._dates;
  }

  loadDataForDateSpan(first_date, last_date, type) {
    if (type === "detail") {
      this.timesheetService
        .setTimesheetsToCalendar(first_date, last_date)
        .then((res: any) => {
          this._dates.next(res.data);
        });
    } else {
      const userId = JSON.parse(sessionStorage.getItem("userDetails"))[
        "user_id"
      ];
      const shemaProjects = this.timesheetService.getSchemaProjects(
        userId,
        first_date,
        last_date
      );
      const timesheetCalendar = this.timesheetService.setTimesheetsToCalendar(
        first_date,
        last_date
      );

      Promise.all([shemaProjects, timesheetCalendar])
        .then((values) => {
          this.projects = values[0]["data"];
          const timesheet = this.setTimesheetsToCalendar(values[1]["data"]);
          const timesheetProjects = this.generateDateProjects(
            new Date(first_date),
            new Date(last_date)
          );

          timesheet.forEach((x) => {
            delete timesheetProjects[x.StartTime.toISOString().split("T")[0]];
          });

          return timesheet.concat(Object.values(timesheetProjects));
        })
        .then((data: any[]) => {
          this._dates.next(data);
        });
    }
  }

  generateDateProjects(first_date, last_date) {
    const dateProjects = {};

    if (this.projects.length > 0) {
      const currentDate = moment(first_date);
      let maxEndDate = this.projects[0].EndDate;

      this.projects.forEach((project) => {
        if (project.EndDate > maxEndDate) {
          maxEndDate = project.EndDate;
        }
      });

      const endDate = moment(last_date);

      while (currentDate.format("YYYY-MM-DD") <= endDate.format("YYYY-MM-DD")) {
        const currentDateString = currentDate.format("YYYY-MM-DD");

        dateProjects[currentDateString] = {
          Id: currentDateString,
          StartTime: new Date(currentDateString),
          EndTime: new Date(currentDateString),
          isOnlyPreview: true,
          projects: [],
        };

        for (let i = 0, n = this.projects.length; i < n; i++) {
          if (currentDateString > this.projects[i].EndDate) {
            continue;
          }

          if (currentDateString < this.projects[i].StartDate) {
            break;
          }

          if (
            currentDateString >= this.projects[i].StartDate &&
            currentDateString <= this.projects[i].EndDate
          ) {
            dateProjects[currentDateString].projects.push({
              ProjectId: this.projects[i].ProjectID,
              ProjectName:
                this.projects[i].Name.length < 22
                  ? this.projects[i].CustomName + "   " + this.projects[i].Name
                  : this.projects[i].CustomName +
                    "   " +
                    this.projects[i].Name.substring(0, 22) +
                    "...",
              Color: "#fff",
              parentProject: this.projects[i].parentProject,
            });
          }
        }

        currentDate.add(1, "days");
      }
    }
    return dateProjects;
  }

  setTimesheetsToCalendar(serverArray) {
    const newDatabase = [];
    serverArray.forEach((value) => {
      if (value.Type == "Moments") {
        let obj = {
          Id: value.Id,
          StartTime: new Date(value.formatDateT00),
          EndTime: new Date(value.formatDateT00),
          dateRegularFormat: value.dateRegularFormat,
          formatDateT00: value.formatDateT00,
          projects: [
            {
              Subject: value.Subject,
              ProjectId: value.ProjectID,
              Color: value.Color,
              ProjectName: value.ProjectName,
              AtestStatus: value.AtestStatus,
              isAbsence: false,
              parentProject: true,
            },
          ],
        };

        const sameDayIndex = newDatabase.findIndex((x) => x.Id == value.Id);

        if (sameDayIndex != -1) {
          newDatabase[sameDayIndex].projects.push({
            Subject: value.Subject,
            ProjectId: value.ProjectID,
            Color: value.Color,
            ProjectName: value.ProjectName,
            AtestStatus: value.AtestStatus,
            isAbsence: false,
            parentProject: true,
          });
        } else {
          newDatabase.push(obj);
        }
      } else {
        let day = moment(value.dateRegularFormat).format("dddd");

        if (day != "Saturday" && day != "Sunday") {
          let obj = {
            Id: value.Id,
            StartTime: new Date(value.StartTime),
            EndTime: new Date(value.StartTime),
            dateRegularFormat: value.dateRegularFormat,
            projects: [
              {
                Subject: value.Subject,
                ProjectId: value.ProjectID,
                Color: value.Color,
                ProjectName: value.ProjectName,
                isAbsence: true,
                parentProject: true,
              },
            ],
          };

          const sameDayIndex = newDatabase.findIndex(
            (x) => x.dateRegularFormat == value.dateRegularFormat
          );

          if (sameDayIndex != -1) {
            newDatabase[sameDayIndex].projects.push({
              Subject: value.Subject,
              ProjectId: value.ProjectID,
              Color: value.Color,
              ProjectName: value.ProjectName,
              isAbsence: true,
              parentProject: true,
            });
          } else {
            newDatabase.push(obj);
          }
        }
      }
    });
    return newDatabase;
  }
}
