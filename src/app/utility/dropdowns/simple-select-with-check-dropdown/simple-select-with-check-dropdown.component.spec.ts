import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSelectWithCheckDropdownComponent } from './simple-select-with-check-dropdown.component';

describe('SimpleSelectWithCheckDropdownComponent', () => {
  let component: SimpleSelectWithCheckDropdownComponent;
  let fixture: ComponentFixture<SimpleSelectWithCheckDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleSelectWithCheckDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleSelectWithCheckDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
