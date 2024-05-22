import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownForDuComponent } from './dropdown-for-du.component';

describe('DropdownForDuComponent', () => {
  let component: DropdownForDuComponent;
  let fixture: ComponentFixture<DropdownForDuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownForDuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownForDuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
