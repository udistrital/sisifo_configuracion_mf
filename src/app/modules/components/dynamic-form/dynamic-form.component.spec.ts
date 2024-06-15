import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dynamicFormComponent } from './dynamic-form.component';

describe('dynamicFormComponent', () => {
  let component: dynamicFormComponent;
  let fixture: ComponentFixture<dynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [dynamicFormComponent]
    });
    fixture = TestBed.createComponent(dynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
