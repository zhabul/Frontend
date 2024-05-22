import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortnoxReadmeComponent } from './fortnox-readme.component';

describe('FortnoxReadmeComponent', () => {
  let component: FortnoxReadmeComponent;
  let fixture: ComponentFixture<FortnoxReadmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FortnoxReadmeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FortnoxReadmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
