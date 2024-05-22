import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIconWithParamsSvgComponent } from './search-icon-with-params-svg.component';

describe('SearchIconWithParamsSvgComponent', () => {
  let component: SearchIconWithParamsSvgComponent;
  let fixture: ComponentFixture<SearchIconWithParamsSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchIconWithParamsSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchIconWithParamsSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
