import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "src/app/config";
import { of, catchError, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PaymentPlanService {
  private deleteTableRow: string = BASE_URL + "api/payments/remove/";
  private deleteMonth: string = BASE_URL + "api/payments/month/remove/";
  private getDetails: string = BASE_URL + "api/payments/get/";
  private postDetails: string = BASE_URL + "api/payments/new";
  private ProdjectInfo: string = BASE_URL + "api/projects/get/";
  private clientWorkers: string =
    BASE_URL + "api/projects/getAttestClientWorkers/";
  private sendPaymentPlanUrl: string =
    BASE_URL + "api/payments/sendPaymentPlanToClient";
  private getStatus: string = BASE_URL + "api/payments/getPaymentPlanStatuses";
  private getActivities: string =
    BASE_URL + "api/payments/activities/getProjectActivities/";
  private printPaymentPlanUrl: string =
    BASE_URL + "api/payments/printPaymentPlan";
  private getEmailLogsForPPUrl: string =
    BASE_URL + "api/payments/getEmailLogsForPaymentPlan/";
  private answerOnPaymentPlanEmailUrl: string =
    BASE_URL + "api/payments/answerOnPaymentPlanEmail/";
  private confirmPaymentPlanStatusUrl: string =
    BASE_URL + "api/payments/confirmPaymentPlanStatus";
  private manuallyAcceptPaymentPlanUrl: string =
    BASE_URL + "api/payments/manuallyAcceptPaymentPlan/";
  private manuallyRejectPaymentPlanUrl: string =
    BASE_URL + "api/payments/manuallyRejectPaymentPlan/";
  private manuallyCancelPaymentPlanUrl: string =
    BASE_URL + "api/payments/manuallyCancelPaymentPlan/";
  private emailWorkers: string =
    BASE_URL + "api/payments/answerOnPaymentPlanEmail/";
  private newRevisionUrl: string = BASE_URL + "api/payments/newRevision";
  private confirmStatus: string =
    BASE_URL + "api/payments/confirmPaymentPlanStatus";
  private lockPaymentPlanUrl: string =
    BASE_URL + "api/payments/lockPaymentPlan";
  private updatePaymentPlanCommentUrl: string =
    BASE_URL + "api/payments/updatePaymentPlanComment";
  private postCommentSection: string =
    BASE_URL + "api/payments/createPaymentPlanComment";
  private deleteCommentSection: string =
    BASE_URL + "api/payments/removePaymentPlanComment/";
  private commentSectionData: string =
    BASE_URL + "api/payments/getPaymentPlanComment/";
  private sortArticlesUrl: string = BASE_URL + "api/payments/sortArticles";
  private getAcceptedPaymentPlanUrl: string =
    BASE_URL + "api/payments/getAcceptedPaymentPlanForInvoice";
  private getCommentName: string =
    BASE_URL + "api/payments/getPaymentPlanComment/paymentplan/";
  public postNamee: string =
    BASE_URL + "api/payments/createPaymentPlanComment/paymentplan";
  private getPaymentPlanArticlesIfInvoiceUrl: string =
    BASE_URL + "api/payments/getPaymentPlanArticlesIfInvoice";
  private removeSelectedImagesUrl: string =
    BASE_URL + "api/payments/removeSelectedImages";
  private removeSelectedFileUrl: string =
    BASE_URL + "api/payments/removeSelectedFile";
  private getSumOfArrerarsUrl: string =
    BASE_URL + "api/payments/getSumOfArrerars";

private headers: HttpHeaders;

constructor(private http: HttpClient) {
  this.headers = new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
  });
}

  //Fill payment plan data
  getProjectData(id: number) {
    return this.http.post(this.getDetails + id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  getClientWorkers(id: number) {
    return this.http.get(this.clientWorkers + id)
    .pipe(catchError(() => of({ status: false })));
  }

  savePaymentData(obj) {
    return this.http.post(this.postDetails, obj, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  updatePaymentData(obj) {
    return this.http
      .post(this.postDetails, obj, { headers: this.headers }).toPromise2();
      // .pipe(catchError(() => of({ status: false })));
  }

  //Delete row DELETE
  deleteRow(groupid: number, articleid: number, paymentplanid: number) {
    return this.http.delete(this.deleteTableRow + groupid + '/' + articleid + '/' + paymentplanid )
    .pipe(catchError(() => of({ status: false })));
  }

  //Delete month DELETE
  deleteTheMonth(id: number, paymentplanid: number) {
    return this.http.delete(this.deleteMonth + id + '/' + paymentplanid )
    .pipe(catchError(() => of({ status: false })));
  }

  //Get Name of project GET
  getNameOfProject(id: number) {
    return this.http.get(this.ProdjectInfo + id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //Send to email pdf POST
  sendPaymentPlanToClient(contacts, paymentplan, project) {
    const data = {
      contacts: contacts,
      paymentplan: paymentplan,
      project: project,
    };

    return this.http
      .post(this.sendPaymentPlanUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //Get status GET
  getPaymentPlanStatuses() {
    return this.http.get(this.getStatus, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //Get activities GET
  getPaymentPlanActivities(id: number) {
    return this.http.get(this.getActivities + id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //Print pdf //POST
  printPaymentPlanToClient(paymentplan, project) {
    const data = {
      paymentplan: paymentplan,
      project: project,
    };

    return this.http
      .post(this.printPaymentPlanUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //E-mail logs GET
  getEmailLogsForPP(id) {
    return this.http
      .get(this.getEmailLogsForPPUrl + id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //email link GET
  answerOnPaymentPlanEmail(
    email,
    paymentplanID,
    parentPaymentplanId,
    token,
    CwId,
    group
  ) {
    return this.http
      .get(
        this.answerOnPaymentPlanEmailUrl +
          email +
          "/" +
          paymentplanID +
          "/" +
          parentPaymentplanId +
          "/" +
          token +
          "/" +
          CwId +
          "/" +
          group,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  //Confirm PP status POST
  confirmPaymentPlanStatus(data) {
    return this.http
      .post(this.confirmPaymentPlanStatusUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //Manually accept PP
  manuallyAcceptPaymentPlan(id) {
    return this.http
      .get(this.manuallyAcceptPaymentPlanUrl + id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //Manually reject PP
  manuallyRejectPaymentPlan(id, from) {
    return this.http
      .get(this.manuallyRejectPaymentPlanUrl + id + '/' + from, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //Manually cancel PP
  manuallyCancelPaymentPlan(id) {
    return this.http
      .get(this.manuallyCancelPaymentPlanUrl + id, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //Post email form to pdf preview
  postEmail(data: any) {
    return this.http.post(this.confirmStatus, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //Get email form to pdf preview
  getEmail() {
    return this.http.get(this.emailWorkers, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //New revision POST
  newRevision(data) {
    return this.http.post(this.newRevisionUrl, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //After save user can lock payment plan POST
  lockPaymentPlan(projectid, paymentplanid, contractAmount) {
    const data = {
      paymentplanid: paymentplanid,
      projectid: projectid,
      contractAmount: contractAmount
    };

    return this.http
      .post(this.lockPaymentPlanUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  updatePaymentPlanComment(data) {
    return this.http
      .post(this.updatePaymentPlanCommentUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //COMMENT SECTINON
  //POST
  postComment(data: any) {
    return this.http
      .post(this.postCommentSection, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //Post name
  getName(id: number): Observable<any> {
    return this.http.get(this.getCommentName + id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  postName(data: any) {
    return this.http.post(this.postNamee, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false })));
  }

  //DELETE
  deleteComment(data: any) {
    return this.http
      .post(this.deleteCommentSection + data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  //GET
  getTheComments(id: number, content_type: string) {
    return this.http
      .get(`${this.commentSectionData}${content_type}/${id}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  sortArticles(articles): Promise<any> {
    return this.http
      .post(this.sortArticlesUrl, articles, { headers: this.headers })
      .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  getAcceptedPaymentPlan(project_id) {
    return this.http
      .get(`${this.getAcceptedPaymentPlanUrl}/${project_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getSumOfArrerars(projectId, invoice_id) {
    return this.http
      .get(`${this.getSumOfArrerarsUrl}/${projectId}/${invoice_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  getPaymentPlanArticlesIfInvoice(paymentplan_id) {
    return this.http
      .get(`${this.getPaymentPlanArticlesIfInvoiceUrl}/${paymentplan_id}`, {
        headers: this.headers,
      })
      .pipe(catchError(() => of({ status: false })));
  }

  removeSelectedImages(data) {
    return this.http.post(this.removeSelectedImagesUrl, data, {
      headers: this.headers,
    });
  }

  removeSelectedFile(data) {
    return this.http.post(this.removeSelectedFileUrl, data, {
      headers: this.headers,
    });
  }
}
