import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-status-dropdown',
  templateUrl: './status-dropdown.component.html',
  styleUrls: ['./status-dropdown.component.css']
})
export class StatusDropdownComponent implements OnInit, OnChanges {

  @Input('logs') logs;
  @Input('showAborted') showAborted = true;
  @Output('resolve') resolve: EventEmitter<number> = new EventEmitter();

  public templateOptions = [
    { txt: this.translate.instant("Accepted"), status: 2, visible: true },
    { txt: this.translate.instant("Declined"), status: 3, visible: true },
    { txt: this.translate.instant("TSC_CANCEL_FLOW"), status: 4, visible: this.showAborted },
    { txt: this.translate.instant("Aborted"), status: 5, visible: true }
  ];

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
     this.setOptionsVisibility();
  }

  setOptionsVisibility() {
    this.templateOptions = this.templateOptions.map(this.shouldOptionBeVisible.bind(this));
  }

  shouldOptionBeVisible(option) {
    const emailLog = this.logs[0];

    if(!this.showAborted){
      return this.resolveCancelFlowInvisible(option);
    }

    if (!emailLog) {
      return this.optionVisible(option);
    }

    const status = emailLog.Status;
    // console.log("status",status,option)
    if (status == 1) {
      return this.optionVisible(option);
    } else if (status == 2) {
      return this.resolveAbortedVisibility(option);
    } else if (status == 3) {
      return this.resolveAbortedVisibility(option)
    } else if (status == 4) {
      return this.optionVisible(option);
    } else if (status == 5 || status == 7) {
      return this.optionInvisible(option);
    } else {
      return { ...option };
    }
  }

  resolveAbortedVisibility(option) {
    if (option.status == 5) {
      return this.optionVisible(option);
    } else {
      return this.optionInvisible(option);
    }
  }

  resolveCancelFlowInvisible(option) {
    if (option.status == 4) {
      return this.optionInvisible(option);
    } else {
      return this.optionVisible(option);
    }
  }

  resolveDeclinedVisibility(option) {
    if (option.status == 3) {
      return this.optionInvisible(option);
    } else {
      return this.optionVisible(option);
    }
  }

  optionVisible(option) {
    return { ...option, visible: true };
  }
  optionInvisible(option) {
    return { ...option, visible: false };
  }

  resolveOption(status) {
    this.resolve.emit(status);
  }
}
