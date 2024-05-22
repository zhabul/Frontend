import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenySvgComponent } from './deny-svg.component';

describe('DenySvgComponent', () => {
  let component: DenySvgComponent;
  let fixture: ComponentFixture<DenySvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DenySvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenySvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
