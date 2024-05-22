import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFormatComponent } from './mobile-format.component';

describe('MobileFormatComponent', () => {
  let component: MobileFormatComponent;
  let fixture: ComponentFixture<MobileFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileFormatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
