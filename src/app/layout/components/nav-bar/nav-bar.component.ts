import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../../core/services/auth.service";
import { Router, NavigationEnd } from "@angular/router";
import { CartService } from "src/app/core/services/cart.service";
import { AppService } from "src/app/core/services/app.service";
import { UsersService } from "src/app/core/services/users.service";
import { ProjectsService } from "src/app/core/services/projects.service";
import { NotificationService } from "src/app/core/services/notification.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  public isClicked: boolean;
  public userDetails;
  public currentAddRoute = "";
  public showAddRoute = false;
  public previousRoute = "";

  public showCartIcon = false;
  public cartItemsCount = 0;

  public filterMenu = false;
  public state = "small";

  public notifications: any[] = [];
  public showNotifications = false;
  public unseenNotifications = 0;
  public userScalableToggle;

  constructor(
    private projectService: ProjectsService,
    private usersService: UsersService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private appService: AppService,
    private notificationService: NotificationService,
    private location: Location,
    public cd: ChangeDetectorRef
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showCartIcon = [
          "#/orders/categories",
          "#/orders/materials",
          "#/orders/submaterials",
          "#/orders/view-order",
        ].some((x) => window.location.hash.startsWith(x));
      }
    });
    this.cartService.getCartItems().subscribe((x) => {
      this.cartItemsCount = x;
    });
  }

  toggleCartComponent() {
    this.cartService.toggleShowCartIcon();
  }

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.notificationService.notifications$.subscribe((res) => {
      this.unseenNotifications = this.notificationService.getNumberOfUnseenNotifications;
      this.notifications = res;
    });

    this.appService.getShowAddButton.subscribe(
      (res) => (this.showAddRoute = res)
    );
    this.appService.getAddRoute.subscribe(
      (res) => (this.currentAddRoute = res)
    );
    this.appService.getBackRoute.subscribe((res) => (this.previousRoute = res));

    const lang = sessionStorage.getItem("lang") || "en";
    this.translate.use(lang);
  }

  logout() {
    this.authService.logoutUser().then((res) => {
      sessionStorage.removeItem("userDetails");
      this.authService.userStatus.emit(false);
    });
  }

  goBack() {
    if (this.previousRoute !== "back") {
      this.router.navigate([this.previousRoute]);
    } else {
      this.location.back();
    }
    this.filterMenu = false;
  }

  goToAddRoute() {
    this.router.navigate([this.currentAddRoute]);
    this.filterMenu = false;
  }

  goToHome() {
    this.router.navigate(["home"]);
    this.filterMenu = false;
  }

  toggleFilterMenu(e): void {
    if (!this.filterMenu) {
      this.userScalableToggle = document.querySelector("meta[name='viewport']");
      this.userScalableToggle.content =
        "width=device-width, initial-scale=1.0, user-scalable=no";
    } else if (this.filterMenu) {
      this.userScalableToggle = document.querySelector("meta[name='viewport']");
      this.userScalableToggle.content =
        "width=device-width, initial-scale=1.0, user-scalable=yes";
    }

    this.filterMenu = !this.filterMenu;

    e = e || window.event;
    e.preventDefault();

    window.document.ontouchmove = (e) => e.preventDefault();
  }

  toggleAllNotifications() {
    this.showNotifications = !this.showNotifications;
    this.usersService.markAllNotificationsAsSeen(this.userDetails.user_id);
  }

  visitLink(notification) {
    this.projectService.setCurrentTab(0);
    this.router.navigate([notification.link]);
    this.usersService.markNotificationWithOpened(notification.Id);
    this.showNotifications = false;
  }

  printNameCanBeTranslated(message) {
    return message.split(":")[0];
  }

  printTypeName(message) {
    return message.split(":")[1];
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }
}
