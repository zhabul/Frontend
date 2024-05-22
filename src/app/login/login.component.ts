import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../core/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserOptionsService } from "../core/services/user-options.service";
import { ToastrService } from "ngx-toastr";
import { UsersService } from "../core/services/users.service";
import { InitProvider } from "../initProvider";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
import { AESEncryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loginUsers: any[] = [];
  showPassword = true;
  passInputTouched = false;
  loading = false;
  @ViewChild('passInput') passInput: ElementRef;
  languageChanged = false;
  isOpen = false;

  constructor(
    private userOptionsService: UserOptionsService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UsersService,
    private initProvider: InitProvider,
    private dialog: MatDialog,
    private AESEncryptDecryptService: AESEncryptDecryptService
  ) {
  }

  public loginForm: FormGroup;
  public disabled = false;
  public lang = "sw";
  public email_error:any;
  public password_error:any;
  public error_message: any = "";

  public emailSub;
  public passwordSub;

  ngOnInit() {

    this.lang = sessionStorage.getItem("lang") || "sw";
    this.translate.use(this.lang);

    this.route.queryParamMap.toPromise2().then((params) => {

      let change_psw = params.get("change_psw") || "0";

      if (change_psw && change_psw == "1") {
        this.toastr.success(
          this.translate.instant("You have successfully changed password!"),
          this.translate.instant("Success")
        );

        this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParams: { change_psw: null },
              queryParamsHandling: 'merge',
            });
      }
    });

    if (this.initProvider.isLoggedIn) {
      this.router.navigate(["/"]);
      return;
    }

    this.authService.userStatus.emit(false);

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required,Validators.minLength(6)]],
    });

    this.emailSub = this.loginForm.get("email").valueChanges.subscribe((x) => {
      this.error_message = "";
    });

    this.passwordSub = this.loginForm
      .get("password")
      .valueChanges.subscribe((x) => {
        this.error_message = "";
        this.password_error = false;
        this.email_error = false;
      });
  }

  ngOnDestroy() {
    if (this.emailSub) {
      this.emailSub.unsubscribe();
    }

    if (this.passwordSub) {
      this.passwordSub.unsubscribe();
    }
  }

  submit() {

    this.loading = true;
    this.email_error = false;
    this.password_error = null;
    this.error_message = "";
    let valid = false;
    if(this.loginForm.get('email').status == 'VALID' && this.loginForm.get('password').value.length > 5) {
      valid = true;
    }

    if (this.loginForm.dirty && valid) {
      const data = this.loginForm.value;

      this.disabled = true;

      this.authService
        .loginUser(data["email"], data["password"], this.lang)
        .subscribe((res) => {
          this.authService.setResetTimer(true);

          if (!res["status"]) {
            if (res["data"]["field"] == "email") {
              this.loginForm.controls["email"].markAsDirty();
              this.email_error = res["data"]["message"];
              this.loginForm.controls["email"].setErrors({
                email: res["data"]["message"],
              });
            }

            if (res["data"]["field"] == "password") {
              this.loginForm.controls["password"].markAsDirty();
              this.password_error = res["data"]["message"];
              this.loginForm.controls["password"].setErrors({
                password: res["data"]["message"],
              });
            }

            if (res["data"]["field"] == "wrong_to_many_times") {
              this.error_message = res["data"]["message"];
            }

            this.disabled = false;
          } else {
            if (this.languageChanged) {
              this.userService.updateUserLanguage(
                res["data"]["user_id"],
                this.lang
              );


            }

            this.translate.use(this.lang);
            console.log(this.lang)
            res["data"].role_name= this.AESEncryptDecryptService.sha256(res["data"].role_name);
            sessionStorage.setItem("lang", this.lang);
            this.lang = res["data"]["language"];
            this.disabled = false;
            sessionStorage.removeItem("userDetails");
            sessionStorage.setItem("userDetails", JSON.stringify(res["data"]));
            sessionStorage.setItem("roleName", JSON.stringify(res["data"].role_name));
            sessionStorage.setItem("currency", JSON.stringify(res["currency"]));
            this.userOptionsService.userDetailsConfig.next(res["data"]);

            this.loginUsers.push({
              email: res["data"].email,
              firstname: res["data"].firstname,
              lastname: res["data"].lastname,
              roleName: res['data'].role_name
            });
            localStorage.setItem(
              "lastUser",
              JSON.stringify({
                email: res["data"].email,
                firstname: res["data"].firstname,
                lastname: res["data"].lastname,
                roleName: res['data'].role_name
              })
            );
            this.authService.userStatus.emit(true);
            this.authService.setProjectRoute();
            this.initProvider.setLoggedIn = res["status"];
            const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

            if(isFirefox) {
                this.router.navigate(["/"]).then(()=> {
                    setTimeout( () => { window.location.reload()}, 1500 );
                });
            }else {
                this.router.navigate(["/"]);/*.then(()=> {
                    window.location.reload();
                });*/
            }
           /* this.router.navigate(["/"]);*/
          }
          this.loading = false;
        }, (err) => {
          this.loading = false;
        });
    } else {
      this.loading = false;
      this.loginForm.controls["password"].setErrors({
        password:"Please enter a valid e-mail and password",
      });
      this.password_error = "Please enter a valid e-mail and password";
    }
  }

  changeLang(language: string) {
    this.languageChanged = true;
    this.translate.use(language);
    sessionStorage.setItem("lang", language);
    this.loading = true;
    this.lang = language;
    this.translate.getTranslation(language).subscribe(translations => {
      this.loading = false;
      console.log(this.lang)
    });

    this.toastr.success(
      this.translate.instant("Successfully updated language"),
      this.translate.instant("Success")
    );
  }

  displayLanguage() {
    this.isOpen = !this.isOpen;
  }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
    this.passInput.nativeElement.focus();
  }

  passInputClick() {
    this.passInputTouched = true;
  }

  openProjectClientDetailsModal(/* $event */) {
    /* $event.preventDefault(); */
    /* this.clientsService.client.next(this.createForm.value.client_id); */
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    diaolgConfig.panelClass = "custom-dialog-panel";
    diaolgConfig.panelClass = "custom-modalbox-client-detail";
    /* diaolgConfig.panelClass = 'custom-dialog-panel';  */
    diaolgConfig.autoFocus = false;
    diaolgConfig.width = "";
    diaolgConfig.height = "auto";
    diaolgConfig.disableClose = false;
    /* diaolgConfig.data = {
      clientCategories: this.clientCategories,
    }; */
    this.dialog.open(ForgotPasswordComponent, diaolgConfig);
  }

}
