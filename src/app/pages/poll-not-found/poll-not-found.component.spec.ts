import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollNotFoundComponent } from './poll-not-found.component';

describe('PollNotFoundComponent', () => {
  let component: PollNotFoundComponent;
  let fixture: ComponentFixture<PollNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
