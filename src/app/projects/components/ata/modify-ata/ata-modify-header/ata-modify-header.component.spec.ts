import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaModifyHeaderComponent } from './ata-modify-header.component';

describe('AtaModifyHeaderComponent', () => {
  let component: AtaModifyHeaderComponent;
  let fixture: ComponentFixture<AtaModifyHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaModifyHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaModifyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
