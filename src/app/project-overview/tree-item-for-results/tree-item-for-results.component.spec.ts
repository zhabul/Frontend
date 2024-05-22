import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeItemForResultsComponent } from './tree-item-for-results.component';

describe('TreeItemForResultsComponent', () => {
  let component: TreeItemForResultsComponent;
  let fixture: ComponentFixture<TreeItemForResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeItemForResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeItemForResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
