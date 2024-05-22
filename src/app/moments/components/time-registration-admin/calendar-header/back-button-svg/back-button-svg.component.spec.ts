import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonSvgComponent } from './back-button-svg.component';

describe('BackButtonSvgComponent', () => {
  let component: BackButtonSvgComponent;
  let fixture: ComponentFixture<BackButtonSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackButtonSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackButtonSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
