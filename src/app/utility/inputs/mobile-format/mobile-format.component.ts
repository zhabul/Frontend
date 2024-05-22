import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { AsYouType } from 'libphonenumber-js';
//import parsePhoneNumber from 'libphonenumber-js'

@Component({
  selector: 'app-mobile-format',
  templateUrl: './mobile-format.component.html',
  styleUrls: ['./mobile-format.component.css']
})
export class MobileFormatComponent implements OnInit {

    public phone_codes:any[] = [];
    @Output() phone_number = new EventEmitter<string>();
    @Input() mobile_number;
    @Input() width;
    @Input() placeholder;
    @Input() fontSize;
    @Input() disabled:boolean = false;

    constructor(
        private companyService: CompanyService,
    ) { }

    ngOnInit(): void {
        this.getPhoneCodes();

        if(!this.fontSize || this.fontSize == undefined) {
            this.fontSize = 18;
        }
    }

    USformatPhoneNumber(phoneNumberString) {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          var intlCode = (match[1] ? '+1 ' : '');
          return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        }
        return null;
    }

    otherFormatPhoneNumber(input) {

        input = input.replace(/\D/g,'');
        input = input.substring(0,10);
        var size = input.length;

        if(size > 8) {
            if(size == 0){
                    input = input;
            }else if(size < 4){
                    input = '('+input;
            }else if(size < 7){
                    input = '('+input.substring(0,3)+') '+input.substring(3,6);
            }else if(size == 10){
                input = input.substring(0,3)+'-'+input.substring(3,6)+ ' ' + input.substring(6,8)+ ' ' + input.substring(8,10);
            }else{
                //input = '('+input.substring(0,3)+') '+input.substring(3,6)+' - '+input.substring(6,10);
                input = input.substring(0,3)+' '+input.substring(3,6)+' - '+input.substring(6,10);
            }
        }
        return input;
    }

    formtMobileNumber(mobile_number) {

        let mobile_number_copy =JSON.parse(JSON.stringify(mobile_number))
        let index = this.phone_codes.findIndex((phone) => {
            return mobile_number_copy.startsWith(phone.code_1) || mobile_number_copy.startsWith(phone.code_2) || mobile_number_copy.startsWith(phone.code_3) || mobile_number_copy.startsWith(phone.code_4)
        });

        if(index != -1) {
            let country = this.phone_codes[index];
            let phone_number = new AsYouType(country.country_short);
            this.mobile_number = phone_number.input(mobile_number_copy);
        }else if(mobile_number.length > 3){
            this.mobile_number = this.otherFormatPhoneNumber(mobile_number_copy);
        }else {
            this.mobile_number = mobile_number_copy;
        }
        this.phone_number.emit(this.mobile_number);
    }

    getPhoneCodes() {
        this.companyService.getPhoneCodes().then((result) => {
            this.phone_codes = result;
            if(this.mobile_number) {
                this.formtMobileNumber(this.mobile_number);
            }
        });
    }
}
