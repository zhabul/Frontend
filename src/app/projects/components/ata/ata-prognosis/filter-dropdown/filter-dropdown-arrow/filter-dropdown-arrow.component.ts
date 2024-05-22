import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown-arrow',
  templateUrl: './filter-dropdown-arrow.component.html',
  styleUrls: ['./filter-dropdown-arrow.component.css']
})
export class FilterDropdownArrowComponent {
  @Input('isDown') isDown: boolean = true;
}
