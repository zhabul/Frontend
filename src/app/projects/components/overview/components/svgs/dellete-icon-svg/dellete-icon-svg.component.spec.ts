import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelleteIconSvgComponent } from './dellete-icon-svg.component';

describe('DelleteIconSvgComponent', () => {
  let component: DelleteIconSvgComponent;
  let fixture: ComponentFixture<DelleteIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelleteIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelleteIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
