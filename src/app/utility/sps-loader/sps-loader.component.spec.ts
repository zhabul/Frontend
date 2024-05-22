import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpsLoaderComponent } from './sps-loader.component';

describe('SpsLoaderComponent', () => {
  let component: SpsLoaderComponent;
  let fixture: ComponentFixture<SpsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpsLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
