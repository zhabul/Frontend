import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOfKsWeeklyComponent } from './data-of-ks-weekly.component';

describe('DataOfKsWeeklyComponent', () => {
  let component: DataOfKsWeeklyComponent;
  let fixture: ComponentFixture<DataOfKsWeeklyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataOfKsWeeklyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataOfKsWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
