import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownProjectoverviewComponent } from './dropdown-projectoverview.component';

describe('DropdownProjectoverviewComponent', () => {
  let component: DropdownProjectoverviewComponent;
  let fixture: ComponentFixture<DropdownProjectoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownProjectoverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownProjectoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
