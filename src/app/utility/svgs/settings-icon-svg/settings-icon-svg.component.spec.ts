import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsIconSvgComponent } from './settings-icon-svg.component';



describe('SettingsIconSvgComponent', () => {
  let component: SettingsIconSvgComponent;
  let fixture: ComponentFixture<SettingsIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
