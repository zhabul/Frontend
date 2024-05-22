import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderIconSvgComponent } from './folder-icon-svg.component';

describe('FolderIconSvgComponent', () => {
  let component: FolderIconSvgComponent;
  let fixture: ComponentFixture<FolderIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
