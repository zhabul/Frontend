import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineArticleComponent } from './line-article.component';

describe('LineArticleComponent', () => {
  let component: LineArticleComponent;
  let fixture: ComponentFixture<LineArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
