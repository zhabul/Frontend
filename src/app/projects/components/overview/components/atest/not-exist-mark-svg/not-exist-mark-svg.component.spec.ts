import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotExistMarkSvgComponent } from './not-exist-mark-svg.component';

describe('NotExistMarkSvgComponent', () => {
  let component: NotExistMarkSvgComponent;
  let fixture: ComponentFixture<NotExistMarkSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotExistMarkSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotExistMarkSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
