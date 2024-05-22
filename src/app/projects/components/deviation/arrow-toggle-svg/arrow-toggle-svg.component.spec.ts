import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowToggleSvgComponent } from './arrow-toggle-svg.component';

describe('ArrowToggleSvgComponent', () => {
  let component: ArrowToggleSvgComponent;
  let fixture: ComponentFixture<ArrowToggleSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowToggleSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowToggleSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
