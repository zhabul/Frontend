import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertAllSvgComponent } from './revert-all-svg.component';

describe('RevertAllSvgComponent', () => {
  let component: RevertAllSvgComponent;
  let fixture: ComponentFixture<RevertAllSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevertAllSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevertAllSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
