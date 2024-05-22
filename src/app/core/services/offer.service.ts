import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config/index";
import { catchError, of, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OfferService {
  private getAllUrl: string = BASE_URL + "api/offer/list";
  private newOfferUrl: string = BASE_URL + "api/offer/new";
  private searchOfferUrl: string = BASE_URL + "api/offer/status";

  public articles = new Subject<any[]>();
  public makeOffer = new EventEmitter();

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  public getOffers() {
    return this.http
      .get(this.getAllUrl, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public createOffer(offer) {
    return this.http
      .post(this.newOfferUrl, offer, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
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
}
