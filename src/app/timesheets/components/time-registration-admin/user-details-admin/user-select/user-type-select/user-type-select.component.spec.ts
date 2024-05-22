import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeSelectComponent } from './user-type-select.component';

describe('UserTypeSelectComponent', () => {
  let component: UserTypeSelectComponent;
  let fixture: ComponentFixture<UserTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTypeSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
