import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDotsSvgComponent } from './more-dots-svg.component';

describe('MoreDotsSvgComponent', () => {
  let component: MoreDotsSvgComponent;
  let fixture: ComponentFixture<MoreDotsSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreDotsSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreDotsSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
