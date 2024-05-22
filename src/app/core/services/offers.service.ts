import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config/index";
import { BehaviorSubject, catchError, map, of, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OffersService {
  private getAllUrl: string = BASE_URL + "api/offers/list";
  private getAllAcceptedUrl: string = BASE_URL + "api/offers/listAccepted";
  private getAllClientResponsesUrl: string = BASE_URL + "api/offers/getAllClientResponses/";
  private getOfferUrl: string = BASE_URL + "api/offers/get";

  private newOfferUrl: string = BASE_URL + "api/offers/new";
  private searchOfferUrl: string = BASE_URL + "api/offers/status";
  private getOfferByClientUrl: string = BASE_URL + "api/getOfferByClient/list";

  private getOfferPdfUrl=BASE_URL+"api/offers/getPdf/"
  private updateOfferUrl: string = BASE_URL + "api/offers/update";
  private getOfferByIdUrl: string = BASE_URL + "api/offerById/list";
  private checkIfOfferNumberIsTakenUrl: string =
    BASE_URL + "api/offers/checkIfOfferNumberIsTaken";
  private deleteOfferByIdUrl: string = BASE_URL + "api/offers/deleteOfferById";
  private getNextOfferNumberUrl: string =
    BASE_URL + "api/offers/getNextOfferNumber";

  public articles = new Subject<any[]>();
  public makeOffer = new EventEmitter();
  public saveDisabled = new BehaviorSubject<boolean>(true);
  public currentTabRememberer: number = 1;

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }


  private getAllTemplatesUrl: string = BASE_URL + "api/offers/templateList";
  public getOfferTemplates() {
    return this.http.get(this.getAllTemplatesUrl, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private manuallyAcceptOfferUrl: string = BASE_URL + "api/offers/manuallyAcceptOffer";
  public manuallyAcceptOffer(data):any {
    return this.http.post(`${this.manuallyAcceptOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private manuallyRejectOfferUrl: string = BASE_URL + "api/offers/manuallyRejectOffer";
  public manuallyRejectOffer(data):any {
    return this.http.post(`${this.manuallyRejectOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private manuallyRevisionOfferUrl: string = BASE_URL + "api/offers/manuallyRevisionOffer";
  public manuallyRevisionOffer(data):any {
    return this.http.post(`${this.manuallyRevisionOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private manuallyAbortOfferUrl: string = BASE_URL + "api/offers/manuallyAbortOffer";
  public manuallyAbortOffer(data):any {
    return this.http.post(`${this.manuallyAbortOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private acceptOfferUrl: string = BASE_URL + "api/offers/acceptOffer";
  public acceptOffer(data):any {
    return this.http.post(`${this.acceptOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private rejectOfferUrl: string = BASE_URL + "api/offers/rejectOffer";
  public rejectOffer(data):any {
    return this.http.post(`${this.rejectOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private revisionOfferUrl: string = BASE_URL + "api/offers/revisionOffer";
  public revisionOffer(data):any {
    return this.http.post(`${this.revisionOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private answerOfferUrl: string = BASE_URL + "api/offers/answerOffer";
  public answer(data):any {
    return this.http.post(`${this.answerOfferUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private deleteOfferUrl: string = BASE_URL + "api/offers/deleteOffer";
  public deleteOffer(id):any {
    return this.http.post(`${this.deleteOfferUrl}`, id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private createOfferFromTemplateUrl: string = BASE_URL + "api/offers/createOfferFromTemplate";
  public createOfferFromTemplate(id):any {
    return this.http.post(`${this.createOfferFromTemplateUrl}`, id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private getOfferForApprovalUrl: string = BASE_URL + "api/offers/getOfferForApproval";
  public getOfferForApproval(data):any {
    return this.http.get(`${this.getOfferForApprovalUrl}/${data.id}/${data.email}/${data.group}`, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private sendOfferUrl: string = BASE_URL + "api/offers/sendOffer";
  public sendOffer(id):any {
    return this.http.post(`${this.sendOfferUrl}`, id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private sendOfferDraftUrl: string = BASE_URL + "api/offers/sendOfferDraft";
  public sendOfferDraft(id):any {
    return this.http.post(`${this.sendOfferDraftUrl}`, id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private uploadOfferFilesUrl: string = BASE_URL + "api/offers/uploadFiles";
  public uploadOfferFiles(data):any {
    return this.http.post(`${this.uploadOfferFilesUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false, data: [] }))).toPromise2();
  }

  private getOfferFilesUrl: string = BASE_URL + "api/offers/getFiles";
  public getOfferFiles(id):any {
    return this.http.get(`${this.getOfferFilesUrl}/${id}`, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private removeFileUrl: string = BASE_URL + "api/offers/removeFile";
  public removeFile(id) {
    return this.http.post(`${this.removeFileUrl}`, id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private removeArticleUrl: string = BASE_URL + "api/offers/removeArticle";
  public removeArticle(id) {
    return this.http.post(`${this.removeArticleUrl}`, id, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private getLinesUrl: string = BASE_URL + "api/offers/getLines";
  public getLines(id) {
    return this.http.get(`${this.getLinesUrl}/${id}`, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private removeLinesUrl: string = BASE_URL + "api/offers/removeLines";
  public removeLines(data) {
    return this.http.post(`${this.removeLinesUrl}`, data, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  private saveLinesUrl: string = BASE_URL + "api/offers/saveLines";
  public saveLines(lines) {
    return this.http.post(`${this.saveLinesUrl}`, lines, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getOffers() {
    return this.http.get(this.getAllUrl, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }

  public getAcceptedOffers() {
    return this.http.get(this.getAllAcceptedUrl, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }


  public getAllClientResponses(offerId) {
    return this.http.get(`${this.getAllClientResponsesUrl}${offerId}`, { headers: this.headers })
    .pipe(catchError(() => of({ status: false }))).toPromise2();
  }


  public getOfferId(projectId) {
    return this.http
      .get(`${this.getOfferByIdUrl}/${projectId}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }
  public getOfferByClient(clientId) {
    return this.http
      .get(`${this.getOfferByClientUrl}/${clientId}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      );
  }

  public getOffer(offerid: number) {
    return this.http
      .get(`${this.getOfferUrl}/${offerid}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return [];
        }),
        catchError(() => [])
      ).toPromise2();;
  }

  public createOffer(offer) {
    console.log(offer)
    return this.http
      .post(this.newOfferUrl, offer, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })))
      .toPromise2();
  }

  public updateOffer(offer) {
    return this.http
      .post(this.updateOfferUrl, offer, { headers: this.headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  public getOfferPdf(offerId) {
    return this.http.get(`${this.getOfferPdfUrl}${offerId}`)
  }



  public searchByStatus(date, status, person, search_text) {
    return this.http
      .get(
        `${this.searchOfferUrl}/${status}/${date}/${person}/${search_text}`,
        { headers: this.headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }

  setArticles(data) {
    this.articles.next(data);
  }

  get getCurrentTab() {
    return this.currentTabRememberer;
  }

  setCurrentTab(where) {
    this.currentTabRememberer = where;
  }

  checkIfOfferNumberIsTaken(number) {
    return this.http
      .get(`${this.checkIfOfferNumberIsTakenUrl}/${number}`, {
        headers: this.headers,
      })
      .toPromise();
  }

  deleteOfferById(id) {
    return this.http
      .get(`${this.deleteOfferByIdUrl}/${id}`, { headers: this.headers })
      .toPromise();
  }

  getNextOfferNumber() {
    return this.http
      .get(this.getNextOfferNumberUrl, { headers: this.headers })
      .toPromise();
  }
}
