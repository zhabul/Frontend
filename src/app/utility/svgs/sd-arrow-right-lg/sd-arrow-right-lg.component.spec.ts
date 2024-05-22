import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdArrowRightLgComponent } from './sd-arrow-right-lg.component';

describe('SdArrowRightLgComponent', () => {
  let component: SdArrowRightLgComponent;
  let fixture: ComponentFixture<SdArrowRightLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdArrowRightLgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdArrowRightLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
