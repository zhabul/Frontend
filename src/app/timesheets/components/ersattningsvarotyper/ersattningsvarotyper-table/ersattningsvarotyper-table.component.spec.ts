import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErsattningsvarotyperTableComponent } from './ersattningsvarotyper-table.component';

describe('ErsattningsvarotyperTableComponent', () => {
  let component: ErsattningsvarotyperTableComponent;
  let fixture: ComponentFixture<ErsattningsvarotyperTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErsattningsvarotyperTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErsattningsvarotyperTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
