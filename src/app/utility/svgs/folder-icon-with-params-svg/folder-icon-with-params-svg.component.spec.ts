import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderIconWithParamsSvgComponent } from './folder-icon-with-params-svg.component';

describe('FolderIconWithParamsSvgComponent', () => {
  let component: FolderIconWithParamsSvgComponent;
  let fixture: ComponentFixture<FolderIconWithParamsSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderIconWithParamsSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderIconWithParamsSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
