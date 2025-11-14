import { TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';


describe('TasksComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [TasksComponent] }));
  it('should create', () => {
    const fixture = TestBed.createComponent(TasksComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
