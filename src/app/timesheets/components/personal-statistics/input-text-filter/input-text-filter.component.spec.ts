import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextFilterComponent } from './input-text-filter.component';

describe('InputTextFilterComponent', () => {
  let component: InputTextFilterComponent;
  let fixture: ComponentFixture<InputTextFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTextFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
