import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdArrowRightSmComponent } from './sd-arrow-right-sm.component';

describe('SdArrowRightSmComponent', () => {
  let component: SdArrowRightSmComponent;
  let fixture: ComponentFixture<SdArrowRightSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdArrowRightSmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdArrowRightSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
