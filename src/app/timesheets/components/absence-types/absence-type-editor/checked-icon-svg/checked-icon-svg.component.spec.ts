import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedIconSvgComponent } from './checked-icon-svg.component';

describe('CheckedIconSvgComponent', () => {
  let component: CheckedIconSvgComponent;
  let fixture: ComponentFixture<CheckedIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckedIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckedIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
