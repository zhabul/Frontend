import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdArrowLeftSmComponent } from './sd-arrow-left-sm.component';

describe('SdArrowLeftSmComponent', () => {
  let component: SdArrowLeftSmComponent;
  let fixture: ComponentFixture<SdArrowLeftSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdArrowLeftSmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdArrowLeftSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
