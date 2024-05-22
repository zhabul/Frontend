import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewBillService {
  private selectedReference = new BehaviorSubject({id: -1, finalName: 'Our Reference'});

  private selectedProjectClientName = new BehaviorSubject(null);
  private selectedProjectWeeklyReportForInvoices = new BehaviorSubject(null)

  public selectedReference$ = this.selectedReference.asObservable();
  public selectedProjectClientName$ = this.selectedProjectClientName.asObservable();
  public selectedProjectWeeklyReportForInvoices$ = this.selectedProjectWeeklyReportForInvoices.asObservable();


  constructor(private http: HttpClient) { }

  getAllProjects() {
    return this.http.get<any[]>('api/invoices/new/all-projects');
  }

  getProject(id: number) {
    return this.http.get<any>(`api/projects/get/${id}`);
  }



  public setSelectedReference(reference) {
    this.selectedReference.next(reference);
  }

  public setSelectedProjectClientName(clienName) {
    this.selectedProjectClientName.next(clienName);
  }

  public setSelectedProjectWeeklyReportForInvoices(project_id) {
    this.selectedProjectWeeklyReportForInvoices.next(project_id);
  }


}
