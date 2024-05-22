import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertRowModalComponent } from './insert-row-modal.component';

describe('InsertRowModalComponent', () => {
  let component: InsertRowModalComponent;
  let fixture: ComponentFixture<InsertRowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertRowModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertRowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
