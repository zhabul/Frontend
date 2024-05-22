import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteSelectComponent } from './white-select.component';

describe('WhiteSelectComponent', () => {
  let component: WhiteSelectComponent;
  let fixture: ComponentFixture<WhiteSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhiteSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhiteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
