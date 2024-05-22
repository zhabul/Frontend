import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalStatisticsTableComponent } from './personal-statistics-table.component';

describe('PersonalStatisticsTableComponent', () => {
  let component: PersonalStatisticsTableComponent;
  let fixture: ComponentFixture<PersonalStatisticsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalStatisticsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalStatisticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
