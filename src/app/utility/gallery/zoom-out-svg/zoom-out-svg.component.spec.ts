import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomOutSvgComponent } from './zoom-out-svg.component';

describe('ZoomOutSvgComponent', () => {
  let component: ZoomOutSvgComponent;
  let fixture: ComponentFixture<ZoomOutSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomOutSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomOutSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
