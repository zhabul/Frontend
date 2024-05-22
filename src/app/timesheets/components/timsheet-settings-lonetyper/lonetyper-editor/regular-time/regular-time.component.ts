import { Component, OnInit, Input } from '@angular/core';
import { GeneralsService } from 'src/app/core/services/generals.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-regular-time',
  templateUrl: './regular-time.component.html',
  styleUrls: ['./regular-time.component.css']
})
export class RegularTimeComponent implements OnInit {

  @Input('title') title;
  @Input('item') item;
  @Input('disabled') disabled = false;
  @Input('generals') generals = [];
 
  constructor(
    private generalsService: GeneralsService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.findItemId();
    this.initTranslatedMessages();
  }

  public data:any = {};
  findItemId() {
    this.data = this.generals.find(el => el.key === this.item);
    this.sanitizeValue();
  }

  sanitizeValue() {
    if (!this.data.value) {
      this.data = {
        ...this.data,
        value: '00:00'
      };
    }
  }

  public success = '';
  public updateSuccessfull = '';
  initTranslatedMessages() {
    this.success = this.translate.instant('Success');
    this.updateSuccessfull = this.translate.instant('Update Successful.');
  }

  async save(value) {
      await this.generalsService.updateItem({
        key: this.item,
        id: this.data.id,
        value: value,
        image: ''
      }).toPromise2();
      this.data = {
        ...this.data,
        value: value
      };
      this.toastr.success(this.updateSuccessfull, this.success);
  }
}
