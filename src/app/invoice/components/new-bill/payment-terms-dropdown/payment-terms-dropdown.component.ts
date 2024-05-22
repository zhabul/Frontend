import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-terms-dropdown',
  templateUrl: './payment-terms-dropdown.component.html',
  styleUrls: ['./payment-terms-dropdown.component.css']
})
export class PaymentTermsDropdownComponent implements OnInit, AfterViewInit {
  public copyProject= [] ;
  public copyProjectExpended = [];
  @Input() disableInput = false;
  public items: {value: number, name: string}[] = [
    {
      value: 10,
      name: "10 days"
    },
    {
      value: 15,
      name: "15 days"
    },
    {
      value: 20,
      name: "20 days"
    },
    {
      value: 30,
      name: "30 days"
    },
    {
      value: 60,
      name: "60 days"
    },
    {
      value: 90,
      name: "90 days"
    }
  ]

  // Ova ispod funkcija ce se trigerovati
  // Kad god dodje do promjene projekta
  @Input('project') set setSelected(value: any[]) {
    if(this.isEdit) return;
    this.selected = "Betalningsvillkor";
  }

  @Input() isDateSelected: boolean = false;
  public toggle: boolean = false;

  @Output() emitSelectedMaturity = new EventEmitter<any>();
  @Input() isEdit: boolean = false;
  @Input() selected = "Betalningsvillkor";

  constructor(private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.sleep(2000).then(() => {
        this.selectOurDays({value: 30, name: '30 days'}, 3);
    });;
  }

  sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  selectOurDays(days, index){
    this.emitSelectedDays(days);
    this.selected = days.name;
    this.toggleOff();
  }

  emitSelectedDays(days){
      this.emitSelectedMaturity.emit(days);
  }



  toggleProjectExpanded(deys) {
      this.copyProjectExpended.push(deys);
  }

  toggleOn() {
    if(!this.disableInput) {
      if(!this.isDateSelected) {
        this.toastr.info(this.translate.instant("Please select Invoice Date first"));
        return;
      }
      this.toggle = !this.toggle;
    }
  }

  toggleOff(){/* auto close select */
  this.toggle = false;
  }

  setClass() {
    let className = '';
    if(!this.disableInput) {
      if(this.toggle) {
        className = 'select-wrapper-bordered';
      }else {
        className = 'select-wrapper';
      }
    }else {
      className = 'readonly-inputs';
    }
    return className;
  }
}
