import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeListForResultsComponent } from './tree-list-for-results.component';

describe('TreeListForResultsComponent', () => {
  let component: TreeListForResultsComponent;
  let fixture: ComponentFixture<TreeListForResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeListForResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeListForResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
