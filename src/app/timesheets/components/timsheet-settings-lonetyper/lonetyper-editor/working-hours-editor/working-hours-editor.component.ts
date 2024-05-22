import { Component, OnInit, Input } from '@angular/core';
import { GeneralsService } from "src/app/core/services/generals.service";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-working-hours-editor',
  templateUrl: './working-hours-editor.component.html',
  styleUrls: ['./working-hours-editor.component.css']
})
export class WorkingHoursEditorComponent implements OnInit {

  @Input('generals') generals;
  @Input('disabled') disabled = false;

  constructor(
    private generalsService: GeneralsService,
    private translate: TranslateService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.findPublicHours();
    this.initTranslatedMessages();
  }

  public type = 'Working hours';
  public data = {
    value: '',
    id: -1
  };
  findPublicHours() {
    this.data = this.generals.find((el) => el.key === this.type);
    this.sanitizeValue();
  }

  sanitizeValue() {
    this.data.value = this.getSanitizedValue(this.data.value);
  }

  getSanitizedValue(value) {
    if (!value.includes('h')) {
      value = `${value}h`;
    }
    return value;
  }

  validateInput($event) {
    const data = $event.key;
    const value = $event.target.value;
    const regex = /^[\d./-]+$/;
    const test = regex.test(data);

    if (!test && data !== 'h') { 
      $event.preventDefault();
    }
    if (value.includes('h')) {
      $event.preventDefault();
    }
  }
  
  public success = '';
  public updateSuccessfull = '';
  initTranslatedMessages() {
    this.success = this.translate.instant('Success');
    this.updateSuccessfull = this.translate.instant('Update Successful.');
  }

  async updateValue($event) {
    const target = $event.target;
    const dataValue = this.data.value;
    const value = this.getSanitizedValue(target.value);
    if (value === dataValue || value === 'h') {
      target.value = dataValue;
      return;
    };
    try {
      await this.generalsService.updateItem({
        key: this.type,
        id: this.data.id,
        value: value,
        image: ''
      }).toPromise2();
      this.toastr.success(this.updateSuccessfull, this.success);
      target.value = value;
    } catch(e) {
    }
  }

  clearValue($event) {
    $event.target.value = '';
  }
}
