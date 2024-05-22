import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowUpIconSvgComponent } from './arrow-icon-svg.component';

describe('ArrowUpIconSvgComponent', () => {
  let component: ArrowUpIconSvgComponent;
  let fixture: ComponentFixture<ArrowUpIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowUpIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowUpIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
