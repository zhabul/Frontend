import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderSvgComponent } from './folder-svg.component';

describe('FolderSvgComponent', () => {
  let component: FolderSvgComponent;
  let fixture: ComponentFixture<FolderSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
