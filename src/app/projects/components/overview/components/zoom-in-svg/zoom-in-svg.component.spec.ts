import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomInSvgComponent } from './zoom-in-svg.component';

describe('ZoomInSvgComponent', () => {
  let component: ZoomInSvgComponent;
  let fixture: ComponentFixture<ZoomInSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomInSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomInSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
