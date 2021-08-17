import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MergeRetryComponent} from './merge-retry.component';

describe('MergeRetryComponent', () => {
  let component: MergeRetryComponent;
  let fixture: ComponentFixture<MergeRetryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MergeRetryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeRetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
