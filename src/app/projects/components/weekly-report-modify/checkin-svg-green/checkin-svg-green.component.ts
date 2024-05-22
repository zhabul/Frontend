import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-checkin-svg-green',
    templateUrl: './checkin-svg-green.component.html',
    styleUrls: ['./checkin-svg-green.component.css']
})
export class CheckinSvgGreenComponent implements OnInit {

    constructor() { }
    @Input() width: number;
    @Input() height: number;

    ngOnInit(): void {
        if(!this.width) {
            this.width = 26;
        }
        if(!this.height) {
            this.height = 26;
        }
    }

}
