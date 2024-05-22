import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclamationMarkSvgComponent } from './exclamation-mark-svg.component';

describe('ExclamationMarkSvgComponent', () => {
  let component: ExclamationMarkSvgComponent;
  let fixture: ComponentFixture<ExclamationMarkSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExclamationMarkSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExclamationMarkSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
