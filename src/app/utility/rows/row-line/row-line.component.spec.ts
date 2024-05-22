import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowLineComponent } from './row-line.component';

describe('RowLineComponent', () => {
  let component: RowLineComponent;
  let fixture: ComponentFixture<RowLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
