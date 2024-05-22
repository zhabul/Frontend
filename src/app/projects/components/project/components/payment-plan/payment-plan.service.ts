import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PaymentPlanStore {
    private _postPlanEvent$: Subject<any> = new Subject();
    public readonly postPlanEvent$: Observable<any> = this._postPlanEvent$.asObservable();

    constructor() {}

    public nextPost() {
        this._postPlanEvent$.next(true);
    }
}