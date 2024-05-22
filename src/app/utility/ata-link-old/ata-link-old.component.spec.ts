import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaLinkOldComponent } from './ata-link-old.component';

describe('AtaLinkOldComponent', () => {
  let component: AtaLinkOldComponent;
  let fixture: ComponentFixture<AtaLinkOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaLinkOldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaLinkOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
