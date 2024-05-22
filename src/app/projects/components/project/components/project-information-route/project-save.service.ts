import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class ProjectSaveService {
  public wandToSave = new Subject<boolean>();
  public formIsDirty = new Subject<boolean>();

  constructor() {}
}
