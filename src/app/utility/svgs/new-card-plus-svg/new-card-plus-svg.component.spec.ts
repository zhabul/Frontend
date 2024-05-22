import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCardPlusSvgComponent } from './new-card-plus-svg.component';

describe('NewCardPlusSvgComponent', () => {
  let component: NewCardPlusSvgComponent;
  let fixture: ComponentFixture<NewCardPlusSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCardPlusSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCardPlusSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
