import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendIconSvgComponent } from './send-icon-svg.component';

describe('SendIconSvgComponent', () => {
  let component: SendIconSvgComponent;
  let fixture: ComponentFixture<SendIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
