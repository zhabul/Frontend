import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config/index";
import { catchError, map, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private getOrderDateUrl: string = BASE_URL + "api/orders/get/order";
  private getDeliveryUrl: string = BASE_URL + "api/orders/get/delivery";
  private getOrderUrl: string = BASE_URL + "api/orders/get";
  private sendEmailUrl: string = BASE_URL + "api/orders/sendEmail";
  private getOrderAcceptanceCommentsUrl: string =
    BASE_URL + "api/orders/getOrderAcceptanceComments";
  private saveResponseBeforeSendingUrl: string =
    BASE_URL + "api/orders/saveResponseBeforeSending";
  private resolveErrorsInOrderUrl: string =
    BASE_URL + "api/orders/resolveErrorsInOrder";
  private changeOrderStatusUrl: string =
    BASE_URL + "api/orders/changeOrderStatus";

    private headers: HttpHeaders;

    constructor(private http: HttpClient) {
      this.headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      });
    }

  public getOrderDate(orderid) {
    return this.http
      .get(`${this.getOrderDateUrl}/${orderid}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }
  public getDelivery() {
    return this.http
      .get(`${this.getDeliveryUrl}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }
  public getOrder($orderId) {
    return this.http
      .get(`${this.getOrderUrl}/${$orderId}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public sendEmail($data) {
    return this.http
      .post(`${this.sendEmailUrl}`, $data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getOrderAcceptanceComments($orderId) {
    return this.http
      .get(`${this.getOrderAcceptanceCommentsUrl}/${$orderId}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public saveResponseBeforeSending($data) {
    return this.http.post(`${this.saveResponseBeforeSendingUrl}`, $data, {
      headers: this.headers,
    });
  }

  public resolveErrorsInOrder(orderId) {
    return this.http.get(`${this.resolveErrorsInOrderUrl}/${orderId}`, {
      headers: this.headers,
    });
  }

  public changeOrderStatus(orderId, status) {
    return this.http.post(
      this.changeOrderStatusUrl,
      { orderId, status },
      { headers: this.headers }
    );
  }
}
