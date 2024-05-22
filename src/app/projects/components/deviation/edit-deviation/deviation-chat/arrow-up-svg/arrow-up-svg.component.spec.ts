import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowUpSvgComponent } from './arrow-up-svg.component';

describe('ArrowUpSvgComponent', () => {
  let component: ArrowUpSvgComponent;
  let fixture: ComponentFixture<ArrowUpSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowUpSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowUpSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
