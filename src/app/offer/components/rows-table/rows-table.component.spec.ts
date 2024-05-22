import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowsTableComponent } from './rows-table.component';

describe('RowsTableComponent', () => {
  let component: RowsTableComponent;
  let fixture: ComponentFixture<RowsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
