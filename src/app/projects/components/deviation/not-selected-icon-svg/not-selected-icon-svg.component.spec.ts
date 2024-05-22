import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotSelectedIconSvgComponent } from './not-selected-icon-svg.component';

describe('NotSelectedIconSvgComponent', () => {
  let component: NotSelectedIconSvgComponent;
  let fixture: ComponentFixture<NotSelectedIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotSelectedIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotSelectedIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
