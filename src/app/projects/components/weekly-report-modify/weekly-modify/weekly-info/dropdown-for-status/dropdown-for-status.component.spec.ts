import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownForStatusComponent } from './dropdown-for-status.component';

describe('DropdownForStatusComponent', () => {
  let component: DropdownForStatusComponent;
  let fixture: ComponentFixture<DropdownForStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownForStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownForStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
