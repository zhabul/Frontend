import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenCheckedCircleSvgComponent } from './green-checked-circle-svg.component';

describe('GreenCheckedCircleSvgComponent', () => {
  let component: GreenCheckedCircleSvgComponent;
  let fixture: ComponentFixture<GreenCheckedCircleSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenCheckedCircleSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenCheckedCircleSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
