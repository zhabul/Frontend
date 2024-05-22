import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {  MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,

  ) {}

  public inputForm: FormGroup;
  public disabled = false;

  ngOnInit() {
    this.inputForm = this.fb.group({
      input: ["", [Validators.required]],
    });

    const lang = sessionStorage.getItem("lang") || "en";
    this.translate.use(lang);
  }

  submit() {
    if (this.inputForm.dirty && this.inputForm.valid) {
      const data = this.inputForm.value;

      this.disabled = true;

      this.authService.forgotPassword(data).subscribe((res) => {
        this.disabled = false;

        if (!res["status"]) {
          this.inputForm.controls["input"].markAsDirty();
          this.inputForm.controls["input"].setErrors({
            notExists: true,
          });
        } else {
          this.toastr.success(
            this.translate.instant("Email successfully sent.")
          );
          this.close(true,'close');
          this.router.navigate(["login"]);
        }
      });
    }
  }

  close(parameter = false, from) {
    this.dialogRef.close(parameter);
    if(from == "submit"){
      window.location.reload();
    }

}
}
