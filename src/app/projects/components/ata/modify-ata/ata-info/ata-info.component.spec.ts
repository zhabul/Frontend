import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaInfoComponent } from './ata-info.component';

describe('AtaInfoComponent', () => {
  let component: AtaInfoComponent;
  let fixture: ComponentFixture<AtaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
