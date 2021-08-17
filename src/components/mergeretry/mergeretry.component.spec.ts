import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeretryComponent } from './mergeretry.component';

describe('MergeretryComponent', () => {
  let component: MergeretryComponent;
  let fixture: ComponentFixture<MergeretryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeretryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeretryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
