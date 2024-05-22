import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCloseComponent } from './svg-close.component';

describe('SvgCloseComponent', () => {
  let component: SvgCloseComponent;
  let fixture: ComponentFixture<SvgCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgCloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
