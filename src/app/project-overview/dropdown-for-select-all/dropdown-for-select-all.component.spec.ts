import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownForSelectAllComponent } from './dropdown-for-select-all.component';

describe('DropdownForSelectAllComponent', () => {
  let component: DropdownForSelectAllComponent;
  let fixture: ComponentFixture<DropdownForSelectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownForSelectAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownForSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
