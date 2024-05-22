import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErsattningsvarotyperEditorComponent } from './ersattningsvarotyper-editor.component';

describe('ErsattningsvarotyperEditorComponent', () => {
  let component: ErsattningsvarotyperEditorComponent;
  let fixture: ComponentFixture<ErsattningsvarotyperEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErsattningsvarotyperEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErsattningsvarotyperEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
