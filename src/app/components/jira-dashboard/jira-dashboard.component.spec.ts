import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraDashboardComponent } from './jira-dashboard.component';

describe('JiraDashboardComponent', () => {
  let component: JiraDashboardComponent;
  let fixture: ComponentFixture<JiraDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JiraDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JiraDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
