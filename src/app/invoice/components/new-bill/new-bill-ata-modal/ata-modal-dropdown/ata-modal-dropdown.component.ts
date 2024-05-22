import { Component, ElementRef, HostListener, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GeneralsService } from "src/app/core/services/generals.service";
@Component({
  selector: 'app-ata-modal-dropdown',
  templateUrl: './ata-modal-dropdown.component.html',
  styleUrls: ['./ata-modal-dropdown.component.css']
})
export class AtaModalDropdownComponent implements OnInit {
  public isOpen: boolean = false;
  public hasAtleastOneSelected: boolean = false;
  public title: string = "Välj KS"
  public generals;
  @Input() items = [];
  @Input() isEdit = false;
  @Input() ata;
  @Output() selectedWREvent = new EventEmitter<any>();
  
  constructor(
    private eRef: ElementRef,
    private toastr: ToastrService,
    private generalsService: GeneralsService
  ) { }

  ngOnInit(): void {
    if(this.items) {
      if(this.checkIfAtleastOneSelected()) this.title = "KS";
    }

    this.generalsService.getAllGeneralsSortedByKey().subscribe((res) => {
        this.generals = res;
    });
  }

  onDropdownOpen() {
    if(this.items) this.isOpen = !this.isOpen;
    else this.toastr.info("Pitati melisu za poruku, ata-modal-dropdown.componentn.ts");
  }


  // Da se zatvori dropdown ako se klikne van elementa
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) this.isOpen = false;
  }


  onSelectedWR(wr, index) {

    if(this.isEdit) {
      wr.includeInInvoice = !wr.includeInInvoice;
      wr.checked = wr.includeInInvoice;
      if(this.checkIfAtleastOneSelected()) this.title = "KS";
      else this.title = "Välj KS" 
    } else {
      wr.checked = !wr.checked;
      if(this.checkIfAtleastOneSelected()) this.title = "KS";
      else this.title = "Välj KS" 
    }
    this.selectedWREvent.emit(this.ata);
  }

  checkIfAtleastOneSelected(): boolean {
    if (this.isEdit) {
      for (let item of this.items) {
        if (item.includeInInvoice) return true;
      }
    } else {
      for (let item of this.items) {
        if (item.checked) return true;
      }
    }
    
    return false;
  }

}
