import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistMarkSvgComponent } from './exist-mark-svg.component';

describe('ExistMarkSvgComponent', () => {
  let component: ExistMarkSvgComponent;
  let fixture: ComponentFixture<ExistMarkSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistMarkSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistMarkSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
