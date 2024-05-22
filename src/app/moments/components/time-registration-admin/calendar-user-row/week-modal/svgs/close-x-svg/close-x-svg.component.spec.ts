import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseXSvgComponent } from './close-x-svg.component';

describe('CloseXSvgComponent', () => {
  let component: CloseXSvgComponent;
  let fixture: ComponentFixture<CloseXSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseXSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseXSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
