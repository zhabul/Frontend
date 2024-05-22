import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentIconSvgComponent } from './sent-icon-svg.component';

describe('SentIconSvgComponent', () => {
  let component: SentIconSvgComponent;
  let fixture: ComponentFixture<SentIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
