import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSvgComponent } from './send-svg.component';

describe('SendSvgComponent', () => {
  let component: SendSvgComponent;
  let fixture: ComponentFixture<SendSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
