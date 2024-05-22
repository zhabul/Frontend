import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortnoxPropertiesComponent } from './fortnox-properties.component';

describe('FortnoxPropertiesComponent', () => {
  let component: FortnoxPropertiesComponent;
  let fixture: ComponentFixture<FortnoxPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FortnoxPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FortnoxPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
