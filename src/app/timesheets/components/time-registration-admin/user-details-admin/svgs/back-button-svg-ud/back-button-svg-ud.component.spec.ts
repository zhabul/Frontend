import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonSvgUdComponent } from './back-button-svg-ud.component';

describe('BackButtonSvgUdComponent', () => {
  let component: BackButtonSvgUdComponent;
  let fixture: ComponentFixture<BackButtonSvgUdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackButtonSvgUdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackButtonSvgUdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
