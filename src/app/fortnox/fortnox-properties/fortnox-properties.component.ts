import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SettingsService } from "src/app/core/services/settings.service";

@Component({
    selector: 'app-fortnox-properties',
    templateUrl: './fortnox-properties.component.html',
    styleUrls: ['./fortnox-properties.component.css']
})
export class FortnoxPropertiesComponent implements OnInit {
    public createForm: FormGroup;
    public allow_active_button:boolean = false;
    fortnox_properties:any;
    public payment_systems: any[] = [];
    constructor(private fb: FormBuilder,
        private fortnoxApi: FortnoxApiService,
        private toastr: ToastrService,
        private translate: TranslateService,
        private router: Router,
        private settingsService: SettingsService,) {
        this.createForm = this.fb.group({
          client_secret: ["", [Validators.required]],
          client_id: ["", [Validators.required]],
          token: ["", []],
          EconomySystem: ["", [Validators.required]],
          content_id: ["", [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.getFortnoxProperties();
        this.getEconomySystems();
    }

    getBaseUrl() {
        return window.location.host + "/#/";
    }

    make_token(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    create() {

        if (this.createForm.valid) {
            const data = this.createForm.value;
            data.token = this.make_token(20);
            this.fortnoxApi.createOrUpdateFortnoxProperties(data).then((response) => {
            if (response["status"]) {
                this.toastr.success(
                  this.translate.instant("TSC_You_have_successfully_added_fortnox_properties"),
                  this.translate.instant("Success")
                );
                this.allow_active_button = true;
            }else {
                this.toastr.error(this.translate.instant("Error"));
            }
          });
        }
    }

    getFortnoxProperties() {
        this.fortnoxApi.getFortnoxProperties().then((response) => {
            if(response['status']) {
                this.fortnox_properties = response['data'];
                this.createForm = this.fb.group({
                    client_secret: [this.fortnox_properties.client_secret, [Validators.required]],
                    client_id: [this.fortnox_properties.client_id, [Validators.required]],
                    token: [this.fortnox_properties.token, [Validators.required]],
                    content_id: [this.fortnox_properties.content_id, [Validators.required]],
                });

                if (this.createForm.valid) {
                    this.allow_active_button = true;
                }
            }
        })
    }

    activateFortnox(): void {
        const data = this.createForm.value;
        let window_location = window.location;
        let procotol = "https";
        let link = window_location.host;

        if(window_location.hostname == 'localhost') {
            link = "beta.wemax.se";
        }

        let url = "https://apps.fortnox.se/oauth-v1/auth?client_id=" + data.client_id + "&response_type=code&state=" + data.token + "&access_type=offline&scope=article%20invoice%20supplierinvoice%20project%20archive%20customer%20companyinformation%20payment%20supplier%20connectfile%20settings%20salary%20bookkeeping%20profile%20order%20offer%20price%20currency%20costcenter%20inbox&redirect_uri="+procotol+"%3A%2F%2F"+ link +"%2Factivation";
        window.open(url, "_blank");
    }

    readMe() {
        this.router.navigate(["/fortnox-readme"]);
    }

    setEconomySystemt(event:any) {
        let index = this.payment_systems.findIndex((payment)=> {
            return payment.name == event
        });
        this.createForm.get('EconomySystem')?.patchValue(event);
        this.createForm.get('content_id')?.patchValue(this.payment_systems[index].id);
    }

    getEconomySystems() {
        this.settingsService.getEconomySystems().subscribe((response) => {
            if (response.status) {
                this.payment_systems = response.data;
            }
        });
    }
}
