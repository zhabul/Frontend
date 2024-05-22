import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-checking-svg-red',
    templateUrl: './checking-svg-red.component.html',
    styleUrls: ['./checking-svg-red.component.css']
})
export class CheckingSvgRedComponent implements OnInit {

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
