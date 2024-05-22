import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelleteSvgComponent } from './dellete-svg.component';

describe('DelleteSvgComponent', () => {
  let component: DelleteSvgComponent;
  let fixture: ComponentFixture<DelleteSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelleteSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelleteSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
