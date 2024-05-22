import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdArrowLeftLgComponent } from './sd-arrow-left-lg.component';

describe('SdArrowLeftLgComponent', () => {
  let component: SdArrowLeftLgComponent;
  let fixture: ComponentFixture<SdArrowLeftLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdArrowLeftLgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdArrowLeftLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
