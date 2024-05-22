import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSvgClientComponent } from './close-svg-client.component';

describe('CloseSvgClientComponent', () => {
  let component: CloseSvgClientComponent;
  let fixture: ComponentFixture<CloseSvgClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseSvgClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseSvgClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
