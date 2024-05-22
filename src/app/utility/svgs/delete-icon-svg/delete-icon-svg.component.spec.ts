import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIconSvgComponent } from './delete-icon-svg.component';

describe('DeleteIconSvgComponent', () => {
  let component: DeleteIconSvgComponent;
  let fixture: ComponentFixture<DeleteIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
