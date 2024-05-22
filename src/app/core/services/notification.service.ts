import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notificationsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public notifications$: Observable<any[]> = this.notificationsSubject.asObservable();

  constructor(private usersService: UsersService) {}

  startNotificationCheck() {
    const userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));
    this.usersService.getAllNotifications(userDetails.user_id).subscribe((notifications) => {
      this.notificationsSubject.next(notifications);
    });
  }

  get getNumberOfUnseenNotifications() {
    const notifications = this.notificationsSubject.getValue();

    // notifications are ordered so that unseen notifications are first
    for (let i = 0, len = notifications.length; i < len; i++) {
      if (notifications[i].opened !== "0") {
        return i;
      }
    }
    return notifications.length;
  }
}
