import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmedValidator } from "./confirmed.validator";
import { AuthService } from "src/app/core/services/auth.service";
import { SpecialCharactherMustBeValidators } from "src/app/core/validator/special-characther-must-be.validator";
import { interval } from "rxjs";
import {first} from 'rxjs/operators'
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('repasswordInput') repasswordInput: ElementRef;
  public createForm: FormGroup;
  public user_id: any;
  public message: any;
  public token: any;
  public spinner = false;
  password: string = '';
  confirm_password: string = '';
  showPassword: boolean = false;
  showRePassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private special_validator: SpecialCharactherMustBeValidators
  ) {}

  ngOnInit() {
    this.user_id = this.route.params["value"]["user_id"];
    this.token = this.route.params["value"]["token"];
    this.checkPermissionForUpdatePassword();
    this.createForm = this.fb.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/),
            this.special_validator.nameValidator,
          ],
        ],
        confirm_password: ["", [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: ConfirmedValidator("password", "confirm_password"),
      }
    );
  }

  resetpassword() {
    if (this.createForm.valid) {
      const data = this.createForm.value;
      data.user_id = this.user_id;
      data.token = this.token;
      this.spinner = true;
      this.authService.changePassword(data).subscribe((result_) => {
        if (result_["message"]) {
          this.message = result_["message"];
        }
        if (result_["status"]) {
          this.authService.logoutUser().then((res) => {
            sessionStorage.removeItem("userDetails");
            const source = interval(5000);
            source.pipe(first()).subscribe((val) => {
              this.router
                .navigate(["login"], { queryParams: { change_psw: "1" } })
                .then(() => {
                  this.spinner = false;
                });
            });
          });
        }
      });
    }
  }

  get f() {
    return this.createForm.controls;
  }

  checkPermissionForUpdatePassword() {
    this.authService
      .checkPermissionForUpdatePassword(this.user_id, this.token)
      .subscribe((res2) => {
        if (!res2["status"]) {
          this.router.navigate(["/external/response/fail-psw"]);
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const inputEl = this.passwordInput.nativeElement;
    inputEl.type = this.showPassword ? 'text' : 'password';
  }
  toggleRePasswordVisibility() {
    this.showRePassword = !this.showRePassword;
    const inputEl = this.repasswordInput.nativeElement;
    inputEl.type = this.showRePassword ? 'text' : 'password';
  }
}
