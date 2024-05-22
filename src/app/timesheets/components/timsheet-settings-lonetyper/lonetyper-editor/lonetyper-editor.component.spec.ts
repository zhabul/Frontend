import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LonetyperEditorComponent } from './lonetyper-editor.component';

describe('LonetyperEditorComponent', () => {
  let component: LonetyperEditorComponent;
  let fixture: ComponentFixture<LonetyperEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LonetyperEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LonetyperEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
