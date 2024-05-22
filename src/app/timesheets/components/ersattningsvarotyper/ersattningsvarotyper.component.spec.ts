import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErsattningsvarotyperComponent } from './ersattningsvarotyper.component';

describe('ErsattningsvarotyperComponent', () => {
  let component: ErsattningsvarotyperComponent;
  let fixture: ComponentFixture<ErsattningsvarotyperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErsattningsvarotyperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErsattningsvarotyperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
