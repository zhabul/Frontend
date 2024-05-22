import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashCanIconSvgComponent } from './trash-can-icon-svg.component';

describe('TrashCanIconSvgComponent', () => {
  let component: TrashCanIconSvgComponent;
  let fixture: ComponentFixture<TrashCanIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashCanIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashCanIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
