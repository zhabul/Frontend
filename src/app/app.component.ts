import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { InitProvider } from "./initProvider";
import { TranslateService } from "@ngx-translate/core";
import { CartService } from "./core/services/cart.service";
import { Order } from "./core/models/order";
import { UserOptionsService } from "./core/services/user-options.service";
import { UsersService } from "./core/services/users.service";
import { ProjectsService } from "./core/services/projects.service";
import { NotificationService } from "./core/services/notification.service";
import { ToastrService } from "ngx-toastr";
import { GeneralsService } from "./core/services/generals.service";
import { environment } from "../environments/environment";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SupportModalComponent } from "./shared/modals/support-modal/support-modal/support-modal.component";
import { interval, Subscription } from "rxjs";
import { CronService } from "src/app/core/services/cron.service";
import { AtaService } from "src/app/core/services/ata.service";
import { ComponentAccessService } from "./core/services/component-access.service";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { NotSeenMessagesService } from './not-seen-messages.service';
import * as moment from "moment";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  idleState = "NOT_STARTED";
  countdown?: number = null;
  lastPing?: Date = null;
  public userDetails: any;
  public isLoggedIn = false;
  public loading = false;
  public orderData: Order;
  public cartItemsCount = 0;
  private checkUserInterval: any;
  public siteIsDown = false;

  public notifications: any[] = [];
  public showNotifications = false;
  public unseenNotifications = 0;
  public filePath: string;
  public generalsFile: any;
  subscription: Subscription;
  subscription2: Subscription;
  subscriptionAtest: Subscription;
  subscriptionAtest2: Subscription;
  subscriptionForResetTimer: Subscription;
  public currentUrl: any = window.location.hash.split("#")[1];
  public allowEditAta: boolean = true;
  public allowEditAtest: boolean = true;
  public checkIfSiteIsDownInterval;
  public hideSidebar = false;
  public lang: any = sessionStorage.getItem("lang");
  public maintenance_info;
  translations: any = {};
  translateSub: any;
  public covert_type = "minutes";
  AtaPrognosisComponent: any;
  notSeenMessageSub;
  messageCount = 0;
  public notificationForDelete = new Map<number, boolean>();
  public changeRed: boolean = false;
  public allDelete: boolean = false;
  public date_time: any;

    constructor(
        private projectService: ProjectsService,
        private usersService: UsersService,
        private userOptionsService: UserOptionsService,
        private authService: AuthService,
        private router: Router,
        public initProvider: InitProvider,
        private cartService: CartService,
        private translate: TranslateService,
        private notificationService: NotificationService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private generalsService: GeneralsService,
        private cronService: CronService,
        private ataService: AtaService,
        public cd: ChangeDetectorRef,
        private componentAccessService: ComponentAccessService,
        private idle: Idle,
        private notSeenMessagesService: NotSeenMessagesService,
        keepalive: Keepalive,
        private AESEncryptDecryptService: AESEncryptDecryptService
    ) {
        /*console.log(window.location.href)

        if (!window.location.href.match(/\/#/)) {
           window.location.href = window.location.origin + '/#' + window.location.pathname + window.location.search;
        }*/


        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        translate.setDefaultLang('sw');
        router.events.subscribe((routerEvent) => {
            this.checkRouterEvent(routerEvent);
            this.currentUrl = window.location.hash.split("#")[1];
            if (this.currentUrl && this.currentUrl.includes("/external/")) {
                this.hideSidebar = true;
            }else {
              this.hideSidebar = false;
          }
        });
        let data = {
          key: "Automatic logout",
        };

        /***************************idle ******************************************************/
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active
        //ensure reset time if registred events( mov/click mouse, keywords)
        idle.onIdleEnd.subscribe(() => {
            this.idleState = "NOT_IDLE";
            this.countdown = null;
            cd.detectChanges(); // how do i avoid this kludge?
        });
        // ensure logout if not registred events
        idle.onTimeout.subscribe(() => {
            this.countdown = null;
            if(this.userDetails.allow_logout) {
              this.logout();
            }else {
              window.location.reload()
            }
            this.idleState = "TIMED_OUT";
        });
        // do something as the timeout countdown does its thing
        idle.onTimeoutWarning.subscribe((seconds) => (this.countdown = seconds));

        // set keepalive parameters, omit if not using keepalive
        keepalive.interval(15); // will ping at this interval while not idle, in seconds
        keepalive.onPing.subscribe(() => (this.lastPing = new Date())); // do something when it pings
        /***************************idle ******************************************************/

        this.generalsService.getSingleGeneralByKey(data).subscribe((res) => {
            if (res["status"]) {
                let value = Number(res["data"][0]["value"]) * 60;
                let three_minutes = Number(res["data"][1]["value"]) * 60;
                // set idle parameters
                idle.setIdle(value); // how long can they be inactive before considered idle, in seconds
                idle.setTimeout(three_minutes); // how long can they be idle before considered timed out, in seconds
                this.resetTime();
            }
        });

        document.onkeyup = function (e) {
            if (e.ctrlKey && e.altKey && e.key === "c") {
                // CTRL + ALT + c
                let lang = sessionStorage.getItem("lang");

                if (lang === "en") {
                    translate.use("sw");
                    sessionStorage.setItem("lang", "sw");
                } else if (lang === "sw") {
                    translate.use("en");
                    sessionStorage.setItem("lang", "en");
                } else {
                    translate.use("hr");
                    sessionStorage.setItem("lang", "hr");
                }
                toastr.success(
                    translate.instant("Successfully updated language") + ".",
                    translate.instant("Success")
                );
            }
        };

        authService.userStatus.subscribe(async (res) => {
            if (res) {
                await this.userCheck();
                this.notificationService.startNotificationCheck();
                if (environment.production) {
                    this.checkUserInterval = setInterval(() => {
                        if (this.initProvider.isLoggedIn) {
                          this.userCheck();
                          this.notificationService.startNotificationCheck();
                        }
                    }, 5000);
                }
            } else {
                clearInterval(this.checkUserInterval);
                this.countdown = null;
                this.authService.logoutUser();
                if (localStorage.getItem("isApp") != undefined) {
                    window.location.href = "http://app.action.logout/";
                }
            }
        });
        this.cartService.getCartItems().subscribe((x) => {
            this.cartItemsCount = x;
        });
    }

    @HostListener('window:mousemove') refreshUserState() {

      if(this.userDetails) {

        let new_date_time = moment().format("YYYY-MM-DD HH:mm");
        let momentInTimeFromDB = moment(this.date_time).add(5,'minutes').format("YYYY-MM-DD HH:mm");

        if(new_date_time > momentInTimeFromDB) {
          this.authService.setUserLoginTime().subscribe();
              this.date_time = moment(new_date_time).add(5,'minutes').format("YYYY-MM-DD HH:mm");
              momentInTimeFromDB = this.date_time;
        }
      }
    }

    resetTime() {
        // ensure reset time if we need
        this.idle.watch();
        this.idleState = "NOT_IDLE";
        this.countdown = null;
        this.lastPing = null;
    }

    ngOnInit() {
        //if (environment.production) {
          this.resetTime();
        //}
        this.checkIfSiteIsDown();
        const source = interval(2000);
        let ataResult;
        let atestResult;
        this.lang = sessionStorage.getItem("lang");
        this.subscriptionForResetTimer = this.authService
          .getTimerStatus()
          .subscribe((result) => {
            if (result && environment.production) {
              this.resetTime();
            }
          });

        this.subscription = this.cronService.getObject().subscribe((result) => {
          ataResult = result;
        });

        this.subscriptionAtest = this.cronService.getAtest().subscribe((result) => {
          atestResult = result;
        });

        this.subToMessageCount();
        this.notSeenMessagesService.getNotSeenMessages();

        this.subscription2 = source.subscribe((val) => {

          if (ataResult) {
            let object = this.returnObject(ataResult);
            this.allowOrDisableEditAta(object);
          }

          if (atestResult) {
            let object = this.returnObject(atestResult);
            this.allowOrDisableEditAtest(object);
          }
        });

        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

        if (this.userDetails) {
          this.userOptionsService.userDetailsConfig.next(this.userDetails);

          this.notificationService.startNotificationCheck();

          if (environment.production) {
            setInterval(() => {
              this.checkIfSiteIsDown();
              this.maintenance_time();
            }, 10000);

            if (this.initProvider.isLoggedIn) {
              this.checkUserInterval = setInterval(() => {
                this.notificationService.startNotificationCheck();
              }, 5000);
            }
          }
        }

        if (this.isLoggedIn) {
          this.authService.setProjectRoute();
        }

        this.translateSub = this.translate
          .getTranslation(this.lang)
          .subscribe((res) => {
            this.translations = res;
            this.notificationService.notifications$.subscribe((notifications) => {
              this.unseenNotifications = this.notificationService.getNumberOfUnseenNotifications;
              this.notifications = notifications.map((notification) => {
                return this.translateNotification(notification);
              });
            });
          });

        this.orderData = JSON.parse(sessionStorage.getItem("orderData"));

        if (this.orderData) {
          this.cartService.updateCartItems(this.orderData.items.length);
        }
        this.userOptionsService.userDetailsConfig.next(this.userDetails);
        this.seeIfMaintenanceIsOn(this.lang);
        this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        this.date_time = this.userDetails?.login_time;//moment().format("YYYY-MM-DD HH:mm");
    }

  subToMessageCount() {
    this.notSeenMessageSub = this.notSeenMessagesService.messageCount$.subscribe((count)=>{
      this.messageCount = count;

    })
  }

  seeIfMaintenanceIsOn(lang) {
    lang ? "" : (lang = "sw");

    const maintenance_time =
      this.initProvider.hasComponentAccess("maintenance_time");

    if (maintenance_time) {
      this.maintenance_info = {
        time: this.initProvider.hasComponentAccess("m_time"),
        date: this.initProvider.hasComponentAccess("m_date"),
        text: this.initProvider.hasComponentAccess("m_text")[lang],
      };
    }
  }

  translateNotification(notification) {
    const type = notification.type;

    switch (type) {
      case "Tidrapport":
        notification.project = notification.project.replace(
          "Timesheets",
          this.translate.instant("Timesheets")
        );
        notification.message = notification.message.replace(
          "Timesheets",
          this.translate.instant("Timesheets")
        );
        notification.message = notification.message.replace(
          "Comment",
          this.translate.instant("Comment")
        );
        notification.message = notification.message.replace(
          "Your absence request was accepted.",
          this.translate.instant("Your absence request was accepted.")
        );
        notification.message = notification.message.replace(
          "Your absence request was rejected.",
          this.translate.instant("Your absence request was rejected.")
        );
        notification.message = notification.message.replace(
          "Your absence edit request was rejected.",
          this.translate.instant("Your absence edit request was rejected.")
        );
        break;
      case "ata":
        notification.message = notification.message.replace(
          "ATA",
          this.translate.instant("ATA")
        );
        notification.message = notification.message.replace(
          "External",
          this.translate.instant("External")
        );
        notification.message = notification.message.replace(
          "Internal",
          this.translate.instant("Internal")
        );
        notification.message = notification.message.replace(
          "Accepted",
          this.translate.instant("Accepted")
        );
        notification.message = notification.message.replace(
          "Declined",
          this.translate.instant("Declined")
        );
        notification.message = notification.message.replace(
          "Question",
          this.translate.instant("Question")
        );
        break;
      case "deviation":
        notification.message = notification.message.replace(
          "Deviation",
          this.translate.instant("Deviation")
        );
        notification.message = notification.message.replace(
          "External",
          this.translate.instant("External")
        );
        notification.message = notification.message.replace(
          "Internal",
          this.translate.instant("Internal")
        );
        notification.message = notification.message.replace(
          "Accepted",
          this.translate.instant("Accepted")
        );
        notification.message = notification.message.replace(
          "Declined",
          this.translate.instant("Declined")
        );
        notification.message = notification.message.replace(
          "Question",
          this.translate.instant("Question")
        );
        notification.message = notification.message.replace(
          "New Message",
          this.translate.instant("New Message")
        );
        break;
      case "weeklyreport":
        notification.message = notification.message.replace(
          "Accepted",
          this.translate.instant("Accepted")
        );
        notification.message = notification.message.replace(
          "Declined",
          this.translate.instant("Declined")
        );
        break;
      case "order":
        notification.message = notification.message.replace(
          "Accepted",
          this.translate.instant("Accepted")
        );
        notification.message = notification.message.replace(
          "Declined",
          this.translate.instant("Declined")
        );
        notification.message = notification.message.replace(
          "Date Changed",
          this.translate.instant("Date Changed")
        );
        break;
      case "resource_planning_change":
        notification.message = notification.message.replace(
          "You have been assigned to work on",
          this.translate.instant("You have been assigned to work on")
        );
        notification.message = notification.message.replace(
          "Your work date has been updated on project",
          this.translate.instant("Your work date has been updated on project")
        );
        notification.message = notification.message.replace(
          "Your absence date has been updated",
          this.translate.instant("Your absence date has been updated")
        );
        break;
      default:
    }

    return notification;
  }

  checkIfSiteIsDown() {
    this.usersService.checkIfSiteIsDown().subscribe((res) => {

      let old_user_details = JSON.parse(sessionStorage.getItem("userDetails"));

      if(old_user_details && res['company_id'] && old_user_details.company_id != res['company_id']) {
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }

      if (res["status"]) {
        this.siteIsDown = true;
        clearInterval(this.checkUserInterval);
        sessionStorage.removeItem("userDetails");
        history.replaceState(null, null, " ");
      } else if (!res["status"] && this.siteIsDown) {
        window.location.reload();
        this.siteIsDown = false;
      } else {
        this.siteIsDown = false;
      }
    });
  }

  routeToProjects() {
    if (this.authService.projectsRoute) {
      this.router.navigate([this.authService.projectsRoute]);
    } else {
      this.toastr.info(
        this.translate.instant(
          "You are not assigned to any project at the moment."
        ),
        this.translate.instant("Info")
      );
    }
  }

  allowOrDisableEditAta(object) {
    if (object.currentPath == object.ataPath) {
        this.allowEditAta = true;
    }
    if (object.currentPath != object.ataPath) {
      this.ataService.disableEditAta(object.ataId).subscribe((res) => {
        if (res["status"]) {
          this.allowEditAta = false;
          this.cronService.setObject(null);
          if (this.subscription) {
            this.subscription.unsubscribe();
          }
        }
      });
    }
  }

  allowOrDisableEditAtest(object) {

    if (object.currentPath == object.ataPath) this.allowEditAtest = true;
    if (object.currentPath != object.projectPath && this.allowEditAtest) {
      this.projectService.enableEditAtest(object.projectId).then((res) => {
        if (res["status"]) {
          this.allowEditAtest = false;
          if (this.subscriptionAtest2) this.subscriptionAtest2.unsubscribe();
        }
      });
    }
  }

  returnObject(result) {
    this.currentUrl = window.location.hash.split("#")[1];

    let object;

    if (result && result["type"] == "Atest") {
      object = {
        currentPath: this.currentUrl,
        projectPath: result.url,
        projectId: result.projectId,
      };
    } else {
      object = {
        currentPath: this.currentUrl,
        ataPath: result.url,
        ataId: result.ataId,
      };
    }
    return object;
  }

  userCheck() {
    this.authService.getAuthUser().then((res) => {
      if(res["opts"] && res["opts"]['logout_immediately']) {
        this.logout();
      }
      if (res["status"] && res["opts"]["allow_or_destroy_session"]) {

        let old_user_details = JSON.parse(sessionStorage.getItem("userDetails"));

        if(old_user_details && old_user_details.company_id != res["opts"]['company_id']) {
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        }

        res['opts'].role_name = this.AESEncryptDecryptService.sha256(res['opts'].role_name);
        this.userDetails = res["opts"];
        sessionStorage.setItem("userDetails", JSON.stringify(this.userDetails));
        this.userOptionsService.userDetailsConfig.next(this.userDetails);
        sessionStorage.setItem("roleName", JSON.stringify(res['opts'].role_name));

        localStorage.setItem(
          "lastUser",
          JSON.stringify({
            email: res["opts"].email,
            firstname: res["opts"].firstname,
            lastname: res["opts"].lastname,
            roleName: res['opts'].role_name
          })
        );
      } else {
        this.countdown = null;
        this.logout();
      }
    });
  }

  allow_or_destroy_session(permit_session) {
    if (!permit_session) {
        this.countdown = null;
        this.logout();
    }
  }

  logout() {

    this.clearStatusObjects();

    this.authService.logoutUser().then((res) => {
      sessionStorage.removeItem("userDetails");
      sessionStorage.removeItem("selectedTabDeviation");
      this.initProvider.setLoggedIn = false;
      if (localStorage.getItem("isApp") != undefined) {
        window.location.href = "http://app.action.logout/";
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  checkRouterEvent(routerEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }

  toggleAllNotifications() {
    if(this.notifications.length > 0){
      this.showNotifications = !this.showNotifications;
      this.usersService.markAllNotificationsAsSeen(this.userDetails.user_id);
      this.changeRed = false;
    }

  }

  markAllNotificationsAsOpened() {
    this.usersService
      .markAllNotificationsAsOpened(this.userDetails.user_id)
      .subscribe((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant(
              "Successfully marked all notifications as opened"
            ) + ".",
            this.translate.instant("Success")
          );
          this.notifications = this.notifications.map((notification) => {
            notification.opened = 1;
            this.unseenNotifications = this.unseenNotifications - 1;
            return notification;
          });
          this.unseenNotifications = 0;
        }
      });
  }

  public hideAllNotifications() {
    this.showNotifications = false;
    this.changeRed = false;
  }

  visitLink(notification) {
    this.projectService.setCurrentTab(0);
    notification.type == "ata" || notification.type == "deviation"
      ? this.router.navigateByUrl(
          notification.link.includes("?")
            ? notification.link + "&openPdf=true&openByNotification=true"
            : notification.link + "?openPdf=true&openByNotification=true"
        )
      : this.router.navigateByUrl(notification.link);
    this.usersService.markNotificationWithOpened(notification.Id).then(() => {
      notification.opened = true;
    });
    this.showNotifications = false;
    this.changeRed = false;
  }


  printNameCanBeTranslated(message) {
    return message.split(":")[0];
  }

  printTypeName(message) {
    return message.split(":")[1];
  }

  setStatusColor(status) {
    let color = "rgb(184, 232, 61)";
    if (status == "2") color = "rgba(41, 205, 19, 0.96)";
    else if (status == "1") color = "rgba(41, 205, 19, 0.96)";
    else if (status == "3") color = "rgb(232, 61, 61)";
    else if (status == "4") color = "rgba(228, 228, 15, 1)";

    return {
      "background-color": color,
    };
  }

  openModal() {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    diaolgConfig.panelClass = "custom-dialog-panel";
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    diaolgConfig.autoFocus = true;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "60%";
    diaolgConfig.maxHeight = "650px";
    diaolgConfig.data = {};

    this.dialog
      .open(SupportModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscriptionAtest2.unsubscribe();

    if (this.translateSub) {
      this.translateSub.unsubscribe();
    }

    if (this.notSeenMessageSub) {
      this.notSeenMessageSub.unsubscribe();
    }
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  clearStatusObjects() {
    localStorage.removeItem("statusObjectPrognosis");
    localStorage.removeItem("statusObjectExternal");
    localStorage.removeItem("statusObjectInternal");
  }

  maintenance_time() {
    this.componentAccessService.getComponentVisibility().subscribe((res) => {
      if (res["data"]) {
        let result = res["data"];

        if (result.m_text && result.m_text[this.lang]) {
          this.maintenance_info = {
            time: result.m_time,
            date: result.m_date,
            text: result.m_text[this.lang],
          };
        } else {
          this.maintenance_info = null;
        }
      }
    });
  }

  formatCountDown(countdown) {
    let convert_data = countdown;
    if (countdown / 60 < 1) {
      this.covert_type = "seconds";
    } else {
      this.covert_type = "minutes";
      convert_data = Math.round(countdown / 60);
    }

    if(countdown == 1 && convert_data == 'seconds') {
        this.countdown = null;
    }

    return convert_data;
  }

  deleteChosenNotification() {
    this.notificationForDelete.forEach((val: boolean, key: number) => {
      if (val) {
        this.deleteSelectedNotification(key);
      }
    });
    this.notificationForDelete.clear();
  }

  deleteSelectedNotification(notification_id) {
    this.usersService
      .deleteSelectedNotification(notification_id)
      .then((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant(
              "Successfully deleted notification"
            ),
            this.translate.instant("Success")
          );
          this.notifications = this.notifications.filter((n) => {
            return n.Id != notification_id;
          });
        }
      });
  }

  deleteAllNotification() {
    this.changeRed = true;
    // document.getElementById('deleteNotification').style.display = 'block';
    // document.getElementById('arrow').style.display = 'block';
    // this.changeRed = true;
  }

  checkNotificationChange(notification_id, value) {
    this.usersService.markNotificationChecked(notification_id, value).then((res) => {
      if (res["status"]) {
        this.notificationService.startNotificationCheck();
      }
    });
    this.notificationForDelete.set(
      notification_id,
      !this.notificationForDelete.get(notification_id)
    );
  }

  exsists(notification_id) {
    if (this.notificationForDelete.has(notification_id)) {
      return this.notificationForDelete.get(notification_id);
    }
    return false;
  }

  onQuitDeleteNotifications() {
    this.allDelete = false;
    this.changeRed = false;
    // document.getElementById('deleteNotification').style.display = 'none';
    // document.getElementById('arrow').style.display = 'none';
  }

  onDeleteAllNotifications() {
    this.allDelete = true;
    this.usersService
      .deleteAllNotifications(this.userDetails.user_id)
      .then((res) => {
        if (res["status"]) {
          this.toastr.success(
            this.translate.instant(
              "Successfully deleted all notifications"
            ),
            this.translate.instant("Success")
          );
          this.notifications = [];
          this.showNotifications = false
          this.unseenNotifications = 0;
        }
      });
    // document.getElementById('deleteNotification').style.display = 'none';
    // document.getElementById('arrow').style.display = 'none';
    this.changeRed = false;
  }
}
