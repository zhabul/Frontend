import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Partners } from '../client';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.css'],
  providers: [ClientService]
})
export class SearchDropdownComponent implements OnInit {

  public ref = 'Typ';
  public ref_title = 'Partners';
  public border = '1px solid var(--border-color)';
  public fill: any;
  public rotate: any;
  public color: any;
  public color1: any;
  public toggle: boolean = false;

  constructor(private partnersService: ClientService) { }

  ngOnInit(): void {
    this.partners = this.partnersService.partners;
    this.filteredPartners = this.partners;
  }


  toogleMultiselect(){
    this.toggle = !this.toggle
    this.setBorderColor();
    this.setFillColor();
    this.setRotate();
    this.setColorTitle();
    this.showSearch();
    this.ChangeTitleWhenOpenCloseToggle();
  }

  setColorTitle(){
    if(this.toggle){
      this.color = 'var(--orange-dark)';
    }else{
      this.color = 'var(--border-color)';
    }
  }

  setFillColor(){
    if(this.toggle){
      this.fill = 'var(--orange-dark)';
    }else{
      this.fill = 'var(--border-color)';
    }
  }

  setRotate(){
    if(this.toggle){
      this.rotate = 'rotate(180)';
    }else{
      this.rotate = 'rotate(0)';
    }
  }

  setBorderColor(){
    if(this.toggle){
      this.border = '2px solid var(--orange-dark)';
    }else{
      this.border = '1px solid var(--border-color)';
    }
  }

  question = {
    type: "text"
  };

  getPlaceHolder(){
    if (this.question.type === "text") return this.ref;
  }

  clearSearch() {
    this.ref='';
  }

  /**Selektiranje nasumicnih user-a  */
  Select(user){
    if(user){
      this.ref = user;
      this.getPlaceHolder();
      !this.searchElement.nativeElement.focus();
    }else{
      this.ref = 'Type';
    }

  }
  /** */


  /**Filter Data */
  partners: Partners[];
  filteredPartners: Partners[];
  _filterText: string = '';


  get filterText(){
    return this._filterText;
  }

  set filterText(value: string){
    this._filterText = value;
    this.filteredPartners = this.filterDataByName(value);
  }

  filterDataByName(filterTerm: string){
    if(this.partners.length === 0 ||  this.filterText === ''){
      return this.partners;
    }else{
      return this.partners.filter((partner)=>{
        return partner.Name.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }
  /** End Filter Data*/

  /** Search Field*/
  @ViewChild('search') searchElement: ElementRef;
  show: boolean = false;

  showSearch(){

    this.show = !this.show;

    if(this.toggle){
      this.color = 'var(--orange-dark)';

    }else{
      this.color = 'var(--border-color)';
    }

    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      if(this.searchElement == undefined){

      }else{
        this.searchElement.nativeElement.focus();
      }

    },0);

  }
  /** End Search Field*/

  /** DropDown Title Change */
  ChangeTitleWhenOpenCloseToggle(){

    if(this.toggle){
      return this.ref_title = 'Typ';
    }else{
      this.ref_title = 'Partners';
    }

  }
  /** */




}
