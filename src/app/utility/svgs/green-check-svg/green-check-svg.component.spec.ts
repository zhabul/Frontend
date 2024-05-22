import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenCheckSvgComponent } from './green-check-svg.component';

describe('WhiteCheckSvgComponent', () => {
  let component: GreenCheckSvgComponent;
  let fixture: ComponentFixture<GreenCheckSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenCheckSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenCheckSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
