import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusIconSvgComponent } from './plus-icon-svg.component';

describe('PlusIconScgComponent', () => {
  let component: PlusIconSvgComponent;
  let fixture: ComponentFixture<PlusIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlusIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlusIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
