import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexStatusIconComponent } from './hex-status-icon.component';

describe('HexStatusIconComponent', () => {
  let component: HexStatusIconComponent;
  let fixture: ComponentFixture<HexStatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexStatusIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
