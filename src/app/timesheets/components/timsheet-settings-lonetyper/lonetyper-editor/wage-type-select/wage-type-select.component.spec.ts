import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WageTypeSelectComponent } from './wage-type-select.component';

describe('WageTypeSelectComponent', () => {
  let component: WageTypeSelectComponent;
  let fixture: ComponentFixture<WageTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WageTypeSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WageTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
