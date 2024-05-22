import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackIconSvgComponent } from './back-icon-svg.component';

describe('BackIconSvgComponent', () => {
  let component: BackIconSvgComponent;
  let fixture: ComponentFixture<BackIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
