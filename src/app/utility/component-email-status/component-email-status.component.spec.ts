import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentEmailStatusComponent } from './component-email-status.component';

describe('ComponentEmailStatusComponent', () => {
  let component: ComponentEmailStatusComponent;
  let fixture: ComponentFixture<ComponentEmailStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentEmailStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentEmailStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
