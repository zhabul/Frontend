import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIconSvgComponent } from './edit-icon-svg.component';

describe('EditIconSvgComponent', () => {
  let component: EditIconSvgComponent;
  let fixture: ComponentFixture<EditIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
