import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOfAtaComponent } from './data-of-ata.component';

describe('DataOfAtaComponent', () => {
  let component: DataOfAtaComponent;
  let fixture: ComponentFixture<DataOfAtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataOfAtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataOfAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
