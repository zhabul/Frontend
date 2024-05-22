import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIconWithParamsSvgComponent } from './add-icon-with-params-svg.component';

describe('AddIconWithParamsSvgComponent', () => {
  let component: AddIconWithParamsSvgComponent;
  let fixture: ComponentFixture<AddIconWithParamsSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIconWithParamsSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIconWithParamsSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
