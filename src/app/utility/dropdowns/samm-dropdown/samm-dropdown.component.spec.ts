import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SammDropdownComponent } from './samm-dropdown.component';

describe('SammDropdownComponent', () => {
  let component: SammDropdownComponent;
  let fixture: ComponentFixture<SammDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SammDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SammDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
