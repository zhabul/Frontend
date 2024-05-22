import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSvgIconComponent } from './download-svg-icon.component';

describe('DownloadSvgIconComponent', () => {
  let component: DownloadSvgIconComponent;
  let fixture: ComponentFixture<DownloadSvgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadSvgIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
