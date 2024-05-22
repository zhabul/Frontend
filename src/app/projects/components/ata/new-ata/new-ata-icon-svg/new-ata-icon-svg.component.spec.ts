import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAtaIconSvgComponent } from './new-ata-icon-svg.component';

describe('NewAtaIconSvgComponent', () => {
  let component: NewAtaIconSvgComponent;
  let fixture: ComponentFixture<NewAtaIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAtaIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAtaIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
