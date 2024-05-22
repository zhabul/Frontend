import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownForProjectComponent } from './dropdown-for-project.component';

describe('DropdownForProjectComponent', () => {
  let component: DropdownForProjectComponent;
  let fixture: ComponentFixture<DropdownForProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownForProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownForProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
