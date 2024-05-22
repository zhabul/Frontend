import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDotsSvgComponent } from './three-dots-svg.component';

describe('ThreeDotsSvgComponent', () => {
  let component: ThreeDotsSvgComponent;
  let fixture: ComponentFixture<ThreeDotsSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeDotsSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeDotsSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
