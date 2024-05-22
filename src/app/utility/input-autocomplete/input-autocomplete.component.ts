import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,

} from "@angular/core";
import { Observable, interval, map, startWith, debounce } from "rxjs";
import { FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

interface IEmitObj {
  value: string;
  name?: string;
  impName?: string;
};

@Component({
  selector: "app-input-autocomplete",
  templateUrl: "./input-autocomplete.component.html",
  styleUrls: ["./input-autocomplete.component.css"],
  providers: [],
})
export class InputAutocompleteComponent implements OnInit {

  @ViewChild("selectList") selectList;
  @ViewChild("input_autocomplete", { read: MatAutocompleteTrigger }) inputAutocomplete;
  @Input("list") set setList(list: any[]) {
    if (this.list !== list) {
      this.list = list;
      this.textStatus = false;
      if (this.inputText) {
        this.formAttached = true;
        this.attachFilteredForm();
      }
      this.setInputText();
    } else if (list.length === 0 && this.control && this.inputText) {
      this.control.setValue("");
      this.inputText.setValue("");
    }
  }

  @Input("control") control: any;
  @Input("myform") myform: any;
  @Input("inputText") set setText(inputText: any) {

    if (!this.inputText && inputText) {
      this.inputText = inputText;
      if (this.formAttached === false) {
        this.formAttached = true;
        this.attachFilteredForm();
      }
    }
  }

  @Input("errorText") errorText: string;
  @Input("id") id: string;
  @Input("placeholderText") placeholderText: string = "";
  @Input("impId") impId: string;
  @Input("type") type;
  @Input("multiple") multiple;
  @Input("colors") colors:any = {
    backgroundColor: "white",
    color: "black",
    border: '1px solid #ced4da'
  };

  @Input("hasZeroRadius") hasZeroRadius: boolean = false;
  @Input("addFontSize18") addFontSize18: boolean = false;
  @Input("makeBorderOrange") makeBorderOrange: boolean = false;
  @Input() disableSelect:boolean = false;

  public clicked = false;
  public bgColor: any;
  public addOrangeBorder: boolean = false;
  @Output() getEvent: EventEmitter<IEmitObj> = new EventEmitter<IEmitObj>();
  filteredOptions: Observable<any[]>;
  list: any[] = [];
  default: string = "";
  translate: TranslateService;
  dropdownSettings: any;
  inputText: any;
  tempInput: string = "";
  matchColor: string;
  formAttached: boolean = false;
  textStatus: boolean = false;
  opened: boolean = false;


  constructor(translate: TranslateService) {
    this.translate = translate;
  }

  ngOnInit() {
    this.matchColor = this.colors.backgroundColor;

      if (
        this.textStatus === false &&
        (this.type === "invoice_editor" || this.type === "ata invoice_editor")
      ) {
        this.setInputText();
      }
      window.addEventListener('scroll', this.scrollEvent, true);
  }


  scrollEvent = (event: any): void => {
    if(this.inputAutocomplete.panelOpen)
      this.inputAutocomplete.updatePosition();
  };

  ngOnChange() {

  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  attachFilteredForm() {
    if (this.inputText) {
      this.filteredOptions = (this.inputText as FormControl).valueChanges.pipe(
        debounce(() => interval(50)),
        startWith(""),
        map((value) => {
          const filtered = this._filter(value);
          return filtered;
        })
      );
    }
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase().trim();
    if(!this.list.length) return; //added for bug fix

    return this.list.filter((option) => {
      if (option["finalName"]) {
        return option["finalName"].toLowerCase().includes(filterValue);
      }
    });
  }

  emitId(selected: IEmitObj) {
      this.getEvent.emit(selected);
      this.opened = false;
  }

  selectTopOption(e: any) {

    if (e.key === "Enter" && this.selectList.panel) {
      e.preventDefault();
      e.stopPropagation();
      const select = this.selectList.panel.nativeElement;
      const children = select.children;
      children[0].click();
    }
  }

  setSelectedAttribute(id) {
    this.list = this.list.map((item)=>{
      if (item.id == id) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    })
  }

  selectedOption(event) {
    this.makeBorderOrange = true;
    const nativeElement = event.option._element.nativeElement;
    const inputElement = this.inputAutocomplete._element.nativeElement;
    const id = nativeElement.getAttribute("data-id");
    const name = nativeElement.getAttribute("data-name");
    const impName = nativeElement.getAttribute("data-impName");
    const ataType = nativeElement.getAttribute("data-ataType");
    const index = nativeElement.getAttribute("data-index");
    const selected = {
      value: id,
      name: name,
      impName: impName,
      ataType: ataType,
      index: index,
    };
    this.setSelectedAttribute(id);
    this.control.setValue(id);
    this.inputText.setValue(name);
    this.emitId(selected);
    this.checkIfEmpty(); 
    this.tempInput = "";
    inputElement.blur();
  }

  checkIfEmpty() {

    setTimeout(() => {
      const inputText = this.inputText.value;
      let flag: boolean = false;

      if (this.tempInput !== "") {
        this.inputText.setValue(this.tempInput);
      }

      for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i];
        if (inputText === item["finalName"]) {
          flag = true;
          break;
        }
      }

      if (flag === false && this.tempInput === "" && inputText === "") {
        this.control.setValue("");
        this.control.markAsDirty();

        if (this.type === "ata" || this.type === "ata invoice_editor") {
          const selected = { value: "-1" };
          this.emitId(selected);
        }
      }
    }, 100);
  }

  setInputText() {
    if (this.control && this.inputText) {
      this.textStatus = true;
      let flag = false;
      const id = this.control.value;
      if(this.list == undefined) {
        this.list = [];
      }

      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i][this.id]) {
          const finalName = this.list[i]["finalName"];
          flag = true; 
          this.list[i] = { ...this.list[i], selected: true };
          this.inputText.setValue(finalName);
          break;
        } else {
          this.list[i] = { ...this.list[i], selected: false };
        }
      }

      if (flag === false) {
        this.inputText.setValue("");
      }
    }
  }

  displayError() {
    const control = this.control;
    let submitted = false;
    let errorStatus = false;

    if (this.myform) {
      submitted = this.myform.submitted;
    }

    if (this.type !== "ata-users-reg") {
      errorStatus =
        (submitted && control.invalid) || (control.dirty && control.invalid);
    }

    return errorStatus;
  }

  setupEmptyInput() {
    this.tempInput = this.inputText.value;
    this.inputText.setValue("");

    this.toggleOpenPanel();
  }

  toggleOpenPanel() {
    if(!this.disableSelect){
    if (this.opened === true) {
      this.inputAutocomplete.closePanel();
      this.opened = false;
    } else {
      this.inputAutocomplete.openPanel();
      this.opened = true;
    }
  }
  }

  handleClose() {
    this.opened = false;
  }

}
