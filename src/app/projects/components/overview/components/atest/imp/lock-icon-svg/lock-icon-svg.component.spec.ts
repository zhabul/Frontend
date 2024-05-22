import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockIconSvgComponent } from './lock-icon-svg.component';

describe('LockIconSvgComponent', () => {
  let component: LockIconSvgComponent;
  let fixture: ComponentFixture<LockIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
