import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenCheckedAllSvgComponent } from './green-checked-all-svg.component';

describe('GreenCheckedAllSvgComponent', () => {
  let component: GreenCheckedAllSvgComponent;
  let fixture: ComponentFixture<GreenCheckedAllSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenCheckedAllSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenCheckedAllSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
