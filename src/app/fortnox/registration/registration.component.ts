import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { FortnoxApiService } from "src/app/core/services/fortnoxApi.service";

@Component({
  selector: 'app-registration',
  templateUrl: '/registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    constructor(private route: ActivatedRoute, private translate: TranslateService, private fortnoxApi: FortnoxApiService,) { }
    public token: any;
    public code: any;

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            this.token = params.get("state") || null;
            this.code = params.get("code") || null;
        });
        console.log(this.translate)
            this.saveToDatabase();
    }

    saveToDatabase() {

        let object = {
            'token' :this.token,
            'code' : this.code
        };


        this.fortnoxApi.storeFortnoxKey(object);
    }


}

