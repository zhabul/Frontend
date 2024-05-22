import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

import { Swiper } from "../swiper/swiper.model";

@Component({
  selector: "app-current-swiper",
  templateUrl: "./current-swiper.component.html",
})
export class CurrentSwiperComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  currentIndex = 0;

  screens: Swiper[] = [
    {
      screenTitle: "Foretag installningar",
      details: ["one", "two", "three"],
    },
    {
      screenTitle: "Kontoplan",
      details: ["four", "five", "six"],
    },
    {
      screenTitle: "User Schedule Role",
      details: ["seven", "eight", "nine"],
    },
  ];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  nextScreen() {
    if (this.currentIndex < this.screens.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  previousScreen() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.screens.length - 1;
    }
  }

  scrollUp() {
    location.reload();
  }

  scrollDown() {
    location.reload();
  }
}
