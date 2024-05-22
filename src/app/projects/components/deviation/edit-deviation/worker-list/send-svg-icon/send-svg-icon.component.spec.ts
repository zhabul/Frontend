import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSvgIconComponent } from './send-svg-icon.component';

describe('SendSvgIconComponent', () => {
  let component: SendSvgIconComponent;
  let fixture: ComponentFixture<SendSvgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSvgIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
