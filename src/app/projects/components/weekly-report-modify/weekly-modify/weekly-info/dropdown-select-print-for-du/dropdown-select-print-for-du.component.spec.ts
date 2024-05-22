import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSelectPrintForDuComponent } from './dropdown-select-print-for-du.component';

describe('DropdownSelectPrintForDuComponent', () => {
  let component: DropdownSelectPrintForDuComponent;
  let fixture: ComponentFixture<DropdownSelectPrintForDuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownSelectPrintForDuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSelectPrintForDuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
