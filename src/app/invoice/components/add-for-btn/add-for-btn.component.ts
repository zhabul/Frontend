import { Component,OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-add-for-btn',
    templateUrl: './add-for-btn.component.html'
})
export class AddForBtnComponent  implements OnInit{

    public colorForSvg
    @Input() set color(value: []) {
        this.colorForSvg = value;
    }
    constructor() { }

    ngOnInit(): void {
    }

}
