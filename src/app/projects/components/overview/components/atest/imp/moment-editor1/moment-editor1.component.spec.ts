import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentEditor1Component } from './moment-editor1.component';

describe('MomentEditor1Component', () => {
  let component: MomentEditor1Component;
  let fixture: ComponentFixture<MomentEditor1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomentEditor1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomentEditor1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
