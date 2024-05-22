import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";
import { ChildTabService } from "./child-component-tab.service";

type IKNOWISNUMBER = any;
type IKNOWISSTRING = any;

@Directive({
  selector: '[focusIndex]'
})
export class ChildComponentTabDirective implements OnInit{

//Use this directive when input focus change on enter in a child component is needed, for example in a modal

  private _index: number;
  get index(): IKNOWISNUMBER{
    return this._index;
  }
  @Input('focusIndex')
  set index(i: IKNOWISSTRING){
    this._index = parseInt(i);
  }
  @HostListener('keydown', ['$event'])
  onInput(e: any) {
    if (e.which === 13) {
      this.tabService.selectedInput.next(this.index + 1)
      e.preventDefault();
    }
  }

  constructor(private el: ElementRef, private tabService: ChildTabService) {
  }

  ngOnInit(){
    this.tabService.selectedInput
      .subscribe((i) => {
        if (i === this.index) {
          this.el.nativeElement.focus();
        }
      });
  }
}








