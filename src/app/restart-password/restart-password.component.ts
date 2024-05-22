import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { CompareValidator } from "../core/validator/password.validator";

@Component({
    selector: "app-restart-password",
    templateUrl: "./restart-password.component.html",
    styleUrls: ["./restart-password.component.css"],
})
export class RestartPasswordComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    public inputForm: FormGroup;
    public disabled = false;

    ngOnInit() {
        console.log(this.route.snapshot.params.token);
        this.inputForm = this.fb.group(
            {
                password: ["", [Validators.required, Validators.minLength(6)]],
                confirmPassword: ["", [Validators.required]],
            },
            {
                validator: [CompareValidator.passwordMatchValidator],
            }
        );

        const lang = sessionStorage.getItem("lang") || "en";
        this.translate.use(lang);
    }

    submit() {
        if (this.inputForm.dirty && this.inputForm.valid) {
            const data = this.inputForm.value;

            this.disabled = true;

            this.authService
                .restartPassword({
                    token: this.route.snapshot.params.token,
                    password: data.password,
                })
                .subscribe((res) => {
                    this.router.navigate(["login"]);
                });
        }
    }
}
