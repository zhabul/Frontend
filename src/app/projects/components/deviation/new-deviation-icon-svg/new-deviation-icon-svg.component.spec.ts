import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeviationIconSvgComponent } from './new-deviation-icon-svg.component';

describe('NewDeviationIconSvgComponent', () => {
  let component: NewDeviationIconSvgComponent;
  let fixture: ComponentFixture<NewDeviationIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDeviationIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDeviationIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
