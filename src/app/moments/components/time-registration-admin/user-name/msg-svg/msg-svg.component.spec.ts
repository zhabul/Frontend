import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgSvgComponent } from './msg-svg.component';

describe('MsgSvgComponent', () => {
  let component: MsgSvgComponent;
  let fixture: ComponentFixture<MsgSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
