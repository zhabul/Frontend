import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownThreedotPayplanComponent } from './dropdown-threedot-payplan.component';

describe('DropdownThreedotPayplanComponent', () => {
  let component: DropdownThreedotPayplanComponent;
  let fixture: ComponentFixture<DropdownThreedotPayplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownThreedotPayplanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownThreedotPayplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
