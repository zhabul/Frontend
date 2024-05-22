import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelleteIcon2SvgComponent } from './dellete-icon2-svg.component';

describe('DelleteIcon2SvgComponent', () => {
  let component: DelleteIcon2SvgComponent;
  let fixture: ComponentFixture<DelleteIcon2SvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelleteIcon2SvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelleteIcon2SvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
