import { Injectable } from "@angular/core";
import activeChildKsReducer from './reducers/activeChildKsReducer';
import createWeeklyReportReducer from './reducers/createWeeklyReportReducer';
import activeReportReducer from './reducers/activeReportReducer';

@Injectable({
  providedIn: "root",
})
export class AtaInfoReducers {

    private reducers = {
        activeChildKsReducer,
        createWeeklyReportReducer,
        activeReportReducer
    };
 
    constructor() {}

    public getReducers() {
        return this.reducers;
    }
}