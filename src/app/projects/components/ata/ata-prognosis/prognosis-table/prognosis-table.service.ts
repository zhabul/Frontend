import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PrognosisTableService {
  // ovaj prvi je nepotreban
  setProjectPrognos = new Subject<{
    type: string;
    value: number;
    index: number;
  }>();

  onBlurAtaPrognos = new Subject<{
    data: any;
    value: number;
    ataIndex: number;
    projectIndex: number;
  }>();
  updateAtaPrognos = new Subject<{
    data: any;
    value: number;
    projectIndex: number;
    ataIndex: number;
    eventClick: string;
  }>();

  /////////////////////////////

  hasRiktpris: boolean = false;

  // Za novu tabelu
  setPrognosisTotalsByType = new Subject<{
    type: string;
    value: number;
    index: number;
    predicted_data: boolean;
  }>();

  trigetUpdateTotalAtas = new Subject<any>();


saveButtonStatus = new Subject<boolean>();

  /* inputElements: ElementRef[] = [];
  inputElementsId: string[] = []; */



}
