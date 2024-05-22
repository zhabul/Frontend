import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from "@angular/core";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SimpleSelectWithCheckDropdownComponent),
  multi: true,
};

@Component({
  selector: "app-simple-select-with-check-dropdown",
  templateUrl: "./simple-select-with-check-dropdown.component.html",
  styleUrls: ["./simple-select-with-check-dropdown.component.css"],
  providers: [CUSTOM_VALUE_ACCESSOR],
})
export class SimpleSelectWithCheckDropdownComponent implements OnInit {
  @Input() items;
  @Input() selected;
  @Input() project;
  @Input() type;
  @Input() disabled;
  @Output() emitSelectChanged = new EventEmitter<any>();
  @Input() disabled_click;
  @Input() borderwidth;
  @Input() width;

  createForm: FormGroup;

  public fill: any;
  public rotate: any;

  public selected_type = "";
  public elementFind: any = [];
  public toggle: boolean;
  public spinner = false;
  public selectedNum: any = [];
  constructor() {}

  ngOnInit(): void {
    this.addCheckProperty();

    this.fill = "#1A1A1A";

    if (this.type === "Supplier-project") {
      this.findSelectedName();
    }

    if(this.disabled == undefined) {
      this.disabled = false;
    }
  }

  ngOnChanges() {
    this.findSelectedName();
  }

  addCheckProperty() {
    this.items = this.items.map((item) => {
      return { ...item, checked: false };
    });
    if (this.type === "Supplier-Number") {
      const selectedValue = this.selected.Account.toString();

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].Number === selectedValue) {
          this.items[i].checked = true; // Postavite svojstvo checked na true za odabrani element
          const selectedItem = this.items[i];
          this.items.splice(i, 1); // Uklonite odabrani element iz trenutnog položaja
          this.items.unshift(selectedItem); // Dodajte ga na početak niza
          break; // Prekinite petlju jer ste pronašli odabrani element
        }
      }
    } else if (this.type === "Supplier-project") {
      const selectedValue = this.selected.OriginProject.toString();

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].CustomName === selectedValue) {
          this.items[i].checked = true; // Postavite svojstvo checked na true za odabrani element
          const selectedItem = this.items[i];
          this.items.splice(i, 1); // Uklonite odabrani element iz trenutnog položaja
          this.items.unshift(selectedItem); // Dodajte ga na početak niza
          break; // Prekinite petlju jer ste pronašli odabrani element
        }
      }
    } else if (this.type === "Supplier-subproject") {
      const selectedValue = this.selected.Project.toString();

      for (let i = 0; i < this.project.length; i++) {
        if (this.project[i].name === selectedValue) {
          this.project[i].checked = true; // Postavite svojstvo checked na true za odabrani element

          const selectedItem = this.project[i];
          this.project.splice(i, 1); // Uklonite odabrani element iz trenutnog položaja
          this.project.unshift(selectedItem); // Dodajte ga na početak niza
          break; // Prekinite petlju jer ste pronašli odabrani element
        }
      }
    }
  }

  getSelectedItem(user: any) {
    user.checked = !user.checked;
  }
  resetCheckedProject() {
    this.project.forEach((project) => {
      project.checked = false;
    });
  }
  selectedID;
  selectedName;

  findSelectedName() {
    if (this.type === "Supplier-project") {
      const selectedValue = this.selected.OriginProject;

      const foundProject = this.project.find(
        (project) => project.CustomName === selectedValue
      );

      if (foundProject) {
        this.selectedName = foundProject.name;
        this.selectedID = foundProject.CustomName;
      }
    }
    if (this.type === "Supplier-subproject") {
      const selectedValue = this.selected.Project.toString();

      const foundProject = this.project.find(
        (project) => project.id === selectedValue
      );

      if (foundProject) {
        const projectIndex = this.project.indexOf(foundProject);
        if (projectIndex !== -1) {
          this.project.splice(projectIndex, 1); // Uklonite ga iz trenutnog položaja
          this.project.unshift(foundProject); // Dodajte ga na vrh liste
          this.resetCheckedProject();
          foundProject.checked = true;
        }
      }
    }
  }

  toggleOn() {

    this.setFillColor();
    this.setRotate();

    if(this.disabled_click  || this.disabled) {
      return false;
    }
    this.toggle = !this.toggle;


    /*if(this.disabled_click || !this.disabled) {
            return false;
        }

        if(this.type === 'moment-editor' ||
            this.type === 'moment-editor-project'||
            this.type === 'moment-editor-ata/du'){
        if(this.selected.AtestStatus == '1'){
            this.toggle = false;
        }else{
            this.toggle = !this.toggle;
        }
        }else{
            this.toggle = !this.toggle;
        }*/
  }

  setFillColor() {
    if (!this.toggle) {
      this.fill = "var(--orange-dark)";
    } else {
      this.fill = "#1A1A1A";
    }
  }

  setRotate() {
    if (!this.toggle) {
      this.rotate = "rotate(180)";
    } else {
      this.rotate = "rotate(0)";
    }
  }
  resetCheckedProperty() {
    this.items.forEach((item) => {
      item.checked = false;
    });
  }
  public lastCheckedItem: any = null;

  newAtaChanged(item, selected, i3) {
    this.resetCheckedProperty();

    if (this.lastCheckedItem) {
      this.lastCheckedItem.checked = false; // Isključite prethodni element
    }

    item.checked = !item.checked; // Obrtanje trenutog elementa

    // Premjestite trenutno označeni element na vrh liste
    this.items = this.items.filter((x) => x !== item); // Uklonite element iz trenutnog položaja
    this.items.unshift(item); // Dodajte ga na vrh liste

    // Ažurirajte "lastCheckedItem" na trenutno označeni element
    this.lastCheckedItem = item;
    this.spinner = true;

    if (this.type === "Supplier-Number") {
      this.emitSelectChanged.emit({
        item: item,
        moment: selected,
        i3: i3,
      });
      this.spinner = false;
    }

    if (this.type === "Supplier-project") {
      this.emitSelectChanged.emit({
        item: item,
        moment: selected,
        i3: i3,
      });
      this.findSelectedName();
      this.spinner = false;
    }
    if (this.type === "Supplier-subproject") {
      this.emitSelectChanged.emit({
        item: item,
        moment: selected,
        i3: i3,
      });
      this.findSelectedName();
      this.spinner = false;
    }

    this.toggleOn();
  }

  changeColor(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--orange-dark)";
  }
  changeColorLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    element.style.color = "var(--border-color)";
  }
}
