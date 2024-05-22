import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreyCloseSvgComponent } from './grey-close-svg.component';

describe('GreyCloseSvgComponent', () => {
  let component: GreyCloseSvgComponent;
  let fixture: ComponentFixture<GreyCloseSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreyCloseSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreyCloseSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
