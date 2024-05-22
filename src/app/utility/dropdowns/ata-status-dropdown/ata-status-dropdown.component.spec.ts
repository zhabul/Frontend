import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaStatusDropdownComponent } from './ata-status-dropdown.component';

describe('AtaStatusDropdownComponent', () => {
  let component: AtaStatusDropdownComponent;
  let fixture: ComponentFixture<AtaStatusDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaStatusDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
