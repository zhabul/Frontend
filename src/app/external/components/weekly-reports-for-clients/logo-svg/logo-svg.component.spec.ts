import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoSvgComponent } from './logo-svg.component';

describe('LogoSvgComponent', () => {
  let component: LogoSvgComponent;
  let fixture: ComponentFixture<LogoSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
