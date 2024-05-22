import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitAtaComponent } from './permit-ata.component';

describe('PermitAtaComponent', () => {
  let component: PermitAtaComponent;
  let fixture: ComponentFixture<PermitAtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitAtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
