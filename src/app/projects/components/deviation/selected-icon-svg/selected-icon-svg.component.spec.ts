import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedIconSvgComponent } from './selected-icon-svg.component';

describe('SelectedIconSvgComponent', () => {
  let component: SelectedIconSvgComponent;
  let fixture: ComponentFixture<SelectedIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
