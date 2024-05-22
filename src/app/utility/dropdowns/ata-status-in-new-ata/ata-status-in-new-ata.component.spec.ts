import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaStatusInNewAtaComponent } from './ata-status-in-new-ata.component';

describe('AtaStatusInNewAtaComponent', () => {
  let component: AtaStatusInNewAtaComponent;
  let fixture: ComponentFixture<AtaStatusInNewAtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtaStatusInNewAtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaStatusInNewAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
