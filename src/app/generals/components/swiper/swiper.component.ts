import { Component, OnInit, Input } from "@angular/core";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/core/services/app.service";

import { trigger, keyframes, animate, transition } from "@angular/animations";
import * as kf from "./keyframes";

import { Swiper } from "./swiper.model";
import { UsersService } from "src/app/core/services/users.service";

@Component({
  selector: "app-swiper",
  templateUrl: "./swiper.component.html",
  animations: [
    trigger("cardAnimator", [
      transition("* => slideInRight", animate(180, keyframes(kf.slideInRight))),
      transition("* => slideInLeft", animate(180, keyframes(kf.slideInLeft))),
    ]),
  ],
})
export class SwiperComponent implements OnInit {
  animationState: string;
  public accounts: any[] = [];
  public showBusinessInfo = true;
  public generals: any[];
  public userDetails: any;
  public showAccounts = false;
  public showScheduleUser = false;
  public loading = false;
  public showCreateFile = false;
  public uploadMessage: any;
  public file: any;
  public fileName: any;
  public canPressSave = true;
  public messages: object;
  public lang: string;
  public belongsTo: any;
  public scheduleRoles: any[] = [];
  public userRoles = [];

  @Input() swiper: Swiper;
  @Input() index: number;

  ngOnInit() {
    this.userService.getRoles().subscribe((res: any) => {
      this.userRoles = res;
      this.scheduleRoles = this.route.snapshot.data["scheduleRoles"].map(
        (x) => {
          x["role"] = res.find((y) => y.id === x.roleId).roles;
          return x;
        }
      );
    });

    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.appService.setBackRoute("/home");
    this.appService.setShowAddButton = false;

    this.generals = this.route.snapshot.data["generals"];

    this.fortnoxApi.getAllAccounts().then((res) => {
      this.accounts = res;
    });
  }

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private fortnoxApi: FortnoxApiService,
    private userService: UsersService
  ) {}

  startAnimation(state) {
    console.log(state);
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = "";
  }
}
