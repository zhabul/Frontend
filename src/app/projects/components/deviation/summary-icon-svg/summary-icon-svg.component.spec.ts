import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryIconSvgComponent } from './summary-icon-svg.component';

describe('SummaryIconSvgComponent', () => {
  let component: SummaryIconSvgComponent;
  let fixture: ComponentFixture<SummaryIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
