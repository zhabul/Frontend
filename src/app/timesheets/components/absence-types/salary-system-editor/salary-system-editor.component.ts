import { Component, OnInit } from '@angular/core';
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-salary-system-editor',
  templateUrl: './salary-system-editor.component.html',
  styleUrls: ['./salary-system-editor.component.css']
})
export class SalarySystemEditorComponent implements OnInit {

  constructor(private timeRegistrationService: TimeRegistrationService, private translate: TranslateService, private toastr: ToastrService) { }
  public salary_system:any;
  public code:any;

  ngOnInit(): void {
    this.getSalarySystem();
  }

  getSalarySystem() {
    this.timeRegistrationService
      .getSalarySystem()
      .subscribe((response:any) => {

        if(response.status) {
          this.salary_system = response.data;
          this.code = this.salary_system.code;
        }
      });
  }

  save() {

    this.timeRegistrationService.updateSalaryCode({code: this.code, id: this.salary_system.id}).subscribe((result) => {
      if(result) {
        this.toastr.success(
          this.translate.instant(
            "You have successfully update!"
          ),
          this.translate.instant("Success")
        );
      }
    });
  }
}
