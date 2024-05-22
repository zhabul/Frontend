import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOfKsComponent } from './data-of-ks.component';

describe('DataOfKsComponent', () => {
  let component: DataOfKsComponent;
  let fixture: ComponentFixture<DataOfKsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataOfKsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataOfKsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
