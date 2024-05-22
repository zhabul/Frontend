import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageNotExistSvgComponent } from './image-not-exist-svg.component';

describe('ImageNotExistSvgComponent', () => {
  let component: ImageNotExistSvgComponent;
  let fixture: ComponentFixture<ImageNotExistSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageNotExistSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageNotExistSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
