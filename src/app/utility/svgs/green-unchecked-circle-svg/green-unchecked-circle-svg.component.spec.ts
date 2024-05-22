import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenUncheckedCircleSvgComponent } from './green-unchecked-circle-svg.component';

describe('GreenUncheckedCircleSvgComponent', () => {
  let component: GreenUncheckedCircleSvgComponent;
  let fixture: ComponentFixture<GreenUncheckedCircleSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenUncheckedCircleSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenUncheckedCircleSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
