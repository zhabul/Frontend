import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowLeftSvgComponent } from './arrow-left-svg.component';

describe('ArrowLeftSvgComponent', () => {
  let component: ArrowLeftSvgComponent;
  let fixture: ComponentFixture<ArrowLeftSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowLeftSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowLeftSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
