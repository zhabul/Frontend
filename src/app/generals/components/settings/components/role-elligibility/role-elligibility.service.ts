import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})

export class RoleElligibilityService {
    permitChange = new Subject<Object>();

    constructor() {}

    setPremissions(data) {
        this.permitChange.next(data);
    }

    getPremissions() {
        return this.permitChange.asObservable();
    }
}
