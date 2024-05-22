import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageExistSvgComponent } from './image-exist-svg.component';

describe('ImageExistSvgComponent', () => {
  let component: ImageExistSvgComponent;
  let fixture: ComponentFixture<ImageExistSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageExistSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageExistSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
