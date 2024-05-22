import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowDownSvgComponent } from './arrow-down-svg.component';

describe('ArrowDownSvgComponent', () => {
  let component: ArrowDownSvgComponent;
  let fixture: ComponentFixture<ArrowDownSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowDownSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowDownSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
