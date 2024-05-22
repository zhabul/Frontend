import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrognosisTabEnterService {
  private activeDuAtaIndex = new BehaviorSubject<{duIndex: number; ataIndex: number;}>({
    duIndex: -1,
    ataIndex: -1
  });
  public activeDuAtaIndex$ = this.activeDuAtaIndex.asObservable();

  constructor() { }

  public setActiveDuIndex(activeDuIndex: number) {
    const oldValues = this.activeDuAtaIndex.getValue();
    let newValues = {...oldValues};
    newValues.duIndex = activeDuIndex;
    this.activeDuAtaIndex.next(newValues);
  }


  public setActiveAtaIndex(activeAtaIndex: number) {
    const oldValues = this.activeDuAtaIndex.getValue();
    let newValues = {...oldValues};
    newValues.ataIndex = activeAtaIndex;
    this.activeDuAtaIndex.next(newValues);
  }
}
