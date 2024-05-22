import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorMoveSvgComponent } from './cursor-move-svg.component';

describe('CursorMoveSvgComponent', () => {
  let component: CursorMoveSvgComponent;
  let fixture: ComponentFixture<CursorMoveSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursorMoveSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursorMoveSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
