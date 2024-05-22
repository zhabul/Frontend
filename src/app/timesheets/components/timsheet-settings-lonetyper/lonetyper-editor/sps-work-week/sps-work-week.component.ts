import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { GeneralsService } from "src/app/core/services/generals.service";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sps-work-week',
  templateUrl: './sps-work-week.component.html',
  styleUrls: ['./sps-work-week.component.css']
})
export class SpsWorkWeekComponent implements OnInit {

  @Input('disabled') disabled = false;

  constructor( 
    private fb: FormBuilder,
    public generalsService: GeneralsService,
    private translate: TranslateService,
    private toastr: ToastrService
    ) { }
  
  ngOnInit() {
    this.getWorkWeek();
    this.initTranslatedMessages();
  }

  public workWeek = [];
  async getWorkWeek() {
    const res = await this.generalsService.getWorkWeek();
    this.workWeek = res;
    this.formatWeek();
    this.initForm();
  }

  public weeksObj = {};
  formatWeek() {
    this.weeksObj = this.workWeek.reduce(function(r, e) {
      r[e.short_name.toLowerCase()] = e;
      return r;
    }, {});
  }

  public workWeekForm;
  initForm() {
    this.workWeekForm = this.fb.group({
      mon: [ this.weeksObj['mon'].type, []],
      tue: [ this.weeksObj['tue'].type, []],
      wed: [ this.weeksObj['wed'].type, []],
      thu: [ this.weeksObj['thu'].type, []],  
      fri: [ this.weeksObj['fri'].type, []],
      sat: [ this.weeksObj['sat'].type, [ ]],
      sun: [ this.weeksObj['sun'].type, []]
    });
    this.initFormControlls();
  }

  public monControl;
  public tueControl;
  public wedControl;
  public thuControl;
  public friControl;
  public satControl;
  public sunControl;
  initFormControlls() {
    this.monControl = this.workWeekForm.get('mon');
    this.tueControl = this.workWeekForm.get('tue');
    this.wedControl = this.workWeekForm.get('wed');
    this.thuControl = this.workWeekForm.get('thu');
    this.friControl = this.workWeekForm.get('fri');
    this.satControl = this.workWeekForm.get('sat');
    this.sunControl = this.workWeekForm.get('sun');
  }

  public success = '';
  public updateSuccessfull = '';
  initTranslatedMessages() {
    this.success = this.translate.instant('Success');
    this.updateSuccessfull = this.translate.instant('Update Successful.');
  }

  updateItem(control, type) {
    const id = this.weeksObj[type].id;
    this.generalsService
    .updateWorkWeek({
      id: id,
      type:control.value,
    })
    .subscribe(() => {
      this.toastr.success(this.updateSuccessfull, this.success);
    });
  }

  changeWorkingDay(index) {

  }
}
