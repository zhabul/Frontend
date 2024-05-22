import { style } from "@angular/animations";

export const slideInRight = [
  style({
    transform: "translate3d(100%, 0, 0)",
    visibility: "visible",
    offset: 0,
  }),
  style({ transform: "none", offset: 1 }),
];

export const slideInLeft = [
  style({
    transform: "translate3d(-100%, 0, 0)",
    visibility: "visible",
    offset: 0,
  }),
  style({ transform: "none", offset: 1 }),
];
