import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSelectInTableComponent } from './simple-select-in-table.component';

describe('SimpleSelectInTableComponent', () => {
  let component: SimpleSelectInTableComponent;
  let fixture: ComponentFixture<SimpleSelectInTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleSelectInTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleSelectInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
