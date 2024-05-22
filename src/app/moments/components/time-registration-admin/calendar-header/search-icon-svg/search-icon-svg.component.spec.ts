import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIconSvgComponent } from './search-icon-svg.component';

describe('SearchIconSvgComponent', () => {
  let component: SearchIconSvgComponent;
  let fixture: ComponentFixture<SearchIconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchIconSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchIconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
