import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSentOnlyComponent } from './svg-sent-only.component';

describe('SvgSentOnlyComponent', () => {
  let component: SvgSentOnlyComponent;
  let fixture: ComponentFixture<SvgSentOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgSentOnlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgSentOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
