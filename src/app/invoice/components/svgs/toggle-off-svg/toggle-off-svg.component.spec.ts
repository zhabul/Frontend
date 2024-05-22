import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleOffSvgComponent } from './toggle-off-svg.component';

describe('ToggleOffSvgComponent', () => {
  let component: ToggleOffSvgComponent;
  let fixture: ComponentFixture<ToggleOffSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleOffSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleOffSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
