import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dot2SvgComponent } from './dot2-svg.component';

describe('Dot2SvgComponent', () => {
  let component: Dot2SvgComponent;
  let fixture: ComponentFixture<Dot2SvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Dot2SvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dot2SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
