import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanSearchInputIconSvgComponent } from './clean-search-input-icon-svg.component';

describe('CleanSearchInputIconSvgComponent', () => {
  let component: CleanSearchInputIconSvgComponent;
  let fixture: ComponentFixture<CleanSearchInputIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CleanSearchInputIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CleanSearchInputIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
