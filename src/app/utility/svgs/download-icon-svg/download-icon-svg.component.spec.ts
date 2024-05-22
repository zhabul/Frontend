import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadIconSvgComponent } from './download-icon-svg.component';

describe('DownloadIconSvgComponent', () => {
  let component: DownloadIconSvgComponent;
  let fixture: ComponentFixture<DownloadIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
