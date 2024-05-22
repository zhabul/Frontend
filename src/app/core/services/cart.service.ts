import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { BASE_URL } from "src/app/config";
import { Order } from "../models/order";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private getAllUrl: string = BASE_URL + "api/orders/list";
  private getAllByIdUrl: string = BASE_URL + "api/orders/get/list";
  private getOrderUrl: string = BASE_URL + "api/orders/get";
  private newOrderUrl: string = BASE_URL + "api/orders/new";
  private sendOrderEmailUrl: string = BASE_URL + "api/orders/sendOrderEmail";
  private orderUnloadUrl: string = BASE_URL + "api/orders/unload";
  private getEmailUrl: string = BASE_URL + "api/orders/get/emails";
  private updateOrderUrl: string = BASE_URL + "api/orders/set/date";
  private newOrderItemUrl: string = BASE_URL + "api/orders/set/newOrderItem";
  private removeOrderItemUrl: string = BASE_URL + "api/orders/removeOrderItem";
  private removeOrderUrl: string = BASE_URL + "api/orders/removeOrder";
  private sendOrderUrl: string = BASE_URL + "api/orders/sendOrder";

  private totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public orderData: BehaviorSubject<Order> = new BehaviorSubject<Order>(null);

  private showCartIcon: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  getShowCartIcon() {
    return this.showCartIcon.asObservable();
  }

  toggleShowCartIcon() {
    const newShowCartIconValue = !this.showCartIcon.getValue();
    this.showCartIcon.next(newShowCartIconValue);
  }

  getCartItems() {
    return this.totalItems.asObservable();
  }

  updateCartItems(items: number) {
    this.totalItems.next(items);
  }

  public newOrderItem(item) {
    return this.http
      .post(this.newOrderItemUrl, item, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeOrderItem(id) {
    return this.http
      .post(this.removeOrderItemUrl, { itemId: id }, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public getOrders() {
    return this.http.get(this.getAllUrl, { headers: this.headers }).pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return [];
      }),
      catchError(() => [])
    );
  }

  public getOrdersById(projectId: number) {
    return this.http
      .get(`${this.getAllByIdUrl}/${projectId}`, { headers: this.headers })
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

  public getOrder(orderid: number): Observable<any> {
    return this.http
      .get(`${this.getOrderUrl}/${orderid}`, { headers: this.headers })
      .pipe(
        map((response) => {
          if (response["status"]) {
            return response["data"];
          }
          return null;
        })
      );
  }

  public getEmails(): Observable<any> {
    return this.http.get(`${this.getEmailUrl}`, { headers: this.headers }).pipe(
      map((response) => {
        if (response["status"]) {
          return response["data"];
        }
        return null;
      })
    );
  }

  public newOrder(orders) {
    return this.http
      .post(this.newOrderUrl, orders, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public removeOrder(order) {
    return this.http
      .post(this.removeOrderUrl, order, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public sendOrder(order) {
    return this.http
      .post(this.sendOrderUrl, order, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public sendOrderEmail(orderId) {
    return this.http
      .get(`${this.sendOrderEmailUrl}/${orderId}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public updateOrder(id, date) {
    return this.http
      .post(`${this.updateOrderUrl}/${id}/${date}`, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }

  public orderUnload(
    orderDate,
    orderTime,
    supplierId,
    message,
    ordererId,
    status
  ) {
    const data = {
      orderDate,
      orderTime,
      supplierId,
      message,
      ordererId,
      status,
    };

    return this.http
      .post(this.orderUnloadUrl, data, { headers: this.headers })
      .pipe(catchError(() => of({ status: false })));
  }
}
