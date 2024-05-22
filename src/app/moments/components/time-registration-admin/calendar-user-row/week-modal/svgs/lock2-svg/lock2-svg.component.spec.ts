import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lock2SvgComponent } from './lock2-svg.component';

describe('Lock2SvgComponent', () => {
  let component: Lock2SvgComponent;
  let fixture: ComponentFixture<Lock2SvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lock2SvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lock2SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
