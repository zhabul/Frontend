import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lock3SvgComponent } from './lock3-svg.component';

describe('Lock3SvgComponent', () => {
  let component: Lock3SvgComponent;
  let fixture: ComponentFixture<Lock3SvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lock3SvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lock3SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
