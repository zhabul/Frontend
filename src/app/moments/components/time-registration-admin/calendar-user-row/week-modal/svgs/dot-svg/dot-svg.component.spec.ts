import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotSvgComponent } from './dot-svg.component';

describe('DotSvgComponent', () => {
  let component: DotSvgComponent;
  let fixture: ComponentFixture<DotSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
