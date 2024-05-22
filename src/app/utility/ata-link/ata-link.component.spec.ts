import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaLinkComponent } from './ata-link.component';

describe('AtaLinkComponent', () => {
  let component: AtaLinkComponent;
  let fixture: ComponentFixture<AtaLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtaLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtaLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
