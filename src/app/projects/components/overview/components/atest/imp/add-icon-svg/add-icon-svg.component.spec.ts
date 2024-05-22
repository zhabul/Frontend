import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIconSvgComponent } from './add-icon-svg.component';

describe('AddIconSvgComponent', () => {
  let component: AddIconSvgComponent;
  let fixture: ComponentFixture<AddIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
