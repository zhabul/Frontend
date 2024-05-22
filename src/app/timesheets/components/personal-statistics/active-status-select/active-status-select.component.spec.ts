import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveStatusSelectComponent } from './active-status-select.component';

describe('ActiveStatusSelectComponent', () => {
  let component: ActiveStatusSelectComponent;
  let fixture: ComponentFixture<ActiveStatusSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveStatusSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveStatusSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
