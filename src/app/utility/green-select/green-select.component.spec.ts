import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenSelectComponent } from './green-select.component';

describe('WhiteSelectComponent', () => {
  let component: GreenSelectComponent;
  let fixture: ComponentFixture<GreenSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreenSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
