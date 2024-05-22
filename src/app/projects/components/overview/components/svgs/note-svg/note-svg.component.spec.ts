import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSvgComponent } from './note-svg.component';

describe('NoteSvgComponent', () => {
  let component: NoteSvgComponent;
  let fixture: ComponentFixture<NoteSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
