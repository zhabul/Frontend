import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { GeneralsService } from "src/app/core/services/generals.service";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wage-type-select',
  templateUrl: './wage-type-select.component.html',
  styleUrls: ['./wage-type-select.component.css']
})
export class WageTypeSelectComponent implements OnInit {

  @Input('generals') generals = [];
  @Input('disabled') disabled = false;
  @Output() sendEmail = new EventEmitter<string>();

  constructor(
    private elementRef: ElementRef,
    private timeRegistrationService: TimeRegistrationService,
    private generalsService: GeneralsService,
    private toastr: ToastrService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.getWageData();
    this.initTranslatedMessages();
  }

  public data = [];
  async getWageData() {
      const res:any = await Promise.all([this.timeRegistrationService.getWageTypes()]);
      if (res[0].status === false) return;
      this.data = res[0].data;
      this.findWageType(); 
  }

  public wageTypeId = -1;
  findWageType() {
    const wageType = this.generals.find(el => el.key === 'Wage Type');
    this.wageTypeId = wageType.id;
    this.setSelectedOption(wageType.value);
  }

  setSelectedOption(val) {
    const option = this.data.find(el => el.id == val);
    if (option) {
      this.selectedOption = this.data.find(el => el.id == val);
    }
  }

  public success = '';
  public updateSuccessfull = '';
  initTranslatedMessages() {
    this.success = this.translate.instant('Success');
    this.updateSuccessfull = this.translate.instant('Update Successful.');
  }

  public selectedOption = {
    id: -1,
    description: '-'
  };
  async selectOption(type) {
    this.selectedOption = type;

    this.close();
    try {
      await this.generalsService.updateItem({
        key: 'Wage Type',
        id: this.wageTypeId,
        value: type.id,
        image: ''
      }).toPromise2();
      this.toastr.success(this.updateSuccessfull, this.success);
    } catch(e) {
    }
 
  }

  orderModel() {
    this.sendEmail.emit("order_model");
  }

  public open = false;
  toggleOpen() {
    if (this.disabled) return;
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
     if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
     }
  }
}
