export interface IResizable {
  resize(amountResized: number, anchor: "left" | "up" | "right" | "down"): void;
}
