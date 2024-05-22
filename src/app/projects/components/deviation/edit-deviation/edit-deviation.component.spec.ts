import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeviationComponent } from './edit-deviation.component';

describe('EditDeviationComponent', () => {
  let component: EditDeviationComponent;
  let fixture: ComponentFixture<EditDeviationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeviationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
