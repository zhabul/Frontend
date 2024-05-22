import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseIconSvgComponent } from './close-icon-svg.component';

describe('CloseIconSvgComponent', () => {
  let component: CloseIconSvgComponent;
  let fixture: ComponentFixture<CloseIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
