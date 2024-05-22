import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterDropdownMultiselectComponent } from './counter-dropdown-multiselect.component';

describe('CounterDropdownMultiselectComponent', () => {
  let component: CounterDropdownMultiselectComponent;
  let fixture: ComponentFixture<CounterDropdownMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterDropdownMultiselectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterDropdownMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
