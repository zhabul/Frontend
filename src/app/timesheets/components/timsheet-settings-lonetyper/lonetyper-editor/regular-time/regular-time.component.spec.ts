import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularTimeComponent } from './regular-time.component';

describe('RegularStartTimeComponent', () => {
  let component: RegularTimeComponent;
  let fixture: ComponentFixture<RegularTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
