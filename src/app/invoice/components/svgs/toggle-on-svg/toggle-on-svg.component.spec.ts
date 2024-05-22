import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleOnSvgComponent } from './toggle-on-svg.component';

describe('ToggleOnSvgComponent', () => {
  let component: ToggleOnSvgComponent;
  let fixture: ComponentFixture<ToggleOnSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleOnSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleOnSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
