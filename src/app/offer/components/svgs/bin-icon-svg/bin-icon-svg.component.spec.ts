import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinIconSvgComponent } from './bin-icon-svg.component';

describe('BinIconSvgComponent', () => {
  let component: BinIconSvgComponent;
  let fixture: ComponentFixture<BinIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
