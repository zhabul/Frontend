import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSuppliersComponent } from './selected-suppliers.component';

describe('SelectedSuppliersComponent', () => {
  let component: SelectedSuppliersComponent;
  let fixture: ComponentFixture<SelectedSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedSuppliersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
