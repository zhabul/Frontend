import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAtaComponent } from './modify-ata.component';

describe('ModifyAtaComponent', () => {
  let component: ModifyAtaComponent;
  let fixture: ComponentFixture<ModifyAtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyAtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
