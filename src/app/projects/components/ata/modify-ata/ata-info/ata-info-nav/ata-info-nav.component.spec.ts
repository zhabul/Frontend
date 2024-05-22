import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaInfoNavComponent } from './ata-info-nav.component';

describe('AtaInfoNavComponent', () => {
  let component: AtaInfoNavComponent;
  let fixture: ComponentFixture<AtaInfoNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaInfoNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaInfoNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
