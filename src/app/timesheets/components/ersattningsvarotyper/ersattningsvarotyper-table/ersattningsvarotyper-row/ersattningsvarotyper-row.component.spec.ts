import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErsattningsvarotyperRowComponent } from './ersattningsvarotyper-row.component';

describe('ErsattningsvarotyperRowComponent', () => {
  let component: ErsattningsvarotyperRowComponent;
  let fixture: ComponentFixture<ErsattningsvarotyperRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErsattningsvarotyperRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErsattningsvarotyperRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
