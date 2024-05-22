import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowDropdownComponent } from './arrow-dropdown.component';

describe('ArrowDropdownComponent', () => {
  let component: ArrowDropdownComponent;
  let fixture: ComponentFixture<ArrowDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
