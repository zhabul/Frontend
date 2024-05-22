import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgStatusesComponent } from './svg-statuses.component';

describe('SvgStatusesComponent', () => {
  let component: SvgStatusesComponent;
  let fixture: ComponentFixture<SvgStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgStatusesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
