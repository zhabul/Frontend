import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaInfoTabsComponent } from './ata-info-tabs.component';

describe('AtaInfoTabsComponent', () => {
  let component: AtaInfoTabsComponent;
  let fixture: ComponentFixture<AtaInfoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaInfoTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaInfoTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
