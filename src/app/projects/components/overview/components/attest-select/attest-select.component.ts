import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-attest-select",
  templateUrl: "./attest-select.component.html",
  styleUrls: ["./attest-select.component.css"],
})
export class AttestSelectComponent implements OnInit {
  @Input() project;
  @Input() moment;
  @Input("availableAtasOrDu") set setAvailableAtasOrDu(value) {
    if (value !== this.availableAtasOrDu) {
      this.availableAtasOrDu = value.sort(
        (a, b) => Number(a.AtaNumber) - Number(b.AtaNumber)
      );
     
    }
  }
  @Input() i3;
  @Input() dataStyleFromAttest;

  public availableAtasOrDu = [];

  @Output() emitNewAtaChanged = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    
  }

  newAtaChanged(newAtaElement, moment, i3) {
    console.log(newAtaElement)
    console.log(moment)
    console.log(i3)
    this.emitNewAtaChanged.emit({
      newAtaElement: newAtaElement,
      moment: moment,
      i3: i3,
    });
  }
}


